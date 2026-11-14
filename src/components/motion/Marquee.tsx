import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  label?: string;
}

/**
 * Infinite horizontal ticker. Content is duplicated for a seamless loop; the
 * duplicate is hidden from assistive tech. Pauses on hover and stops entirely
 * when the visitor prefers reduced motion (global CSS rule).
 */
export function Marquee({ children, className, duration = 40, reverse, label }: MarqueeProps) {
  return (
    <div className={cn("group relative flex overflow-hidden mask-fade-x", className)} role="marquee" aria-label={label}>
      <div
        className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : "normal" } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
