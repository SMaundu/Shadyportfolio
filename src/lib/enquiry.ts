/**
 * Enquiry form schema, shared by the browser form and the Netlify Function so
 * both validate exactly the same way. Keep imports relative (no "@/" alias):
 * this file is bundled into the serverless function too.
 */
import { z } from "zod";
import { services } from "../content/services";

export const SERVICE_VALUES = ["other", ...services.map((s) => s.slug)] as [string, ...string[]];

export const CURRENCIES = ["KES", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const BUDGETS: Record<Currency, { value: string; label: string }[]> = {
  KES: [
    { value: "kes-under-20k", label: "Under KES 20,000" },
    { value: "kes-20k-50k", label: "KES 20,000 – 50,000" },
    { value: "kes-50k-150k", label: "KES 50,000 – 150,000" },
    { value: "kes-150k-400k", label: "KES 150,000 – 400,000" },
    { value: "kes-400k-plus", label: "KES 400,000+" },
    { value: "not-sure", label: "Not sure yet" },
  ],
  USD: [
    { value: "usd-under-150", label: "Under $150" },
    { value: "usd-150-400", label: "$150 – $400" },
    { value: "usd-400-1200", label: "$400 – $1,200" },
    { value: "usd-1200-3000", label: "$1,200 – $3,000" },
    { value: "usd-3000-plus", label: "$3,000+" },
    { value: "not-sure", label: "Not sure yet" },
  ],
};

export const TIMELINES = [
  { value: "asap", label: "As soon as possible (under 2 weeks)" },
  { value: "2-4-weeks", label: "2 – 4 weeks" },
  { value: "1-3-months", label: "1 – 3 months" },
  { value: "3-months-plus", label: "More than 3 months" },
  { value: "flexible", label: "Flexible" },
] as const;

const TIMELINE_VALUES = TIMELINES.map((t) => t.value) as [string, ...string[]];
const ALL_BUDGET_VALUES = [...new Set(Object.values(BUDGETS).flat().map((b) => b.value))] as [string, ...string[]];

/** Minimum time (ms) a human needs to fill the form; faster submissions are treated as bots. */
export const MIN_FILL_MS = 3000;

const trimmed = (min: number, max: number, msg: string) =>
  z
    .string({ required_error: msg })
    .transform((s) => s.trim())
    .pipe(z.string().min(min, msg).max(max, `Please keep this under ${max} characters.`));

export const enquirySchema = z
  .object({
    fullName: trimmed(2, 120, "Please enter your full name."),
    email: z
      .string({ required_error: "Please enter your email address." })
      .trim()
      .min(1, "Please enter your email address.")
      .max(200)
      .email("Please enter a valid email address."),
    company: z.string().trim().max(160, "Please keep this under 160 characters.").optional().default(""),
    service: z.enum(SERVICE_VALUES, { errorMap: () => ({ message: "Please choose a service." }) }),
    budgetCurrency: z.enum(CURRENCIES),
    budget: z.enum(ALL_BUDGET_VALUES, { errorMap: () => ({ message: "Please choose a budget range." }) }),
    timeline: z.enum(TIMELINE_VALUES, { errorMap: () => ({ message: "Please choose a timeline." }) }),
    description: trimmed(30, 4000, "Please describe your project in at least 30 characters."),
    consent: z.literal(true, { errorMap: () => ({ message: "Please agree so I can store and reply to your enquiry." }) }),
    /** Honeypot. Real visitors never see or fill this field. */
    website: z.string().max(0).optional().default(""),
    /** Epoch ms when the form was first shown. */
    startedAt: z.number().int().positive(),
  })
  .superRefine((v, ctx) => {
    if (v.budget !== "not-sure" && !v.budget.startsWith(v.budgetCurrency.toLowerCase())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["budget"], message: "Please choose a budget range." });
    }
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export const labelFor = {
  service: (v: string) => services.find((s) => s.slug === v)?.title ?? "Other",
  budget: (v: string) => Object.values(BUDGETS).flat().find((b) => b.value === v)?.label ?? v,
  timeline: (v: string) => TIMELINES.find((t) => t.value === v)?.label ?? v,
};

/** Count links in free text. Lots of URLs is a strong spam signal. */
export const countLinks = (s: string) => (s.match(/https?:\/\/|www\./gi) ?? []).length;
export const MAX_LINKS = 3;

export interface EnquiryResponse {
  ok: boolean;
  reference?: string;
  message?: string;
  errors?: Record<string, string>;
}
