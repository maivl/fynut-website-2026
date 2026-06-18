---
Task ID: 1
Agent: main (Z.ai Code)
Task: 复刻 www.fynut.com 并且使用新的css、html api — replicate fynut.com with fresh CSS/HTML and modern Web APIs.

Work Log:
- Fetched & analyzed the original https://www.fynut.com homepage (1299 lines): local-first / zero-trust privacy product landing page with warm beige palette, Inter + Cormorant Garamond fonts, scroll-driven morning→noon→dusk→night theme, dust-particle canvas background, interactive encryption demo zone, 3 product split-scenes (Encryption / P2P / AI Agent), technical-details accordion, sticky footer.
- Designed a fresh implementation in Next.js 16 + Tailwind CSS 4 + shadcn/ui (NOT a copy of their inline `<style>`; rewrote all CSS as Tailwind v4 `@theme` + custom utility classes in `src/app/globals.css`).
- Wired Inter + Cormorant Garamond via `next/font/google` in `src/app/layout.tsx`; added Sonner toaster for in-app notifications.
- Built the page as a composition of focused components under `src/components/fynut/`:
  - `dust-canvas.tsx` — Canvas API particle field that reacts to mouse + theme.
  - `nav-bar.tsx`, `time-indicator.tsx` — sticky nav + right-side time-of-day dots.
  - `hero.tsx`, `philosophy.tsx`, `experience.tsx`, `products.tsx`, `tech-details.tsx`, `footer.tsx`.
  - `encryption-dialog.tsx` — REAL AES-256-GCM + PBKDF2 via Web Crypto API (`src/lib/crypto.ts`), all client-side. Encrypt → base64 payload → copy → decrypt roundtrip verified.
  - `p2p-dialog.tsx` — one-time connection-code flow; mints server code via API + appends a locally-generated Web Crypto random segment.
  - `ai-agent-dialog.tsx` — chat UI calling `/api/ai-agent` with suggestion chips.
- `src/hooks/use-scroll-theme.ts` — single hook that drives: (a) body class swaps between `time-morning/noon/dusk/night` based on scroll progress, (b) nav `.scrolled` after 100px, (c) `.reveal` IntersectionObserver fade-ins, (d) smooth anchor scrolling, (e) manual time-dot override clicks.
- Built two Next.js API routes (the "API" part of the request):
  - `src/app/api/ai-agent/route.ts` — POST endpoint backed by `z-ai-web-dev-sdk` LLM (chat.completions.create) with a fynut-specific system prompt; in-memory session cache (10 min TTL).
  - `src/app/api/p2p-code/route.ts` — POST `action: create | verify` for ephemeral one-time WebRTC signaling codes (5-min TTL, single-use, in-memory store).
- Lint: `bun run lint` → clean, no errors.
- Self-verified end-to-end with Agent Browser:
  - Page renders all 6 sections; FYNUT hero, philosophy stats (256/0/100%), 3 products, accordion, footer all present.
  - Encryption dialog: encrypted "Hello fynut — 本地优先，隐私至上" → got base64 ciphertext; switched to decrypt, pasted ciphertext → recovered exact plaintext. Toasts fired correctly.
  - AI Agent dialog: clicked "用一句话解释零知识架构" → got real on-topic LLM reply about zero-knowledge architecture.
  - P2P dialog: CREATE ROOM → one-time code "SB7PPC-PMT-4TEF-QFB8P" issued (server "SB7PPC" + local crypto part); toast "连接码已生成" shown.
  - Accordion: clicked "AES-256-GCM 加密标准" → expanded with full body content visible.
  - Scroll theme: scrolled to bottom → body class became `time-night`; scrolled to top → `time-morning`. Verified visually with VLM (dark charcoal night theme + cream morning hero both confirmed elegant/minimal).
  - Mobile (390×844): layout adapts, nav links hidden, text readable — VLM-confirmed.
  - Browser console: only React DevTools + HMR logs, no errors/warnings/hydration mismatches.
  - Dev log: no errors. Both API endpoints respond correctly (GET /api/ai-agent metadata; POST /api/p2p-code → {"code":"UC7Q6H",...}).

Stage Summary:
- Delivered a faithful, fresh-CSS replica of fynut.com as a single-route (`/`) Next.js 16 app.
- "新的 CSS": rewrote all styles in Tailwind v4 (`@theme` + custom utility classes), no inline `<style>` copy.
- "新的 HTML": semantic React/JSX components (`<main>`, `<nav>`, `<section>`, `<footer>`, ARIA labels).
- "API": (a) modern Web APIs — Web Crypto API (AES-256-GCM + PBKDF2), Canvas API, IntersectionObserver, performance.now benchmarking, crypto.getRandomValues for connection codes; (b) two Next.js API routes — LLM-backed AI agent chat + ephemeral P2P signaling-code mint/verify.
- All core interactions browser-verified; design VLM-confirmed as elegant/minimal in both light and dark themes; responsive on mobile; sticky footer; zero runtime errors.
- Artifacts: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/components/fynut/*.tsx` (9 files), `src/lib/crypto.ts`, `src/hooks/use-scroll-theme.ts`, `src/app/api/ai-agent/route.ts`, `src/app/api/p2p-code/route.ts`, `public/favicon.svg`.
