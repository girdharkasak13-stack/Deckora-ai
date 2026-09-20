// Helpers shared by the dashboard, history and review pages.

const SLIDE_MARKER = /^[ \t#*]*SLIDE\s*\d+\s*[:.\-–—]/gim;

/** Number of slides in the generated text ("SLIDE 1: ...", "SLIDE 2: ..."). */
export function countSlides(content = "") {
  const count = (content.match(SLIDE_MARKER) || []).length;
  return count || (content.trim() ? 1 : 0);
}

/** Words the speaker would actually read (markers and markdown removed). */
export function countWords(content = "") {
  const plain = content
    .replace(SLIDE_MARKER, " ")
    .replace(/[#*]/g, " ")
    .replace(/^\s*content\s*:?\s*$/gim, " ")
    .replace(/^\s*-{3,}\s*$/gm, " ")
    .replace(/^\s*[-•]\s+/gm, " ")
    .trim();
  return plain ? plain.split(/\s+/).length : 0;
}

/** Speaking time in minutes at ~150 words per minute. */
export const readingMinutes = (words) => Math.max(1, Math.ceil(words / 150));

/** Label + colours for an overall 0-100 score. */
export function scoreLabel(score) {
  if (score >= 85) {
    return {
      label: "Excellent",
      message: "Excellent Presentation 🎉",
      badge: "bg-[#ECFDF5] text-[#059669]",
      text: "text-[#059669]",
    };
  }
  if (score >= 70) {
    return {
      label: "Good",
      message: "Good Presentation 👍",
      badge: "bg-[#ECFEFF] text-[#0891B2]",
      text: "text-[#0891B2]",
    };
  }
  if (score >= 50) {
    return {
      label: "Needs Work",
      message: "A few improvements will help",
      badge: "bg-[#FFFBEB] text-[#D97706]",
      text: "text-[#D97706]",
    };
  }
  return {
    label: "Needs Improvement",
    message: "This presentation needs major improvements",
    badge: "bg-[#FEF2F2] text-[#DC2626]",
    text: "text-[#DC2626]",
  };
}

/** Firestore Timestamp -> milliseconds (0 when missing). */
export const toMillis = (timestamp) =>
  timestamp?.toMillis ? timestamp.toMillis() : 0;

/** "Today", "Yesterday", "3 days ago" or a normal date. */
export function formatRelativeDate(timestamp) {
  const millis = toMillis(timestamp);
  if (!millis) return "Just now";

  const startOfDay = (date) => new Date(date).setHours(0, 0, 0, 0);
  const days = Math.round((startOfDay(Date.now()) - startOfDay(millis)) / 86400000);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(millis).toLocaleDateString();
}
