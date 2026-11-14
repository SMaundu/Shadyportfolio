import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent } from "react";
import { Media } from "@/components/media/Media";
import { getMedia } from "@/lib/media";
import type { MediaId } from "@/content/media.generated";

const PosterLightbox = lazy(() => import("./PosterLightbox"));

export interface Poster {
  id: MediaId;
  title: string;
}

interface PosterRingProps {
  posters: Poster[];
}

function useCardWidth() {
  const [w, setW] = useState(220);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setW(mq.matches ? 250 : 160);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return w;
}

/**
 * A curved, rotating 3D wall of posters (the viewer stands inside the ring, so
 * the wall bends towards the edges). Drag or use the arrows to spin it; click a
 * poster to open it full size. Auto-rotation stops for reduced-motion users,
 * on hover, while dragging and when the ring is off-screen.
 */
export function PosterRing({ posters }: PosterRingProps) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "200px" });
  const cardW = useCardWidth();
  const cardH = Math.round(cardW * 1.25);
  const n = posters.length;
  const step = 360 / n;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / n) + 14);

  const rotation = useMotionValue(0);
  const ringTransform = useTransform(rotation, (r) => `translateZ(${radius * 0.5}px) rotateY(${r}deg)`);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const drag = useRef({ active: false, startX: 0, startRot: 0, moved: 0, lastX: 0, lastT: 0, v: 0 });

  useAnimationFrame((_, delta) => {
    if (reduce || paused || !inView || drag.current.active || open !== null) return;
    rotation.set(rotation.get() - delta * 0.006);
  });

  const snapTo = (target: number) => animate(rotation, target, { type: "spring", stiffness: 90, damping: 20 });
  const nudge = (dir: 1 | -1) => snapTo(Math.round(rotation.get() / step) * step + dir * step);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    rotation.stop();
    drag.current = { active: true, startX: e.clientX, startRot: rotation.get(), moved: 0, lastX: e.clientX, lastT: performance.now(), v: 0 };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    const now = performance.now();
    d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;
    rotation.set(d.startRot + dx * 0.18);
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.moved > 4) {
      // Fling with inertia, then settle on the nearest poster.
      const projected = rotation.get() + d.v * 180;
      snapTo(Math.round(projected / step) * step);
    }
  };

  const openAt = (i: number) => {
    if (drag.current.moved > 6) return; // it was a drag, not a click
    setOpen(i);
  };

  return (
    <div>
      <div
        ref={stageRef}
        className="relative mx-auto h-[360px] w-full touch-pan-y select-none overflow-hidden md:h-[480px]"
        style={{ perspective: `${radius * 2}px`, perspectiveOrigin: "50% 50%" }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={() => {
          setPaused(false);
          onPointerUp();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-hidden
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12%] bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12%] bg-gradient-to-l from-background to-transparent" />
        <motion.div
          className="preserve-3d absolute left-1/2 top-1/2 cursor-grab active:cursor-grabbing"
          style={{ width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2, transform: ringTransform }}
        >
          {posters.map((p, i) => (
            <button
              key={p.id}
              type="button"
              tabIndex={-1}
              onClick={() => openAt(i)}
              className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] transition-[filter] duration-300 hover:brightness-110"
              style={{ transform: `rotateY(${i * step}deg) translateZ(${-radius}px)` }}
            >
              <Media id={p.id} alt="" sizes={`${cardW}px`} />
            </button>
          ))}
        </motion.div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => nudge(1)}
          className="grid h-12 w-12 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
          aria-label="Rotate posters left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
        >
          <Expand className="h-4 w-4" /> Open poster gallery ({n})
        </button>
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="grid h-12 w-12 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
          aria-label="Rotate posters right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Drag to spin · click a poster to view it full size</p>

      {open !== null && (
        <Suspense fallback={null}>
          <PosterLightbox
            open
            index={open}
            onClose={() => setOpen(null)}
            slides={posters
              .map((p) => ({ p, a: getMedia(p.id) }))
              .filter((x) => x.a)
              .map(({ p, a }) => ({
                src: Object.values(a!.srcs).at(-1)!,
                width: a!.w,
                height: a!.h,
                alt: p.title,
                srcSet: Object.entries(a!.srcs).map(([w, src]) => ({
                  src,
                  width: Number(w),
                  height: Math.round((a!.h * Number(w)) / a!.w),
                })),
              }))}
          />
        </Suspense>
      )}
    </div>
  );
}
