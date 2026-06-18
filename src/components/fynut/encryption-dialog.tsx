"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Lock,
  Unlock,
  ShieldCheck,
  Loader2,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { encryptText, decryptText, benchmarkEncrypt } from "@/lib/crypto";

type Mode = "encrypt" | "decrypt";

export function EncryptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [meta, setMeta] = useState<{ alg: string; ms: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleRun() {
    if (!text || !password) {
      toast.error("请输入文本与密钥");
      return;
    }
    setBusy(true);
    setOutput("");
    setMeta(null);
    try {
      const t0 = performance.now();
      if (mode === "encrypt") {
        const r = await encryptText(text, password);
        setOutput(r.payload);
        setMeta({ alg: r.algorithm, ms: Math.round(performance.now() - t0) });
        toast.success("加密完成 · 数据从未离开浏览器");
      } else {
        const plain = await decryptText(text, password);
        setOutput(plain);
        setMeta({ alg: "AES-256-GCM + PBKDF2(SHA-256)", ms: Math.round(performance.now() - t0) });
        toast.success("解密完成");
      }
    } catch (e) {
      toast.error(mode === "decrypt" ? "解密失败：密钥错误或数据已损坏" : "加密失败");
    } finally {
      setBusy(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("剪贴板写入失败");
    }
  }

  async function onBenchmark() {
    setBusy(true);
    try {
      const ms = await benchmarkEncrypt();
      toast.success(`本地 PBKDF2+AES-256 加密 ≈ ${ms}ms`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[var(--bg-secondary)] border-[var(--text-primary)]/15">
        <DialogHeader>
          <DialogTitle className="font-display-thin tracking-widest flex items-center gap-2 text-[var(--text-primary)]">
            <Lock className="h-4 w-4" /> ENCRYPTION · AES-256-GCM
          </DialogTitle>
          <DialogDescription className="font-body-elegant text-[var(--text-muted)]">
            所有加密计算在你的浏览器内完成，密钥由你完全掌控，数据永不离开你的设备。
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={mode === "encrypt" ? "default" : "outline"}
            className="font-display-thin text-xs tracking-widest"
            onClick={() => {
              setMode("encrypt");
              setOutput("");
              setMeta(null);
            }}
          >
            <Lock className="h-3.5 w-3.5 mr-1" /> ENCRYPT
          </Button>
          <Button
            type="button"
            variant={mode === "decrypt" ? "default" : "outline"}
            className="font-display-thin text-xs tracking-widest"
            onClick={() => {
              setMode("decrypt");
              setOutput("");
              setMeta(null);
            }}
          >
            <Unlock className="h-3.5 w-3.5 mr-1" /> DECRYPT
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="font-display-thin text-xs tracking-widest ml-auto"
            onClick={onBenchmark}
            disabled={busy}
          >
            <Cpu className="h-3.5 w-3.5 mr-1" /> BENCHMARK
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="enc-text" className="font-display-thin text-xs tracking-widest text-[var(--text-muted)]">
              {mode === "encrypt" ? "明文 (PLAINTEXT)" : "密文 (CIPHERTEXT · base64)"}
            </Label>
            <Textarea
              id="enc-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder={
                mode === "encrypt"
                  ? "输入要加密的文本…"
                  : "粘贴 base64 密文…"
              }
              className="font-mono text-sm bg-[var(--bg-primary)]/60 border-[var(--text-primary)]/15"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="enc-pw" className="font-display-thin text-xs tracking-widest text-[var(--text-muted)]">
              密钥 (PASSPHRASE)
            </Label>
            <Input
              id="enc-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密钥…"
              className="font-mono text-sm bg-[var(--bg-primary)]/60 border-[var(--text-primary)]/15"
            />
          </div>

          <Button
            type="button"
            onClick={handleRun}
            disabled={busy}
            className="font-display-thin text-xs tracking-widest self-start"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 mr-1" />}
            {mode === "encrypt" ? "ENCRYPT" : "DECRYPT"}
          </Button>

          {output && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="font-display-thin text-xs tracking-widest text-[var(--text-muted)]">
                  {mode === "encrypt" ? "密文输出" : "明文输出"}
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="font-display-thin text-xs tracking-widest h-7"
                  onClick={copyOutput}
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? "COPIED" : "COPY"}
                </Button>
              </div>
              <Textarea
                readOnly
                value={output}
                rows={4}
                className="font-mono text-xs bg-[var(--bg-primary)]/60 border-[var(--text-primary)]/15 fynut-scroll"
              />
              {meta && (
                <p className="font-display-thin text-[10px] tracking-widest text-[var(--text-muted)]">
                  ALG: {meta.alg} · TIME: {meta.ms}ms · LOCAL ONLY
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
