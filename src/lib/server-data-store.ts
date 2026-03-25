import { getAdapter } from "./db/index";

export async function getEncryptedRecord(namespace: string, key: string): Promise<string | null> {
  const adapter = await getAdapter();
  return adapter.get(namespace, key);
}

export async function setEncryptedRecord(namespace: string, key: string, value: string): Promise<void> {
  const adapter = await getAdapter();
  await adapter.set(namespace, key, value);
}
