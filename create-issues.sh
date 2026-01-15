 #!/bin/bash

# ----------- TEAM -----------
UIUX_DEV="SAFAA-UIUX-DEV"
FRONTEND_LEAD="Aya-SAKKOUR"
API_DEV="FatimaZahra22"
DATA_ENGINEER="Ghizlane8"
AI_SPECIALIST="imanetag"
DEVOPS_ENGINEER="ILHAM"
BACKEND_LEAD="yasmineennachati"
QA_LEAD="Bourzguifatimazahra"

# ---------- FRONTEND ----------
gh issue create -t "Page analyze — UI + formulaire repo" \
-b "Créer l’interface pour analyser un repository (input URL, validation, submit)." \
-a $FRONTEND_LEAD

gh issue create -t "Page dashboard — layout principal" \
-b "Créer le layout global du dashboard (KPI, charts, tables)." \
-a $FRONTEND_LEAD

# ---------- UI / UX ----------
gh issue create -t "KPI Card component" \
-b "Composant d’affichage des KPI DORA." \
-a $UIUX_DEV

gh issue create -t "Animated charts" \
-b "Graphiques animés avec Framer Motion." \
-a $UIUX_DEV

gh issue create -t "Developer stats table" \
-b "Table des performances développeurs." \
-a $UIUX_DEV

# ---------- BACKEND ----------
gh issue create -t "API analyze — calcul DORA" \
-b "Endpoint /api/analyze pour calculer les métriques DORA." \
-a $BACKEND_LEAD

gh issue create -t "API dashboard — fetch metrics" \
-b "Endpoint /api/dashboard pour récupérer les statistiques." \
-a $BACKEND_LEAD

gh issue create -t "API chat — assistant IA" \
-b "Endpoint /api/chat pour l’assistant intelligent." \
-a $BACKEND_LEAD

# ---------- INTEGRATIONS ----------
gh issue create -t "GitHub API integration" \
-b "Connexion à l’API GitHub pour récupérer commits, PR, merges." \
-a $API_DEV

gh issue create -t "GitLab API integration" \
-b "Connexion à l’API GitLab pour récupérer commits, MR." \
-a $API_DEV

gh issue create -t "Azure DevOps API integration" \
-b "Connexion à l’API Azure DevOps." \
-a $API_DEV

# ---------- DATA ----------
gh issue create -t "Normalisation des données" \
-b "Standardisation des données issues de GitHub, GitLab et Azure." \
-a $DATA_ENGINEER

gh issue create -t "Calcul métriques DORA" \
-b "Deployment Frequency, Lead Time, MTTR, Change Failure Rate." \
-a $DATA_ENGINEER

gh issue create -t "PDF export" \
-b "Génération automatique des rapports PDF." \
-a $DATA_ENGINEER

# ---------- AI ----------
gh issue create -t "Assistant IA — recommandations" \
-b "Analyse intelligente + conseils d’amélioration DevOps." \
-a $AI_SPECIALIST

# ---------- QA ----------
gh issue create -t "Tests unitaires" \
-b "Tests des API et composants frontend." \
-a $QA_LEAD

gh issue create -t "Tests E2E" \
-b "Tests du parcours utilisateur complet." \
-a $QA_LEAD

# ---------- DEVOPS ----------
gh issue create -t "CI/CD GitHub Actions" \
-b "Pipeline build, test et deploy (pnpm + Vercel)." \
-a $DEVOPS_ENGINEER
