import { NextRequest, NextResponse } from "next/server";
import { getEncryptedRecord, setEncryptedRecord } from "@/lib/server-data-store";
import { decryptJson, encryptJson } from "@/lib/crypto";
import { upsertClientCredential } from "@/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://caseflow-template.vercel.app";

type PasswordResetToken = {
  email: string;
  expiresAt: string;
  usedAt?: string;
};

const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Reset token is missing." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const raw = await getEncryptedRecord("password-reset-tokens", `token:${token}`);
    if (!raw) {
      return NextResponse.json(
        { success: false, error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const record = decryptJson<PasswordResetToken>(raw);

    if (record.usedAt) {
      return NextResponse.json(
        { success: false, error: "This reset link has already been used. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date(record.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update the password
    await upsertClientCredential({ email: record.email, password: newPassword });

    // Invalidate the token so it cannot be reused
    const usedRecord: PasswordResetToken = { ...record, usedAt: new Date().toISOString() };
    await setEncryptedRecord(
      "password-reset-tokens",
      `token:${token}`,
      encryptJson(usedRecord)
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json(
      { success: false, error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
