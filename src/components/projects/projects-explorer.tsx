"use client";

import React, { useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { ProjectCard } from "./project-card";
import type { ProjectCategory, ProjectItem } from "@/types/portfolio";

const DOMAIN_OPTIONS: ("All" | ProjectCategory)[] = [
  "All",
  "Enterprise & Asset Management",
  "Healthcare",
  "Low-Code & Enterprise Pricing",
  "Mobile & Warehouse IoT",
  "Digital Identity & Security",
  "EdTech & Cloud",
  "Freelance",
];

const TECH_OPTIONS = [
  "All",
  "React",
  "Next.js",
  "Angular",
  "Node.js",
  "TypeScript",
  "React Native",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "SQLite",
  "Prisma ORM",
  "MQTT",
  "WordPress",
];

interface ProjectsExplorerProps {
  projects: ProjectItem[];
}

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [selectedDomain, setSelectedDomain] = useState<"All" | ProjectCategory>("All");
  const [selectedTech, setSelectedTech] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedDomain !== "All" && project.domain !== selectedDomain) {
        return false;
      }

      if (selectedTech !== "All") {
        const matchTech = project.stack.some(
          (t) => t.toLowerCase() === selectedTech.toLowerCase()
        );
        if (!matchTech) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          project.title,
          project.subtitle,
          project.employer,
          project.domain,
          project.summary,
          ...project.stack,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [projects, selectedDomain, selectedTech, searchQuery]);

  const hasActiveFilters =
    selectedDomain !== "All" ||
    selectedTech !== "All" ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 13 verified projects by title, stack, or keyword (e.g., BLE, Ursamin, ISkreen)..."
              aria-label="Search projects"
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setSelectedDomain("All");
                setSelectedTech("All");
                setSearchQuery("");
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          ) : null}
        </div>

        {/* Domain Filter Pills */}
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Filter className="h-3 w-3" aria-hidden="true" />
            <span>Filter by Domain</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DOMAIN_OPTIONS.map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => setSelectedDomain(domain)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedDomain === domain
                    ? "bg-blue-600 text-white"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Technology Filter Pills */}
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Filter by Technology
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TECH_OPTIONS.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => setSelectedTech(tech)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                  selectedTech === tech
                    ? "bg-foreground text-background font-semibold"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>
          Showing {filteredProjects.length} of {projects.length} verified projects
        </span>
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center space-y-2">
          <p className="text-base font-medium text-foreground">
            No projects match the current filters.
          </p>
          <p className="text-xs text-muted-foreground">
            Try clearing a technology or domain filter to view all 13 verified projects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
