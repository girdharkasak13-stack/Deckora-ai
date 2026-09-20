import { ArrowUpRight, Sparkles } from "lucide-react";

function DashboardCard({ title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left bg-white border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >

      {/* Soft background glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-orange-200/40 to-pink-200/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      {/* Icon */}
      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 flex items-center justify-center text-white shadow-md">
        <Sparkles size={21} />
      </div>

      {/* Content */}
      <div className="relative mt-5">

        <div className="flex items-start justify-between gap-4">

          <h2 className="text-xl font-bold text-[#171717]">
            {title}
          </h2>

          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition">
            <ArrowUpRight size={18} />
          </div>

        </div>

        <p className="text-gray-500 mt-3 leading-6">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-500">
          Get started
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>

      </div>

    </button>
  );
}

export default DashboardCard;