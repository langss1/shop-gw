export default function Footer() {
  return (
    <footer className="bg-white text-slate-500 p-6 md:p-8 flex flex-col items-start text-[11px] md:text-xs leading-relaxed border-t border-slate-200 max-w-6xl mx-auto w-full">
      
      {/* Logos Row */}
      <div className="flex items-center gap-4 mb-4">
        <img src="/logo1.png" alt="Gilang Store Logo" className="h-8 object-contain" />
        <div className="w-[1px] h-6 bg-slate-300 rounded-full"></div>
        <img src="/logo.jpeg" alt="Logo" className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm" />
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <a href="/development" className="hover:text-blue-600 transition-colors cursor-pointer">
          Terms and Conditions
        </a>
        <span className="text-slate-300">|</span>
        <a href="/development" className="hover:text-blue-600 transition-colors cursor-pointer">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
