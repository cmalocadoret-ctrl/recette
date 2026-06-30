# Ansamble — version corrigée Vercel

Cette version est volontairement livrée en **site statique pur** pour éviter l'erreur Vercel `npm install exited with 1`.

## Important
Pour déployer sur Vercel, remplace tous les fichiers de l'ancien dépôt par le contenu de ce dossier.
Supprime bien les anciens fichiers suivants s'ils existent encore :

- `package-lock.json`
- `package.json`
- `node_modules/`
- anciens dossiers `src/`, `dist/`, etc.

## Pourquoi le déploiement échouait
L'ancien ZIP contenait un `package-lock.json` généré dans l'environnement ChatGPT avec des URLs internes de type :
`packages.applied-caas-gateway1.internal.api.openai.org`.
Vercel ne peut pas accéder à cette registry, donc `npm install` part en timeout.

## Déploiement Vercel
Avec cette version :
- pas de dépendance npm,
- pas de `npm install`,
- pas de build nécessaire,
- `index.html` est directement servi.

Dans Vercel :
- Framework Preset : `Other`
- Build Command : laisser vide
- Output Directory : laisser vide ou `.`

## Corrections incluses
- Dressage corrigé : assiette/photo en relief visible sans WebGL.
- Plus de dépendance 3D externe.
- Version stable en production.
