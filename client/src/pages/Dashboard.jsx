import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { countSlides, formatRelativeDate, toMillis } from "../utils/presentation";

// Thumbnail colour schemes (rotated for the recent presentations list)
const THUMBNAIL_STYLES = [
  { outer: "from-purple-600 via-pink-500 to-orange-400", inner: "bg-[#25154F]/80", bar: "bg-orange-300" },
  { outer: "from-purple-900 via-purple-600 to-pink-500", inner: "bg-[#24103F]/80", bar: "bg-pink-300" },
  { outer: "from-orange-500 via-red-400 to-pink-400", inner: "bg-red-500/70", bar: "bg-white/70" },
];

const average = (items, key) =>
  items.length
    ? Math.round(items.reduce((sum, item) => sum + item.review[key], 0) / items.length)
    : null;

function Dashboard() {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        // Only this user's presentations (also enforced by firestore.rules)
        const snapshot = await getDocs(
          query(collection(db, "presentations"), where("userId", "==", user.uid))
        );

        const items = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

        setPresentations(items);
      } catch (error) {
        console.error(error);
        setLoadError("Could not load your presentations.");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const recentPresentations = presentations.slice(0, 3);

  // AI Insights come from the AI reviews saved on the Review page
  const reviewed = presentations.filter((item) => item.review);
  const insights = [
    {
      label: "Grammar",
      icon: "Aa",
      iconStyle: "bg-red-50 text-red-500",
      valueStyle: "text-red-500",
      value: average(reviewed, "grammar"),
    },
    {
      label: "Design",
      icon: "✦",
      iconStyle: "bg-orange-50 text-orange-500",
      valueStyle: "text-orange-500",
      value: average(reviewed, "design"),
    },
    {
      label: "Readability",
      icon: "◉",
      iconStyle: "bg-purple-50 text-purple-500",
      valueStyle: "text-purple-500",
      value: average(reviewed, "readability"),
    },
    {
      label: "Structure",
      icon: "✓",
      iconStyle: "bg-green-50 text-green-500",
      valueStyle: "text-green-500",
      value: average(reviewed, "structure"),
    },
  ];

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const quickActions = [
    {
      title: "Create Presentation",
      description:
        "Turn your idea into a polished presentation with AI.",
      icon: "✦",
      gradient: "from-orange-500 to-pink-500",
      bg: "bg-orange-50",
      action: () => navigate("/create"),
    },
    {
      title: "Upload PPT",
      description:
        "Upload an existing presentation and let Deckora review it.",
      icon: "↑",
      gradient: "from-pink-500 to-purple-500",
      bg: "bg-pink-50",
      action: () => navigate("/upload"),
    },
    {
      title: "AI Review",
      description:
        "Find grammar, design and readability issues in your slides.",
      icon: "✧",
      gradient: "from-purple-500 to-indigo-500",
      bg: "bg-purple-50",
      action: () => navigate("/history"),
    },
    {
      title: "Presentation Coach",
      description:
        "Get a speaking script, timing and tips for every slide.",
      icon: "⚡",
      gradient: "from-orange-400 to-purple-500",
      bg: "bg-orange-50",
      action: () => navigate("/review"),
    },
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 text-xs font-semibold shadow-sm mb-4">
            <span>✦</span>
            AI Presentation Workspace
          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#171717]">
            {greeting} 👋
          </h1>

          <p className="text-gray-600 mt-2 text-base">
            Welcome back to Deckora. Ready to build your next presentation?
          </p>
        </div>


        {/* CREDITS */}
        <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 shadow-lg">

          <div className="relative bg-white rounded-[23px] px-7 py-5 min-w-[210px]">

            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-pink-100 blur-2xl" />

            <p className="relative text-sm font-medium text-gray-500">
              Total Presentations
            </p>

            <div className="relative flex items-end gap-2 mt-1">
              <h2 className="text-4xl font-black text-[#171717]">
                {loading ? "--" : presentations.length}
              </h2>

              <span className="text-xs text-green-600 font-semibold mb-2">
                {loading ? "Loading" : `${reviewed.length} reviewed`}
              </span>
            </div>

          </div>
        </div>

      </div>


      {/* QUICK ACTIONS */}
      <section className="mb-10">

        <div className="flex items-end justify-between mb-5">

          <div>
            <h2 className="text-2xl font-black text-[#171717]">
              What do you want to create?
            </h2>

            <p className="text-gray-500 mt-1">
              Start a new workflow or improve an existing deck.
            </p>
          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {quickActions.map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              className="group text-left bg-white border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* ICON */}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-xl font-bold shadow-md group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>


              <h3 className="text-lg font-bold text-[#171717] mt-5">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 leading-6 mt-2 min-h-[48px]">
                {item.description}
              </p>


              <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-orange-500 group-hover:gap-3 transition-all">
                Get started
                <span>→</span>
              </div>

            </button>
          ))}

        </div>

      </section>


      
      {/* RECENT PRESENTATIONS */}
<section className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm mb-10">

  {/* Header */}
  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="text-2xl font-black text-[#111827]">
        Recent Presentations
      </h2>

      <p className="text-gray-500 mt-1">
        Pick up where you left off.
      </p>
    </div>

    <button
      onClick={() => navigate("/history")}
      className="text-orange-500 font-semibold hover:text-pink-500 transition"
    >
      View history →
    </button>

  </div>


  {/* Presentations */}
  <div className="space-y-3">

    {loading && (
      <p className="text-center text-gray-500 py-8">
        Loading your presentations...
      </p>
    )}

    {!loading && loadError && (
      <p className="text-center text-red-500 py-8">{loadError}</p>
    )}

    {!loading && !loadError && recentPresentations.length === 0 && (
      <div className="text-center py-8">
        <p className="text-gray-500">
          You have no presentations yet.
        </p>

        <button
          onClick={() => navigate("/create")}
          className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold"
        >
          Create your first presentation
        </button>
      </div>
    )}

    {recentPresentations.map((item, index) => {
      const thumbnail = THUMBNAIL_STYLES[index % THUMBNAIL_STYLES.length];

      return (
        <div
          key={item.id}
          onClick={() => navigate(`/review/${item.id}`)}
          className="group cursor-pointer flex items-center gap-5 bg-[#FFF9F6] border border-orange-50 rounded-2xl p-4 hover:border-pink-200 hover:shadow-md transition"
        >

          {/* Thumbnail */}
          <div className={`w-40 h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br ${thumbnail.outer} p-3`}>

            <div className={`h-full rounded-lg ${thumbnail.inner} p-2 flex flex-col justify-between`}>

              <div>
                <p className="text-[8px] text-white/70 font-semibold">
                  DECKORA AI
                </p>

                <p className="text-white text-xs font-black leading-tight mt-1 line-clamp-2 uppercase">
                  {item.title}
                </p>
              </div>

              <div className={`h-1 w-12 rounded-full ${thumbnail.bar}`} />

            </div>

          </div>


          {/* Info */}
          <div className="flex-1 min-w-0">

            <h3 className="text-lg font-bold text-[#111827] truncate">
              {item.title}
            </h3>

            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span>{formatRelativeDate(item.createdAt)}</span>
              <span>•</span>
              <span>{countSlides(item.content) || item.slides || 0} slides</span>
            </div>

            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-orange-50 text-orange-500 text-xs font-semibold">
              ✦ AI Generated
            </span>

          </div>


          {/* Score */}
          <div className="text-right">

            <p className="text-xs text-gray-400">
              AI Score
            </p>

            <p className="text-2xl font-black text-[#111827]">
              {item.review ? item.review.score : "--"}
              <span className="text-sm text-gray-400">/100</span>
            </p>

          </div>


          {/* Status */}
          <span
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              item.review
                ? "bg-purple-50 text-purple-600"
                : "bg-orange-50 text-orange-500"
            }`}
          >
            {item.review ? "Reviewed" : "Pending"}
          </span>


          {/* Menu */}
          <button
            aria-label="Edit presentation"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/edit/${item.id}`);
            }}
            className="text-gray-400 text-xl px-2 hover:text-gray-800"
          >
            ⋮
          </button>

        </div>
      );
    })}

  </div>

</section>
     
                 


    
      {/* AI INSIGHTS */}
<section className="mb-10">

  <div className="mb-5">
    <h2 className="text-2xl font-black text-[#111827]">
      AI Insights
    </h2>

    <p className="text-gray-500 mt-1">
      A quick look at your presentation quality.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

    {insights.map((item) => (
      <div
        key={item.label}
        className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
      >

        <div className={`w-10 h-10 rounded-xl ${item.iconStyle} flex items-center justify-center font-bold`}>
          {item.icon}
        </div>

        <p className="text-gray-500 mt-5">
          {item.label}
        </p>

        <h3 className={`text-4xl font-black ${item.valueStyle} mt-1`}>
          {item.value === null ? "--" : `${item.value}%`}
        </h3>

        <p className="text-sm text-gray-400 mt-1">
          {item.value === null
            ? "Review a presentation to see this"
            : `Average of ${reviewed.length} reviewed`}
        </p>

      </div>
    ))}

  </div>
  {/* Final CTA */}
<div className="w-full mt-8 rounded-3xl overflow-hidden
  bg-gradient-to-r from-[#FF6B00] via-[#FF3D5A] to-[#E91E9A]
  p-8 md:p-10
  flex flex-col md:flex-row
  items-start md:items-center
  justify-between gap-8
  shadow-[0_15px_40px_rgba(255,61,90,0.20)]">

  <div className="max-w-2xl">

    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/80">
      Ready to create?
    </p>

    <h2 className="text-3xl font-bold text-white mt-2">
      Your next great deck starts here.
    </h2>

    <p className="text-white/80 mt-2">
      Turn your ideas into polished, professional presentations with Deckora AI.
    </p>

  </div>

  <button
    onClick={() => navigate("/create")}
    className="shrink-0 bg-white text-[#171717] px-7 py-4 rounded-2xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
  >
    Create Your Deck →
  </button>

</div>

</section>
      





        

    </DashboardLayout>
  );
}

export default Dashboard;