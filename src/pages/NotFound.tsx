import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SMark } from "@/components/layout/Logo";
import { SectionLink } from "@/components/layout/SectionLink";
import { Seo } from "@/components/Seo";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 pt-20 text-center">
      <Seo title="Page not found" description="This page doesn't exist." noindex />
      <SMark aria-hidden className="absolute -z-10 h-[70vmin] w-[70vmin] text-foreground/[0.04]" />
      <div>
        <p className="font-display text-[clamp(7rem,30vw,16rem)] leading-none text-highlight">404</p>
        <h1 className="mt-2 text-3xl font-bold">This page doesn't exist</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The link may be broken or the page may have moved. Here are some places to go instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <SectionLink to="work" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold hover:border-primary">
            View my work
          </SectionLink>
        </div>
      </div>
    </section>
  );
}
