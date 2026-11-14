import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the hash target after navigation, waiting for the page transition
 * and lazy sections to mount. (Scrolling to the top of a new page happens in
 * App's AnimatePresence onExitComplete, so the outgoing page never jumps.)
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let raf = 0;
    let settle = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        // Content above may still change height (fonts, lazy sections); re-align once it settles.
        settle = window.setTimeout(() => {
          const top = el.getBoundingClientRect().top;
          if (Math.abs(top - parseFloat(getComputedStyle(el).scrollMarginTop || "0")) > 24) {
            el.scrollIntoView({ behavior: "auto", block: "start" });
          }
        }, 700);
        return;
      }
      if (tries++ < 60) raf = requestAnimationFrame(attempt);
    };
    // Give the page transition a moment to mount the target.
    const t = window.setTimeout(attempt, 60);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
    };
  }, [pathname, hash]);

  return null;
}
