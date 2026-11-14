import { ArrowUp, ArrowUpRight, Github, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { navLinks, profile } from "@/content/site";
import { ShadesignsLogo } from "./Logo";
import { SectionLink } from "./SectionLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-surface">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm space-y-5">
            <ShadesignsLogo className="w-52" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.name}: {profile.headline}. Brand identities, marketing design, websites and mobile apps for
              businesses, startups and organisations.
            </p>
            <Link
              to="/book"
              className="group inline-flex items-center gap-2 text-sm font-bold text-highlight link-underline"
            >
              Book a consultation <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Explore</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <SectionLink to={l.id} className="link-underline">
                    {l.label}
                  </SectionLink>
                </li>
              ))}
              <li>
                <Link to="/book" className="link-underline">
                  Book a call
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Contact</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a className="link-underline break-all" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              <li>
                <a className="link-underline" href={profile.phoneHref}>
                  {profile.phoneDisplay}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex gap-2" aria-label="Social profiles">
              {[
                { href: profile.whatsapp, label: "WhatsApp", Icon: MessageCircle },
                { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
                { href: profile.socials.github, label: "GitHub", Icon: Github },
                { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
              ].map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-border/70 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {profile.fullName}. Designed and built by me.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 font-semibold uppercase tracking-[0.2em] hover:text-foreground"
          >
            Back to top <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[15vw] font-extrabold uppercase leading-[0.8] tracking-tight text-foreground/[0.04]"
      >
        Shadesigns
      </p>
    </footer>
  );
}
