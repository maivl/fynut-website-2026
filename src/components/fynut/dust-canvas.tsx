"use client";

import { useEffect, useRef } from "react";

type DustParticle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
};

export default function DustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let particles: DustParticle[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let animationId: number | null = null;

    function makeParticle(w: number, h: number): DustParticle {
      const life = Math.random() * 200 + 100;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        life,
        maxLife: life,
      };
    }

    function initCanvas() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      particles = [];
      const count = prefersReducedMotion ? 20 : 80;
      for (let i = 0; i < count; i++) {
        particles.push(makeParticle(w, h));
      }
    }

    function isNight() {
      return document.body.classList.contains("time-night");
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const night = isNight();
      const color = night ? "255, 230, 200" : "180, 170, 160";

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          p.x += (dx / dist) * 0.2;
          p.y += (dy / dist) * 0.2;
        }

        if (p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          Object.assign(p, makeParticle(w, h));
        }

        const fadeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * fadeRatio;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onResize = () => initCanvas();

    initCanvas();
    if (!prefersReducedMotion) {
      animate();
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
