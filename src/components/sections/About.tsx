import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion/Reveal";
import { profile } from "@/content/site";

const STATEMENT =
  "I design brands, campaigns and corporate documents, and I build the websites and apps that carry them.";

const FACTS = [
  { value: "4+", label: "Years in graphic design" },
  { value: "BSc IT", label: "JKUAT, Second Class Upper" },
  { value: "Design + Code", label: "One person, both sides" },
];

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {word}
    </motion.span>
  );
}

/** Statement that lights up word by word as it scrolls through the viewport. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.6rem,3.2vw,2.75rem)] font-extrabold leading-[1.15] tracking-tight">
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
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-[1.4fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">About</p>
            <h2 id="about-title" className="sr-only">
              About Shadrack Maundu
            </h2>
          </Reveal>
          <div className="mt-6">
            <ScrollStatement text={STATEMENT} />
          </div>
          <Reveal className="mt-6 max-w-2xl space-y-4 text-muted-foreground md:text-lg">
            <p>
              I'm {profile.name}, a graphic and brand designer with an IT degree from JKUAT, based in {profile.location}.
              I currently design at Boxraft, the parent company of Kenyans.co.ke, and run{" "}
              <span className="font-semibold text-foreground">{profile.studio.name}</span>, my design brand.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-[clamp(1.25rem,2.6vw,2.25rem)] font-extrabold leading-none text-highlight">
                    {f.value}
                  </dd>
                  <dd className="mt-2 text-xs text-muted-foreground md:text-sm">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

        </div>

        <Reveal delay={0.1} className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="overflow-hidden rounded-[2rem] border border-border">
            <div className="aspect-[4/5]">
              <Media
                id="site/portrait"
                alt="Shadrack Maundu"
                sizes="(min-width: 1024px) 34vw, 380px"
                className="object-[50%_15%]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
