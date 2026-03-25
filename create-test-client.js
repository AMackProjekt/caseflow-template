#!/usr/bin/env node

/**
 * Quick script to create a test client credential
 * Usage: node create-test-client.js
 */

const { createHash } = require("crypto");
const { promisify } = require("util");

// Load env vars
require("dotenv").config({ path: ".env.local" });

const email = "dthreemack@gmail.com";
const password = "DFCHANGEFirst";
const username = "dthreemack";
const name = "Test Client";

// Helper functions from auth.ts
function hashPassword(pwd) {
  const secret = process.env.AUTH_SECRET || "dev-only-change-me";
  return createHash("sha256").update(`${secret}:${pwd}`).digest("hex");
}

async function setupCredential() {
  console.log(`Creating test client credential...
Email: ${email}
Username: ${username}
Password: ${password}\n`);

  // We need to use the actual encrypted storage from Vercel KV
  // For now, show what would be stored:
  const record = {
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    passwordHash: hashPassword(password),
    name,
    approvedAt: new Date().toISOString(),
  };

  console.log("Record to store:", record);
  console.log("\nTo create this credential, you need to:");
  console.log("1. Ensure dthreemack@gmail.com is in CLIENT_ALLOWLIST");
  console.log("2. Call the signup-request approve flow, OR");
  console.log("3. Use the admin dashboard to add the credential");
  console.log("\nFor development, this script would normally call the encryption/storage layer.");
}

setupCredential().catch(console.error);
