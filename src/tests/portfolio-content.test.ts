import { describe, expect, it } from "vitest";
import { getPortfolioSnapshot } from "@/features/portfolio/application/queries";
import { bm25Retriever } from "@/features/assistant/infrastructure/bm25-retriever";
import { isApprovedUrl } from "@/lib/security/allowlist";

describe("Source-of-Truth & Public Portfolio Content Audit", () => {
  const snapshot = getPortfolioSnapshot();

  it("includes all 13 verified projects with expected slugs", () => {
    const slugs = snapshot.allProjects.map((p) => p.slug);
    expect(slugs).toHaveLength(13);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "tracassets",
        "ursamin",
        "lcp",
        "pricing-calculator",
        "stock-take",
        "bd-plumbers",
        "iskreen",
        "tn-school-mobile-app",
        "neo-platform",
        "neo-exam-shield",
        "neo-defenders",
        "london-tamil-sangam",
        "kongu-alumni-website",
      ])
    );
  });

  it("uses ISkreen consistently and never uses Smart ID in any public content", () => {
    const serialized = JSON.stringify(snapshot);
    expect(serialized).toContain("ISkreen");
    expect(serialized.toLowerCase()).not.toContain("smart id");
    expect(serialized.toLowerCase()).not.toContain("smartid");
  });

  it("categorizes London Tamil Sangam and Kongu Alumni Website as freelance WordPress projects", () => {
    const freelanceSlugs = snapshot.freelanceProjects.map((p) => p.slug);
    expect(freelanceSlugs).toEqual(
      expect.arrayContaining(["london-tamil-sangam", "kongu-alumni-website"])
    );

    for (const proj of snapshot.freelanceProjects) {
      expect(proj.originType).toBe("freelance");
      expect(proj.stack).toContain("WordPress");
    }
  });

  it("describes Ursamin strictly as Frontend scope and omits confidential client names", () => {
    const ursamin = snapshot.allProjects.find((p) => p.slug === "ursamin");
    expect(ursamin).toBeDefined();
    expect(ursamin?.scopeNote.toLowerCase()).toContain("frontend");
    expect(JSON.stringify(ursamin).toLowerCase()).not.toContain("datafortune");
  });

  it("describes TN School Mobile App accurately without claiming full app delivery", () => {
    const tnApp = snapshot.allProjects.find(
      (p) => p.slug === "tn-school-mobile-app"
    );
    expect(tnApp).toBeDefined();
    expect(tnApp?.employer).toBe("IResponsive Solutions");
    expect(tnApp?.scopeNote.toLowerCase()).toContain(
      "does not claim full production app delivery"
    );
  });

  it("includes full IEEE publication titles and indirect research teammate details", () => {
    expect(snapshot.publications).toHaveLength(2);
    expect(snapshot.publications[0]?.title).toBe(
      "Prediction of Best Optimizer for Facial Expression Detection using Convolutional Neural Network"
    );
    expect(snapshot.publications[0]?.coAuthors).toEqual(
      expect.arrayContaining([
        "K. Kousalya",
        "R. S. Mohana",
        "E. K. Jithendiran",
        "R. C. Kanishk",
        "T. Logesh",
      ])
    );

    expect(snapshot.publications[1]?.title).toBe(
      "Group Emotion Detection using Convolutional Neural Network"
    );
    expect(snapshot.publications[1]?.coAuthors).toEqual(
      expect.arrayContaining([
        "K. Kousalya",
        "R. S. Mohana",
        "B. Krishna Kumar",
        "E. K. Jithendiran",
        "R. C. Kanishk",
        "T. Logesh",
        "E. Ranjith Kumar",
        "B. A. Sahithya",
      ])
    );
  });

  it("displays phone, email, and address in profile.contactInfo for the UI while excluding them from the AI retrieval corpus", () => {
    expect(snapshot.profile.contactInfo.phone).toBe("+91 73057 46782");
    expect(snapshot.profile.contactInfo.email).toBe("logesh1892000@gmail.com");
    expect(snapshot.profile.contactInfo.address).toContain("Pallakkapalyam");

    const aiCorpusSerialized = JSON.stringify(bm25Retriever.getAllChunks());
    expect(aiCorpusSerialized).not.toContain("7305746782");
    expect(aiCorpusSerialized).not.toContain("73057 46782");
    expect(aiCorpusSerialized).not.toContain("logesh1892000");
    expect(aiCorpusSerialized.toLowerCase()).not.toContain("pallakkapalyam");
    expect(aiCorpusSerialized).not.toContain("637303");
  });

  it("ensures all external links in profile, certifications, and publications are allowlisted", () => {
    for (const link of snapshot.profile.socialLinks) {
      expect(isApprovedUrl(link.url)).toBe(true);
    }
    for (const cert of snapshot.certifications) {
      expect(isApprovedUrl(cert.url)).toBe(true);
    }
    for (const pub of snapshot.publications) {
      expect(isApprovedUrl(pub.url)).toBe(true);
    }
  });
});
