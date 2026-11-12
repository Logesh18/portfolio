import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPortfolioSnapshot } from "@/features/portfolio/application/queries";
import { SectionHeader } from "@/components/ui/section-header";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";

export const metadata: Metadata = {
  title: "Professional Experience & Freelance Work",
  description:
    "Complete software engineering career history of Logesh T across Techcedence Infosystems Pvt. Ltd., IResponsive Solutions, iamneo, and independent WordPress freelance engagements.",
};

export default function ExperiencePage() {
  const { experiences } = getPortfolioSnapshot();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SectionHeader
        eyebrow="Experience // Career History"
        title="Software Engineering Roles & Freelance Delivery"
        description="More than four years of software development experience across enterprise asset management, healthcare frontends, mobile warehouse auditing, low-code platforms, and EdTech."
        rightSlot={
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Explore All 13 Project Case Studies</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        }
      />

      <ExperienceTimeline experiences={experiences} />
    </div>
  );
}
