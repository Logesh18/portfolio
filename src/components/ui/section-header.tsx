import React from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  rightSlot?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  rightSlot,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-border pb-6 mb-8",
        className
      )}
    >
      <div className="space-y-2 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400">
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
}
