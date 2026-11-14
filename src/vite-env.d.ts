/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Cal.com booking link, e.g. "shadrack-maundu/consultation". */
  readonly VITE_CAL_LINK?: string;
  /** Optional: Cal.com origin for EU / self-hosted instances. */
  readonly VITE_CAL_ORIGIN?: string;
  /** Optional: Cal.com embed script URL for EU / self-hosted instances. */
  readonly VITE_CAL_EMBED_JS?: string;
  /** Optional: canonical site URL (defaults to the Netlify URL). */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
