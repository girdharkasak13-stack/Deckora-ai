import {
  House,
  PlusCircle,
  Upload,
  MagicWand,
  ClockCounterClockwise,
  User,
  Sparkle,
} from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: House,
      path: "/dashboard",
    },
    {
      label: "Create",
      icon: PlusCircle,
      path: "/create",
    },
    {
      label: "Upload PPT",
      icon: Upload,
      path: "/upload",
    },
    {
      label: "Presentation Coach",
      icon: MagicWand,
      path: "/review",
    },
    {
      label: "History",
      icon: ClockCounterClockwise,
      path: "/history",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-orange-100 flex flex-col px-4 py-5 shrink-0">

      {/* LOGO */}
      <div className="px-3 mb-8">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-md">
            D
          </div>

          <div>
            <h1 className="text-xl font-black text-[#171717]">
              Deckora
            </h1>

            <p className="text-[10px] text-gray-500">
              AI Presentation Workspace
            </p>
          </div>

        </div>

      </div>


      {/* CREATE BUTTON */}
      <button
        onClick={() => navigate("/create")}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all mb-7"
      >
        <Sparkle size={18} weight="bold" />
        Create Presentation
      </button>


      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1">

        <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        {menuItems.map((item) => {

          const Icon = item.icon;

          const active = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 border border-orange-100 shadow-sm"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >

              <Icon
                size={20}
                weight={active ? "fill" : "regular"}
              />

              <span>{item.label}</span>

              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
              )}

            </button>
          );
        })}

      </nav>


      {/* AI CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 border border-orange-100 p-4 mt-6">

        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-pink-200/40 blur-xl" />

        <div className="relative">

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white mb-3 shadow-sm">
            <Sparkle size={17} weight="fill" />
          </div>

          <h3 className="font-bold text-[#171717] text-sm">
            Deckora AI
          </h3>

          <p className="text-xs text-gray-500 mt-1 leading-5">
            Create better presentations with AI.
          </p>

        </div>

      </div>


      {/* FOOTER */}
      <div className="pt-5 mt-5 border-t border-orange-100">
        <p className="text-[10px] text-gray-400 text-center">
          © 2026 Deckora
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;