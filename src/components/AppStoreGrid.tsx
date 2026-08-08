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
} from "lucide-react";

import { formatBytes, youtubeEmbedUrl } from "@/lib/constants";
import type { AppWithRelations } from "@/lib/types";

export default function AppStoreGrid({ apps }: { apps: AppWithRelations[] }) {
  const [selectedApp, setSelectedApp] = useState<AppWithRelations | null>(null);

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
                const embedUrl = youtubeEmbedUrl(app.video_url);

                return (
                  <motion.div
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
                      <a
                        href={`/api/download/${app.slug}`}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0 ml-2"
                        aria-label={`Download ${app.name}`}
                      >
                        <Download className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
                      </a>
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
                <span className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[200px]">
                  {selectedApp.name}
                </span>
                <div className="flex items-center gap-1 text-slate-700">
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
                    <MoreVertical className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* App Info Header - Google Play Style Layout */}
              <div className="p-5 pb-3">
                {/* Big Title at top */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                  {selectedApp.name}
                </h1>

                {/* Horizontal Scrollable Row with App Icon + Metrics */}
                <div className="flex items-center gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-5 px-5">
                  {/* 1. App Icon */}
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-[18px] md:rounded-[20px] overflow-hidden flex items-center justify-center text-white text-3xl font-extrabold shadow-sm shrink-0 border border-slate-100 bg-gradient-to-br ${selectedApp.gradient}`}
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
                  <div className="w-[1px] h-9 bg-slate-200 shrink-0" />

                  {/* 2. Rating */}
                  <div className="flex flex-col items-center justify-center shrink-0 min-w-[55px]">
                    <div className="flex items-center gap-1 font-extrabold text-slate-900 text-sm">
                      <span>{selectedApp.rating || "4.5"}</span>
                      <Star className="w-3.5 h-3.5 fill-slate-800 text-slate-800" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 mt-1">Rating</span>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-[1px] h-9 bg-slate-200 shrink-0" />

                  {/* 3. Age Rating */}
                  <div className="flex flex-col items-center justify-center shrink-0 min-w-[70px]">
                    <span className="border border-slate-800 text-slate-900 font-extrabold text-[10px] px-1.5 py-0.5 rounded leading-none">
                      {selectedApp.content_rating || "12+"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 mt-1">
                      Rated for {selectedApp.content_rating || "12+"}
                    </span>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-[1px] h-9 bg-slate-200 shrink-0" />

                  {/* 4. Download Size */}
                  <div className="flex flex-col items-center justify-center shrink-0 min-w-[60px]">
                    <Download className="w-4 h-4 text-slate-800 stroke-[2.5]" />
                    <span className="text-[10px] font-extrabold text-slate-900 mt-1">
                      {selectedSize || "24 MB"}
                    </span>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-[1px] h-9 bg-slate-200 shrink-0" />

                  {/* 5. Downloads Count */}
                  <div className="flex flex-col items-center justify-center shrink-0 min-w-[65px]">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {selectedApp.download_count > 0 ? `${selectedApp.download_count}+` : "1K+"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 mt-1">Downloads</span>
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

              {/* Screenshots Showcase */}
              <div className="px-5 my-4">
                <h3 className="text-sm font-bold text-slate-900 mb-3 tracking-tight">App Previews</h3>
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-5 px-5">
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">About this app</h3>
                </div>
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
                <a
                  href={`/api/download/${selectedApp.slug}`}
                  className="flex-1 py-3 px-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-[0.99]"
                >
                  <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">Install App</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
