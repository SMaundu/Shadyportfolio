import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { categories, projects, type CategoryId } from "@/content/projects";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type Filter = "all" | CategoryId;

export function Work() {
  const [filter, setFilter] = useState<Filter>("all");

  const filters = useMemo(() => {
    const list: { id: Filter; label: string; count: number }[] = [{ id: "all", label: "All", count: projects.length }];
    for (const c of categories) {
      const count = projects.filter((p) => p.categories.includes(c.id)).length;
      if (count) list.push({ id: c.id, label: c.label, count });
    }
    return list;
  }, []);

  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-24 md:py-28">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title" className="section-heading mt-4">
              Selected <span className="text-highlight">work</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-sm text-muted-foreground">
            Brand identities, logos and campaigns. Open a project for the full case study.
          </Reveal>
        </div>

        <LayoutGroup>
          <div
            role="group"
            aria-label="Filter projects by category"
            className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0"
          >
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={cn(
                    "relative shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors md:text-sm",
                    active ? "border-transparent text-primary-foreground" : "border-border text-foreground/80 hover:border-primary/60",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="work-filter"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {f.label} <span className="tabular-nums opacity-60">{f.count}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>

          <motion.ul layout className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={p} index={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  );
}
