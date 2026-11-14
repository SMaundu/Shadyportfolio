import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction the mask opens towards. */
  from?: "bottom" | "left" | "top";
}

const hiddenClip = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
};

/**
 * Wipes an image in with a clip-path mask while the image settles from a slight zoom.
 * Used for project covers and case-study media.
 */
export function ImageReveal({ children, className, delay = 0, from = "bottom" }: ImageRevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={cn("overflow-hidden", className)}>{children}</div>;
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: hiddenClip[from] }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.5, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
