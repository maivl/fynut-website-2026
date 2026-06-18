"use client";

import { useEffect, useRef, useState } from "react";

const ALGOS = ["AES-256", "ChaCha20", "AES-128"];
const KEY_BITS = [128, 192, 256];
const STATUSES = ["Secure", "Encrypted", "Locked"];

export default function Experience() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const [algo, setAlgo] = useState("AES-256");
  const [keyBits, setKeyBits] = useState(256);
  const [time, setTime] = useState(12);
  const [status, setStatus] = useState("Secure");

  useEffect(() => {
    const zone = zoneRef.current;
    const orb = orbRef.current;
    const hint = hintRef.current;
    if (!zone || !orb) return;

    let interacting = false;

    const onMove = (e: MouseEvent) => {
      const rect = zone.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      orb.style.left = `${x}px`;
      orb.style.top = `${y}px`;

      const progressX = rect.width > 0 ? x / rect.width : 0;
      const progressY = rect.height > 0 ? y / rect.height : 0;

      const algoIdx = Math.min(2, Math.floor(progressX * 3));
      const keyIdx = Math.min(2, Math.floor(progressY * 3));
      const statusIdx = Math.min(2, Math.floor(progressY * 3));

      setAlgo(ALGOS[algoIdx]);
      setKeyBits(KEY_BITS[keyIdx]);
      setTime(Math.round(5 + progressX * 20));
      setStatus(STATUSES[statusIdx]);

      if (!interacting) {
        interacting = true;
        if (hint) hint.style.opacity = "0";
      }
    };

    const onLeave = () => {
      orb.style.left = "50%";
      orb.style.top = "50%";
      interacting = false;
      if (hint) hint.style.opacity = "1";
      setAlgo("AES-256");
      setKeyBits(256);
      setTime(12);
      setStatus("Secure");
    };

    zone.addEventListener("mousemove", onMove);
    zone.addEventListener("mouseleave", onLeave);
    return () => {
      zone.removeEventListener("mousemove", onMove);
      zone.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="scene-section" id="experience">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p
            className="font-display-thin text-xs tracking-widest mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            ENCRYPTION DEMO
          </p>
          <h2
            className="font-display-thin text-2xl md:text-4xl"
            style={{ color: "var(--text-primary)", letterSpacing: "0.1em" }}
          >
            看不见的加密
          </h2>
          <p
            className="font-body-elegant text-lg mt-6"
            style={{ color: "var(--text-muted)" }}
          >
            移动鼠标，感受数据在指尖加密的过程
          </p>
        </div>

        <div
          className="interactive-zone reveal"
          id="interactiveZone"
          ref={zoneRef}
          role="application"
          aria-label="Interactive encryption demo zone. Move your mouse to explore algorithm, key length, encrypt time, and status."
        >
          <div className="ambient-orb" id="ambientOrb" ref={orbRef} style={{ left: "50%", top: "50%" }} />

          <div className="sensor-indicator" style={{ top: "20%", left: "10%" }}>
            <span>ALGORITHM</span>
            <span className="sensor-value">{algo}</span>
          </div>

          <div className="sensor-indicator" style={{ top: "20%", right: "10%" }}>
            <span>KEY LENGTH</span>
            <span className="sensor-value">{keyBits} bit</span>
          </div>

          <div className="sensor-indicator" style={{ bottom: "20%", left: "10%" }}>
            <span>ENCRYPT TIME</span>
            <span className="sensor-value">{time}ms</span>
          </div>

          <div className="sensor-indicator" style={{ bottom: "20%", right: "10%" }}>
            <span>STATUS</span>
            <span className="sensor-value">{status}</span>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p
              className="font-display-thin text-sm tracking-widest"
              style={{ color: "var(--text-muted)", transition: "opacity 0.4s ease" }}
              ref={hintRef}
            >
              MOVE TO EXPLORE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
