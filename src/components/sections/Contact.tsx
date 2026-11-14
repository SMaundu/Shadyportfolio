import { ArrowUpRight, CalendarClock, Github, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { profile } from "@/content/site";

const DIRECT = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  { label: "Phone", value: profile.phoneDisplay, href: profile.phoneHref, Icon: Phone },
  { label: "WhatsApp", value: "Chat on WhatsApp", href: profile.whatsapp, Icon: MessageCircle, external: true },
];

const SOCIAL = [
  { label: "LinkedIn", href: profile.socials.linkedin, Icon: Linkedin },
  { label: "GitHub", href: profile.socials.github, Icon: Github },
  { label: "Instagram", href: profile.socials.instagram, Icon: Instagram },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-24 md:py-32">
      <div aria-hidden className="absolute -left-40 top-20 -z-10 h-[30rem] w-[30rem] rounded-full bg-burgundy/30 blur-[120px]" />
      <div className="container">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="section-heading mt-4">
            Let's work <span className="text-highlight">together</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="space-y-8">
            <Reveal className="text-lg text-muted-foreground">
              Whether you need a brand identity, a campaign, a company profile, a website or an app, send me the
              details and I'll get back to you. Prefer to talk it through first? Book a consultation call.
            </Reveal>

            <Reveal delay={0.05}>
              <Link
                to="/book"
                className="group relative flex items-center gap-5 overflow-hidden rounded-[1.75rem] bg-secondary p-6 text-secondary-foreground transition-transform hover:-translate-y-1 md:p-8"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold text-[#140808]">
                  <CalendarClock className="h-6 w-6" />
                </span>
                <span className="flex-1">
                  <span className="block text-xl font-bold">Book a consultation</span>
                  <span className="mt-1 block text-sm text-secondary-foreground/75">
                    Pick a time that suits you and get an instant calendar confirmation.
                  </span>
                </span>
                <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="divide-y divide-border rounded-[1.75rem] border border-border">
                {DIRECT.map(({ label, value, href, Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-muted/50"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-highlight">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
                        <span className="block truncate font-semibold">{value}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} className="flex items-center gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="grid h-12 w-12 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <EnquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
