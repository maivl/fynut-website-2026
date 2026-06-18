import { For, Show, type JSX } from "solid-js";
import Modal from "./Modal";

export type PromoSpec = { label: string; value: string };

export type PromoContent = {
  key: string;
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  specs: PromoSpec[];
  bullets: string[];
  visual: JSX.Element;
};

export default function PromoDialog(props: {
  open: boolean;
  onClose: () => void;
  content: PromoContent | null;
}) {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-label={props.content?.title ?? "Product detail"}
    >
      <Show when={props.content}>
        {(c: () => PromoContent) => (
          <div>
            <div class="flex items-start gap-4 mb-6 pr-10">
              <div
                class="shrink-0 w-16 h-16 rounded flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-glow), transparent)",
                  border: "1px solid rgba(58,58,58,0.1)",
                }}
                aria-hidden="true"
              >
                {c().visual}
              </div>
              <div>
                <p
                  class="font-display-thin text-xs tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {c().eyebrow}
                </p>
                <h2
                  class="font-display-thin text-2xl"
                  style={{
                    color: "var(--text-primary)",
                    "letter-spacing": "0.06em",
                  }}
                >
                  {c().title}
                </h2>
              </div>
            </div>

            <p
              class="font-body-elegant text-lg leading-relaxed mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              {c().description}
            </p>

            <div class="grid grid-cols-3 gap-3 mb-6">
              <For each={c().specs}>
                {(spec) => (
                  <div
                    class="p-3 rounded border"
                    style={{ "border-color": "rgba(58,58,58,0.12)" }}
                  >
                    <p
                      class="font-display-thin text-[10px] tracking-widest mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {spec.label}
                    </p>
                    <p
                      class="font-display-thin text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {spec.value}
                    </p>
                  </div>
                )}
              </For>
            </div>

            <ul class="space-y-2 mb-6">
              <For each={c().bullets}>
                {(b) => (
                  <li
                    class="flex items-start gap-2 font-body-elegant text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span
                      class="mt-2 shrink-0 w-1 h-1 rounded-full"
                      style={{ background: "var(--text-muted)" }}
                    />
                    <span>{b}</span>
                  </li>
                )}
              </For>
            </ul>

            <div
              class="p-4 rounded border"
              style={{
                "border-color": "rgba(58,58,58,0.12)",
                background: "rgba(245, 230, 211, 0.18)",
              }}
            >
              <p
                class="font-display-thin text-[10px] tracking-widest mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                {c().tagline}
              </p>
              <p
                class="font-body-elegant text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                本页为静态宣传展示。完整能力将在 fynut 客户端中以浏览器本地方式提供——
                所有密钥与数据永不离开你的设备。
              </p>
            </div>
          </div>
        )}
      </Show>
    </Modal>
  );
}
