import { onMount } from "solid-js";
import DustCanvas from "./components/DustCanvas";
import NavBar from "./components/NavBar";
import TimeIndicator from "./components/TimeIndicator";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import Experience from "./components/Experience";
import Products from "./components/Products";
import TechDetails from "./components/TechDetails";
import Footer from "./components/Footer";
import { useScrollTheme } from "./hooks/useScrollTheme";

export default function App() {
  useScrollTheme();

  onMount(() => {
    document.body.classList.add("time-morning");
  });

  return (
    <>
      <DustCanvas />
      <div class="time-overlay" aria-hidden="true" />

      <NavBar />
      <TimeIndicator />

      <div class="content-wrapper flex flex-col min-h-screen">
        <main class="flex-1">
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
