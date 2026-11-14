import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const read = (): Theme =>
  typeof document !== "undefined" && !document.documentElement.classList.contains("dark") ? "light" : "dark";

/** Dark-first theme with a persisted choice. The initial class is set in index.html before paint. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable (private mode) - theme still applies for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}
