import { motion } from "framer-motion";
import {
  Sparkles,
  ScanSearch,
  WandSparkles,
  FileUp,
  Presentation,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Presentation Generation",
    description:
      "Turn a simple topic or idea into a structured, engaging presentation in seconds.",
  },
  {
    icon: ScanSearch,
    title: "AI-Powered Review",
    description:
      "Analyze your slides for grammar, readability, design and content issues.",
  },
  {
    icon: WandSparkles,
    title: "Smart Optimization",
    description:
      "Get intelligent suggestions to improve your slides before you present.",
  },
  {
    icon: FileUp,
    title: "Easy File Upload",
    description:
      "Bring your existing presentations and documents into your Deckora workspace.",
  },
  {
    icon: Presentation,
    title: "Professional Export",
    description:
      "Turn your finished work into presentation-ready files with ease.",
  },
  {
    icon: BarChart3,
    title: "Presentation Score",
    description:
      "Understand the quality of your deck with an AI-generated score and insights.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#fff8f5] py-28"
    >
      {/* Background glow */}
      <div className="absolute top-20 left-[-200px] w-[400px] h-[400px] rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Everything in one workspace
          </p>

          <h2 className="mt-4 text-5xl md:text-6xl font-black text-[#171717] leading-tight">
            Everything you need to
            <span className="block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              build better decks.
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl leading-8">
            From your first idea to the final presentation, Deckora helps
            you create, review and improve your work in one place.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl bg-white border border-orange-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center mb-7 group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    size={26}
                    className="text-orange-500"
                  />
                </div>

                <h3 className="text-2xl font-bold text-[#171717]">
                  {feature.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-7">
                  {feature.description}
                </p>

                {/* Small accent */}
                <div className="mt-7 h-1 w-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 group-hover:w-16 transition-all duration-300" />

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Features;