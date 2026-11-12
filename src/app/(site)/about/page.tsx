import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, ShieldCheck } from "lucide-react";
import { getPortfolioSnapshot } from "@/features/portfolio/application/queries";
import { SectionHeader } from "@/components/ui/section-header";
import { CredentialsSection } from "@/components/sections/credentials-section";
import { SkillsAndAiSection } from "@/components/sections/skills-and-ai-section";

export const metadata: Metadata = {
  title: "About Logesh T",
  description:
    "Learn about Logesh T — Software Engineer L2 at Techcedence Infosystems Pvt. Ltd., full-stack web & mobile developer, B.E. CSE graduate from Kongu Engineering College (9.25 CGPA), and IEEE author.",
};

export default function AboutPage() {
  const { profile, skills, education, certifications, publications } =
    getPortfolioSnapshot();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-20">
      <section className="space-y-8">
        <SectionHeader
          eyebrow="About // Logesh T"
          title={`${profile.name} — ${profile.role}`}
          description={profile.headline}
          rightSlot={
            <a
              href="/documents/Logesh_T_Public_Profile_Summary.md"
              download="Logesh_T_Public_Profile_Summary.md"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:border-blue-500/40"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download Public Profile</span>
            </a>
          }
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
            {profile.aboutParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-base font-semibold text-foreground">
                Verified Career & Contact Snapshot
              </h2>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>Current Employer</span>
                  <span className="font-medium text-foreground text-right">
                    {profile.currentEmployer}
                  </span>
                </li>
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>Joined Current Role</span>
                  <span className="font-medium text-foreground text-right">
                    {profile.joinedDate}
                  </span>
                </li>
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>Total Experience</span>
                  <span className="font-medium text-foreground text-right">
                    {profile.experienceYears}
                  </span>
                </li>
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>Email</span>
                  <a
                    href={`mailto:${profile.contactInfo.email}`}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline text-right"
                  >
                    {profile.contactInfo.email}
                  </a>
                </li>
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>Phone</span>
                  <a
                    href={`tel:${profile.contactInfo.phone.replace(/\s+/g, "")}`}
                    className="font-medium text-foreground hover:underline text-right"
                  >
                    {profile.contactInfo.phone}
                  </a>
                </li>
                <li className="flex justify-between border-b border-border/60 pb-2 gap-4">
                  <span className="shrink-0">Address</span>
                  <span className="font-medium text-foreground text-right">
                    {profile.contactInfo.address}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Spoken Languages</span>
                  <span className="font-medium text-foreground text-right">
                    {profile.languages.join(", ")}
                  </span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/experience"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>View Complete Experience Timeline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-xs font-semibold uppercase tracking-wider font-mono">
                  AI Assistant Privacy Gate
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.privacyNotice}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SkillsAndAiSection
        skills={skills}
        aiPositioningNote={profile.aiPositioningNote}
      />

      <CredentialsSection
        education={education}
        certifications={certifications}
        publications={publications}
      />
    </div>
  );
}
