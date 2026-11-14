import { Media } from "@/components/media/Media";
import type { Project } from "@/content/projects";
import { getMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

interface ProjectCoverProps {
  project: Project;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/** Project cover image on its dominant-colour placeholder. */
export function ProjectCover({ project, sizes, priority, className }: ProjectCoverProps) {
  const asset = getMedia(project.cover);
  return (
    <div className={cn("h-full w-full", className)} style={{ backgroundColor: asset?.color }}>
      <Media
        id={project.cover}
        alt={`${project.title}: ${project.summary}`}
        sizes={sizes}
        priority={priority}
        className="transition-[transform,opacity] duration-1000 ease-out-expo group-hover:scale-[1.05]"
      />
    </div>
  );
}
