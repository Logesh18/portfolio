import React from "react";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Calendar, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExperienceItem } from "@/types/portfolio";

interface ExperienceTimelineProps {
  experiences: ExperienceItem[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const employmentRoles = experiences.filter((e) => e.type === "full-time");
  const freelanceRoles = experiences.filter((e) => e.type === "freelance");

  return (
    <div className="space-y-12">
      {/* Full-Time Employment Hierarchy */}
      <div className="space-y-8">
        {employmentRoles.map((exp, idx) => (
          <div
            key={exp.id}
            className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Briefcase
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {exp.company}
                  </h3>
                  {idx === 0 ? (
                    <Badge variant="accent">Current Role</Badge>
                  ) : null}
                </div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {exp.role}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1 font-mono text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{exp.period}</span>
                </span>
                <span>{exp.location}</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {exp.summary}
            </p>

            {/* Nested Project Contributions */}
            <div className="mt-6 space-y-4">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Key Projects & Contributions ({exp.projects.length})
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {exp.projects.map((proj) => (
                  <div
                    key={proj.projectSlug}
                    className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/60 p-4 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/projects/${proj.projectSlug}`}
                          className="text-sm font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                        >
                          <span>{proj.name}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground leading-relaxed">
                        {proj.highlights.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
                      {proj.stack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="subtle"
                          className="font-mono text-[10px]"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dedicated Freelance Work Section */}
      {freelanceRoles.length > 0 ? (
        <div id="freelance" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Globe
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Freelance & Independent Web Delivery
            </h3>
          </div>
          {freelanceRoles.map((free) => (
            <div
              key={free.id}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {free.summary}
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {free.projects.map((proj) => (
                  <div
                    key={proj.projectSlug}
                    className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/projects/${proj.projectSlug}`}
                        className="text-sm font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                      >
                        <span>{proj.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <Badge variant="outline">Freelance</Badge>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground leading-relaxed">
                      {proj.highlights.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {proj.stack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="subtle"
                          className="font-mono text-[10px]"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
