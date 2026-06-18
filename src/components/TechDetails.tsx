import { createSignal, For } from "solid-js";

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
  const [open, setOpen] = createSignal<string | null>(null);

  return (
    <section class="scene-section" id="details">
      <div class="max-w-3xl mx-auto w-full">
        <div class="text-center mb-16 reveal">
          <p
            class="font-display-thin text-xs tracking-widest mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            TECHNICAL DETAILS
          </p>
          <h2
            class="font-display-thin text-2xl md:text-4xl"
            style={{ color: "var(--text-primary)", "letter-spacing": "0.1em" }}
          >
            隐藏的精密
          </h2>
          <p
            class="font-body-elegant text-lg mt-6"
            style={{ color: "var(--text-muted)" }}
          >
            点击展开，了解支撑安全的技术细节
          </p>
        </div>

        <div class="reveal">
          <For each={ITEMS}>
            {(it) => {
              const isOpen = () => open() === it.value;
              return (
                <div
                  class="border-b"
                  style={{ "border-color": "rgba(58, 58, 58, 0.1)" }}
                >
                  <button
                    type="button"
                    class="w-full text-left py-8 flex items-center justify-between gap-4 transition-all hover:pl-4"
                    aria-expanded={isOpen()}
                    onClick={() =>
                      setOpen((prev) => (prev === it.value ? null : it.value))
                    }
                  >
                    <div>
                      <p
                        class="font-display-thin text-xs tracking-widest mb-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {it.eyebrow}
                      </p>
                      <p
                        class="font-body-elegant text-xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {it.title}
                      </p>
                    </div>
                    <span
                      class="relative shrink-0"
                      style={{
                        width: "20px",
                        height: "20px",
                        transition: "transform 0.4s ease",
                        transform: isOpen() ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                      aria-hidden="true"
                    >
                      <span
                        class="absolute"
                        style={{
                          top: "50%",
                          left: "0",
                          width: "100%",
                          height: "1px",
                          background: "var(--text-primary)",
                        }}
                      />
                      <span
                        class="absolute"
                        style={{
                          left: "50%",
                          top: "0",
                          width: "1px",
                          height: "100%",
                          background: "var(--text-primary)",
                        }}
                      />
                    </span>
                  </button>
                  <div
                    class="overflow-hidden transition-all duration-500"
                    style={{
                      "max-height": isOpen() ? "400px" : "0px",
                      "padding-bottom": isOpen() ? "2rem" : "0",
                    }}
                  >
                    <p
                      class="font-body-elegant text-lg leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {it.body}
                    </p>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
