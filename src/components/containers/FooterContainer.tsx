import React from "react";

export function FooterContainer() {
  return (
    <footer className="py-6 px-6 md:px-12 lg:px-24 border-t border-border bg-background">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Shadrack Maundu</h3>
          <p className="text-sm text-foreground/60">Graphics Designer, IT Professional & Software Developer</p>
        </div>

        <div className="text-sm text-foreground/60">&copy; Built By Shadrack Maundu. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default FooterContainer;
