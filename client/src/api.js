// All calls to the Deckora backend go through here.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const NETWORK_ERROR = "Cannot reach the Deckora server. Make sure the backend is running.";

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  return data;
}

export const postJson = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const postForm = (path, formData) =>
  request(path, { method: "POST", body: formData });

/** Asks the backend to build a .pptx and saves it in the browser. */
export async function downloadPptx({ title, content, theme }) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, theme }),
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Download failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const fileName = (title || "presentation").replace(/[\\/:*?"<>|]+/g, " ").trim() || "presentation";

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.pptx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}
