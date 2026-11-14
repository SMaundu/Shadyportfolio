import { Resend } from "resend";
import { labelFor, type Enquiry } from "../../src/lib/enquiry";
import { config } from "./config";

let resend: Resend | null | undefined;
export function getResend(): Resend | null {
  if (resend !== undefined) return resend;
  const key = config.resendApiKey();
  resend = key ? new Resend(key) : null;
  return resend;
}
export const __resetResend = () => {
  resend = undefined;
};

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const shell = (title: string, body: string) => `<!doctype html>
<html><body style="margin:0;background:#f6f2ec;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1d1010">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eadfd3">
<tr><td style="background:#6a1414;padding:24px 28px;color:#fff">
<div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#f7a306;font-weight:700">Shadrack Maundu</div>
<div style="font-size:22px;font-weight:700;margin-top:6px">${escapeHtml(title)}</div>
</td></tr>
<tr><td style="padding:28px">${body}</td></tr>
<tr><td style="padding:18px 28px;background:#faf6f1;color:#7a6a6a;font-size:12px">Creative Designer | Software Developer · ${escapeHtml(config.siteUrl())}</td></tr>
</table></td></tr></table></body></html>`;

const row = (k: string, v: string) =>
  `<tr><td style="padding:8px 0;color:#7a6a6a;font-size:13px;width:140px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 0;font-size:14px;font-weight:600">${escapeHtml(v)}</td></tr>`;

export function ownerEnquiryEmail(e: Enquiry, reference: string) {
  const subject = `New enquiry: ${labelFor.service(e.service)} from ${e.fullName} [${reference}]`;
  const html = shell(
    "New project enquiry",
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("Reference", reference)}
${row("Name", e.fullName)}
${row("Email", e.email)}
${row("Company", e.company || "-")}
${row("Service", labelFor.service(e.service))}
${row("Budget", labelFor.budget(e.budget))}
${row("Timeline", labelFor.timeline(e.timeline))}
</table>
<div style="margin-top:20px;padding:16px;background:#faf6f1;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(e.description)}</div>
<p style="margin-top:20px;font-size:13px;color:#7a6a6a">Reply to this email to answer ${escapeHtml(e.fullName)} directly.</p>`,
  );
  const text = `New enquiry ${reference}
Name: ${e.fullName}
Email: ${e.email}
Company: ${e.company || "-"}
Service: ${labelFor.service(e.service)}
Budget: ${labelFor.budget(e.budget)}
Timeline: ${labelFor.timeline(e.timeline)}

${e.description}`;
  return { subject, html, text };
}

export function visitorConfirmationEmail(e: Enquiry, reference: string) {
  const first = e.fullName.split(/\s+/)[0];
  const subject = `Thanks for your enquiry, ${first} [${reference}]`;
  const html = shell(
    "I've received your enquiry",
    `<p style="font-size:15px;line-height:1.6">Hi ${escapeHtml(first)},</p>
<p style="font-size:15px;line-height:1.6">Thank you for getting in touch about <strong>${escapeHtml(labelFor.service(e.service))}</strong>. I've received your message and will reply to this address as soon as I can.</p>
<p style="font-size:15px;line-height:1.6">Your reference is <strong>${escapeHtml(reference)}</strong>.</p>
<p style="font-size:15px;line-height:1.6">If you'd like to talk sooner, you can book a consultation at <a href="${escapeHtml(config.siteUrl())}/book" style="color:#6a1414;font-weight:700">${escapeHtml(config.siteUrl().replace(/^https?:\/\//, ""))}/book</a>.</p>
<p style="font-size:15px;line-height:1.6">Shadrack Maundu</p>`,
  );
  const text = `Hi ${first},

Thank you for getting in touch about ${labelFor.service(e.service)}. I've received your message and will reply to this address as soon as I can.

Your reference is ${reference}.

Book a consultation: ${config.siteUrl()}/book

Shadrack Maundu`;
  return { subject, html, text };
}

export interface BookingSummary {
  event: string;
  title: string;
  start?: string;
  end?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  timeZone?: string;
  location?: string;
  notes?: string;
}

export function ownerBookingEmail(b: BookingSummary) {
  const when = b.start ? new Date(b.start).toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "full", timeStyle: "short" }) : "-";
  const verb = { BOOKING_CREATED: "New booking", BOOKING_RESCHEDULED: "Booking rescheduled", BOOKING_CANCELLED: "Booking cancelled" }[b.event] ?? b.event;
  const subject = `${verb}: ${b.attendeeName ?? "Visitor"}, ${when}`;
  const html = shell(
    verb,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("Event", b.title)}
${row("When (Nairobi)", when)}
${row("Name", b.attendeeName ?? "-")}
${row("Email", b.attendeeEmail ?? "-")}
${row("Their time zone", b.timeZone ?? "-")}
${row("Location", b.location ?? "-")}
</table>
${b.notes ? `<div style="margin-top:20px;padding:16px;background:#faf6f1;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(b.notes)}</div>` : ""}`,
  );
  const text = `${verb}
Event: ${b.title}
When (Nairobi): ${when}
Name: ${b.attendeeName ?? "-"}
Email: ${b.attendeeEmail ?? "-"}
Location: ${b.location ?? "-"}
${b.notes ?? ""}`;
  return { subject, html, text };
}
