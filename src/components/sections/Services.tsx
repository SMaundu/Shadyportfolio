import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ArrowRight, Check, Code2, Palette, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionLink } from "@/components/layout/SectionLink";
import { Reveal } from "@/components/motion/Reveal";
import { getProject } from "@/content/projects";
import { services, type ServiceGroup } from "@/content/services";
import { cn } from "@/lib/utils";

const GROUPS: { id: ServiceGroup; label: string; blurb: string; Icon: typeof Palette }[] = [
  {
    id: "creative",
    label: "Creative",
    blurb: "Identity, print and digital design that makes your organisation recognisable and easy to trust.",
    Icon: Palette,
  },
  {
    id: "technology",
    label: "Technology",
    blurb: "Websites, apps and interfaces that look like your brand and work properly on every screen.",
    Icon: Code2,
  },
];

export function Services() {
  const [group, setGroup] = useState<ServiceGroup>("creative");
  const list = services.filter((s) => s.group === group);
  const meta = GROUPS.find((g) => g.id === group)!;

  return (
    <section id="services" aria-labelledby="services-title" className="relative border-y border-border/60 bg-surface py-24 md:py-32">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">Services</p>
              <h2 id="services-title" className="section-heading mt-4">
                How I can <span className="text-highlight">help</span>
              </h2>
              <p className="mt-6 max-w-md text-muted-foreground">
                One person for both sides of the job: the brand and the build. Choose a discipline, open a service
                to see what's included, then send an enquiry about it.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div role="tablist" aria-label="Service groups" className="inline-flex rounded-full border border-border bg-background p-1.5">
                {GROUPS.map((g) => (
                  <button
                    key={g.id}
                    role="tab"
                    type="button"
                    id={`tab-${g.id}`}
                    aria-selected={group === g.id}
                    aria-controls="services-panel"
                    onClick={() => setGroup(g.id)}
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
                      group === g.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {group === g.id && (
                      <motion.span layoutId="service-tab" className="absolute inset-0 rounded-full bg-primary" />
                    )}
                    <g.Icon className="relative h-4 w-4" />
                    <span className="relative">{g.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-5 max-w-sm text-sm text-muted-foreground">{meta.blurb}</p>
            </Reveal>
          </div>

          <div id="services-panel" role="tabpanel" aria-labelledby={`tab-${group}`}>
            <Accordion.Root type="single" collapsible defaultValue={list[0].slug} key={group} className="border-t border-border">
              {list.map((s, i) => (
                <Accordion.Item key={s.slug} value={s.slug} className="group/item border-b border-border">
                  <Accordion.Header asChild>
                    <h3>
                      <Accordion.Trigger className="flex w-full items-center gap-5 py-6 text-left md:py-7">
                        <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">0{i + 1}</span>
                        <span className="flex-1 font-display text-xl font-extrabold uppercase leading-tight tracking-tight transition-colors group-hover/item:text-highlight group-data-[state=open]/item:text-highlight md:text-3xl">
                          {s.title}
                        </span>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-colors duration-500 group-data-[state=open]/item:border-primary group-data-[state=open]/item:bg-primary group-data-[state=open]/item:text-primary-foreground">
                          <Plus className="h-4 w-4 transition-transform duration-500 group-data-[state=open]/item:rotate-45" />
                        </span>
                      </Accordion.Trigger>
                    </h3>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="grid gap-6 pb-8 pl-[3.25rem] md:grid-cols-[1.2fr_1fr]">
                      <div>
                        <p className="text-foreground/85">{s.summary}</p>
                        <SectionLink
                          to="contact"
                          query={`service=${s.slug}`}
                          className="group/cta mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
                        >
                          Enquire about {s.title.toLowerCase()}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                        </SectionLink>
                      </div>
                      <div className="space-y-5">
                        <ul className="space-y-2 text-sm">
                          {s.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-highlight" /> {item}
                            </li>
                          ))}
                        </ul>
                        {s.proof && s.proof.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Related work:{" "}
                            {s.proof.map((slug, j) => {
                              const p = getProject(slug);
                              if (!p) return null;
                              return (
                                <span key={slug}>
                                  {j > 0 && ", "}
                                  <Link to={`/work/${slug}`} className="font-semibold text-foreground link-underline">
                                    {p.title}
                                  </Link>
                                </span>
                              );
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </section>
  );
}
