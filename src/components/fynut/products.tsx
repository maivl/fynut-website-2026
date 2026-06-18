"use client";

import { useState } from "react";
import { EncryptionDialog } from "./encryption-dialog";
import { P2PDialog } from "./p2p-dialog";
import { AiAgentDialog } from "./ai-agent-dialog";

type ProductKey = "encryption" | "p2p" | "ai" | null;

const PRODUCTS = [
  {
    key: "encryption" as const,
    eyebrow: "ENCRYPTION TOOLS",
    title: "文件与文本加密",
    desc: "使用 AES-256-GCM 算法，在浏览器内完成所有加密操作。支持任意大小文件，密钥由你生成、由你保管，我们永远无法触及你的明文数据。",
    cta: "立即体验",
    imageSide: "left" as const,
    bg: "linear-gradient(135deg, #F5F3EF 0%, #E8E4DD 100%)",
    icon: (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" style={{ opacity: 0.3 }}>
        <rect x="50" y="60" width="100" height="80" rx="4" stroke="#3A3A3A" strokeWidth="1" />
        <path d="M70 100h60" stroke="#3A3A3A" strokeWidth="1" />
        <circle cx="100" cy="100" r="15" stroke="#3A3A3A" strokeWidth="1" />
        <path d="M100 85v30M85 100h30" stroke="#3A3A3A" strokeWidth="0.5" />
      </svg>
    ),
  },
  {
    key: "p2p" as const,
    eyebrow: "P2P TRANSFER",
    title: "点对点传输",
    desc: "基于 WebRTC 的 P2P 直连传输，文件、语音、视频直接在设备间流转。无服务器中转，无速度限制，无大小限制。生成一次性连接码，对方输入即连。",
    cta: "立即体验",
    imageSide: "right" as const,
    bg: "linear-gradient(135deg, #E8E4DD 0%, #D4D0CB 100%)",
    icon: (
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" style={{ opacity: 0.3 }}>
        <rect x="20" y="60" width="50" height="70" rx="4" stroke="#3A3A3A" strokeWidth="1" />
        <rect x="110" y="50" width="50" height="80" rx="4" stroke="#3A3A3A" strokeWidth="1" />
        <path d="M70 95h40" stroke="#3A3A3A" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="90" cy="95" r="4" fill="#3A3A3A" />
      </svg>
    ),
  },
  {
    key: "ai" as const,
    eyebrow: "CLAW AI AGENT",
    title: "浏览器内的AI助手",
    desc: "基于 WebAssembly 的 AI 代理，支持自然语言对话、动态页面构建、可视化组件编排与 Canvas 创意绘图。代码与设计，一句话搞定。",
    cta: "立即体验",
    imageSide: "left" as const,
    bg: "linear-gradient(135deg, #C9BFB3 0%, #A09890 100%)",
    icon: (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" style={{ opacity: 0.25 }}>
        <polygon points="100,40 60,70 60,130 100,160 140,130 140,70" stroke="#FAF8F5" strokeWidth="1" fill="none" />
        <circle cx="100" cy="100" r="25" stroke="#FAF8F5" strokeWidth="1" />
        <path d="M85 100h30M100 85v30" stroke="#FAF8F5" strokeWidth="0.5" />
      </svg>
    ),
  },
];

export default function Products() {
  const [active, setActive] = useState<ProductKey>(null);

  return (
    <section id="products">
      {PRODUCTS.map((p) => {
        const ImageBlock = (
          <div className="scene-image">
            <div className="scene-image-bg" style={{ background: p.bg }}>
              <div className="w-full h-full flex items-center justify-center">
                {p.icon}
              </div>
            </div>
          </div>
        );
        const ContentBlock = (
          <div className="scene-content">
            {p.imageSide === "left" && <div className="flowing-line" />}
            <div
              className={`max-w-md reveal ${p.imageSide === "left" ? "ml-auto" : "mr-auto"}`}
            >
              <p
                className="font-display-thin text-xs tracking-widest mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                {p.eyebrow}
              </p>
              <h3
                className="font-display-thin text-2xl md:text-3xl mb-6"
                style={{ color: "var(--text-primary)", letterSpacing: "0.08em" }}
              >
                {p.title}
              </h3>
              <p
                className="font-body-elegant text-lg leading-relaxed mb-8"
                style={{ color: "var(--text-muted)" }}
              >
                {p.desc}
              </p>
              <button
                className="btn-ethereal"
                onClick={() => setActive(p.key)}
                aria-label={`${p.cta} - ${p.title}`}
              >
                <span>{p.cta}</span>
              </button>
            </div>
            {p.imageSide === "right" && <div className="flowing-line" />}
          </div>
        );

        return (
          <div className="split-scene" key={p.key}>
            {p.imageSide === "left" ? (
              <>
                {ImageBlock}
                {ContentBlock}
              </>
            ) : (
              <>
                {ContentBlock}
                {ImageBlock}
              </>
            )}
          </div>
        );
      })}

      <EncryptionDialog open={active === "encryption"} onOpenChange={(v) => !v && setActive(null)} />
      <P2PDialog open={active === "p2p"} onOpenChange={(v) => !v && setActive(null)} />
      <AiAgentDialog open={active === "ai"} onOpenChange={(v) => !v && setActive(null)} />
    </section>
  );
}
