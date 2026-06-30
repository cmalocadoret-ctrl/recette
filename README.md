# Ansamble — Recette logistique 3D

Mini-site de présentation interactif pour remplacer un PowerPoint classique.

## Stack

- React + Vite
- Three.js + @react-three/fiber + @react-three/drei
- GSAP pour les transitions d'écran
- CSS responsive premium / éditorial

## Lancer en local

```bash
npm install
npm run dev
```

## Build pour Vercel

```bash
npm run build
```

Sur Vercel : importer le dossier comme projet. Framework preset : **Vite**. Build command : `npm run build`. Output directory : `dist`.

## Navigation

- Flèche droite ou espace : avancer
- Flèche gauche : revenir
- N : ouvrir/fermer les notes orales
- F : plein écran
- R : rejouer

## Personnalisation rapide

- Textes principaux : `src/App.jsx`
- Couleurs / mise en page : `src/styles.css`
- Notes orales : objet `notes` dans `src/App.jsx`
- Ingrédients : tableau `ingredients` dans `src/App.jsx`
