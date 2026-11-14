import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CalendarClock, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { profile } from "@/content/site";
import { serviceOptions } from "@/content/services";
import {
  BUDGETS,
  CURRENCIES,
  TIMELINES,
  enquirySchema,
  type EnquiryInput,
  type EnquiryResponse,
} from "@/lib/enquiry";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string; name: string; email: string; confirmationSent: boolean }
  | { kind: "error"; message: string };

const ENDPOINT = "/api/enquiry";

function Field({
  id,
  label,
  error,
  optional,
  hint,
  aside,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  /** Extra control shown on the right of the label row (e.g. a currency switch). */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex min-h-[1.5rem] items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
          {!optional && <span className="text-highlight" aria-hidden> *</span>}
        </label>
        {optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}
        {aside}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm() {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const [params] = useSearchParams();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const presetService = params.get("service");
  const initialService = serviceOptions.some((s) => s.value === presetService) ? presetService! : "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      service: initialService,
      budgetCurrency: "KES",
      budget: "",
      timeline: "",
      description: "",
      consent: false as unknown as true,
      website: "",
      startedAt: Date.now(),
    },
  });

  // Keep the service in sync when a "Enquire about …" button changes the URL.
  useEffect(() => {
    if (presetService && serviceOptions.some((s) => s.value === presetService)) {
      setValue("service", presetService, { shouldValidate: false });
    }
  }, [presetService, setValue]);

  const currency = watch("budgetCurrency");
  useEffect(() => {
    setValue("budget", "", { shouldValidate: false });
  }, [currency, setValue]);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") resultRef.current?.focus();
  }, [status.kind]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ kind: "submitting" });
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: ctrl.signal,
      });
      const data = (await res.json().catch(() => ({}))) as EnquiryResponse & { confirmationSent?: boolean };
      if (res.ok && data.ok && data.reference) {
        setStatus({
          kind: "success",
          reference: data.reference,
          name: String(values.fullName).trim().split(/\s+/)[0],
          email: String(values.email).trim(),
          confirmationSent: !!data.confirmationSent,
        });
        reset({ ...values, description: "", consent: false as unknown as true, startedAt: Date.now() });
        return;
      }
      if (res.status === 400 && data.errors) {
        for (const [k, msg] of Object.entries(data.errors)) setError(k as keyof EnquiryInput, { message: msg });
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({
        kind: "error",
        message:
          data.message ??
          (res.status === 429
            ? "You've sent several enquiries in a short time. Please wait a little and try again."
            : "Something went wrong on my side and your enquiry wasn't sent."),
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          (err as Error).name === "AbortError"
            ? "The request took too long. Please check your connection and try again."
            : "I couldn't reach the server. Please check your connection and try again.",
      });
    } finally {
      window.clearTimeout(timer);
    }
  });

  const busy = status.kind === "submitting";
  const aria = (name: keyof EnquiryInput, hint = false) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${fid(name)}-error` : hint ? `${fid(name)}-hint` : undefined,
  });

  if (status.kind === "success") {
    return (
      <motion.div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-primary/40 bg-card p-8 outline-none md:p-10"
      >
        <CheckCircle2 className="h-12 w-12 text-highlight" />
        <h3 className="mt-6 text-3xl font-bold">Thank you, {status.name}!</h3>
        <p className="mt-3 text-muted-foreground">
          Your enquiry has been received. I'll reply to <span className="font-semibold text-foreground">{status.email}</span>{" "}
          as soon as I can.
          {status.confirmationSent && " A confirmation email is on its way to your inbox."}
        </p>
        <p className="mt-6 rounded-xl bg-muted px-4 py-3 font-mono text-sm">
          Reference: <span className="font-bold">{status.reference}</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            <CalendarClock className="h-4 w-4" /> Book a consultation
          </Link>
          <button
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold hover:border-primary"
          >
            <RotateCcw className="h-4 w-4" /> Send another enquiry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${uid}-title`}
      aria-busy={busy}
      className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.6)] md:p-10"
    >
      <h3 id={`${uid}-title`} className="text-2xl font-bold">
        Project enquiry
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell me about your project. Fields marked <span className="text-highlight">*</span> are required.
      </p>

      <fieldset disabled={busy} className="relative mt-8 grid gap-6 md:grid-cols-2">
        <legend className="sr-only">Your details and project</legend>
        <Field id={fid("fullName")} label="Full name" error={errors.fullName?.message}>
          <input id={fid("fullName")} autoComplete="name" className="field" {...aria("fullName")} {...register("fullName")} />
        </Field>
        <Field id={fid("email")} label="Email" error={errors.email?.message}>
          <input
            id={fid("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            className="field"
            {...aria("email")}
            {...register("email")}
          />
        </Field>
        <Field id={fid("company")} label="Company or organisation" optional error={errors.company?.message}>
          <input id={fid("company")} autoComplete="organization" className="field" {...aria("company")} {...register("company")} />
        </Field>
        <Field id={fid("service")} label="Service required" error={errors.service?.message}>
          <select id={fid("service")} className="field appearance-none" {...aria("service")} {...register("service")}>
            <option value="" disabled>
              Choose a service
            </option>
            <optgroup label="Creative">
              {serviceOptions.slice(0, 6).map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Technology">
              {serviceOptions.slice(6).map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </optgroup>
            <option value="other">Something else</option>
          </select>
        </Field>

        <Field
          id={fid("budget")}
          label="Budget"
          error={errors.budget?.message}
          aside={
            <div role="radiogroup" aria-label="Budget currency" className="flex shrink-0 rounded-lg border border-input p-0.5">
              {CURRENCIES.map((c) => (
                <label
                  key={c}
                  className={cn(
                    "cursor-pointer rounded-md px-2.5 py-0.5 text-[11px] font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                    currency === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <input type="radio" value={c} className="sr-only" {...register("budgetCurrency")} />
                  {c}
                </label>
              ))}
            </div>
          }
        >
          <select id={fid("budget")} className="field appearance-none" {...aria("budget")} {...register("budget")}>
            <option value="" disabled>
              Choose a range
            </option>
            {BUDGETS[currency as keyof typeof BUDGETS].map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={fid("timeline")} label="Timeline" error={errors.timeline?.message}>
          <select id={fid("timeline")} className="field appearance-none" {...aria("timeline")} {...register("timeline")}>
            <option value="" disabled>
              When do you need it?
            </option>
            {TIMELINES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={fid("description")}
          label="Project description"
          error={errors.description?.message}
          hint="What do you need, who is it for, and is there a deadline or reference you like?"
          className="md:col-span-2"
        >
          <textarea
            id={fid("description")}
            rows={6}
            className="field resize-y"
            {...aria("description", true)}
            {...register("description")}
          />
        </Field>

        {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={fid("website")}>Leave this field empty</label>
          <input id={fid("website")} tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>
        <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-input accent-[hsl(var(--primary))]"
              {...aria("consent")}
              {...register("consent")}
            />
            <span>
              I agree that my details will be stored securely and used only to respond to this enquiry.
              <span className="text-highlight" aria-hidden> *</span>
            </span>
          </label>
          {errors.consent && (
            <p id={`${fid("consent")}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.consent.message}
            </p>
          )}
        </div>
      </fieldset>

      <AnimatePresence>
        {status.kind === "error" && (
          <motion.div
            ref={resultRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm outline-none"
          >
            <p className="font-semibold">{status.message}</p>
            <p className="mt-1 text-muted-foreground">
              Your answers are still here. You can try again, or reach me directly at{" "}
              <a className="font-semibold text-foreground underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>{" "}
              or on{" "}
              <a className="font-semibold text-foreground underline" href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={busy}
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-80 md:w-auto"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send enquiry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
