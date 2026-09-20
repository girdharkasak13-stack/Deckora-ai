import { motion } from "framer-motion";
import {
  Lightbulb,
  Sparkles,
  ScanSearch,
  Download,
} from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Describe Your Idea",
      description:
        "Tell Deckora your topic, audience, and presentation goal.",
      icon: Lightbulb,
      preview: "Your topic → AI understands your idea",
    },
    {
      number: "02",
      title: "Generate Your Deck",
      description:
        "Deckora turns your idea into a structured and engaging presentation.",
      icon: Sparkles,
      preview: "Generating slides... ✨",
    },
    {
      number: "03",
      title: "AI Review",
      description:
        "Detect grammar, readability, design, and consistency issues instantly.",
      icon: ScanSearch,
      preview: "AI Score 94%  •  3 suggestions",
    },
    {
      number: "04",
      title: "Perfect & Export",
      description:
        "Apply AI suggestions, polish your slides, and export your final deck.",
      icon: Download,
      preview: "Presentation ready ✓",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#FFF8F5] py-28"
    >
      {/* Background glow */}
      <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-500 shadow-sm">
            <Sparkles size={16} />
            How Deckora Works
          </span>

          <h2 className="mt-7 text-5xl md:text-6xl font-black tracking-tight text-[#111827]">
            From idea to{" "}
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              final deck.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            A simple AI-powered workflow that takes your presentation
            from a rough idea to a polished, presentation-ready deck.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20">

          {/* Connecting line */}
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 md:block" />

          <div className="grid gap-8 md:grid-cols-4">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >

                  {/* Number / Icon */}
                  <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 p-[2px] shadow-lg shadow-pink-200/50">
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
                      <Icon className="text-orange-500" size={28} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="mt-7 h-full rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-pink-200 hover:shadow-[0_20px_50px_rgba(236,72,153,0.12)]">

                    <div className="text-sm font-bold tracking-widest text-orange-500">
                      STEP {step.number}
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-[#111827]">
                      {step.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-600">
                      {step.description}
                    </p>

                    {/* Mini product preview */}
                    <div className="mt-7 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-orange-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-400" />
                        <span className="h-2 w-2 rounded-full bg-pink-400" />
                        <span className="h-2 w-2 rounded-full bg-purple-400" />
                      </div>

                      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500">
                          DECKORA AI
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          {step.preview}
                        </p>

                        <div className="mt-3 h-1.5 w-3/4 rounded-full bg-gradient-to-r from-orange-400 to-pink-400" />
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;