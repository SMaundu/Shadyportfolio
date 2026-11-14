import type { MediaId } from "./media.generated";

/**
 * Portfolio projects.
 *
 * Content rules (agreed with Shadrack):
 *  - Only real work from his files, CVs and public repositories.
 *  - No invented clients, briefs, metrics or results. Descriptions state what was
 *    designed or built and what is visible in the deliverables.
 *  - Years come from the source files' dates; roles for employer work come from the CVs.
 */

export type CategoryId = "brand" | "graphic" | "corporate" | "marketing" | "software" | "uiux";

export const categories: { id: CategoryId; label: string; short: string }[] = [
  { id: "brand", label: "Brand Identity", short: "Brand" },
  { id: "graphic", label: "Graphic Design", short: "Graphic" },
  { id: "corporate", label: "Corporate & Editorial", short: "Corporate" },
  { id: "marketing", label: "Marketing & Campaigns", short: "Marketing" },
  { id: "software", label: "Software Development", short: "Software" },
  { id: "uiux", label: "UI/UX & Digital", short: "UI/UX" },
];

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;

export interface GalleryItem {
  id: MediaId;
  caption?: string;
  /** Grid width on desktop. */
  span?: "full" | "half" | "third";
  /** Show the whole artwork on a neutral backdrop instead of cropping. */
  fit?: "contain";
  /** Backdrop for contained / transparent artwork. */
  bg?: string;
}

export interface Project {
  slug: string;
  title: string;
  client?: string;
  categories: CategoryId[];
  year: string;
  summary: string;
  cover: MediaId | null;
  coverFit?: "contain";
  coverBg?: string;
  role: string;
  deliverables: string[];
  tools: string[];
  overview: string[];
  sections?: { heading: string; body: string }[];
  gallery: GalleryItem[];
  links?: { label: string; href: string }[];
  /** Shown as a badge, e.g. competition entries. */
  note?: string;
  featured?: boolean;
  /** Accent colour used on the case-study page. */
  accent?: string;
}

const posters = (prefix: string, ids: string[], span: GalleryItem["span"] = "third"): GalleryItem[] =>
  ids.map((id) => ({ id: `${prefix}/${id}` as MediaId, span }));

export const projects: Project[] = [
  {
    slug: "faithful-two",
    title: "Faithful Two",
    client: "Faithful Two",
    categories: ["brand"],
    year: "2026",
    summary:
      "A full brand identity for Faithful Two, “God's Original Design”: logo system, pattern, a 36-page brand guideline, stationery, social media and merchandise.",
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
      "Faithful Two's identity is built around its line “God's Original Design”. The logomark pairs two rounded forms with two dots, and the same shapes repeat as a burgundy and gold pattern that runs through every touchpoint.",
      "Everything is documented in a 36-page brand guideline: overview, mission and vision, foundational values, target audience, the logo and its meaning, construction, secondary logo and patterns, typography (Utendo and Source Sans Pro), colour, imagery and applications.",
    ],
    sections: [
      {
        heading: "From mark to system",
        body: "The construction page shows how the mark is drawn. Logo versions cover full colour, black, white, burgundy and bright backgrounds, with and without the tagline, so the brand holds up on any surface.",
      },
      {
        heading: "In use",
        body: "The guideline closes with real applications: business cards, letterhead, full stationery, signage, a billboard and merchandise such as hoodies, T-shirts, polos, mugs, notebooks, tote bags and pens.",
      },
    ],
    gallery: [
      { id: "faithful-two/logo", span: "full", fit: "contain", bg: "#f7efe6", caption: "Primary logo with tagline" },
      { id: "faithful-two/guide-cover", span: "half" },
      { id: "faithful-two/guide-meaning", span: "half" },
      { id: "faithful-two/guide-construction", span: "half" },
      { id: "faithful-two/geometry", span: "half", caption: "Logo geometry" },
      { id: "faithful-two/guide-patterns", span: "half" },
      { id: "faithful-two/guide-type", span: "half" },
      { id: "faithful-two/guide-colour", span: "half" },
      { id: "faithful-two/guide-imagery", span: "half" },
      { id: "faithful-two/pattern", span: "full", caption: "Brand pattern" },
      { id: "faithful-two/stationery", span: "full", caption: "Letterhead and business card" },
      { id: "faithful-two/business-card", span: "half" },
      { id: "faithful-two/signage", span: "half" },
      { id: "faithful-two/youtube", span: "full", caption: "YouTube channel art" },
      { id: "faithful-two/hoodie", span: "half" },
      { id: "faithful-two/tshirt", span: "half" },
      { id: "faithful-two/mug", span: "third" },
      { id: "faithful-two/notebook", span: "third" },
      { id: "faithful-two/pencil", span: "third" },
      { id: "faithful-two/polo", span: "half" },
      { id: "faithful-two/tote", span: "half" },
    ],
    featured: true,
    accent: "#8b1a2b",
  },
  {
    slug: "amana-insights",
    title: "Amana Insights",
    client: "Amana Insights",
    categories: ["brand", "corporate"],
    year: "2026",
    summary:
      "Logo, logo guideline, company profile and letterhead for a finance and business strategy consultancy. Built on Trust, Driven by Insight.",
    cover: "amana-insights/cover",
    role: "Brand and editorial designer",
    deliverables: [
      "Primary and secondary logo",
      "Logomark versions for different backgrounds",
      "Logo guideline: colour palette and typography",
      "9-page company profile",
      "Letterhead",
    ],
    tools: ["Adobe Illustrator"],
    overview: [
      "Amana Insights is a finance and business strategy consultancy. The logo combines an “A” and an “i” into one mark, set in a deep royal purple and vibrant orange palette with Poppins as the typeface.",
      "The identity carries straight into the company profile: cover, contents, about us, mission, vision and core values, services pages and a contact back cover, all on the same grid and colour system.",
    ],
    gallery: [
      { id: "amana-insights/logo", span: "half", fit: "contain", bg: "#ffffff" },
      { id: "amana-insights/mark", span: "half", fit: "contain", bg: "#1b1464" },
      { id: "amana-insights/guide", span: "full", fit: "contain", bg: "#f4f1fb", caption: "Logo guideline" },
      { id: "amana-insights/profile-cover", span: "third" },
      { id: "amana-insights/profile-contents", span: "third" },
      { id: "amana-insights/profile-about", span: "third" },
      { id: "amana-insights/profile-mission", span: "half" },
      { id: "amana-insights/profile-services", span: "half" },
      { id: "amana-insights/profile-back", span: "third" },
      { id: "amana-insights/letterhead", span: "full", fit: "contain", bg: "#e9e6f2", caption: "Letterhead" },
    ],
    featured: true,
    accent: "#2a1f7a",
  },
  {
    slug: "optimum-prime-social",
    title: "Optimum Prime Solutions",
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
      "From February to May 2026 I managed Optimum Prime Solutions' Facebook and Instagram accounts: planning the monthly content and designing every post.",
      "Most posts promote Tally Prime business software (accounting, payroll, inventory, compliance and reporting), written in a mix of English and Swahili for a Kenyan small-business audience, alongside holiday posts such as Easter, Labour Day and Madaraka Day.",
    ],
    gallery: posters("optimum-prime", [
      "prime-1", "tally-ad", "april-13", "april-15", "april-22", "april-6", "march-2", "may-11", "may-22",
      "tally-2", "wed-11-3", "mon-16-3", "fri-20-3", "follow", "june-1", "april-29", "22nd-march", "madaraka",
    ]),
    featured: true,
    accent: "#2433c9",
  },
  {
    slug: "au-theme-2027",
    title: "AU Theme of the Year 2027",
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
      "Black and white versions",
      "Event backdrop, roll-up banner and teardrop flag mock-ups",
    ],
    tools: ["Affinity Designer", "Adobe Illustrator", "Adobe Photoshop"],
    overview: [
      "This is my entry to the African Union's logo competition for its 2027 theme: “Year of Single African Air Transport Market (SAATM) and New Technologies: Leveraging the Full Potential of SAATM & New Technologies for Continental Integration.” It is a competition submission, not an official AU logo.",
      "The mark places an aircraft over a map of Africa, alongside a “Celebrating 25 years” badge, in the green and gold of the AU's palette. I prepared it in several colour versions and showed it on event materials.",
    ],
    gallery: [
      { id: "au-2027/preview", span: "full", fit: "contain", bg: "#ffffff", caption: "Logo on white, green and gold" },
      { id: "au-2027/logo", span: "full", fit: "contain", bg: "#ffffff" },
      { id: "au-2027/rollup", span: "half" },
      { id: "au-2027/teardrop", span: "half" },
    ],
    accent: "#1f7a3a",
  },
  {
    slug: "talents-night-2026",
    title: "Talents Night 2026",
    client: "JKUATCU Creative Arts Ministry (CreAM)",
    categories: ["marketing", "graphic"],
    year: "2026",
    summary:
      "The full event campaign for Talents Night SN15: auditions, launch, countdown, day-of and live posts, a YouTube thumbnail and event T-shirts.",
    cover: "talents-night/thumbnail",
    role: "Campaign designer",
    deliverables: [
      "Auditions poster",
      "Key visual and launch poster",
      "Countdown, “today”, “now” and “live” posts",
      "YouTube thumbnail",
      "Event T-shirt designs (front and back)",
    ],
    tools: ["Adobe Photoshop", "Adobe Illustrator"],
    overview: [
      "Talents Night is the talent showcase of the JKUAT Christian Union's Creative Arts Ministry (CreAM). For the 2026 edition, season 15, I designed one key visual and carried it through the whole campaign, from the auditions call to the live stream.",
      "Each post in the countdown keeps the same red and gold palette and the “Talents Night SN15” lock-up, so the series reads as one story on social media.",
    ],
    gallery: [
      ...posters("talents-night", ["main", "auditions", "countdown", "today", "now", "live", "final"]),
      { id: "talents-night/tshirt", span: "third", fit: "contain", bg: "#ffffff" },
      { id: "talents-night/tshirt-back", span: "third", fit: "contain", bg: "#ffffff" },
      { id: "talents-night/tshirt-red", span: "half", fit: "contain", bg: "#ffffff" },
    ],
    accent: "#b3122e",
  },
  {
    slug: "great-taita-taveta-mission",
    title: "The Great Taita Taveta Mission",
    client: "Uttermost Evangelistic Team (UET), JKUAT",
    categories: ["marketing", "graphic"],
    year: "2026",
    summary:
      "A branding kit and social campaign for a mission trip: theme, countdown, mission-station map, seminars and a thank-you post.",
    cover: "taita-taveta/main",
    role: "Campaign designer",
    deliverables: [
      "Campaign branding kit (colours and typography)",
      "Theme and key visual",
      "Countdown posts",
      "Mission stations map",
      "Seminar announcement",
      "Thank-you post",
    ],
    tools: ["Affinity Designer", "Adobe Photoshop"],
    overview: [
      "For the Uttermost Evangelistic Team's mission to Taita Taveta I set up a small branding kit first, with colours, typography and the mission lock-up, and then designed every announcement from it.",
      "The series covers the theme reveal, the countdown, a map of the mission stations, seminar announcements during the mission and a thank-you post afterwards.",
    ],
    gallery: [
      { id: "taita-taveta/kit", span: "full", fit: "contain", bg: "#ffffff", caption: "Campaign branding kit" },
      ...posters("taita-taveta", ["theme", "countdown", "today", "locations", "seminars", "thank-you", "alt"]),
    ],
    accent: "#c2410c",
  },
  {
    slug: "grace-community-fellowship",
    title: "Grace Community Fellowship",
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
      "Grace Community Fellowship publishes a new graphic for every Sunday. I design each sermon series as a set: a social post and a matching widescreen slide for the projection screen during the service.",
      "Series such as “Faith”, “Elements of the Fear of God”, “Forgiveness” and “Grace” share layouts and type treatments so the congregation recognises them week to week, while each sermon gets its own image and colour.",
    ],
    gallery: [
      { id: "gcf/screen", span: "full", caption: "Screen version for the projector during the service" },
      { id: "gcf/screen-2", span: "full" },
      ...posters("gcf", [
        "faith-acts", "faith-endures", "faith-waits", "fear-1", "fear-2", "knowing-god", "tongue", "wealth",
        "family", "thanksgiving", "forgive", "forgiven", "behind-scenes", "grace-licence", "gift", "contentment",
        "prayer", "fundraising", "quote", "verse", "consecrate", "beyond",
      ]),
    ],
    accent: "#7a1f1f",
  },
  {
    slug: "queensway-insurance",
    title: "Queensway Insurance Agencies",
    client: "Queensway Insurance Agencies",
    categories: ["brand", "corporate"],
    year: "2026",
    summary: "Logo, logo guideline, business card and insurance sticker cards for an insurance agency.",
    cover: "queensway/guide",
    coverFit: "contain",
    coverBg: "#f3f1ea",
    role: "Brand designer",
    deliverables: [
      "Primary and secondary logo",
      "Logo versions on different backgrounds",
      "Logo guideline: colour palette and typography",
      "Business card",
      "Insurance sticker cards",
    ],
    tools: ["Adobe Illustrator", "Affinity Designer"],
    overview: [
      "A crest-and-crown logo for Queensway Insurance Agencies in deep navy and royal gold, documented on a one-page guideline with primary and secondary logos, background versions, colours and typography.",
      "The identity then carries onto the agency's business card and the sticker cards clients keep in their vehicles.",
    ],
    gallery: [
      { id: "queensway/logo", span: "half", fit: "contain", bg: "#ffffff" },
      { id: "queensway/logo-gold", span: "half", fit: "contain", bg: "#ffffff" },
      { id: "queensway/card-front", span: "half", fit: "contain", bg: "#e8e6df" },
      { id: "queensway/card-back", span: "half", fit: "contain", bg: "#e8e6df" },
      { id: "queensway/sticker", span: "half" },
      { id: "queensway/sticker-alt", span: "half" },
    ],
    accent: "#1c2b6b",
  },
  {
    slug: "the-myrtle",
    title: "The Myrtle",
    client: "The Myrtle Property Management Company",
    categories: ["brand"],
    year: "2026",
    summary: "Logo exploration and brand board for a property management company.",
    cover: "the-myrtle/brand-board",
    coverFit: "contain",
    coverBg: "#f2f5ef",
    role: "Brand designer",
    deliverables: ["Logo and logo variations", "Brand board: colours, typography and applications"],
    tools: ["Adobe Illustrator"],
    overview: [
      "The Myrtle's mark draws a myrtle leaf into the shape of a house, in deep green and gold. The brand board brings the primary logo, colour palette, typography and first applications together on one page.",
    ],
    gallery: [
      { id: "the-myrtle/logo", span: "half", fit: "contain", bg: "#ffffff" },
      { id: "the-myrtle/logo-alt", span: "half", fit: "contain", bg: "#ffffff" },
    ],
    accent: "#1f5130",
  },
  {
    slug: "kellian-autogarage",
    title: "Kellian Autogarage",
    client: "Kellian Autogarage",
    categories: ["brand", "marketing"],
    year: "2026",
    summary: "Badge logo, lightbox signage and service fliers for a car wash, garage and parking business.",
    cover: "kellian/lightbox",
    role: "Brand and print designer",
    deliverables: ["Badge logo", "Lightbox sign", "Double-sided service flier"],
    tools: ["Affinity Designer"],
    overview: [
      "A circular badge logo for Kellian Enterprise, with its services (cleaning, garage services, parking) and the line “We care about your car” around a classic car.",
      "The badge anchors a lightbox sign and a double-sided flier that lists the services and contacts.",
    ],
    gallery: [
      { id: "kellian/logo", span: "half", fit: "contain", bg: "#ffffff" },
      { id: "kellian/flier", span: "half", fit: "contain", bg: "#e9eef6" },
      { id: "kellian/print-front", span: "half", fit: "contain", bg: "#e9eef6" },
      { id: "kellian/print-back", span: "half", fit: "contain", bg: "#e9eef6" },
    ],
    accent: "#173e8c",
  },
  {
    slug: "shadesigns",
    title: "Shadesigns",
    client: "My design studio",
    categories: ["brand", "marketing"],
    year: "2026",
    summary: "The identity and marketing for Shadesigns, my own design brand: Designs That Convert.",
    cover: "shadesigns/brand",
    coverFit: "contain",
    coverBg: "#ffffff",
    role: "Founder and designer",
    deliverables: ["Logo and colour system", "Rate card", "Social media design packages", "Business card", "Promotional posters"],
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Affinity Designer"],
    overview: [
      "Shadesigns is the brand I use for my freelance design work. The angular “S” mark is in orange-red (#F91D00) and dark brown (#542404), set in Gotham, with the tagline “Designs That Convert”.",
      "Around it sit the tools I use to sell the service: a rate card, social media design packages, a business card and promotional posters.",
    ],
    gallery: [
      { id: "shadesigns/rate-card", span: "half", fit: "contain", bg: "#1a0d08" },
      { id: "shadesigns/packages", span: "half", fit: "contain", bg: "#f3efe9" },
      { id: "shadesigns/business-card", span: "half", fit: "contain", bg: "#1a0d08" },
      { id: "shadesigns/ad", span: "half" },
      { id: "shadesigns/offer", span: "half" },
      { id: "shadesigns/folder", span: "half" },
    ],
    accent: "#ee2524",
  },
  {
    slug: "selected-logos",
    title: "Selected Logos",
    client: "Various",
    categories: ["brand"],
    year: "2026",
    summary: "Logomarks for beauty, ministry, errands and cleaning businesses, churches and campus groups.",
    cover: "logofolio/cover",
    role: "Logo designer",
    deliverables: ["Logos and logo variations", "Business card (Yelklin Solutions)"],
    tools: ["Adobe Illustrator", "Affinity Designer"],
    overview: [
      "A selection of marks from my source files: Evie's Glam Scents & Cosmetics, Luxe Beauty & Fashion, Decor Ministry, Helpmate Errands, The Grace Community, the JKUATCU Sunday School Ministry and Yelklin Solutions.",
    ],
    gallery: [
      { id: "logofolio/evie", span: "half", fit: "contain", bg: "#fbf6f1", caption: "Evie's Glam Scents & Cosmetics" },
      { id: "logofolio/luxe", span: "half", fit: "contain", bg: "#ffffff", caption: "Luxe Beauty & Fashion" },
      { id: "logofolio/decor", span: "half", fit: "contain", bg: "#ffffff", caption: "Decor Ministry" },
      { id: "logofolio/helpmate", span: "half", fit: "contain", bg: "#ffffff", caption: "Helpmate Errands" },
      { id: "logofolio/grace-community", span: "half", fit: "contain", bg: "#ffffff", caption: "The Grace Community" },
      { id: "logofolio/sunday-school", span: "half", fit: "contain", bg: "#ffffff", caption: "JKUATCU Sunday School Ministry" },
      { id: "logofolio/yelklin-card", span: "half", fit: "contain", bg: "#eef1f6", caption: "Yelklin Solutions business card" },
      { id: "logofolio/yelklin-card-back", span: "half", fit: "contain", bg: "#eef1f6" },
    ],
    accent: "#b4842a",
  },
  {
    slug: "fairtrade-sugar-brochure",
    title: "Fairtrade Sugar from Africa",
    categories: ["corporate"],
    year: "2026",
    summary: "An 8-page brochure presenting Fairtrade-certified sugar from Africa to buyers.",
    cover: "fairtrade-sugar/cover",
    role: "Editorial designer",
    deliverables: ["8-page brochure layout and typesetting"],
    tools: [],
    overview: [
      "An eight-page brochure on Fairtrade sugar from Africa: an introduction, the Fairtrade premium, why buyers should source Fairtrade-certified sugar and contact details, laid out with photography of the growers and clear data tables.",
    ],
    gallery: [
      ...[0, 1, 2, 3, 5, 7].map((i) => ({ id: `fairtrade-sugar/page-${i}` as MediaId, span: "third" as const })),
    ],
    accent: "#1c8fd1",
  },
  {
    slug: "skypeak-golden-hill",
    title: "Golden Hill Billboards",
    client: "SkyPeak",
    categories: ["marketing"],
    year: "2026",
    summary: "Billboard and social designs for Golden Hill, a high-end residential development in Westlands.",
    cover: "skypeak/billboard-1",
    role: "Graphic designer",
    deliverables: ["Billboard designs", "Social media versions"],
    tools: ["Adobe Illustrator"],
    overview: [
      "Billboards for SkyPeak's Golden Hill development (“Golden Hill, Golden Legacy: a new era of high-end living”), led by the building render, with the location and contact details kept readable from a distance.",
    ],
    gallery: [
      { id: "skypeak/billboard-2", span: "full" },
      { id: "skypeak/social", span: "half" },
      { id: "skypeak/social-2", span: "half" },
    ],
    accent: "#1d3f8f",
  },
  {
    slug: "atdf-2026",
    title: "Africa Trade Development Forum 2026",
    client: "ATDF 2026",
    categories: ["marketing"],
    year: "2026",
    summary: "Social media posts for the forum in Addis Ababa: travel and visa announcements and panel-session speaker posters.",
    cover: "atdf-2026/coming-3",
    role: "Graphic designer",
    deliverables: ["Travel and visa announcement series", "Panel session speaker posters"],
    tools: ["Adobe Photoshop"],
    overview: [
      "A set of portrait social posts for the Africa Trade Development Forum 2026 (23–24 November, Addis Ababa): a four-part “Coming to ATDF 2026?” series on flights and visas, and posters that introduce the speakers of each panel session.",
    ],
    gallery: posters("atdf-2026", ["coming-1", "coming-2", "coming-4", "tca-2", "tca-4"]),
    accent: "#2e7d32",
  },
  {
    slug: "posters-and-social",
    title: "Posters & Social Graphics",
    client: "Churches, campus groups, NGOs and small businesses",
    categories: ["graphic", "marketing"],
    year: "2026",
    summary: "Event posters, campaign graphics and social posts for organisations across Kenya.",
    cover: "posters/cover",
    role: "Graphic designer",
    deliverables: ["Event posters", "Social media posts", "Awareness campaigns", "Promotional fliers"],
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Affinity Designer"],
    overview: [
      "A cross-section of single posters and social graphics: health camps and awareness months, church services and launches, campus events, a podcast cover, birthday and greeting posts, and promotions for small businesses.",
    ],
    gallery: posters("posters", [
      "medical-camp", "mens-mental-health", "mothers-day", "inreach", "door-of-the-sheep", "cultural-sunday",
      "100k", "welcome-july", "shirts-sale", "baptism", "compelled", "grand-launch", "mt-hebron", "living-waters",
      "necessary-lie", "character-daniel", "customer-week", "birthday-cinta", "aecf-podcast", "worship-experience",
      "gala-dinner", "welcome-sep", "widow-judge", "destiny", "prioritizing", "helpmate", "benefits-fear",
      "spark-camp", "service-hub",
    ]),
    accent: "#b45309",
  },
  {
    slug: "print-collateral",
    title: "Print Collateral & Event Credentials",
    client: "Various",
    categories: ["corporate"],
    year: "2026",
    summary: "Event tags for student AGMs and elections, an email signature and a retail banner.",
    cover: "stationery/uet-agm",
    coverFit: "contain",
    coverBg: "#f1f1f1",
    role: "Print designer",
    deliverables: ["AGM and electoral commission tags", "Email signature", "Retail banner"],
    tools: ["Adobe Illustrator", "Affinity Designer"],
    overview: [
      "Smaller print and digital pieces: name tags for the UET JKUAT annual general meeting and the JKUSA electoral commission, an email signature, and a banner for Zaria Thrifts.",
    ],
    gallery: [
      { id: "stationery/jkusa-ec", span: "half", fit: "contain", bg: "#f1f1f1" },
      { id: "stationery/email-signature", span: "half", fit: "contain", bg: "#ffffff" },
      { id: "stationery/zaria-banner", span: "full" },
    ],
    accent: "#0f766e",
  },
  // ------------------------------------------------------------------ software
  {
    slug: "qless-commute",
    title: "QLess Commute",
    categories: ["software", "uiux"],
    year: "2025",
    summary:
      "An Uber-like Android app for public transport: pay fares through M-Pesa and get a QR-code ticket, with live maps and separate driver and passenger modes.",
    cover: "qless/cover",
    role: "Mobile developer and UI designer",
    deliverables: ["Android app", "UI design (9 screens)", "App logo"],
    tools: ["Android Studio", "Java", "Google Maps API", "M-Pesa Daraja API", "MySQL", "PHP"],
    overview: [
      "QLess Commute simplifies public transport. Passengers pay their fare digitally and receive a QR code as their ticket, which conductors scan to verify.",
      "The app has registration and login, QR ticket generation and scanning, real-time maps for vehicle locations and routes (Google Maps API), M-Pesa payments through Safaricom's Daraja API, separate driver and passenger modes, and ride history. Data lives in MySQL behind a PHP backend.",
    ],
    sections: [
      {
        heading: "Designing the flow",
        body: "Before building, I designed the screens end to end: welcome, sign-up and login, the passenger and conductor home screens, choosing a pick-up location and a bus, payment and the QR ticket.",
      },
    ],
    gallery: [
      ...(["welcome", "signup", "login", "home", "home-conductor", "location", "bus", "pay", "qr"] as const).map(
        (n) => ({ id: `qless/ui-${n}` as MediaId, span: "third" as const, fit: "contain" as const, bg: "#0f2a1c" }),
      ),
      { id: "qless/promo", span: "half" },
      { id: "qless/phone", span: "half" },
      { id: "qless/logo", span: "full", fit: "contain", bg: "#ffffff" },
    ],
    featured: true,
    accent: "#15803d",
  },
  {
    slug: "kemyc-web-platform",
    title: "Kenya Malaria Youth Corps",
    client: "Kenya Malaria Youth Corps (KeMYC)",
    categories: ["software", "uiux"],
    year: "2025",
    summary: "Frontend development for KeMYC's web platform: responsive React pages and usability improvements.",
    cover: null,
    role: "Web Developer (Feb – Nov 2025)",
    deliverables: ["Responsive web pages", "Frontend components", "Usability and responsiveness improvements"],
    tools: ["React", "JavaScript", "HTML5", "CSS3"],
    overview: [
      "As a web developer with the Kenya Malaria Youth Corps from February to November 2025, I developed responsive pages in React and JavaScript and helped with the frontend of the organisation's web platform.",
      "My work focused on making the site easier to use and better on mobile, collaborating with the project team throughout development.",
    ],
    gallery: [],
    links: [
      { label: "Frontend repository", href: "https://github.com/SMaundu/Kemyc-frontend" },
      { label: "Platform repository", href: "https://github.com/SMaundu/kenya_malaria_youth_army" },
    ],
    accent: "#be123c",
  },
  {
    slug: "health-information-system",
    title: "Health Information System",
    categories: ["software"],
    year: "2025",
    summary: "A web app that simulates a basic health information system: programmes, client registration, enrolment, search and a client-profile API.",
    cover: "his/desktop",
    role: "Developer",
    deliverables: ["Web application", "Simulated REST endpoint for client profiles"],
    tools: ["HTML5", "CSS3", "JavaScript"],
    overview: [
      "A simple web application for doctors to manage clients and health programmes. They can create programmes such as TB, malaria or HIV, register clients, enrol them in one or more programmes, search for clients and view a client's profile with their enrolments.",
      "Client data is also exposed through a simulated API endpoint, so other systems could read a profile by client ID.",
    ],
    gallery: [],
    links: [
      { label: "Live demo", href: "https://health-information-system-chi.vercel.app" },
      { label: "Source code", href: "https://github.com/SMaundu/health-information-system" },
    ],
    accent: "#2563eb",
  },
  {
    slug: "portfolio-website",
    title: "This Portfolio",
    categories: ["software", "uiux"],
    year: "2026",
    summary:
      "The site you're on: a React and TypeScript front end with serverless enquiry handling, a database, transactional email and real appointment booking.",
    cover: "portfolio/desktop" as MediaId,
    role: "Designer and developer",
    deliverables: ["Visual design and motion", "Responsive front end", "Enquiry backend", "Consultation booking"],
    tools: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Netlify Functions", "Supabase", "Resend", "Cal.com"],
    overview: [
      "My portfolio, redesigned in my gold and burgundy palette. It's built with React, TypeScript, Vite and Tailwind CSS, with Framer Motion animations that respect reduced-motion settings.",
      "Enquiries are validated and rate-limited by Netlify Functions, stored in Supabase and delivered by Resend. Consultations are booked through Cal.com, and a signed webhook records every booking.",
    ],
    gallery: [],
    links: [{ label: "Source code", href: "https://github.com/SMaundu/Shadyportfolio" }],
    accent: "#f7a306",
  },
];

/** Smaller academic / personal builds from the Software Developer CV (no case-study page). */
export const otherBuilds = [
  {
    title: "Student Library Management System",
    stack: ["Java", "MySQL"],
    body: "Group project. Designed and integrated the relational database structures.",
  },
  {
    title: "Flutter Mobile Application",
    stack: ["Flutter", "Dart", "Firebase"],
    body: "A cross-platform mobile app with Firebase Authentication.",
  },
] as const;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
