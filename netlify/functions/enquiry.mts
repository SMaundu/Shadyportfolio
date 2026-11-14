import type { Config, Context } from "@netlify/functions";
import { randomBytes } from "node:crypto";
import { MAX_LINKS, MIN_FILL_MS, countLinks, enquirySchema, type Enquiry } from "../../src/lib/enquiry";
import { config as env } from "../lib/config";
import { getResend, ownerEnquiryEmail, visitorConfirmationEmail } from "../lib/email";
import { clientIp, hashIdentifier, isAllowedOrigin, json } from "../lib/http";
import { allow } from "../lib/rate-limit";
import { getSupabase } from "../lib/supabase";

const MAX_BODY_BYTES = 16_000;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Human-friendly reference, e.g. SM-261114-7K3Q. */
export function makeReference(now = new Date()): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = [...randomBytes(4)].map((b) => ALPHABET[b % ALPHABET.length]).join("");
  return `SM-${d}-${rand}`;
}

const firstErrors = (issues: { path: (string | number)[]; message: string }[]) => {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
};

/**
 * POST /api/enquiry
 * Validates, spam-checks and rate-limits a project enquiry, stores it in
 * Supabase and emails a notification (and optionally a visitor confirmation)
 * through Resend.
 */
export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return json(405, { ok: false, message: "Method not allowed." }, { Allow: "POST" });
  if (!isAllowedOrigin(req.headers.get("origin"))) return json(403, { ok: false, message: "Forbidden." });
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return json(415, { ok: false, message: "Expected JSON." });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, message: "Your message is too long." });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, message: "Invalid request." });
  }

  // Spam checks before full validation so bots learn nothing useful.
  const b = (body ?? {}) as Record<string, unknown>;
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return json(422, { ok: false, message: "Your enquiry couldn't be accepted." });
  }
  const startedAt = Number(b.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS || startedAt > Date.now() + 60_000) {
    return json(422, { ok: false, message: "That was very fast. Please review your details and send again." });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return json(400, { ok: false, message: "Please check the highlighted fields.", errors: firstErrors(parsed.error.issues) });
  }
  const enquiry: Enquiry = parsed.data;
  if (countLinks(enquiry.description) > MAX_LINKS) {
    return json(422, {
      ok: false,
      errors: { description: `Please include no more than ${MAX_LINKS} links.` },
      message: "Please check the highlighted fields.",
    });
  }

  const db = getSupabase();
  const resend = getResend();
  if (!db && !resend) {
    console.error("enquiry: neither Supabase nor Resend is configured");
    return json(503, { ok: false, message: "The enquiry service isn't available right now." });
  }

  const ipHash = hashIdentifier(clientIp(req, context?.ip));
  const emailHash = hashIdentifier(enquiry.email);
  const limit = await allow(db, [
    { bucket: "enquiry:ip:10m", key: ipHash, windowSeconds: 600, max: 3 },
    { bucket: "enquiry:ip:1d", key: ipHash, windowSeconds: 86_400, max: 10 },
    { bucket: "enquiry:email:1d", key: emailHash, windowSeconds: 86_400, max: 5 },
  ]);
  if (!limit.ok) {
    return json(
      429,
      { ok: false, message: "You've sent several enquiries in a short time. Please wait a while and try again." },
      { "Retry-After": String(limit.retryAfter ?? 600) },
    );
  }

  const reference = makeReference();
  let stored = false;
  if (db) {
    const { error } = await db.from("enquiries").insert({
      reference,
      full_name: enquiry.fullName,
      email: enquiry.email,
      company: enquiry.company || null,
      service: enquiry.service,
      budget_currency: enquiry.budgetCurrency,
      budget: enquiry.budget,
      timeline: enquiry.timeline,
      description: enquiry.description,
      consent: enquiry.consent,
      ip_hash: ipHash,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      origin: req.headers.get("origin"),
    });
    if (error) console.error("enquiry: insert failed:", error.message);
    else stored = true;
  }

  let notified = false;
  let confirmationSent = false;
  if (resend) {
    const owner = ownerEnquiryEmail(enquiry, reference);
    const { error } = await resend.emails.send({
      from: env.resendFrom(),
      to: [env.notifyEmail()],
      replyTo: enquiry.email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
      tags: [{ name: "type", value: "enquiry" }],
    });
    if (error) console.error("enquiry: owner email failed:", error.message);
    else notified = true;

    if (env.sendVisitorConfirmation()) {
      const visitor = visitorConfirmationEmail(enquiry, reference);
      const res = await resend.emails.send({
        from: env.resendFrom(),
        to: [enquiry.email],
        replyTo: env.notifyEmail(),
        subject: visitor.subject,
        html: visitor.html,
        text: visitor.text,
        tags: [{ name: "type", value: "enquiry-confirmation" }],
      });
      if (res.error) console.error("enquiry: visitor confirmation failed:", res.error.message);
      else confirmationSent = true;
    }
  }

  if (db && stored) {
    const { error } = await db
      .from("enquiries")
      .update({ owner_notified: notified, visitor_confirmed: confirmationSent })
      .eq("reference", reference);
    if (error) console.error("enquiry: status update failed:", error.message);
  }

  if (!stored && !notified) {
    return json(502, { ok: false, message: "Your enquiry couldn't be delivered. Please try again shortly." });
  }

  return json(200, { ok: true, reference, confirmationSent });
};

export const config: Config = { path: "/api/enquiry", method: ["POST"] };
