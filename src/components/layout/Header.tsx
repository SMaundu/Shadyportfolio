import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "@/content/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SectionLink } from "./SectionLink";
import { ThemeToggle } from "./ThemeToggle";

const SECTION_IDS = navLinks.map((l) => l.id);

export function Header() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const active = useActiveSection(SECTION_IDS, onHome);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-b border-border/60 bg-background/75 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="container flex h-[72px] items-center justify-between gap-4">
          <Link to="/" className="group rounded-xl" aria-label="Shadrack Maundu, home">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-border/70 bg-background/50 p-1.5 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = onHome && active === link.id;
                return (
                  <li key={link.id}>
                    <SectionLink
                      to={link.id}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-foreground/[0.08] ring-1 ring-primary/40"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </SectionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/book"
              className="group hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_8px_30px_-8px_rgba(247,163,6,0.6)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Let's Talk
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
            <MobileMenu active={onHome ? active : undefined} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
