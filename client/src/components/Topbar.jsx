import { Bell, MagnifyingGlass } from "@phosphor-icons/react";
import { auth } from "../firebase";

function Topbar() {
  const user = auth.currentUser;
  const initials =
    (user?.displayName || user?.email || "")
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="h-20 bg-white border-b border-orange-100 px-8 flex items-center justify-between">

      {/* Left */}
      <div>
        <h2 className="text-2xl font-black text-[#171717]">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Welcome back 👋
        </p>
      </div>


      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">

          <MagnifyingGlass
            size={20}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search presentations..."
            className="bg-transparent outline-none text-gray-700 w-72 placeholder:text-gray-400"
          />

        </div>


        {/* Notification */}
        <button className="bg-white border border-gray-200 p-3 rounded-xl text-gray-600 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 transition-all">
          <Bell size={21} />
        </button>


        {/* Profile */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center font-bold text-white cursor-pointer shadow-md hover:scale-105 transition-all">
          {initials}
        </div>

      </div>

    </header>
  );
}

export default Topbar;