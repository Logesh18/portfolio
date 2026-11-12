# Logesh T — AI-Powered Personal Portfolio

Production-oriented, privacy-first personal portfolio and grounded RAG AI assistant for **Logesh T (Software Engineer L2 | Full Stack Developer)**, built with **Next.js App Router, React 19, TypeScript (strict), Tailwind CSS, Zod, Vitest, Playwright, and Ollama (`qwen3:1.7b` + deterministic BM25 retrieval)**.

---

## Key Highlights

- **Complete Verified Project Inventory (13 Case Studies)**:
  - **Techcedence Infosystems Pvt. Ltd.** (*Software Engineer L2, 22 Jan 2024 – Present*): `TracAssets`, `Ursamin` (Frontend scope), `LCP`, `Pricing Calculator`, `Stock Take`, `B&D Plumbers`, and `ISkreen` (always `ISkreen`, never `Smart ID`).
  - **IResponsive Solutions** (*Software Engineer, Oct–Nov 2023*): `TN School Mobile App` (requirements, technical/cost documentation, and initial Node.js/MongoDB backend codebase template).
  - **iamneo** (*Software Engineer, Jul 2021 – Oct 2023*): `Neo Platform`, `Neo Exam / NeoExamShield`, and `Neo Defenders`.
  - **Freelance Work**: `London Tamil Sangam` and `Kongu Engineering College Alumni Website` (both WordPress-based).
- **Grounded AI Portfolio Assistant**:
  - Uses deterministic entity matching + **Okapi BM25 retrieval** over `src/content/public/*.json`.
  - Connects server-side to a private **Ollama** model (`qwen3:1.7b` default, configurable via `OLLAMA_MODEL`).
  - Automatically falls back to deterministic grounded synthesis and an **Instant FAQ & Search** tab when local model inference is offline.
- **Defense-in-Depth Privacy & Security**:
  - Raw resumes (`../resume/`) are physically isolated outside `portfolio/` and excluded from client bundles and Docker images.
  - Private PII (phone numbers, personal email addresses, street addresses, internal client names) is excluded from the public knowledge base and actively redacted by the output policy filter.
  - Outbound links are restricted to an explicit owner-approved allowlist (`src/lib/security/allowlist.ts`).
  - Protected by Zod schema validation, payload size caps, sliding-window per-IP rate limiting, prompt-injection detection, and CSP headers.

---

## Repository Structure

```text
portfolio/
  src/app/(site)/page.tsx, about/, experience/, projects/, projects/[slug]/, contact/
  src/app/api/assistant/route.ts, api/health/route.ts
  src/components/ui/, layout/, sections/, projects/, experience/, assistant/
  src/features/portfolio/{domain,application,infrastructure}/
  src/features/assistant/{domain,application,infrastructure}/
  src/lib/{validation,security,utils,config}/
  src/content/public/{profile,experience,projects,skills,education,certifications,publications,faq}.json
  src/types/, src/tests/
  public/images/, public/documents/
  docs/architecture.md, scripts/, Dockerfile, compose.yaml, .env.example
```

---

## Local Development Setup

### 1. Install Dependencies
```bash
cd portfolio
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. (Optional) Start Local Ollama Model
To run live local LLM inference alongside the deterministic BM25 retrieval engine:
```powershell
# PowerShell
.\scripts\setup-ollama.ps1 -Model "qwen3:1.7b"
```
Or on Linux/macOS:
```bash
bash ./scripts/setup-ollama.sh
```
*(Note: If Ollama is not installed or not running, the portfolio and AI assistant still work out-of-the-box using the built-in deterministic BM25 RAG engine!)*

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Updating Public Content & Switching Models

### Updating Portfolio Content
All public portfolio content is stored in human-reviewed, Zod-validated JSON files under `src/content/public/`:
- `profile.json` — Headline, summary, social links, and AI positioning note
- `experience.json` — Full-time roles and freelance section
- `projects.json` — All 13 project case studies (`tracassets`, `ursamin`, `lcp`, `pricing-calculator`, `stock-take`, `bd-plumbers`, `iskreen`, `tn-school-mobile-app`, `neo-platform`, `neo-exam-shield`, `neo-defenders`, `london-tamil-sangam`, `kongu-alumni-website`)
- `skills.json` — Categorized technical skills & AI-assisted development workflow
- `education.json`, `certifications.json`, `publications.json`, `faq.json`

After editing any JSON file, run `npm test` to verify schema compliance, link allowlisting, and privacy rules.

### Switching the AI Model Without Code Changes
Update `OLLAMA_MODEL` in `.env.local` or `compose.yaml`:
```env
OLLAMA_MODEL=qwen3:1.7b
# Or any Ollama-compatible instruct model:
# OLLAMA_MODEL=qwen2.5:1.5b-instruct
# OLLAMA_MODEL=llama3.2:1b
```

---

## Quality Gates & Testing

```bash
# TypeScript strict check
npm run typecheck

# ESLint check
npm run lint

# Unit, integration, retrieval, privacy & adversarial security tests (Vitest)
npm test

# Smoke test
npm run smoke

# Production build
npm run build
```

---

## Production Deployment with Docker Compose

```bash
docker compose up -d --build
# Pull the model inside the private ollama container once started:
docker exec -it logesh-portfolio-ollama ollama pull qwen3:1.7b
```
The `ollama` service runs on an internal Docker network (`inference_internal`) and is never exposed directly to the public internet.
