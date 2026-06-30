# Ansamble — Ma recette logistique 2025/2026

Refonte complète du mini-site narratif premium.

## Lancer en local
```bash
npm install
npm run dev
```

## Déployer sur Vercel
- Framework preset : Vite
- Build command : `npm run build`
- Output directory : `dist`

Le dossier `dist/` est inclus : un build a déjà été vérifié.

## Navigation
- Boutons : Précédent, Suivant, Rejouer, Notes, Plein écran
- Clavier : flèche droite / espace pour avancer, flèche gauche pour revenir, N pour les notes, F pour le plein écran, R pour rejouer

## Refonte
- Architecture neuve React + Vite + Three.js
- Scènes plein écran successives
- 3D recréée en WebGL : marmite, ingrédients, four, dressage final
- Pas de photo pour la marmite, le four ou le dressage
- Suppression des références affichées à “Ansamble 2030”
- Responsive corrigé
