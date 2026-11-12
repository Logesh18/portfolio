import React from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "accent" | "subtle";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default:
      "bg-muted text-foreground border border-border/80",
    outline:
      "bg-transparent text-muted-foreground border border-border",
    accent:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25",
    subtle:
      "bg-card text-muted-foreground border border-border/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
