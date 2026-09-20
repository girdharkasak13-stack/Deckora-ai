import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import { countSlides } from "../utils/presentation";

function EditPresentation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadPresentation = async () => {
      try {
        const snap = await getDoc(doc(db, "presentations", id));

        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || "");
          setContent(
  (data.content || "")
    .replace(/###/g, "")
    .replace(/\*\*/g, "")
    .replace(/^---$/gm, "")
    .replace(/^\s*\*\s?/gm, "")
    .trim()
);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadPresentation();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "presentations", id), {
        title,
        content,
        slides: countSlides(content),
        review: deleteField(), // the old AI review no longer matches the edited content
      });

      alert("Presentation updated!");
      navigate("/history");
    } catch (error) {
      console.error(error);
      alert("Failed to update presentation.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] p-8">
      <h1 className="text-4xl font-bold mb-6">
        Edit Presentation
      </h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 mb-5 rounded-xl border"
        placeholder="Presentation title"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-96 p-4 rounded-xl border"
        placeholder="Presentation content"
      />

      <button
        onClick={handleSave}
        className="mt-5 px-6 py-3 rounded-xl bg-cyan-500 text-white font-medium"
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditPresentation;