"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import { X, ExternalLink, GitBranch as Github, ChevronRight, LayoutGrid, Cpu, Shield, Code, Download, ChevronLeft, MoreVertical, ChevronDown, Search } from "lucide-react";

// Dummy Apps Database
const APPS = [
  {
    id: 1,
    nama: "DataFlow Analytics",
    kategori: "AI & Big Data",
    deskripsi: "An enterprise-grade analytics platform powered by AI. Process massive datasets in real-time, generate predictive insights, and visualize your data streams effortlessly. Built for data scientists and decision makers.",
    tahun: 2026,
    techStack: ["Next.js", "Python", "TensorFlow", "PostgreSQL"],
    store_links: [{ type: "github", url: "/development" }, { type: "launch", url: "/development" }],
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    nama: "CyberVault Pro",
    kategori: "Cybersecurity",
    deskripsi: "Next-generation cryptographic storage and vulnerability scanning toolkit. Secure your enterprise assets with military-grade encryption and automated pentesting reports.",
    tahun: 2025,
    techStack: ["Rust", "React", "WebAssembly", "Docker"],
    store_links: [{ type: "launch", url: "/development" }],
    gradient: "from-indigo-600 to-purple-500",
  },
  {
    id: 3,
    nama: "Nexus UI Framework",
    kategori: "Web Development",
    deskripsi: "A powerful, headless component library and design system for modern web applications. Focus on accessibility and beautiful micro-interactions out of the box.",
    tahun: 2026,
    techStack: ["TypeScript", "Tailwind CSS", "Framer Motion"],
    store_links: [{ type: "github", url: "/development" }, { type: "npm", url: "/development" }],
    gradient: "from-emerald-400 to-teal-500",
  }
];

const CATEGORIES = [
  { id: "All", label: "All", icon: LayoutGrid },
  { id: "AI & Big Data", label: "AI & Data", icon: Cpu },
  { id: "Cybersecurity", label: "Security", icon: Shield },
  { id: "Web Development", label: "Web", icon: Code }
];

export default function AppStoreGrid() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    if (selectedApp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedApp]);

  const filteredApps = activeFilter === "All" 
    ? APPS 
    : APPS.filter(p => p.kategori === activeFilter);

  const closePanel = () => setSelectedApp(null);

  return (
    <>
      <section className="pt-10 pb-6 md:pt-12 md:pb-8 bg-white relative z-10" id="store">
        <div className="w-full max-w-6xl mx-auto px-2 md:px-6">
        


        {/* App Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 w-full"
            >
              {filteredApps.map((app, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  key={app.id}
                  className="group bg-white rounded-3xl overflow-hidden flex flex-col shadow-sm border border-slate-200 transition-all hover:shadow-lg w-full"
                >
                  {/* Top Cover - YouTube Video */}
                  <div className="w-full relative pt-[56.25%] bg-black">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* App Details */}
                  <div className="p-4 md:p-6 flex items-center justify-between bg-white text-slate-900 relative z-20">
                    <div 
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      {/* Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${app.gradient} border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm shrink-0 overflow-hidden`}>
                        <span className="text-white drop-shadow-sm">{app.nama.charAt(0)}</span>
                      </div>
                      
                      {/* Info */}
                      <div className="flex flex-col">
                        <h4 className="text-sm md:text-base font-bold line-clamp-1">{app.nama}</h4>
                        <p className="text-[10px] md:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{app.deskripsi}</p>
                      </div>
                    </div>
                    
                    {/* Download Button */}
                    <a 
                      href="/development"
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0 ml-2"
                    >
                      <Download className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide-out Detail Panel */}
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
              className="fixed top-0 right-0 w-full md:w-[500px] h-full h-screen bg-white shadow-2xl z-[110] border-l border-slate-200 overflow-y-auto overflow-x-hidden flex flex-col text-slate-900 pb-24"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between p-4 sticky top-0 bg-white/90 backdrop-blur-md z-30">
                <button onClick={closePanel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2 text-slate-700">
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* App Info Header */}
              <div className="p-5 pb-0">
                <h2 className="text-2xl font-bold mb-4 text-slate-900">{selectedApp.nama}</h2>
                <div className="flex gap-4 mb-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0 ${selectedApp.gradient}`}>
                    {selectedApp.nama.charAt(0)}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-col justify-center text-sm text-slate-500 space-y-1">
                    <p className="line-clamp-1">Copyright © Gilang Store. All Rights Reserved.</p>
                    <p className="font-semibold text-slate-700">★ 4.5 <span className="text-slate-500 font-normal">· In-app purchases</span></p>
                    <p>Rated 12+</p>
                    <p>#{selectedApp.kategori}</p>
                  </div>
                </div>

                {/* Tags Row */}
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide snap-x pb-2 mb-6 -mx-5 px-5">
                  {selectedApp.techStack.map((tech: string, i: number) => (
                    <span key={i} className="snap-start shrink-0 px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600">
                      {tech}
                    </span>
                  ))}
                  <span className="snap-start shrink-0 px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600">
                    Editor's Choice
                  </span>
                </div>

                {/* Screenshots Gallery (Dummy) */}
                <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide snap-x pb-2 mb-8 -mx-5 px-5">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="snap-start shrink-0 w-[240px] h-[135px] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative border border-slate-200">
                      <div className="absolute inset-0 bg-white/20" />
                      {/* Abstract pattern for dummy screenshot */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <LayoutGrid className="w-12 h-12 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* What's new */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4 cursor-pointer">
                    <h3 className="text-lg font-bold text-slate-900">What's new</h3>
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-1">
                    <p>[New Features]</p>
                    <p>Experience the latest updates to {selectedApp.nama}. We've optimized performance and introduced a sleek new user interface to enhance your workflow.</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4 cursor-pointer">
                    <h3 className="text-lg font-bold text-slate-900">Description</h3>
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <p>{selectedApp.deskripsi}</p>
                    <br />
                    <p>Designed in 2026, this app brings enterprise-level capabilities directly to your device.</p>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="fixed bottom-0 right-0 w-full md:w-[500px] p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center z-40 pb-24 md:pb-4">
                <button className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
                  Install
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
