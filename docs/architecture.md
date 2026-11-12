# System Architecture, RAG Pipeline, Security Model & Deployment Blueprint

This document provides the complete technical architecture, Mermaid source diagrams (corresponding to **Diagrams A–E** in the specification PDF), model benchmark & sizing analysis, security trust boundaries, and owner review procedures for **Logesh T's AI-Powered Personal Portfolio**.

---

## Diagram A — AI Assistant Request and Retrieval Flow

```mermaid
flowchart TD
    A["Visitor asks a question<br/>(Chat UI sends limited request to Next.js server endpoint)"] --> B["Validate and protect<br/>(Zod schema, size caps, rate limits, timeout and abuse checks)"]
    B --> C["Retrieve approved facts<br/>(Public structured knowledge + BM25 / deterministic lookup)"]
    C --> D["Generate grounded answer<br/>(Private model service receives minimal retrieved context)"]
    D --> E["Check and respond<br/>(Policy checks, safe rendering, citations and fallback)"]
```

*All retrieval sources are approved public facts (`src/content/public/*.json`); the model cannot query private files.*

---

## Diagram B — Data Classification and Security Boundary

```mermaid
flowchart TD
    Z1["Private authoring zone<br/>(Resume/CV originals in ../resume/, draft content, unpublished notes and secrets)"] --> Z2["Explicit review / publish gate<br/>(Validate facts, redact sensitive fields and approve URLs)"]
    Z2 --> Z3["Public knowledge repository<br/>(Only publishable JSON content in src/content/public/*.json and approved documents)"]
    Z3 --> Z4["Protected assistant service<br/>(Retrieval restricted to public repository; no private file access)"]
    Z4 --> Z5["Visitor-facing output<br/>(Sanitized response, public references and approved links only)"]
```

*No automatic private-to-public synchronization.*

---

## Diagram C — High-Level Production Architecture

```mermaid
flowchart TD
    Browser["Browser / Search Engine<br/>(SSR/SSG portfolio pages, accessible chat interface, SEO)"] --> AppRouter["Next.js App Router<br/>(Server Components, project routes, public content and assistant API)"]
    AppRouter --> AppServices["Application services<br/>(Content repository, retrieval, security and model provider interfaces)"]
    AppServices --> ModelEndpoint["Private model endpoint<br/>(Ollama-compatible inference, authenticated internal network)"]
    ModelEndpoint --> OpsServices["Operational services<br/>(Monitoring, rate-limit store, health checks and deployments)"]
```

*Next.js never exposes model credentials or private inference URL to the browser.*

---

## Diagram D — Feature Module Dependency Direction

```mermaid
flowchart TD
    Pres["Presentation / Route handlers<br/>(React UI and HTTP adapters call application use cases)"] --> AppUC["Application use cases<br/>(AnswerQuestion, RetrieveFacts, ListProjects and content queries)"]
    AppUC --> Domain["Domain interfaces and types<br/>(Knowledge repository, model provider, public policy contracts)"]
    Domain --> Infra["Infrastructure adapters<br/>(JSON/BM25 repository, Ollama HTTP client, rate-limit provider)"]
```

*Logical dependency direction: Presentation → Application → Domain ← Infrastructure (infrastructure implements domain interfaces).*

---

## Diagram E — Deployment Topology

```mermaid
flowchart TD
    Visitors["Internet visitors<br/>(HTTPS to public domain and CDN / reverse proxy)"] --> WebContainer["Next.js web container / platform<br/>(Public SSR pages + protected server-side assistant API)"]
    WebContainer --> PrivateNet["Private network / authenticated tunnel<br/>(No browser access; authenticated app-to-model requests)"]
    PrivateNet --> InferenceServer["Inference server / Ollama<br/>(Quantized model on always-on CPU/GPU-capable machine)"]
    InferenceServer --> Fallback["Fallback path<br/>(Public project search, deterministic RAG and FAQ if inference is unhealthy)"]
```

*Do not assume serverless hosting includes persistent model inference.*

---

## Local Open-Weight Model Evaluation & Resource Requirements

| Criterion | Recommended Default (`qwen3:1.7b`) | Alternative Lightweight (`qwen2.5:1.5b-instruct` / `llama3.2:1b`) |
| :--- | :--- | :--- |
| **Weights & License** | Open-weight Apache-2.0 (`qwen3:1.7b`) | Open-weight Apache-2.0 / Llama 3.2 Community |
| **Quantization** | `Q4_K_M` (~1.1–1.4 GB disk footprint) | `Q4_K_M` (~0.9–1.1 GB disk footprint) |
| **RAM / VRAM Footprint** | ~2.2 GB RAM (CPU inference) or 2 GB VRAM | ~1.8 GB RAM (CPU inference) |
| **Context Window Used** | 2,048 tokens (minimal retrieved facts + question) | 2,048 tokens |
| **Typical CPU Latency** | 1.5s – 4.5s on 2–4 modern vCPUs | 1.0s – 3.0s on 2–4 modern vCPUs |
| **Offline / Failure Behavior** | Automatic zero-latency deterministic BM25 RAG synthesis + Instant FAQ search tab | Automatic zero-latency deterministic BM25 RAG synthesis |

### Hosting Cost & Operational Reality
- **Free Model Weights ≠ Free Compute**: While `qwen3:1.7b` model weights are free to download and require no paid OpenAI API key, running an always-on Ollama container in production requires a VPS or dedicated host with at least **4 GB RAM and 2 vCPUs** (typically \$10–\$24/month on Hetzner, DigitalOcean, or AWS Lightsail), or an owned home/edge server connected via a private WireGuard/Cloudflare tunnel.
- **Zero-Downtime Fallback**: If the Next.js container is deployed on a low-memory host or if the Ollama container is stopped/unreachable, `answerVisitorQuestion` automatically degrades to the deterministic BM25 RAG engine (`mode: "deterministic-rag"`), answering visitor questions accurately from `src/content/public/*.json` without errors.

---

## Owner Review & Content Gate Checklist

Before publishing updates to production, verify the following owner-review items:
1. **IEEE Publication Titles**: `src/content/public/publications.json` currently uses the verified CV labels (`IEEE Publication 1` for Document `#9740832` and `IEEE Publication 2` for Document `#10113900`). Once confirmed by Logesh T, the exact paper titles can be added to `publications.json`.
2. **Public Contact Preferences**: Personal phone (`+91 73057 46782`), personal email (`logesh1892000@gmail.com`), and street address (`Pallakkapalyam, Namakkal, 637303`) are redacted across all public files. If Logesh wishes to publish a dedicated public work/contact email later, update `src/content/public/profile.json` and `src/lib/security/allowlist.ts`.
3. **Allowlisted URLs**: All external links are enforced by `src/lib/security/allowlist.ts` and validated by `src/tests/portfolio-content.test.ts`.
