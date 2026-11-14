import Cal, { getCalApi } from "@calcom/embed-react";
import { motion } from "framer-motion";
import { CalendarCheck2, CalendarClock, Check, Clock, Mail, MessageCircle, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionLink } from "@/components/layout/SectionLink";
import { Reveal } from "@/components/motion/Reveal";
import { EASE_OUT } from "@/lib/motion";
import { Seo } from "@/components/Seo";
import { profile } from "@/content/site";
import { useTheme } from "@/hooks/use-theme";

/** Cal.com booking link, e.g. "shadrack-maundu/consultation". Public value (not a secret). */
const CAL_LINK = (import.meta.env.VITE_CAL_LINK as string | undefined)?.trim();
/** Only needed for Cal.com EU or self-hosted instances. */
const CAL_ORIGIN = (import.meta.env.VITE_CAL_ORIGIN as string | undefined)?.trim() || undefined;
const CAL_EMBED_JS = (import.meta.env.VITE_CAL_EMBED_JS as string | undefined)?.trim() || undefined;
const NAMESPACE = "consultation";

const AGENDA = [
  "Your goals, audience and what success looks like",
  "Scope: brand, print, website, app, or a mix",
  "Timeline and budget",
  "Agreeing the next steps",
];

interface Booked {
  title?: string;
  startTime?: string;
  email?: string;
}

function formatWhen(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default function Book() {
  const { theme } = useTheme();
  const [booked, setBooked] = useState<Booked | null>(null);

  useEffect(() => {
    if (!CAL_LINK) return;
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE, ...(CAL_EMBED_JS ? { embedJsUrl: CAL_EMBED_JS } : {}) });
      if (cancelled) return;
      cal("ui", {
        theme: theme === "dark" ? "dark" : "light",
        cssVarsPerTheme: { light: { "cal-brand": "#6a1414" }, dark: { "cal-brand": "#f7a306" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      const onBooked = (e: { detail: { data: Record<string, unknown> } }) => {
        const data = (e.detail?.data ?? {}) as { booking?: Record<string, unknown>; startTime?: string; title?: string };
        const b = (data.booking ?? data) as { startTime?: string; title?: string; responses?: { email?: string } };
        setBooked({ title: b.title, startTime: b.startTime, email: b.responses?.email });
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      cal("on", { action: "bookingSuccessfulV2", callback: onBooked as never });
      cal("on", { action: "bookingSuccessful", callback: onBooked as never });
    })();
    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    <>
      <Seo
        title="Book a consultation"
        description="Book a consultation call with Shadrack Maundu to talk about your brand, design, website or app project. Choose a time that suits you."
        path="/book"
      />
      <section className="relative overflow-hidden pb-24 pt-32 md:pt-40">
        <div aria-hidden className="absolute -right-40 -top-40 -z-10 h-[38rem] w-[38rem] rounded-full bg-burgundy/40 blur-[140px]" />
        <div className="container">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            Consultation
          </motion.p>
          <h1 className="mt-4 overflow-hidden font-display text-[clamp(3rem,8vw,7rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
            <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE_OUT }}>
              Let's <span className="text-highlight">talk</span>
            </motion.span>
          </h1>

          {booked && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex items-start gap-4 rounded-[1.75rem] border border-primary/40 bg-card p-6 md:p-8"
            >
              <CalendarCheck2 className="h-10 w-10 shrink-0 text-highlight" />
              <div>
                <p className="text-2xl font-bold">You're booked in. See you then!</p>
                <p className="mt-2 text-muted-foreground">
                  {formatWhen(booked.startTime) ? (
                    <>
                      <span className="font-semibold text-foreground">{formatWhen(booked.startTime)}</span>.{" "}
                    </>
                  ) : null}
                  A confirmation with the meeting details and calendar invite has been sent
                  {booked.email ? ` to ${booked.email}` : " to your email"}. You can reschedule or cancel from that email.
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal className="space-y-8">
              <p className="text-lg text-muted-foreground">
                A focused call to understand your project and how I can help, whether it's a new identity, a
                campaign, a company profile, a website or an app. Choose a time that suits you; your booking is
                confirmed instantly.
              </p>
              <ul className="space-y-3">
                {[
                  { Icon: Video, text: "Online call. The meeting link is in your confirmation." },
                  { Icon: Clock, text: "Times are shown in your own time zone." },
                  { Icon: CalendarClock, text: "Reschedule or cancel any time from the confirmation email." },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-highlight">
                      <Icon className="h-5 w-5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="rounded-[1.75rem] border border-border bg-card p-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">What we'll cover</h2>
                <ul className="mt-4 space-y-2.5">
                  {AGENDA.map((a) => (
                    <li key={a} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-highlight" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Prefer to write?{" "}
                <SectionLink to="contact" className="font-semibold text-foreground link-underline">
                  Send a project enquiry
                </SectionLink>{" "}
                instead.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              {CAL_LINK ? (
                <div className="min-h-[640px] overflow-hidden rounded-[1.75rem] border border-border bg-card">
                  <Cal
                    namespace={NAMESPACE}
                    calLink={CAL_LINK}
                    {...(CAL_ORIGIN ? { calOrigin: CAL_ORIGIN } : {})}
                    {...(CAL_EMBED_JS ? { embedJsUrl: CAL_EMBED_JS } : {})}
                    style={{ width: "100%", height: "100%", minHeight: 640, overflow: "auto" }}
                    config={{ layout: "month_view", theme: theme === "dark" ? "dark" : "light" }}
                  />
                </div>
              ) : (
                <div role="note" className="rounded-[1.75rem] border border-border bg-card p-8 md:p-10">
                  <CalendarClock className="h-10 w-10 text-highlight" />
                  <p className="mt-5 text-2xl font-bold">Online booking is temporarily unavailable</p>
                  <p className="mt-3 text-muted-foreground">
                    The booking calendar isn't connected yet. Please reach out directly and we'll find a time together.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={profile.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent("Consultation request")}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold hover:border-primary"
                    >
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
