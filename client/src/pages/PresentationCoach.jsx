import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkle,
  PresentationChart,
  Microphone,
  Clock,
  Lightbulb,
  Eye,
} from "@phosphor-icons/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { postJson } from "../api";

const cleanText = (text = "") =>
  text
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/---+/g, "")
    .replace(/^\s*[-*]\s?/gm, "")
    .trim();

function PresentationCoach() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    const fetchPresentations = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, "presentations"),
          where("userId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        setPresentations(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      } catch (error) {
        console.error("Failed to load presentations:", error);
      }
    };

    fetchPresentations();
  }, []);

  const generateScript = async () => {
    if (!content.trim()) {
      alert("Please select or paste your presentation content first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const data = await postJson("/api/coach", { content });
      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to generate presentation script.");
    } finally {
      setLoading(false);
    }
  };

  const slides = result
    ? result
        .split(/(?=#+\s*SLIDE\s*\d+\s*:|SLIDE\s*\d+\s*:)/i)
        .filter((s) => s.trim())
        .map((slide, index) => {
          const clean = cleanText(slide);

          const title =
            clean.match(/SLIDE\s*\d+\s*:\s*(.*)/i)?.[1]?.trim() ||
            `Slide ${index + 1}`;

          const script =
            clean.match(
              /SPEAKING SCRIPT\s*:?\s*([\s\S]*?)(?=TIMING\s*:|PRESENTATION TIP\s*:|SLIDE\s*\d+\s*:|$)/i
            )?.[1]?.trim() || "";

          const timing =
            clean.match(
              /TIMING\s*:?\s*([\s\S]*?)(?=PRESENTATION TIP\s*:|SLIDE\s*\d+\s*:|$)/i
            )?.[1]?.trim() || "";

          const tip =
            clean.match(
              /PRESENTATION TIP\s*:?\s*([\s\S]*?)(?=SLIDE\s*\d+\s*:|$)/i
            )?.[1]?.trim() || "";

          return { title, script, timing, tip };
        })
    : [];

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#111827] p-8 md:p-10">

      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm">
          <Sparkle size={18} weight="fill" className="text-orange-500" />
          <span className="text-sm font-semibold text-gray-700">
            AI Presentation Coach
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5">
          Present With Confidence 🎤
        </h1>

        <p className="text-gray-500 mt-3 text-base md:text-lg max-w-2xl">
          Let Gemini create a speaking script and coaching tips for every
          slide of your presentation.
        </p>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Microphone size={26} weight="fill" className="text-orange-500" />
          </div>

          <h3 className="font-bold text-lg mt-4">Speaking Script</h3>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            Get natural words to say instead of reading your slides.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Clock size={26} weight="fill" className="text-purple-500" />
          </div>

          <h3 className="font-bold text-lg mt-4">Timing Guidance</h3>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            Know how much time you should spend on each slide.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl p-6 border border-cyan-100 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
            <Lightbulb size={26} weight="fill" className="text-cyan-500" />
          </div>

          <h3 className="font-bold text-lg mt-4">Presentation Tips</h3>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            Get AI suggestions on what to emphasize and how to deliver it.
          </p>
        </motion.div>

      </div>

      {/* INPUT */}
      <div className="mt-8 bg-white rounded-3xl border border-orange-100 shadow-sm p-7">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <PresentationChart size={23} weight="fill" className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold">Your Presentation</h2>
            <p className="text-sm text-gray-500">
              Select a saved presentation or paste your own content.
            </p>
          </div>
        </div>

        <select
          onChange={(e) => {
            const selected = presentations.find(
              (item) => item.id === e.target.value
            );

            if (selected) {
              setContent(cleanText(selected.content || ""));
              setResult("");
            }
          }}
          className="w-full mt-6 rounded-2xl border border-gray-200 p-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm"
        >
          <option value="">
            Select a saved presentation (optional)
          </option>

          {presentations.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setResult("");
          }}
          placeholder={`Paste your presentation content here...

Example:

SLIDE 1: Introduction to Artificial Intelligence

CONTENT:

- What is AI?
- Brief history of AI
- How AI is changing our world

SLIDE 2: How AI Works
...`}
          className="w-full min-h-[260px] rounded-2xl border border-gray-200 p-5 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none text-sm leading-6"
        />

        <div className="flex justify-end mt-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateScript}
            disabled={loading}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-semibold shadow-lg disabled:opacity-60"
          >
            {loading ? (
              "Generating..."
            ) : (
              <span className="inline-flex items-center gap-2">
                <Sparkle size={19} weight="fill" />
                Generate Presentation Script
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Eye size={23} weight="fill" className="text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Your AI Presentation Coach
              </h2>

              <p className="text-sm text-gray-500">
                Here's how you can present your deck more confidently.
              </p>
            </div>
          </div>

          {/* SLIDE CARDS */}
          <div className="space-y-6">

            {slides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-orange-100 shadow-sm p-7"
              >

                {/* Slide */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-bold text-orange-600">
                    {slide.title}
                  </h3>
                </div>

                {/* Speaking Script */}
                {slide.script && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Microphone
                        size={22}
                        className="text-purple-600"
                      />

                      <h4 className="font-bold text-purple-600">
                        Speaking Script
                      </h4>
                    </div>

                    <p className="text-base leading-7 text-gray-700">
                      {slide.script}
                    </p>
                  </div>
                )}

                {/* Timing */}
                {slide.timing && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock
                        size={22}
                        className="text-blue-600"
                      />

                      <h4 className="font-bold text-blue-600">
                        Timing
                      </h4>
                    </div>

                    <p className="text-base leading-7 text-gray-700">
                      {slide.timing}
                    </p>
                  </div>
                )}

                {/* Tip */}
                {slide.tip && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb
                        size={22}
                        className="text-orange-600"
                      />

                      <h4 className="font-bold text-orange-600">
                        Presentation Tip
                      </h4>
                    </div>

                    <p className="text-base leading-7 text-gray-700">
                      {slide.tip}
                    </p>
                  </div>
                )}

              </motion.div>
            ))}

          </div>
        </motion.div>
      )}

    </div>
  );
}

export default PresentationCoach;