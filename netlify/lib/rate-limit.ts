import type { SupabaseClient } from "@supabase/supabase-js";

export interface Limit {
  bucket: string;
  key: string;
  windowSeconds: number;
  max: number;
}

// Fallback for when the database is unavailable: best-effort, per function instance.
const memory = new Map<string, number[]>();

function memoryHit({ bucket, key, windowSeconds, max }: Limit): boolean {
  const id = `${bucket}:${key}`;
  const now = Date.now();
  const hits = (memory.get(id) ?? []).filter((t) => now - t < windowSeconds * 1000);
  if (hits.length >= max) {
    memory.set(id, hits);
    return false;
  }
  hits.push(now);
  memory.set(id, hits);
  return true;
}

/**
 * Records a hit and returns false when the limit is exceeded. Uses the
 * `hit_rate_limit` SQL function (see supabase/migrations) so limits hold across
 * all serverless instances.
 */
export async function allow(db: SupabaseClient | null, limits: Limit[]): Promise<{ ok: boolean; retryAfter?: number }> {
  for (const l of limits) {
    let ok: boolean;
    if (db) {
      const { data, error } = await db.rpc("hit_rate_limit", {
        p_bucket: l.bucket,
        p_key: l.key,
        p_window_seconds: l.windowSeconds,
        p_max: l.max,
      });
      ok = error ? memoryHit(l) : data === true;
      if (error) console.error("rate-limit rpc failed, using memory fallback:", error.message);
    } else {
      ok = memoryHit(l);
    }
    if (!ok) return { ok: false, retryAfter: l.windowSeconds };
  }
  return { ok: true };
}

export const __resetMemoryLimits = () => memory.clear();
