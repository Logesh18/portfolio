export interface CitationLink {
  label: string;
  href: string;
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  category:
    | "profile"
    | "experience"
    | "project"
    | "skill"
    | "education"
    | "certification"
    | "publication"
    | "faq";
  content: string;
  href: string;
  keywords: string[];
  score?: number;
}

export interface KnowledgeRetriever {
  retrieve(query: string, topK?: number): KnowledgeChunk[];
  getAllChunks(): KnowledgeChunk[];
}

export interface ModelGenerationResult {
  text: string;
  model: string;
  fromLiveModel: boolean;
}

export interface ModelHealthStatus {
  healthy: boolean;
  model: string;
   configured: boolean;
  latencyMs?: number;
  message: string;
}

export interface ModelProvider {
  generate(
    userQuestion: string,
    systemPrompt: string,
    contextText: string
  ): Promise<ModelGenerationResult>;
  checkHealth(): Promise<ModelHealthStatus>;
}

export interface AssistantResponse {
  answer: string;
  citations: CitationLink[];
  mode: "ollama" | "deterministic-rag" | "policy-refusal";
  model: string;
  retrievedFactsCount: number;
}
