"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import MobileHeader from "@/components/MobileHeader";
import AppStoreGrid from "@/components/AppStoreGrid";
import Footer from "@/components/Footer";

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
    <main className="min-h-screen flex flex-col bg-[var(--bg)] selection:bg-blue-100 selection:text-blue-900 max-w-4xl mx-auto border-x border-slate-100 shadow-xl shadow-slate-200/20">
      <MobileHeader />
      
      <div className="px-4 md:px-8 pb-4 flex-1 bg-white">
        <AppStoreGrid />
      </div>

      <Footer />
    </main>
  );
}
