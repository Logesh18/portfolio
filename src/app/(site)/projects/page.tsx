import React from "react";
import type { Metadata } from "next";
import { getPortfolioSnapshot } from "@/features/portfolio/application/queries";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

export const metadata: Metadata = {
  title: "All Projects & Case Studies (13)",
  description:
    "Explore all 13 verified software engineering and freelance projects delivered by Logesh T: TracAssets, Ursamin, LCP, Pricing Calculator, Stock Take, B&D Plumbers, ISkreen, TN School Mobile App, Neo Platform, NeoExamShield, Neo Defenders, London Tamil Sangam, and Kongu Engineering College Alumni Website.",
};

export default function ProjectsPage() {
  const { allProjects } = getPortfolioSnapshot();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <SectionHeader
        eyebrow="Complete Project Inventory // 13 Case Studies"
        title="Enterprise, Healthcare, Mobile IoT, EdTech & Freelance Projects"
        description="Every project below is documented with its verified overview, business problem, role scope, technology stack, key contributions, challenges, impact, and confidentiality-safe architecture notes."
      />

      <ProjectsExplorer projects={allProjects} />
    </div>
  );
}
