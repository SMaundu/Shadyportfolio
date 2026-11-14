import { SMark } from "@/components/layout/Logo";
import { Marquee } from "@/components/motion/Marquee";
import { tools } from "@/content/experience";

/** "Tools I use" ticker directly under the hero. */
export function ToolsStrip() {
  return (
    <section aria-label="Tools I use" className="relative border-y border-white/10 bg-secondary text-secondary-foreground">
      <div className="flex items-stretch">
        <p className="relative z-10 hidden shrink-0 items-center bg-secondary px-6 font-display text-xs font-extrabold uppercase tracking-[0.25em] text-gold md:flex lg:px-10">
          Tools I use
        </p>
        <Marquee duration={40} label="Tools I use" className="flex-1 py-5 md:py-6">
          {tools.map((t) => (
            <span key={t.name} className="flex items-center">
              <span className="flex items-center gap-3 whitespace-nowrap px-6">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 font-display text-[11px] font-extrabold text-gold">
                  {t.short}
                </span>
                <span className="font-display text-xl font-extrabold uppercase tracking-tight md:text-3xl">{t.name}</span>
              </span>
              <SMark className="h-4 w-4 text-gold/70 md:h-5 md:w-5" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
