function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#FFF8F5] border-t border-orange-100">
      
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-pink-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-8 py-16">

        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                D
              </div>

              <div>
                <h1 className="text-2xl font-black text-[#171717]">
                  Deckora
                </h1>

                <p className="text-xs text-gray-500">
                  AI Presentation Workspace
                </p>
              </div>

            </div>

            <p className="text-gray-600 mt-5 leading-7">
              From your first idea to a polished presentation —
              create, review and perfect your decks with AI.
            </p>
          </div>


          {/* Product */}
          <div>
            <h3 className="text-[#171717] font-bold mb-5">
              Product
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li className="hover:text-orange-500 cursor-pointer transition">
                Features
              </li>

              <li className="hover:text-orange-500 cursor-pointer transition">
                Templates
              </li>

              <li className="hover:text-orange-500 cursor-pointer transition">
                How it works
              </li>
            </ul>
          </div>


          {/* Company */}
          <div>
            <h3 className="text-[#171717] font-bold mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li className="hover:text-orange-500 cursor-pointer transition">
                About
              </li>

              <li className="hover:text-orange-500 cursor-pointer transition">
                Privacy
              </li>

              <li className="hover:text-orange-500 cursor-pointer transition">
                Contact
              </li>
            </ul>
          </div>


          {/* CTA */}
          <div className="max-w-xs">
            <h3 className="text-[#171717] font-bold mb-3">
              Ready to create?
            </h3>

            <p className="text-gray-600 text-sm leading-6 mb-5">
              Turn your next idea into a presentation that stands out.
            </p>

            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold shadow-lg hover:scale-[1.03] transition">
              Create Your Deck →
            </button>
          </div>

        </div>


        {/* Bottom */}
        <div className="border-t border-gray-200 mt-14 pt-7 flex flex-col md:flex-row justify-between gap-3 text-sm text-gray-500">
          <p>
            © 2026 Deckora. All rights reserved.
          </p>

          <p>
            Built with AI ✦ Designed for better presentations.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;