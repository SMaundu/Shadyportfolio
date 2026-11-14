import type { Config } from "@netlify/functions";
import { createHmac, timingSafeEqual } from "node:crypto";
import { config as env } from "../lib/config";
import { getResend, ownerBookingEmail } from "../lib/email";
import { json } from "../lib/http";
import { getSupabase } from "../lib/supabase";

const STATUS: Record<string, string> = {
  BOOKING_CREATED: "accepted",
  BOOKING_REQUESTED: "pending",
  BOOKING_RESCHEDULED: "accepted",
  BOOKING_CANCELLED: "cancelled",
  BOOKING_REJECTED: "rejected",
};

/** Cal.com signs the raw body with HMAC-SHA256 (hex) in `x-cal-signature-256`. */
export function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

interface Attendee {
  name?: string;
  email?: string;
  timeZone?: string;
}
interface CalPayload {
  uid?: string;
  bookingId?: number;
  title?: string;
  type?: string;
  eventTypeId?: number;
  startTime?: string;
  endTime?: string;
  attendees?: Attendee[];
  location?: string;
  additionalNotes?: string;
  description?: string;
  rescheduleUid?: string;
  cancellationReason?: string;
  status?: string;
}

/**
 * POST /api/cal-webhook
 * Receives Cal.com booking events, stores them in Supabase and notifies Shadrack.
 * Visitors get their confirmation and calendar invite from Cal.com itself.
 */
export default async (req: Request) => {
  if (req.method !== "POST") return json(405, { ok: false }, { Allow: "POST" });
  const secret = env.calWebhookSecret();
  if (!secret) {
    console.error("cal-webhook: CAL_WEBHOOK_SECRET is not set");
    return json(503, { ok: false, message: "Webhook not configured." });
  }

  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-cal-signature-256"), secret)) {
    return json(401, { ok: false, message: "Invalid signature." });
  }

  let event: { triggerEvent?: string; payload?: CalPayload };
  try {
    event = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, message: "Invalid JSON." });
  }

  const trigger = event.triggerEvent ?? "UNKNOWN";
  if (trigger === "PING") return json(200, { ok: true, pong: true });
  if (!(trigger in STATUS)) return json(200, { ok: true, ignored: trigger });

  const p = event.payload ?? {};
  const attendee = p.attendees?.[0] ?? {};
  const db = getSupabase();
  let stored = false;

  if (db && p.uid) {
    const { error } = await db.from("bookings").upsert(
      {
        cal_uid: p.uid,
        cal_booking_id: p.bookingId ?? null,
        last_event: trigger,
        status: STATUS[trigger],
        event_type: p.type ?? null,
        title: p.title ?? null,
        start_time: p.startTime ?? null,
        end_time: p.endTime ?? null,
        attendee_name: attendee.name ?? null,
        attendee_email: attendee.email ?? null,
        attendee_timezone: attendee.timeZone ?? null,
        location: p.location ?? null,
        notes: p.additionalNotes ?? p.description ?? null,
        cancellation_reason: p.cancellationReason ?? null,
        rescheduled_from: p.rescheduleUid ?? null,
        payload: p,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cal_uid" },
    );
    if (error) console.error("cal-webhook: upsert failed:", error.message);
    else stored = true;

    if (trigger === "BOOKING_RESCHEDULED" && p.rescheduleUid && p.rescheduleUid !== p.uid) {
      await db
        .from("bookings")
        .update({ status: "rescheduled", updated_at: new Date().toISOString() })
        .eq("cal_uid", p.rescheduleUid);
    }
  }

  const resend = getResend();
  if (resend && ["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED", "BOOKING_REQUESTED"].includes(trigger)) {
    const mail = ownerBookingEmail({
      event: trigger,
      title: p.title ?? "Consultation",
      start: p.startTime,
      end: p.endTime,
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      timeZone: attendee.timeZone,
      location: p.location,
      notes: p.additionalNotes ?? p.cancellationReason,
    });
    const { error } = await resend.emails.send({
      from: env.resendFrom(),
      to: [env.notifyEmail()],
      ...(attendee.email ? { replyTo: attendee.email } : {}),
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      tags: [{ name: "type", value: "booking" }],
    });
    if (error) console.error("cal-webhook: email failed:", error.message);
  }

  return json(200, { ok: true, stored });
};

export const config: Config = { path: "/api/cal-webhook", method: ["POST"] };
