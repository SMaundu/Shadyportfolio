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
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: tries === 0 ? "auto" : "smooth", block: "start" });
        return;
      }
      if (tries++ < 60) raf = requestAnimationFrame(attempt);
    };
    // Give the page transition a moment to mount the target.
    const t = window.setTimeout(attempt, 60);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [pathname, hash]);

  return null;
}
