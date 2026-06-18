"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Loader2, Sparkles, Cpu } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "用一句话解释零知识架构",
  "AES-256-GCM 为什么比 CBC 更安全？",
  "帮我写一段 WebRTC 创建数据通道的伪代码",
  "本地优先应用如何同步数据？",
];

export function AiAgentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("AI agent request failed");
      const data = await res.json();
      const reply: string = data.reply ?? "(空回复)";
      setMessages((cur) => [...cur, { role: "assistant", content: reply }]);
    } catch {
      toast.error("AI 助手暂不可用，请稍后再试");
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: "（连接失败。请注意：在生产环境中，fynut 的 Claw AI Agent 基于 WebAssembly 在浏览器本地推理，对话数据永不上传。当前演示通过服务端 LLM 提供。）",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col bg-[var(--bg-secondary)] border-[var(--text-primary)]/15">
        <DialogHeader>
          <DialogTitle className="font-display-thin tracking-widest flex items-center gap-2 text-[var(--text-primary)]">
            <Bot className="h-4 w-4" /> CLAW AI AGENT
          </DialogTitle>
          <DialogDescription className="font-body-elegant text-[var(--text-muted)]">
            支持自然语言对话、动态页面构建、可视化组件编排与 Canvas 创意绘图。
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto fynut-scroll pr-2 space-y-3 min-h-0"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
              <div className="h-14 w-14 rounded-full bg-[var(--accent-glow)] flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-[var(--text-primary)]" />
              </div>
              <p className="font-body-elegant text-[var(--text-muted)] max-w-sm">
                与 Claw AI Agent 对话。试试以下问题：
              </p>
              <div className="grid gap-2 w-full max-w-sm">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm font-body-elegant px-3 py-2 rounded border border-[var(--text-primary)]/15 hover:bg-[var(--text-primary)]/5 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-wrap rounded ${
                  m.role === "user"
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-body-elegant"
                    : "bg-[var(--bg-primary)]/60 border border-[var(--text-primary)]/10 font-body-elegant text-[var(--text-primary)]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="px-3 py-2 text-sm rounded bg-[var(--bg-primary)]/60 border border-[var(--text-primary)]/10 flex items-center gap-2 text-[var(--text-muted)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="font-display-thin text-xs tracking-widest">THINKING…</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--text-primary)]/10 pt-3 flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="说点什么…  (Enter 发送 / Shift+Enter 换行)"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="font-body-elegant text-sm bg-[var(--bg-primary)]/60 border-[var(--text-primary)]/15 resize-none min-h-[44px] max-h-32"
          />
          <Button
            onClick={() => send()}
            disabled={busy || !input.trim()}
            size="icon"
            aria-label="发送"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="font-display-thin text-[10px] tracking-widest text-[var(--text-muted)] flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          演示模式 · 生产环境 AI 推理在浏览器 WebAssembly 中本地完成
        </p>
      </DialogContent>
    </Dialog>
  );
}
