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

/** Header lock-up: gold Shadesigns mark + wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/35 transition-transform duration-500 group-hover:rotate-[-8deg]">
        <SMark className="h-6 w-6 text-primary" />
      </span>
      <span className="font-display text-[1.35rem] font-extrabold leading-none tracking-tight">
        Shade<span className="text-highlight">signs</span>
      </span>
    </span>
  );
}

/** Full lock-up with tagline (footer, about). */
export function ShadesignsLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)} role="img" aria-label="Shadesigns, Designs That Convert">
      <SMark className="h-12 w-12 text-primary" />
      <span className="flex flex-col leading-none" aria-hidden>
        <span className="font-display text-2xl font-extrabold tracking-tight">
          Shade<span className="text-highlight">signs</span>
        </span>
        <span className="mt-1 font-display text-sm font-extralight tracking-wide text-foreground/80">Designs That Convert</span>
      </span>
    </span>
  );
}
