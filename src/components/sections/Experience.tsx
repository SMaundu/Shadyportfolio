import { motion, useScroll, useSpring } from "framer-motion";
import { Download, GraduationCap } from "lucide-react";
import { useRef } from "react";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { education, roles, skillGroups, tools } from "@/content/experience";
import { profile } from "@/content/site";
import { cn } from "@/lib/utils";

const TRACK_LABEL = { design: "Design", development: "Development", both: "Design + Dev" } as const;

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-border/60 bg-surface py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Experience</p>
            <h2 id="experience-title" className="section-heading mt-4">
              Where I've <span className="text-highlight">worked</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            {profile.cvs.map((cv) => (
              <a
                key={cv.href}
                href={cv.href}
                download
                className="group inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-background px-5 py-3 text-sm font-bold transition-colors hover:border-primary hover:text-primary"
              >
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                {cv.label}
                <span className="sr-only">(PDF)</span>
              </a>
            ))}
          </Reveal>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          {/* Timeline */}
          <ol ref={listRef} className="relative space-y-12 pl-8 md:pl-12">
            <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border md:left-[11px]" />
            <motion.span
              aria-hidden
              style={{ scaleY: progress }}
              className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-primary md:left-[11px]"
            />
            {roles.map((r, i) => (
              <Reveal as="li" key={`${r.org}-${r.title}`} delay={i * 0.04} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-8 top-1.5 grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-background md:-left-12 md:h-6 md:w-6"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary md:h-2 md:w-2" />
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="tabular-nums">
                    {r.start} – {r.end}
                  </span>
                  {r.mode && <span>· {r.mode}</span>}
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] tracking-widest",
                      r.track === "development" ? "bg-sky-500/15 text-sky-600 dark:text-sky-300" : "bg-primary/15 text-highlight",
                    )}
                  >
                    {TRACK_LABEL[r.track]}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold md:text-3xl">{r.title}</h3>
                <p className="mt-1 font-semibold text-highlight">
                  {r.org}
                  {r.orgNote && <span className="font-normal text-muted-foreground"> · {r.orgNote}</span>}
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  {r.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0 bg-primary/60" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                {r.tools && (
                  <p className="mt-4 font-mono text-xs text-muted-foreground">{r.tools.join(" · ")}</p>
                )}
              </Reveal>
            ))}
          </ol>

          {/* Education + skills */}
          <div className="space-y-10 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                <GraduationCap className="h-4 w-4" /> Education
              </h3>
              <ul className="mt-5 space-y-4">
                {education.map((e) => (
                  <li key={e.title} className="rounded-2xl border border-border bg-background p-6">
                    <p className="text-xs font-semibold tabular-nums text-muted-foreground">{e.period}</p>
                    <p className="mt-2 text-lg font-bold">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.org}</p>
                    <p className="mt-2 text-sm font-semibold text-highlight">{e.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.05}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Skills</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {skillGroups.map((g) => (
                  <div key={g.title} className="rounded-2xl border border-border bg-background p-5">
                    <p className="font-bold">{g.title}</p>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {g.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <p className="container text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Tools I use</p>
        <Marquee className="mt-6" duration={35} label="Tools">
          {tools.map((t) => (
            <span key={t.name} className="mx-3 inline-flex items-center gap-3 rounded-full border border-border bg-background px-5 py-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-[11px] font-black text-secondary-foreground">
                {t.short}
              </span>
              <span className="whitespace-nowrap font-semibold">{t.name}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
