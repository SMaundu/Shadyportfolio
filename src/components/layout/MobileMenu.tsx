import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks, profile } from "@/content/site";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";

/**
 * Full-screen mobile navigation (Radix Dialog: focus trap, Esc to close, scroll lock).
 * Section scrolling is deferred until the close animation finishes, because the
 * page is scroll-locked while the dialog is open.
 */
export function MobileMenu({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const pending = useRef<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const go = (id: string) => {
    pending.current = id;
    setOpen(false);
  };

  const onExitComplete = () => {
    const id = pending.current;
    pending.current = null;
    if (!id) return;
    if (pathname === "/") {
      window.history.replaceState(null, "", `#${id}`);
      scrollToSection(id);
    } else navigate(`/#${id}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-border/70 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                if (pending.current) e.preventDefault();
              }}
            >
              <motion.div
                className="fixed inset-0 z-[61] flex flex-col overflow-y-auto bg-background px-6 pb-8 pt-5"
                initial={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
                animate={{ clipPath: "circle(150% at calc(100% - 44px) 36px)" }}
                exit={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
              >
                <Dialog.Title className="sr-only">Site menu</Dialog.Title>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Menu</span>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-full border border-border"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="mt-10 flex-1">
                  <ul className="space-y-1">
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <a
                          href={`/#${link.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            go(link.id);
                          }}
                          aria-current={active === link.id ? "location" : undefined}
                          className={cn(
                            "flex items-baseline gap-4 py-1 font-display text-[clamp(2.75rem,13vw,4.5rem)] uppercase leading-none transition-colors",
                            active === link.id ? "text-primary" : "text-foreground hover:text-primary",
                          )}
                        >
                          <span className="font-sans text-xs font-semibold text-muted-foreground">0{i + 1}</span>
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 space-y-4"
                >
                  <Link
                    to="/book"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground"
                  >
                    Let's Talk <ArrowUpRight className="h-5 w-5" />
                  </Link>
                  <a href={`mailto:${profile.email}`} className="block text-sm text-muted-foreground">
                    {profile.email}
                  </a>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
