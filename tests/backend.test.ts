import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { enquirySchema } from "../src/lib/enquiry";

// ---------------------------------------------------------------- mocks
const db = {
  inserts: [] as Record<string, unknown>[],
  updates: [] as Record<string, unknown>[],
  upserts: [] as Record<string, unknown>[],
  insertError: null as null | { message: string },
  rpcResult: true as boolean,
  from: vi.fn((table: string) => ({
    insert: async (row: Record<string, unknown>) => {
      db.inserts.push({ table, ...row });
      return { error: db.insertError };
    },
    update: (row: Record<string, unknown>) => ({
      eq: async (col: string, val: unknown) => {
        db.updates.push({ table, ...row, [col]: val });
        return { error: null };
      },
    }),
    upsert: async (row: Record<string, unknown>) => {
      db.upserts.push({ table, ...row });
      return { error: null };
    },
  })),
  rpc: vi.fn(async () => ({ data: db.rpcResult, error: null })),
};
let dbEnabled = true;

const sent: Record<string, unknown>[] = [];
let sendError: null | { message: string } = null;
const resend = { emails: { send: vi.fn(async (msg: Record<string, unknown>) => (sent.push(msg), { data: { id: "x" }, error: sendError })) } };

vi.mock("../netlify/lib/supabase", () => ({ getSupabase: () => (dbEnabled ? db : null) }));
vi.mock("../netlify/lib/email", async (orig) => ({
  ...(await orig<typeof import("../netlify/lib/email")>()),
  getResend: () => resend,
}));

const { default: enquiry, makeReference } = await import("../netlify/functions/enquiry.mts");
const { default: calWebhook, verifySignature } = await import("../netlify/functions/cal-webhook.mts");
const { __resetMemoryLimits } = await import("../netlify/lib/rate-limit");

// --------------------------------------------------------------- helpers
const valid = () => ({
  fullName: "Jane Wanjiru",
  email: "jane@example.com",
  company: "Acme Ltd",
  service: "brand-identity",
  budgetCurrency: "KES",
  budget: "kes-50k-150k",
  timeline: "1-3-months",
  description: "We need a new logo and brand guideline for our consultancy launch.",
  consent: true,
  website: "",
  startedAt: Date.now() - 20_000,
});

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost:8080/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:8080", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const ctx = (ip = "203.0.113.7") => ({ ip }) as never;

beforeEach(() => {
  db.inserts = [];
  db.updates = [];
  db.upserts = [];
  db.insertError = null;
  db.rpcResult = true;
  dbEnabled = true;
  sent.length = 0;
  sendError = null;
  __resetMemoryLimits();
  delete process.env.SEND_VISITOR_CONFIRMATION;
  process.env.NOTIFY_EMAIL = "shadrackmaundu007@gmail.com";
  process.env.CAL_WEBHOOK_SECRET = "test-secret";
});

// ---------------------------------------------------------------- schema
describe("enquiry schema", () => {
  it("accepts a complete enquiry and trims text", () => {
    const r = enquirySchema.safeParse({ ...valid(), fullName: "  Jane Wanjiru  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.fullName).toBe("Jane Wanjiru");
  });

  it.each([
    ["email", { email: "not-an-email" }],
    ["description", { description: "too short" }],
    ["consent", { consent: false }],
    ["service", { service: "hacking" }],
    ["budget", { budgetCurrency: "USD", budget: "kes-50k-150k" }],
  ])("rejects an invalid %s", (field, patch) => {
    const r = enquirySchema.safeParse({ ...valid(), ...patch });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.map((i) => i.path[0])).toContain(field);
  });

  it("makes readable references", () => {
    expect(makeReference(new Date("2026-11-14T10:00:00Z"))).toMatch(/^SM-261114-[A-Z2-9]{4}$/);
  });
});

// ------------------------------------------------------- enquiry function
describe("POST /api/enquiry", () => {
  it("stores the enquiry and notifies Shadrack", async () => {
    const res = await enquiry(post(valid()), ctx());
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reference).toMatch(/^SM-/);
    expect(body.confirmationSent).toBe(false);

    expect(db.inserts).toHaveLength(1);
    expect(db.inserts[0]).toMatchObject({ table: "enquiries", full_name: "Jane Wanjiru", email: "jane@example.com", service: "brand-identity" });
    expect(String(db.inserts[0].ip_hash)).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(db.inserts[0])).not.toContain("203.0.113.7");

    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ to: ["shadrackmaundu007@gmail.com"], replyTo: "jane@example.com" });
    expect(String(sent[0].subject)).toContain("Brand Identity Design");
    expect(db.updates[0]).toMatchObject({ owner_notified: true, visitor_confirmed: false });
  });

  it("sends a visitor confirmation only when enabled", async () => {
    process.env.SEND_VISITOR_CONFIRMATION = "true";
    const res = await enquiry(post(valid()), ctx("198.51.100.1"));
    const body = await res.json();
    expect(body.confirmationSent).toBe(true);
    expect(sent).toHaveLength(2);
    expect(sent[1]).toMatchObject({ to: ["jane@example.com"] });
  });

  it("escapes HTML in notification emails", async () => {
    await enquiry(post({ ...valid(), description: "<script>alert(1)</script> please design our new brand identity" }), ctx("198.51.100.2"));
    expect(String(sent[0].html)).not.toContain("<script>");
    expect(String(sent[0].html)).toContain("&lt;script&gt;");
  });

  it("returns field errors for invalid input", async () => {
    const res = await enquiry(post({ ...valid(), email: "nope", description: "short" }), ctx());
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(Object.keys(body.errors)).toEqual(expect.arrayContaining(["email", "description"]));
    expect(db.inserts).toHaveLength(0);
    expect(sent).toHaveLength(0);
  });

  it("rejects the honeypot, instant submissions and link spam", async () => {
    expect((await enquiry(post({ ...valid(), website: "http://spam" }), ctx())).status).toBe(422);
    expect((await enquiry(post({ ...valid(), startedAt: Date.now() - 500 }), ctx())).status).toBe(422);
    const spammy = { ...valid(), description: "buy now http://a.com http://b.com http://c.com http://d.com cheap" };
    expect((await enquiry(post(spammy), ctx())).status).toBe(422);
    expect(db.inserts).toHaveLength(0);
  });

  it("rate-limits repeated submissions (database limiter)", async () => {
    db.rpcResult = false;
    const res = await enquiry(post(valid()), ctx());
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("600");
  });

  it("rate-limits with the in-memory fallback when the database is unavailable", async () => {
    dbEnabled = false;
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) statuses.push((await enquiry(post(valid()), ctx("192.0.2.50"))).status);
    expect(statuses).toEqual([200, 200, 200, 429]);
  });

  it("blocks other origins, wrong methods and non-JSON", async () => {
    expect((await enquiry(post(valid(), { origin: "https://evil.example" }), ctx())).status).toBe(403);
    expect((await enquiry(new Request("http://localhost/api/enquiry"), ctx())).status).toBe(405);
    expect((await enquiry(post("a=b", { "content-type": "application/x-www-form-urlencoded" }), ctx())).status).toBe(415);
    expect((await enquiry(post("{not json"), ctx())).status).toBe(400);
  });

  it("allows Netlify deploy previews", async () => {
    const res = await enquiry(post(valid(), { origin: "https://deploy-preview-3--smaunduportfolio.netlify.app" }), ctx("192.0.2.9"));
    expect(res.status).toBe(200);
  });

  it("still succeeds when only email delivery works", async () => {
    db.insertError = { message: "db down" };
    const res = await enquiry(post(valid()), ctx("192.0.2.10"));
    expect(res.status).toBe(200);
  });

  it("fails loudly when nothing could be stored or sent", async () => {
    db.insertError = { message: "db down" };
    sendError = { message: "resend down" };
    const res = await enquiry(post(valid()), ctx("192.0.2.11"));
    expect(res.status).toBe(502);
  });
});

// ------------------------------------------------------------ cal webhook
const signed = (payload: unknown, secret = "test-secret") => {
  const raw = JSON.stringify(payload);
  return new Request("http://localhost:8080/api/cal-webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "x-cal-signature-256": createHmac("sha256", secret).update(raw).digest("hex") },
    body: raw,
  });
};

describe("POST /api/cal-webhook", () => {
  const booking = {
    triggerEvent: "BOOKING_CREATED",
    payload: {
      uid: "abc123",
      bookingId: 42,
      title: "Consultation between Shadrack Maundu and Jane",
      type: "consultation",
      startTime: "2026-11-20T07:00:00Z",
      endTime: "2026-11-20T07:30:00Z",
      attendees: [{ name: "Jane", email: "jane@example.com", timeZone: "Africa/Nairobi" }],
      location: "integrations:google:meet",
    },
  };

  it("verifies signatures", () => {
    const raw = '{"a":1}';
    const sig = createHmac("sha256", "s").update(raw).digest("hex");
    expect(verifySignature(raw, sig, "s")).toBe(true);
    expect(verifySignature(raw, sig, "other")).toBe(false);
    expect(verifySignature(raw, null, "s")).toBe(false);
  });

  it("rejects unsigned or wrongly signed requests", async () => {
    expect((await calWebhook(signed(booking, "wrong"))).status).toBe(401);
    expect(db.upserts).toHaveLength(0);
  });

  it("answers Cal.com's ping", async () => {
    const res = await calWebhook(signed({ triggerEvent: "PING", payload: {} }));
    expect(res.status).toBe(200);
  });

  it("stores bookings and notifies Shadrack", async () => {
    const res = await calWebhook(signed(booking));
    expect(res.status).toBe(200);
    expect(db.upserts[0]).toMatchObject({
      table: "bookings",
      cal_uid: "abc123",
      status: "accepted",
      attendee_email: "jane@example.com",
      start_time: "2026-11-20T07:00:00Z",
    });
    expect(sent[0]).toMatchObject({ to: ["shadrackmaundu007@gmail.com"], replyTo: "jane@example.com" });
    expect(String(sent[0].subject)).toMatch(/^New booking: Jane/);
  });

  it("marks cancellations and the original booking of a reschedule", async () => {
    await calWebhook(signed({ ...booking, triggerEvent: "BOOKING_CANCELLED" }));
    expect(db.upserts[0]).toMatchObject({ status: "cancelled" });
    await calWebhook(signed({ triggerEvent: "BOOKING_RESCHEDULED", payload: { ...booking.payload, uid: "new1", rescheduleUid: "abc123" } }));
    expect(db.updates.at(-1)).toMatchObject({ status: "rescheduled", cal_uid: "abc123" });
  });
});
