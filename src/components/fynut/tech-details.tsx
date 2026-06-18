"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS = [
  {
    value: "encryption",
    eyebrow: "ENCRYPTION",
    title: "AES-256-GCM 加密标准",
    body: "采用 AES-256-GCM 认证加密算法，提供保密性与完整性双重保障。支持 PBKDF2 密钥派生函数，可自定义迭代次数增强安全性。所有加密操作在浏览器 Web Crypto API 中完成，性能优异。",
  },
  {
    value: "p2p",
    eyebrow: "P2P",
    title: "WebRTC 点对点传输",
    body: "基于 WebRTC 技术实现真正的点对点连接，数据直接在设备间传输。支持 SCTP 数据通道与 RTP 媒体通道，可传输文件、语音、视频。端到端加密，DTLS-SRTP 安全保障，无需信任任何中间服务器。",
  },
  {
    value: "ai",
    eyebrow: "AI RUNTIME",
    title: "WebAssembly 本地推理",
    body: "Claw AI Agent 基于 WebAssembly 运行时，AI 模型在浏览器本地加载与推理。支持对话生成、代码生成、页面构建、Canvas 绘图等多种能力。用户对话数据永不上传，真正实现本地优先的 AI 体验。",
  },
  {
    value: "architecture",
    eyebrow: "ARCHITECTURE",
    title: "零知识架构设计",
    body: "所有敏感操作在客户端完成，服务器仅作为可选的信令与发现服务。用户密钥由用户自己生成和保管，我们永远无法访问明文数据。支持完全离线使用，真正实现“不需要信任任何人”的安全模型。",
  },
];

export default function TechDetails() {
  const [value, setValue] = useState<string>("");

  return (
    <section className="scene-section" id="details">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-16 reveal">
          <p
            className="font-display-thin text-xs tracking-widest mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            TECHNICAL DETAILS
          </p>
          <h2
            className="font-display-thin text-2xl md:text-4xl"
            style={{ color: "var(--text-primary)", letterSpacing: "0.1em" }}
          >
            隐藏的精密
          </h2>
          <p
            className="font-body-elegant text-lg mt-6"
            style={{ color: "var(--text-muted)" }}
          >
            点击展开，了解支撑安全的技术细节
          </p>
        </div>

        <div className="reveal">
          <Accordion
            type="single"
            collapsible
            value={value}
            onValueChange={setValue}
            className="w-full"
          >
            {ITEMS.map((it) => (
              <AccordionItem
                key={it.value}
                value={it.value}
                className="border-b border-[var(--text-primary)]/10"
              >
                <AccordionTrigger className="hover:no-underline py-8 hover:px-4 transition-all">
                  <div className="text-left">
                    <p
                      className="font-display-thin text-xs tracking-widest mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {it.eyebrow}
                    </p>
                    <p
                      className="font-body-elegant text-xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {it.title}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8">
                  <p
                    className="font-body-elegant text-lg leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {it.body}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
