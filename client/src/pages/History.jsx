import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  Pencil,
  Download,
  Trash2,
  Sparkles,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { downloadPptx } from "../api";
import { countSlides } from "../utils/presentation";

function History() {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPresentations = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, "presentations"),
          where("userId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setPresentations(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPresentations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "presentations", id));

      setPresentations((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete presentation.");
    }
  };

  const filteredPresentations = presentations.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#111827] p-6 md:p-10">

      {/* Heading */}
      <h1 className="text-5xl font-bold tracking-tight">
        My Presentations
      </h1>

      <p className="text-gray-500 mt-3">
        View, edit and manage all your AI presentations.
      </p>

      {/* Search */}
      <div className="mt-10 flex items-center bg-white border border-orange-100 rounded-2xl px-5 shadow-sm">
        <Search
          className="text-[#8B5CF6]"
          size={22}
        />

        <input
          type="text"
          placeholder="Search presentations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent p-5 outline-none text-[#111827]"
        />
      </div>

      {/* Cards */}
      <div className="grid gap-6 mt-10">

        {filteredPresentations.map((item) => (

          <motion.div
            key={item.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_8px_30px_rgba(255,120,80,0.06)]"
          >

            <div className="flex justify-between items-start">

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                    <FileText
                      className="text-[#8B5CF6]"
                      size={24}
                    />
                  </div>

                  <h2 className="text-2xl font-bold">
                    {item.title}
                  </h2>

                </div>

                <div className="mt-5 space-y-1">

                  <p className="text-gray-500">
                    Theme :{" "}
                    <span className="text-gray-700 font-medium">
                      {item.theme}
                    </span>
                  </p>

                  <p className="text-gray-500">
                    Slides :{" "}
                    <span className="text-gray-700 font-medium">
                      {countSlides(item.content) || item.slides}
                    </span>
                  </p>

                  <p className="text-gray-500">
                    Created :{" "}
                    <span className="text-gray-700 font-medium">
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleDateString()
                        : "Just now"}
                    </span>
                  </p>

                </div>

              </div>

              <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Sparkles
                  className="text-cyan-500"
                  size={24}
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-7">

              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate(`/edit/${item.id}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-white font-medium"
              >
                <Pencil size={17} />
                Edit
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate(`/review/${item.id}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8B5CF6] text-white font-medium"
              >
                <Sparkles size={17} />
                Review
              </motion.button>
                <motion.button
  whileHover={{ scale: 1.04 }}
  onClick={async () => {
    try {
      await downloadPptx(item);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to download presentation.");
    }
  }}
  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white font-medium"
>
  <Download size={17} />
  Download
</motion.button>
              

              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-medium"
              >
                <Trash2 size={17} />
                Delete
              </motion.button>

            </div>

          </motion.div>

        ))}

      </div>

      {filteredPresentations.length === 0 && (
        <div className="text-center mt-16 text-gray-500">
          No presentations found.
        </div>
      )}

    </div>
  );
}

export default History;