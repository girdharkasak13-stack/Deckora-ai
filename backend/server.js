require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const PptxGenJS = require("pptxgenjs");
const officeParser = require("officeparser");
const { GoogleGenAI } = require("@google/genai");

/* ------------------------------------------------------------------ */
/* Configuration (all values come from backend/.env)                   */
/* ------------------------------------------------------------------ */

const PORT = Number(process.env.PORT) || 5000;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
// "minimal" is the fastest setting on gemini-3.6-flash. Use "low" for
// gemini-3.8-flash, or "none" to leave the model's default thinking untouched.
const THINKING_LEVEL = (process.env.GEMINI_THINKING_LEVEL || "minimal").toUpperCase();
const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const RATE_LIMIT_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN) || 20;

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_TEXT_CHARS = 20000; // keeps prompts small and fast
const MAX_SLIDES = 20;

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Missing GEMINI_API_KEY. Copy backend/.env.example to backend/.env and add your key."
  );
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: 60000 },
});

/* ------------------------------------------------------------------ */
/* App setup                                                           */
/* ------------------------------------------------------------------ */

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Render/Vercel proxies: use the real client IP for rate limiting
app.use(cors({ origin: CLIENT_ORIGINS }));
app.use(express.json({ limit: "1mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

// Tiny in-memory rate limiter so nobody can burn the Gemini quota.
const hits = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) if (now > entry.reset) hits.delete(key);
}, 60 * 1000).unref();

function rateLimit(req, res, next) {
  const now = Date.now();
  const entry = hits.get(req.ip);

  if (!entry || now > entry.reset) {
    hits.set(req.ip, { count: 1, reset: now + 60 * 1000 });
    return next();
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_PER_MIN) {
    return res
      .status(429)
      .json({ message: "Too many requests. Please wait a minute and try again." });
  }
  next();
}

/* ------------------------------------------------------------------ */
/* Gemini helpers                                                      */
/* ------------------------------------------------------------------ */

async function askGemini(prompt, { json = false, maxOutputTokens = 2048 } = {}) {
  const base = {
    maxOutputTokens,
    ...(json ? { responseMimeType: "application/json" } : {}),
  };
  const call = (config) =>
    ai.models.generateContent({ model: MODEL, contents: prompt, config });

  let response;
  try {
    response = await call(
      THINKING_LEVEL === "NONE"
        ? base
        : { ...base, thinkingConfig: { thinkingLevel: THINKING_LEVEL } }
    );
  } catch (err) {
    // Some models reject a thinking level they don't support: retry once without it.
    if (err?.status === 400 && /think/i.test(err.message || "")) {
      response = await call(base);
    } else {
      throw err;
    }
  }

  const text = (response.text || "").trim();
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

function describeAiError(err) {
  const status = err?.status;
  const message = String(err?.message || "");

  if (status === 429) {
    return { code: 429, message: "Gemini quota or rate limit reached. Please try again in a minute." };
  }
  if (status === 401 || status === 403 || /api key/i.test(message)) {
    return { code: 502, message: "Gemini rejected the API key. Check GEMINI_API_KEY in backend/.env." };
  }
  if (status === 503) {
    return { code: 503, message: "Gemini is busy right now. Please try again shortly." };
  }
  if (/timeout|timed out|aborted/i.test(message)) {
    return { code: 504, message: "Gemini took too long to respond. Please try again." };
  }
  return { code: 502, message: "The AI request failed. Please try again." };
}

function sendAiError(res, label, err) {
  console.error(`${label}:`, err?.message || err);
  const { code, message } = describeAiError(err);
  res.status(code).json({ message });
}

const clampScore = (value) => {
  const number = Math.round(Number(value));
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : null;
};

function parseJson(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Gemini did not return valid JSON");
    return JSON.parse(match[0]);
  }
}

/** Asks Gemini to score a presentation and returns a validated result. */
async function reviewPresentation(content) {
  const prompt = `You are a strict presentation reviewer. Score the presentation below from 0 to 100 in each category:
- grammar: spelling, grammar and wording
- design: how well the slide content is laid out (bullet count, slide density, balance, visual flow). Only the text is available, so judge the layout of the content.
- readability: clarity, short sentences, easy to scan
- structure: logical flow, clear introduction and conclusion

Then write exactly 5 short, specific suggestions based on THIS presentation. Be honest and do not default to high scores.

Return ONLY valid JSON in this shape:
{"grammar": 0, "design": 0, "readability": 0, "structure": 0, "suggestions": ["...", "...", "...", "...", "..."]}

Presentation:
${content.slice(0, MAX_TEXT_CHARS)}`;

  const data = parseJson(await askGemini(prompt, { json: true, maxOutputTokens: 1024 }));

  const grammar = clampScore(data.grammar);
  const design = clampScore(data.design);
  const readability = clampScore(data.readability);
  const structure = clampScore(data.structure);
  const suggestions = Array.isArray(data.suggestions)
    ? data.suggestions
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
        .slice(0, 10)
    : [];

  if ([grammar, design, readability, structure].includes(null) || suggestions.length === 0) {
    throw new Error("Gemini returned an incomplete review");
  }

  // The overall score is the average of the four real category scores.
  const score = Math.round((grammar + design + readability + structure) / 4);
  return { score, grammar, design, readability, structure, suggestions };
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

app.get("/api/health", (req, res) => {
  res.json({ message: "Deckora backend is running!" });
});

// Create presentation content from a topic.
app.post("/api/generate", rateLimit, async (req, res) => {
  const topic = String(req.body?.topic || "")
    .replace(/[\r\n"]+/g, " ")
    .trim()
    .slice(0, 200);
  const slides = Math.min(MAX_SLIDES, Math.max(1, parseInt(req.body?.slides, 10) || 10));
  const audience = String(req.body?.audience || "General audience").slice(0, 40);
  const tone = String(req.body?.tone || "Professional").slice(0, 40);
  const language = String(req.body?.language || "English").slice(0, 40);

  if (!topic) {
    return res.status(400).json({ message: "Please enter a presentation topic." });
  }

  try {
    const prompt = `Create exactly ${slides} presentation slides about "${topic}".
Audience: ${audience}. Tone: ${tone}. Write in ${language}.

Use exactly this format for every slide:
SLIDE 1: Slide title
- short bullet
- short bullet
- short bullet

Rules: 3 to 4 bullets per slide, each under 12 words. Plain text only, no markdown, no introduction or closing remarks.`;

    const result = await askGemini(prompt, {
      maxOutputTokens: Math.min(8192, slides * 200 + 400),
    });

    if (!/SLIDE\s*\d+\s*:/i.test(result)) {
      throw new Error("Gemini returned content in an unexpected format");
    }

    res.json({ result });
  } catch (error) {
    sendAiError(res, "GENERATE ERROR", error);
  }
});

// Score a saved presentation (used by the Review page).
app.post("/api/review", rateLimit, async (req, res) => {
  const content = String(req.body?.content || "").trim();
  if (!content) {
    return res.status(400).json({ message: "Presentation content is required." });
  }

  try {
    res.json(await reviewPresentation(content));
  } catch (error) {
    sendAiError(res, "AI REVIEW ERROR", error);
  }
});

// Speaking script + timing + tips for every slide (Presentation Coach page).
app.post("/api/coach", rateLimit, async (req, res) => {
  const content = String(req.body?.content || "").trim();
  if (!content) {
    return res.status(400).json({ message: "Presentation content is required." });
  }

  try {
    const prompt = `You are a friendly presentation coach. For EVERY slide in the presentation below, write:

SLIDE [number]: [slide title]
SPEAKING SCRIPT: 2 to 4 natural sentences the speaker can say out loud
TIMING: how long to spend on this slide
PRESENTATION TIP: one short delivery tip

Plain text only, no markdown, no introduction or closing remarks.

Presentation:
${content.slice(0, MAX_TEXT_CHARS)}`;

    const result = await askGemini(prompt, { maxOutputTokens: 6000 });
    res.json({ result });
  } catch (error) {
    sendAiError(res, "COACH ERROR", error);
  }
});

// Upload a PPTX / DOCX / PDF, extract its text and review it with Gemini.
app.post("/api/upload", rateLimit, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const extension = (req.file.originalname.split(".").pop() || "").toLowerCase();
  if (!["pptx", "docx", "pdf"].includes(extension)) {
    return res
      .status(400)
      .json({ message: "Unsupported file type. Please upload a .pptx, .docx or .pdf file." });
  }

  let text;
  try {
    const ast = await officeParser.parseOffice(req.file.buffer);
    text = ast.toText().trim();
  } catch (error) {
    console.error("FILE PARSE ERROR:", error?.message || error);
    return res.status(422).json({
      message: "Could not read this file. Make sure it is a valid, non-corrupted file.",
    });
  }

  if (!text) {
    return res.status(422).json({
      message: "No readable text was found in this file (scanned or image-only files are not supported).",
    });
  }

  try {
    const review = await reviewPresentation(text);

    const result = [
      `Overall Score: ${review.score}/100`,
      "",
      `Grammar: ${review.grammar}/100`,
      `Design: ${review.design}/100`,
      `Readability: ${review.readability}/100`,
      `Structure: ${review.structure}/100`,
      "",
      "Suggestions:",
      ...review.suggestions.map((item, index) => `${index + 1}. ${item}`),
    ].join("\n");

    res.json({ message: "AI analysis successful!", result, review });
  } catch (error) {
    sendAiError(res, "UPLOAD ANALYSIS ERROR", error);
  }
});

/* ------------------------------------------------------------------ */
/* PPTX download                                                       */
/* ------------------------------------------------------------------ */

const cleanLine = (line) =>
  line
    .replace(/#{1,6}/g, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*•]\s*/, "")
    .trim();

const isUsefulLine = (line) =>
  line &&
  !/^[-*_]+$/.test(line) &&
  !/^(title|key points|content)\s*:?$/i.test(line) &&
  !/^here is a short presentation outline/i.test(line);

/** Turns "SLIDE 1: Title / - bullet ..." text into [{ title, bullets }]. */
function parseSlides(content) {
  const text = String(content || "");
  const parts = text.split(/^[ \t#*]*SLIDE\s*\d+\s*[:.\-–—]\s*/gim);
  // parts[0] is whatever comes before the first "SLIDE n:" marker
  const chunks = parts.length > 1 ? parts.slice(1) : [text];

  return chunks
    .map((chunk) => {
      const lines = chunk.split("\n").map(cleanLine).filter(isUsefulLine);
      return { title: lines[0] || "", bullets: lines.slice(1) };
    })
    .filter((slide) => slide.title || slide.bullets.length);
}

/* ---- Themes (the "Theme" chosen on the Create page) ---- */

const THEMES = {
  Modern: {
    layout: "modern",
    font: "Calibri",
    titleBg: "1E1B4B",
    titleText: "FFFFFF",
    titleSub: "C4B5FD",
    tag: "22D3EE",
    accent: "8B5CF6",
    accent2: "22D3EE",
    bg: "F5F3FF",
    heading: "1E1B4B",
    body: "1F2937",
    muted: "9CA3AF",
    cardFill: "FFFFFF",
    cardLine: "DDD6FE",
  },
  Minimal: {
    layout: "minimal",
    font: "Arial",
    titleBg: "FFFFFF",
    titleText: "0F172A",
    titleSub: "64748B",
    tag: "94A3B8",
    accent: "0F172A",
    accent2: "CBD5E1",
    bg: "FFFFFF",
    heading: "0F172A",
    body: "334155",
    muted: "94A3B8",
    cardFill: "F8FAFC",
    cardLine: "E2E8F0",
  },
  Business: {
    layout: "business",
    font: "Calibri",
    headFont: "Georgia",
    titleBg: "0F2A4A",
    titleText: "FFFFFF",
    titleSub: "E5C86B",
    tag: "C9A227",
    accent: "C9A227",
    accent2: "1D4ED8",
    bg: "F3F4F6",
    heading: "0F2A4A",
    body: "1F2937",
    muted: "6B7280",
    cardFill: "FFFFFF",
    cardLine: "D1D5DB",
  },
};

const resolveTheme = (name) => {
  const key = Object.keys(THEMES).find(
    (item) => item.toLowerCase() === String(name || "").trim().toLowerCase()
  );
  return THEMES[key || "Modern"];
};

const noLine = { color: "FFFFFF", transparency: 100 };

/** Title slide and closing slide share the same look. */
function addCoverSlide(pptx, t, { tag, title, subtitle }) {
  const slide = pptx.addSlide();
  const headFont = t.headFont || t.font;
  const left = t.layout === "modern" ? 1.15 : 0.9;
  const fontSize = title.length <= 30 ? 44 : title.length <= 60 ? 36 : title.length <= 100 ? 28 : 24;
  slide.background = { color: t.titleBg };

  if (t.layout === "modern") {
    slide.addShape(pptx.ShapeType.ellipse, { x: 6.6, y: -1.4, w: 5, h: 5, fill: { color: t.accent, transparency: 65 }, line: noLine });
    slide.addShape(pptx.ShapeType.ellipse, { x: 7.9, y: 3.2, w: 3.6, h: 3.6, fill: { color: t.accent2, transparency: 75 }, line: noLine });
    slide.addShape(pptx.ShapeType.ellipse, { x: -0.8, y: 4.4, w: 2.2, h: 2.2, fill: { color: t.accent, transparency: 80 }, line: noLine });
    slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.45, w: 0.12, h: 2.3, fill: { color: t.accent2 }, line: noLine });
  } else if (t.layout === "business") {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.25, fill: { color: t.accent }, line: noLine });
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 5.375, w: 10, h: 0.25, fill: { color: t.accent }, line: noLine });
    slide.addShape(pptx.ShapeType.rect, { x: 0.9, y: 3.6, w: 1.6, h: 0.06, fill: { color: t.accent }, line: noLine });
  } else {
    slide.addShape(pptx.ShapeType.rect, { x: 0.9, y: 3.5, w: 1.2, h: 0.04, fill: { color: t.accent }, line: noLine });
  }

  slide.addText(tag, {
    x: left, y: 1.05, w: 6, h: 0.35, fontFace: t.font, fontSize: 12, bold: true, color: t.tag, charSpacing: 4,
  });
  slide.addText(title, {
    x: left, y: 1.45, w: 6.9, h: 2.0, fontFace: headFont, fontSize, bold: true,
    color: t.titleText, valign: "middle", fit: "shrink",
  });
  slide.addText(subtitle, {
    x: left, y: 3.8, w: 6.9, h: 0.4, fontFace: t.font, fontSize: 14, color: t.titleSub,
  });
}

function addContentSlide(pptx, t, item, index, total) {
  const slide = pptx.addSlide();
  const headFont = t.headFont || t.font;
  const title = item.title || `Slide ${index + 1}`;
  const titleSize = title.length > 55 ? 24 : title.length > 40 ? 28 : 32;
  slide.background = { color: t.bg };

  // ---- Header (differs per theme) ----
  let titleColor = t.heading;
  if (t.layout === "modern") {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: t.accent }, line: noLine });
    slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.32, w: 1.2, h: 0.05, fill: { color: t.accent2 }, line: noLine });
  } else if (t.layout === "business") {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 1.2, fill: { color: t.titleBg }, line: noLine });
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 1.2, w: 10, h: 0.06, fill: { color: t.accent }, line: noLine });
    titleColor = "FFFFFF";
  } else {
    slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 0.45, w: 8.4, h: 0.02, fill: { color: t.accent2 }, line: noLine });
    slide.addText(String(index + 1).padStart(2, "0"), { x: 0.8, y: 0.5, w: 1, h: 0.3, fontFace: t.font, fontSize: 11, color: t.muted });
  }

  slide.addText(title, {
    x: 0.8,
    y: t.layout === "minimal" ? 0.75 : t.layout === "business" ? 0.15 : 0.35,
    w: 8.4,
    h: t.layout === "minimal" ? 0.8 : 0.9,
    fontFace: headFont,
    fontSize: titleSize,
    bold: true,
    color: titleColor,
    valign: "middle",
    fit: "shrink",
  });

  // ---- Bullets as cards ----
  const bullets = item.bullets.slice(0, 10);
  const n = bullets.length;
  if (n > 0) {
    const left = 0.8;
    const fullW = 8.4;
    const top = t.layout === "business" ? 1.65 : t.layout === "minimal" ? 1.75 : 1.7;
    const areaH = 5.05 - top;
    const gap = n >= 7 ? 0.06 : 0.18;

    // 3-4 bullets alternate between a grid and stacked cards; 5-6 use a grid; the rest are stacked.
    const grid = n >= 3 && n <= 6 && (n >= 5 || index % 2 === 0);

    const drawCard = (x, y, w, h, i) => {
      const badgeColor = i % 2 && t.layout === "modern" ? t.accent2 : t.accent;
      const shape = t.layout === "business" ? pptx.ShapeType.rect : pptx.ShapeType.roundRect;
      slide.addShape(shape, {
        x, y, w, h,
        rectRadius: t.layout === "minimal" ? 0.05 : 0.12,
        fill: { color: t.cardFill },
        line: { color: t.cardLine, width: 1 },
        ...(t.layout === "modern"
          ? { shadow: { type: "outer", color: "7C3AED", opacity: 0.12, blur: 6, offset: 2, angle: 90 } }
          : {}),
      });
      if (t.layout === "business") {
        slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.09, h, fill: { color: t.accent }, line: noLine });
      }
      return badgeColor;
    };

    const drawBadge = (x, y, size, i, color) => {
      const label = String(i + 1);
      const filled = t.layout !== "minimal";
      slide.addShape(pptx.ShapeType.ellipse, {
        x, y, w: size, h: size,
        fill: { color: filled ? (t.layout === "business" ? t.titleBg : color) : "FFFFFF" },
        line: filled ? noLine : { color: t.accent, width: 1 },
      });
      slide.addText(label, {
        x, y, w: size, h: size, align: "center", valign: "middle", bold: true,
        fontFace: t.font, fontSize: Math.round(size * 32),
        color: !filled ? t.accent : t.layout === "business" ? t.accent : "FFFFFF",
        margin: 0,
      });
    };

    if (grid) {
      const cols = n === 3 ? 3 : 2;
      const rows = Math.ceil(n / cols);
      const cardW = (fullW - gap * (cols - 1)) / cols;
      const cardH = Math.min(n === 3 ? 2.4 : 2.0, (areaH - gap * (rows - 1)) / rows);
      const startY = top + (areaH - (cardH * rows + gap * (rows - 1))) / 2;
      const fontSize = n === 3 ? 18 : 17;

      bullets.forEach((text, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const lastOdd = cols === 2 && n % 2 === 1 && i === n - 1;
        const w = lastOdd ? fullW : cardW;
        const x = left + c * (cardW + gap);
        const y = startY + r * (cardH + gap);
        const color = drawCard(x, y, w, cardH, i);
        if (cardH < 1.3) {
          // short cards: number on the left, text beside it
          drawBadge(x + 0.25, y + (cardH - 0.42) / 2, 0.42, i, color);
          slide.addText(text, {
            x: x + 0.85, y, w: w - 1.05, h: cardH,
            fontFace: t.font, fontSize, color: t.body, valign: "middle", fit: "shrink", margin: 2,
          });
        } else {
          drawBadge(x + 0.25, y + 0.2, 0.42, i, color);
          slide.addText(text, {
            x: x + 0.25, y: y + 0.72, w: w - 0.5, h: cardH - 0.85,
            fontFace: t.font, fontSize, color: t.body, valign: "top", fit: "shrink",
          });
        }
      });
    } else {
      const rowH = Math.min(n <= 2 ? 1.3 : 0.9, (areaH - gap * (n - 1)) / n);
      const fontSize = n <= 3 ? 20 : n <= 4 ? 18 : n <= 6 ? 17 : n <= 8 ? 13 : 11;
      const badgeSize = Math.min(0.46, rowH - 0.2);
      const startY = n <= 4 ? top + (areaH - (rowH * n + gap * (n - 1))) / 2 : top;

      bullets.forEach((text, i) => {
        const y = startY + i * (rowH + gap);
        const color = drawCard(left, y, fullW, rowH, i);
        const showBadge = badgeSize >= 0.3;
        if (showBadge) drawBadge(left + 0.3, y + (rowH - badgeSize) / 2, badgeSize, i, color);
        slide.addText(text, {
          x: left + (showBadge ? 0.3 + badgeSize + 0.25 : 0.3),
          y, w: fullW - (showBadge ? badgeSize + 0.85 : 0.6), h: rowH,
          fontFace: t.font, fontSize, color: t.body, valign: "middle", fit: "shrink", margin: 2,
        });
      });
    }
  }

  // ---- Footer ----
  slide.addText("Deckora AI", { x: 0.8, y: 5.2, w: 3, h: 0.3, fontFace: t.font, fontSize: 10, color: t.muted });
  slide.addText(`${index + 1} / ${total}`, { x: 8.2, y: 5.2, w: 1, h: 0.3, fontFace: t.font, fontSize: 10, color: t.muted, align: "right" });
}

app.post("/api/download", async (req, res) => {
  const title = String(req.body?.title || "").trim() || "Presentation";
  const content = String(req.body?.content || "");
  const theme = resolveTheme(req.body?.theme);

  const slides = parseSlides(content);
  if (slides.length === 0) {
    return res.status(400).json({ message: "This presentation has no content to download." });
  }

  try {
    const pptx = new PptxGenJS(); // default layout: 16:9, 10in x 5.625in
    pptx.author = "Deckora AI";
    pptx.title = title;
    pptx.subject = title;

    addCoverSlide(pptx, theme, {
      tag: "PRESENTATION",
      title,
      subtitle: `${slides.length} slides  |  Created with Deckora AI`,
    });
    slides.forEach((item, index) => addContentSlide(pptx, theme, item, index, slides.length));
    addCoverSlide(pptx, theme, { tag: "QUESTIONS?", title: "Thank You", subtitle: title });

    const buffer = await pptx.write({ outputType: "nodebuffer" });
    const fileName = title.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "presentation";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}.pptx"`);
    res.send(buffer);
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error?.message || error);
    res.status(500).json({ message: "PPTX generation failed." });
  }
});

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const tooLarge = err.code === "LIMIT_FILE_SIZE";
    return res.status(tooLarge ? 413 : 400).json({
      message: tooLarge ? "File is too large. The maximum size is 20MB." : err.message,
    });
  }
  if (err?.type === "entity.parse.failed" || err?.type === "entity.too.large") {
    return res.status(err.status || 400).json({ message: "Invalid request body." });
  }
  console.error("SERVER ERROR:", err?.message || err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Deckora backend running on http://localhost:${PORT} (model: ${MODEL})`);
  });
}

module.exports = app;
