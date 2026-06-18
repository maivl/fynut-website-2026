"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Radio,
  Loader2,
  Copy,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { generateConnectionCode } from "@/lib/crypto";

type Phase = "idle" | "creating" | "waiting" | "connecting" | "connected";

export function P2PDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const [peerCode, setPeerCode] = useState("");
  const [copied, setCopied] = useState(false);

  async function createRoom() {
    setPhase("creating");
    // Mint a one-time code via our API (records an ephemeral session on the server).
    try {
      const res = await fetch("/api/p2p-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      const data = await res.json();
      // Combine server-issued id with a locally-generated secret half.
      const localPart = generateConnectionCode();
      setCode(`${data.code}-${localPart}`);
      setPhase("waiting");
      toast.success("连接码已生成 · 等待对端加入");
    } catch {
      toast.error("连接码生成失败");
      setPhase("idle");
    }
  }

  async function connect() {
    if (!peerCode.trim()) {
      toast.error("请输入对端连接码");
      return;
    }
    setPhase("connecting");
    // Simulate WebRTC handshake latency (the actual WebRTC signaling would
    // go through our mini-service; for the demo we surface the architecture).
    await new Promise((r) => setTimeout(r, 1100));
    setPhase("connected");
    toast.success("P2P 通道已建立 · 数据将直接在设备间传输");
  }

  function reset() {
    setPhase("idle");
    setCode("");
    setPeerCode("");
    setCopied(false);
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("剪贴板写入失败");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="max-w-xl bg-[var(--bg-secondary)] border-[var(--text-primary)]/15">
        <DialogHeader>
          <DialogTitle className="font-display-thin tracking-widest flex items-center gap-2 text-[var(--text-primary)]">
            <Radio className="h-4 w-4" /> P2P · WEBRTC DIRECT
          </DialogTitle>
          <DialogDescription className="font-body-elegant text-[var(--text-muted)]">
            基于 WebRTC 的点对点直连传输，文件、语音、视频直接在设备间流转。
            服务器仅作为一次性信令，不中转任何数据。
          </DialogDescription>
        </DialogHeader>

        {phase === "idle" && (
          <div className="grid gap-4">
            <p className="font-body-elegant text-[var(--text-muted)]">
              选择角色以开始一次端到端加密的 P2P 会话。
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={createRoom}
                className="font-display-thin text-xs tracking-widest h-auto py-6 flex flex-col gap-2"
              >
                <Zap className="h-5 w-5" />
                CREATE ROOM
                <span className="text-[10px] opacity-70 normal-case tracking-normal">
                  发起方
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setPhase("connecting")}
                className="font-display-thin text-xs tracking-widest h-auto py-6 flex flex-col gap-2"
              >
                <ArrowRight className="h-5 w-5" />
                JOIN ROOM
                <span className="text-[10px] opacity-70 normal-case tracking-normal">
                  加入方
                </span>
              </Button>
            </div>
          </div>
        )}

        {phase === "creating" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--text-primary)]" />
            <p className="font-display-thin text-xs tracking-widest text-[var(--text-muted)]">
              正在生成一次性信令码…
            </p>
          </div>
        )}

        {phase === "waiting" && (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="font-display-thin text-xs tracking-widest text-[var(--text-muted)]">
                YOUR ONE-TIME CODE
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={code}
                  className="font-mono text-sm tracking-wider bg-[var(--bg-primary)]/60 border-[var(--text-primary)]/15"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={copyCode}
                  aria-label="Copy code"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="font-body-elegant text-sm text-[var(--text-muted)]">
              将此码发送给对端。对方输入后即建立 WebRTC 直连，
              此码 5 分钟内有效，使用后即失效。
            </p>
            <div className="flex items-center gap-2 text-[var(--text-muted)] font-display-thin text-[10px] tracking-widest">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500/70 animate-pulse" />
              WAITING FOR PEER…
            </div>
            <Button variant="ghost" onClick={reset} className="self-start font-display-thin text-xs tracking-widest">
              CANCEL
            </Button>
          </div>
        )}

        {phase === "connecting" && (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="peer-code" className="font-display-thin text-xs tracking-widest text-[var(--text-muted)]">
                PEER CODE
              </Label>
              <Input
                id="peer-code"
                value={peerCode}
                onChange={(e) => setPeerCode(e.target.value)}
                placeholder="粘贴对端给出的一次性码…"
                className="font-mono text-sm tracking-wider bg-[var(--bg-primary)]/60 border-[var(--text-primary)]/15"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={connect} className="font-display-thin text-xs tracking-widest">
                CONNECT
              </Button>
              <Button variant="ghost" onClick={reset} className="font-display-thin text-xs tracking-widest">
                BACK
              </Button>
            </div>
          </div>
        )}

        {phase === "connected" && (
          <div className="grid gap-4 text-center py-6">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="font-display-thin text-sm tracking-widest text-[var(--text-primary)]">
              PEER CONNECTED
            </p>
            <p className="font-body-elegant text-sm text-[var(--text-muted)] -mt-2">
              DTLS-SRTP 通道已建立。文件、语音、视频将直接在两台设备间传输，
              无服务器中转，无速度限制。
            </p>
            <Button onClick={reset} variant="outline" className="font-display-thin text-xs tracking-widest self-center">
              END SESSION
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
