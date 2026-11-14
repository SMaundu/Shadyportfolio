"""
Authoring-time asset pipeline for the portfolio.

Reads original artwork from the designer's local folders (D:/GRAPHICS etc.),
renders PDF / Illustrator pages, resizes everything to responsive WebP files in
public/media/ and writes src/content/media.generated.ts with dimensions and a
dominant colour for each image (used for layout-stable lazy loading).

The originals are NOT part of the repository; the generated files are. Run it
again whenever the media list below changes:

    pip install pillow pymupdf
    python scripts/assets/build_assets.py            # build
    python scripts/assets/build_assets.py --check    # only resolve source paths

Roots can be overridden with env vars GRAPHICS_DIR, REACT_DIR, PICS_DIR, QLESS_DIR.
"""
from __future__ import annotations

import glob
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

Image.MAX_IMAGE_PIXELS = None

REPO = Path(__file__).resolve().parents[2]
OUT_DIR = REPO / "public" / "media"
TS_OUT = REPO / "src" / "content" / "media.generated.ts"
CACHE_FILE = REPO / "scripts" / "assets" / ".cache.json"

ROOTS = {
    "G": os.environ.get("GRAPHICS_DIR", "D:/GRAPHICS"),
    "R": os.environ.get("REACT_DIR", "E:/React"),
    "P": os.environ.get("PICS_DIR", "E:/Pics"),
    "Q": os.environ.get("QLESS_DIR", "E:/QLESS"),
    "S": os.environ.get("SHOTS_DIR", str(REPO / "scripts" / "assets" / "shots")),
    "D": os.environ.get("DRIVE_DIR", "E:/React/drive-posters"),
}

# Kept deliberately small: faster first paint matters more than 4K sharpness.
PROFILES = {
    "cover": [480, 960, 1600],
    "gallery": [480, 960, 1440],
    "poster": [360, 720],
    "logo": [400, 800],
}
QUALITY = 72


@dataclass
class Item:
    id: str
    src: str  # "<root>:<relative glob>[#page]"
    profile: str = "gallery"
    max_px: int = 2400  # longest side used when rasterising vector pages
    optional: bool = False  # skip silently when the source does not exist yet


def M(id: str, src: str, profile: str = "gallery", **kw) -> Item:
    return Item(id, src, profile, **kw)


F2 = "G:Faithful Two/Designs/"
F2PKG = "G:Faithful Two/Faithful Two Logo Package/Logo Package/"
F2G = "G:Faithful Two/Docs/Faithful Two Brand Guideline.pdf"
FL = "G:Fliers/"
OPS = "G:Optimum Prime Solns/Posters/"
DES = "R:site-originals/"
AMP = "G:Docs/Amana Company Profile.pdf"
SUG = "G:Docs/Sugar Brochure Design.pdf"

def slug(filename: str) -> str:
    base = filename.rsplit("/", 1)[-1].rsplit(".", 1)[0].lower()
    out = "".join(c if c.isalnum() else "-" for c in base)
    while "--" in out:
        out = out.replace("--", "-")
    return out.strip("-")


# Poster wall: hand-picked from D:/GRAPHICS/Fliers (square and portrait).
POSTER_FILES = [
    # square
    "100k James.png", "Baptism Classes.png", "Benefits of Fearing God.png", "Coming to ATDF EN 03.png",
    "Coming to ATDF EN.png", "Compelled to Preach JKUATCU.png", "Cream_AUDITIONS.png",
    "Customer Service Week Cyrah.png", "Elements of the fear of God part 1.png",
    "Elements of the fear of God part 2.png", "GCF Quote of the Week.png", "GCF Thanks Giving Service.png",
    "Happy Birthday Cinta.png", "Head of Digital post Design for Boxraft.png", "Necessary Lie.jpg",
    "Power of the tongue GCF.png", "Prayer Service GCF Nov.png", "Prayer and Fasting GCF.png",
    "Prayer service GCF-25-July.png", "Prioritizing relationship GCF.png",
    "Relationships That Build Destiny-UET.png", "Seminars on Friday Taita taveta.png",
    "Soroptimist international nairobi central.png", "The foundation of wisdom GCF.png",
    "The widow and the judge JKUATCU.png", "UET 50 Challenge.png",
    "WTO How can more businesses benefit from AEO_.png", "WTO flyer 02.jpg", "Welcome to July 2026.png",
    "Welcome to Sep.png",
    # portrait
    "ATDF26-TCA-Part2-portrait-1080x1350.png", "Beyond outward religion GCF.png",
    "Character exposition-Daniel UET.png", "Consecrate Yourself GCF.png", "Customer Service Week Shady.png",
    "Faith that acts GCF.png", "Faith that endures GCF.png", "Faith that waits CF.png",
    "Family Sunday GCF.png", "Forgive Understanding forgiveness GCF.jpg",
    "God is working behind the scenes GCF.png", "Grace (is) not a license to sin GCF.png",
    "Grand Launch Victors Chapel.png", "Helpmate FLier.jpg", "I AM the door of the Sheep.png",
    "Interdenominational Worship Experience CFC.png", "Knowing God GCF.png",
    "Living waters chapel juja Poster.png", "Mt. Hebron Church Poster.png", "Offer Design.png",
    "Power to make wealth GCF.png", "Pre-Valentines Gala Dinner.jpg", "Street Evangelism UET.png",
    "TN 2026.png", "TN 2026 FINAL COUNTDOWN.png", "TN 2026 LIVE.png",
    "The Great Taita Taveta Mission Theme.png", "The Great Taita Taveta Mission Countdown.png",
    "Thank You Great Taita Taveta.png", "The Grace of Contentment GCF.jpg",
    "The gift you cannot earn GCF.png", "The Manifold Grace of God GCF1.png", "UET Retreat 2026.jpg",
    "When God circumcises the heart GCF.jpg", "Yelklin solutions Poster1.png", "Save the Date Mercy.png",
]

# Posters from the original site's folder (kept outside public/ as originals).
POSTER_ORIGINALS = [
    "Medical Camp 2.png", "TMA-Men's-Mental-Health-2026.png", "Mothers Day TMA Sq.png", "Inreach.png",
    "UET Cultural sunday2.png", "Shirts Sale.png", "Shadesign Ad2.png",
]

# Posters downloaded from the "Poster Designs" Google Drive folder (root "D:" = DRIVE_DIR).
DRIVE_POSTERS: list[str] = []


MEDIA: list[Item] = [
    # ---------------------------------------------------------------- site
    M("site/portrait", "P:Shady.jpg", "cover"),
    # ------------------------------------------------------- Faithful Two
    M("faithful-two/billboard", F2 + "Free Landscape City Billboard Mockup.jpg", "cover"),
    M("faithful-two/logo", F2PKG + "PNG/F2 Logo Full With Tagline.png", "logo"),
    M("faithful-two/geometry", F2 + "F2 Logo Geometry.jpg"),
    M("faithful-two/pattern", F2PKG + "JPG/F2 Logo Pattern Burgandy.jpg"),
    M("faithful-two/guide-cover", F2G + "#0"),
    M("faithful-two/guide-meaning", F2G + "#7"),
    M("faithful-two/guide-construction", F2G + "#8"),
    M("faithful-two/guide-patterns", F2G + "#13"),
    M("faithful-two/guide-type", F2G + "#15"),
    M("faithful-two/guide-colour", F2G + "#18"),
    M("faithful-two/guide-imagery", F2G + "#23"),
    M("faithful-two/stationery", F2 + "Letterhead & BS Card Mock up.png", "cover"),
    M("faithful-two/business-card", F2 + "BS Card Mock up.png"),
    M("faithful-two/mug", F2 + "Mug mockup.jpg"),
    M("faithful-two/notebook", F2 + "Notebook Mock up.jpg"),
    M("faithful-two/hoodie", F2 + "Hoodie Mock up.jpg"),
    M("faithful-two/tshirt", F2 + "T-Shirt Mock up F2.jpg"),
    M("faithful-two/polo", F2 + "Polo Closeup Mock up.jpg"),
    M("faithful-two/tote", F2 + "Handbag2 Mock up.png"),
    M("faithful-two/pencil", F2 + "Free Mechanical Pencil Mockup.jpg"),
    M("faithful-two/signage", F2 + "Free Vertical Logo Sign Board Mockup.jpg"),
    M("faithful-two/youtube", F2 + "Youtube Cover F2.png"),
    # ----------------------------------------------------- Amana Insights
    M("amana-insights/logo", "G:Logo/Amana Primary Logo.png", "logo"),
    M("amana-insights/mark", "G:Logo/Amana Logo Mark.png", "logo"),
    M("amana-insights/logo-dark", "G:Logo/Amana Logo Dark bg.png", "logo"),
    M("amana-insights/logo-orange", "G:Logo/Amana Logo Orangebg.png", "logo"),
    M("amana-insights/logo-white", "G:Logo/Amana Logo white.png", "logo"),
    M("amana-insights/logo-black", "G:Logo/Amana Logo black.png", "logo"),
    M("amana-insights/guide", "G:Logo/Amana Insights Logo Brand Guideline.pdf#0"),
    M("amana-insights/profile-cover", AMP + "#0"),
    M("amana-insights/profile-contents", AMP + "#1"),
    M("amana-insights/profile-about", AMP + "#2"),
    M("amana-insights/profile-mission", AMP + "#3"),
    M("amana-insights/profile-services", AMP + "#4"),
    M("amana-insights/profile-back", AMP + "#8"),
    M("amana-insights/letterhead", "G:Docs/Amana Letter Head.pdf#0"),
    # ------------------------------------------------------ AU Theme 2027
    M("au-2027/backdrop", "G:AU Theme 2027 Logo/Event backdrop Mock up.jpg", "cover"),
    M("au-2027/preview", "G:AU Theme 2027 Logo/Logo Package/Logo Preview.jpg"),
    M("au-2027/logo", "G:AU Theme 2027 Logo/Logo Package/AU 2027 Theme Primary Logo.png", "logo"),
    M("au-2027/rollup", "G:AU Theme 2027 Logo/Roll up Mock up.jpg"),
    M("au-2027/teardrop", "G:AU Theme 2027 Logo/Tear drop Mock up.jpg"),
    # ----------------------------------------------------- Selected logos
    M("logofolio/evie", "G:AI Illustrator/Evie Logo.ai#0", "logo"),
    M("logofolio/luxe", "G:Docs/Luxe Logo.pdf#0", "logo"),
    M("logofolio/decor", "G:AI Illustrator/Decor logo.ai#0", "logo"),
    M("logofolio/helpmate", "G:AI Illustrator/Helpmate Logo.ai#0", "logo"),
    M("logofolio/grace-community", FL + "THE GRACE COMMUNITY logo_1.png", "logo"),
    M("logofolio/sunday-school", FL + "JKUATCU Sunday School Logo.png", "logo"),
    M("logofolio/queensway", "G:Logo/Queensway Logo1.png", "logo"),
    M("logofolio/queensway-guide", "G:Logo/Queensway Logo Brand Guideline.pdf#0"),
    M("logofolio/myrtle", "G:Logo/myrtle Logo1.png", "logo"),
    M("logofolio/myrtle-board", "G:AI Illustrator/myrtle brand board.ai#0", max_px=3000),
    M("logofolio/kellian", "G:Docs/Kelian Logos.pdf#0", "logo"),
    M("logofolio/shadesigns", "G:Logo/Shadesigns Logos and Colors.png"),
    M("logofolio/yelklin-card", "G:Docs/Yelklin solutions Business Card.pdf#0"),
    # ------------------------------------------------- Optimum Prime / Tally
    *[
        M(f"optimum-prime/{n}", OPS + f, "poster")
        for n, f in [
            ("prime-1", "Prime 1.png"), ("tally-ad", "Tally Ad.png"), ("april-13", "April 13.png"),
            ("april-15", "April 15.png"), ("april-22", "April 22.png"), ("april-6", "April 6.png"),
            ("march-2", "March 2.png"), ("may-11", "May 11.png"), ("may-22", "May 22.png"),
            ("tally-2", "tally 2.png"), ("wed-11-3", "Wed 11-3.png"), ("mon-16-3", "Mon 16-3.png"),
            ("fri-20-3", "Fri 20-3.png"), ("follow", "Follow.png"), ("june-1", "June 1.png"),
            ("april-29", "April 29.png"), ("22nd-march", "22nd march.png"), ("madaraka", "Madaraka Day.png"),
        ]
    ],
    # ------------------------------------------------- GCF sermon series
    *[
        M(f"gcf/{n}", FL + f, "poster")
        for n, f in [
            ("faith-acts", "Faith that acts GCF.png"), ("faith-endures", "Faith that endures GCF.png"),
            ("faith-waits", "Faith that waits CF.png"), ("fear-1", "Elements of the fear of God part 1.png"),
            ("fear-2", "Elements of the fear of God part 2.png"), ("knowing-god", "Knowing God GCF.png"),
            ("tongue", "Power of the tongue GCF.png"), ("wealth", "Power to make wealth GCF.png"),
            ("family", "Family Sunday GCF.png"), ("thanksgiving", "GCF Thanks Giving Service.png"),
            ("forgive", "Forgive Understanding forgiveness GCF.jpg"),
            ("forgiven", "Forgiven people, Forgiving people GCF.jpg"),
            ("behind-scenes", "God is working behind the scenes GCF.png"),
            ("grace-licence", "Grace (is) not a license to sin GCF.png"), ("gift", "The gift you cannot earn GCF.png"),
            ("contentment", "The Grace of Contentment GCF.jpg"), ("prayer", "Prayer Service GCF Nov.png"),
            ("fundraising", "Fundraising Giving GCF.png"), ("quote", "GCF Quote of the Week.png"),
            ("verse", "GCF Verse of the Week.png"), ("consecrate", "Consecrate Yourself GCF.png"),
            ("beyond", "Beyond outward religion GCF.png"),
        ]
    ],
    M("gcf/screen", FL + "Faith that acts GCF Screen.png", "cover"),
    M("gcf/screen-2", FL + "God is working behind the scenes GCF Sc.png"),
    # ------------------------------------- Poster wall (graphic design)
    # Square / portrait classes are detected from each image's ratio in the front end.
    *[M(f"posters/{slug(f)}", FL + f, "poster") for f in POSTER_FILES],
    *[M(f"posters/{slug(f)}", DES + f, "poster") for f in POSTER_ORIGINALS],
    *[M(f"posters/{slug(f)}", "D:" + f, "poster", optional=True) for f in DRIVE_POSTERS],
]



# --------------------------------------------------------------------------
# Composite covers: built from already-optimised assets so portrait artwork
# reads well in landscape cards.
COMPOSITES: list[dict] = [
    {"id": "amana-insights/cover", "layout": "tiles", "bg": ("#f1eefb", "#e3ddf6"), "cols": 3,
     "items": ["amana-insights/logo", "amana-insights/mark", "amana-insights/logo-dark",
               "amana-insights/logo-orange", "amana-insights/logo-white", "amana-insights/logo-black"],
     "tiles": ["#ffffff", "#f7f5ff", "#1b1464", "#f7941d", "#1a1a1a", "#f4f2fb"]},
    {"id": "logofolio/cover", "layout": "grid", "bg": ("#f6efe6", "#efe4d6"), "cols": 3, "tile": "#ffffff",
     "items": ["logofolio/evie", "logofolio/queensway", "logofolio/decor", "logofolio/helpmate",
               "logofolio/myrtle", "logofolio/kellian"]},
    {"id": "optimum-prime/cover", "layout": "fan", "bg": ("#070b2e", "#1b2a9c"),
     "items": ["optimum-prime/april-13", "optimum-prime/tally-ad", "optimum-prime/prime-1",
               "optimum-prime/may-22", "optimum-prime/wed-11-3"]},
    {"id": "gcf/cover", "layout": "fan", "bg": ("#140505", "#4a1010"),
     "items": ["gcf/fear-1", "gcf/faith-endures", "gcf/faith-acts", "gcf/knowing-god", "gcf/thanksgiving"]},
]


def _largest(meta: dict) -> Image.Image:
    url = max(meta["srcs"].items(), key=lambda kv: int(kv[0]))[1]
    return Image.open(REPO / "public" / url.lstrip("/")).convert("RGBA")


def _gradient(size, c1, c2) -> Image.Image:
    w, h = size
    a = Image.new("RGB", (1, 2))
    a.putpixel((0, 0), tuple(int(c1[i:i + 2], 16) for i in (1, 3, 5)))
    a.putpixel((0, 1), tuple(int(c2[i:i + 2], 16) for i in (1, 3, 5)))
    return a.resize((w, h), Image.Resampling.BICUBIC).convert("RGBA")


def _rounded(im: Image.Image, r: int) -> Image.Image:
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    out = im.copy()
    out.putalpha(mask)
    return out


def _shadow_paste(canvas: Image.Image, im: Image.Image, xy, blur=28, offset=18, alpha=150):
    sh = Image.new("RGBA", (im.width + blur * 4, im.height + blur * 4), (0, 0, 0, 0))
    m = im.getchannel("A").point(lambda v: alpha if v > 0 else 0)
    sh.paste((0, 0, 0, 255), (blur * 2, blur * 2), m)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(sh, (int(xy[0] - blur * 2), int(xy[1] - blur * 2 + offset)))
    canvas.alpha_composite(im, (int(xy[0]), int(xy[1])))


def build_composite(spec: dict, media: dict) -> dict:
    W, H = 1920, 1200
    canvas = _gradient((W, H), *spec["bg"])
    imgs = [_largest(media[i]) for i in spec["items"]]
    layout = spec["layout"]
    if layout == "phones":
        ph = int(H * 0.72)
        n = len(imgs)
        widths = [int(ph * im.width / im.height) for im in imgs]
        gap = 70
        x = (W - sum(widths) - gap * (n - 1)) // 2
        for i, (im, w) in enumerate(zip(imgs, widths)):
            lift = -50 if i == n // 2 else 30
            r = _rounded(im.resize((w, ph), Image.Resampling.LANCZOS), 46)
            _shadow_paste(canvas, r, (x, (H - ph) // 2 + lift))
            x += w + gap
    elif layout == "pages":
        ph = int(H * 0.8)
        order = [0, 2, 1]  # side pages first, centre page on top
        for idx in order:
            im = imgs[idx]
            w = int(ph * im.width / im.height)
            page = im.resize((w, ph), Image.Resampling.LANCZOS)
            if idx != 1:
                ang = 7 if idx == 0 else -7
                page = page.rotate(ang, expand=True, resample=Image.Resampling.BICUBIC)
                cx = W // 2 + (-1 if idx == 0 else 1) * int(w * 0.72)
            else:
                cx = W // 2
            _shadow_paste(canvas, page, (cx - page.width // 2, (H - page.height) // 2 + (20 if idx != 1 else 0)))
    elif layout == "fan":
        n = len(imgs)
        ph = int(H * 0.66)
        for k in sorted(range(n), key=lambda i: -abs(i - n // 2)):
            im = imgs[k]
            w = int(ph * im.width / im.height)
            card = _rounded(im.resize((w, ph), Image.Resampling.LANCZOS), 26)
            off = k - n // 2
            card = card.rotate(-off * 6, expand=True, resample=Image.Resampling.BICUBIC)
            cx = W // 2 + off * int(W * 0.17)
            cy = H // 2 + abs(off) * 40
            scale = 1.0 if off == 0 else 0.92
            if scale != 1.0:
                card = card.resize((int(card.width * scale), int(card.height * scale)), Image.Resampling.LANCZOS)
            _shadow_paste(canvas, card, (cx - card.width // 2, cy - card.height // 2))
    elif layout == "tiles":
        cols = spec.get("cols", 3)
        rows = (len(imgs) + cols - 1) // cols
        pad, gap = 110, 30
        tw = (W - 2 * pad - gap * (cols - 1)) // cols
        th = (H - 2 * pad - gap * (rows - 1)) // rows
        for i, im in enumerate(imgs):
            r, c = divmod(i, cols)
            tile = Image.new("RGBA", (tw, th), spec["tiles"][i])
            fit = im.copy()
            fit.thumbnail((int(tw * 0.74), int(th * 0.66)), Image.Resampling.LANCZOS)
            tile.alpha_composite(fit, ((tw - fit.width) // 2, (th - fit.height) // 2))
            tile = _rounded(tile, 26)
            _shadow_paste(canvas, tile, (pad + c * (tw + gap), pad + r * (th + gap)), blur=18, offset=10, alpha=55)
    elif layout == "grid":
        cols = spec.get("cols", 3)
        rows = (len(imgs) + cols - 1) // cols
        pad, gap = 120, 36
        tw = (W - 2 * pad - gap * (cols - 1)) // cols
        th = (H - 2 * pad - gap * (rows - 1)) // rows
        for i, im in enumerate(imgs):
            r, c = divmod(i, cols)
            tile = Image.new("RGBA", (tw, th), spec.get("tile", "#ffffff"))
            fit = im.copy()
            fit.thumbnail((int(tw * 0.78), int(th * 0.78)), Image.Resampling.LANCZOS)
            tile.alpha_composite(fit, ((tw - fit.width) // 2, (th - fit.height) // 2))
            tile = _rounded(tile, 28)
            _shadow_paste(canvas, tile, (pad + c * (tw + gap), pad + r * (th + gap)), blur=18, offset=10, alpha=60)

    canvas = canvas.convert("RGB")
    out_base = OUT_DIR / spec["id"]
    out_base.parent.mkdir(parents=True, exist_ok=True)
    srcs = {}
    for w in PROFILES["cover"]:
        h = round(H * w / W)
        fn = f"{out_base.name}-{w}.webp"
        canvas.resize((w, h), Image.Resampling.LANCZOS).save(out_base.parent / fn, "WEBP", quality=QUALITY, method=6)
        srcs[str(w)] = f"/media/{spec['id'].rsplit('/', 1)[0]}/{fn}"
    print(f"  composite {spec['id']}")
    return {"w": W, "h": H, "color": dominant(canvas), "alpha": False, "srcs": srcs}


# --------------------------------------------------------------------------
def resolve(spec: str) -> tuple[str, int | None]:
    page = None
    if "#" in spec:
        spec, p = spec.rsplit("#", 1)
        page = int(p)
    root, rel = spec.split(":", 1)
    pattern = os.path.join(ROOTS[root], rel)
    hits = sorted(glob.glob(glob.escape(pattern)))
    if len(hits) != 1:
        raise FileNotFoundError(f"{spec!r} matched {len(hits)} files")
    return hits[0], page


def load(path: str, page: int | None, max_px: int) -> Image.Image:
    ext = path.lower().rsplit(".", 1)[-1]
    if ext in ("pdf", "ai"):
        import fitz  # PyMuPDF

        doc = fitz.open(path)
        pg = doc[page or 0]
        zoom = max_px / max(pg.rect.width, pg.rect.height)
        pix = pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    if im.mode in ("P", "LA", "L"):
        im = im.convert("RGBA")
    return im


def has_alpha(im: Image.Image) -> bool:
    if im.mode != "RGBA":
        return False
    lo, _ = im.getchannel("A").getextrema()
    return lo < 250


def dominant(im: Image.Image) -> str:
    small = im.convert("RGB").resize((1, 1), Image.Resampling.BOX)
    r, g, b = small.getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def build_one(item: Item, cache: dict) -> dict | None:
    try:
        path, page = resolve(item.src)
    except FileNotFoundError:
        if item.optional:
            print(f"  skip (optional, missing): {item.id}")
            return None
        raise
    widths = PROFILES[item.profile]
    key = f"{path}#{page}|{os.path.getmtime(path)}|{widths}|{QUALITY}|{item.max_px}"
    out_base = OUT_DIR / item.id
    cached = cache.get(item.id)
    if cached and cached.get("key") == key and all(Path(REPO / "public" / s.lstrip("/")).exists() for s in cached["meta"]["srcs"].values()):
        return cached["meta"]

    im = load(path, page, item.max_px)
    alpha = has_alpha(im)
    im = im.convert("RGBA" if alpha else "RGB")
    out_base.parent.mkdir(parents=True, exist_ok=True)
    srcs: dict[str, str] = {}
    w0, h0 = im.size
    used = [w for w in widths if w < w0] or [w0]
    if w0 > used[-1] and len(used) < len(widths):
        used.append(min(w0, widths[len(used)]))
    for w in used:
        h = round(h0 * w / w0)
        res = im if w == w0 else im.resize((w, h), Image.Resampling.LANCZOS)
        fn = f"{out_base.name}-{w}.webp"
        res.save(out_base.parent / fn, "WEBP", quality=QUALITY, method=6)
        srcs[str(w)] = f"/media/{item.id.rsplit('/', 1)[0]}/{fn}"
    meta = {
        "w": used[-1],
        "h": round(h0 * used[-1] / w0),
        "color": dominant(im),
        "alpha": alpha,
        "srcs": srcs,
    }
    cache[item.id] = {"key": key, "meta": meta}
    print(f"  built {item.id} {meta['w']}x{meta['h']}")
    return meta


def build_og(mid: str, meta: dict) -> str:
    out = OUT_DIR / f"{mid}-og.jpg"
    url = f"/media/{mid}-og.jpg"
    if out.exists() and out.stat().st_mtime >= max(
        (REPO / "public" / u.lstrip("/")).stat().st_mtime for u in meta["srcs"].values()
    ):
        return url
    im = _largest(meta).convert("RGB")
    im = ImageOps.fit(im, (1200, 630), Image.Resampling.LANCZOS, centering=(0.5, 0.4))
    im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    return url


def write_ts(media: dict[str, dict]) -> None:
    lines = [
        "// AUTO-GENERATED by scripts/assets/build_assets.py - do not edit by hand.",
        "export interface MediaAsset {",
        "  w: number;",
        "  h: number;",
        "  color: string;",
        "  alpha: boolean;",
        "  srcs: Record<string, string>;",
        "  /** 1200x630 JPEG for social link previews (covers only). */",
        "  og?: string;",
        "}",
        "",
        "export const media = " + json.dumps(media, indent=2) + " as const satisfies Record<string, MediaAsset>;",
        "",
        "export type MediaId = keyof typeof media;",
        "",
    ]
    TS_OUT.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    check = "--check" in sys.argv
    if check:
        bad = 0
        for it in MEDIA:
            try:
                resolve(it.src)
            except FileNotFoundError as e:
                if not it.optional:
                    bad += 1
                print("MISSING", it.id, e)
        print(f"{len(MEDIA)} items, {bad} missing")
        sys.exit(1 if bad else 0)

    ids = [m.id for m in MEDIA]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        raise SystemExit(f"duplicate ids: {dupes}")
    cache = json.loads(CACHE_FILE.read_text()) if CACHE_FILE.exists() else {}
    media: dict[str, dict] = {}
    for it in MEDIA:
        meta = build_one(it, cache)
        if meta:
            media[it.id] = meta
    for spec in COMPOSITES:
        media[spec["id"]] = build_composite(spec, media)
    # Social preview images (JPEG, 1200x630) for every cover-sized asset.
    cover_ids = [m.id for m in MEDIA if m.profile == "cover"] + [c["id"] for c in COMPOSITES]
    for mid in cover_ids:
        if mid in media:
            media[mid]["og"] = build_og(mid, media[mid])
    CACHE_FILE.write_text(json.dumps(cache, indent=1))
    write_ts(media)
    total = sum(f.stat().st_size for f in OUT_DIR.rglob("*.webp"))
    print(f"{len(media)} assets, {total / 1e6:.1f} MB in public/media")


if __name__ == "__main__":
    main()
