"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

/* ================= TYPES ================= */

export type Language = "en" | "fr"

interface Translations {
  [key: string]: {
    en: string
    fr: string
  }
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

/* ================= DATA ================= */

export const translations: Translations = {
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.features": { en: "Features", fr: "Fonctionnalités" },
  "nav.about": { en: "About", fr: "À propos" },
  "nav.analyze": { en: "Analyze My Repos", fr: "Analyser Mes Repos" },

  "welcome.badge": {
    en: "DORA metrics from your repos – not a consulting deck",
    fr: "Des métriques DORA à partir de vos dépôts – pas un rapport de consulting",
  },

  // … garde TOUTES tes traductions ici, inchangées …
}

/* ================= CONTEXT ================= */

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const DEFAULT_LANGUAGE: Language = "en"

/* ================= PROVIDER ================= */

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)

  useEffect(() => {
    const saved = localStorage.getItem("language")
    if (saved === "en" || saved === "fr") {
      setLanguage(saved)
    }
  }, [])

  const setLang = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    const entry = translations[key]
    if (!entry) return key
    return entry[language] ?? entry[DEFAULT_LANGUAGE] ?? key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage: setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

/* ================= HOOK ================= */

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return ctx
}
