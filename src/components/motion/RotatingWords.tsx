import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RotatingWordsProps {
  words: readonly string[];
  interval?: number;
  className?: string;
}

/**
 * Cycles through a list of titles. The full list stays available to screen
 * readers; only the visual layer animates.
 */
export function RotatingWords({ words, interval = 2600, className }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = window.setInterval(() => setIndex((i) => (i + 1) % words.length), reduce ? interval * 1.6 : interval);
    return () => window.clearInterval(t);
  }, [words.length, interval, reduce]);

  return (
    <span className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden
          className="inline-block whitespace-nowrap"
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
