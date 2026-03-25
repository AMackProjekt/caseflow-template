import type { StoreAdapter } from "./adapter";

/**
 * In-memory fallback used when KV credentials are absent (local dev without .env.local).
 * Data is NOT durable across restarts — a warning is logged on first write.
 */
export class MemoryAdapter implements StoreAdapter {
  private warned = false;
  private store: Record<string, Record<string, string>> = {};

  async get(namespace: string, key: string): Promise<string | null> {
    return this.store[namespace]?.[key] ?? null;
  }

  async set(namespace: string, key: string, value: string): Promise<void> {
    if (!this.warned) {
      console.warn(
        "[MemoryAdapter] KV_REST_API_URL is not set — using in-memory store. " +
          "Data will be lost on restart. Set KV_REST_API_URL to enable durable storage."
      );
      this.warned = true;
    }
    if (!this.store[namespace]) this.store[namespace] = {};
    this.store[namespace][key] = value;
  }
}
