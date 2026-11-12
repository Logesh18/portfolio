import React from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectItem } from "@/types/portfolio";

interface ProjectCardProps {
  project: ProjectItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-blue-500/40 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="accent">{project.domain}</Badge>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{project.employer}</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <Link href={`/projects/${project.slug}`} className="focus:outline-none">
              {project.title}
            </Link>
          </h3>
          <p className="text-xs font-medium text-muted-foreground">
            {project.subtitle}
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {project.summary}
        </p>

        <div className="rounded-lg border border-border/70 bg-background/60 p-3 space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Layers className="h-3 w-3 text-blue-500" aria-hidden="true" />
            <span>Key Contribution & Scope</span>
          </p>
          <p className="text-xs text-foreground leading-relaxed line-clamp-2">
            {project.contributions[0]}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border/70 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="subtle" className="font-mono text-[11px]">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-muted-foreground">
            {project.period}
          </span>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Read Case Study</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
