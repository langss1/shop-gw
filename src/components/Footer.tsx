export default function Footer() {
  return (
    <footer className="bg-black text-slate-400 p-6 md:p-8 flex flex-col items-start text-[11px] md:text-xs leading-relaxed border-t border-slate-800">
      
      {/* Logos Row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white/90 p-1.5 rounded-lg flex items-center justify-center">
          <img src="/logo.png" alt="Gilang Store Logo" className="h-6 object-contain" />
        </div>
        <img src="/logo.jpeg" alt="Logo" className="h-9 w-9 rounded-full object-cover border-2 border-slate-700 shadow-sm" />
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 mb-6 text-sm font-semibold text-slate-200">
        <a href="#" className="hover:text-white transition-colors">Terms and Conditions</a>
        <span className="text-slate-600">|</span>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
      </div>

      {/* Text Info */}
      <div className="space-y-4 mb-8 text-slate-400">
        <p>
          Jika Anda memiliki pertanyaan atau komentar tentang Gilang Store, silakan hubungi pusat layanan pelanggan Gilang Store (0800-112-8888)
        </p>
        <p>
          If you have any questions or comments about Gilang Store, please contact the Gilang Store customer service center (0800-112-8888)
        </p>
      </div>

      {/* Copyright */}
      <div className="w-full text-center mt-auto font-bold text-slate-300 text-xs md:text-sm pt-4">
        Gilangwasis Co., Ltd.
      </div>
    </footer>
  );
}
