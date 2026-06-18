"use client";

import { useEffect } from "react";
import DustCanvas from "@/components/fynut/dust-canvas";
import NavBar from "@/components/fynut/nav-bar";
import TimeIndicator from "@/components/fynut/time-indicator";
import Hero from "@/components/fynut/hero";
import Philosophy from "@/components/fynut/philosophy";
import Experience from "@/components/fynut/experience";
import Products from "@/components/fynut/products";
import TechDetails from "@/components/fynut/tech-details";
import Footer from "@/components/fynut/footer";
import { useScrollTheme } from "@/hooks/use-scroll-theme";

export default function Home() {
  useScrollTheme();

  // Ensure body starts in the morning theme
  useEffect(() => {
    document.body.classList.add("time-morning");
  }, []);

  return (
    <>
      <DustCanvas />
      <div className="time-overlay" aria-hidden="true" />

      <NavBar />
      <TimeIndicator />

      <div className="content-wrapper flex flex-col min-h-screen">
        <main className="flex-1">
          <Hero />
          <Philosophy />
          <Experience />
          <Products />
          <TechDetails />
        </main>
        <Footer />
      </div>
    </>
  );
}
