import React from "react";
import { SectionContainer } from "@/components/containers/SectionContainer";
import { SkillCard } from "@/components/SkillCard";
import { Laptop, Globe, Code, BookOpen, Monitor, PaintBucket } from "lucide-react";

export function SkillsContainer() {
  return (
    <SectionContainer id="skills" className="bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="section-title">Skills & Expertise</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 stagger-animation">
          <SkillCard
            title="Computer Packages"
            icon={<Laptop className="h-6 w-6" />}
            description="Proficient in various computer software packages (e.g. Word, Excell, Powerpoint etc.) and office applications for efficient productivity."
          />

          <SkillCard
            title="Communication Skills"
            icon={<Globe className="h-6 w-6" />}
            description="Excellent written and verbal communication skills for effective team collaboration and client interaction."
          />

          <SkillCard
            title="Java Programming"
            icon={<Code className="h-6 w-6" />}
            description="Skilled in Java programming language for building robust and responsive desktop and Android applications."
          />

          <SkillCard
            title="Web Development"
            icon={<BookOpen className="h-6 w-6" />}
            description="Front-end web development skills including HTML, CSS, JavaScript, Typescript, Vite, TypeScript, React, Tailwind CSS for creating responsive websites among others."
          />

          <SkillCard
            title="Mobile Development"
            icon={<Monitor className="h-6 w-6" />}
            description="Experience with Dart/Flutter, Android Studio and Java for building mobile applications on the Android platform."
          />

          <SkillCard
            title="Graphics Design"
            icon={<PaintBucket className="h-6 w-6" />}
            description="Graphics design capabilities in the Adobe Suite. This involves design in Adobe Photoshop, Adobe Illustrator, Adobe Indesign among others such as the Canva."
          />

          <SkillCard
            title="Networking"
            icon={<Monitor className="h-6 w-6" />}
            description="Intermediate knowledge in Networking especially in the configuration of networks in a Local Area Network."
          />
          <SkillCard
            title="Digital Marketing"
            icon={<Globe className="h-6 w-6" />}
            description="My proficiency is in full-funnel content strategy. I design Seamless fliers, social media posts, brochures, and other marketing materials that align with brand identity and campaign goals."
          />
        </div>
      </div>
    </SectionContainer>
  );
}

export default SkillsContainer;
