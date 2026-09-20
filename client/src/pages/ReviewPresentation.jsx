import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { postJson } from "../api";
import {
  countSlides,
  countWords,
  readingMinutes,
  scoreLabel,
} from "../utils/presentation";
import {
  Sparkles,
  CheckCircle2,
  Palette,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

function ReviewPresentation() {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [review, setReview] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | analyzing | ready | error
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadReview = async () => {
      try {
        const snapshot = await getDoc(doc(db, "presentations", id));

        if (!snapshot.exists()) {
          throw new Error("Presentation not found.");
        }

        const data = snapshot.data();
        if (cancelled) return;
        setPresentation(data);

        // Reuse the saved AI review so Gemini is only called once per version.
        if (data.review) {
          setReview(data.review);
          setStatus("ready");
          return;
        }

        setStatus("analyzing");
        const result = await postJson("/api/review", { content: data.content });
        if (cancelled) return;

        setReview(result);
        setStatus("ready");

        // Saving is best-effort: the review is already on screen.
        updateDoc(doc(db, "presentations", id), {
          review: { ...result, reviewedAt: serverTimestamp() },
        }).catch((saveError) => console.error("Could not save review:", saveError));
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError(
          err.code === "permission-denied"
            ? "Presentation not found or you don't have access to it."
            : err.message || "AI review failed."
        );
        setStatus("error");
      }
    };

    loadReview();

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const retry = () => {
    setStatus("loading");
    setError("");
    setAttempt((value) => value + 1);
  };

  const ready = status === "ready" && review;
  const label = ready ? scoreLabel(review.score) : null;

  const suggestions = ready ? review.suggestions || [] : [];
  const performance = [
    ["Grammar", ready ? review.grammar : null],
    ["Design", ready ? review.design : null],
    ["Readability", ready ? review.readability : null],
    ["Structure", ready ? review.structure : null],
  ];
  const showValue = (value) => (value === null ? "--" : `${value}%`);

  const content = presentation?.content || "";
  const slideCount = countSlides(content);
  const wordCount = countWords(content);
  const readingTime = readingMinutes(wordCount);
  const wordsPerSlide = slideCount ? Math.round(wordCount / slideCount) : 0;

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#111827] p-8 md:p-10">

      {/* Heading */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          AI Presentation Review
        </h1>

        <p className="text-[#6B7280] mt-3 text-base md:text-lg">
          AI analyzes your presentation and provides actionable insights.
        </p>
        {presentation && (
  <div className="mt-8 rounded-3xl bg-white border border-orange-100 p-7 shadow-sm">
    <h2 className="text-2xl font-bold">
      {presentation.title}
    </h2>

    <p className="text-gray-500 mt-2">
      AI Generated Content
    </p>

    <div className="mt-5 whitespace-pre-wrap text-gray-700 leading-7">
  {content
    .replace(/###/g, "")
    .replace(/\*\*/g, "")
    .replace(/^---$/gm, "")
    .replace(/^\s*[-*]\s*/gm, "• ")}
</div>
  </div>
)}
      </div>

      {/* Score Hero */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="
          mt-10
          rounded-3xl
          bg-white
          border border-[#F4D7C5]
          p-8 md:p-10
          shadow-[0_10px_35px_rgba(0,0,0,0.05)]
          relative overflow-hidden
        "
      >
        {/* Soft gradient decoration */}
        <div className="
          absolute -right-20 -top-20
          w-56 h-56
          rounded-full
          bg-gradient-to-br from-[#E9D5FF] to-[#CFFAFE]
          opacity-60 blur-3xl
        " />

        <div className="relative flex items-center justify-between">

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#6B7280]">
                Overall AI Score
              </span>

              <span className={`
                px-3 py-1
                rounded-full
                text-xs font-semibold
                ${label ? label.badge : "bg-[#F3EEFF] text-[#7C3AED]"}
              `}>
                {label
                  ? label.label
                  : status === "error"
                  ? "Unavailable"
                  : "Analyzing..."}
              </span>
            </div>

            <h2 className="text-6xl md:text-7xl font-extrabold mt-3">
              <span className="bg-gradient-to-r from-[#6D5DF6] to-[#22D3EE] bg-clip-text text-transparent">
                {ready ? review.score : "--"}
              </span>

              <span className="text-2xl md:text-3xl text-[#9CA3AF] font-semibold">
                /100
              </span>
            </h2>

            {ready ? (
              <p className={`${label.text} font-medium mt-3`}>
                {label.message}
              </p>
            ) : status === "error" ? (
              <div className="mt-3">
                <p className="text-[#DC2626] font-medium">{error}</p>
                <button
                  onClick={retry}
                  className="mt-2 text-sm font-semibold text-[#6D5DF6] underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <p className="text-[#7C3AED] font-medium mt-3">
                Gemini is reviewing your presentation...
              </p>
            )}
          </div>

          {/* Score Icon */}
          <div className="
            hidden sm:flex
            w-28 h-28 md:w-32 md:h-32
            rounded-full
            bg-gradient-to-br from-[#6D5DF6] to-[#22D3EE]
            p-[5px]
            shadow-[0_10px_30px_rgba(109,93,246,0.22)]
          ">
            <div className="
              w-full h-full
              rounded-full
              bg-white
              flex items-center justify-center
            ">
              <Sparkles
                size={48}
                className="text-[#7C3AED]"
              />
            </div>
          </div>

        </div>
      </motion.div>

      {/* Suggestions + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* AI Suggestions */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="
            rounded-3xl
            bg-white
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <div className="flex items-center gap-3">
            <div className="
              w-11 h-11
              rounded-2xl
              bg-[#FFF1E8]
              flex items-center justify-center
            ">
              <span className="text-xl">💡</span>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                AI Suggestions
              </h2>

              <p className="text-sm text-[#9CA3AF] mt-1">
                Recommended improvements
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {!ready && (
              <p className="text-sm text-[#9CA3AF]">
                {status === "error"
                  ? "Suggestions are unavailable."
                  : "Waiting for the AI review..."}
              </p>
            )}
            {suggestions.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="
                  flex items-center gap-3
                  bg-[#FFF8F5]
                  border border-[#F7E5D9]
                  rounded-2xl
                  p-4
                  transition-all
                "
              >
                <CheckCircle2
                  size={20}
                  className="text-[#10B981] shrink-0"
                />

                <span className="text-sm font-medium text-[#374151]">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="
            rounded-3xl
            bg-white
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <div className="flex items-center gap-3">
            <div className="
              w-11 h-11
              rounded-2xl
              bg-[#E8FAFF]
              flex items-center justify-center
            ">
              <span className="text-xl">📊</span>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Performance
              </h2>

              <p className="text-sm text-[#9CA3AF] mt-1">
                Presentation quality breakdown
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-6">
            {performance.map((item, index) => (
              <div key={index}>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#374151]">
                    {item[0]}
                  </span>

                  <span className="text-sm font-bold text-[#6D5DF6]">
                    {showValue(item[1])}
                  </span>
                </div>

                <div className="
                  h-3
                  bg-[#F3F4F6]
                  rounded-full
                  mt-2
                  overflow-hidden
                ">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item[1] ?? 0}%` }}
                    transition={{
                      duration: 0.9,
                      delay: index * 0.1,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-[#6D5DF6]
                      via-[#8B5CF6]
                      to-[#22D3EE]
                    "
                  />
                </div>

              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Improve Button */}
      <motion.button
        whileHover={{
          scale: 1.02,
          y: -2,
        }}
        whileTap={{ scale: 0.98 }}
        className="
          mt-8
          w-full
          rounded-2xl
          py-5
          text-lg
          font-bold
          text-white
          bg-gradient-to-r
          from-[#6D5DF6]
          via-[#8B5CF6]
          to-[#22D3EE]
          shadow-[0_10px_30px_rgba(109,93,246,0.25)]
          transition-all
        "
      >
        ✨ Improve Presentation with AI
      </motion.button>

      {/* AI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {/* Slides */}
        <motion.div
          whileHover={{ y: -5 }}
          className="
            bg-white
            rounded-3xl
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <p className="text-sm font-medium text-[#9CA3AF]">
            Slides
          </p>

          <h3 className="text-4xl font-extrabold mt-3">
            {slideCount}
          </h3>

          <p className="text-[#10B981] text-sm font-semibold mt-2">
            ~{wordsPerSlide} words per slide
          </p>
        </motion.div>

        {/* Reading Time */}
        <motion.div
          whileHover={{ y: -5 }}
          className="
            bg-white
            rounded-3xl
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <p className="text-sm font-medium text-[#9CA3AF]">
            Reading Time
          </p>

          <h3 className="text-4xl font-extrabold mt-3">
            {readingTime} min
          </h3>

          <p className="text-[#7C3AED] text-sm font-semibold mt-2">
            {wordCount} words
          </p>
        </motion.div>

      </div>

      {/* Quality Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {/* Grammar */}
        <motion.div
          whileHover={{ y: -5 }}
          className="
            bg-white
            rounded-3xl
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <CheckCircle2
            className="text-[#10B981]"
            size={32}
          />

          <h3 className="text-xl font-bold mt-4">
            Grammar
          </h3>

          <p className="text-[#6B7280] mt-2">
            {showValue(performance[0][1])} Accuracy
          </p>
        </motion.div>

        {/* Design */}
        <motion.div
          whileHover={{ y: -5 }}
          className="
            bg-white
            rounded-3xl
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <Palette
            className="text-[#06B6D4]"
            size={32}
          />

          <h3 className="text-xl font-bold mt-4">
            Design
          </h3>

          <p className="text-[#6B7280] mt-2">
            {showValue(performance[1][1])} Score
          </p>
        </motion.div>

        {/* Readability */}
        <motion.div
          whileHover={{ y: -5 }}
          className="
            bg-white
            rounded-3xl
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <BookOpen
            className="text-[#F59E0B]"
            size={32}
          />

          <h3 className="text-xl font-bold mt-4">
            Readability
          </h3>

          <p className="text-[#6B7280] mt-2">
            {showValue(performance[2][1])} Score
          </p>
        </motion.div>

        {/* Structure */}
        <motion.div
          whileHover={{ y: -5 }}
          className="
            bg-white
            rounded-3xl
            border border-[#F4D7C5]
            p-7
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
          "
        >
          <LayoutDashboard
            className="text-[#8B5CF6]"
            size={32}
          />

          <h3 className="text-xl font-bold mt-4">
            Structure
          </h3>

          <p className="text-[#6B7280] mt-2">
            {showValue(performance[3][1])} Score
          </p>
        </motion.div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#9CA3AF] mt-10 pb-4">
        Powered by Deckora AI • Smart Analysis • AI Presentation Assistant
      </div>

    </div>
  );
}

export default ReviewPresentation;