#!/bin/bash

# ================== CONFIG ==================
OWNER="Bourzguifatimazahra"
REPO="Plateforme-DORA-Analytics-"
PROJECT_TITLE="Sprint 48h – DORA Analytics"

# ================== TEAM ==================
UIUX_DEV="SAFAA-UIUX-DEV"
FRONTEND_LEAD="Aya-SAKKOUR"
API_DEV="FatimaZahra22"
DATA_ENGINEER="Ghizlane8"
AI_SPECIALIST="imanetag"
DEVOPS_ENGINEER="ILHAM"
BACKEND_LEAD="yasmineennachati"
QA_LEAD="BOURZGUIFATIMAZAHRA"

# ================== LABELS ==================
echo "Création des labels..."
gh label create frontend --repo $OWNER/$REPO -c "#1D4ED8" -d "Tâches Frontend" || true
gh label create backend --repo $OWNER/$REPO -c "#16A34A" -d "Tâches Backend" || true
gh label create uiux --repo $OWNER/$REPO -c "#9333EA" -d "UI / UX" || true
gh label create data --repo $OWNER/$REPO -c "#F59E0B" -d "Data & Metrics" || true
gh label create ai --repo $OWNER/$REPO -c "#EC4899" -d "Intelligence Artificielle" || true
gh label create devops --repo $OWNER/$REPO -c "#0F172A" -d "CI/CD & Infra" || true
gh label create qa --repo $OWNER/$REPO -c "#DC2626" -d "Qualité & Tests" || true

# ================== MILESTONES ==================
echo "Création des milestones..."
gh api repos/$OWNER/$REPO/milestones -f title="Sprint Jour 1" -f description="Fonctions core + UI + API"
gh api repos/$OWNER/$REPO/milestones -f title="Sprint Jour 2" -f description="IA, tests, finalisation"

# ================== FUNCTIONS ==================
create_issue () {
  TITLE="$1"
  BODY="$2"
  ASSIGNEE="$3"
  LABEL="$4"
  MILESTONE="$5"

  NUMBER=$(gh issue create \
    --repo "$OWNER/$REPO" \
    --title "$TITLE" \
    --body "$BODY" \
    --assignee "$ASSIGNEE" \
    --label "$LABEL" \
    --milestone "$MILESTONE" \
    --json number -q ".number")

  echo $NUMBER
}

# ================== CREATE ISSUES ==================
echo "Création des issues..."

I1=$(create_issue "Page Analyze — UI + formulaire" "Interface d’analyse avec saisie URL repo." $FRONTEND_LEAD frontend "Sprint Jour 1")
I2=$(create_issue "Page Dashboard — layout principal" "Structure principale du dashboard." $FRONTEND_LEAD frontend "Sprint Jour 1")

I3=$(create_issue "KPI Card component" "Composant KPI." $UIUX_DEV uiux "Sprint Jour 1")
I4=$(create_issue "Animated charts" "Graphiques animés." $UIUX_DEV uiux "Sprint Jour 1")
I5=$(create_issue "Developer stats table" "Table stats développeurs." $UIUX_DEV uiux "Sprint Jour 2")

I6=$(create_issue "API Analyze — calcul DORA" "Endpoint /api/analyze." $BACKEND_LEAD backend "Sprint Jour 1")
I7=$(create_issue "API Dashboard — metrics" "Endpoint /api/dashboard." $BACKEND_LEAD backend "Sprint Jour 1")
I8=$(create_issue "API Chat — assistant IA" "Endpoint /api/chat." $BACKEND_LEAD backend "Sprint Jour 2")

I9=$(create_issue "GitHub API integration" "Collecte données GitHub." $API_DEV backend "Sprint Jour 1")
I10=$(create_issue "GitLab API integration" "Collecte données GitLab." $API_DEV backend "Sprint Jour 2")
I11=$(create_issue "Azure DevOps integration" "Collecte données Azure." $API_DEV backend "Sprint Jour 2")

I12=$(create_issue "Normalisation des données" "Standardisation multi-sources." $DATA_ENGINEER data "Sprint Jour 1")
I13=$(create_issue "Calcul métriques DORA" "DF, LT, MTTR, CFR." $DATA_ENGINEER data "Sprint Jour 1")
I14=$(create_issue "Export PDF" "Rapports PDF automatiques." $DATA_ENGINEER data "Sprint Jour 2")

I15=$(create_issue "Assistant IA — recommandations" "Conseils intelligents." $AI_SPECIALIST ai "Sprint Jour 2")

I16=$(create_issue "Tests unitaires" "Tests API + frontend." $QA_LEAD qa "Sprint Jour 2")
I17=$(create_issue "Tests E2E" "Tests parcours complet." $QA_LEAD qa "Sprint Jour 2")

I18=$(create_issue "CI/CD GitHub Actions" "Pipeline build/test/deploy." $DEVOPS_ENGINEER devops "Sprint Jour 1")

# ================== ADD TO PROJECT ==================
echo "Ajout au Kanban..."

PROJECT_ID=$(gh project list --owner $OWNER --format json | jq -r ".projects[] | select(.title==\"$PROJECT_TITLE\") | .id")

for ISSUE in $I1 $I2 $I3 $I4 $I5 $I6 $I7 $I8 $I9 $I10 $I11 $I12 $I13 $I14 $I15 $I16 $I17 $I18
do
  gh project item-add $PROJECT_ID --owner $OWNER --repo $OWNER/$REPO --issue $ISSUE
done

echo "Setup Kanban terminé avec succès"
