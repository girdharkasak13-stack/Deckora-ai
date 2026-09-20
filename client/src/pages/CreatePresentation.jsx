import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { postJson } from "../api";
import { countSlides } from "../utils/presentation";

function CreatePresentation() {
  const [selectedType, setSelectedType] = useState("Topic");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState(10);
  const [theme, setTheme] = useState("Modern");
  const [language, setLanguage] = useState("English");
  const [audience, setAudience] = useState("Students");
  const [tone, setTone] = useState("Professional");

  const handleGenerate = async () => {
    if (loading) return;

    if (!topic.trim()) {
      alert("Please enter a presentation topic.");
      return;
    }

    if (!auth.currentUser) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);

      // Ask Gemini (via the backend) to generate the presentation content
      const data = await postJson("/api/generate", {
        topic: topic.trim(),
        slides: Number(slides),
        audience,
        tone,
        language,
      });

      // Save presentation + AI content in Firestore
      await addDoc(collection(db, "presentations"), {
        userId: auth.currentUser.uid,
        title: topic.trim().slice(0, 200),
        theme,
        slides: countSlides(data.result) || Number(slides),
        language,
        audience,
        tone,
        content: data.result,
        createdAt: serverTimestamp(),
      });

      alert("Presentation generated and saved successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#111827] p-8 md:p-10">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#111827]">
          Create Presentation
        </h1>

        <p className="text-gray-500 mt-2">
          Generate professional presentations using AI.
        </p>
      </div>

      {/* Input Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        {[
          {
            icon: <Sparkles size={42} />,
            title: "Topic",
            desc: "Generate presentation from a topic",
            type: "Topic",
          },
          {
            icon: <FileText size={42} />,
            title: "PDF",
            desc: "Convert PDF into beautiful slides",
            type: "PDF",
          },
          {
            icon: <FileSpreadsheet size={42} />,
            title: "DOCX",
            desc: "Convert Word document into presentation",
            type: "DOCX",
          },
        ].map((item, index) => (

          <motion.div
            key={index}
            onClick={() => setSelectedType(item.type)}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className={
              selectedType === item.type
                ? "cursor-pointer rounded-3xl border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 p-8 shadow-lg"
                : "cursor-pointer rounded-3xl border border-orange-100 bg-white p-8 shadow-sm hover:border-orange-300 hover:shadow-lg"
            }
          >

            <div className="text-[#8B5CF6]">
              {item.icon}
            </div>

            <h2 className="text-2xl font-bold text-[#111827] mt-5">
              {item.title}
            </h2>

            <p className="text-gray-500 mt-3">
              {item.desc}
            </p>

          </motion.div>

        ))}

      </div>

      {/* Main Form */}
      <div className="mt-10 bg-white border border-orange-100 rounded-3xl p-8 md:p-10 shadow-[0_10px_35px_rgba(30,41,59,0.08)]">

        {/* Topic */}
        <label className="block mb-3 font-medium text-[#111827]">
          Presentation Topic
        </label>

        <input
          type="text"
          placeholder="Enter your topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-[#F8F9FC] rounded-2xl p-5 outline-none border border-gray-200 focus:border-[#8B5CF6] focus:ring-2 focus:ring-purple-100 transition-all text-[#111827] placeholder:text-gray-400"
        />

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div>
            <label className="font-medium text-[#111827]">
              Slides
            </label>

            <select
              value={slides}
              onChange={(e) => setSlides(e.target.value)}
              className="w-full mt-2 bg-[#F8F9FC] border border-gray-200 rounded-xl p-4 text-[#111827] outline-none focus:border-[#8B5CF6] transition-all"
            >
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-[#111827]">
              Theme
            </label>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full mt-2 bg-[#F8F9FC] border border-gray-200 rounded-xl p-4 text-[#111827] outline-none focus:border-[#8B5CF6] transition-all"
            >
              <option>Modern</option>
              <option>Minimal</option>
              <option>Business</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-[#111827]">
              Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-2 bg-[#F8F9FC] border border-gray-200 rounded-xl p-4 text-[#111827] outline-none focus:border-[#8B5CF6] transition-all"
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div>
            <label className="font-medium text-[#111827]">
              Audience
            </label>

            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full mt-2 bg-[#F8F9FC] rounded-xl p-4 border border-gray-200 text-[#111827] outline-none focus:border-[#8B5CF6] transition-all"
            >
              <option>Students</option>
              <option>Teachers</option>
              <option>Business</option>
              <option>Investors</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-[#111827]">
              Tone
            </label>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full mt-2 bg-[#F8F9FC] rounded-xl p-4 border border-gray-200 text-[#111827] outline-none focus:border-[#8B5CF6] transition-all"
            >
              <option>Professional</option>
              <option>Creative</option>
              <option>Academic</option>
              <option>Casual</option>
            </select>
          </div>

        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleGenerate}
          disabled={loading}
          className="mt-10 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#6D5DF6] via-[#8B5CF6] to-[#22D3EE] text-white font-semibold text-lg shadow-[0_8px_25px_rgba(109,93,246,0.30)] disabled:opacity-70"
        >
          {loading ? "⏳ Generating..." : "✨ Generate Presentation"}
        </motion.button>

        <p className="text-gray-500 mt-4 text-sm">
          AI will generate an outline, content, design suggestions and an
          editable PowerPoint presentation.
        </p>

        {/* AI Generation Progress */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-100 p-6"
          >
            <h3 className="font-bold text-[#111827] mb-4">
              ✨ Creating your presentation
            </h3>

            <div className="space-y-3 text-gray-600">
              <p>🧠 Understanding Topic...</p>
              <p>📝 Creating Outline...</p>
              <p>🎨 Designing Slides...</p>
              <p>⚡ Finalizing Presentation...</p>
            </div>
          </motion.div>
        )}

        {/* AI Preview */}
        {!loading && (
          <div className="mt-8 rounded-2xl bg-[#FFFCFA] border border-orange-100 p-6">

            <h3 className="text-lg font-bold text-[#111827]">
              AI Preview
            </h3>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 text-sm">

              <p>
                📑 Estimated Slides:
                <span className="font-semibold text-[#111827] ml-1">
                  {slides}
                </span>
              </p>

              <p>
                🎨 Theme:
                <span className="font-semibold text-[#111827] ml-1">
                  {theme}
                </span>
              </p>

              <p>
                🌐 Language:
                <span className="font-semibold text-[#111827] ml-1">
                  {language}
                </span>
              </p>

              <p>
                👥 Audience:
                <span className="font-semibold text-[#111827] ml-1">
                  {audience}
                </span>
              </p>

              <p>
                🎤 Tone:
                <span className="font-semibold text-[#111827] ml-1">
                  {tone}
                </span>
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default CreatePresentation;