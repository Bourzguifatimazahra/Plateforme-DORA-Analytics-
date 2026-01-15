#!/bin/bash

# ================== CONFIG ==================
OWNER="BourzguiFatimaZahra"
REPO="Plateforme-DORA-Analytics-"     
PROJECT_TITLE="Sprint 48h – DORA Analytics"

# ================== TEAM ==================
UIUX_DEV="SaFAA"
FRONTEND_LEAD="Aya-SAKKOUR"
API_DEV="FatimaZahra22"
DATA_ENGINEER="Ghizlane8"
AI_SPECIALIST="imanetag"
DEVOPS_ENGINEER="ILHAM"
BACKEND_LEAD="yasmineennachati"
QA_LEAD="BOURZGUIFATIMAZAHRA"

# ================== FUNCTIONS ==================
create_issue () {
  TITLE="$1"
  BODY="$2"
  ASSIGNEE="$3"

  gh issue create \
    --repo "$OWNER/$REPO" \
    --title "$TITLE" \
    --body "$BODY" \
    --assignee "$ASSIGNEE" \
    --json number \
    -q ".number"
}

# ================== CREATE ISSUES ==================
echo "Création des issues..."

I1=$(create_issue "Page Analyze — UI + formulaire" "Page d’analyse avec saisie URL repo, validation et envoi." $FRONTEND_LEAD)
I2=$(create_issue "Page Dashboard — layout principal" "Layout global du dashboard (KPI, charts, tables)." $FRONTEND_LEAD)

I3=$(create_issue "Composant KPI Card" "Affichage des métriques DORA." $UIUX_DEV)
I4=$(create_issue "Charts animés" "Graphiques avec Framer Motion." $UIUX_DEV)
I5=$(create_issue "Table stats développeurs" "Table responsive des performances." $UIUX_DEV)

I6=$(create_issue "API Analyze — calcul DORA" "Endpoint /api/analyze." $BACKEND_LEAD)
I7=$(create_issue "API Dashboard — récupération stats" "Endpoint /api/dashboard." $BACKEND_LEAD)
I8=$(create_issue "API Chat — assistant IA" "Endpoint /api/chat." $BACKEND_LEAD)

I9=$(create_issue "Intégration GitHub API" "Récupération commits, PR, merges." $API_DEV)
I10=$(create_issue "Intégration GitLab API" "Récupération commits, MR." $API_DEV)
I11=$(create_issue "Intégration Azure DevOps API" "Récupération données Azure." $API_DEV)

I12=$(create_issue "Normalisation des données" "Uniformisation des données multi-sources." $DATA_ENGINEER)
I13=$(create_issue "Calcul métriques DORA" "Deployment Frequency, Lead Time, MTTR, CFR." $DATA_ENGINEER)
I14=$(create_issue "Export PDF" "Génération des rapports PDF." $DATA_ENGINEER)

I15=$(create_issue "Assistant IA — recommandations" "Analyse intelligente + conseils DevOps." $AI_SPECIALIST)

I16=$(create_issue "Tests unitaires" "Tests API et frontend." $QA_LEAD)
I17=$(create_issue "Tests E2E" "Tests parcours utilisateur." $QA_LEAD)

I18=$(create_issue "CI/CD GitHub Actions" "Pipeline build, test, deploy." $DEVOPS_ENGINEER)

echo "Issues créées."

# ================== ADD TO PROJECT ==================
echo "Ajout des issues au projet..."

PROJECT_ID=$(gh project list --owner $OWNER --format json | jq -r ".projects[] | select(.title==\"$PROJECT_TITLE\") | .id")

for ISSUE in $I1 $I2 $I3 $I4 $I5 $I6 $I7 $I8 $I9 $I10 $I11 $I12 $I13 $I14 $I15 $I16 $I17 $I18
do
  gh project item-add $PROJECT_ID --owner $OWNER --repo $OWNER/$REPO --issue $ISSUE
done

echo "Toutes les cartes sont maintenant dans le projet 🎉"
