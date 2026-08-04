"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import { X, ExternalLink, GitBranch as Github, ChevronRight, LayoutGrid, Cpu, Shield, Code } from "lucide-react";

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
    <section className="py-12 md:py-24 bg-white relative z-10" id="store">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold display-text text-slate-900 tracking-tight">
              Featured Apps
            </h2>
            <p className="text-slate-500 mt-2">Explore the curated collection of informatics applications.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`relative px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all ${
                    isActive ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-12" />

        {/* App Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredApps.map((app, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden flex flex-col glass-card"
                >
                  {/* Top Cover */}
                  <div className={`h-[200px] w-full relative overflow-hidden bg-gradient-to-br ${app.gradient} p-6 flex items-end`}>
                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay">
                      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-white blur-2xl" />
                      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white blur-3xl" />
                    </div>
                    
                    <div className="relative z-10 w-full flex justify-between items-end">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {app.nama.charAt(0)}
                      </div>
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                        {app.kategori}
                      </span>
                    </div>
                  </div>

                  {/* App Details */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{app.nama}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {app.deskripsi}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {app.techStack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-bold text-slate-600 bg-slate-50">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide-out Detail Panel */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 bg-slate-900/40 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              data-lenis-prevent
              className="fixed top-0 right-0 w-full md:w-[500px] h-full h-screen bg-white shadow-2xl z-[110] border-l border-slate-200 overflow-y-auto flex flex-col"
            >
              <div className={`h-64 relative p-6 shrink-0 bg-gradient-to-br ${selectedApp.gradient}`}>
                <button 
                  onClick={closePanel}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white shadow-sm transition-all z-30 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">
                    {selectedApp.nama.charAt(0)}
                  </div>
                </div>
              </div>

              <div className="p-8 pb-16 flex-1 bg-white">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                      {selectedApp.kategori} • {selectedApp.tahun}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold display-text mb-4 text-slate-900">{selectedApp.nama}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedApp.techStack.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {selectedApp.deskripsi}
                  </p>
                </div>

                {selectedApp.store_links && (
                  <div className="space-y-4 mt-8 pt-8 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-4">Available Actions</h4>
                    {selectedApp.store_links.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-700">
                          {link.type === 'github' ? <Github className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                        </div>
                        <span className="font-bold text-sm flex-1 capitalize text-slate-800">{link.type === 'launch' ? 'Launch Application' : `${link.type} Repository`}</span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
