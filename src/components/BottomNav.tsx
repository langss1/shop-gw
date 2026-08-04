import { Gamepad2, LayoutGrid, Menu } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[#1c1c1e] text-slate-400 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl border border-white/10">
        
        {/* Active Item */}
        <button className="flex flex-col items-center justify-center px-5 py-2 bg-white/10 rounded-full text-white transition-colors">
          <Gamepad2 className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide">Games</span>
        </button>

        {/* Inactive Items */}
        <button className="flex flex-col items-center justify-center px-5 py-2 hover:bg-white/5 rounded-full transition-colors">
          <LayoutGrid className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide">Apps</span>
        </button>

        <button className="flex flex-col items-center justify-center px-5 py-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide">Menu</span>
          {/* Red Dot */}
          <span className="absolute top-2 right-4 w-2 h-2 bg-orange-600 rounded-full border border-[#1c1c1e]"></span>
        </button>

      </div>
    </div>
  );
}
