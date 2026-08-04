"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import Hero from "@/components/Hero";
import AppStoreGrid from "@/components/AppStoreGrid";

export default function Home() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg)] selection:bg-blue-100 selection:text-blue-900">
      {/* Top-Right Navbar / Logo */}
      <div className="fixed top-4 right-4 md:top-6 md:right-8 z-50 flex items-center gap-2">
        <button className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 hover:bg-white/90 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            GL
          </div>
          <span className="font-semibold text-sm md:text-base text-[var(--text)] display-text tracking-wide">
            Gilang's Store
          </span>
        </button>
      </div>

      <Hero />
      <AppStoreGrid />
    </main>
  );
}
