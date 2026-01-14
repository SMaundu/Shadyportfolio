import React from "react";
import { SectionContainer } from "@/components/containers/SectionContainer";
import { Briefcase } from "lucide-react";

export function ExperienceContainer() {
  return (
    <SectionContainer id="experience">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Briefcase className="h-5 w-5" />
          </div>
          <h2 className="section-title">Experience</h2>
        </div>

        <div className="space-y-6 reveal opacity-0">
          <div>
            <h3 className="text-lg font-semibold">Graphics Designer — 3 Years</h3>
            <ul className="list-disc ml-6 mt-2 text-foreground/80">
              <li>Action Africa Institute</li>
              <li>Gallexia Kenya Ltd.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Software Development — 2 Years</h3>
            <ul className="list-disc ml-6 mt-2 text-foreground/80">
              <li>Kenya Malaria Youth Corps (KeMYC)</li>
              <li>Portfolio</li>
              <li>QLess App</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default ExperienceContainer;
