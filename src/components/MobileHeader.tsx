"use client";
import { Search, MonitorSmartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

import { PLATFORMS } from "@/lib/constants";
import type { Banner, Platform } from "@/lib/types";

/** Banner cadangan kalau tabel `banners` masih kosong. */
const FALLBACK_BANNER: Banner = {
  id: "fallback",
  image_url: null,
  link_url: null,
  gradient: "from-blue-600 via-indigo-600 to-purple-700",
  sort_order: 0,
  is_active: true,
};

export default function MobileHeader({
  banners,
  activePlatform,
  onPlatformChange,
  searchQuery = "",
  onSearchChange = () => {},
}: {
  banners: Banner[];
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}) {
  const slides = banners.length > 0 ? banners : [FALLBACK_BANNER];
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const closeSearch = () => {
    setIsSearchOpen(false);
    onSearchChange("");
  };

  // Scroll detection for sticky header
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show sticky header when scrolled past 80px
    if (latest > 80) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // Auto-rotate carousel
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const banner = slides[Math.min(slideIndex, slides.length - 1)];

  const bannerBody = (
    <>
      {/* Background: gambar dari admin, atau gradient sebagai fallback */}
      {banner.image_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={banner.image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient}`} />
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/20 blur-2xl" />
        </>
      )}

      {/* Indikator asli, mengikuti jumlah banner aktif */}
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-medium">
        {slideIndex + 1}/{slides.length}
      </div>
    </>
  );

  return (
    <>
      <div className="w-full max-w-6xl mx-auto bg-white text-slate-900 pt-6 px-3 md:px-6">
        {/* Top Bar: Logo & Search */}
        <div className="flex items-center justify-between mb-6 gap-2">
          {isSearchOpen ? (
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari app..."
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-slate-100 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={closeSearch}
                aria-label="Tutup pencarian"
                className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-slate-800" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative h-8 md:h-10 flex items-center justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo1.png"
                  alt="Store Logo"
                  className="h-full w-auto object-contain max-w-[150px]"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Cari app"
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Search className="w-6 h-6 text-slate-800" />
              </button>
            </>
          )}
        </div>

        {/* Featured Banner Carousel */}
        <div className="relative w-full h-[200px] md:h-[300px] rounded-3xl overflow-hidden mb-8 shadow-sm group">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {banner.link_url ? (
                <a href={banner.link_url} className="absolute inset-0 block cursor-pointer">
                  {bannerBody}
                </a>
              ) : (
                <div className="absolute inset-0">{bannerBody}</div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dots navigasi */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => setSlideIndex(i)}
                  aria-label={`Banner ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slideIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tabs Menu */}
        <div className="-mx-3 md:-mx-6 px-3 md:px-6 border-b border-slate-200 pb-5 w-full flex items-center justify-center">
          <div
            className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x px-1 max-w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Devices Icon */}
            <div className="pr-2.5 mr-0.5 border-r border-slate-200 flex-shrink-0 flex items-center">
              <MonitorSmartphone className="w-5 h-5 text-slate-600" />
            </div>

            {PLATFORMS.map((platform) => {
              const isActive = activePlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => onPlatformChange(platform.id)}
                  className={`snap-start whitespace-nowrap px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-800 to-blue-400 text-white shadow-md"
                      : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {platform.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Sticky Navbar (appears on scroll) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl"
          >
            <div className="relative h-6 flex items-center justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Store Logo"
                className="h-full w-auto object-contain max-w-[110px]"
              />
            </div>
            <div className="w-[1px] h-4 bg-slate-300 rounded-full" />
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsSearchOpen(true);
              }}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-800"
              aria-label="Cari app"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
