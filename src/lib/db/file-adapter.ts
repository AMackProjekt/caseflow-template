import type { StoreAdapter } from "./adapter";
import { promises as fs } from "fs";
import path from "path";

/**
 * File-based adapter for local development.
 * Persists data to .kv/<namespace>.json in the project root.
 * NOT suitable for production.
 */
export class FileAdapter implements StoreAdapter {
  private dir: string;
  private cache: Record<string, Record<string, string>> = {};
  private loaded: Record<string, boolean> = {};

  constructor() {
    this.dir = path.join(process.cwd(), ".kv");
  }

  private filePath(namespace: string) {
    return path.join(this.dir, `${namespace}.json`);
  }

  private async load(namespace: string) {
    if (this.loaded[namespace]) return;
    try {
      await fs.mkdir(this.dir, { recursive: true });
      const raw = await fs.readFile(this.filePath(namespace), "utf8");
      this.cache[namespace] = JSON.parse(raw);
    } catch {
      this.cache[namespace] = {};
    }
    this.loaded[namespace] = true;
  }

  private async flush(namespace: string) {
    await fs.mkdir(this.dir, { recursive: true });
    await fs.writeFile(
      this.filePath(namespace),
      JSON.stringify(this.cache[namespace] ?? {}, null, 2),
      "utf8"
    );
  }

  async get(namespace: string, key: string): Promise<string | null> {
    await this.load(namespace);
    return this.cache[namespace]?.[key] ?? null;
  }

  async set(namespace: string, key: string, value: string): Promise<void> {
    await this.load(namespace);
    if (!this.cache[namespace]) this.cache[namespace] = {};
    this.cache[namespace][key] = value;
    await this.flush(namespace);
  }
}
