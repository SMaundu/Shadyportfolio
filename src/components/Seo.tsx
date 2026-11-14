import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/content/site";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  /** Absolute or root-relative image URL for social cards. */
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const DEFAULT_TITLE = "Shadrack Maundu | Creative Designer & Software Developer";
const DEFAULT_DESC =
  "Shadrack Maundu is a Kenyan brand and graphic designer and software developer. Brand identities, marketing design, websites and mobile apps for businesses, startups and organisations.";

const abs = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

/** Per-route title, description, canonical URL and social card tags. */
export function Seo({ title, description = DEFAULT_DESC, path = "/", image = "/og-image.jpg", type = "website", noindex }: SeoProps) {
  const fullTitle = title ? `${title} | Shadrack Maundu` : DEFAULT_TITLE;
  const url = abs(path);
  const img = abs(image);
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
