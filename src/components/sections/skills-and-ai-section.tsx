import React from "react";
import { Cpu, Sparkles, TerminalSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import type { SkillGroup } from "@/types/portfolio";

interface SkillsAndAiSectionProps {
  skills: SkillGroup[];
  aiPositioningNote: string;
}

export function SkillsAndAiSection({
  skills,
  aiPositioningNote,
}: SkillsAndAiSectionProps) {
  const coreSkills = skills.filter((s) => !s.isAiAssisted);
  const aiSkillGroup = skills.find((s) => s.isAiAssisted);

  return (
    <div className="space-y-16">
      <section id="skills" className="scroll-mt-20">
        <SectionHeader
          eyebrow="03 // Technical Capabilities"
          title="Full-Stack, Mobile, Data, Cloud & IoT Stack"
          description="Production technologies applied across enterprise asset tracking, healthcare frontends, offline warehouse auditing, and EdTech systems."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coreSkills.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-border bg-card p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                  {group.category}
                </h3>
                <Cpu className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {group.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {group.skills.map((skill) => (
                  <Badge key={skill} variant="default" className="font-mono text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {aiSkillGroup ? (
        <section id="ai-workflow" className="scroll-mt-20">
          <div className="rounded-2xl border border-blue-500/30 bg-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>04 // AI-Assisted Engineering Workflow</span>
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {aiSkillGroup.category}
                </h2>
              </div>
              <Badge variant="accent" className="w-fit font-mono">
                Developer Productivity & Rapid Prototyping
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {aiPositioningNote}
            </p>

            <div className="flex flex-wrap gap-2">
              {aiSkillGroup.skills.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 font-mono text-xs font-medium text-blue-700 dark:text-blue-300"
                >
                  <TerminalSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{tool}</span>
                </span>
              ))}
            </div>

            {aiSkillGroup.positioningDisclaimer ? (
              <p className="text-xs text-muted-foreground border-t border-border/60 pt-3 font-mono">
                Transparency note: {aiSkillGroup.positioningDisclaimer}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
