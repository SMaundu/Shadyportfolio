/**
 * Single source of truth for personal details. Everything here is taken from
 * Shadrack's CVs (Graphic Design CV, Oct 2026 and Software Developer CV).
 */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL as string | undefined) ?? "https://smaunduportfolio.netlify.app";

export const profile = {
  name: "Shadrack Maundu",
  fullName: "Shadrack Maundu Ndinda",
  headline: "Creative Designer | Software Developer",
  /** Rotating hero titles. Each one is backed by a role or skill in the CVs. */
  roles: [
    "Brand Identity Designer",
    "Graphic Designer",
    "Software Developer",
    "Frontend Developer",
    "UI/UX Designer",
  ],
  tagline: "Design that communicates. Software that works.",
  intro:
    "I'm a graphic and brand designer with over four years of experience and an Information Technology graduate from JKUAT. I design identities, campaigns and corporate documents, and I build websites and mobile apps, so your brand and your product get the same level of care.",
  location: "Kenya",
  email: "shadrackmaundu007@gmail.com",
  phoneDisplay: "+254 719 300 801",
  phoneHref: "tel:+254719300801",
  whatsapp: "https://wa.me/254719300801?text=Hi%20Shadrack%2C%20I%20found%20you%20through%20your%20portfolio.",
  studio: { name: "Shadesigns", tagline: "Designs That Convert" },
  socials: {
    github: "https://github.com/SMaundu",
    linkedin: "https://www.linkedin.com/in/shadrack-maundu-892130228/",
    instagram: "https://www.instagram.com/maundu_shady/",
  },
  cvs: [
    {
      label: "Graphic Design CV",
      href: "/cv/Shadrack-Maundu-Graphic-Design-CV.pdf",
      note: "Branding, print and digital design",
    },
    {
      label: "Software Developer CV",
      href: "/cv/Shadrack-Maundu-Software-Developer-CV.pdf",
      note: "Web, mobile and IT",
    },
  ],
} as const;

/** Facts for the scrolling strip under the hero. CV-verified only. */
export const facts = [
  "4+ years in graphic design",
  "BSc Information Technology, JKUAT",
  "Second Class Honours, Upper Division",
  "Brand identity & visual systems",
  "React · Flutter · Java · Python",
  "Adobe CC · Affinity · Figma",
  "Social media management",
  "Based in Kenya",
] as const;

/** Organisations from the CVs' professional experience. */
export const organisations = [
  "Boxraft Ltd",
  "Gallexia Kenya",
  "Optimum Prime Solutions",
  "Kenya Malaria Youth Corps",
  "Action Africa Institute",
] as const;

export const navLinks = [
  { label: "Home", id: "home" },
  { label: "Work", id: "work" },
  { label: "Services", id: "services" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
] as const;

export type SectionId = (typeof navLinks)[number]["id"];
