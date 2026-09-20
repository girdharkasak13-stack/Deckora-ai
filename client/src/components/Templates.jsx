import { motion } from "framer-motion";
import {
  GraduationCap,
  BriefcaseBusiness,
  FlaskConical,
  Rocket,
} from "lucide-react";

function Templates() {
  const templates = [
    {
      title: "Academic",
      subtitle: "For seminars, projects & college presentations",
      icon: GraduationCap,
      gradient: "from-orange-400 to-pink-400",
      accent: "bg-orange-50",
      slides: [
        "Research Overview",
        "Key Findings",
        "Conclusion",
      ],
    },
    {
      title: "Business",
      subtitle: "For meetings, reports & business pitches",
      icon: BriefcaseBusiness,
      gradient: "from-pink-400 to-purple-400",
      accent: "bg-pink-50",
      slides: [
        "Business Strategy",
        "Market Insights",
        "Growth Plan",
      ],
    },
    {
      title: "Research",
      subtitle: "For papers, analysis & technical presentations",
      icon: FlaskConical,
      gradient: "from-purple-400 to-indigo-400",
      accent: "bg-purple-50",
      slides: [
        "Problem Statement",
        "Methodology",
        "Results & Analysis",
      ],
    },
    {
      title: "Pitch Deck",
      subtitle: "For startups, ideas & product pitches",
      icon: Rocket,
      gradient: "from-orange-400 to-red-400",
      accent: "bg-orange-50",
      slides: [
        "The Big Idea",
        "Market Opportunity",
        "Our Solution",
      ],
    },
  ];

  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#FFF8F5] py-28"
    >
      {/* Background glow */}
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-pink-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-500 shadow-sm">
            Presentation Templates
          </span>

          <h2 className="mt-7 text-5xl font-black tracking-tight text-[#111827] md:text-6xl">
            Start with a style.
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Make it yours.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Choose a presentation style and let Deckora help you turn
            your ideas into a polished deck.
          </p>

        </div>

        {/* Template cards */}
        <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-4">

          {templates.map((template, index) => {
            const Icon = template.icon;

            return (
              <motion.div
                key={template.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >

                {/* Preview */}
                <div
                  className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${template.gradient} p-2 shadow-lg transition-all duration-300 group-hover:shadow-2xl`}
                >
                  <div className="rounded-[22px] bg-white p-4">

                    {/* Browser dots */}
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-400" />
                      <span className="h-2 w-2 rounded-full bg-pink-400" />
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                    </div>

                    {/* Main slide */}
                    <div className={`mt-4 rounded-xl ${template.accent} p-5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                          <Icon size={19} className="text-orange-500" />
                        </div>

                        <span className="text-[10px] font-bold tracking-wider text-slate-400">
                          DECKORA AI
                        </span>
                      </div>

                      <h3 className="mt-6 text-lg font-black leading-tight text-slate-900">
                        {template.slides[0]}
                      </h3>

                      <div className="mt-3 h-2 w-24 rounded-full bg-gradient-to-r from-orange-400 to-pink-400" />

                      <div className="mt-5 space-y-2">
                        <div className="h-2 w-full rounded-full bg-slate-200" />
                        <div className="h-2 w-4/5 rounded-full bg-slate-200" />
                        <div className="h-2 w-3/5 rounded-full bg-slate-200" />
                      </div>
                    </div>

                    {/* Mini slides */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {template.slides.slice(1).map((slide) => (
                        <div
                          key={slide}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                        >
                          <div className="h-1.5 w-10 rounded-full bg-orange-300" />
                          <p className="mt-2 text-[9px] font-semibold leading-tight text-slate-600">
                            {slide}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Text */}
                <div className="px-2 pt-5">
                  <h3 className="text-xl font-bold text-[#111827]">
                    {template.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {template.subtitle}
                  </p>

                  <div className="mt-4 text-sm font-semibold text-orange-500 transition group-hover:text-pink-500">
                    Explore template →
                  </div>
                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Templates;