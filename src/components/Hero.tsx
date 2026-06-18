export default function Hero() {
  return (
    <section
      class="min-h-screen flex flex-col justify-center items-center relative px-8"
      id="hero"
    >
      <div class="curtain-effect" aria-hidden="true" />

      <div class="text-center relative z-10">
        <p
          class="hero-subtitle font-display-thin mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          LOCAL-FIRST · ZERO-TRUST
        </p>
        <h1
          class="hero-title font-display-thin"
          style={{ color: "var(--text-primary)" }}
        >
          FYNUT
        </h1>
        <p
          class="font-body-elegant text-xl md:text-2xl mt-12 max-w-2xl mx-auto reveal"
          style={{ color: "var(--text-muted)", "animation-delay": "1.5s" }}
        >
          当隐私成为奢侈品，我们选择让它回归本质。
          <br />
          所有计算在浏览器完成，你的数据，只有你能看见。
        </p>
      </div>

      <div class="scroll-indicator">
        <span
          class="font-display-thin text-xs tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          SCROLL
        </span>
        <div class="scroll-line" />
      </div>
    </section>
  );
}
