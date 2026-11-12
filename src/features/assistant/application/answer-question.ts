import { getAppConfig } from "@/lib/config/env";
import { filterApprovedLinks } from "@/lib/security/allowlist";
import {
  inspectUserQuestion,
  sanitizeAssistantOutput,
} from "@/lib/security/policy";
import type {
  AssistantResponse,
  CitationLink,
  KnowledgeChunk,
  KnowledgeRetriever,
  ModelProvider,
} from "../domain/contracts";
import { bm25Retriever } from "../infrastructure/bm25-retriever";
import { ollamaProvider } from "../infrastructure/ollama-provider";

const SYSTEM_PROMPT = `You are Logesh T's AI Portfolio Assistant.
Rules you MUST follow strictly:
1. Answer ONLY using the provided APPROVED PUBLIC KNOWLEDGE CONTEXT.
2. Never invent employers, job dates, metrics, customer names, publication titles, or technologies.
3. Always use "ISkreen" (never "Smart ID").
4. Categorize London Tamil Sangam and Kongu Engineering College Alumni Website as Freelance WordPress projects.
5. Describe Ursamin strictly as Frontend scope (Next.js, React, TypeScript, Redux Toolkit, RTK Query, Material UI, Tailwind CSS).
6. Describe TN School Mobile App (IResponsive Solutions) as requirement gathering, technical documentation, cost analysis, and initial Node.js/MongoDB backend codebase template—do not imply full app delivery.
7. Do not present AI-assisted development tools (Google Antigravity, OpenAI Codex, ChatGPT) as prior commercial AI engineering employment.
8. If the requested fact is not in the context, state clearly that it is not available in the public portfolio.
9. Never expose private phone numbers, personal email addresses, or home addresses.`;

const UNVERIFIED_TOPIC_PATTERNS: { pattern: RegExp; topicLabel: string }[] = [
  {
    pattern: /\b(salary|compensation|ctc|paycheck|hourly\s+rate|bank\s+account)\b/i,
    topicLabel: "compensation or salary expectations",
  },
  {
    pattern: /\b(marital|age|date\s+of\s+birth|birthday|religion|caste|family|passport|aadhaar|pan\s+card)\b/i,
    topicLabel: "personal biographical or government ID details",
  },
  {
    pattern: /\b(rust|golang|solidity|blockchain|kubernetes|k8s|ruby\s+on\s+rails|c\+\+|swift|kotlin|flutter)\b/i,
    topicLabel: "that specific technology or framework",
  },
];

function deduplicateCitations(chunks: KnowledgeChunk[]): CitationLink[] {
  const seen = new Set<string>();
  const links: CitationLink[] = [];

  for (const chunk of chunks) {
    if (!seen.has(chunk.href)) {
      seen.add(chunk.href);
      links.push({
        label: chunk.title,
        href: chunk.href,
      });
    }
  }

  return filterApprovedLinks(links).slice(0, 4);
}

function synthesizeDeterministicAnswer(
  question: string,
  chunks: KnowledgeChunk[]
): string {
  const qLower = question.toLowerCase();

  // Check if user is asking about an unverified technology or non-public topic
  for (const { pattern, topicLabel } of UNVERIFIED_TOPIC_PATTERNS) {
    if (pattern.test(question)) {
      return `Information regarding **${topicLabel}** is not available in Logesh T's public portfolio. Based on his verified public profile, Logesh specializes in **React.js, Next.js, Angular, TypeScript, Node.js (Express, NestJS, Hapi), React Native, PostgreSQL, MySQL, MongoDB, SQLite, Prisma ORM, MQTT/BLE/RFID IoT, AWS, and GCP**.`;
    }
  }

  if (chunks.length === 0 || (chunks[0]?.score ?? 0) < 1.0) {
    return "That specific detail is not available in Logesh T's public portfolio. I can help you explore his verified experience at **Techcedence Infosystems**, **IResponsive Solutions**, and **iamneo**, his **13 engineering & freelance projects** (such as **TracAssets**, **Ursamin**, **Stock Take**, **ISkreen**, and **Neo Platform**), or his technical skills and IEEE publications.";
  }

  // Prefer direct FAQ match when top chunk is an FAQ with strong relevance
  const topFaq = chunks.find(
    (c) => c.category === "faq" && (c.score ?? 0) >= 4.0
  );
  if (topFaq) {
    const answerMatch = topFaq.content.split("Verified Answer:")[1];
    if (answerMatch) {
      return answerMatch.trim();
    }
  }

  // Handle "major projects" / "all projects" intent
  if (
    qLower.includes("major project") ||
    qLower.includes("all project") ||
    qLower.includes("what project") ||
    qLower.includes("his project")
  ) {
    return [
      "Logesh T has delivered **13 verified projects** across enterprise employment and freelance engagements:",
      "- **TracAssets (Techcedence)**: Enterprise asset management & IoT platform with BLE indoor floor maps, GPS geofencing, software license tracking, AMC maintenance, and 6-step asset transfers (*Angular, Node.js, PostgreSQL, Prisma, MQTT, WebSockets*).",
      "- **Ursamin (Techcedence)**: Healthcare frontend for patient profiles, care teams, medical records, treatment plans, and high-priority/ER dashboards (*Next.js, React, TypeScript, RTK Query*).",
      "- **Stock Take & B&D Plumbers (Techcedence)**: Offline-first React Native warehouse auditing apps with SQLite persistence, barcode scanning, Zebra SDK RFID, and Excel export.",
      "- **ISkreen (Techcedence)**: Digital identity badge & bag-tag platform with permission-based access and location tracking (*React, Node.js, MySQL*).",
      "- **LCP & Pricing Calculator (Techcedence)**: Reusable enterprise low-code modules and role-based multi-country vendor pricing (*Angular, Node.js, PostgreSQL, Prisma*).",
      "- **Neo Platform, NeoExamShield & Neo Defenders (iamneo)**: Power BI analytics, 2FA, chat mentions, 15,000-record export optimization (5 to 2 mins), exam-integrity Chrome extension in 18 days, and ~70 bugs resolved in 3 months.",
      "- **TN School Mobile App (IResponsive Solutions)**: Requirement gathering, technical/cost documentation, and initial Node.js/MongoDB backend codebase template.",
      "- **Freelance WordPress Sites**: **London Tamil Sangam** and **Kongu Engineering College Alumni Website**.",
    ].join("\n");
  }

  // Handle React experience specifically
  if (qLower.includes("react")) {
    return [
      "Logesh T uses **React.js, Next.js, and React Native** across web, healthcare, digital identity, and mobile warehouse applications:",
      "- **Ursamin (Techcedence)**: Built the healthcare frontend using **Next.js, React, TypeScript, Redux Toolkit, RTK Query, Material UI, and Tailwind CSS** covering patient records, care teams, treatment plans, and ER dashboards.",
      "- **ISkreen (Techcedence)**: Built customizable digital ID badge and bag-tag workflows using **React, Redux Toolkit, RTK Query, Node.js, and MySQL**.",
      "- **Stock Take & B&D Plumbers (Techcedence)**: Built offline-capable mobile inventory audit apps using **React Native, SQLite, Redux Toolkit, RTK Query, and Zebra SDK (RFID)**.",
      "- **Neo Platform, Neo Exam & Neo Defenders (iamneo)**: Delivered full-stack EdTech features and resolved defects across **React, Angular, Node.js, and MySQL**.",
    ].join("\n");
  }

  // Otherwise synthesize cleanly from the top retrieved chunk(s)
  const primary = chunks[0]!;
  if (primary.category === "project") {
    const lines = primary.content.split("\n");
    const overview =
      lines
        .find((l) => l.startsWith("Verified Overview:"))
        ?.replace("Verified Overview:", "")
        .trim() ?? primary.content;
    const stack =
      lines
        .find((l) => l.startsWith("Tech Stack:"))
        ?.replace("Tech Stack:", "")
        .trim() ?? "";
    const scope =
      lines
        .find((l) => l.startsWith("Scope Note:"))
        ?.replace("Scope Note:", "")
        .trim() ?? "";

    return `**${primary.title}**: ${overview}\n\n- **Tech Stack**: ${stack}\n- **Scope & Role**: ${scope}`;
  }

  return primary.content.replace(/^Question:.*\nVerified Answer:\s*/i, "");
}

export async function answerVisitorQuestion(
  rawQuestion: string,
  retriever: KnowledgeRetriever = bm25Retriever,
  modelProvider: ModelProvider = ollamaProvider
): Promise<AssistantResponse> {
  const config = getAppConfig();
  const question = rawQuestion.trim();

  // 1. Security & Trust Boundary check
  const securityCheck = inspectUserQuestion(question);
  if (!securityCheck.allowed) {
    return {
      answer:
        securityCheck.safeRefusalMessage ??
        "This request cannot be fulfilled due to portfolio privacy and security policies.",
      citations: [
        { label: "Contact & Public Profiles", href: "/contact" },
        { label: "About Logesh T", href: "/about" },
      ],
      mode: "policy-refusal",
      model: "security-policy-gate",
      retrievedFactsCount: 0,
    };
  }

  // 2. Retrieve approved public facts
  const retrievedChunks = retriever.retrieve(question, 4);
  const citations = deduplicateCitations(retrievedChunks);

  // Check if question asks about an explicitly unverified topic before calling LLM
  for (const { pattern } of UNVERIFIED_TOPIC_PATTERNS) {
    if (pattern.test(question)) {
      const safeUnknown = sanitizeAssistantOutput(
        synthesizeDeterministicAnswer(question, retrievedChunks)
      );
      return {
        answer: safeUnknown,
        citations:
          citations.length > 0
            ? citations
            : [{ label: "Technical Skills", href: "/#skills" }],
        mode: "deterministic-rag",
        model: "deterministic-knowledge-engine",
        retrievedFactsCount: retrievedChunks.length,
      };
    }
  }

  // 3. Try local Ollama model if reachable, otherwise fall back cleanly to deterministic grounded synthesis
  const contextText = retrievedChunks
    .map(
      (c, idx) =>
        `[Fact ${idx + 1} | ${c.title} | Source: ${c.href}]\n${c.content}`
    )
    .join("\n\n");

  if (retrievedChunks.length > 0 && (retrievedChunks[0]?.score ?? 0) >= 1.0) {
    try {
      const llmResult = await modelProvider.generate(
        question,
        SYSTEM_PROMPT,
        contextText
      );
      const sanitized = sanitizeAssistantOutput(llmResult.text);
      if (sanitized.length > 10) {
        return {
          answer: sanitized,
          citations:
            citations.length > 0
              ? citations
              : [{ label: "Explore Projects", href: "/projects" }],
          mode: "ollama",
          model: llmResult.model,
          retrievedFactsCount: retrievedChunks.length,
        };
      }
    } catch {
      // Graceful degradation to deterministic RAG synthesis when Ollama is offline
    }
  }

  const fallbackAnswer = sanitizeAssistantOutput(
    synthesizeDeterministicAnswer(question, retrievedChunks)
  );

  return {
    answer: fallbackAnswer,
    citations:
      citations.length > 0
        ? citations
        : [
            { label: "Explore Projects", href: "/projects" },
            { label: "Experience Timeline", href: "/experience" },
          ],
    mode: "deterministic-rag",
    model: `${config.ollamaModel} (deterministic-rag-fallback)`,
    retrievedFactsCount: retrievedChunks.length,
  };
}
