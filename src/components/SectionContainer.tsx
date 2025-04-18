
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export function SectionContainer({ id, className, children }: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen py-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center",
        className
      )}
    >
      {children}
    </section>
  );
}
