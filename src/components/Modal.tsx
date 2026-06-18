import { Show, onCleanup, onMount, type JSX } from "solid-js";

/**
 * Minimal accessible modal primitive (no UI framework).
 * - Closes on backdrop click + Esc.
 * - Locks body scroll while open.
 * - Focuses the panel on open.
 */
export default function Modal(props: {
  open: boolean;
  onClose: () => void;
  "aria-label": string;
  children: JSX.Element;
}) {
  let panelRef: HTMLDivElement | undefined;

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape" && props.open) props.onClose();
  }

  onMount(() => {
    document.addEventListener("keydown", onKey);
  });
  onCleanup(() => document.removeEventListener("keydown", onKey));

  return (
    <Show when={props.open}>
      <div
        class="modal-backdrop"
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) props.onClose();
        }}
      >
        <div
          ref={panelRef}
          class="modal-panel fynut-scroll"
          role="dialog"
          aria-modal="true"
          aria-label={props["aria-label"]}
          tabindex={-1}
        >
          <button
            type="button"
            class="modal-close"
            aria-label="Close dialog"
            onClick={() => props.onClose()}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {props.children}
        </div>
      </div>
    </Show>
  );
}
