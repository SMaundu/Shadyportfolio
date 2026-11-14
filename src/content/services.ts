export type ServiceGroup = "creative" | "technology";

export interface Service {
  slug: string;
  group: ServiceGroup;
  title: string;
  summary: string;
  includes: string[];
  /** Related work shown as proof (project slugs). */
  proof?: string[];
}

export const services: Service[] = [
  // ---------------------------------------------------------------- creative
  {
    slug: "brand-identity",
    group: "creative",
    title: "Brand Identity Design",
    summary: "A complete visual identity your team can apply consistently, documented in a clear brand guideline.",
    includes: ["Logo system", "Colour & typography", "Patterns & graphic elements", "Brand guideline", "Stationery & templates"],
    proof: ["faithful-two", "amana-insights"],
  },
  {
    slug: "logo-design",
    group: "creative",
    title: "Logo Design",
    summary: "A distinctive mark with the variations you need for print, screens, signage and social profiles.",
    includes: ["Concept exploration", "Primary & secondary logos", "Colour and mono versions", "Export package (PNG, SVG, PDF)"],
    proof: ["selected-logos", "queensway-insurance"],
  },
  {
    slug: "corporate-profiles",
    group: "creative",
    title: "Corporate Profiles",
    summary: "Company profiles, brochures and reports that present your organisation clearly and professionally.",
    includes: ["Content structure", "Layout & typesetting", "Infographics & tables", "Print-ready and digital PDF"],
    proof: ["amana-insights", "fairtrade-sugar-brochure"],
  },
  {
    slug: "marketing-materials",
    group: "creative",
    title: "Marketing Materials",
    summary: "Posters, fliers, billboards, banners and signage designed to be noticed and understood quickly.",
    includes: ["Posters & fliers", "Billboards & roll-up banners", "Signage & lightboxes", "Event materials & merchandise"],
    proof: ["skypeak-golden-hill", "kellian-autogarage"],
  },
  {
    slug: "social-media-graphics",
    group: "creative",
    title: "Social Media Graphics",
    summary: "Consistent campaign graphics and content plans for Facebook, Instagram, LinkedIn, X and YouTube.",
    includes: ["Campaign key visuals", "Weekly post series", "Content calendars", "Covers, thumbnails & stories"],
    proof: ["optimum-prime-social", "talents-night-2026"],
  },
  {
    slug: "presentation-design",
    group: "creative",
    title: "Presentation Design",
    summary: "Pitch decks and presentations with clear structure, on-brand slides and readable data.",
    includes: ["Slide structure", "Branded master templates", "Charts & diagrams", "PowerPoint, Keynote or PDF"],
  },
  // -------------------------------------------------------------- technology
  {
    slug: "frontend-development",
    group: "technology",
    title: "Frontend Development",
    summary: "Fast, accessible, responsive interfaces in React and TypeScript, built from your designs or mine.",
    includes: ["React & TypeScript", "Responsive layouts", "Animations", "API integration"],
    proof: ["portfolio-website", "kemyc-web-platform"],
  },
  {
    slug: "website-development",
    group: "technology",
    title: "Website Development",
    summary: "Business websites and landing pages that look like your brand and are easy for visitors to act on.",
    includes: ["Design & build", "Contact forms & booking", "SEO basics", "Hosting & deployment"],
    proof: ["portfolio-website", "health-information-system"],
  },
  {
    slug: "mobile-app-development",
    group: "technology",
    title: "Mobile App Development",
    summary: "Android and cross-platform apps with Flutter or Java, including payments and maps.",
    includes: ["Flutter & Android (Java)", "Firebase & MySQL", "M-Pesa Daraja integration", "Google Maps"],
    proof: ["qless-commute"],
  },
  {
    slug: "ui-ux-design",
    group: "technology",
    title: "UI/UX Design",
    summary: "User flows and interface designs for web and mobile, ready to build.",
    includes: ["User flows", "Wireframes", "High-fidelity UI in Figma", "Design hand-off"],
    proof: ["qless-commute"],
  },
  {
    slug: "digital-product-development",
    group: "technology",
    title: "Digital Product Development",
    summary: "From idea to working product: brand, interface and code, handled by one person who speaks both design and development.",
    includes: ["Product scoping", "Brand + UI", "MVP development", "Launch support"],
    proof: ["qless-commute", "portfolio-website"],
  },
];

export const serviceOptions = services.map((s) => ({ value: s.slug, label: s.title }));
