// src/i18n/useTranslate.js
import en from "./en.json";
import hi from "./hi.json";
import mr from "./mr.json";

const bundles = { EN: en || {}, HI: hi || {}, MR: mr || {} };
const cache = { EN: {}, HI: {}, MR: {} };

function aiTranslate(text, lang) {
  if (!text || lang === "EN") return text;

  const RULES = {
    HI: [
      ["Salary", "सैलरी"],
      ["Money", "पैसा"],
      ["Stress", "तनाव"],
      ["Invest", "निवेश"],
      ["Investment", "निवेश"],
      ["Bonus", "बोनस"],
      ["Month", "महीना"],
      ["Balance", "बैलेंस"],
      ["Scam", "धोखाधड़ी"],
      ["Credit Score", "क्रेडिट स्कोर"],
      ["Emergency", "आपातकाल"],
      ["Food", "खाद्य"]
    ],
    MR: [
      ["Salary", "पगार"],
      ["Money", "पैसा"],
      ["Stress", "तणाव"],
      ["Invest", "गुंतवणूक"],
      ["Investment", "गुंतवणूक"],
      ["Bonus", "बोनस"],
      ["Month", "महिना"],
      ["Balance", "शिल्लक"],
      ["Scam", "फसवणूक"],
      ["Credit Score", "क्रेडिट स्कोअर"],
      ["Emergency", "आपत्काल"],
      ["Food", "अन्न"]
    ]
  };

  let out = String(text);

  // add missing space after period if followed by capital letter (fixes "safely.Learn")
  out = out.replace(/([a-zA-Z])\.(?=[A-Z])/g, "$1. ");

  (RULES[lang] || []).forEach(([enWord, tr]) => {
    out = out.replace(new RegExp(enWord, "gi"), tr);
  });

  return out;
}

export default function useTranslate(language = "EN") {
  const lang = ["EN", "HI", "MR"].includes(language) ? language : "EN";
  const pack = bundles[lang];
  const phrases = (pack && pack._phrases) || {};

  function t(key, params) {
    const base = (pack && pack[key]) || (bundles.EN && bundles.EN[key]) || key;
    if (!params) return base;
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, "g"), String(v)),
      base
    );
  }

  function tx(text) {
    if (text == null) return "";
    const str = String(text);                 // guard if non-string slips in
    if (phrases[str]) return phrases[str];    // explicit json override
    if (cache[lang][str]) return cache[lang][str]; // memory cache

    const translated = aiTranslate(str, lang) || str;
    cache[lang][str] = translated;
    return translated;
  }

  return Object.assign(t, { tx });
}