import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { SectionLink } from "@/components/layout/SectionLink";
import { RotatingWords } from "@/components/motion/RotatingWords";
import { HeroArt } from "@/components/sections/HeroArt";
import { profile } from "@/content/site";
import { EASE_OUT } from "@/lib/motion";

const DISCIPLINES = ["Brand Identity Design", "Graphic & Social Media Design", "Web & App Development", "UI/UX Design"];
const SECOND_LINE = ["Software Developer", "Brand Designer", "Frontend Developer", "UI/UX Designer"] as const;

function RiseWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className ?? ""}`} aria-hidden>
      <span className="inline-flex">
        {word.split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: delay + i * 0.04, ease: EASE_OUT }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

function Parallax({
  x,
  y,
  depth,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div aria-hidden className={`pointer-events-none absolute ${className ?? ""}`} style={{ x: tx, y: ty }}>
      {children}
    </motion.div>
  );
}

/**
 * Hero: big role headline over a warm glow with a design + code illustration
 * (pen nib drawing "</>") that follows the cursor, a supporting statement on
 * the right and the four core disciplines along the bottom.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Pointer-reactive background (normalised -0.5..0.5) and spotlight position (%).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const lightX = useMotionValue(68);
  const lightY = useMotionValue(42);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${lightX}% ${lightY}%, rgba(247,163,6,0.16), transparent 62%)`;

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    px.set(nx - 0.5);
    py.set(ny - 0.5);
    lightX.set(nx * 100);
    lightY.set(ny * 100);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.15]);

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={onPointerMove}
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[72px]"
    >
      {/* Background: warm glow, grid, cursor spotlight */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_45%,hsl(var(--secondary)/0.85),transparent_70%)] dark:bg-[radial-gradient(90%_70%_at_75%_45%,hsl(var(--secondary)),transparent_72%)]" />
        <div className="absolute right-[6%] top-[22%] h-[30rem] w-[30rem] rounded-full bg-gold/35 blur-[140px] dark:bg-gold/30" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      </div>

      {/* Tablet: the illustration floats top right, beside the headline */}
      <HeroArt
        x={sx}
        y={sy}
        reduce={!!reduce}
        className="right-[3%] top-[8.5%] hidden w-[min(50vw,430px)] md:block lg:hidden"
      />
      <Parallax x={sx} y={sy} depth={70} className="left-[46%] top-[11%] hidden lg:block">
        <div className="h-12 w-12 rounded-full border border-primary/40" />
      </Parallax>
      <Parallax x={sx} y={sy} depth={30} className="left-[38%] top-[17%] hidden lg:block">
        <div className="h-3 w-3 rotate-45 bg-primary/80" />
      </Parallax>

      <div className="container relative flex flex-1 flex-col justify-center py-10">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)]">
          <motion.div style={{ y: headY, opacity: fade }}>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
              className="text-light-accent text-[clamp(1.5rem,3vw,2.5rem)] text-foreground/90"
            >
              Hey, I'm a
            </motion.p>
            <h1
              id="hero-title"
              className="mt-2 font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(3.25rem,10vw,9.5rem)]"
            >
              <span className="sr-only">{profile.headline}</span>
              <RiseWord word="Creative" delay={0.2} />
              <RiseWord word="Designer" delay={0.45} className="text-highlight" />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.95, ease: EASE_OUT }}
              className="mt-5 flex flex-wrap items-baseline gap-x-3 font-display text-[clamp(1.25rem,2.6vw,2.25rem)] font-extrabold uppercase"
            >
              <span className="text-light-accent">&amp;</span>
              <RotatingWords words={SECOND_LINE} startDelay={1200} />
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: EASE_OUT }}
            className="relative z-10 max-w-[31rem] lg:justify-self-end lg:pb-4"
          >
            {/* Desktop: the illustration sits in flow above the statement, so they never collide;
                the nib runs down behind the text. */}
            <div className="relative -z-10 hidden aspect-[100/47.5] lg:mb-8 lg:block">
              <HeroArt x={sx} y={sy} reduce={!!reduce} className="left-[-9%] top-0 w-[115%]" />
            </div>
            <p className="font-display text-2xl font-extrabold leading-tight md:text-3xl">{profile.tagline}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/80 md:text-base">
              Brand identities, campaigns and corporate design, plus the websites and apps that bring them to life.
            </p>
            <div className="mt-7 flex flex-col flex-wrap gap-3 sm:flex-row">
              <SectionLink
                to="work"
                className="group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_18px_40px_-14px_rgba(247,163,6,0.7)] transition-transform hover:-translate-y-0.5"
              >
                View My Work
                <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
              </SectionLink>
              <SectionLink
                to="contact"
                className="group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full border border-foreground/30 bg-background/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wider backdrop-blur transition-colors hover:border-primary hover:text-primary"
              >
                Let's Work Together
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </SectionLink>
            </div>
          </motion.div>
        </div>

        {/* Disciplines */}
        <motion.ol
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.1 } } }}
          className="relative z-10 mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-foreground/15 pt-6 md:mt-20 md:grid-cols-4"
        >
          {DISCIPLINES.map((d, i) => (
            <motion.li
              key={d}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
              }}
            >
              <SectionLink
                to="services"
                className="group flex items-baseline gap-3 text-sm font-semibold text-foreground/85 hover:text-foreground"
              >
                <span className="font-display text-xs font-extrabold text-highlight">0{i + 1}</span>
                <span className="link-underline">{d}</span>
              </SectionLink>
            </motion.li>
          ))}
        </motion.ol>
      </div>

      {/* Scroll indicator */}
      <SectionLink
        to="about"
        aria-label="Scroll to About"
        className="absolute bottom-6 right-6 hidden flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground md:flex"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-foreground/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-primary" />
        </span>
      </SectionLink>
    </section>
  );
}
