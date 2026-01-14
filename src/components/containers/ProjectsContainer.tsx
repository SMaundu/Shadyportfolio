import React from "react";
import { SectionContainer } from "@/components/containers/SectionContainer";

export function ProjectsContainer() {
  return (
    <SectionContainer id="projects">
      <div className="max-w-4xl mx-auto mb-40 mt-3 px-4">
        <h2 className="section-title">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 reveal opacity-0">
          <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
            <img src="/designs/project1.jpg" alt="Project 1" className=" w-full h-60 object-cover hover:scale-105 hover:brightness-90 transition-all duration-300 " />
            <h3 className="text-xl font-semibold text-center text-gold border-gold">QLessCommute</h3>
            <p className="text-white-700 text-center">An Uber-like Mobile app using QR code ticketing and M-Pesa integration.</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
            <img src="/designs/Portfolio.jpg" alt="Portfolio" className="w-full h-60 object-cover  hover:scale-105 hover:brightness-90 transition-all duration-300" />
            <h3 className="text-xl font-semibold text-center text-gold">Portfolio Website</h3>
            <div className="text-white-700 text-center">A responsive personal site built with React, Vite, and Tailwind CSS.</div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
            <img src="/designs/doc.png" alt="Health IS" className="w-full h-60 object-cover  hover:scale-105 hover:brightness-90 transition-all duration-300" />
            <h3 className="text-xl font-semibold text-center text-gold">Health Management IS</h3>
            <div className="text-white-700 text-center">A simple web application that simulates a basic health information system.</div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default ProjectsContainer;
