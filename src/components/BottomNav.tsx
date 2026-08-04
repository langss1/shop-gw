import { Gamepad2, LayoutGrid, Menu } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white text-slate-500 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl border border-slate-200">
        
        {/* Active Item */}
        <button className="flex flex-col items-center justify-center px-5 py-2 bg-slate-100 rounded-full text-slate-900 transition-colors">
          <Gamepad2 className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide">Games</span>
        </button>

        {/* Inactive Items */}
        <button className="flex flex-col items-center justify-center px-5 py-2 hover:bg-slate-50 hover:text-slate-900 rounded-full transition-colors">
          <LayoutGrid className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide">Apps</span>
        </button>

        <button className="flex flex-col items-center justify-center px-5 py-2 hover:bg-slate-50 hover:text-slate-900 rounded-full transition-colors relative">
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide">Menu</span>
          {/* Red Dot */}
          <span className="absolute top-2 right-4 w-2 h-2 bg-orange-600 rounded-full border border-white"></span>
        </button>

      </div>
    </div>
  );
}
