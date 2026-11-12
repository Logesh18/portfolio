import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getPortfolioSnapshot } from "@/features/portfolio/application/queries";
import { HeroSection } from "@/components/sections/hero-section";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";
import { SkillsAndAiSection } from "@/components/sections/skills-and-ai-section";
import { CredentialsSection } from "@/components/sections/credentials-section";

export default function HomePage() {
  const {
    profile,
    experiences,
    featuredProjects,
    allProjects,
    skills,
    education,
    certifications,
    publications,
  } = getPortfolioSnapshot();

  return (
    <div className="space-y-24 pb-12">
      {/* 1. Hero Section */}
      <HeroSection profile={profile} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 2. About Overview */}
        <section id="about" className="scroll-mt-20">
          <SectionHeader
            eyebrow="00 // Professional Profile"
            title="Engineering Production Web, Mobile & Enterprise Platforms"
            description={profile.summary}
            rightSlot={
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Full Profile & Credentials</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
              {profile.aboutParagraphs.slice(0, 2).map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  At a Glance
                </p>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Current Role</dt>
                    <dd className="font-medium text-foreground text-right">
                      Software Engineer L2
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Employer</dt>
                    <dd className="font-medium text-foreground text-right">
                      Techcedence Infosystems
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Experience</dt>
                    <dd className="font-medium text-foreground text-right">
                      4+ Years (Since Jul 2021)
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Verified Projects</dt>
                    <dd className="font-medium text-foreground text-right">
                      13 Delivered Case Studies
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Education</dt>
                    <dd className="font-medium text-foreground text-right">
                      B.E. CSE (9.25 CGPA)
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Verified against official CV & source-of-truth audit.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Projects */}
        <section id="featured-projects" className="scroll-mt-20">
          <SectionHeader
            eyebrow="01 // Featured Work"
            title="Selected Enterprise, Healthcare, Mobile & EdTech Systems"
            description="Highlighted engineering projects across Techcedence Infosystems and iamneo."
            rightSlot={
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View All 13 Case Studies</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {/* 4. Experience & Freelance Timeline */}
        <section id="experience" className="scroll-mt-20">
          <SectionHeader
            eyebrow="02 // Career & Freelance Timeline"
            title="Professional Experience & Independent Delivery"
            description="Clear company, role, and date hierarchy across Techcedence Infosystems, IResponsive Solutions, iamneo, and WordPress freelance engagements."
          />
          <ExperienceTimeline experiences={experiences} />
        </section>

        {/* 5. All Projects Interactive Explorer */}
        <section id="all-projects" className="scroll-mt-20">
          <SectionHeader
            eyebrow="02.5 // Complete Project Inventory"
            title="Explore All 13 Verified Projects"
            description="Filter by domain or technology across enterprise asset management, healthcare, low-code platforms, mobile RFID auditing, digital identity (ISkreen), EdTech, and freelance WordPress delivery."
          />
          <ProjectsExplorer projects={allProjects} />
        </section>

        {/* 6. Technical Skills & AI-Assisted Development */}
        <SkillsAndAiSection
          skills={skills}
          aiPositioningNote={profile.aiPositioningNote}
        />

        {/* 7. Education, Certifications & Publications */}
        <CredentialsSection
          education={education}
          certifications={certifications}
          publications={publications}
        />

        {/* 8. Contact & Public Profiles CTA */}
        <section id="contact" className="scroll-mt-20">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  06 // Connect & Collaborate
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Interested in discussing full-stack, mobile, or enterprise engineering?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Reach out directly via phone or email, connect on LinkedIn and GitHub, or ask the AI portfolio assistant about any specific project or technology.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:border-blue-500/40 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  <span>Contact Page</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/70 pt-6 text-xs">
              <a
                href={`mailto:${profile.contactInfo.email}`}
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <span>{profile.contactInfo.email}</span>
              </a>
              <a
                href={`tel:${profile.contactInfo.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <span>{profile.contactInfo.phone}</span>
              </a>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span>{profile.contactInfo.address}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
