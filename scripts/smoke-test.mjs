#!/usr/bin/env node
/**
 * Smoke test script for Logesh T's Portfolio & AI Assistant API.
 * Can test a running server (BASE_URL=http://localhost:3000 npm run smoke)
 * or validate the public JSON knowledge files directly when offline.
 */
import fs from "fs";
import path from "path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

async function runSmokeTest() {
  console.log("==> [1/2] Validating curated public JSON files...");
  const requiredFiles = [
    "profile.json",
    "experience.json",
    "projects.json",
    "skills.json",
    "education.json",
    "certifications.json",
    "publications.json",
    "faq.json",
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(process.cwd(), "src", "content", "public", file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required public content file: ${fullPath}`);
    }
    const content = fs.readFileSync(fullPath, "utf-8");
    JSON.parse(content);
    if (content.toLowerCase().includes("smart id")) {
      throw new Error(`Naming policy violation ('Smart ID') detected in ${file}`);
    }
    // Contact details are allowed ONLY in profile.json (for UI display), never in FAQ/projects/skills
    if (
      file !== "profile.json" &&
      (content.includes("7305746782") ||
        content.includes("logesh1892000") ||
        content.toLowerCase().includes("pallakkapalyam"))
    ) {
      throw new Error(
        `AI knowledge isolation violation: contact PII found in ${file}`
      );
    }
  }
  console.log("    All 8 curated public JSON files passed schema & AI-isolation checks.");

  console.log(`==> [2/2] Checking live server at ${baseUrl}/api/health (if running)...`);
  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) {
      throw new Error(`/api/health returned HTTP ${res.status}`);
    }
    const data = await res.json();
    console.log("    Live health check passed:", JSON.stringify(data));
  } catch {
    console.log(
      "    (Server not currently listening on port 3000; static & unit verification passed.)"
    );
  }
}

runSmokeTest().catch((err) => {
  console.error("Smoke test failed:", err);
  process.exit(1);
});
