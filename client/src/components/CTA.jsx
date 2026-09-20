import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#FFF8F5] py-28">
      
      {/* Background glows */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl" />

      <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />

      <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 px-8 py-20 text-center shadow-2xl md:px-16"
        >

          {/* Decorative glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">

            {/* Badge */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <Sparkles size={16} />
              READY WHEN YOU ARE
            </div>

            {/* Heading */}
            <h2 className="mx-auto mt-7 max-w-3xl text-5xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Your next great deck
              <br />
              starts here.
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Turn your ideas into polished, professional presentations
              with the power of AI.
            </p>

            {/* CTA button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-orange-600 shadow-xl transition hover:shadow-2xl"
            >
              Create Your Deck

              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>

            {/* Small note */}
            <p className="mt-5 text-sm text-white/70">
              Create. Review. Optimize. Present with confidence.
            </p>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default CTA;