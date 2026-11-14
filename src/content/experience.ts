/**
 * Employment, education and skills, transcribed from:
 *  - Shadrack-Maundu-Graphics-Design-CV.pdf (Oct 2026)
 *  - Shadrack-Maundu-Software-Developer-CV.pdf
 *  - Shadrack_Maundu_Professional_CV.pdf (work modes, KCSE)
 * Do not add roles, dates or achievements that are not in those documents.
 */

import affinityDesigner from "@/assets/tools/affinity-designer.svg";
import canva from "@/assets/tools/canva.svg";
import figma from "@/assets/tools/figma.svg";
import firebase from "@/assets/tools/firebase.svg";
import flutter from "@/assets/tools/flutter.svg";
import illustrator from "@/assets/tools/illustrator.svg";
import indesign from "@/assets/tools/indesign.svg";
import java from "@/assets/tools/java.svg";
import mysql from "@/assets/tools/mysql.svg";
import photoshop from "@/assets/tools/photoshop.svg";
import python from "@/assets/tools/python.svg";
import react from "@/assets/tools/react.svg";

export interface Role {
  title: string;
  org: string;
  orgNote?: string;
  start: string;
  end: string;
  mode?: string;
  track: "design" | "development" | "both";
  points: string[];
  tools?: string[];
}

export const roles: Role[] = [
  {
    title: "Graphic Designer",
    org: "Boxraft Ltd",
    orgNote: "Parent company of Kenyans.co.ke",
    start: "Feb 2026",
    end: "Present",
    mode: "Onsite",
    track: "both",
    points: [
      "Design digital and print marketing materials: social media graphics, brochures, posters and billboards.",
      "Collaborate with technical, editorial and marketing teams to deliver digital products.",
      "Collaborated with the development team on the UI/UX design of a website newsletter in Figma.",
      "Support product design and branding initiatives and keep the brand consistent across digital and print.",
    ],
    tools: ["Photoshop", "Illustrator", "InDesign", "Affinity Designer", "Figma"],
  },
  {
    title: "Social Media Manager & Graphic Designer",
    org: "Optimum Prime Solutions",
    start: "Feb 2026",
    end: "May 2026",
    mode: "Remote",
    track: "design",
    points: [
      "Managed the Facebook and Instagram accounts.",
      "Created social media graphics and campaign assets.",
      "Developed content plans and maintained the brand identity.",
    ],
    tools: ["Photoshop"],
  },
  {
    title: "Graphic Designer & Software Developer",
    org: "Gallexia Kenya Ltd",
    start: "Jun 2025",
    end: "Feb 2026",
    mode: "Remote & onsite",
    track: "both",
    points: [
      "Designed corporate documents and reports, social media graphics, posters, brochures and billboards.",
      "Collaborated in developing the company's UK website using WordPress.",
      "Worked with technical and business teams on digital solutions and managed several client projects at once.",
      "Took part in product design and branding projects.",
    ],
    tools: ["Photoshop", "Illustrator", "InDesign", "Affinity Designer", "WordPress"],
  },
  {
    title: "Graphic Designer",
    org: "Action Africa Institute",
    start: "Jun 2025",
    end: "Sep 2025",
    mode: "Remote",
    track: "design",
    points: [
      "Designed social media graphics for campaigns.",
      "Created promotional flyers and communication materials.",
      "Maintained visual consistency across digital content.",
    ],
    tools: ["Photoshop"],
  },
  {
    title: "Web Developer",
    org: "Kenya Malaria Youth Corps (KeMYC)",
    start: "Feb 2025",
    end: "Nov 2025",
    track: "development",
    points: [
      "Developed responsive web pages using React and JavaScript.",
      "Assisted in frontend development using modern web technologies.",
      "Improved website usability and responsiveness.",
      "Collaborated with project teams during system development.",
    ],
    tools: ["React", "JavaScript"],
  },
];

export const education = [
  {
    title: "BSc Information Technology",
    org: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    period: "2021 – 2025",
    detail: "Second Class Honours, Upper Division",
  },
  {
    title: "Kenya Certificate of Secondary Education (KCSE)",
    org: "Secondary school",
    period: "2017 – 2020",
    detail: "Mean grade A- (78 points)",
  },
] as const;

export const skillGroups = [
  {
    title: "Creative",
    items: [
      "Brand identity & visual communication",
      "Logo design",
      "Social media graphics & content",
      "Posters, billboards & brochures",
      "Corporate documents & typesetting",
      "Digital marketing & social media management",
    ],
  },
  {
    title: "Development",
    items: [
      "Java, Python, JavaScript, C, C++, Dart",
      "HTML5, CSS3, React, Vite, REST APIs",
      "Flutter & Android Studio",
      "MySQL & Firebase",
      "WordPress",
      "Git, GitHub, VS Code, IntelliJ IDEA",
    ],
  },
  {
    title: "IT",
    items: [
      "Hardware & software installation",
      "System troubleshooting",
      "Windows administration",
      "Network fundamentals",
      "Microsoft Office Suite",
    ],
  },
  {
    title: "Ways of working",
    items: [
      "Problem solving",
      "Analytical thinking",
      "Team collaboration",
      "Communication",
      "Time management",
      "Attention to detail",
    ],
  },
] as const;

/** Tools strip under the hero. Logos are the official app/brand marks; "tile" marks ones that are already an app tile. */
export const tools = [
  { name: "Photoshop", icon: photoshop, tile: true },
  { name: "Illustrator", icon: illustrator, tile: true },
  { name: "InDesign", icon: indesign, tile: true },
  { name: "Affinity Designer", icon: affinityDesigner, tile: false },
  { name: "Figma", icon: figma, tile: false },
  { name: "Canva", icon: canva, tile: false },
  { name: "React", icon: react, tile: false },
  { name: "Flutter", icon: flutter, tile: false },
  { name: "Java", icon: java, tile: false },
  { name: "Python", icon: python, tile: false },
  { name: "MySQL", icon: mysql, tile: false },
  { name: "Firebase", icon: firebase, tile: false },
] as const;
