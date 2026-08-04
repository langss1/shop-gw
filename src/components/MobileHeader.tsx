"use client";
import { Search, MonitorSmartphone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const TABS = ["mobile", "web", "cli", "skills-ai"];

export default function MobileHeader() {
  const [activeTab, setActiveTab] = useState("mobile");

  return (
    <div className="w-full bg-white text-slate-900 pt-6 pb-2 px-4 md:px-8">
      {/* Top Bar: Logo & Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative h-8 w-32 md:h-10 md:w-40 flex items-center">
          {/* We use a regular img tag here so it doesn't break if logo1.png is missing during dev, but you can change to next/image later */}
          <img 
            src="/logo1.png" 
            alt="Store Logo" 
            className="h-full w-auto object-contain"
          />
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Search className="w-6 h-6 text-slate-800" />
        </button>
      </div>

      {/* Featured Banner (Like Warhammer in the screenshot) */}
      <div className="relative w-full h-[200px] md:h-[300px] rounded-3xl overflow-hidden mb-6 shadow-sm group cursor-pointer">
        {/* Placeholder Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        
        {/* Abstract shapes for aesthetics */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/20 blur-2xl" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">
              Featured Application
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-[70%] drop-shadow-sm">
              Discover the most powerful tools to accelerate your workflow.
            </p>
          </motion.div>
        </div>

        {/* Indicator (like 3/4 in screenshot) */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-medium">
          1/4
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center border-b border-slate-200 pb-3 mb-2 w-full">
        {/* Devices Icon on the far left */}
        <div className="pr-4 pl-2 mr-2 border-r border-slate-200 flex-shrink-0">
          <MonitorSmartphone className="w-5 h-5 text-slate-600" />
        </div>

        {/* Centered Tabs Container */}
        <div className="flex-1 flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? "bg-slate-800 text-white shadow-md" 
                    : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
