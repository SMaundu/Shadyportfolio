import { Media } from "@/components/media/Media";
import { getMedia } from "@/lib/media";
import { SMark } from "@/components/layout/Logo";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

interface ProjectCoverProps {
  project: Project;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Project cover image. Projects without visual assets (e.g. code-only work)
 * get a typographic cover built from the project's accent colour and stack.
 */
export function ProjectCover({ project, sizes, priority, className }: ProjectCoverProps) {
  const asset = getMedia(project.cover);
  if (asset) {
    const contain = project.coverFit === "contain";
    return (
      <div className={cn("h-full w-full", className)} style={{ backgroundColor: project.coverBg ?? asset.color }}>
        <Media
          id={project.cover}
          alt={`${project.title}: ${project.summary}`}
          sizes={sizes}
          priority={priority}
          fit={contain ? "contain" : "cover"}
          className={cn(contain && "p-[6%]", "transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]")}
        />
      </div>
    );
  }

  const accent = project.accent ?? "#f7a306";
  return (
    <div
      role="img"
      aria-label={`${project.title} cover`}
      className={cn("relative flex h-full w-full flex-col justify-between overflow-hidden p-6 md:p-8", className)}
      style={{
        background: `radial-gradient(120% 90% at 100% 0%, ${accent}66, transparent 55%), radial-gradient(90% 80% at 0% 100%, #6a141488, transparent 60%), #120707`,
      }}
    >
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
        <span>{project.year}</span>
        <SMark className="h-5 w-5 text-white/60" />
      </div>
      <div className="relative">
        <p className="font-display text-[clamp(2rem,4vw,3.5rem)] uppercase leading-[0.9] text-white transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
          {project.title}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tools.slice(0, 4).map((t) => (
            <li key={t} className="rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] text-white/80">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
