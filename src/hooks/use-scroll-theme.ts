"use client";

import { useEffect } from "react";

/**
 * Initializes global scroll-driven behaviors for the fynut page:
 *  - Body class swaps between time-morning / time-noon / time-dusk / time-night
 *    based on scroll progress (0-25% morning, 25-50% noon, 50-75% dusk, 75-100% night).
 *  - Nav bar receives `.scrolled` class after 100px scroll.
 *  - `.reveal` elements get `.visible` when they intersect the viewport.
 *
 * Also exposes the current time-of-day on `window.__fynutTime` for other components.
 */
export function useScrollTheme() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const TIME_CLASSES = [
      "time-morning",
      "time-noon",
      "time-dusk",
      "time-night",
    ] as const;
    type TimeKey = (typeof TIME_CLASSES)[number];

    function setTimeClass(cls: TimeKey) {
      document.body.classList.remove(...TIME_CLASSES);
      document.body.classList.add(cls);
      (window as unknown as { __fynutTime?: string }).__fynutTime = cls;
      const dots = document.querySelectorAll<HTMLDivElement>(".time-dot");
      const idx = TIME_CLASSES.indexOf(cls);
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === idx);
      });
    }

    function updateOnScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      let cls: TimeKey = "time-morning";
      if (progress < 0.25) cls = "time-morning";
      else if (progress < 0.5) cls = "time-noon";
      else if (progress < 0.75) cls = "time-dusk";
      else cls = "time-night";
      setTimeClass(cls);

      const nav = document.getElementById("mainNav");
      if (nav) {
        if (window.scrollY > 100) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      }
    }

    // Reveal on intersect
    let observer: IntersectionObserver | null = null;
    function setupReveal() {
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
      );
      document.querySelectorAll(".reveal").forEach((el) => observer?.observe(el));
    }

    // Smooth anchor scrolling
    function setupSmoothScroll() {
      const handler = (e: Event) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const el = document.querySelector(href);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      };
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }

    // Time-dot click handlers (manual override)
    function setupTimeDots() {
      const dots = document.querySelectorAll<HTMLDivElement>(".time-dot");
      const handler = (e: Event) => {
        const dot = e.currentTarget as HTMLDivElement;
        const time = dot.dataset.time as TimeKey | undefined;
        if (!time) return;
        const cls = `time-${time}` as TimeKey;
        setTimeClass(cls);
      };
      dots.forEach((d) => d.addEventListener("click", handler));
      return () => {
        dots.forEach((d) => d.removeEventListener("click", handler));
      };
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

    // Initialize
    updateOnScroll();
    setupReveal();
    const cleanupSmooth = setupSmoothScroll();
    const cleanupDots = setupTimeDots();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      cleanupSmooth();
      cleanupDots();
    };
  }, []);
}
