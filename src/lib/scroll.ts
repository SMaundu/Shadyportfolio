export const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Move focus for keyboard and screen-reader users without a second scroll jump.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
};
