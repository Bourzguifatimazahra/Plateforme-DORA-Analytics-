"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "fr"

interface Translations {
  [key: string]: {
    en: string
    fr: string
  }
}

export const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.features": { en: "Features", fr: "Fonctionnalités" },
  "nav.about": { en: "About", fr: "À propos" },
  "nav.analyze": { en: "Analyze My Repos", fr: "Analyser Mes Repos" },

  // Welcome page
  "welcome.title": { en: "DevOps Intelligence", fr: "Intelligence DevOps" },
  "welcome.subtitle": {
    en: "Measure, analyze, and optimize your software delivery performance with DORA metrics",
    fr: "Mesurez, analysez et optimisez les performances de livraison logicielle avec les métriques DORA",
  },
  "welcome.cta": { en: "Get Started", fr: "Commencer" },
  "welcome.learnMore": { en: "Learn More", fr: "En savoir plus" },

  // Features
  "features.title": { en: "Powerful Features", fr: "Fonctionnalités Puissantes" },
  "features.subtitle": {
    en: "Everything you need to measure and improve your DevOps performance",
    fr: "Tout ce dont vous avez besoin pour mesurer et améliorer vos performances DevOps",
  },
  "features.dora.title": { en: "DORA Metrics", fr: "Métriques DORA" },
  "features.dora.desc": {
    en: "Track Deployment Frequency, Lead Time, Change Failure Rate, and MTTR",
    fr: "Suivez la fréquence de déploiement, le délai d'exécution, le taux d'échec et le MTTR",
  },
  "features.team.title": { en: "Team Analytics", fr: "Analytique d'Équipe" },
  "features.team.desc": {
    en: "Analyze developer contributions, commits, PRs, and review times",
    fr: "Analysez les contributions, commits, PRs et temps de revue des développeurs",
  },
  "features.ai.title": { en: "AI Assistant", fr: "Assistant IA" },
  "features.ai.desc": {
    en: "Get intelligent insights and recommendations powered by AI",
    fr: "Obtenez des analyses et recommandations intelligentes par l'IA",
  },
  "features.reports.title": { en: "PDF Reports", fr: "Rapports PDF" },
  "features.reports.desc": {
    en: "Generate comprehensive reports to share with stakeholders",
    fr: "Générez des rapports complets à partager avec les parties prenantes",
  },
  "features.multiRepo.title": { en: "Multi-Platform", fr: "Multi-Plateforme" },
  "features.multiRepo.desc": {
    en: "Support for GitHub, GitLab, and Azure DevOps repositories",
    fr: "Support pour GitHub, GitLab et Azure DevOps",
  },
  "features.interactive.title": { en: "Interactive Dashboards", fr: "Tableaux de Bord Interactifs" },
  "features.interactive.desc": {
    en: "Beautiful, animated visualizations with real-time data",
    fr: "Visualisations animées et interactives avec données en temps réel",
  },

  // Analyze page
  "analyze.title": { en: "Analyze Your Repository", fr: "Analysez Votre Dépôt" },
  "analyze.subtitle": {
    en: "Enter your project details to get comprehensive DORA metrics",
    fr: "Entrez les détails de votre projet pour obtenir des métriques DORA complètes",
  },
  "analyze.projectName": { en: "Project Name", fr: "Nom du Projet" },
  "analyze.projectPlaceholder": { en: "My Awesome Project", fr: "Mon Super Projet" },
  "analyze.repoUrl": { en: "Repository URL", fr: "URL du Dépôt" },
  "analyze.repoPlaceholder": { en: "https://github.com/owner/repo", fr: "https://github.com/proprietaire/depot" },
  "analyze.platform": { en: "Select Platform", fr: "Sélectionner la Plateforme" },
  "analyze.startAnalysis": { en: "Start Analysis", fr: "Démarrer l'Analyse" },
  "analyze.analyzing": { en: "Analyzing...", fr: "Analyse en cours..." },

  // Dashboard
  "dashboard.title": { en: "DORA Metrics Dashboard", fr: "Tableau de Bord DORA" },
  "dashboard.overview": { en: "Overview", fr: "Aperçu" },
  "dashboard.team": { en: "Team Performance", fr: "Performance de l'Équipe" },
  "dashboard.aiAssistant": { en: "AI Assistant", fr: "Assistant IA" },
  "dashboard.exportPdf": { en: "Export PDF", fr: "Exporter PDF" },
  "dashboard.period": { en: "Last 90 days", fr: "90 derniers jours" },

  // KPIs
  "kpi.deploymentFrequency": { en: "Deployment Frequency", fr: "Fréquence de Déploiement" },
  "kpi.deploymentFrequency.desc": {
    en: "Number of deployments to production per week",
    fr: "Nombre de déploiements en production par semaine",
  },
  "kpi.leadTime": { en: "Lead Time for Changes", fr: "Délai de Mise en Production" },
  "kpi.leadTime.desc": {
    en: "Time from commit to production deployment",
    fr: "Temps entre le commit et le déploiement en production",
  },
  "kpi.changeFailureRate": { en: "Change Failure Rate", fr: "Taux d'Échec des Changements" },
  "kpi.changeFailureRate.desc": {
    en: "Percentage of deployments causing failures",
    fr: "Pourcentage de déploiements causant des échecs",
  },
  "kpi.mttr": { en: "Mean Time to Restore", fr: "Temps Moyen de Restauration" },
  "kpi.mttr.desc": {
    en: "Average time to recover from failures",
    fr: "Temps moyen pour récupérer d'un échec",
  },

  // Ratings
  "rating.elite": { en: "Elite", fr: "Élite" },
  "rating.high": { en: "High", fr: "Élevé" },
  "rating.medium": { en: "Medium", fr: "Moyen" },
  "rating.low": { en: "Low", fr: "Faible" },

  // Developer stats
  "dev.commits": { en: "Commits", fr: "Commits" },
  "dev.pullRequests": { en: "Pull Requests", fr: "Pull Requests" },
  "dev.avgReviewTime": { en: "Avg Review Time", fr: "Temps de Revue Moyen" },
  "dev.contribution": { en: "Contribution", fr: "Contribution" },
  "dev.tasksRealized": { en: "Tasks Realized", fr: "Tâches Réalisées" },
  "dev.search": { en: "Search developers...", fr: "Rechercher des développeurs..." },

  // AI Assistant
  "ai.placeholder": { en: "Ask about your DevOps metrics...", fr: "Posez une question sur vos métriques DevOps..." },
  "ai.suggestions": { en: "Suggested questions:", fr: "Questions suggérées:" },
  "ai.q1": {
    en: "Why did deployment frequency decrease last week?",
    fr: "Pourquoi la fréquence de déploiement a-t-elle diminué la semaine dernière?",
  },
  "ai.q2": {
    en: "Which repository has the highest failure rate?",
    fr: "Quel dépôt a le taux d'échec le plus élevé?",
  },
  "ai.q3": { en: "How can we reduce lead time for changes?", fr: "Comment réduire le délai de mise en production?" },
  "ai.q4": { en: "Who are the top contributors this month?", fr: "Qui sont les principaux contributeurs ce mois-ci?" },

  // Common
  "common.loading": { en: "Loading...", fr: "Chargement..." },
  "common.error": { en: "Error", fr: "Erreur" },
  "common.perWeek": { en: "per week", fr: "par semaine" },
  "common.hours": { en: "hours", fr: "heures" },
  "common.days": { en: "days", fr: "jours" },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "fr")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language] || translation.en || key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
