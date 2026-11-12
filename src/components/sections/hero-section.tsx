"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Download,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProfileData } from "@/types/portfolio";

interface HeroSectionProps {
  profile: ProfileData;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const triggerAssistant = () => {
    window.dispatchEvent(new CustomEvent("open-portfolio-assistant"));
  };

  return (
    <section className="relative overflow-hidden border-b border-border editorial-grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="font-mono">
              {profile.currentEmployer} • {profile.experienceYears} Experience
            </Badge>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{profile.location}</span>
            </span>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {profile.name} — {profile.role}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
              {profile.headline}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-1">
              {profile.subheadline}
            </p>
          </div>

          {/* 4 Required Hero CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>{profile.heroActions.exploreProjects}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:border-blue-500/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>{profile.heroActions.viewExperience}</span>
            </Link>

            <button
              type="button"
              onClick={triggerAssistant}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Bot className="h-4 w-4" aria-hidden="true" />
              <span>{profile.heroActions.askAssistant}</span>
            </button>

            <a
              href="/documents/Logesh_T_Public_Profile_Summary.md"
              download="Logesh_T_Public_Profile_Summary.md"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>{profile.heroActions.downloadResume}</span>
            </a>
          </div>

          {/* Quick Stack & Public Social Strip */}
          <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
              <span>Core Stack:</span>
              <span className="text-foreground">
                React • Next.js • Angular • Node.js • TypeScript • PostgreSQL • React Native
              </span>
            </div>

            <div className="flex items-center gap-3">
              {profile.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>{social.label}</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
