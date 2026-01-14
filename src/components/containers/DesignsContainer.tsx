import React from "react";
import { SectionContainer } from "@/components/containers/SectionContainer";
import { Button } from "@/components/ui/button";

export function DesignsContainer() {
  return (
    <SectionContainer id="designs">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="section-title">Design Showcase</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 reveal opacity-0">
          <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
            <img src="/designs/Medical Camp 2.png" alt="Poster 1" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 reveal opacity-00" />
            <div className="p-4 text-center text-sm text-foreground/80">Medical Camp Poster</div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
            <img src="/designs/Shirts Sale.png" alt="Poster 3" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 reveal opacity-0" />
            <div className="p-4 text-center text-sm text-foreground/80">Shirt Sales Poster</div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
            <img src="/designs/UET Cultural sunday2.png" alt="Poster 2" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 reveal opacity-0" />
            <div className="p-4 text-center text-sm text-foreground/80">UET Cultural Sunday</div>
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="outline" className="text-gold border-gold hover:bg-gold/10 hover:scale-105 hover:brightness-100 transition-all duration-300" asChild>
              <a href="https://drive.google.com/drive/u/0/folders/1A9PQvmsnXmPIvzMUEeRUCWrQzOnZvHFm" target="_blank" rel="noopener noreferrer">View These and More Designs Here</a>
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default DesignsContainer;
