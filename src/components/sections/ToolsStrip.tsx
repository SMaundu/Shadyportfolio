import { Marquee } from "@/components/motion/Marquee";
import { tools } from "@/content/experience";
import { cn } from "@/lib/utils";

/** "Tools I use" ticker directly under the hero, with each tool's own logo. */
export function ToolsStrip() {
  return (
    <section aria-label="Tools I use" className="relative border-y border-white/10 bg-secondary text-secondary-foreground">
      <div className="flex items-stretch">
        <p className="relative z-10 hidden shrink-0 items-center bg-secondary px-6 font-display text-xs font-extrabold uppercase tracking-[0.25em] text-gold md:flex lg:px-10">
          Tools I use
        </p>
        <Marquee duration={44} label="Tools I use" className="flex-1 py-5 md:py-6">
          {tools.map((t) => (
            <span key={t.name} className="flex items-center gap-3.5 whitespace-nowrap px-5 md:gap-4 md:px-7">
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[11px] shadow-[0_8px_18px_-8px_rgba(0,0,0,0.6)] md:h-12 md:w-12 md:rounded-[13px]",
                  !t.tile && "bg-[#fffaf2] p-[7px] md:p-2",
                )}
              >
                <img
                  src={t.icon}
                  alt=""
                  width={48}
                  height={48}
                  decoding="async"
                  className={cn("h-full w-full", t.tile ? "object-cover" : "object-contain")}
                />
              </span>
              <span className="font-display text-xl font-extrabold uppercase tracking-tight md:text-3xl">{t.name}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
