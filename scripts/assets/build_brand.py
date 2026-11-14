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
MONT_DIR = Path(os.environ.get("MONT_DIR", "D:/GRAPHICS/Fonts/mont-font-family/Mont Font Family"))
MONT_HEAVY = MONT_DIR / "Fontfabric - Mont Heavy DEMO.otf"
MONT_LIGHT = MONT_DIR / "Fontfabric - Mont ExtraLight DEMO.otf"

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
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -20 748 786" fill="#F7A306">{paths}</svg>\n'


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

    mark = draw_mark(96, GOLD, pad=0.0)
    im.paste(mark, (72, 52), mark)
    d.text((188, 66), "Shadesigns", font=font(MONT_HEAVY, 36), fill=CREAM)
    d.text((188, 112), "Designs That Convert", font=font(MONT_LIGHT, 24), fill=(215, 200, 190))

    d.text((68, 282), "Hey, I'm a", font=font(MONT_LIGHT, 44), fill=CREAM, anchor="ls")
    big = font(MONT_HEAVY, 104)
    d.text((64, 392), "CREATIVE", font=big, fill=CREAM, anchor="ls")
    d.text((64, 498), "DESIGNER", font=big, fill=GOLD, anchor="ls")
    d.rectangle((72, 540, 132, 544), fill=GOLD)
    d.text((150, 552), "Shadrack Maundu  ·  Designer & Software Developer", font=font(MONT_LIGHT, 26), fill=CREAM, anchor="ls")
    im.save(dst, "JPEG", quality=88, optimize=True, progressive=True)


def main() -> None:
    PUBLIC.mkdir(exist_ok=True)
    (PUBLIC / "brand").mkdir(exist_ok=True)
    (PUBLIC / "cv").mkdir(exist_ok=True)

    (PUBLIC / "favicon.svg").write_text(svg_mark(), encoding="utf-8")
    (PUBLIC / "brand" / "s-mark.svg").write_text(svg_mark(), encoding="utf-8")
    ico = draw_mark(64, GOLD, BURGUNDY, pad=0.14)
    ico.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    draw_mark(180, GOLD, BURGUNDY, pad=0.2).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    draw_mark(192, GOLD, BURGUNDY, pad=0.22).save(PUBLIC / "icon-192.png")
    draw_mark(512, GOLD, BURGUNDY, pad=0.22).save(PUBLIC / "icon-512.png")

    og_image(PUBLIC / "og-image.jpg")

    shutil.copyfile(CV_DESIGN, PUBLIC / "cv" / "Shadrack-Maundu-Graphic-Design-CV.pdf")
    shutil.copyfile(CV_DEV, PUBLIC / "cv" / "Shadrack-Maundu-Software-Developer-CV.pdf")
    print("brand assets written to", PUBLIC)


if __name__ == "__main__":
    main()
