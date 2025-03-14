import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/locales/{{lng}}.json",
    },
    detection: {
      caches: [],
    },
    debug: import.meta.env.DEV,
    fallbackLng: "en",
    supportedLngs: ["en", "pl"],
    interpolation: { escapeValue: false },
  });

i18n.on("languageChanged", (lng) => (document.documentElement.lang = lng));

export default i18n;
