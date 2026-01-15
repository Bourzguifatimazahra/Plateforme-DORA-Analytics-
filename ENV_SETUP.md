# Configuration de l'environnement

## Fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec les clés API suivantes :

```env
# Gemini AI API Key (pour l'assistant IA)
GEMINI_API_KEY=AIzaSyDVSbQRoVY3e2w4Hf_Fv2hkJG62V8sBh1E

# GitHub API Token (optionnel mais recommandé pour éviter les rate limits)
# Sans token: 60 requêtes/heure
# Avec token: 5,000 requêtes/heure
GITHUB_TOKEN=your_github_personal_access_token_here
# ou
GITHUB_API_KEY=your_github_personal_access_token_here
```

## Tokens d'accès pour les dépôts privés

### GitHub
1. Allez sur https://github.com/settings/tokens
2. Cliquez sur "Generate new token (classic)"
3. Sélectionnez les permissions : `repo` (accès complet aux dépôts) pour les repos privés, ou aucune permission pour les repos publics
4. Copiez le token et :
   - Ajoutez-le dans votre fichier `.env.local` comme `GITHUB_TOKEN=votre_token`
   - OU utilisez-le dans le champ "Access Token" de l'interface
5. **Important** : Même pour les repos publics, un token augmente votre limite de 60 à 5,000 requêtes/heure

### GitLab
1. Allez sur https://gitlab.com/-/user_settings/personal_access_tokens
2. Créez un nouveau token avec les scopes : `api`, `read_repository`
3. Copiez le token et utilisez-le dans le champ "Access Token" de l'interface

### Azure DevOps
1. Allez sur https://dev.azure.com/{votre-organisation}/_usersSettings/tokens
2. Créez un nouveau token avec les permissions : `Code (Read)`
3. Copiez le token et utilisez-le dans le champ "Access Token" de l'interface

## Note importante

- Les tokens sont optionnels pour les dépôts publics
- Les tokens sont requis pour analyser des dépôts privés
- Ne partagez jamais vos tokens publiquement
- Le fichier `.env.local` est déjà dans `.gitignore` et ne sera pas commité
