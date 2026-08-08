"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Download,
  ChevronLeft,
  MoreVertical,
  ChevronDown,
  Search,
  Star,
  Share2,
  CheckCircle2,
  MessageSquare,
  Info,
  HardDrive,
  ChevronRight,
  ShieldCheck,
  X,
  ExternalLink,
  Flag,
  Copy,
} from "lucide-react";

import { formatBytes, youtubeEmbedUrl } from "@/lib/constants";
import type { AppWithRelations } from "@/lib/types";

export default function AppStoreGrid({ apps }: { apps: AppWithRelations[] }) {
  const [selectedApp, setSelectedApp] = useState<AppWithRelations | null>(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [pendingDownloadApp, setPendingDownloadApp] = useState<AppWithRelations | null>(null);
  const [hasAgreedTerms, setHasAgreedTerms] = useState(true);
  const [activePlayingAppId, setActivePlayingAppId] = useState<string | null>(
    apps.length > 0 ? apps[0].id : null
  );
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // IntersectionObserver to auto-play ONLY the video card currently visible in viewport as user scrolls
  useEffect(() => {
    if (typeof window === "undefined" || apps.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let mostVisibleAppId: string | null = null;

        entries.forEach((entry) => {
          const appId = entry.target.getAttribute("data-app-id");
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleAppId = appId;
          }
        });

        if (mostVisibleAppId && maxRatio >= 0.3) {
          setActivePlayingAppId(mostVisibleAppId);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8, 1.0],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    const cardElements = document.querySelectorAll("[data-app-id]");
    cardElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [apps]);

  useEffect(() => {
    if (selectedApp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedApp]);

  const closePanel = () => setSelectedApp(null);

  const handleShare = async (app: AppWithRelations) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?app=${app.slug}`;
    const shareData = {
      title: app.name,
      text: app.tagline ?? `Cek ${app.name} di sini`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // pengguna membatalkan share sheet — tidak perlu tindakan
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    } catch {
      // clipboard tidak tersedia — tidak ada fallback lain
    }
  };

  const selectedSize = selectedApp ? formatBytes(selectedApp.download_size_bytes) : null;

  return (
    <>
      <section className="pt-10 pb-6 md:pt-12 md:pb-8 bg-white relative z-10" id="store">
        <div className="w-full max-w-6xl mx-auto px-3 md:px-6">
          {/* App Grid */}
          <div className="min-h-[400px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 w-full"
            >
              {apps.map((app, index) => {
                const isPlaying = activePlayingAppId === app.id;
                const embedUrl = youtubeEmbedUrl(app.video_url, isPlaying);

                return (
                  <motion.div
                    data-app-id={app.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    key={app.id}
                    className="group bg-white rounded-3xl overflow-hidden flex flex-col shadow-sm border border-slate-200 transition-all hover:shadow-lg w-full"
                  >
                    {/* Top Cover — video YouTube, atau gradient kalau belum diisi */}
                    <div className="w-full relative pt-[56.25%] bg-black">
                      {embedUrl ? (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={embedUrl}
                          title={`${app.name} preview`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div
                          className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${app.gradient} flex items-center justify-center`}
                        >
                          <span className="text-white/90 text-4xl font-bold drop-shadow">
                            {app.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* App Details */}
                    <div className="p-4 md:p-6 flex items-center justify-between bg-white text-slate-900 relative z-20">
                      <div
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => setSelectedApp(app)}
                      >
                        {/* Icon */}
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${app.gradient} border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm shrink-0 overflow-hidden`}
                        >
                          {app.icon_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={app.icon_url}
                              alt={app.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white drop-shadow-sm">
                              {app.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col">
                          <h4 className="text-sm md:text-base font-bold line-clamp-1">
                            {app.name}
                          </h4>
                          <p className="text-[10px] md:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {app.tagline || app.description}
                          </p>
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        type="button"
                        onClick={() => setPendingDownloadApp(app)}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0 ml-2"
                        aria-label={`Download ${app.name}`}
                      >
                        <Download className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selected App Detail Panel */}
      <AnimatePresence>
        {selectedApp && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              data-lenis-prevent
              className="fixed top-0 right-0 w-full md:w-[500px] h-full h-screen bg-white shadow-2xl z-[110] border-l border-slate-200 overflow-y-auto overflow-x-hidden flex flex-col text-slate-900 pb-28"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100">
                <button
                  onClick={closePanel}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700 active:scale-95"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-1 text-slate-700">
                  <div className="relative">
                    <button
                      onClick={() => handleShare(selectedApp)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                      aria-label="Bagikan app"
                    >
                      <Share2 className="w-5 h-5 text-slate-600" />
                    </button>
                    <AnimatePresence>
                      {shareFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-full right-0 mt-1 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg z-10"
                        >
                          Link disalin!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95 text-slate-600"
                      aria-label="Opsi lainnya"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                      {isMoreMenuOpen && (
                        <>
                          {/* Invisible Backdrop to close menu when clicking outside */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsMoreMenuOpen(false)}
                          />

                          {/* Dropdown Menu Box */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50 text-xs font-semibold text-slate-700 space-y-0.5"
                          >
                            {/* Option 1: Share Link */}
                            <button
                              onClick={() => {
                                setIsMoreMenuOpen(false);
                                handleShare(selectedApp);
                              }}
                              className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-left text-slate-700"
                            >
                              <Copy className="w-4 h-4 text-slate-500 shrink-0" />
                              <span>Bagikan Tautan App</span>
                            </button>

                            {/* Option 2: Report App */}
                            <a
                              href={`https://wa.me/6281234567890?text=Halo%20Gilang%20Store,%20saya%20ingin%20melaporkan%20masalah/bug%20pada%20aplikasi%20${encodeURIComponent(
                                selectedApp.name
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsMoreMenuOpen(false)}
                              className="w-full px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition-colors text-left text-slate-700"
                            >
                              <Flag className="w-4 h-4 text-rose-500 shrink-0" />
                              <span>Laporkan Aplikasi</span>
                            </a>

                            {/* Option 3: Verification Info */}
                            <div className="px-3 py-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center gap-1.5 mt-1 pt-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Terverifikasi Gilang Store</span>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* App Info Header - Google Play Style Layout */}
              <div className="p-5 pb-3">
                {/* Big Title at top */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                  {selectedApp.name}
                </h1>

                {/* Ultra-Compact Icon + Metrics Row */}
                <div className="flex items-center gap-2.5">
                  {/* Compact App Icon */}
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-[16px] overflow-hidden flex items-center justify-center text-white text-2xl font-extrabold shadow-xs shrink-0 border border-slate-100 bg-gradient-to-br ${selectedApp.gradient}`}
                  >
                    {selectedApp.icon_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedApp.icon_url}
                        alt={selectedApp.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedApp.name.charAt(0)
                    )}
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-[1px] h-7 bg-slate-200 shrink-0" />

                  {/* Ultra-Compact Metrics Container */}
                  <div className="flex-1 flex items-center justify-around gap-1.5 min-w-0">
                    {/* 1. Age Rating */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="border-[1.5px] border-slate-900 text-slate-900 font-black text-[10px] px-1 py-0.5 rounded-md leading-none">
                        {selectedApp.content_rating || "12+"}
                      </div>
                      <div className="flex items-center gap-0.5 text-[9px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                        <span>Rated for {selectedApp.content_rating || "12+"}</span>
                        <Info className="w-2.5 h-2.5 text-slate-500" />
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-[1px] h-7 bg-slate-200/80 shrink-0" />

                    {/* 2. Download Size */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <Download className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
                      <span className="text-[10px] font-extrabold text-slate-900 mt-0.5 leading-tight whitespace-nowrap">
                        {selectedSize || "24 MB"}
                      </span>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-[1px] h-7 bg-slate-200/80 shrink-0" />

                    {/* 3. Downloads Count */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <span className="font-extrabold text-slate-900 text-xs leading-tight whitespace-nowrap">
                        {selectedApp.download_count > 0 ? `${selectedApp.download_count}+` : "1K+"}
                      </span>
                      <span className="text-[9px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">Downloads</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags / Tech Stack Row */}
              <div className="px-5 my-3">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide snap-x pb-1 -mx-5 px-5">
                  <span className="snap-start shrink-0 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                    {selectedApp.category}
                  </span>
                  {selectedApp.tech_stack.map((tech, i) => (
                    <span
                      key={i}
                      className="snap-start shrink-0 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                    >
                      {tech}
                    </span>
                  ))}
                  {selectedApp.is_featured && (
                    <span className="snap-start shrink-0 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/80">
                      ★ Editor&apos;s Choice
                    </span>
                  )}
                </div>
              </div>

              {/* Screenshots Showcase / App Previews */}
              <div className="px-5 my-4">
                <h3 className="text-sm font-bold text-slate-900 mb-3 tracking-tight">App Previews</h3>
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-5 px-5">
                  {/* YouTube Video Preview Card as 1st Item (Play Store Style) */}
                  {youtubeEmbedUrl(selectedApp.video_url, true) && (
                    <div className="snap-start shrink-0 w-[240px] h-[140px] rounded-2xl overflow-hidden relative border border-slate-200 shadow-sm bg-slate-900 group">
                      <iframe
                        src={youtubeEmbedUrl(selectedApp.video_url, true)!}
                        title={`${selectedApp.name} Video Preview`}
                        className="w-full h-full object-cover border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {selectedApp.app_screenshots.length > 0
                    ? selectedApp.app_screenshots.map((shot) => (
                        <div
                          key={shot.id}
                          className="snap-start shrink-0 w-[240px] h-[140px] rounded-2xl overflow-hidden relative border border-slate-200 shadow-sm bg-slate-100 group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={shot.image_url}
                            alt={shot.caption ?? selectedApp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))
                    : [1, 2, 3].map((_, i) => (
                        <div
                          key={i}
                          className="snap-start shrink-0 w-[240px] h-[140px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative border border-slate-200 shadow-sm"
                        >
                          <div className="absolute inset-0 bg-white/20" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <LayoutGrid className="w-10 h-10 text-slate-400" />
                          </div>
                        </div>
                      ))}
                </div>
              </div>

              {/* About This App / Description Section */}
              <div className="px-5 my-3">
                <div
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="flex items-center justify-between py-1 cursor-pointer select-none group"
                >
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">About this app</h3>
                  <div className="p-1 rounded-full group-hover:bg-slate-100 transition-colors">
                    <ChevronRight
                      className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                        isAboutExpanded ? "rotate-90" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isAboutExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden pt-1"
                    >
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {selectedApp.description}
                      </p>

                      {/* Info Metadata Grid */}
                      <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Version</span>
                          <span className="text-slate-800 font-semibold">{selectedApp.version || "1.0.0"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Platform</span>
                          <span className="text-slate-800 font-semibold capitalize">{selectedApp.platform || "Web & Mobile"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Released</span>
                          <span className="text-slate-800 font-semibold">{selectedApp.year || "2026"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Developer</span>
                          <span className="text-slate-800 font-semibold truncate block">
                            {selectedApp.developer && selectedApp.developer.length > 0
                              ? selectedApp.developer[0]
                              : "Gilang Store"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Links & Extra Resources */}
              {selectedApp.app_links && selectedApp.app_links.length > 0 && (
                <div className="px-5 my-3">
                  <h3 className="text-sm font-bold text-slate-900 mb-2.5 tracking-tight">Links & Resources</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.app_links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors inline-flex items-center gap-1.5 border border-slate-200/60"
                      >
                        <span>{link.label || link.type}</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Floating Bottom Action Bar */}
              <div className="fixed bottom-0 right-0 w-full md:w-[500px] p-3.5 px-4 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 flex items-center gap-2.5 z-40 shadow-lg">
                {/* Left Button: Contact to Custom App */}
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Gilang%20Store,%20saya%20ingin%20custom%20app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs md:text-sm transition-all text-center flex items-center justify-center gap-1.5 border border-slate-200 active:scale-[0.99]"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Contact Custom App</span>
                </a>

                {/* Right Button: Install App */}
                <button
                  type="button"
                  onClick={() => setPendingDownloadApp(selectedApp)}
                  className="flex-1 py-3 px-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-[0.99]"
                >
                  <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">Install App</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Install Confirmation & Terms Agreement Modal */}
      <AnimatePresence>
        {pendingDownloadApp && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingDownloadApp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-[420px] bg-white rounded-[28px] p-6 shadow-2xl border border-slate-100 text-slate-900 z-10 space-y-5 overflow-hidden"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    Confirm Installation
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400">
                    Official Verified Package
                  </p>
                </div>
              </div>

              {/* App Hero Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/60 flex items-center gap-3.5 shadow-xs">
                <div
                  className={`w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-white text-2xl font-extrabold shrink-0 shadow-sm border border-white bg-gradient-to-br ${pendingDownloadApp.gradient}`}
                >
                  {pendingDownloadApp.icon_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={pendingDownloadApp.icon_url}
                      alt={pendingDownloadApp.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    pendingDownloadApp.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate tracking-tight">
                    {pendingDownloadApp.name}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">
                      {pendingDownloadApp.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {formatBytes(pendingDownloadApp.download_size_bytes) || "24 MB"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox Card */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/60 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={hasAgreedTerms}
                      onChange={(e) => setHasAgreedTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed font-medium">
                    I have read and agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Terms & Conditions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Privacy Policy</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setPendingDownloadApp(null)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold transition-all text-center border border-slate-200/60 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!hasAgreedTerms}
                  onClick={() => {
                    const slug = pendingDownloadApp.slug;
                    setPendingDownloadApp(null);
                    window.location.href = `/api/download/${slug}`;
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs md:text-sm font-bold transition-all text-center shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">Agree & Download</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
