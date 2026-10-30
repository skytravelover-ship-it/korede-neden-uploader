#!/usr/bin/env python3
"""Render one carousel (design B) from content.js.

Usage:  python3 studio/render.py <key> <post-id>
  key      the POSTS key in content.js (e.g. g)
  post-id  output folder: studio/carousels/<post-id>/01.png …
Also writes studio/carousels/<post-id>/sheet.png (all slides on one page) for review.
"""
import pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def shot(url, out, size):
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=1", f"--window-size={size}",
                    "--virtual-time-budget=8000", "--allow-file-access-from-files",
                    f"--screenshot={out}", url], check=True, capture_output=True)


def main():
    key, pid = sys.argv[1], sys.argv[2]
    n = int(subprocess.run(["node", "-e", f"eval(require('fs').readFileSync('{HERE / 'content.js'}','utf8')+';console.log(POSTS[\"{key}\"].length)')"],
                           check=True, capture_output=True, text=True).stdout)
    out = HERE / "carousels" / pid
    out.mkdir(parents=True, exist_ok=True)
    base = (HERE / "v3.html").as_uri()
    for i in range(1, n + 1):
        shot(f"{base}?v=B&p={key}&n={i}", out / f"{i:02d}.png", "1080,1350")
        print(f"{pid}/{i:02d}.png")
    html = out / "_sheet.html"
    html.write_text('<body style="margin:0;display:grid;grid-template-columns:repeat(3,540px);gap:6px;background:#888">'
                    + "".join(f'<img src="{i:02d}.png" style="width:540px">' for i in range(1, n + 1)), encoding="utf-8")
    rows = (n + 2) // 3
    shot(html.as_uri(), out / "sheet.png", f"1632,{rows * 681}")
    html.unlink()


if __name__ == "__main__":
    main()
