import { NextResponse } from "next/server";
import { ollamaProvider } from "@/features/assistant/infrastructure/ollama-provider";
import { bm25Retriever } from "@/features/assistant/infrastructure/bm25-retriever";

export async function GET() {
  const modelStatus = await ollamaProvider.checkHealth();
  const indexedChunks = bm25Retriever.getAllChunks().length;

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      knowledgeBase: {
        ready: indexedChunks > 0,
        indexedChunks,
      },
      inference: {
        healthy: modelStatus.healthy,
        model: modelStatus.model,
        fallbackActive: !modelStatus.healthy,
        message: modelStatus.message,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
