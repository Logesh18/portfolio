interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

export function checkRateLimit(
  identifier: string,
  maxRequests = 20,
  windowMs = 60_000,
  now = Date.now()
): RateLimitResult {
  const key = identifier || "anonymous";
  const existing = store.get(key) ?? { timestamps: [] };

  const windowStart = now - windowMs;
  const activeTimestamps = existing.timestamps.filter((t) => t > windowStart);

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0] ?? now;
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, oldest + windowMs - now),
    };
  }

  activeTimestamps.push(now);
  store.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - activeTimestamps.length),
    resetInMs: windowMs,
  };
}

export function resetRateLimitStore(): void {
  store.clear();
}
