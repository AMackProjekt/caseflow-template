import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "crypto";

// HKDF-SHA-256 produces a well-distributed 256-bit key from any length input.
// Changing DATA_ENCRYPTION_KEY rotates to a new key (existing ciphertext
// becomes unreadable, so rotate deliberately and re-encrypt stored records).
function getKey(): Buffer {
  const ikm = process.env.DATA_ENCRYPTION_KEY ?? process.env.AUTH_SECRET ?? "dev-only-UNSAFE-change-me";
  if (process.env.NODE_ENV === "production" && ikm === "dev-only-UNSAFE-change-me") {
    throw new Error("[crypto] DATA_ENCRYPTION_KEY or AUTH_SECRET must be set in production");
  }
  return Buffer.from(
    hkdfSync("sha256", Buffer.from(ikm, "utf8"), "", "caseflow-phi-aes256gcm-v1", 32)
  );
}

export function encryptJson(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encoded = Buffer.from(JSON.stringify(value), "utf8");
  const encrypted = Buffer.concat([cipher.update(encoded), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptJson<T>(payload: string): T {
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);

  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8")) as T;
}
