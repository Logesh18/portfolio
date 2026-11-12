import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/project-card";
import { SafeMarkdown } from "@/components/ui/safe-markdown";
import { getProjectCaseStudy } from "@/features/portfolio/application/queries";

describe("UI Components & Safe Markdown Rendering", () => {
  it("renders ProjectCard with title, domain, stack, and case-study link", () => {
    const tracassets = getProjectCaseStudy("tracassets");
    expect(tracassets).toBeDefined();

    render(<ProjectCard project={tracassets!} />);
    expect(screen.getByText("TracAssets")).toBeInTheDocument();
    expect(
      screen.getByText("Enterprise & Asset Management")
    ).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read Case Study/i })).toHaveAttribute(
      "href",
      "/projects/tracassets"
    );
  });

  it("renders SafeMarkdown with approved links and strips unapproved links to plain text", () => {
    render(
      <SafeMarkdown content="Explore **TracAssets** at [Case Study](/projects/tracassets) or [Unapproved](https://malicious.example.org)" />
    );

    expect(screen.getByText("TracAssets")).toBeInTheDocument();
    const validLink = screen.getByRole("link", { name: "Case Study" });
    expect(validLink).toHaveAttribute("href", "/projects/tracassets");

    expect(
      screen.queryByRole("link", { name: "Unapproved" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Unapproved")).toBeInTheDocument();
  });
});
