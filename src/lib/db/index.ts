import type { StoreAdapter } from "./adapter";
import { MemoryAdapter } from "./memory-adapter";

let _adapter: StoreAdapter | null = null;

/**
 * Returns the active store adapter.
 *
 * Selection order:
 *   1. VercelKVAdapter  — when KV_REST_API_URL is present
 *   2. ConvexAdapter    — when NEXT_PUBLIC_CONVEX_URL is present (default for this project)
 *   3. FileAdapter      — local dev without any cloud credentials
 *   4. MemoryAdapter    — last resort fallback
 *
 * The adapter is instantiated once per process and cached.
 */
export async function getAdapter(): Promise<StoreAdapter> {
  if (_adapter) return _adapter;

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { VercelKVAdapter } = await import("./vercel-kv-adapter");
    _adapter = new VercelKVAdapter();
  } else if (process.env.NEXT_PUBLIC_CONVEX_URL) {
    const { ConvexAdapter } = await import("./convex-adapter");
    _adapter = new ConvexAdapter(process.env.NEXT_PUBLIC_CONVEX_URL);
  } else if (process.env.NODE_ENV === "development") {
    const { FileAdapter } = await import("./file-adapter");
    _adapter = new FileAdapter();
    console.info("[FileAdapter] Using file-based KV store (.kv/). Set NEXT_PUBLIC_CONVEX_URL for durable storage.");
  } else {
    _adapter = new MemoryAdapter();
  }

  return _adapter;
}
