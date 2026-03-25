import type { StoreAdapter } from "./adapter";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

/**
 * Convex-backed adapter for credential and token storage.
 * Uses the keyValueStore table in Convex via HTTP client.
 */
export class ConvexAdapter implements StoreAdapter {
  private client: ConvexHttpClient;

  constructor(url: string) {
    this.client = new ConvexHttpClient(url);
  }

  async get(namespace: string, key: string): Promise<string | null> {
    return this.client.query(api.functions.kvGet, { namespace, key });
  }

  async set(namespace: string, key: string, value: string): Promise<void> {
    await this.client.mutation(api.functions.kvSet, { namespace, key, value });
  }
}
