export interface AppConfig {
  ollamaBaseUrl: string;
  ollamaModel: string;
  ollamaTimeoutMs: number;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;
  siteUrl: string;
}

export function getAppConfig(): AppConfig {
  return {
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
    ollamaModel: process.env.OLLAMA_MODEL || "qwen3:1.7b",
    ollamaTimeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS || 12000),
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX || 20),
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}
