# PowerShell script to pull and test the default Ollama model for local development
param(
    [string]$Model = $(if ($env:OLLAMA_MODEL) { $env:OLLAMA_MODEL } else { "qwen3:1.7b" })
)

Write-Host "==> Checking for Ollama CLI..." -ForegroundColor Cyan
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host "Ollama is not installed or not in PATH." -ForegroundColor Yellow
    Write-Host "Install Ollama from https://ollama.com/download or run via Docker Compose (docker compose up -d)."
    exit 1
}

Write-Host "==> Pulling model: $Model" -ForegroundColor Cyan
ollama pull $Model

Write-Host "==> Running quick inference check on $Model..." -ForegroundColor Cyan
ollama run $Model "Respond in one sentence: Ready to serve Logesh T's portfolio assistant."
