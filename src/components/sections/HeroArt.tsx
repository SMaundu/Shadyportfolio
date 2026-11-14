import { motion, useTransform, type MotionValue } from "framer-motion";
import { useId } from "react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Where the pen nib touches the drawing (end of the "/" stroke), in viewBox units. */
const TIP = { x: 262, y: 228 };

/** "</>" drawn as a pen-tool path: "<", then ">", then the "/" the nib is finishing. */
const CODE_PATH = "M170 40 L82 128 L170 216 M410 40 L498 128 L410 216 M330 26 L262 228";
const ANCHORS: [number, number][] = [
  [170, 40],
  [82, 128],
  [170, 216],
  [410, 40],
  [410, 216],
  [330, 26],
];
/** The selected anchor shows its bezier handles. */
const SELECTED = { x: 498, y: 128, handle: 54 };
const SELECTION = { x: 52, y: 6, w: 476, h: 242 };

/** Nib drawn pointing up with the tip at 0,0; placed and tilted onto TIP. */
const NIB = "M0 0C26 52 122 168 128 252L106 318V352H-106V318L-128 252C-122 168-26 52 0 0Z";
const NIB_SHADE = "M0 0C26 52 122 168 128 252L106 318V352H0Z";

interface HeroArtProps {
  /** Smoothed pointer position, -0.5..0.5 across the hero. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  reduce: boolean;
  className?: string;
}

/**
 * Hero illustration: a vector pen nib that has just drawn a "</>" code symbol,
 * with pen-tool anchors, a selected bezier handle and a selection box. Design
 * and code in one picture. The whole piece follows the cursor; the nib pivots
 * on its tip so it never leaves the stroke.
 */
export function HeroArt({ x, y, reduce, className }: HeroArtProps) {
  const rimId = `nib-rim-${useId().replace(/:/g, "")}`;
  const px = useTransform(x, (v) => v * -46);
  const py = useTransform(y, (v) => v * -46);
  const tilt = useTransform(x, (v) => v * 9);
  const cx = useTransform(x, (v) => v * 34);
  const cy = useTransform(y, (v) => v * 34);

  const t = (delay: number, duration = 0.6) => (reduce ? { duration: 0 } : { delay, duration, ease: EASE_OUT });

  return (
    <motion.div aria-hidden className={cn("pointer-events-none absolute aspect-[600/740]", className)} style={{ x: px, y: py }}>
      <svg
        viewBox="0 0 600 740"
        className="h-full w-full overflow-visible drop-shadow-[0_40px_70px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
        fill="none"
      >
        <defs>
          <linearGradient id={rimId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="0.28" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Selection box around the drawing */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(2, 0.8)}>
          <rect
            x={SELECTION.x}
            y={SELECTION.y}
            width={SELECTION.w}
            height={SELECTION.h}
            className="stroke-foreground/30"
            strokeWidth="1.5"
            strokeDasharray="8 8"
          />
          {[
            [SELECTION.x, SELECTION.y],
            [SELECTION.x + SELECTION.w, SELECTION.y],
            [SELECTION.x, SELECTION.y + SELECTION.h],
            [SELECTION.x + SELECTION.w, SELECTION.y + SELECTION.h],
          ].map(([hx, hy]) => (
            <rect
              key={`${hx}-${hy}`}
              x={hx - 6}
              y={hy - 6}
              width="12"
              height="12"
              rx="2"
              className="fill-background stroke-foreground/60"
              strokeWidth="1.5"
            />
          ))}
        </motion.g>

        {/* The "</>" stroke, drawn on load */}
        <motion.path
          d={CODE_PATH}
          className="stroke-background"
          strokeOpacity="0.55"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 0.6, duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d={CODE_PATH}
          className="stroke-primary"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 0.6, duration: 1.5, ease: "easeInOut" }}
        />

        {/* Anchor points and one selected bezier handle */}
        {ANCHORS.map(([ax, ay], i) => (
          <motion.rect
            key={`${ax}-${ay}`}
            x={ax - 8}
            y={ay - 8}
            width="16"
            height="16"
            className="fill-background stroke-primary"
            strokeWidth="3"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t(1.7 + i * 0.06, 0.4)}
          />
        ))}
        <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={t(2.1, 0.5)}>
          <line
            x1={SELECTED.x}
            y1={SELECTED.y - SELECTED.handle}
            x2={SELECTED.x}
            y2={SELECTED.y + SELECTED.handle}
            className="stroke-foreground/70"
            strokeWidth="2"
          />
          <circle cx={SELECTED.x} cy={SELECTED.y - SELECTED.handle} r="7" className="fill-background stroke-foreground/80" strokeWidth="2" />
          <circle cx={SELECTED.x} cy={SELECTED.y + SELECTED.handle} r="7" className="fill-background stroke-foreground/80" strokeWidth="2" />
          <rect x={SELECTED.x - 9} y={SELECTED.y - 9} width="18" height="18" className="fill-primary stroke-background" strokeWidth="2.5" />
        </motion.g>

        {/* Pen nib: slides in, then pivots on its tip with the cursor */}
        <g transform={`translate(${TIP.x} ${TIP.y}) rotate(-28)`}>
          <motion.g
            initial={reduce ? false : { opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 0.25, duration: 1.7, ease: EASE_OUT }}
          >
            <motion.g style={{ rotate: reduce ? 0 : tilt, originX: 0.5, originY: 0 }}>
              <path d={NIB} className="fill-background" />
              <path d={NIB_SHADE} className="fill-black/[0.07] dark:fill-black/40" />
              <path d={NIB} stroke={`url(#${rimId})`} strokeWidth="3" strokeLinejoin="round" />
              {/* Light catching the left face */}
              <path d="M-12 44C-30 80-60 124-76 156" className="stroke-primary/40" strokeWidth="3" strokeLinecap="round" />
              {/* Slit and breather hole */}
              <path d="M0 26V182" className="stroke-primary/40" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="204" r="19" className="fill-foreground/10 stroke-primary/40" strokeWidth="3" />
              {/* Grip */}
              <rect x="-118" y="362" width="236" height="44" rx="12" className="fill-background stroke-primary/35" strokeWidth="2" />
              <rect x="-96" y="416" width="192" height="96" rx="18" className="fill-background stroke-primary/25" strokeWidth="2" />
              <rect x="-96" y="416" width="96" height="96" rx="18" className="fill-white/[0.03]" />
              {/* Ink at the tip */}
              <circle cx="0" cy="0" r="7" className="fill-primary" />
            </motion.g>
          </motion.g>
        </g>

        {/* Selection cursor, on its own depth */}
        <motion.g style={reduce ? undefined : { x: cx, y: cy }}>
          <motion.path
            d="M0 0V38L10 28.5L18 45L25 41.5L17 25.5H30Z"
            transform="translate(536 160)"
            className="fill-foreground stroke-background"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t(2.3, 0.5)}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}
