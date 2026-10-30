#!/usr/bin/env python3
"""Publish due carousels and reels to Instagram (@korede.neden) via the official Graph API.

Usage
  python3 publish.py --check             # validate files and show the schedule (no network)
  python3 publish.py --dry-run           # show what would be published now (no network)
  python3 publish.py                     # publish every due, reviewed, not-yet-published post
  python3 publish.py --only 01-hitap     # publish one reviewed post now, ignoring its time

Environment
  IG_USER_ID       Instagram professional account ID
  IG_ACCESS_TOKEN  access token
  IMAGE_BASE_URL   public URL where posts/ is served, e.g.
                   https://raw.githubusercontent.com/<user>/<repo>/main/posts
  IG_API_HOST      optional, default graph.instagram.com (graph.facebook.com for a Facebook Login /
                   system-user token; then reels are sent with the resumable upload)
  IG_API_VERSION   optional, default v23.0

A post is published only when "reviewed" is true in posts.json (native-speaker review done).
state.json records what was published, so a post is never published twice.
"""
import argparse
import json
import os
import re
import struct
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
STATE = HERE / "state.json"
MAX_JPEG = 8 * 1024 * 1024
MAX_VIDEO = 300 * 1024 * 1024   # Reels API limit
MAX_HASHTAGS = 5                # Instagram app limit since 2025
MAX_LATE_HOURS = 6  # never auto-publish a post more than this late (protects against a wrong launch_date)


def load_cfg():
    return json.loads((HERE / "posts.json").read_text(encoding="utf-8"))


def load_state():
    return json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}


def save_state(state):
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def tz(cfg):
    sign = 1 if cfg["timezone_utc_offset"][0] == "+" else -1
    h, m = cfg["timezone_utc_offset"][1:].split(":")
    return timezone(sign * timedelta(hours=int(h), minutes=int(m)))


def due_at(cfg, post):
    if not cfg.get("launch_date"):
        return None
    d = datetime.strptime(cfg["launch_date"], "%Y-%m-%d").date() + timedelta(days=post["day"])
    hh, mm = post["time"].split(":")
    return datetime(d.year, d.month, d.day, int(hh), int(mm), tzinfo=tz(cfg))


def jpeg_size(path):
    """Return (width, height) of a JPEG by reading its SOF marker."""
    with open(path, "rb") as f:
        if f.read(2) != b"\xff\xd8":
            raise ValueError("JPEG 아님")
        while True:
            marker, size = struct.unpack(">2sH", f.read(4))
            if marker[1] in (0xC0, 0xC1, 0xC2):
                f.read(1)
                h, w = struct.unpack(">HH", f.read(4))
                return w, h
            f.read(size - 2)


def mp4_info(path):
    """Return (top-level box order, duration in seconds or None)."""
    order, duration = [], None
    with open(path, "rb") as f:
        while True:
            head = f.read(8)
            if len(head) < 8:
                break
            size, kind = struct.unpack(">I4s", head)
            kind = kind.decode("latin-1")
            hdr = 8
            if size == 1:
                size, hdr = struct.unpack(">Q", f.read(8))[0], 16
            order.append(kind)
            if kind == "moov":
                body = f.read(size - hdr)
                i = body.find(b"mvhd")
                if i >= 4:
                    v = body[i + 4]
                    if v == 1:
                        ts, du = struct.unpack(">IQ", body[i + 24:i + 36])
                    else:
                        ts, du = struct.unpack(">II", body[i + 16:i + 24])
                    duration = du / ts if ts else None
            elif size == 0:
                break
            else:
                f.seek(size - hdr, 1)
    return order, duration


def read(folder, name):
    p = folder / name
    return p.read_text(encoding="utf-8").strip() if p.exists() else ""


def check_post(post):
    """Return (files, caption, comment, problems). files = images, or [video, cover] for a reel."""
    folder = HERE / "posts" / post["id"]
    caption, comment = read(folder, "caption.txt"), read(folder, "comment.txt")
    problems = []
    if post["type"] == "carousel":
        files = sorted(folder.glob("[0-9][0-9].jpg"))
        if not 2 <= len(files) <= 10:
            problems.append(f"이미지 {len(files)}장 (2~10장이어야 함)")
        for img in files:
            if img.stat().st_size > MAX_JPEG:
                problems.append(f"{img.name} 8MB 초과")
            w, h = jpeg_size(img)
            if not 0.8 - 1e-3 <= w / h <= 1.91:
                problems.append(f"{img.name} 비율 {w}x{h} (4:5~1.91:1)")
    elif post["type"] == "reel":
        video, cover = folder / "video.mp4", folder / "cover.jpg"
        files = [video, cover]
        if not video.exists():
            problems.append("녹음본 영상 없음 (원본 폴더에 reel_final.mp4를 넣고 build_posts.py 실행)")
        else:
            if video.stat().st_size > MAX_VIDEO:
                problems.append("영상 300MB 초과")
            order, dur = mp4_info(video)
            if "moov" in order and "mdat" in order and order.index("moov") > order.index("mdat"):
                problems.append("moov가 파일 앞에 없음 (ffmpeg -movflags +faststart 로 다시 저장)")
            if dur is None or not 3 <= dur <= 15 * 60:
                problems.append(f"영상 길이 {dur}초 (3초~15분)")
        if not cover.exists():
            problems.append("cover.jpg 없음")
    else:
        files = []
        problems.append(f"알 수 없는 type: {post['type']}")
    if not caption:
        problems.append("caption.txt 없음")
    if len(caption) > 2200:
        problems.append(f"캡션 {len(caption)}자 (2,200자 이하)")
    tags = len(re.findall(r"#\w", caption))
    if tags > MAX_HASHTAGS:
        problems.append(f"해시태그 {tags}개 ({MAX_HASHTAGS}개 이하)")
    return files, caption, comment, problems


class Api:
    def __init__(self):
        self.user = os.environ["IG_USER_ID"]
        self.token = os.environ["IG_ACCESS_TOKEN"]
        # Instagram-login tokens start with "IG" and only work on graph.instagram.com;
        # Facebook-login / system-user tokens (EAA…) only work on graph.facebook.com.
        if self.token.startswith("IG"):
            self.host = "graph.instagram.com"
        elif self.token.startswith("EAA"):
            self.host = "graph.facebook.com"
        else:
            self.host = os.environ.get("IG_API_HOST") or "graph.instagram.com"
        self.version = os.environ.get("IG_API_VERSION", "v23.0")
        self.base = f"https://{self.host}/{self.version}"

    def call(self, method, path, **params):
        params["access_token"] = self.token
        data = urllib.parse.urlencode(params).encode()
        url = f"{self.base}/{path}"
        if method == "GET":
            req = urllib.request.Request(f"{url}?{data.decode()}")
        else:
            req = urllib.request.Request(url, data=data, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"{method} {path} → {e.code} {e.read().decode()[:500]}") from None

    def wait_ready(self, container, tries=30, every=5):
        for _ in range(tries):
            status = self.call("GET", container, fields="status_code").get("status_code")
            if status == "FINISHED":
                return
            if status in ("ERROR", "EXPIRED"):
                raise RuntimeError(f"컨테이너 {container} 상태 {status}")
            time.sleep(every)
        raise RuntimeError(f"컨테이너 {container} 준비 시간 초과")

    def quota_left(self):
        r = self.call("GET", f"{self.user}/content_publishing_limit", fields="config,quota_usage")
        d = (r.get("data") or [{}])[0]
        return d.get("config", {}).get("quota_total", 50) - d.get("quota_usage", 0)

    def finish(self, container, comment):
        media = self.call("POST", f"{self.user}/media_publish", creation_id=container)["id"]
        comment_id = None
        if comment:
            comment_id = self.call("POST", f"{media}/comments", message=comment).get("id")
        link = self.call("GET", media, fields="permalink").get("permalink")
        return media, comment_id, link

    def publish_carousel(self, urls, caption, comment):
        children = []
        for u in urls:
            c = self.call("POST", f"{self.user}/media", image_url=u, is_carousel_item="true")["id"]
            self.wait_ready(c)
            children.append(c)
        parent = self.call("POST", f"{self.user}/media", media_type="CAROUSEL",
                           children=",".join(children), caption=caption)["id"]
        self.wait_ready(parent)
        return self.finish(parent, comment)

    def publish_reel(self, video_path, video_url, cover_url, caption, comment):
        params = dict(media_type="REELS", caption=caption, cover_url=cover_url, share_to_feed="true")
        if self.host == "graph.facebook.com":
            # Facebook Login token: send the file itself (no public video URL needed)
            c = self.call("POST", f"{self.user}/media", upload_type="resumable", **params)["id"]
            data = video_path.read_bytes()
            req = urllib.request.Request(
                f"https://rupload.facebook.com/ig-api-upload/{self.version}/{c}", data=data, method="POST",
                headers={"Authorization": f"OAuth {self.token}", "offset": "0", "file_size": str(len(data))})
            try:
                with urllib.request.urlopen(req, timeout=600) as r:
                    r.read()
            except urllib.error.HTTPError as e:
                raise RuntimeError(f"영상 업로드 → {e.code} {e.read().decode()[:500]}") from None
        else:
            c = self.call("POST", f"{self.user}/media", video_url=video_url, **params)["id"]
        self.wait_ready(c, tries=20, every=30)  # video processing: up to 10 minutes
        return self.finish(c, comment)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only")
    a = ap.parse_args()

    cfg, state = load_cfg(), load_state()
    now = datetime.now(timezone.utc)
    bad = False
    todo = []
    for p in cfg["posts"]:
        files, caption, comment, problems = check_post(p)
        when = due_at(cfg, p)
        done = p["id"] in state
        if done:
            tag = "게시됨"
        elif not p.get("reviewed"):
            tag = "검수 전 (올리지 않음)"
        elif when is None:
            tag = "시각 미정"
        else:
            tag = "대기" if when > now else "게시 시각 지남"
        size = f"{len(files)}장" if p["type"] == "carousel" else "릴스"
        print(f"{p['id']:16} {size:4} {when.strftime('%Y-%m-%d %H:%M') if when else '----------------'}  {tag}")
        for pr in problems:
            print(f"    ⚠ {pr}")
            bad = True
        if done or not p.get("reviewed"):
            if a.only == p["id"] and not done:
                print("    ⚠ reviewed가 false라서 올리지 않음 (검수 후 posts.json에서 true로)")
            continue
        if a.only and p["id"] == a.only:
            todo.append((p, files, caption, comment, problems))
        elif not a.only and when and when <= now:
            if now - when > timedelta(hours=MAX_LATE_HOURS):
                print(f"    ⚠ 게시 시각에서 {MAX_LATE_HOURS}시간 넘게 지나 자동 게시하지 않음 (--only {p['id']} 로 수동 게시)")
            else:
                todo.append((p, files, caption, comment, problems))

    if a.check:
        sys.exit(1 if bad else 0)
    if not todo:
        print("지금 올릴 게시물 없음")
        return

    base = os.environ.get("IMAGE_BASE_URL", "<IMAGE_BASE_URL>").rstrip("/")
    api = None if a.dry_run else Api()
    if api and api.quota_left() < len(todo):
        sys.exit("오늘 게시 한도가 부족합니다")
    for p, files, caption, comment, problems in todo:
        if problems:
            print(f"[{p['id']}] 문제가 있어 건너뜀")
            continue
        urls = [f"{base}/{p['id']}/{f.name}" for f in files]
        if a.dry_run:
            what = f"{len(urls)}장" if p["type"] == "carousel" else "릴스 영상+커버"
            print(f"\n[모의] {p['id']}: {what}, 캡션 {len(caption)}자, 첫 댓글 {'있음' if comment else '없음'}")
            print("   " + urls[0])
            continue
        if p["type"] == "carousel":
            media, comment_id, link = api.publish_carousel(urls, caption, comment)
        else:
            media, comment_id, link = api.publish_reel(files[0], urls[0], urls[1], caption, comment)
        state[p["id"]] = {"media_id": media, "comment_id": comment_id, "permalink": link,
                          "published_at": datetime.now(timezone.utc).isoformat(timespec="seconds")}
        save_state(state)
        print(f"[{p['id']}] 게시 완료 {link}")


if __name__ == "__main__":
    main()
