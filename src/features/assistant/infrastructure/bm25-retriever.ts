import { portfolioRepository } from "@/features/portfolio/infrastructure/json-portfolio-repository";
import type {
  KnowledgeChunk,
  KnowledgeRetriever,
} from "../domain/contracts";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "about",
  "by",
  "of",
  "and",
  "or",
  "what",
  "which",
  "who",
  "whom",
  "does",
  "do",
  "did",
  "has",
  "have",
  "had",
  "he",
  "his",
  "him",
  "can",
  "you",
  "tell",
  "me",
  "explore",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]+/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function buildKnowledgeCorpus(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const profile = portfolioRepository.getProfile();
  const experiences = portfolioRepository.getExperiences();
  const projects = portfolioRepository.getAllProjects();
  const skills = portfolioRepository.getSkills();
  const education = portfolioRepository.getEducation();
  const certifications = portfolioRepository.getCertifications();
  const publications = portfolioRepository.getPublications();
  const faqs = portfolioRepository.getFaqs();

  // 1. Profile chunk (Explicitly omits profile.contactInfo phone/email/street address so the AI Assistant never receives PII)
  chunks.push({
    id: "profile-overview",
    title: `${profile.name} — ${profile.role}`,
    category: "profile",
    content: `${profile.name} is a ${profile.role} at ${profile.currentEmployer} (joined ${profile.joinedDate}, currently employed) with ${profile.experienceYears} of experience. ${profile.summary} ${profile.aboutParagraphs.join(" ")}`,
    href: "/about",
    keywords: [
      "logesh",
      "who",
      "profile",
      "role",
      "current",
      "employer",
      "techcedence",
      "experience",
      "summary",
      "about",
      "background",
    ],
  });

  // 2. FAQ chunks
  for (const faq of faqs) {
    chunks.push({
      id: `faq-${faq.id}`,
      title: faq.question,
      category: "faq",
      content: `Question: ${faq.question}\nVerified Answer: ${faq.answer}`,
      href: faq.relatedLinks[0]?.href || "/about",
      keywords: [...faq.keywords, ...tokenize(faq.question)],
    });
  }

  // 3. Project chunks
  for (const project of projects) {
    chunks.push({
      id: `project-${project.slug}`,
      title: `${project.title} (${project.employer})`,
      category: "project",
      content: [
        `Project: ${project.title} (${project.subtitle})`,
        `Employer / Category: ${project.employer} (${project.originType === "freelance" ? "Freelance" : "Employment"}, ${project.period})`,
        `Domain: ${project.domain} | Role: ${project.role}`,
        `Scope Note: ${project.scopeNote}`,
        `Tech Stack: ${project.stack.join(", ")}`,
        `Verified Overview: ${project.summary}`,
        `Key Contributions: ${project.contributions.join(" ")}`,
        `Verified Impact: ${project.verifiedImpact.join(" ")}`,
      ].join("\n"),
      href: `/projects/${project.slug}`,
      keywords: [
        project.slug,
        project.title.toLowerCase(),
        project.employer.toLowerCase(),
        project.domain.toLowerCase(),
        ...project.stack.map((s) => s.toLowerCase()),
        ...(project.originType === "freelance" ? ["freelance", "wordpress"] : []),
      ],
    });
  }

  // 4. Experience chunks
  for (const exp of experiences) {
    chunks.push({
      id: `experience-${exp.id}`,
      title: `${exp.role} at ${exp.company} (${exp.period})`,
      category: "experience",
      content: `${exp.company} — ${exp.role} (${exp.period}). ${exp.summary} Projects delivered: ${exp.projects
        .map((p) => `${p.name} (${p.stack.join(", ")}): ${p.highlights.join(" ")}`)
        .join(" | ")}`,
      href: "/experience",
      keywords: [
        exp.id,
        exp.company.toLowerCase(),
        exp.role.toLowerCase(),
        exp.type,
        "employer",
        "company",
        "work",
        "history",
        "career",
      ],
    });
  }

  // 5. Skill chunks
  for (const group of skills) {
    chunks.push({
      id: `skill-${group.id}`,
      title: `Skills — ${group.category}`,
      category: "skill",
      content: `${group.category}: ${group.skills.join(", ")}. ${group.description}${
        group.positioningDisclaimer ? ` Note: ${group.positioningDisclaimer}` : ""
      }`,
      href: group.isAiAssisted ? "/#ai-workflow" : "/#skills",
      keywords: [
        group.id,
        group.category.toLowerCase(),
        "skill",
        "skills",
        "tech",
        "stack",
        "know",
        ...group.skills.map((s) => s.toLowerCase()),
      ],
    });
  }

  // 6. Education, Certifications & Publications (with full titles & research team details)
  chunks.push({
    id: "education-credentials",
    title: "Education, Certifications & IEEE Publications",
    category: "education",
    content: [
      `Education: ${education
        .map((e) => `${e.degree} at ${e.institution} (${e.period}), ${e.score}`)
        .join("; ")}.`,
      `Certifications: ${certifications
        .map((c) => `${c.title} issued by ${c.issuer}`)
        .join("; ")}.`,
      `Publications: ${publications
        .map(
          (p) =>
            `${p.label}: "${p.title}" (${p.conference}, ${p.publisher} #${p.documentId}, ${p.teamSummary}: ${p.coAuthors.join(", ")})`
        )
        .join("; ")}.`,
    ].join(" "),
    href: "/about#credentials",
    keywords: [
      "education",
      "degree",
      "college",
      "kongu",
      "cgpa",
      "9.25",
      "certification",
      "certifications",
      "certificate",
      "ibm",
      "docker",
      "google",
      "ux",
      "publication",
      "publications",
      "ieee",
      "paper",
      "facial",
      "expression",
      "group",
      "emotion",
      "cnn",
      "teammates",
      "co-authors",
    ],
  });

  return chunks;
}

export class Bm25KnowledgeRetriever implements KnowledgeRetriever {
  private readonly corpus: KnowledgeChunk[];
  private readonly docTokens: Map<string, string[]>;
  private readonly docFreq: Map<string, number>;
  private readonly avgDocLength: number;

  constructor() {
    this.corpus = buildKnowledgeCorpus();
    this.docTokens = new Map();
    this.docFreq = new Map();

    let totalLength = 0;
    for (const chunk of this.corpus) {
      const tokens = tokenize(
        `${chunk.title} ${chunk.keywords.join(" ")} ${chunk.content}`
      );
      this.docTokens.set(chunk.id, tokens);
      totalLength += tokens.length;

      const unique = new Set(tokens);
      for (const term of unique) {
        this.docFreq.set(term, (this.docFreq.get(term) ?? 0) + 1);
      }
    }

    this.avgDocLength =
      this.corpus.length > 0 ? totalLength / this.corpus.length : 1;
  }

  getAllChunks(): KnowledgeChunk[] {
    return this.corpus;
  }

  retrieve(query: string, topK = 5): KnowledgeChunk[] {
    const queryLower = query.toLowerCase();
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
      return this.corpus.slice(0, topK);
    }

    const k1 = 1.5;
    const b = 0.75;
    const N = this.corpus.length;

    const scored: KnowledgeChunk[] = [];

    for (const chunk of this.corpus) {
      const tokens = this.docTokens.get(chunk.id) ?? [];
      const docLen = tokens.length || 1;

      const tfMap = new Map<string, number>();
      for (const t of tokens) {
        tfMap.set(t, (tfMap.get(t) ?? 0) + 1);
      }

      let bm25Score = 0;
      for (const qTerm of queryTokens) {
        let tf = tfMap.get(qTerm) ?? 0;

        if (tf === 0) {
          for (const [docTerm, count] of tfMap.entries()) {
            if (
              (docTerm.length >= 4 && qTerm.includes(docTerm)) ||
              (qTerm.length >= 4 && docTerm.includes(qTerm))
            ) {
              tf += count * 0.6;
            }
          }
        }

        if (tf > 0) {
          const df = this.docFreq.get(qTerm) ?? 1;
          const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
          const numerator = tf * (k1 + 1);
          const denominator =
            tf + k1 * (1 - b + b * (docLen / this.avgDocLength));
          bm25Score += idf * (numerator / denominator);
        }
      }

      let deterministicBoost = 0;
      for (const kw of chunk.keywords) {
        if (kw.length > 2 && queryLower.includes(kw.toLowerCase())) {
          deterministicBoost += 3.5;
        }
      }

      if (queryLower.includes(chunk.title.toLowerCase())) {
        deterministicBoost += 6.0;
      }

      if (chunk.category === "faq" && deterministicBoost >= 3.5) {
        deterministicBoost += 2.5;
      }

      const totalScore = bm25Score + deterministicBoost;
      if (totalScore > 0.25) {
        scored.push({
          ...chunk,
          score: Number(totalScore.toFixed(3)),
        });
      }
    }

    scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return scored.slice(0, topK);
  }
}

export const bm25Retriever = new Bm25KnowledgeRetriever();
