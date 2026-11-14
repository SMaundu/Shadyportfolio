import { Seo } from "@/components/Seo";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { PosterWall } from "@/components/sections/PosterWall";
import { Services } from "@/components/sections/Services";
import { ToolsStrip } from "@/components/sections/ToolsStrip";
import { Work } from "@/components/sections/Work";

export default function Index() {
  return (
    <>
      <Seo />
      <Hero />
      <ToolsStrip />
      <About />
      <Experience />
      <PosterWall />
      <Work />
      <Services />
      <Contact />
    </>
  );
}
