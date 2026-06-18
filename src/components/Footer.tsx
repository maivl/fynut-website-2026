export default function Footer() {
  return (
    <footer class="py-24 px-8 mt-auto">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-4 gap-16 mb-20">
          <div class="md:col-span-2">
            <p
              class="font-display-thin text-2xl tracking-widest mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              FYNUT
            </p>
            <p
              class="font-body-elegant text-lg max-w-md"
              style={{ color: "var(--text-muted)" }}
            >
              本地优先，隐私至上。在看不见的地方，
              我们用技术守护你的每一个比特。
            </p>
          </div>
          <div>
            <p
              class="font-display-thin text-xs tracking-widest mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              PRODUCTS
            </p>
            <div class="space-y-4">
              <a
                href="#products"
                class="block font-body-elegant text-lg hover:opacity-60 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                加密工具
              </a>
              <a
                href="#products"
                class="block font-body-elegant text-lg hover:opacity-60 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                P2P传输
              </a>
              <a
                href="#products"
                class="block font-body-elegant text-lg hover:opacity-60 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                AI Agent
              </a>
            </div>
          </div>
          <div>
            <p
              class="font-display-thin text-xs tracking-widest mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              CONNECT
            </p>
            <div class="space-y-4">
              <a
                href="https://www.fynut.com"
                target="_blank"
                rel="noreferrer"
                class="block font-body-elegant text-lg hover:opacity-60 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                fynut.com
              </a>
              <a
                href="#"
                class="block font-body-elegant text-lg hover:opacity-60 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                GitHub
              </a>
              <a
                href="#"
                class="block font-body-elegant text-lg hover:opacity-60 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                文档
              </a>
            </div>
          </div>
        </div>

        <div
          class="border-t pt-12 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ "border-color": "rgba(58, 58, 58, 0.1)" }}
        >
          <p
            class="font-display-thin text-xs tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            © 2025 fynut. ALL RIGHTS RESERVED.
          </p>
          <p
            class="font-display-thin text-xs tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            LOCAL-FIRST · ZERO-TRUST
          </p>
        </div>
      </div>
    </footer>
  );
}
