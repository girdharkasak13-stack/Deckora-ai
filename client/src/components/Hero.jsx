import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
   const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3);
    }, 2500);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fff8f5] pt-28">

      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute top-20 right-[-180px] w-[500px] h-[500px] rounded-full bg-pink-200/40 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 shadow-sm text-orange-600 font-medium mb-7">
              <Sparkles size={16} />
              AI-Powered Presentation Workspace
            </div>

            {/* Heading */}
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-[#171717]">
              Turn your ideas
              <br />
              into
              <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                stunning decks.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 text-xl leading-8 text-gray-600 max-w-xl">
              Create, review and perfect professional presentations with
              AI — from your first idea to your final deck.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-9">

              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.03] transition"
              >
                Create Your Deck

                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition"
                />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 font-semibold text-lg hover:bg-gray-50 transition"
              >
                <Play size={18} />
                See how it works
              </button>

            </div>

            {/* Small highlights */}
            <div className="flex flex-wrap gap-8 mt-9 text-sm text-gray-500">
              <span>✦ AI Generation</span>
              <span>✦ AI Review</span>
              <span>✦ Smart Export</span>
            </div>

          </motion.div>
          
          {/* RIGHT SIDE — LIVE PRODUCT DEMO */}
<motion.div
  initial={{ opacity: 0, x: 50, scale: 0.95 }}
  animate={{ opacity: 1, x: 0, scale: 1 }}
  transition={{ duration: 0.8 }}
  className="relative"
>
  <div className="relative rounded-[2.5rem] p-5 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 shadow-2xl">

    <div className="bg-[#18181b] rounded-[1.8rem] overflow-hidden shadow-2xl">

      {/* Browser bar */}
      <div className="flex items-center gap-2 px-5 py-4 bg-[#242428]">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-5 h-7 flex-1 rounded-lg bg-white/5" />
      </div>

      <div className="p-6 bg-[#111114] min-h-[470px]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-400 text-xs">DECKORA AI</p>

            <AnimatePresence mode="wait">
              <motion.h3
                key={demoStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-white text-xl font-bold"
              >
                {demoStep === 0 && "Create Your Presentation"}
                {demoStep === 1 && "AI Presentation Review"}
                {demoStep === 2 && "Optimize Your Deck"}
              </motion.h3>
            </AnimatePresence>
          </div>

          <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs">
            AI Ready
          </span>
        </div>

        {/* Animated content */}
        <AnimatePresence mode="wait">

          {/* CREATE */}
          {demoStep === 0 && (
            <motion.div
              key="create"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-7 aspect-[16/10]"
            >
              <div className="h-full rounded-xl bg-white p-7">
                <p className="text-xs font-bold text-orange-500">
                  CREATE WITH AI
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-4">
                  Turn your idea
                  <br />
                  into a presentation
                </h2>

                <p className="text-gray-500 text-sm mt-4">
                  Describe your topic, audience and goal.
                </p>

                <div className="mt-8 flex gap-2">
                  <div className="h-2 w-24 rounded-full bg-orange-400" />
                  <div className="h-2 w-14 rounded-full bg-pink-400" />
                  <div className="h-2 w-10 rounded-full bg-purple-400" />
                </div>
              </div>
            </motion.div>
          )}

          {/* REVIEW */}
          {demoStep === 1 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-white p-7 aspect-[16/10]"
            >
              <p className="text-xs font-bold text-orange-500">
                AI ANALYSIS
              </p>

              <div className="flex items-center gap-5 mt-5">
                <div className="w-24 h-24 rounded-full border-8 border-orange-400 flex items-center justify-center">
                  <span className="text-2xl font-black text-gray-900">
                    94%
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Great presentation!
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    3 improvements found
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <div className="h-3 rounded-full bg-orange-100" />
                <div className="h-3 rounded-full bg-pink-100 w-4/5" />
                <div className="h-3 rounded-full bg-purple-100 w-3/5" />
              </div>
            </motion.div>
          )}

          {/* OPTIMIZE */}
          {demoStep === 2 && (
            <motion.div
              key="optimize"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-gradient-to-br from-purple-500 via-pink-400 to-orange-400 p-7 aspect-[16/10]"
            >
              <div className="h-full rounded-xl bg-white p-7">
                <p className="text-xs font-bold text-pink-500">
                  AI OPTIMIZATION
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-4">
                  Your deck is
                  <br />
                  ready to shine ✨
                </h2>

                <p className="text-gray-500 text-sm mt-4">
                  Design, readability and consistency optimized.
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />

                  <span className="text-sm font-bold text-gray-900">
                    Ready
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Bottom controls */}
        <div className="flex justify-between items-center mt-5">

          <div className="flex gap-2">
            {[0, 1, 2].map((step) => (
              <button
                key={step}
                onClick={() => setDemoStep(step)}
                className={`w-12 h-8 rounded-lg transition ${
                  demoStep === step
                    ? "bg-gradient-to-r from-orange-500 to-pink-500"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold">
            {demoStep === 0 && "Generate with AI"}
            {demoStep === 1 && "Review Presentation"}
            {demoStep === 2 && "Improve with AI"}
          </button>

        </div>

      </div>
    </div>

    {/* Floating score */}
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute -bottom-7 -left-8 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white">
          <Sparkles size={18} />
        </div>

        <div>
          <p className="text-xs text-gray-500">
            AI Analysis
          </p>

          <p className="font-bold text-gray-900">
            94% Presentation Score
          </p>
        </div>
      </div>
    </motion.div>

  </div>
</motion.div>

          
                

        </div>

      </div>

    </section>
  );
}

export default Hero;