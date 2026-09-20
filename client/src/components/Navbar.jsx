import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#FFF8F5]/90 backdrop-blur-xl border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center font-black text-lg text-white shadow-lg">
            D
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h1 className="text-2xl font-black text-[#171717] tracking-tight">
                Deckora
              </h1>

              <span className="px-2 py-1 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                AI Powered
              </span>

            </div>

            <p className="text-xs text-gray-500 -mt-1">
              AI Presentation Workspace
            </p>
          </div>

        </Link>


        {/* Menu */}
        <nav className="hidden md:flex items-center gap-10 text-gray-700 font-medium">

          <a
            href="#features"
            className="hover:text-orange-500 transition duration-300"
          >
            Features
          </a>

          <a
            href="#templates"
            className="hover:text-orange-500 transition duration-300"
          >
            Templates
          </a>

          <a
            href="#about"
            className="hover:text-orange-500 transition duration-300"
          >
            About
          </a>

        </nav>


        {/* Buttons */}
        <div className="flex items-center gap-5">

          <Link
            to="/login"
            className="text-gray-700 font-medium hover:text-orange-500 transition duration-300"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Get Started
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Navbar;