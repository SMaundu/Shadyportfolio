"""
Generates brand assets in public/: favicons, web-app icons, the Open Graph
image, light/dark versions of the Shadesigns horizontal logo and the CV PDFs.

    python scripts/assets/build_brand.py

Sources: E:/React/Logos (logo PNGs), the two CV PDFs, the hero portrait.
"""
from __future__ import annotations

import os
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

REPO = Path(__file__).resolve().parents[2]
PUBLIC = REPO / "public"
LOGOS = Path(os.environ.get("LOGOS_DIR", "E:/React/Logos"))
CV_DESIGN = Path(os.environ.get("CV_DESIGN", "E:/React/Shadrack-Maundu-Graphics-Design-CV.pdf"))
CV_DEV = Path(
    os.environ.get("CV_DEV", "C:/Users/user/OneDrive/Documents/PERSONAL/Shadrack-Maundu-Software-Developer-CV.pdf")
)
FONTS = REPO / "node_modules"

RED = (238, 37, 36)  # Shadesigns mark
GOLD = (247, 163, 6)
BURGUNDY = (106, 20, 20)
INK = (13, 6, 6)
CREAM = (243, 238, 232)

# The Shadesigns "S" mark, traced from the official logo (viewBox 0 0 668 746).
S_MARK = [
    [(190, 0), (668, 0), (558, 124), (246, 124), (178, 201), (178, 287), (387, 497), (217, 497), (53, 333), (53, 155)],
    [(281, 249), (451, 249), (614, 413), (614, 590), (478, 746), (0, 746), (110, 621), (423, 621), (491, 545), (491, 459)],
]
S_W, S_H = 668, 746


def draw_mark(size: int, fg, bg=None, pad: float = 0.16) -> Image.Image:
    """Render the S mark centred on a square canvas (supersampled for crisp edges)."""
    ss = 4
    big = size * ss
    im = Image.new("RGBA", (big, big), bg + (255,) if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    inner = big * (1 - 2 * pad)
    scale = inner / max(S_W, S_H)
    ox = (big - S_W * scale) / 2
    oy = (big - S_H * scale) / 2
    for poly in S_MARK:
        d.polygon([(ox + x * scale, oy + y * scale) for x, y in poly], fill=fg + (255,))
    return im.resize((size, size), Image.Resampling.LANCZOS)


def svg_mark() -> str:
    paths = "".join(
        f'<path d="M{" L".join(f"{x} {y}" for x, y in poly)}Z"/>' for poly in S_MARK
    )
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -20 748 786" fill="#EE2524">{paths}</svg>\n'


def recolour_logo(src: Path, dst_light: Path, dst_dark: Path, width: int = 1400) -> None:
    im = Image.open(src).convert("RGBA")
    im = im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)
    im.save(dst_light, "WEBP", quality=90, method=6)
    # Dark-background version: brown wordmark -> warm white, red stays (as on the brand sheet).
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a and r < 140 and g < 90:  # brown family (#542404)
                px[x, y] = (*CREAM, a)
    im.save(dst_dark, "WEBP", quality=90, method=6)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def og_image(dst: Path) -> None:
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), INK)
    glow = Image.new("RGB", (W, H), INK)
    gd = ImageDraw.Draw(glow)
    gd.ellipse((560, -260, 1460, 640), fill=BURGUNDY)
    gd.ellipse((820, 260, 1240, 700), fill=(150, 80, 6))
    glow = glow.filter(ImageFilter.GaussianBlur(140))
    im = Image.blend(im, glow, 0.85)
    d = ImageDraw.Draw(im)
    # subtle grid
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(28, 16, 16), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(28, 16, 16), width=1)

    anton = FONTS / "@fontsource/anton/files/anton-latin-400-normal.woff"
    mark = draw_mark(96, RED, pad=0.0)
    im.paste(mark, (72, 52), mark)
    d.text((188, 66), "SHADESIGNS", font=font(anton, 34), fill=CREAM)
    d.text((188, 106), "DESIGNS THAT CONVERT", font=font(anton, 22), fill=(190, 170, 160))

    big = font(anton, 132)
    d.text((68, 300), "SHADRACK", font=big, fill=CREAM, anchor="ls")
    d.text((68, 450), "MAUNDU", font=big, fill=GOLD, anchor="ls")
    d.rectangle((72, 520, 132, 524), fill=GOLD)
    d.text((150, 534), "CREATIVE DESIGNER  |  SOFTWARE DEVELOPER", font=font(anton, 30), fill=CREAM, anchor="ls")
    im.save(dst, "JPEG", quality=88, optimize=True, progressive=True)


def main() -> None:
    PUBLIC.mkdir(exist_ok=True)
    (PUBLIC / "brand").mkdir(exist_ok=True)
    (PUBLIC / "cv").mkdir(exist_ok=True)

    (PUBLIC / "favicon.svg").write_text(svg_mark(), encoding="utf-8")
    (PUBLIC / "brand" / "s-mark.svg").write_text(svg_mark(), encoding="utf-8")
    ico = draw_mark(64, RED, pad=0.06)
    ico.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    draw_mark(180, CREAM, BURGUNDY, pad=0.2).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    draw_mark(192, CREAM, BURGUNDY, pad=0.22).save(PUBLIC / "icon-192.png")
    draw_mark(512, CREAM, BURGUNDY, pad=0.22).save(PUBLIC / "icon-512.png")

    recolour_logo(
        LOGOS / "Horizontal Logo.png",
        PUBLIC / "brand" / "shadesigns-horizontal.webp",
        PUBLIC / "brand" / "shadesigns-horizontal-dark.webp",
    )
    og_image(PUBLIC / "og-image.jpg")

    shutil.copyfile(CV_DESIGN, PUBLIC / "cv" / "Shadrack-Maundu-Graphic-Design-CV.pdf")
    shutil.copyfile(CV_DEV, PUBLIC / "cv" / "Shadrack-Maundu-Software-Developer-CV.pdf")
    print("brand assets written to", PUBLIC)


if __name__ == "__main__":
    main()
