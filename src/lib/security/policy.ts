import { isApprovedUrl } from "./allowlist";

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules)/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|secret|api\s*key|password)/i,
  /disregard\s+(all\s+)?(previous|system|safety|privacy)/i,
  /print\s+(out\s+)?(env|environment\s+variables|\.env|private\s+files|raw\s+resume)/i,
  /act\s+as\s+(?:a\s+)?(?:hacker|root|jailbreak|dan|unrestricted)/i,
  /(?:cat|type|read)\s+(?:\/etc\/passwd|\.env|resume\/)/i,
];

const PRIVATE_PII_REQUEST_PATTERNS: RegExp[] = [
  /\b(phone\s*number|mobile\s*number|whatsapp|personal\s*email|email\s*address|gmail|home\s*address|street\s*address|residential\s*address|postal\s*code|pincode|637303|pallakkapalyam|7305746782|logesh1892000)\b/i,
  /\b(api\s*key|secret\s*key|password|private\s*repo|internal\s*customer\s*url|datafortune)\b/i,
];

const OUTPUT_REDACTION_PATTERNS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /\+?91[-\s]?73057\s*46782/g, replacement: "[REDACTED PHONE]" },
  { pattern: /\b7305746782\b/g, replacement: "[REDACTED PHONE]" },
  {
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: "[REDACTED EMAIL]",
  },
  { pattern: /\bPallakkapalyam\b/gi, replacement: "[REDACTED ADDRESS]" },
  { pattern: /\b637303\b/g, replacement: "[REDACTED PIN]" },
  { pattern: /\bDataFortune\b/gi, replacement: "[CONFIDENTIAL CLIENT]" },
  { pattern: /\bSmart\s*ID\b/gi, replacement: "ISkreen" },
];

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: "prompt_injection" | "private_pii_request";
  safeRefusalMessage?: string;
}

export function inspectUserQuestion(question: string): SecurityCheckResult {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(question)) {
      return {
        allowed: false,
        reason: "prompt_injection",
        safeRefusalMessage:
          "I can only answer factual questions about Logesh T's public portfolio, professional experience, technical skills, and verified projects. I cannot override system policies or access internal files.",
      };
    }
  }

  for (const pattern of PRIVATE_PII_REQUEST_PATTERNS) {
    if (pattern.test(question)) {
      return {
        allowed: false,
        reason: "private_pii_request",
        safeRefusalMessage:
          "Personal contact details (such as phone numbers, email addresses, and residential street addresses) are restricted inside the AI assistant chat. Please view Logesh's contact details directly on the [Contact Page](/contact) or connect via his LinkedIn and GitHub profiles.",
      };
    }
  }

  return { allowed: true };
}

export function sanitizeAssistantOutput(rawText: string): string {
  let text = rawText;

  // Strip raw HTML tags to prevent XSS
  text = text.replace(/<\/?[a-z][^>]*>/gi, "");

  // Enforce redaction rules inside AI output
  for (const { pattern, replacement } of OUTPUT_REDACTION_PATTERNS) {
    text = text.replace(pattern, replacement);
  }

  // Sanitize markdown links: keep label only if URL is not approved
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const cleanUrl = String(url).trim();
    if (isApprovedUrl(cleanUrl)) {
      return `[${label}](${cleanUrl})`;
    }
    return String(label);
  });

  return text.trim();
}
