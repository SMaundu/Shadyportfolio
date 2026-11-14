import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Code2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { categories, otherBuilds, projects, type CategoryId } from "@/content/projects";
import { cn } from "@/lib/utils";

type Filter = "all" | CategoryId;
const INITIAL = 7;

const ordered = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

export function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const cat of categories) c[cat.id] = projects.filter((p) => p.categories.includes(cat.id)).length;
    return c;
  }, []);

  const list = filter === "all" ? ordered : ordered.filter((p) => p.categories.includes(filter));
  const visible = filter === "all" && !expanded ? list.slice(0, INITIAL) : list;

  const choose = (f: Filter) => {
    setFilter(f);
    setExpanded(false);
  };

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title" className="section-heading mt-4">
              Work that <span className="text-highlight">speaks</span>
              <br />
              and <span className="text-outline">ships</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-md text-muted-foreground">
            Brand identities, campaigns, corporate documents and software, organised by discipline. Open any project
            for the full case study.
          </Reveal>
        </div>

        <LayoutGroup>
          <div
            role="group"
            aria-label="Filter projects by category"
            className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
          >
            {(["all", ...categories.map((c) => c.id)] as Filter[]).map((f) => {
              const label = f === "all" ? "All work" : categories.find((c) => c.id === f)!.label;
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => choose(f)}
                  aria-pressed={active}
                  className={cn(
                    "relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
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
                    {label} <span className="tabular-nums opacity-60">{counts[f]}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {list.length} {list.length === 1 ? "project" : "projects"}
          </p>

          <motion.ul layout className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => {
                const large = i % 3 === 0;
                return (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(large && "md:col-span-2")}
                  >
                    <ProjectCard project={p} index={i} size={large ? "large" : "regular"} />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {filter === "all" && !expanded && list.length > INITIAL && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="group inline-flex items-center gap-3 rounded-full border border-foreground/25 px-7 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:border-primary hover:text-primary"
            >
              Show all {list.length} projects
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        )}

        {(filter === "software" || (filter === "all" && expanded)) && (
          <Reveal className="mt-20">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Also built</h3>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {otherBuilds.map((b) => (
                <li key={b.title} className="flex gap-4 rounded-2xl border border-border bg-card/60 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-highlight">
                    <Code2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">{b.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                    <p className="mt-3 font-mono text-xs text-muted-foreground">{b.stack.join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
