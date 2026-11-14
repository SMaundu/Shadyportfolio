import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Fraction of the element that must be visible before revealing. */
  amount?: number;
  as?: "div" | "li" | "section" | "article" | "span" | "p";
}

/** Fades and lifts content in once when it scrolls into view. Honours reduced motion via MotionConfig. */
export function Reveal({ children, delay = 0, y = 28, amount = 0.25, as = "div", ...rest }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
