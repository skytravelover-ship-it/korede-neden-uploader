#!/usr/bin/env python3
"""Copy finished posts from the 업로드_v3_N주차 folders into posts/<id>/.

Run after re-rendering or editing captions:  python3 build_posts.py

- Carousel: 01.png… → 01.jpg… (the Instagram API accepts JPEG only), caption.txt
- Reel: reel_final.mp4 → video.mp4, cover.png → cover.jpg, caption.txt
  Only a file named reel_final.mp4 is copied. The temporary-voice video
  (reel_임시음성_게시금지.mp4) is never copied, so it can never be published.
- comment.txt (optional first comment) is kept if you wrote one in posts/<id>/.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent  # older posts: 업로드_v3_N주차/ next to the repo; newer posts: studio/carousels/ inside it


def to_jpeg(png, jpg):
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "92",
                    str(png), "--out", str(jpg)], check=True, capture_output=True)


def main():
    cfg = json.loads((HERE / "posts.json").read_text(encoding="utf-8"))
    for p in cfg["posts"]:
        src = HERE / p["src"] if (HERE / p["src"]).is_dir() else ROOT / p["src"]
        out = HERE / "posts" / p["id"]
        if not src.is_dir():
            if list(out.glob("*.jpg")):
                print(f"[{p['id']}] 원본 폴더 없음, 이미 만든 posts/ 파일 유지")
                continue
            sys.exit(f"[{p['id']}] 폴더 없음: {src}")
        out.mkdir(parents=True, exist_ok=True)
        for old in list(out.glob("*.jpg")) + list(out.glob("*.mp4")):
            old.unlink()
        shutil.copy(src / "caption.txt", out / "caption.txt")
        if p["type"] == "carousel":
            pngs = sorted(src.glob("[0-9][0-9].png"))
            if not pngs:
                sys.exit(f"[{p['id']}] PNG 없음: {src}")
            for i, png in enumerate(pngs, 1):
                to_jpeg(png, out / f"{i:02d}.jpg")
            print(f"[{p['id']}] 캐러셀 {len(pngs)}장")
        else:
            to_jpeg(src / "cover.png", out / "cover.jpg")
            final = src / "reel_final.mp4"
            if final.exists():
                shutil.copy(final, out / "video.mp4")
                print(f"[{p['id']}] 릴스 영상 + 커버")
            else:
                print(f"[{p['id']}] 릴스 커버만 (녹음본 영상 reel_final.mp4 아직 없음)")


if __name__ == "__main__":
    main()
