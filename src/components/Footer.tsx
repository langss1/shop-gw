export default function Footer() {
  return (
    <footer className="bg-transparent text-slate-500 p-6 md:p-8 flex flex-col items-start text-[11px] md:text-xs leading-relaxed border-t border-black">
      
      {/* Logos Row */}
      <div className="flex items-center gap-4 mb-6">
        <img src="/logo1.png" alt="Gilang Store Logo" className="h-8 object-contain" />
        <div className="w-[1px] h-6 bg-slate-300 rounded-full"></div>
        <img src="/logo.jpeg" alt="Logo" className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm" />
      </div>

      {/* Text Info */}
      <div className="space-y-4 mb-8 text-slate-500">
        <p>
          Jika Anda memiliki pertanyaan atau komentar tentang Gilang Store, silakan hubungi pusat layanan pelanggan Gilang Store (0800-112-8888)
        </p>
        <p>
          If you have any questions or comments about Gilang Store, please contact the Gilang Store customer service center (0800-112-8888)
        </p>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 mt-auto text-sm font-semibold text-slate-700">
        <a href="#" className="hover:text-blue-600 transition-colors">Terms and Conditions</a>
        <span className="text-slate-300">|</span>
        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
      </div>
    </footer>
  );
}
