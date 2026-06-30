# Ma recette logistique — version 100 % 3D (sans photo)

Site immersif React / Vite : l'année logistique racontée comme une recette, avec marmite, four et assiette entièrement modélisés en **3D temps réel** (Three.js / @react-three/fiber). Plus aucune photo.

## Changements de cette version

- **Plus de photos** : hero, marmite, four et assiette sont des scènes 3D WebGL (suppression de la double image du hero et des visuels « pas pro »).
- **Marmite + ingrédients en 3D** : au clic, chaque ingrédient (données clients, volumes, tournées, régimes & menus, KPI) tombe réellement dans la marmite (trajectoire 3D + remplissage + jauge).
- **Cuisson** : four 3D avec chaleur, lueur et marmite à l'intérieur (l'ancienne photo de marmite est supprimée).
- **Dressage** : assiette dressée recréée en 3D (houmous, falafels, courge, chou-fleur, herbes) en rotation lente.
- **Thème recette filé partout** dans le script (la carte → la mise en place → les ingrédients → la cuisson → le dressage → le service).
- **Transitions animées entre sections** (rideau + révélation au scroll).
- **Responsive** revu (desktop, tablette, mobile).
- Aucune mention « Ansamble 2030 ».

## Architecture (inchangée)

```
ansamble-recette-3d/
├─ index.html
├─ package.json
├─ src/
│  ├─ main.jsx        # point d'entrée React
│  ├─ App.jsx         # sections + scènes 3D (R3F)
│  └─ styles.css      # styles + transitions + responsive
└─ public/assets/     # (vidé : plus de photos)
```

## Lancer en local

```bash
npm install
npm run dev
```

## Déployer sur Vercel

Framework preset : **Vite** · Build : `npm run build` · Output : `dist`

## Raccourcis

- Flèches ↑/↓ ou Espace : naviguer entre les sections
- `N` : notes orales · `F` : plein écran · `R` : revenir au début
