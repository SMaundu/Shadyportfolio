import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { ImageReveal } from "@/components/motion/ImageReveal";
import type { Project } from "@/content/projects";
import { ProjectCover } from "./ProjectCover";

interface ProjectCardProps {
  project: Project;
  index: number;
}

/** Compact project preview: cover with curtain reveal, hover zoom and a cursor-following "View" badge. */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block rounded-[1.5rem] focus-visible:ring-offset-4"
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="relative">
        <ImageReveal delay={(index % 3) * 0.08} className="aspect-[4/3] rounded-[1.5rem] border border-border/60 bg-card">
          <ProjectCover project={project} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </ImageReveal>

        {project.note && (
          <span className="absolute left-3 top-3 z-[2] rounded-full bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-highlight backdrop-blur">
            {project.note}
          </span>
        )}

        {!reduce && (
          <motion.span aria-hidden className="pointer-events-none absolute left-0 top-0 z-[2] hidden md:block" style={{ x: sx, y: sy }}>
            <motion.span
              className="-ml-10 -mt-10 grid h-20 w-20 place-items-center rounded-full bg-primary font-display text-xs font-extrabold uppercase tracking-widest text-primary-foreground shadow-xl"
              initial={false}
              animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              View
            </motion.span>
          </motion.span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-highlight">{project.kind}</p>
          <h3 className="mt-1.5 font-display text-xl font-extrabold leading-tight tracking-tight transition-colors group-hover:text-highlight md:text-2xl">
            {project.title}
          </h3>
        </div>
        <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
