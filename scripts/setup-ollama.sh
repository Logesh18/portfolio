#!/usr/bin/env bash
set -euo pipefail

MODEL="${OLLAMA_MODEL:-qwen3:1.7b}"

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama CLI not found. Install from https://ollama.com or use Docker Compose."
  exit 1
fi

echo "==> Pulling model: ${MODEL}"
ollama pull "${MODEL}"

echo "==> Model ${MODEL} is ready."
