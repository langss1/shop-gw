"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Membungkus konten storefront dengan Lenis smooth scroll.
 * Dipisah dari page.tsx supaya page bisa jadi Server Component dan fetch data.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}
