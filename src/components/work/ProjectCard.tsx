import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { categoryLabel, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./ProjectCover";

interface ProjectCardProps {
  project: Project;
  index: number;
  size?: "large" | "regular";
}

/** Large project preview with image reveal, hover zoom and a cursor-following "View" badge. */
export function ProjectCard({ project, index, size = "regular" }: ProjectCardProps) {
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

  const large = size === "large";

  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block rounded-[1.75rem] focus-visible:ring-offset-4"
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="relative">
        <ImageReveal
          delay={(index % 2) * 0.08}
          className={cn(
            "relative rounded-[1.75rem] border border-border/60 bg-card",
            large ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3]",
          )}
        >
          <ProjectCover
            project={project}
            sizes={large ? "(min-width: 1024px) 1280px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </ImageReveal>

        {project.note && (
          <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-highlight backdrop-blur">
            {project.note}
          </span>
        )}

        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
            style={{ x: sx, y: sy }}
          >
            <motion.span
              className="-ml-12 -mt-12 grid h-24 w-24 place-items-center rounded-full bg-primary text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-xl"
              initial={false}
              animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              View
            </motion.span>
          </motion.span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {project.categories.map(categoryLabel).join(" · ")}
          </p>
          <h3
            className={cn(
              "mt-2 font-display uppercase leading-[0.95] tracking-wide transition-colors group-hover:text-highlight",
              large ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl",
            )}
          >
            {project.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
        </div>
        <span className="mt-1 flex shrink-0 flex-col items-end gap-3">
          <span className="text-sm font-semibold tabular-nums text-muted-foreground">{project.year}</span>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
