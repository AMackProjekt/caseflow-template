import { kv } from "@vercel/kv";
import type { StoreAdapter } from "./adapter";

/**
 * Durable adapter backed by Vercel KV (Upstash Redis).
 * Requires KV_REST_API_URL and KV_REST_API_TOKEN env vars (set automatically
 * when a KV database is linked in the Vercel dashboard).
 *
 * Data layout: each namespace is a Redis Hash at key "store:{namespace}".
 * e.g. get("user@example.com", "notes") → HGET store:user@example.com notes
 */
export class VercelKVAdapter implements StoreAdapter {
  async get(namespace: string, key: string): Promise<string | null> {
    const result = await kv.hget<string>(`store:${namespace}`, key);
    return result ?? null;
  }

  async set(namespace: string, key: string, value: string): Promise<void> {
    await kv.hset(`store:${namespace}`, { [key]: value });
  }
}
