/** Minimal interface every store adapter must satisfy. */
export interface StoreAdapter {
  get(namespace: string, key: string): Promise<string | null>;
  set(namespace: string, key: string, value: string): Promise<void>;
}
