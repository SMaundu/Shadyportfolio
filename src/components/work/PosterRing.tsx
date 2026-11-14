import { animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Media } from "@/components/media/Media";
import type { MediaId } from "@/content/media.generated";
import { getMedia } from "@/lib/media";

export interface Poster {
  id: MediaId;
  title: string;
}

interface PosterRingProps {
  posters: Poster[];
  /** Card shape: every poster in a ring shares the same frame. */
  shape: "square" | "portrait";
  /** Spin direction for auto-rotation. */
  direction?: 1 | -1;
  label: string;
  onOpen: (poster: Poster) => void;
}

const RATIO = { square: 1, portrait: 4 / 3 } as const;

const widthFor = (shape: "square" | "portrait", wide: boolean) =>
  wide ? (shape === "square" ? 230 : 220) : shape === "square" ? 140 : 135;

function useCardWidth(shape: "square" | "portrait") {
  // Read the breakpoint synchronously so the stage height never jumps after mount.
  const [w, setW] = useState(() =>
    widthFor(shape, typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches),
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setW(widthFor(shape, mq.matches));
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [shape]);
  return w;
}

/**
 * A curved, rotating 3D row of posters (the viewer stands inside the ring, so
 * the wall bends towards the edges). Drag or use the arrows to spin; click a
 * poster to view it full size. Auto-rotation stops for reduced motion, on
 * hover, while dragging and when off-screen.
 */
export function PosterRing({ posters, shape, direction = -1, label, onOpen }: PosterRingProps) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "100px" });
  // Start loading images well before the ring scrolls into view.
  const near = useInView(stageRef, { margin: "1200px", once: true });
  const cardW = useCardWidth(shape);
  const cardH = Math.round(cardW * RATIO[shape]);
  const n = posters.length;
  const step = 360 / n;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / n) + 12);

  const rotation = useMotionValue(0);
  const ringTransform = useTransform(rotation, (r) => `translateZ(${radius * 0.5}px) rotateY(${r}deg)`);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ active: false, startX: 0, startRot: 0, moved: 0, lastX: 0, lastT: 0, v: 0 });

  useAnimationFrame((_, delta) => {
    if (reduce || paused || !inView || drag.current.active) return;
    rotation.set(rotation.get() + direction * delta * 0.005);
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
    rotation.set(d.startRot + dx * 0.16);
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.moved > 4) snapTo(Math.round((rotation.get() + d.v * 160) / step) * step);
  };

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative mx-auto w-full touch-pan-y select-none overflow-hidden"
        style={{ height: Math.round(cardH * 1.3) + 16, perspective: `${radius * 2}px` }}
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
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[10%] bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[10%] bg-gradient-to-l from-background to-transparent" />
        <motion.div
          className="preserve-3d absolute left-1/2 top-1/2 cursor-grab active:cursor-grabbing"
          style={{ width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2, transform: ringTransform }}
        >
          {posters.map((p, i) => (
            <button
              key={p.id}
              type="button"
              tabIndex={-1}
              onClick={() => drag.current.moved <= 6 && onOpen(p)}
              className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] transition-[filter] duration-300 hover:brightness-110"
              style={{ transform: `rotateY(${i * step}deg) translateZ(${-radius}px)`, backgroundColor: getMedia(p.id)?.color }}
            >
              {near && <Media id={p.id} alt="" sizes={`${cardW * 2}px`} eager />}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => nudge(1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
          aria-label={`${label}: rotate left`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-28 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label} · {n}
        </span>
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
          aria-label={`${label}: rotate right`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
