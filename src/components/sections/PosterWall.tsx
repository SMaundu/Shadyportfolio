import { Expand } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PosterRing, type Poster } from "@/components/work/PosterRing";
import { media, type MediaAsset, type MediaId } from "@/content/media.generated";

const PosterLightbox = lazy(() => import("@/components/work/PosterLightbox"));

/** Max posters per ring; the full set is always available in the gallery. */
const PER_RING = 24;

const titleFromId = (id: string) => {
  const s = id.split("/")[1].replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

type Shape = "square" | "portrait" | "landscape";
const shapeOf = (a: MediaAsset): Shape => {
  const r = a.w / a.h;
  if (r >= 0.93 && r <= 1.07) return "square";
  return r < 0.93 ? "portrait" : "landscape";
};

function usePosters() {
  return useMemo(() => {
    const groups: Record<Shape, Poster[]> = { square: [], portrait: [], landscape: [] };
    for (const [id, asset] of Object.entries(media as Record<string, MediaAsset>)) {
      if (!id.startsWith("posters/")) continue;
      groups[shapeOf(asset)].push({ id: id as MediaId, title: titleFromId(id) });
    }
    return groups;
  }, []);
}

export function PosterWall() {
  const { square, portrait } = usePosters();
  const all = useMemo(() => [...square, ...portrait], [square, portrait]);
  const [open, setOpen] = useState<number | null>(null);
  const openPoster = (p: Poster) => setOpen(Math.max(0, all.findIndex((x) => x.id === p.id)));

  const slides = useMemo(
    () =>
      all.map((p) => {
        const a = (media as Record<string, MediaAsset>)[p.id];
        const entries = Object.entries(a.srcs).sort((x, y) => Number(x[0]) - Number(y[0]));
        return {
          src: entries.at(-1)![1],
          width: a.w,
          height: a.h,
          alt: p.title,
          srcSet: entries.map(([w, src]) => ({ src, width: Number(w), height: Math.round((a.h * Number(w)) / a.w) })),
        };
      }),
    [all],
  );

  return (
    <section id="designs" aria-labelledby="designs-title" className="relative overflow-hidden py-24 md:py-28">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -z-10 h-[70%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.35),transparent_65%)]"
      />
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Graphic design</p>
            <h2 id="designs-title" className="section-heading mt-4">
              The poster <span className="text-highlight">wall</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-md">
            <p className="text-muted-foreground">
              Sermon series, campaigns, events and promotions for churches, campus groups, NGOs and businesses. Drag
              a row to spin it, or click any poster to see it full size.
            </p>
            <button
              type="button"
              onClick={() => setOpen(0)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              <Expand className="h-4 w-4" /> View all {all.length} posters
            </button>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-10 space-y-6" y={50} amount={0.1}>
        {square.length > 2 && (
          <PosterRing posters={square.slice(0, PER_RING)} shape="square" direction={-1} label="Square posts" onOpen={openPoster} />
        )}
        {portrait.length > 2 && (
          <PosterRing posters={portrait.slice(0, PER_RING)} shape="portrait" direction={1} label="Portrait posters" onOpen={openPoster} />
        )}
      </Reveal>

      {open !== null && (
        <Suspense fallback={null}>
          <PosterLightbox open index={open} onClose={() => setOpen(null)} slides={slides} />
        </Suspense>
      )}
    </section>
  );
}
