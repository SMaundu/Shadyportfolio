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
import { ArrowDownRight, ArrowRight, MapPin } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { Media } from "@/components/media/Media";
import { getMedia } from "@/lib/media";
import { SMark } from "@/components/layout/Logo";
import { SectionLink } from "@/components/layout/SectionLink";
import { RotatingWords } from "@/components/motion/RotatingWords";
import { EASE_OUT } from "@/lib/motion";
import type { MediaId } from "@/content/media.generated";
import { profile } from "@/content/site";

const letters = (word: string) => word.split("");

function NameLine({ word, delay, className }: { word: string; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`} aria-hidden>
      <span className="inline-flex">
        {letters(word).map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: delay + i * 0.045, ease: EASE_OUT }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

function Floating({
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
  children: React.ReactNode;
}) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div aria-hidden className={`pointer-events-none absolute ${className ?? ""}`} style={{ x: tx, y: ty }}>
      {children}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const cutout = getMedia("site/portrait-cutout");

  // Pointer-reactive background (normalised -0.5..0.5) and spotlight position (px).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const lightX = useMotionValue(70);
  const lightY = useMotionValue(30);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${lightX}% ${lightY}%, rgba(247,163,6,0.14), transparent 60%)`;

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

  // Gentle parallax as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-10%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={onPointerMove}
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[72px]"
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-burgundy/50 blur-[140px] dark:bg-burgundy/60" />
        <div className="absolute -bottom-48 left-[-10%] h-[34rem] w-[34rem] rounded-full bg-gold/20 blur-[140px]" />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      </div>
      <Floating x={sx} y={sy} depth={-40} className="right-[2%] top-[13%] hidden lg:block">
        <SMark className="h-24 w-24 animate-spin-slow text-transparent [stroke:hsl(var(--primary)/0.4)] [stroke-width:10]" />
      </Floating>
      <Floating x={sx} y={sy} depth={60} className="right-[30%] top-[15%] hidden md:block">
        <div className="h-20 w-20 rounded-full border border-primary/30" />
      </Floating>
      <Floating x={sx} y={sy} depth={25} className="left-[47%] top-[13%] hidden lg:block">
        <div className="h-3 w-3 rotate-45 bg-primary/70" />
      </Floating>

      <div className="container relative flex flex-1 flex-col justify-center py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {profile.headline}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Based in {profile.location}
          </span>
        </motion.div>

        <div className="relative mt-6">
          <motion.h1
            id="hero-title"
            style={{ y: nameY, opacity: fade }}
            className="relative z-0 font-display text-[clamp(4.25rem,14.2vw,13.25rem)] uppercase leading-[0.84] tracking-[-0.01em]"
          >
            <span className="sr-only">
              {profile.name}, {profile.headline}
            </span>
            <NameLine word="Shadrack" delay={0.2} />
            <NameLine word="Maundu" delay={0.45} className="text-outline md:pl-[8vw]" />
          </motion.h1>

          {/* Portrait: background-free cut-out over the name when available, otherwise a framed photo. */}
          {cutout ? (
            <motion.div
              style={{ y: portraitY }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: EASE_OUT }}
              className="pointer-events-none absolute bottom-[-12%] right-[4%] z-10 hidden w-[min(34vw,520px)] md:block"
            >
              <Media id={"site/portrait-cutout" as MediaId} alt="Portrait of Shadrack Maundu" intrinsic priority sizes="34vw" />
            </motion.div>
          ) : (
            <div className="absolute right-0 top-1/2 z-10 hidden w-[clamp(220px,22vw,330px)] -translate-y-1/2 md:block">
              <motion.figure
                style={{ y: portraitY }}
                initial={{ opacity: 0, scale: 0.92, rotate: 6 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                transition={{ duration: 1.4, delay: 0.55, ease: EASE_OUT }}
                className="relative"
              >
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
                  <div className="aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                    <Media
                      id="site/portrait"
                      alt="Portrait of Shadrack Maundu"
                      priority
                      sizes="330px"
                      className="object-[50%_18%]"
                    />
                  </div>
                </div>
                <figcaption className="absolute -bottom-5 -left-6 rounded-2xl bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg">
                  Design × Code
                </figcaption>
              </motion.figure>
            </div>
          )}
        </div>

        <div className="relative z-20 mt-10 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: EASE_OUT }}
            className="max-w-xl"
          >
            <p className="text-lg font-semibold md:text-2xl">
              I'm a{" "}
              <RotatingWords words={profile.roles} className="text-highlight" />
            </p>
            <p className="mt-3 font-display text-2xl uppercase leading-tight text-foreground/90 md:text-3xl">
              {profile.tagline}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-[17px]">{profile.intro}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: EASE_OUT }}
            className="flex flex-col gap-3 sm:flex-row md:justify-end"
          >
            <SectionLink
              to="work"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_18px_40px_-14px_rgba(247,163,6,0.7)] transition-transform hover:-translate-y-0.5"
            >
              View My Work
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </SectionLink>
            <SectionLink
              to="contact"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-foreground/25 px-7 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:border-primary hover:text-primary"
            >
              Let's Work Together
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </SectionLink>
          </motion.div>
        </div>

        {/* Framed portrait on small screens */}
        {!cutout && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: EASE_OUT }}
            className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 md:hidden"
          >
            <div className="aspect-[4/3]">
              <Media id="site/portrait" alt="Portrait of Shadrack Maundu" sizes="100vw" className="object-[50%_20%]" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <SectionLink
        to="work"
        aria-label="Scroll to selected work"
        className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground md:flex"
      >
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-foreground/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-primary" />
        </span>
      </SectionLink>
    </section>
  );
}
