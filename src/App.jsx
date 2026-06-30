import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, ChefHat, Maximize, RotateCcw, X } from 'lucide-react'
import { Ingredients3D, Oven3D, Plate3D, ThreeKitchen } from './ThreeKitchen.jsx'

const scenes = [
  { id: 'intro', label: 'Introduction' },
  { id: 'themes', label: 'Mise en place' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'oven', label: 'Cuisson' },
  { id: 'dressage', label: 'Dressage' }
]

const notes = {
  intro: {
    title: 'Introduction',
    body: `Bonjour à tous. J’ai choisi de présenter mon année comme une recette logistique, parce que chez Ansamble, on sait qu’un bon résultat dépend à la fois des bons ingrédients, d’une méthode claire et d’une exécution maîtrisée. Mon fil rouge cette année a été simple : rendre les flux plus lisibles, les données plus fiables et les pratiques plus partageables. L’idée n’est pas de montrer un tableau de bord ou une liste de tâches, mais de raconter comment plusieurs projets ont contribué à structurer notre façon de piloter la logistique.`
  },
  themes: {
    title: 'Mise en place',
    body: `Avant de cuisiner, il faut préparer le plan de travail. Cette mise en place correspond aux grands axes de mon année : d’abord une vision globale des flux avec le travail Grand Ouest et multi-sites ; ensuite la fiabilisation terrain autour du portage de repas ; puis la donnée comme matière première de pilotage ; enfin la démarche méthode, c’est-à-dire observer avant d’optimiser. Ces quatre axes donnent une cohérence à des projets très opérationnels.`
  },
  ingredients: {
    title: 'Ingrédients',
    body: `Dans cette scène, les données deviennent des ingrédients. Les données clients, les volumes repas, les tournées multi-sites, les régimes et menus, puis les KPI et référentiels ne sont pas des sujets isolés. Ils entrent ensemble dans la marmite pour construire une base de pilotage. Le clic illustre volontairement cette idée : une information seule ne suffit pas ; elle devient utile lorsqu’elle est structurée et reliée aux autres.`
  },
  oven: {
    title: 'Cuisson',
    body: `La cuisson représente le travail de transformation. À partir des constats terrain, il faut observer, cartographier les flux, structurer les données, tester des scénarios, puis proposer des standards. C’est là que l’on passe de la donnée brute et du ressenti terrain à une décision plus robuste. La méthode ne remplace pas le terrain, elle permet de mieux l’exploiter.`
  },
  dressage: {
    title: 'Dressage final',
    body: `Le dressage final, ce sont les bénéfices attendus : moins d’erreurs terrain, une meilleure visibilité des flux, des décisions plus rapides, des standards partageables entre sites et une logistique plus robuste pour accompagner le développement du portage. Ce que je retiens, c’est qu’avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables.`
  }
}

const ingredients = [
  { id: 'clients', n: '01', label: 'Données clients', text: 'Qui livrer, à quelle maille, client final ou bénéficiaire.' },
  { id: 'volumes', n: '02', label: 'Volumes repas', text: 'Charge, répartition et équilibre entre sites.' },
  { id: 'tournees', n: '03', label: 'Tournées multi-sites', text: 'Géographie, temps, capacités et organisation des flux.' },
  { id: 'menus', n: '04', label: 'Régimes & menus', text: 'Choix menus, régimes alimentaires et sécurité de préparation.' },
  { id: 'kpi', n: '05', label: 'KPI & référentiels', text: 'Erreurs, coûts, temps opérationnels et indicateurs de pilotage.' }
]

const benefits = [
  'Moins d’erreurs terrain',
  'Meilleure visibilité des flux',
  'Décisions plus rapides',
  'Standards partageables entre sites',
  'Logistique plus robuste pour le portage'
]

export default function App() {
  const [current, setCurrent] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const sectionRefs = useRef([])

  const goTo = (index) => {
    const next = Math.max(0, Math.min(scenes.length - 1, index))
    sectionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(Number(entry.target.dataset.index))
        })
      },
      { threshold: 0.55 }
    )
    sectionRefs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0
      document.documentElement.style.setProperty('--page-progress', `${progress}%`)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault()
        goTo(current + 1)
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        goTo(current - 1)
      }
      if (key === 'n') setNotesOpen((value) => !value)
      if (key === 'r') goTo(0)
      if (key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current])

  return (
    <main className="experience">
      <div className="grain" />
      <Header current={current} onGo={goTo} onNotes={() => setNotesOpen(true)} />
      <div className="progress-line"><span /></div>

      <Scene id="intro" index={0} refs={sectionRefs}>
        <IntroScene onStart={() => goTo(1)} />
      </Scene>
      <Scene id="themes" index={1} refs={sectionRefs}>
        <ThemesScene />
      </Scene>
      <Scene id="ingredients" index={2} refs={sectionRefs}>
        <IngredientsScene />
      </Scene>
      <Scene id="oven" index={3} refs={sectionRefs}>
        <OvenScene />
      </Scene>
      <Scene id="dressage" index={4} refs={sectionRefs}>
        <DressageScene onReplay={() => goTo(0)} />
      </Scene>

      <Controls current={current} onPrev={() => goTo(current - 1)} onNext={() => goTo(current + 1)} onReplay={() => goTo(0)} />
      <NotesPanel open={notesOpen} data={notes[scenes[current].id]} onClose={() => setNotesOpen(false)} />
    </main>
  )
}

function Header({ current, onGo, onNotes }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onGo(0)} aria-label="Retour au début">
        <span className="brand-badge"><ChefHat size={16} /></span>
        <span>
          <strong>ansamble</strong>
          <small>Cuisiner le collectif</small>
        </span>
      </button>

      <nav className="nav-steps" aria-label="Navigation">
        {scenes.map((scene, index) => (
          <button key={scene.id} className={index === current ? 'active' : ''} onClick={() => onGo(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {scene.label}
          </button>
        ))}
      </nav>

      <div className="top-actions">
        <button className="ghost-action" onClick={onNotes}><BookOpen size={15} /> Notes</button>
        <button
          className="solid-action"
          onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
            else document.exitFullscreen?.()
          }}
        >
          <Maximize size={15} /> Plein écran
        </button>
      </div>
    </header>
  )
}

function Scene({ id, index, refs, children }) {
  return (
    <section id={id} data-index={index} ref={(element) => (refs.current[index] = element)} className={`scene scene-${id}`}>
      {children}
    </section>
  )
}

function Kicker({ children }) {
  return <div className="kicker">{children}</div>
}

function IntroScene({ onStart }) {
  return (
    <div className="scene-inner hero-layout">
      <div className="hero-copy">
        <Kicker>Projet logistique · Saison 2025/2026</Kicker>
        <h1>Ma recette <em>logistique</em></h1>
        <p className="lead">Rendre les flux lisibles, les données fiables et les pratiques partageables.</p>
        <p className="soft-copy">Une expérience narrative premium pour présenter les projets phares de l’année, sans dashboard, sans frise statique et sans effet PowerPoint.</p>
        <div className="hero-actions">
          <button className="main-action" onClick={onStart}>Commencer la recette</button>
          <span>5 à 7 minutes · notes intégrées</span>
        </div>
      </div>
      <div className="canvas-card hero-card">
        <ThreeKitchen variant="hero" />
        <div className="canvas-caption">Une cuisine méthode : ingrédients, transformation, dressage.</div>
      </div>
    </div>
  )
}

function ThemesScene() {
  const themes = [
    ['01', 'Vision globale des flux', 'Grand Ouest, multi-sites, volumes, tournées.'],
    ['02', 'Fiabilisation terrain', 'Portage de repas, préparation, contrôle, cadence.'],
    ['03', 'Donnée utile et partageable', 'Référentiels fiables, indicateurs, pilotage commun.'],
    ['04', 'Observer avant d’optimiser', 'Terrain, cartographie, scénarios, standards.']
  ]

  return (
    <div className="scene-inner themes-layout">
      <div className="section-copy">
        <Kicker>La mise en place</Kicker>
        <h2>Préparer le plan de travail avant de <em>cuisiner les flux.</em></h2>
        <p className="lead">Chaque axe apparaît comme une étape de mise en place. Le détail reste porté à l’oral pour garder un écran lisible et professionnel.</p>
      </div>
      <div className="recipe-board" aria-label="Grands axes de l'année">
        <div className="board-line" />
        {themes.map(([number, title, text], index) => (
          <article key={number} className="theme-row" style={{ '--delay': `${index * 0.08}s` }}>
            <span className="theme-number">{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function IngredientsScene() {
  const [selected, setSelected] = useState(ingredients[0])
  const [added, setAdded] = useState([])
  const [lastIngredient, setLastIngredient] = useState(null)

  const progress = useMemo(() => `${(added.length / ingredients.length) * 100}%`, [added])

  const handleIngredient = (ingredient) => {
    setSelected(ingredient)
    setLastIngredient(`${ingredient.id}-${Date.now()}`)
    window.setTimeout(() => setLastIngredient(ingredient.id), 0)
    if (!added.includes(ingredient.id)) setAdded((items) => [...items, ingredient.id])
  }

  const reset = () => {
    setAdded([])
    setLastIngredient(null)
    setSelected(ingredients[0])
  }

  return (
    <div className="scene-inner ingredients-layout">
      <div className="section-copy narrow">
        <Kicker>Les ingrédients</Kicker>
        <h2>Les données entrent vraiment dans la <em>marmite.</em></h2>
        <p className="lead">Clique sur un ingrédient : il se matérialise en 3D, suit une trajectoire vers la marmite, disparaît dans la préparation et fait réagir la scène.</p>

        <div className="ingredient-info">
          <span>Ingrédient sélectionné</span>
          <h3>{selected.label}</h3>
          <p>{selected.text}</p>
        </div>
        <div className="recipe-progress">
          <div className="progress-track"><b style={{ width: progress }} /></div>
          <strong>{added.length} / {ingredients.length}</strong>
          <button onClick={reset}>Recommencer la marmite</button>
        </div>
      </div>

      <div className="ingredient-main">
        <div className="ingredient-canvas-shell">
          <Ingredients3D added={added.length} lastIngredient={lastIngredient?.split('-')[0]} />
        </div>
        <div className="ingredient-orbit">
          {ingredients.map((ingredient, index) => (
            <button
              key={ingredient.id}
              className={`ingredient-button i-${index + 1} ${selected.id === ingredient.id ? 'selected' : ''} ${added.includes(ingredient.id) ? 'added' : ''}`}
              onClick={() => handleIngredient(ingredient)}
            >
              <span>{ingredient.n}</span>
              {ingredient.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function OvenScene() {
  return (
    <div className="scene-inner oven-layout">
      <div className="section-copy">
        <Kicker>La cuisson</Kicker>
        <h2>Transformer les constats terrain en <em>décisions.</em></h2>
        <p className="lead">La marmite passe au four : les ingrédients ne sont plus des données isolées, ils deviennent une méthode de travail.</p>
        <div className="method-pills">
          {['Observer', 'Cartographier', 'Structurer', 'Tester', 'Standardiser'].map((step, index) => (
            <span key={step} className={index === 2 ? 'active' : ''}>{step}</span>
          ))}
        </div>
      </div>
      <div className="canvas-card oven-card">
        <Oven3D />
      </div>
    </div>
  )
}

function DressageScene({ onReplay }) {
  return (
    <div className="scene-inner dressage-layout">
      <div className="dressage-copy">
        <Kicker>Dressage final</Kicker>
        <h2>Une logistique servie de façon <em>claire et robuste.</em></h2>
        <p className="lead center">Le plat est recréé en 3D, sans photo, dans le même univers éditorial que la marmite et la cuisson.</p>
      </div>

      <div className="dressage-stage">
        <div className="plate-canvas">
          <Plate3D />
        </div>
        <div className="benefits-ring">
          {benefits.map((benefit, index) => (
            <article key={benefit} className={`benefit benefit-${index + 1}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{benefit}</p>
            </article>
          ))}
        </div>
      </div>

      <blockquote className="closing-quote">
        Avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables.
      </blockquote>
      <button className="main-action replay" onClick={onReplay}><RotateCcw size={16} /> Rejouer la recette</button>
    </div>
  )
}

function Controls({ current, onPrev, onNext, onReplay }) {
  return (
    <div className="scene-controls">
      <button onClick={onPrev} disabled={current === 0}><ArrowLeft size={16} /> Précédent</button>
      <button onClick={onReplay}><RotateCcw size={15} /> Rejouer</button>
      <button className="accent" onClick={onNext} disabled={current === scenes.length - 1}>Suivant <ArrowRight size={16} /></button>
    </div>
  )
}

function NotesPanel({ open, data, onClose }) {
  return (
    <aside className={`notes-panel ${open ? 'open' : ''}`}>
      <button className="close-notes" onClick={onClose}><X size={18} /></button>
      <Kicker>Notes orales</Kicker>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
    </aside>
  )
}
