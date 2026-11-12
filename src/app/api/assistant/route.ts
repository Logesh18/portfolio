import { NextResponse } from "next/server";
import { AssistantRequestSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getAppConfig } from "@/lib/config/env";
import { answerVisitorQuestion } from "@/features/assistant/application/answer-question";

export async function POST(request: Request) {
  const config = getAppConfig();

  // Extract client identifier safely
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || "local-client";

  // 1. Enforce rate limit
  const rateLimit = checkRateLimit(
    clientIp,
    config.rateLimitMaxRequests,
    config.rateLimitWindowMs
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment before asking another question.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.resetInMs / 1000)),
        },
      }
    );
  }

  // 2. Enforce payload size cap (max 8 KB)
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8192) {
    return NextResponse.json(
      { error: "Request payload exceeds maximum allowed size." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  // 3. Validate with Zod schema
  const parsed = AssistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ||
          "Invalid assistant question format.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await answerVisitorQuestion(parsed.data.question);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while processing your question. Please try again.",
      },
      { status: 500 }
    );
  }
}
