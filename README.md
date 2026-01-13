 # 🚀 DORA Metrics MVP – Plan d'exécution 48h

<div align="center">

![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

## 🎯 Mission
**Prouver en 48h** que nous pouvons transformer l'activité GitHub en insights actionnables via les métriques DORA

---

## 📊 Scope Minimal Viable Product

### ✅ **INCLUS**
- ![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github) Un seul repository GitHub
- ![Clock](https://img.shields.io/badge/-30_jours-FF6B6B?style=flat-square) Données des 30 derniers jours
- ![Dashboard](https://img.shields.io/badge/-4_KPI_DORA-4ECDC4?style=flat-square) Les 4 KPI DORA simplifiés
- ![PDF](https://img.shields.io/badge/-Rapport_PDF-FF9F1C?style=flat-square) Génération de rapport PDF
- ![Rules](https://img.shields.io/badge/-Recommandations-6A0572?style=flat-square) Règles de recommandations simples

### ❌ **EXCLU** (pour ce MVP)
- Multiples sources Git (GitLab/Azure)
- Authentification avancée
- Intelligence Artificielle
- Mise à jour temps réel

---

## 🏗️ Architecture Technique

```
┌─────────────────┐
│   GitHub API    │
│    🐙           │
└────────┬────────┘
         │
┌────────▼────────┐
│  Backend Node.js│
│  🟢 Express     │
└────────┬────────┘
         │
┌────────▼────────┐
│   SQLite 🗄️     │
│   (MVP ready)   │
└────────┬────────┘
         │
┌────────▼────────┐    ┌──────────────┐
│  Frontend React │    │  PDF Service │
│  ⚛️ Vite + Tailwind│    │  🖨️ Puppeteer │
└─────────────────┘    └──────────────┘
```

---

## 🛠️ Stack Technologique

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white)

### **Frontend**
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square)

### **Services**
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=flat-square&logo=puppeteer&logoColor=white)
![GitHub API](https://img.shields.io/badge/GitHub_API-181717?style=flat-square&logo=github)

---

## 📈 Métriques DORA – Version MVP

| KPI | Calcul MVP | Source GitHub |
|-----|------------|---------------|
| **Deployment Frequency** | Nombre de releases / période | Releases |
| **Lead Time for Changes** | (date commit → date release) | Commits + Releases |
| **Change Failure Rate** | Issues `bug` fermées / releases totales | Issues + Releases |
| **MTTR** | Temps moyen issue ouverte → fermée | Issues |

---

## 🗂️ Structure du Projet

```
dora-mvp-48h/
├── backend/
│   ├── index.js              # Server principal
│   ├── github.service.js     # Intéraction GitHub API
│   ├── dora.service.js       # Calcul des métriques DORA
│   ├── pdf.service.js        # Génération PDF avec Puppeteer
│   └── database.js           # Configuration SQLite
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RepoSelector.jsx
│   │   │   └── Recommendations.jsx
│   │   ├── components/
│   │   │   ├── KPICard.jsx
│   │   │   └── SimpleChart.jsx
│   │   └── App.jsx
│   └── package.json
├── templates/
│   └── report.html           # Template HTML pour PDF
└── README.md
```

---

## 👥 Équipe Minimaliste

### **Option 1-2 personnes**
- **1 Développeur Fullstack** (Backend + Frontend)
- **1 Développeur Frontend** (UI/UX focus)

### **Option 3-4 personnes**
- **2 Backend** (API + Data processing)
- **1 Frontend** (Dashboard + PDF)
- **1 Support** (UI/Testing/Documentation)

---

## ⏰ Plan d'Exécution Heure par Heure

### **JOUR 1 – FONDATIONS & DATA**
**MATIN (08:00-12:00)**
```
08:00-09:00 → Setup environnement & repo
09:00-10:30 → Connexion GitHub API (token perso)
10:30-12:00 → Récupération commits, releases, issues
```

**APRÈS-MIDI (13:00-18:00)**
```
13:00-15:00 → Calcul métriques DORA (service)
15:00-16:30 → API endpoints /metrics, /repos
16:30-18:00 → Stockage SQLite & cache
```

**SOIR (19:00-22:00)**
```
19:00-21:00 → Template HTML rapport PDF
21:00-22:00 → Génération PDF fonctionnelle
```

### **JOUR 2 – INTERFACE & DÉMO**
**MATIN (08:00-12:00)**
```
08:00-10:00 → Dashboard React (Vite + Tailwind)
10:00-11:00 → Composants KPI Cards
11:00-12:00 → Graphique Recharts (déploiements/semaine)
```

**APRÈS-MIDI (13:00-18:00)**
```
13:00-14:30 → Page sélection repository
14:30-15:30 → Page recommandations (règles-based)
15:30-17:00 → Intégration bouton génération PDF
17:00-18:00 → UX polish & responsive design
```

**SOIR (19:00-22:00)**
```
19:00-20:30 → Nettoyage code & tests basiques
20:30-21:30 → README & documentation
21:30-22:00 → Préparation démo & pitch
```

---

## ✅ Critères de Succès MVP

- [ ] **Dashboard accessible** avec données réelles
- [ ] **4 KPI DORA** affichés et compréhensibles
- [ ] **Rapport PDF généré** en < 5 secondes
- [ ] **Recommandations contextuelles** basées sur seuils
- [ ] **Workflow complet** : repo → metrics → dashboard → PDF
- [ ] **Code prêt pour démo** avec README clair

---

## 🎤 Pitch de Démo (30 secondes)

> "Notre MVP transforme votre activité GitHub en métriques DORA actionnables en 2 clics. Visualisez vos performances, générez des rapports exécutifs, et recevez des recommandations concrètes pour améliorer la vélocité de votre équipe."

---

## 🔮 Prochaines Étapes (Post-MVP)

- ![GitLab](https://img.shields.io/badge/-GitLab-FC6D26?style=flat-square&logo=gitlab&logoColor=white) Support GitLab / Azure DevOps
- ![Auth](https://img.shields.io/badge/-Auth_OAuth-4285F4?style=flat-square&logo=google&logoColor=white) Authentification multi-tenant
- ![AI](https://img.shields.io/badge/-Predictions_ML-FF6B6B?style=flat-square&logo=openai&logoColor=white) Prédictions & recommandations IA
- ![Benchmark](https://img.shields.io/badge/-Benchmark-6A0572?style=flat-square) Benchmark inter-équipes

---

<div align="center">

**🚀 PRÊT À DÉMARRER ?**  
*48h pour prouver la valeur. Pas une minute de plus.*

</div>
