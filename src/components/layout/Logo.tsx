import { cn } from "@/lib/utils";

/** The Shadesigns "S" mark, traced from the official logo artwork. */
export function SMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 668 746"
      className={cn("shrink-0", className)}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M190 0H668L558 124H246L178 201V287L387 497H217L53 333V155Z" />
      <path d="M281 249H451L614 413V590L478 746H0L110 621H423L491 545V459Z" />
    </svg>
  );
}

/** Nav lock-up: Shadesigns mark + personal name. */
export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ee2524]/10 ring-1 ring-[#ee2524]/30 transition-transform duration-500 group-hover:rotate-[-8deg]">
        <SMark className="h-6 w-6 text-[#ee2524]" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl uppercase tracking-wide">Shadrack Maundu</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Shadesigns
          </span>
        </span>
      )}
    </span>
  );
}

/** Full Shadesigns horizontal logo; switches to the white version on dark backgrounds. */
export function ShadesignsLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block", className)}>
      <img
        src="/brand/shadesigns-horizontal.webp"
        alt="Shadesigns, Designs That Convert"
        width={1400}
        height={406}
        loading="lazy"
        className="h-auto w-full dark:hidden"
      />
      <img
        src="/brand/shadesigns-horizontal-dark.webp"
        alt="Shadesigns, Designs That Convert"
        width={1400}
        height={406}
        loading="lazy"
        className="hidden h-auto w-full dark:block"
      />
    </span>
  );
}
