const STATS = [
  { value: "256", label: "AES加密位数，军用级标准" },
  { value: "0", label: "服务器存储的明文数据" },
  { value: "100%", label: "本地计算，离线可用" },
];

export default function Philosophy() {
  return (
    <section class="scene-section" id="philosophy">
      <div class="max-w-4xl mx-auto">
        <div class="reveal">
          <p
            class="font-display-thin text-xs tracking-widest mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            OUR PHILOSOPHY
          </p>
          <h2
            class="font-display-thin text-3xl md:text-5xl leading-tight mb-12"
            style={{ color: "var(--text-primary)", "letter-spacing": "0.08em" }}
          >
            本地优先
            <br />
            隐私至上
          </h2>
          <p
            class="font-body-elegant text-xl md:text-2xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            我们相信，真正的隐私保护不需要信任任何人——包括我们。
            所有加密计算在你的浏览器本地完成，密钥由你完全掌控，
            数据永不离开你的设备。这不是承诺，是架构决定的安全。
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-12 mt-20">
          {STATS.map((s, i) => (
            <div
              class="reveal relative"
              style={{ "transition-delay": `${0.2 + i * 0.2}s` }}
            >
              {i === 0 && (
                <div class="glow-accent -top-20 -left-20 opacity-50" />
              )}
              <p
                class="font-display-thin text-5xl mb-4 relative"
                style={{ color: "var(--text-primary)" }}
              >
                {s.value}
              </p>
              <p
                class="font-body-elegant text-lg"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
