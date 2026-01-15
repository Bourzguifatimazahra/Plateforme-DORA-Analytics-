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
  "welcome.badge": {
    en: "DORA metrics from your repos – not a consulting deck",
    fr: "Des métriques DORA à partir de vos dépôts – pas un rapport de consulting",
  },
  "welcome.title.line1": { en: "Understand your delivery.", fr: "Comprenez vos livraisons." },
  "welcome.title.line2a": { en: "Stop guessing in", fr: "Arrêtez de deviner en" },
  "welcome.title.line2b": { en: "meetings.", fr: "réunion." },
  "welcome.subtitle": {
    en: "Most teams measure delivery too late – or not at all. We turn your Git history into a clear picture of how work moves from commit to production, so you can argue less and fix the real bottlenecks.",
    fr: "La plupart des équipes mesurent la livraison trop tard – ou pas du tout. Nous transformons votre historique Git en une vision claire de la façon dont le travail passe du commit à la production, afin que vous débattiez moins et que vous corrigiez les vrais goulots d'étranglement.",
  },
  "welcome.cta.metrics": { en: "See DORA metrics on a repo", fr: "Voir les métriques DORA d'un dépôt" },
  "welcome.cta.why": { en: "Why these metrics matter", fr: "Pourquoi ces métriques sont importantes" },
  "welcome.cta.demo": { en: "View demo", fr: "Voir la démo" },
  "welcome.stat.deployments": { en: "Deployments / week", fr: "Déploiements / semaine" },
  "welcome.stat.leadTime": { en: "Median lead time", fr: "Lead time médian" },
  "welcome.stat.changeFailure": { en: "Change failure rate", fr: "Taux d'échec des changements" },
  "welcome.stat.mttr": { en: "Median MTTR", fr: "MTTR médian" },
  "welcome.stat.sample": {
    en: "Sample metrics from demo",
    fr: "Métriques d'exemple issues de la démo",
  },

  // Features
  "features.title": { en: "What you actually get", fr: "Ce que vous obtenez vraiment" },
  "features.subtitle": {
    en: "Not another generic dashboard. A focused view on the four DORA metrics and the behavior behind them.",
    fr: "Pas un tableau de bord générique de plus. Une vue ciblée sur les quatre métriques DORA et les comportements qui les pilotent.",
  },
  "features.fastShip.title": { en: "See how fast you really ship", fr: "Voyez à quelle vitesse vous livrez vraiment" },
  "features.fastShip.desc": {
    en: "Track deployment frequency and lead time from real Git activity, not slide decks.",
    fr: "Suivez la fréquence de déploiement et le lead time à partir de l'activité Git réelle, pas de présentations.",
  },
  "features.teamPatterns.title": {
    en: "Understand team delivery patterns",
    fr: "Comprenez les modes de livraison de l'équipe",
  },
  "features.teamPatterns.desc": {
    en: "Spot who is overloaded, who is blocked, and how work actually flows through your pipelines.",
    fr: "Identifiez qui est surchargé, qui est bloqué et comment le travail circule réellement dans vos pipelines.",
  },
  "features.plainQuestions.title": {
    en: "Ask questions in plain language",
    fr: "Posez vos questions en langage naturel",
  },
  "features.plainQuestions.desc": {
    en: "Get explanations for weird spikes, fragile releases, and long review queues in simple terms.",
    fr: "Obtenez des explications claires pour les pics étranges, les releases fragiles et les longues files de revue.",
  },
  "features.reviewsPrepared.title": {
    en: "Walk into reviews prepared",
    fr: "Arrivez préparé en revue",
  },
  "features.reviewsPrepared.desc": {
    en: "Export a concise report that shows how delivery is going without 40 slides of fluff.",
    fr: "Exportez un rapport concis qui montre l'état de la livraison sans 40 slides inutiles.",
  },
  "features.acrossRepos.title": {
    en: "Look across repositories",
    fr: "Analysez plusieurs dépôts",
  },
  "features.acrossRepos.desc": {
    en: "Compare delivery across teams, services, or branches instead of arguing from anecdotes.",
    fr: "Comparez la livraison entre équipes, services ou branches plutôt que de débattre à partir d'anecdotes.",
  },
  "features.stayInMetrics.title": {
    en: "Stay in the metrics, not the tool",
    fr: "Restez dans les métriques, pas dans l'outil",
  },
  "features.stayInMetrics.desc": {
    en: "A focused view on delivery and reliability – no noisy widget zoo, no fake dashboards.",
    fr: "Une vue focalisée sur la livraison et la fiabilité – sans zoo de widgets ni faux tableaux de bord.",
  },

  // About / marketing copy
  "about.title": { en: "Why DORA metrics matter", fr: "Pourquoi les métriques DORA comptent" },
  "about.p1": {
    en: "Teams with healthy DORA metrics ship faster and break less. Teams without them spend meetings debating feelings instead of looking at data.",
    fr: "Les équipes avec de bonnes métriques DORA livrent plus vite et cassent moins. Sans ces métriques, les réunions se transforment en débats d'opinions plutôt qu'en analyse de données.",
  },
  "about.p2": {
    en: "Dora turns your Git and CI data into those four signals – deployment frequency, lead time, change failure rate, and recovery time – so you can see where delivery is stuck and what is improving.",
    fr: "Dora transforme vos données Git et CI en quatre signaux clés – fréquence de déploiement, lead time, taux d'échec des changements et temps de récupération – pour voir où la livraison bloque et ce qui s'améliore.",
  },
  "about.builtFor.title": { en: "Built for", fr: "Conçu pour" },
  "about.builtFor.devops": {
    en: "• DevOps and platform engineers who own the pipelines",
    fr: "• Les ingénieurs DevOps et plateforme responsables des pipelines",
  },
  "about.builtFor.managers": {
    en: "• Engineering managers who need an honest view of delivery",
    fr: "• Les managers techniques qui ont besoin d'une vision honnête de la livraison",
  },
  "about.builtFor.leads": {
    en: "• Tech leads who want to de-risk deployments without slowing teams down",
    fr: "• Les tech leads qui veulent réduire le risque des déploiements sans ralentir les équipes",
  },
  "about.cta": {
    en: "Try it on a public GitHub repo",
    fr: "Essayez-le sur un dépôt GitHub public",
  },

  // Final CTA
  "cta.title": { en: "Ready to optimize your DevOps?", fr: "Prêt à optimiser votre DevOps ?" },
  "cta.subtitle": {
    en: "Start analyzing your repositories today and get actionable insights powered by AI.",
    fr: "Commencez à analyser vos dépôts dès aujourd'hui et obtenez des insights actionnables grâce à l'IA.",
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
  "dashboard.reviews": { en: "Reviews", fr: "Revues" },
  "dashboard.deploys": { en: "Deploys", fr: "Déploiements" },
  "dashboard.refresh": { en: "Refresh", fr: "Actualiser" },
  "dashboard.newAnalysis": { en: "New Analysis", fr: "Nouvelle Analyse" },
  "dashboard.lastDay": { en: "Last Day", fr: "Dernier Jour" },
  "dashboard.lastWeek": { en: "Last Week", fr: "Dernière Semaine" },
  "dashboard.lastMonth": { en: "Last Month", fr: "Dernier Mois" },
  "dashboard.lastYear": { en: "Last Year", fr: "Dernière Année" },
  "dashboard.all": { en: "All", fr: "Tous" },

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
