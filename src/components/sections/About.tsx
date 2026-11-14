import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Media } from "@/components/media/Media";
import { ShadesignsLogo } from "@/components/layout/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { profile } from "@/content/site";

const STATEMENT =
  "I work where design meets technology. I've spent more than four years designing brands, campaigns and corporate documents, and I studied Information Technology at JKUAT, so I understand both what a brand needs to say and what it takes to build it.";

const APPROACH = [
  {
    title: "Understand",
    body: "I start with your goals, your audience and where the work will live: print, social media, the web or an app.",
  },
  {
    title: "Concept",
    body: "I explore directions and present the strongest options with the reasoning behind each one.",
  },
  {
    title: "Design & build",
    body: "The chosen direction becomes a complete system, and for digital products I build it as well.",
  },
  {
    title: "Deliver",
    body: "You receive organised, ready-to-use files or a deployed product, with guidance so your team can apply it consistently.",
  },
];

const STRENGTHS = [
  "Design and development from one person",
  "Consistent brands across print and digital",
  "Clear, reliable communication",
  "Attention to detail",
  "Always learning new tools",
];

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

/** Statement that lights up word by word as it scrolls through the viewport. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-[clamp(1.6rem,3.2vw,2.9rem)] font-bold leading-[1.18] tracking-tight">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-32">
      <div className="container">
        <Reveal>
          <p className="eyebrow">About</p>
          <h2 id="about-title" className="section-heading mt-4">
            Designer <span className="text-outline">&amp;</span> <span className="text-highlight">developer</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div>
            <ScrollStatement text={STATEMENT} />

            <Reveal className="mt-10 space-y-5 text-muted-foreground md:text-lg">
              <p>
                My work spans posters and social media for churches, campus groups and small businesses, full brand
                identities, company profiles and multi-week campaigns. I've designed for Action Africa Institute and
                Gallexia Kenya, where I also helped build the company's UK website in WordPress. I managed social media
                for Optimum Prime Solutions, built responsive React pages as a web developer for the Kenya Malaria
                Youth Corps, and I now design at Boxraft, the parent company of Kenyans.co.ke.
              </p>
              <p>
                I'm most interested in projects where the two sides meet: a brand that needs a website, an app that
                needs a clear interface, or a business that wants its digital presence to look and work as one.
                That's also why I run{" "}
                <span className="font-semibold text-foreground">{profile.studio.name}</span>, my design brand, under
                the promise “{profile.studio.tagline}”.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-border">
              <div className="aspect-[4/5]">
                <Media id="site/portrait" alt="Shadrack Maundu" sizes="(min-width: 1024px) 40vw, 100vw" className="object-[50%_15%]" />
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-background/85 p-4 backdrop-blur-md">
                <ShadesignsLogo className="w-40" />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Strengths</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {STRENGTHS.map((s) => (
                  <li key={s} className="rounded-full border border-border px-4 py-2 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">How I work</h3>
          </Reveal>
          <ol className="mt-8 grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="group relative bg-background p-8 transition-colors hover:bg-card">
                <span className="font-display text-6xl leading-none text-foreground/10 transition-colors group-hover:text-primary/40">
                  0{i + 1}
                </span>
                <h4 className="mt-6 text-xl font-bold">{step.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
