
import { ReactNode } from "react";

interface TimelineItemProps {
  date: string;
  title: string;
  description: ReactNode;
}

export function TimelineItem({ date, title, description }: TimelineItemProps) {
  return (
    <div className="timeline-item">
      <div className="mb-1 font-medium text-primary text-sm">{date}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-foreground/80">{description}</div>
    </div>
  );
}
