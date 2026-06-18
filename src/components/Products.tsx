import { createSignal, For, type JSX } from "solid-js";
import PromoDialog, { type PromoContent } from "./PromoDialog";

type ProductKey = "encryption" | "p2p" | "ai";

const ENCRYPTION_ICON: JSX.Element = (
  <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
    <rect
      x="50"
      y="60"
      width="100"
      height="80"
      rx="4"
      stroke="currentColor"
      stroke-width="1"
    />
    <path d="M70 100h60" stroke="currentColor" stroke-width="1" />
    <circle
      cx="100"
      cy="100"
      r="15"
      stroke="currentColor"
      stroke-width="1"
    />
    <path
      d="M100 85v30M85 100h30"
      stroke="currentColor"
      stroke-width="0.5"
    />
  </svg>
);

const P2P_ICON: JSX.Element = (
  <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
    <rect
      x="20"
      y="60"
      width="50"
      height="70"
      rx="4"
      stroke="currentColor"
      stroke-width="1"
    />
    <rect
      x="110"
      y="50"
      width="50"
      height="80"
      rx="4"
      stroke="currentColor"
      stroke-width="1"
    />
    <path
      d="M70 95h40"
      stroke="currentColor"
      stroke-width="1"
      stroke-dasharray="4 2"
    />
    <circle cx="90" cy="95" r="4" fill="currentColor" />
  </svg>
);

const AI_ICON: JSX.Element = (
  <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
    <polygon
      points="100,40 60,70 60,130 100,160 140,130 140,70"
      stroke="currentColor"
      stroke-width="1"
      fill="none"
    />
    <circle cx="100" cy="100" r="25" stroke="currentColor" stroke-width="1" />
    <path
      d="M85 100h30M100 85v30"
      stroke="currentColor"
      stroke-width="0.5"
    />
  </svg>
);

const PROMOS: Record<ProductKey, PromoContent> = {
  encryption: {
    key: "encryption",
    eyebrow: "ENCRYPTION TOOLS",
    title: "文件与文本加密",
    tagline: "ARCHITECTURE · LOCAL ONLY",
    description:
      "使用 AES-256-GCM 算法，在浏览器内完成所有加密操作。支持任意大小文件，密钥由你生成、由你保管，我们永远无法触及你的明文数据。",
    specs: [
      { label: "ALGORITHM", value: "AES-256-GCM" },
      { label: "KDF", value: "PBKDF2" },
      { label: "RUNTIME", value: "Web Crypto" },
    ],
    bullets: [
      "认证加密：保密性 + 完整性双重保障",
      "PBKDF2 密钥派生，可自定义迭代次数",
      "所有运算在 Web Crypto API 中完成，性能优异",
      "支持文本与任意大小文件，离线可用",
    ],
    visual: ENCRYPTION_ICON,
  },
  p2p: {
    key: "p2p",
    eyebrow: "P2P TRANSFER",
    title: "点对点传输",
    tagline: "ARCHITECTURE · SERVERLESS",
    description:
      "基于 WebRTC 的 P2P 直连传输，文件、语音、视频直接在设备间流转。无服务器中转，无速度限制，无大小限制。生成一次性连接码，对方输入即连。",
    specs: [
      { label: "PROTOCOL", value: "WebRTC" },
      { label: "SECURITY", value: "DTLS-SRTP" },
      { label: "SIGNALING", value: "One-time code" },
    ],
    bullets: [
      "SCTP 数据通道 + RTP 媒体通道",
      "端到端加密，无需信任任何中间服务器",
      "一次性连接码，5 分钟内有效，使用即失效",
      "文件、语音、视频，无大小与速度限制",
    ],
    visual: P2P_ICON,
  },
  ai: {
    key: "ai",
    eyebrow: "CLAW AI AGENT",
    title: "浏览器内的AI助手",
    tagline: "ARCHITECTURE · ON-DEVICE",
    description:
      "基于 WebAssembly 的 AI 代理，支持自然语言对话、动态页面构建、可视化组件编排与 Canvas 创意绘图。代码与设计，一句话搞定。",
    specs: [
      { label: "RUNTIME", value: "WebAssembly" },
      { label: "MODEL", value: "On-device" },
      { label: "UPLOAD", value: "Never" },
    ],
    bullets: [
      "对话生成、代码生成、页面构建、Canvas 绘图",
      "AI 模型在浏览器本地加载与推理",
      "用户对话数据永不上传",
      "真正实现本地优先的 AI 体验",
    ],
    visual: AI_ICON,
  },
};

const PRODUCT_ROWS = [
  {
    key: "encryption" as ProductKey,
    eyebrow: "ENCRYPTION TOOLS",
    title: "文件与文本加密",
    desc: "使用 AES-256-GCM 算法，在浏览器内完成所有加密操作。支持任意大小文件，密钥由你生成、由你保管，我们永远无法触及你的明文数据。",
    cta: "立即体验",
    imageSide: "left" as const,
    bg: "linear-gradient(135deg, #F5F3EF 0%, #E8E4DD 100%)",
    visual: ENCRYPTION_ICON,
  },
  {
    key: "p2p" as ProductKey,
    eyebrow: "P2P TRANSFER",
    title: "点对点传输",
    desc: "基于 WebRTC 的 P2P 直连传输，文件、语音、视频直接在设备间流转。无服务器中转，无速度限制，无大小限制。生成一次性连接码，对方输入即连。",
    cta: "立即体验",
    imageSide: "right" as const,
    bg: "linear-gradient(135deg, #E8E4DD 0%, #D4D0CB 100%)",
    visual: P2P_ICON,
  },
  {
    key: "ai" as ProductKey,
    eyebrow: "CLAW AI AGENT",
    title: "浏览器内的AI助手",
    desc: "基于 WebAssembly 的 AI 代理，支持自然语言对话、动态页面构建、可视化组件编排与 Canvas 创意绘图。代码与设计，一句话搞定。",
    cta: "立即体验",
    imageSide: "left" as const,
    bg: "linear-gradient(135deg, #C9BFB3 0%, #A09890 100%)",
    visual: AI_ICON,
  },
];

export default function Products() {
  const [active, setActive] = createSignal<ProductKey | null>(null);

  return (
    <section id="products">
      <For each={PRODUCT_ROWS}>
        {(p) => {
          const ImageBlock = (
            <div class="scene-image">
              <div class="scene-image-bg" style={{ background: p.bg }}>
                <div class="w-full h-full flex items-center justify-center text-[var(--text-primary)]">
                  <div style={{ opacity: 0.35, transform: "scale(1.5)" }}>
                    {p.visual}
                  </div>
                </div>
              </div>
            </div>
          );
          const ContentBlock = (
            <div class="scene-content">
              {p.imageSide === "left" && <div class="flowing-line" />}
              <div
                class={`max-w-md reveal ${p.imageSide === "left" ? "ml-auto" : "mr-auto"}`}
              >
                <p
                  class="font-display-thin text-xs tracking-widest mb-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p.eyebrow}
                </p>
                <h3
                  class="font-display-thin text-2xl md:text-3xl mb-6"
                  style={{
                    color: "var(--text-primary)",
                    "letter-spacing": "0.08em",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  class="font-body-elegant text-lg leading-relaxed mb-8"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p.desc}
                </p>
                <button
                  class="btn-ethereal"
                  onClick={() => setActive(p.key)}
                  aria-label={`${p.cta} - ${p.title}`}
                >
                  <span>{p.cta}</span>
                </button>
              </div>
              {p.imageSide === "right" && <div class="flowing-line" />}
            </div>
          );

          return (
            <div class="split-scene">
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
        }}
      </For>

      <PromoDialog
        open={active() !== null}
        onClose={() => setActive(null)}
        content={active() ? PROMOS[active()!] : null}
      />
    </section>
  );
}
