/**
 * SERVERLESS LIMITATION:
 * This in-memory rate limiter is designed as a lightweight "soft shield" against HTTP spam.
 * In a Vercel/serverless environment, this Map is isolated to each active container instance 
 * and resets during cold starts. It does not perfectly synchronize limits globally.
 * However, it successfully acts as a fast first line of defense before hitting the definitive,
 * impenetrable Supabase database transaction quota (reserveAnalysisSlot).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitCache = new Map<string, RateLimitEntry>();
const LIMIT = 5;
const WINDOW_MS = 60 * 1000;

export function checkAiRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  
  // Occasional global cleanup to prevent unbounded memory growth in long-running instances
  if (Math.random() < 0.05) {
    for (const [key, entry] of rateLimitCache.entries()) {
      const validTimestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
      if (validTimestamps.length === 0) {
        rateLimitCache.delete(key);
      } else {
        entry.timestamps = validTimestamps;
      }
    }
  }

  const entry = rateLimitCache.get(userId) || { timestamps: [] };
  
  // Filter out expired timestamps for this user
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= LIMIT) {
    // Find the oldest timestamp in the current window to calculate Retry-After
    const oldest = entry.timestamps[0];
    const retryAfterSeconds = oldest ? Math.ceil((oldest + WINDOW_MS - now) / 1000) : 60;
    return { allowed: false, retryAfter: Math.max(1, retryAfterSeconds) };
  }

  // Allow request
  entry.timestamps.push(now);
  rateLimitCache.set(userId, entry);
  
  return { allowed: true };
}
