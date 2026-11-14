import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";
import { PosterRing, type Poster } from "@/components/work/PosterRing";

const POSTERS: Poster[] = [
  { id: "gcf/faith-acts", title: "Faith That Acts, sermon poster for Grace Community Fellowship" },
  { id: "talents-night/main", title: "Talents Night 2026 key visual" },
  { id: "posters/medical-camp", title: "Medical camp poster" },
  { id: "optimum-prime/prime-1", title: "Optimum Prime Solutions social post" },
  { id: "posters/grand-launch", title: "Grand launch poster for Victors Chapel" },
  { id: "atdf-2026/coming-3", title: "Coming to ATDF 2026, travel announcement" },
  { id: "posters/mens-mental-health", title: "Men's Mental Health Awareness Month poster" },
  { id: "taita-taveta/theme", title: "The Great Taita Taveta Mission theme poster" },
  { id: "posters/aecf-podcast", title: "Podcast cover" },
  { id: "gcf/fear-1", title: "Elements of the Fear of God, sermon poster" },
  { id: "posters/customer-week", title: "Customer Service Week post" },
  { id: "skypeak/social", title: "Golden Hill social post for SkyPeak" },
  { id: "posters/compelled", title: "Compelled to Preach poster for JKUATCU" },
  { id: "posters/necessary-lie", title: "Necessary Lie event poster" },
  { id: "optimum-prime/tally-ad", title: "Tally Prime advert" },
  { id: "posters/worship-experience", title: "Interdenominational worship experience poster" },
  { id: "gcf/knowing-god", title: "Knowing God, sermon poster" },
  { id: "posters/mothers-day", title: "Mother's Day post" },
  { id: "talents-night/auditions", title: "CreAM auditions poster" },
  { id: "posters/baptism", title: "Baptism classes poster" },
  { id: "posters/door-of-the-sheep", title: "I Am the Door of the Sheep poster" },
  { id: "gcf/thanksgiving", title: "Thanksgiving service poster" },
];

export function PosterWall() {
  return (
    <section id="posters" aria-labelledby="posters-title" className="relative overflow-hidden py-24 md:py-28">
      <div aria-hidden className="absolute inset-x-0 top-1/2 -z-10 h-[60%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.35),transparent_65%)]" />
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Graphic design</p>
            <h2 id="posters-title" className="section-heading mt-4">
              The poster <span className="text-highlight">wall</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-md">
            <p className="text-muted-foreground">
              Sermon series, campaigns, events and promotions designed for churches, campus groups, NGOs and
              businesses.
            </p>
            <Link
              to="/work/posters-and-social"
              className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-highlight link-underline"
            >
              See the full collection <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </Reveal>
        </div>
      </div>
      <Reveal className="mt-10" y={60} amount={0.15}>
        <PosterRing posters={POSTERS} />
      </Reveal>
    </section>
  );
}
