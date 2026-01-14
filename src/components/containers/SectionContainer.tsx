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
        "min--screen py-8 px-1 md:px-12 lg:px-24 flex  justify-center",
        className
      )}
    >
      {children}
    </section>
  );
}

export default SectionContainer;
