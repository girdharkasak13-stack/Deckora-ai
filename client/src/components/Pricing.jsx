function Pricing() {
  return (
    <section className="py-24 px-8 bg-[#0B1020]">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-semibold mb-5">
            ✦ How Deckora Works
          </span>

          <h2 className="text-5xl font-bold text-white">
            From Idea to Final Deck
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto text-lg">
            Create, review, and perfect your presentations with an
            AI-powered workflow built for speed and quality.
          </p>
        </div>

        {/* Workflow */}
        <div className="grid md:grid-cols-4 gap-6">

          {/* Step 1 */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] hover:border-cyan-400/30 transition duration-300">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-lg mb-6">
              01
            </div>

            <h3 className="text-xl font-bold text-white">
              Describe Your Idea
            </h3>

            <p className="text-gray-400 mt-3 leading-relaxed">
              Tell Deckora your topic, audience, and presentation goal.
            </p>

          </div>

          {/* Step 2 */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] hover:border-cyan-400/30 transition duration-300">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-lg mb-6">
              02
            </div>

            <h3 className="text-xl font-bold text-white">
              Generate Your Deck
            </h3>

            <p className="text-gray-400 mt-3 leading-relaxed">
              Deckora AI turns your idea into a structured and engaging presentation.
            </p>

          </div>

          {/* Step 3 */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] hover:border-cyan-400/30 transition duration-300">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-lg mb-6">
              03
            </div>

            <h3 className="text-xl font-bold text-white">
              AI Review
            </h3>

            <p className="text-gray-400 mt-3 leading-relaxed">
              Detect grammar, readability, design, and consistency issues instantly.
            </p>

          </div>

          {/* Step 4 */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] hover:border-cyan-400/30 transition duration-300">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-lg mb-6">
              04
            </div>

            <h3 className="text-xl font-bold text-white">
              Perfect & Export
            </h3>

            <p className="text-gray-400 mt-3 leading-relaxed">
              Apply AI suggestions, polish your slides, and export your final deck.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Pricing;