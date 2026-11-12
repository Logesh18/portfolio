import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  getPortfolioSnapshot,
  getProjectCaseStudy,
} from "@/features/portfolio/application/queries";
import { Badge } from "@/components/ui/badge";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { allProjects } = getPortfolioSnapshot();
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCaseStudy(slug);
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — ${project.domain} Case Study`,
    description: project.summary,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectCaseStudy(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Back Navigation */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to All 13 Projects</span>
        </Link>
      </div>

      {/* Header Banner */}
      <header className="rounded-2xl border border-border bg-card p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{project.domain}</Badge>
          <Badge variant="outline">
            {project.originType === "freelance"
              ? "Freelance Engagement"
              : "Enterprise Employment"}
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            {project.subtitle}
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-border/70 pt-5 text-xs">
          <div className="space-y-1">
            <span className="font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Organization / Category</span>
            </span>
            <p className="font-semibold text-foreground">{project.employer}</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Role</span>
            </span>
            <p className="font-semibold text-foreground">{project.role}</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Timeline</span>
            </span>
            <p className="font-semibold text-foreground">{project.period}</p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="border-t border-border/70 pt-5 space-y-2">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Technology Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="default" className="font-mono text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Explicit Scope Boundary Note */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 flex items-start gap-3">
        <ShieldAlert
          className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider font-semibold text-blue-700 dark:text-blue-300">
            Verified Role & Scope Boundary
          </p>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
            {project.scopeNote}
          </p>
        </div>
      </div>

      {/* Overview & Business Problem */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Verified Overview
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.summary}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Business Problem
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.businessProblem}
          </p>
        </section>
      </div>

      {/* Contributions & Key Features */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Layers
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-foreground">
              Specific Engineering Contributions
            </h2>
          </div>
          <ul className="space-y-3">
            {project.contributions.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
              >
                <CheckCircle2
                  className="h-4 w-4 text-blue-500 shrink-0 mt-1"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-foreground">
              Key Features
            </h2>
          </div>
          <ul className="space-y-2.5">
            {project.keyFeatures.map((feat, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-xs font-medium text-foreground"
              >
                {feat}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Challenges & Verified Impact */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="h-5 w-5 text-amber-500"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-foreground">
              Documented Technical Challenges
            </h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
            {project.challenges.map((challenge, idx) => (
              <li key={idx}>{challenge}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="h-5 w-5 text-emerald-500"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-foreground">
              Verified Impact & Outcomes
            </h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
            {project.verifiedImpact.map((impact, idx) => (
              <li key={idx}>{impact}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Confidentiality-Safe Architecture Notes */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-4">
          <div className="flex items-center gap-2">
            <Cpu
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-foreground">
              Confidentiality-Safe Architecture Notes
            </h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Verified facts vs. Illustrative/Proposed design patterns
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {project.architectureNotes.map((note, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {note.label}
                </h3>
                <Badge
                  variant={
                    note.classification === "verified" ? "accent" : "outline"
                  }
                  className="font-mono text-[10px] uppercase"
                >
                  {note.classification === "verified"
                    ? "Verified Stack"
                    : "Proposed / Illustrative"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {note.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
