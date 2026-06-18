import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ephemeral in-memory store of one-time connection codes.
// Each code: { code, createdAt, used, expiresAt }
type Session = {
  code: string;
  createdAt: number;
  used: boolean;
  expiresAt: number;
};
const sessions = new Map<string, Session>();
const TTL = 5 * 60 * 1000; // 5 min

// Clean up expired sessions periodically
function gc() {
  const now = Date.now();
  for (const [k, v] of sessions) {
    if (v.expiresAt < now) sessions.delete(k);
  }
}

function shortCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function POST(req: NextRequest) {
  gc();
  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  if (action === "create") {
    // Mint a fresh one-time code
    let code = shortCode();
    // Avoid rare collisions
    while (sessions.has(code)) code = shortCode();
    const now = Date.now();
    sessions.set(code, {
      code,
      createdAt: now,
      used: false,
      expiresAt: now + TTL,
    });
    return NextResponse.json({
      code,
      expires_in: TTL,
      protocol: "WebRTC + DTLS-SRTP",
      note: "Server acts as signaling only. No media or file payloads transit this endpoint.",
    });
  }

  if (action === "verify") {
    const code = String(body?.code ?? "").trim().toUpperCase();
    const session = sessions.get(code);
    if (!session) {
      return NextResponse.json(
        { valid: false, error: "Unknown or expired code" },
        { status: 404 }
      );
    }
    if (session.used) {
      return NextResponse.json(
        { valid: false, error: "Code already consumed" },
        { status: 410 }
      );
    }
    if (session.expiresAt < Date.now()) {
      sessions.delete(code);
      return NextResponse.json(
        { valid: false, error: "Code expired" },
        { status: 410 }
      );
    }
    session.used = true;
    return NextResponse.json({
      valid: true,
      code,
      message: "Peer authorized. Proceed with WebRTC offer/answer exchange.",
    });
  }

  return NextResponse.json(
    { error: "Unknown action. Use 'create' or 'verify'." },
    { status: 400 }
  );
}

export async function GET() {
  return NextResponse.json({
    name: "fynut P2P signaling (one-time code)",
    description:
      "Issues ephemeral one-time codes for WebRTC peer discovery. No media transit.",
    activeSessions: sessions.size,
    methods: ["POST"],
  });
}
