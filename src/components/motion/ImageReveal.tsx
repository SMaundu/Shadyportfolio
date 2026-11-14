import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Reveals media with a curtain that slides off it. The image itself is never
 * masked or hidden (no clip-path / opacity on its ancestors), so the browser's
 * native lazy loading starts as early as possible and images don't stall.
 */
export function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] origin-top bg-secondary"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, delay, ease: EASE_OUT }}
        />
      )}
    </div>
  );
}
