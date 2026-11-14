import { createHash } from "node:crypto";
import { config } from "./config";

const SECURITY_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...SECURITY_HEADERS, ...headers } });

/** Accept same-site requests only (plus Netlify deploy previews and local dev). */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // same-origin form posts from some browsers omit Origin
  const allowed = config.allowedOrigins();
  if (allowed.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    // Deploy previews / branch deploys: <id>--smaunduportfolio.netlify.app
    return /(^|--)smaunduportfolio\.netlify\.app$/.test(host);
  } catch {
    return false;
  }
}

export function clientIp(req: Request, contextIp?: string): string {
  return (
    contextIp ||
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

/** One-way, salted hash so raw IP addresses are never stored. */
export const hashIdentifier = (value: string) =>
  createHash("sha256").update(`${config.rateLimitSalt()}:${value.toLowerCase()}`).digest("hex");
