import React from "react";
import {
  Award,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import type {
  CertificationItem,
  EducationItem,
  PublicationItem,
} from "@/types/portfolio";

interface CredentialsSectionProps {
  education: EducationItem[];
  certifications: CertificationItem[];
  publications: PublicationItem[];
}

export function CredentialsSection({
  education,
  certifications,
  publications,
}: CredentialsSectionProps) {
  return (
    <section id="credentials" className="scroll-mt-20 space-y-8">
      <SectionHeader
        eyebrow="05 // Academic & Professional Credentials"
        title="Education, Certifications & IEEE Publications"
        description="Verified academic record, industry certifications, and peer-reviewed IEEE conference publications."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Education */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
            <h3 className="text-base font-semibold text-foreground">
              Education
            </h3>
          </div>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="rounded-lg border border-border/70 bg-background/60 p-4 space-y-1.5"
              >
                <p className="text-sm font-semibold text-foreground">
                  {edu.degree}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {edu.institution}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    {edu.period}
                  </span>
                  <Badge variant="accent" className="font-mono">
                    {edu.score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Award className="h-5 w-5" aria-hidden="true" />
            <h3 className="text-base font-semibold text-foreground">
              Certifications
            </h3>
          </div>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="rounded-lg border border-border/70 bg-background/60 p-4 space-y-2"
              >
                <p className="text-sm font-semibold text-foreground">
                  {cert.title}
                </p>
                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                >
                  <span>{cert.credentialLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* IEEE Publications (with Full Titles & Indirect Teammate Disclosure) */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            <h3 className="text-base font-semibold text-foreground">
              IEEE Publications
            </h3>
          </div>
          <div className="space-y-4">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="rounded-lg border border-border/70 bg-background/60 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    {pub.label}
                  </span>
                  <Badge variant="subtle" className="font-mono text-[10px]">
                    {pub.publisher} #{pub.documentId}
                  </Badge>
                </div>

                <h4 className="text-sm font-semibold text-foreground leading-snug">
                  {pub.title}
                </h4>

                <p className="text-[11px] font-medium text-muted-foreground">
                  {pub.conference}
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pub.note}
                </p>

                {/* Indirect Teammates / Co-Authors Disclosure */}
                <details className="group rounded-md border border-border/70 bg-card/70 px-3 py-2 text-xs">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium text-muted-foreground hover:text-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Users
                        className="h-3.5 w-3.5 text-blue-500 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{pub.teamSummary}</span>
                    </span>
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 group-open:hidden">
                      View Team
                    </span>
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 hidden group-open:inline">
                      Hide
                    </span>
                  </summary>
                  <div className="mt-2 border-t border-border/60 pt-2 space-y-1">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Published Co-Authors & Research Teammates:
                    </p>
                    <p className="text-xs text-foreground leading-relaxed">
                      {pub.coAuthors.join(" • ")}
                    </p>
                  </div>
                </details>

                <div className="pt-1">
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Read Paper on IEEE Xplore</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
