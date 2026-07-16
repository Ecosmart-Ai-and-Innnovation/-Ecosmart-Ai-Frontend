"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations, SUPPORTED_LANGUAGES, type LangCode } from "@/lib/translations";

type LanguageContextType = {
  currentLang: LangCode;
  setCurrentLang: (lang: LangCode) => void;
  t: (key: string, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function resolveTranslation(key: string, lang: LangCode): string {
  const parts = key.split(".");
  if (parts.length < 2) return key;

  const group = parts[0];
  const k = parts.slice(1).join(".");

  const langMap = (translations as any)[group]?.[k];
  if (!langMap) return key;

  return langMap[lang] || langMap["en"] || key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLangState] = useState<LangCode>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ecosmart-lang") as LangCode | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setCurrentLangState(saved);
    }
    setHydrated(true);
  }, []);

  const setCurrentLang = useCallback((lang: LangCode) => {
    setCurrentLangState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecosmart-lang", lang);
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      const resolved = resolveTranslation(key, currentLang);
      return resolved === key && fallback ? fallback : resolved;
    },
    [currentLang]
  );

  const value = useMemo(
    () => ({ currentLang, setCurrentLang, t }),
    [currentLang, setCurrentLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
