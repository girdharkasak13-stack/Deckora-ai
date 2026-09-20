import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";
import { postForm } from "../api";

const ALLOWED_EXTENSIONS = ["pptx", "pdf", "docx"];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function UploadPresentation() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    e.target.value = ""; // lets the user pick the same file again
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      alert("Unsupported file type. Please upload a .pptx, .pdf or .docx file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File is too large. The maximum size is 20MB.");
      return;
    }

    setFile(selectedFile);
    setAnalysis("");
  };

  const handleAnalyze = async () => {
    if (!file || analyzing) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setAnalyzing(true);
      setAnalysis("");

      const data = await postForm("/api/upload", formData);
      setAnalysis(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message || "File upload failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#111827] p-8 md:p-10">

      {/* Heading */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Upload Presentation
        </h1>

        <p className="text-[#6B7280] mt-3 text-base md:text-lg">
          Upload your PPT, PDF or DOCX and let AI review & optimize it.
        </p>
      </div>

      {/* Upload Box */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="
          mt-10
          rounded-3xl
          border-2 border-dashed border-[#F4B183]
          bg-white
          p-12 md:p-20
          text-center
          shadow-[0_10px_35px_rgba(255,140,80,0.08)]
          hover:border-[#FF7A18]
          hover:shadow-[0_15px_45px_rgba(255,140,80,0.15)]
          transition-all duration-300
        "
      >

        {/* Upload Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-[#6D5DF6] to-[#22D3EE] flex items-center justify-center shadow-lg">
          <Upload
            size={40}
            className="text-white"
          />
        </div>

        <h2 className="text-3xl font-bold mt-7 text-[#111827]">
          Drag & Drop Files
        </h2>

        <p className="text-[#6B7280] mt-3 text-base">
          Supports PPTX, PDF and DOCX
        </p>
<input
  ref={fileInputRef}
  type="file"
  accept=".pptx,.pdf,.docx"
  className="hidden"
  onChange={handleFileChange}
/>

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.96 }}
  onClick={() => fileInputRef.current.click()}
  className="
    mt-7
    px-9 py-4
    rounded-2xl
    bg-gradient-to-r from-[#6D5DF6] via-[#8B5CF6] to-[#22D3EE]
    text-white
    font-semibold
    shadow-[0_8px_25px_rgba(109,93,246,0.25)]
    transition-all
  "
>
  Browse Files
</motion.button>
 {file && (
  <p className="mt-5 text-sm text-[#6B7280]">
    Selected: <span className="font-semibold text-[#111827]">{file.name}</span>
  </p>
)}
 {file && (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.96 }}
    onClick={handleAnalyze}
    disabled={analyzing}
    className="mt-5 px-8 py-3 rounded-xl bg-green-500 text-white font-semibold disabled:opacity-60"
  >
    {analyzing ? "Analyzing..." : "Analyze with AI"}
  </motion.button>
)}
{analysis && (
  <div className="mt-8 p-6 bg-white rounded-2xl text-left">
    <h3 className="text-2xl font-bold mb-4">
      AI Analysis
    </h3>

    <p className="whitespace-pre-line text-gray-700">
  {analysis
    .replace(/###/g, "")
    .replace(/\*\*/g, "")
    .replace(/^---+$/gm, "")
    .replace(/^\s*\*\s*/gm, "• ")
}
</p>
  </div>
)}

        <p className="text-xs text-[#9CA3AF] mt-4">
          Maximum file size supported: 20MB
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        {/* PPTX */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="
            bg-white
            rounded-3xl
            p-7
            border border-[#F4D7C5]
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
            hover:border-[#FFB067]
            hover:shadow-[0_12px_30px_rgba(255,140,80,0.12)]
            transition-all
          "
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] flex items-center justify-center">
            <FileText
              className="text-[#FF7A18]"
              size={27}
            />
          </div>

          <h3 className="mt-5 font-bold text-xl text-[#111827]">
            PPTX
          </h3>

          <p className="text-[#6B7280] text-sm mt-2 leading-6">
            Upload PowerPoint presentations instantly.
          </p>
        </motion.div>

        {/* PDF */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="
            bg-white
            rounded-3xl
            p-7
            border border-[#F4D7C5]
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
            hover:border-[#FFB067]
            hover:shadow-[0_12px_30px_rgba(255,140,80,0.12)]
            transition-all
          "
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F3EEFF] flex items-center justify-center">
            <FileText
              className="text-[#8B5CF6]"
              size={27}
            />
          </div>

          <h3 className="mt-5 font-bold text-xl text-[#111827]">
            PDF
          </h3>

          <p className="text-[#6B7280] text-sm mt-2 leading-6">
            AI extracts slides and analyzes content automatically.
          </p>
        </motion.div>

        {/* AI Ready */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          className="
            bg-white
            rounded-3xl
            p-7
            border border-[#F4D7C5]
            shadow-[0_8px_25px_rgba(0,0,0,0.04)]
            hover:border-[#FFB067]
            hover:shadow-[0_12px_30px_rgba(255,140,80,0.12)]
            transition-all
          "
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E8FAFF] flex items-center justify-center">
            <Sparkles
              className="text-[#06B6D4]"
              size={27}
            />
          </div>

          <h3 className="mt-5 font-bold text-xl text-[#111827]">
            AI Ready
          </h3>

          <p className="text-[#6B7280] text-sm mt-2 leading-6">
            Get instant AI review, suggestions and optimization.
          </p>
        </motion.div>

      </div>

    </div>
  );
}

export default UploadPresentation;