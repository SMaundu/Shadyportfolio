import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarClock, ExternalLink, Info } from "lucide-react";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Media } from "@/components/media/Media";
import { getMedia } from "@/lib/media";
import { SectionLink } from "@/components/layout/SectionLink";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { EASE_OUT } from "@/lib/motion";
import { Seo } from "@/components/Seo";
import { ProjectCover } from "@/components/work/ProjectCover";
import { categoryLabel, getProject, projects, type GalleryItem, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

const PosterLightbox = lazy(() => import("@/components/work/PosterLightbox"));

const SPAN: Record<NonNullable<GalleryItem["span"]>, string> = {
  full: "md:col-span-6",
  half: "md:col-span-3",
  third: "md:col-span-2",
};

/** Which service to pre-select when someone enquires from a case study. */
const SERVICE_FOR: Record<string, string> = {
  brand: "brand-identity",
  graphic: "marketing-materials",
  corporate: "corporate-profiles",
  marketing: "social-media-graphics",
  software: "website-development",
  uiux: "ui-ux-design",
};

function Gallery({ project }: { project: Project }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = project.gallery.filter((g) => getMedia(g.id));
  const slides = useMemo(
    () =>
      items.map((g) => {
        const a = getMedia(g.id)!;
        return {
          src: Object.values(a.srcs).at(-1)!,
          width: a.w,
          height: a.h,
          alt: g.caption ?? project.title,
          srcSet: Object.entries(a.srcs).map(([w, src]) => ({ src, width: Number(w), height: Math.round((a.h * Number(w)) / a.w) })),
        };
      }),
    [items, project.title],
  );
  if (!items.length) return null;

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-6 md:gap-6">
        {items.map((g, i) => {
          const a = getMedia(g.id)!;
          const contain = g.fit === "contain";
          return (
            <li key={g.id} className={cn("col-span-1", SPAN[g.span ?? "half"])}>
              <figure>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group block w-full overflow-hidden rounded-2xl border border-border text-left"
                  aria-label={`View ${g.caption ?? `image ${i + 1}`} full size`}
                >
                  <ImageReveal delay={(i % 3) * 0.06}>
                    <div
                      className={cn(contain && "grid place-items-center p-[5%]")}
                      style={{ backgroundColor: g.bg ?? (contain ? "#f5f2ee" : a.color), aspectRatio: contain ? "4 / 3" : `${a.w} / ${a.h}` }}
                    >
                      <Media
                        id={g.id}
                        alt={g.caption ?? `${project.title}, image ${i + 1}`}
                        fit={contain ? "contain" : "cover"}
                        sizes={g.span === "full" ? "(min-width: 1024px) 1280px, 100vw" : g.span === "third" ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                        className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                      />
                    </div>
                  </ImageReveal>
                </button>
                {g.caption && <figcaption className="mt-3 text-sm text-muted-foreground">{g.caption}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>
      {open !== null && (
        <Suspense fallback={null}>
          <PosterLightbox open index={open} onClose={() => setOpen(null)} slides={slides} />
        </Suspense>
      )}
    </>
  );
}

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (!project) return <NotFound />;

  const idx = projects.indexOf(project);
  const next = projects[(idx + 1) % projects.length];
  const accent = project.accent ?? "#f7a306";
  const coverAsset = getMedia(project.cover);

  return (
    <article className="relative">
      <Seo
        title={project.title}
        description={project.summary}
        path={`/work/${project.slug}`}
        image={coverAsset?.og ?? (coverAsset ? Object.values(coverAsset.srcs).at(-1) : undefined)}
        type="article"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80vh] opacity-60"
        style={{ background: `radial-gradient(60% 60% at 80% 0%, ${accent}55, transparent 70%)` }}
      />

      <header className="container pt-32 md:pt-40">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <SectionLink to="work" className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All work
          </SectionLink>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
          className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-highlight"
        >
          {project.categories.map(categoryLabel).join(" · ")}
        </motion.p>
        <h1 className="mt-4 overflow-hidden font-display text-[clamp(3.25rem,10vw,9rem)] uppercase leading-[0.88]">
          <motion.span
            className="block"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: 0.15, ease: EASE_OUT }}
          >
            {project.title}
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT }}
          className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl"
        >
          {project.summary}
        </motion.p>

        {project.note && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold">
            <Info className="h-4 w-4 text-highlight" /> {project.note}
          </p>
        )}

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4"
        >
          {[
            ["Client", project.client ?? "Personal project"],
            ["Year", project.year],
            ["Role", project.role],
            ["Discipline", project.categories.map(categoryLabel).join(", ")],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{k}</dt>
              <dd className="mt-2 font-semibold">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </header>

      <div ref={heroRef} className="container mt-14">
        <ImageReveal className="relative aspect-[4/3] rounded-[2rem] border border-border md:aspect-[16/9]">
          <motion.div className="absolute inset-[-6%]" style={{ y: coverY }}>
            <ProjectCover project={project} priority sizes="(min-width: 1400px) 1360px, 100vw" />
          </motion.div>
        </ImageReveal>
      </div>

      <section className="container mt-20 grid gap-14 md:mt-28 lg:grid-cols-[1.4fr_1fr]" aria-labelledby="overview-title">
        <div>
          <Reveal>
            <h2 id="overview-title" className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Overview
            </h2>
          </Reveal>
          <div className="mt-6 space-y-6 text-lg leading-relaxed md:text-xl">
            {project.overview.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          {project.sections?.map((s) => (
            <Reveal key={s.heading} className="mt-12">
              <h3 className="text-2xl font-bold">{s.heading}</h3>
              <p className="mt-3 text-muted-foreground md:text-lg">{s.body}</p>
            </Reveal>
          ))}
          {project.links && (
            <Reveal className="mt-10 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-bold transition-colors hover:border-primary hover:text-primary"
                >
                  {l.label} <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1} className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Deliverables</h3>
            <ul className="mt-4 space-y-2.5">
              {project.deliverables.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0" style={{ backgroundColor: accent }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          {project.tools.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Tools</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tools.map((t) => (
                  <li key={t} className="rounded-full border border-border px-3 py-1.5 text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </section>

      {project.gallery.length > 0 && (
        <section className="container mt-20 md:mt-28" aria-label="Project gallery">
          <Gallery project={project} />
        </section>
      )}

      <section className="container mt-24 md:mt-32">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-secondary p-8 text-secondary-foreground md:p-14">
          <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <h2 className="relative font-display text-4xl uppercase leading-none md:text-6xl">Have a similar project?</h2>
          <p className="relative mt-4 max-w-xl text-secondary-foreground/80">
            Tell me what you need and I'll come back to you with ideas and next steps.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <SectionLink
              to="contact"
              query={`service=${SERVICE_FOR[project.categories[0]]}`}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-[#140808]"
            >
              Start an enquiry <ArrowRight className="h-4 w-4" />
            </SectionLink>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold hover:border-white"
            >
              <CalendarClock className="h-4 w-4" /> Book a call
            </Link>
          </div>
        </Reveal>
      </section>

      <nav aria-label="Next project" className="container mb-24 mt-24 md:mb-32">
        <Link to={`/work/${next.slug}`} className="group block border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Next project</p>
          <div className="mt-4 flex items-center justify-between gap-6">
            <p className="font-display text-[clamp(2.5rem,8vw,7rem)] uppercase leading-none transition-colors group-hover:text-highlight">
              {next.title}
            </p>
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:h-24 md:w-24">
              <ArrowUpRight className="h-7 w-7" />
            </span>
          </div>
        </Link>
      </nav>
    </article>
  );
}
