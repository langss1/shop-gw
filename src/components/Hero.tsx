"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Graphic Design (Waves / Abstract Orbs) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-blue-300/30 to-cyan-300/30 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            rotate: [0, -15, 10, 0],
            scale: [1, 1.2, 0.8, 1] 
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-indigo-300/20 to-emerald-300/20 blur-[120px]"
        />
        
        {/* Abstract SVG Wave overlay */}
        <svg className="absolute bottom-0 w-full h-auto text-slate-100/50" viewBox="0 0 1440 320" preserveAspectRatio="none">
           <path fill="currentColor" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,144C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,192C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Informatics Storefront</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold display-text text-slate-900 tracking-tight leading-tight mb-6"
        >
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Powerful</span><br />
          Informatics Apps.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10"
        >
          A unified ecosystem containing high-performance applications designed to accelerate your workflow, analyze data, and build the future.
        </motion.p>
      </div>
    </section>
  );
}
