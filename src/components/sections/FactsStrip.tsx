import { SMark } from "@/components/layout/Logo";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { facts, organisations } from "@/content/site";

/** CV-verified facts ticker + the organisations Shadrack has worked with. */
export function FactsStrip() {
  return (
    <div className="relative border-y border-border/70 bg-secondary text-secondary-foreground">
      <Marquee duration={45} label="Highlights" className="py-5 md:py-6">
        {facts.map((f) => (
          <span key={f} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-display text-2xl uppercase tracking-wide md:text-4xl">{f}</span>
            <SMark className="h-5 w-5 text-gold md:h-6 md:w-6" />
          </span>
        ))}
      </Marquee>
      <div className="border-t border-white/10 bg-background text-foreground">
        <Reveal className="container flex flex-col items-start gap-4 py-8 md:flex-row md:items-center md:gap-10">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Experience with
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {organisations.map((o) => (
              <li key={o} className="text-base font-bold text-foreground/70 transition-colors hover:text-foreground md:text-lg">
                {o}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
