import type { MediaId } from "./media.generated";

/**
 * Selected work (six projects, chosen by Shadrack).
 *
 * Content rules:
 *  - Only real work from his files and CVs.
 *  - No invented clients, briefs, metrics or results. Descriptions state what was
 *    designed and what is visible in the deliverables.
 *  - Years come from the source files' dates; roles for employer work come from the CVs.
 */

export type CategoryId = "brand" | "graphic" | "corporate" | "marketing";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "brand", label: "Brand Identity" },
  { id: "marketing", label: "Marketing & Campaigns" },
  { id: "graphic", label: "Graphic Design" },
  { id: "corporate", label: "Corporate & Editorial" },
];

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;

export interface GalleryItem {
  id: MediaId;
  caption?: string;
  /** Logos / documents shown whole on a backdrop instead of cropped. */
  fit?: "contain";
  /** Backdrop for contained / transparent artwork. */
  bg?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Short label shown on the card, e.g. "Brand Identity". */
  kind: string;
  client?: string;
  categories: CategoryId[];
  year: string;
  summary: string;
  cover: MediaId;
  role: string;
  deliverables: string[];
  tools: string[];
  overview: string[];
  sections?: { heading: string; body: string }[];
  gallery: GalleryItem[];
  /** Shown as a badge, e.g. competition entries. */
  note?: string;
  /** Accent colour used on the case-study page. */
  accent?: string;
}

const ids = (prefix: string, names: string[]): GalleryItem[] => names.map((n) => ({ id: `${prefix}/${n}` as MediaId }));

export const projects: Project[] = [
  {
    slug: "faithful-two",
    title: "Faithful Two",
    kind: "Brand Identity",
    client: "Faithful Two",
    categories: ["brand"],
    year: "2026",
    summary:
      "A full brand identity for Faithful Two, “God's Original Design”: logo system, pattern, a 36-page brand guideline, stationery and merchandise.",
    cover: "faithful-two/billboard",
    role: "Brand identity designer",
    deliverables: [
      "Logo, logomark and tagline lock-ups",
      "Logo construction grid",
      "Brand pattern in two colourways",
      "36-page brand guideline",
      "Business card and letterhead",
      "Social media profiles and cover images",
      "Merchandise, signage and billboard mock-ups",
    ],
    tools: ["Adobe Illustrator", "Affinity Designer", "Adobe Photoshop"],
    overview: [
      "Faithful Two's identity is built around its line “God's Original Design”. The logomark pairs two rounded forms with two dots, and the same shapes repeat as a burgundy and gold pattern across every touchpoint.",
      "A 36-page brand guideline documents the system: mission and vision, values, audience, the logo and its meaning, construction, patterns, typography (Utendo and Source Sans Pro), colour, imagery and applications.",
    ],
    gallery: [
      { id: "faithful-two/logo", fit: "contain", bg: "#f7efe6", caption: "Primary logo with tagline" },
      ...ids("faithful-two", [
        "guide-cover", "guide-meaning", "guide-construction", "geometry", "guide-patterns", "guide-type",
        "guide-colour", "guide-imagery", "pattern", "stationery", "business-card", "signage", "youtube",
        "hoodie", "tshirt", "mug", "notebook", "pencil", "polo", "tote",
      ]),
    ],
    accent: "#8b1a2b",
  },
  {
    slug: "optimum-prime-social",
    title: "Optimum Prime Solutions",
    kind: "Social Media, Marketing & Campaigns",
    client: "Optimum Prime Solutions",
    categories: ["marketing", "graphic"],
    year: "2026",
    summary:
      "Four months running Facebook and Instagram for a business-software company: content plans and weekly campaign graphics for Tally Prime, in English and Swahili.",
    cover: "optimum-prime/cover",
    role: "Social Media Manager & Graphic Designer (Feb – May 2026)",
    deliverables: [
      "Monthly content plans",
      "Weekly campaign posts for Tally Prime",
      "Product adverts",
      "Holiday and seasonal posts",
      "Account management on Facebook and Instagram",
    ],
    tools: ["Adobe Photoshop"],
    overview: [
      "From February to May 2026 I managed Optimum Prime Solutions' Facebook and Instagram accounts, planning the monthly content and designing every post.",
      "Most posts promote Tally Prime business software (accounting, payroll, inventory, compliance and reporting) in a mix of English and Swahili for Kenyan small businesses, alongside holiday posts such as Easter, Labour Day and Madaraka Day.",
    ],
    gallery: ids("optimum-prime", [
      "prime-1", "tally-ad", "april-13", "april-15", "april-22", "april-6", "march-2", "may-11", "may-22",
      "tally-2", "wed-11-3", "mon-16-3", "fri-20-3", "follow", "june-1", "april-29", "22nd-march", "madaraka",
    ]),
    accent: "#2433c9",
  },
  {
    slug: "selected-logos",
    title: "Selected Logos",
    kind: "Logo Design",
    client: "Various",
    categories: ["brand"],
    year: "2026",
    summary:
      "Logomarks for an insurance agency, a property manager, a garage, beauty brands, ministries and campus groups, plus my own Shadesigns brand.",
    cover: "logofolio/cover",
    role: "Logo designer",
    deliverables: ["Logos and logo variations", "Logo guidelines and brand boards", "Business cards"],
    tools: ["Adobe Illustrator", "Affinity Designer"],
    overview: [
      "A selection of marks from my source files: Queensway Insurance Agencies (with its logo guideline), The Myrtle property management company (with its brand board), Kellian Autogarage, Evie's Glam Scents & Cosmetics, Luxe Beauty & Fashion, Decor Ministry, Helpmate Errands, The Grace Community, the JKUATCU Sunday School Ministry and Yelklin Solutions.",
      "It also includes Shadesigns, my own design brand: an angular “S” in orange-red and dark brown with the tagline “Designs That Convert”.",
    ],
    gallery: [
      { id: "logofolio/queensway", fit: "contain", bg: "#ffffff", caption: "Queensway Insurance Agencies" },
      { id: "logofolio/queensway-guide", fit: "contain", bg: "#f3f1ea", caption: "Queensway logo guideline" },
      { id: "logofolio/myrtle", fit: "contain", bg: "#ffffff", caption: "The Myrtle" },
      { id: "logofolio/myrtle-board", fit: "contain", bg: "#f2f5ef", caption: "The Myrtle brand board" },
      { id: "logofolio/kellian", fit: "contain", bg: "#ffffff", caption: "Kellian Autogarage" },
      { id: "logofolio/evie", fit: "contain", bg: "#fbf6f1", caption: "Evie's Glam Scents & Cosmetics" },
      { id: "logofolio/luxe", fit: "contain", bg: "#ffffff", caption: "Luxe Beauty & Fashion" },
      { id: "logofolio/decor", fit: "contain", bg: "#ffffff", caption: "Decor Ministry" },
      { id: "logofolio/helpmate", fit: "contain", bg: "#ffffff", caption: "Helpmate Errands" },
      { id: "logofolio/grace-community", fit: "contain", bg: "#ffffff", caption: "The Grace Community" },
      { id: "logofolio/sunday-school", fit: "contain", bg: "#ffffff", caption: "JKUATCU Sunday School Ministry" },
      { id: "logofolio/yelklin-card", fit: "contain", bg: "#eef1f6", caption: "Yelklin Solutions business card" },
      { id: "logofolio/shadesigns", fit: "contain", bg: "#ffffff", caption: "Shadesigns, my design brand" },
    ],
    accent: "#b4842a",
  },
  {
    slug: "au-theme-2027",
    title: "AU Theme of the Year 2027",
    kind: "Competition Entry",
    client: "Competition entry",
    categories: ["brand"],
    year: "2026",
    summary:
      "My logo concept for the African Union's 2027 theme on the Single African Air Transport Market (SAATM), with event applications.",
    cover: "au-2027/backdrop",
    role: "Logo designer",
    note: "Competition entry",
    deliverables: [
      "Primary logo",
      "Versions on white, green and gold backgrounds",
      "Event backdrop, roll-up banner and teardrop flag mock-ups",
    ],
    tools: ["Affinity Designer", "Adobe Illustrator", "Adobe Photoshop"],
    overview: [
      "My entry to the African Union's logo competition for its 2027 theme: “Year of Single African Air Transport Market (SAATM) and New Technologies: Leveraging the Full Potential of SAATM & New Technologies for Continental Integration.” It is a competition submission, not an official AU logo.",
      "The mark places an aircraft over a map of Africa, alongside a “Celebrating 25 years” badge, in green and gold. I prepared it in several colour versions and showed it on event materials.",
    ],
    gallery: [
      { id: "au-2027/preview", fit: "contain", bg: "#ffffff", caption: "Logo on white, green and gold" },
      { id: "au-2027/logo", fit: "contain", bg: "#ffffff" },
      { id: "au-2027/rollup" },
      { id: "au-2027/teardrop" },
    ],
    accent: "#1f7a3a",
  },
  {
    slug: "amana-insights",
    title: "Amana Insights",
    kind: "Brand Identity & Corporate",
    client: "Amana Insights",
    categories: ["brand", "corporate"],
    year: "2026",
    summary:
      "Logo, logo guideline, company profile and letterhead for a finance and business strategy consultancy. Built on Trust, Driven by Insight.",
    cover: "amana-insights/cover",
    role: "Brand and editorial designer",
    deliverables: [
      "Primary logo and logomark",
      "Versions for light, dark and orange backgrounds",
      "Logo guideline: colour palette and typography",
      "9-page company profile",
      "Letterhead",
    ],
    tools: ["Adobe Illustrator"],
    overview: [
      "Amana Insights is a finance and business strategy consultancy. The logo combines an “A” and an “i” into one mark, set in deep royal purple and vibrant orange with Poppins as the typeface, and comes in versions for light, dark and orange backgrounds.",
      "The identity carries into the company profile (cover, contents, about us, mission, vision and core values, services and contacts) and the letterhead.",
    ],
    gallery: [
      { id: "amana-insights/logo", fit: "contain", bg: "#ffffff", caption: "Primary logo" },
      { id: "amana-insights/mark", fit: "contain", bg: "#f7f5ff", caption: "Logomark" },
      { id: "amana-insights/logo-dark", fit: "contain", bg: "#1b1464" },
      { id: "amana-insights/logo-orange", fit: "contain", bg: "#f7941d" },
      { id: "amana-insights/guide", fit: "contain", bg: "#f4f1fb", caption: "Logo guideline" },
      ...ids("amana-insights", ["profile-cover", "profile-contents", "profile-about", "profile-mission", "profile-services", "profile-back"]),
      { id: "amana-insights/letterhead", fit: "contain", bg: "#e9e6f2", caption: "Letterhead" },
    ],
    accent: "#2a1f7a",
  },
  {
    slug: "grace-community-fellowship",
    title: "Grace Community Fellowship",
    kind: "Sermon Series & Church Communications",
    client: "Grace Community Fellowship (GCF)",
    categories: ["graphic", "marketing"],
    year: "2026",
    summary:
      "Weekly sermon-series graphics for a church, each in a social version and a 16:9 screen version for the service, plus giving and special-service campaigns.",
    cover: "gcf/cover",
    role: "Graphic designer",
    deliverables: [
      "Weekly sermon series posters",
      "16:9 screen versions for in-service projection",
      "Quote and verse of the week",
      "Giving and fundraising campaign",
      "Special services: thanksgiving, prayer, family Sunday",
    ],
    tools: ["Adobe Photoshop", "Affinity Designer"],
    overview: [
      "Each Sunday at Grace Community Fellowship gets its own graphic. I design every sermon as a set: a social post, plus a matching widescreen slide for the projector during the service.",
      "Series such as “Faith”, “Elements of the Fear of God”, “Forgiveness” and “Grace” share layouts and type, so the congregation recognises them week to week, while each sermon gets its own image and colour.",
    ],
    gallery: [
      { id: "gcf/screen", caption: "Screen version for the projector" },
      { id: "gcf/screen-2" },
      ...ids("gcf", [
        "faith-acts", "faith-endures", "faith-waits", "fear-1", "fear-2", "knowing-god", "tongue", "wealth",
        "family", "thanksgiving", "forgive", "forgiven", "behind-scenes", "grace-licence", "gift", "contentment",
        "prayer", "fundraising", "quote", "verse", "consecrate", "beyond",
      ]),
    ],
    accent: "#7a1f1f",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
