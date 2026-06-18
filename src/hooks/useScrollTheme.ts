import { onMount } from "solid-js";

const TIME_CLASSES = [
  "time-morning",
  "time-noon",
  "time-dusk",
  "time-night",
] as const;
type TimeKey = (typeof TIME_CLASSES)[number];

/**
 * Scroll-driven theme + reveal + smooth-scroll + time-dot override.
 * Mirrors the original fynut behaviour exactly.
 */
export function useScrollTheme() {
  onMount(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function setTimeClass(cls: TimeKey) {
      document.body.classList.remove(...TIME_CLASSES);
      document.body.classList.add(cls);
      const dots = document.querySelectorAll<HTMLDivElement>(".time-dot");
      const idx = TIME_CLASSES.indexOf(cls);
      dots.forEach((dot, i) => dot.classList.toggle("active", i === idx));
    }

    function updateOnScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      let cls: TimeKey = "time-morning";
      if (progress < 0.25) cls = "time-morning";
      else if (progress < 0.5) cls = "time-noon";
      else if (progress < 0.75) cls = "time-dusk";
      else cls = "time-night";
      setTimeClass(cls);

      const nav = document.getElementById("mainNav");
      if (nav) {
        nav.classList.toggle("scrolled", window.scrollY > 100);
      }
    }

    // Reveal on intersect
    let observer: IntersectionObserver | null = null;
    function setupReveal() {
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
      );
      document
        .querySelectorAll(".reveal")
        .forEach((el) => observer?.observe(el));
    }

    // Smooth anchor scrolling
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    // Time-dot click override
    function onDotClick(e: MouseEvent) {
      const dot = (e.target as HTMLElement).closest<HTMLDivElement>(
        ".time-dot"
      );
      if (!dot) return;
      const time = dot.dataset.time as TimeKey | undefined;
      if (!time) return;
      setTimeClass(`time-${time}` as TimeKey);
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateOnScroll();
    setupReveal();
    document.addEventListener("click", onClick);
    document.addEventListener("click", onDotClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", onDotClick);
    };
  });
}
