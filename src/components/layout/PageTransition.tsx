import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { SMark } from "./Logo";

const EASE = [0.76, 0, 0.24, 1] as const;

// The curtain only plays between routes, never on the very first page load.
let firstRender = true;

/**
 * Route transition: a burgundy panel with the Shadesigns mark sweeps up over
 * the outgoing page and off the incoming one. Disabled for reduced motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [first] = useState(() => {
    const f = firstRender;
    firstRender = false;
    return f;
  });
  if (reduce) return <>{children}</>;
  return (
    <>
      <motion.div
        initial={first ? false : { opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.35 } }}
        exit={{ opacity: 1 }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] grid origin-bottom place-items-center bg-secondary"
        initial={first ? { scaleY: 0 } : { scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.75, ease: EASE, delay: 0.1 } }}
        exit={{ scaleY: 0 }}
        style={{ originY: 0 }}
      >
        <SMark className="h-14 w-14 text-gold" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] bg-secondary"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.55, ease: EASE } }}
        style={{ originY: 1 }}
      />
    </>
  );
}
