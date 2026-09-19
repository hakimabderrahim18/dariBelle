import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import frTranslation from "./locales/fr.json";
import arTranslation from "./locales/ar.json";

const resources = {
  fr: { translation: frTranslation },
  ar: { translation: arTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    lng: localStorage.getItem("dari_belle_lang") || "fr",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Apply document direction
const applyDirection = (lang) => {
  const isRTL = lang === "ar";
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = lang;
  if (isRTL) {
    document.documentElement.classList.add("rtl");
    document.documentElement.classList.remove("ltr");
  } else {
    document.documentElement.classList.add("ltr");
    document.documentElement.classList.remove("rtl");
  }
};

applyDirection(i18n.language || "fr");

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("dari_belle_lang", lng);
  applyDirection(lng);
});

export default i18n;
