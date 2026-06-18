/**
 * Client-side AES-256-GCM crypto utilities using the Web Crypto API.
 * True to fynut's local-first philosophy: all operations happen in the
 * browser, the key never leaves the user's device.
 */

const PBKDF2_ITERATIONS = 150_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BITS = 256;

function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, Math.min(i + chunk, bytes.length))
    );
  }
  return btoa(binary);
}

function base64ToBuf(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations = PBKDF2_ITERATIONS
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: KEY_BITS },
    false,
    ["encrypt", "decrypt"]
  );
}

export type EncryptResult = {
  /** base64 string containing salt(16) || iv(12) || ciphertext */
  payload: string;
  iterations: number;
  algorithm: string;
};

export async function encryptText(
  plaintext: string,
  password: string,
  iterations = PBKDF2_ITERATIONS
): Promise<EncryptResult> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(password, salt, iterations);

  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );

  const combined = new Uint8Array(
    salt.length + iv.length + cipherBuf.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(cipherBuf), salt.length + iv.length);

  return {
    payload: bufToBase64(combined),
    iterations,
    algorithm: "AES-256-GCM + PBKDF2(SHA-256)",
  };
}

export async function decryptText(
  payloadB64: string,
  password: string,
  iterations = PBKDF2_ITERATIONS
): Promise<string> {
  const combined = base64ToBuf(payloadB64);
  if (combined.length < SALT_BYTES + IV_BYTES) {
    throw new Error("Ciphertext too short / malformed payload.");
  }
  const salt = combined.slice(0, SALT_BYTES);
  const iv = combined.slice(SALT_BYTES, SALT_BYTES + IV_BYTES);
  const cipher = combined.slice(SALT_BYTES + IV_BYTES);

  const key = await deriveKey(password, salt, iterations);
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher
  );
  return new TextDecoder().decode(plainBuf);
}

/** Generate a human-readable one-time connection code, e.g. "FYN-7QK2-9PXR" */
export function generateConnectionCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += alphabet[bytes[i] % alphabet.length];
    if (i === 2 || i === 6) code += "-";
  }
  return code;
}

/** Roughly estimate the PBKDF2 + AES-GCM encrypt time in ms for a small payload. */
export async function benchmarkEncrypt(): Promise<number> {
  const start = performance.now();
  await encryptText("fynut-benchmark", "fynut-benchmark-pw", 50_000);
  return Math.round(performance.now() - start);
}
