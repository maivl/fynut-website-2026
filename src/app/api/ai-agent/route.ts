import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `你是 fynut 的 Claw AI Agent 助手。fynut 是一个"本地优先，隐私至上"的产品，核心能力包括：
1. AES-256-GCM 文件与文本加密（在浏览器 Web Crypto API 中完成）
2. 基于 WebRTC 的 P2P 直连传输（一次性连接码，端到端加密）
3. 基于 WebAssembly 的本地 AI 推理代理

你的回答风格要求：
- 简洁、专业、技术准确
- 中文优先，关键术语保留英文
- 涉及代码时使用代码块
- 单次回复不超过 250 字
- 如果用户的问题与隐私、加密、P2P、本地优先、WebAssembly 等无关，礼貌地把话题引回 fynut 的产品范围`;

// In-memory conversation cache keyed by an opaque session id (best-effort)
const sessionCache = new Map<string, ChatMessage[]>();
const CACHE_TTL = 10 * 60 * 1000; // 10 min

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
          .filter(
            (m: unknown) =>
              m &&
              typeof m === "object" &&
              (m as ChatMessage).role &&
              typeof (m as ChatMessage).content === "string"
          )
          .slice(-8)
          .map((m: ChatMessage) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: (m.content ?? "").slice(0, 4000),
          }))
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "messages[] is required" },
        { status: 400 }
      );
    }

    const sessionId = (body.session_id as string) || genId();
    const cachedEntry = sessionCache.get(sessionId);
    type Cached = ChatMessage[] & { ts?: number };
    const history: Cached = cachedEntry
      ? (cachedEntry as Cached)
      : ([] as unknown as Cached);
    const fresh =
      !history.ts || Date.now() - history.ts < CACHE_TTL;
    const usableHistory = fresh ? history : ([] as unknown as Cached);

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...usableHistory.map((m) => ({ role: m.role, content: m.content })),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.6,
      max_tokens: 600,
      thinking: { type: "disabled" },
    });

    const reply: string =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "（Claw AI Agent 暂未返回内容，请稍后再试。）";

    // Update session cache with the new turn
    const updated: Cached = [
      ...usableHistory,
      ...messages,
      { role: "assistant", content: reply },
    ].slice(-16) as Cached;
    (updated as unknown as { ts: number }).ts = Date.now();
    sessionCache.set(sessionId, updated);

    return NextResponse.json({
      reply,
      session_id: sessionId,
      usage: completion?.usage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI agent error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "fynut Claw AI Agent",
    description:
      "Local-first AI assistant. Demo endpoint backed by z-ai-web-dev-sdk LLM.",
    methods: ["POST"],
  });
}
