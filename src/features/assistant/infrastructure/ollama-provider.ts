import { getAppConfig } from "@/lib/config/env";
import type {
  ModelGenerationResult,
  ModelHealthStatus,
  ModelProvider,
} from "../domain/contracts";

export class OllamaModelProvider implements ModelProvider {
  async generate(
    userQuestion: string,
    systemPrompt: string,
    contextText: string
  ): Promise<ModelGenerationResult> {
    const config = getAppConfig();
    const endpoint = `${config.ollamaBaseUrl.replace(/\/$/, "")}/api/chat`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.ollamaModel,
        stream: false,
        options: {
          temperature: 0.15,
          num_predict: 380,
        },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `APPROVED PUBLIC KNOWLEDGE CONTEXT:\n${contextText}\n\nVISITOR QUESTION:\n${userQuestion}\n\nProvide a concise, factual answer grounded strictly in the approved context above.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(config.ollamaTimeoutMs),
    });

    if (!response.ok) {
      throw new Error(`Ollama endpoint returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      message?: { content?: string };
      model?: string;
    };

    // Strip any <think>...</think> blocks that Qwen3 reasoning models may emit
    const rawContent = (data.message?.content ?? "")
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .trim();

    if (!rawContent) {
      throw new Error("Empty response from Ollama model");
    }

    return {
      text: rawContent,
      model: data.model || config.ollamaModel,
      fromLiveModel: true,
    };
  }

  async checkHealth(): Promise<ModelHealthStatus> {
    const config = getAppConfig();
    const start = Date.now();
    const tagsUrl = `${config.ollamaBaseUrl.replace(/\/$/, "")}/api/tags`;

    try {
      const response = await fetch(tagsUrl, {
        method: "GET",
        signal: AbortSignal.timeout(2500),
      });

      const latencyMs = Date.now() - start;
      if (!response.ok) {
        return {
          healthy: false,
          model: config.ollamaModel,
          configured: true,
          latencyMs,
          message: `Ollama responded with status ${response.status}. Deterministic RAG fallback is active.`,
        };
      }

      return {
        healthy: true,
        model: config.ollamaModel,
        configured: true,
        latencyMs,
        message: "Local Ollama inference service is online and reachable.",
      };
    } catch {
      return {
        healthy: false,
        model: config.ollamaModel,
        configured: true,
        latencyMs: Date.now() - start,
        message:
          "Local Ollama endpoint is currently offline; deterministic grounded RAG engine is active.",
      };
    }
  }
}

export const ollamaProvider = new OllamaModelProvider();
