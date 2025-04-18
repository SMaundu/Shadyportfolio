
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  className?: string;
}

export function SkillCard({ title, icon, description, className }: SkillCardProps) {
  return (
    <div className={cn("skill-card group", className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-primary group-hover:text-gold transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-foreground/80">{description}</p>
    </div>
  );
}
