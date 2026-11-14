/**
 * Server-side configuration. All secrets come from environment variables set in
 * Netlify (Site configuration -> Environment variables) or a local .env file.
 * Nothing in this folder is ever shipped to the browser.
 */
const read = (key: string): string | undefined => {
  const v = process.env[key];
  return v && v.trim() ? v.trim() : undefined;
};

export const config = {
  supabaseUrl: () => read("SUPABASE_URL"),
  supabaseServiceKey: () => read("SUPABASE_SERVICE_ROLE_KEY"),
  resendApiKey: () => read("RESEND_API_KEY"),
  /** Sender. Without a verified domain Resend only allows onboarding@resend.dev. */
  resendFrom: () => read("RESEND_FROM") ?? "Shadrack Maundu Portfolio <onboarding@resend.dev>",
  notifyEmail: () => read("NOTIFY_EMAIL") ?? "shadrackmaundu007@gmail.com",
  /** Only enable once RESEND_FROM uses a domain verified in Resend. */
  sendVisitorConfirmation: () => read("SEND_VISITOR_CONFIRMATION") === "true",
  rateLimitSalt: () => read("RATE_LIMIT_SALT") ?? "change-me",
  calWebhookSecret: () => read("CAL_WEBHOOK_SECRET"),
  siteUrl: () => read("URL") ?? read("SITE_URL") ?? "https://smaunduportfolio.netlify.app",
  /** Extra allowed origins, comma separated. Netlify's URL / DEPLOY_PRIME_URL are always allowed. */
  allowedOrigins: () =>
    [
      read("URL"),
      read("DEPLOY_PRIME_URL"),
      read("DEPLOY_URL"),
      "https://smaunduportfolio.netlify.app",
      "http://localhost:8080",
      "http://localhost:8888",
      "http://127.0.0.1:8080",
      ...(read("ALLOWED_ORIGINS")?.split(",").map((s) => s.trim()) ?? []),
    ].filter((v): v is string => !!v),
};
