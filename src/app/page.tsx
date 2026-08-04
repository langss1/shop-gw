"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Construction, Cog, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function UnderDevelopment() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-500/20 blur-[80px]"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[70vw] h-[70vw] md:w-[35vw] md:h-[35vw] rounded-full bg-gradient-to-bl from-emerald-400/20 to-cyan-400/20 blur-[100px]"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-blue-500/30 blur-[2px]"
            style={{
              width: Math.random() * 20 + 5 + "px",
              height: Math.random() * 20 + 5 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
        {/* Animated Gears */}
        <div className="relative mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-blue-500"
          >
            <Cog className="w-24 h-24 md:w-32 md:h-32 opacity-20" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute text-purple-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Cog className="w-12 h-12 md:w-16 md:h-16" />
          </motion.div>

        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >

          <h1 className="text-4xl md:text-6xl font-black display-text text-slate-900 tracking-tight mb-6">
            Feature Under <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Development</span>
          </h1>
          
          <p className="text-slate-500 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            We are crafting something amazing. This application is currently being built and will be available soon in the Gilang Store ecosystem.
          </p>

          <a href="https://gilangwasis.xyz" target="_blank" rel="noopener noreferrer">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Visit Main Portfolio</span>
            </motion.button>
          </a>
        </motion.div>
      </div>
    </main>
  );
}
