import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChefHat,
  Maximize,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react'

const scenes = [
  { id: 'hero', label: 'Accueil' },
  { id: 'themes', label: 'Méthode' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'oven', label: 'Cuisson' },
  { id: 'dressage', label: 'Dressage' },
  { id: 'conclusion', label: 'Conclusion' }
]

const notes = {
  hero: {
    title: 'Introduction',
    body:
      'Bonjour à tous. J’ai choisi de présenter mon année comme une recette logistique. Chez Ansamble, un bon résultat dépend des bons ingrédients, d’une bonne méthode et d’une exécution rigoureuse. Mon fil rouge a été de rendre les flux plus lisibles, les données plus fiables et les pratiques plus faciles à partager.'
  },
  themes: {
    title: 'Les grands axes',
    body:
      'Trois projets structurent l’année : la réorganisation logistique Grand Ouest pour passer à une vision multi-sites, la digitalisation du portage de repas pour fiabiliser le terrain, et Ansamble 2030 pour structurer la donnée logistique. La logique méthode reste la même : observer, cartographier, tester, standardiser.'
  },
  ingredients: {
    title: 'Les ingrédients',
    body:
      'Ici, les données deviennent des ingrédients concrets : clients, volumes, tournées, régimes et indicateurs. L’idée est simple : séparément, ce sont des informations éparses ; ensemble, elles nourrissent une vraie base de pilotage.'
  },
  oven: {
    title: 'La cuisson',
    body:
      'La cuisson symbolise le travail méthode. On transforme les constats terrain en décisions : observation, cartographie, structuration de la donnée, test de scénarios puis standardisation.'
  },
  dressage: {
    title: 'Le dressage',
    body:
      'Le dressage correspond aux bénéfices attendus : moins d’erreurs terrain, plus de visibilité sur les flux, des décisions plus rapides et des standards plus facilement partageables entre sites.'
  },
  conclusion: {
    title: 'Conclusion',
    body:
      'Cette année m’a montré qu’avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables. C’est cette base qui permettra d’accompagner le développement du portage et d’ancrer des standards plus robustes.'
  }
}

const ingredientItems = [
  {
    id: 'clients',
    number: '01',
    label: 'Données clients',
    short: 'Qui livrer, à quelle maille, client final ou bénéficiaire.',
    project: 'Base commune à tous les projets',
    position: { top: '18%', left: '7%' }
  },
  {
    id: 'volumes',
    number: '02',
    label: 'Volumes repas',
    short: 'Charge, répartition, équilibre entre ateliers.',
    project: 'Réorganisation Grand Ouest',
    position: { top: '18%', right: '6%' }
  },
  {
    id: 'kpi',
    number: '03',
    label: 'KPI & référentiels',
    short: 'Erreurs, coûts, temps opérationnels, référentiels communs.',
    project: 'Ansamble 2030',
    position: { top: '45%', right: '2%' }
  },
  {
    id: 'tournees',
    number: '04',
    label: 'Tournées multi-sites',
    short: 'Géographie, temps, capacités et organisation des flux.',
    project: 'Réorganisation Grand Ouest',
    position: { bottom: '16%', right: '7%' }
  },
  {
    id: 'menus',
    number: '05',
    label: 'Régimes & menus',
    short: 'Composition des sacs, choix menus et contraintes alimentaires.',
    project: 'Portage de repas',
    position: { bottom: '14%', left: '7%' }
  }
]

const methodSteps = [
  'Observer le terrain',
  'Cartographier les flux',
  'Structurer la donnée',
  'Tester les scénarios',
  'Standardiser'
]

function App() {
  const [scene, setScene] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  const next = () => setScene((s) => Math.min(scenes.length - 1, s + 1))
  const prev = () => setScene((s) => Math.max(0, s - 1))
  const replay = () => {
    setReplayKey((k) => k + 1)
    setScene(0)
    setNotesOpen(false)
  }

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault()
        next()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prev()
      }
      if (key === 'n') setNotesOpen((v) => !v)
      if (key === 'r') replay()
      if (key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const current = document.querySelector('.scene.is-active')
    if (!current) return
    gsap.fromTo(
      current.querySelectorAll('.reveal'),
      { y: 28, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.08 }
    )
  }, [scene, replayKey])

  return (
    <main className="site-shell" data-scene={scenes[scene].id}>
      <BackgroundLayer />
      <AmbientGrain />
      <TopBar
        scene={scene}
        setScene={setScene}
        onNotes={() => setNotesOpen(true)}
        onReplay={replay}
      />
      <Progress scene={scene} />

      <div className="scene-stage">
        <section className={`scene ${scene === 0 ? 'is-active' : ''}`}>
          {scene === 0 && <HeroScene onNext={next} />}
        </section>
        <section className={`scene ${scene === 1 ? 'is-active' : ''}`}>
          {scene === 1 && <ThemesScene />}
        </section>
        <section className={`scene ${scene === 2 ? 'is-active' : ''}`}>
          {scene === 2 && <IngredientsScene key={`ingredients-${replayKey}`} />}
        </section>
        <section className={`scene ${scene === 3 ? 'is-active' : ''}`}>
          {scene === 3 && <OvenScene />}
        </section>
        <section className={`scene ${scene === 4 ? 'is-active' : ''}`}>
          {scene === 4 && <DressageScene />}
        </section>
        <section className={`scene ${scene === 5 ? 'is-active' : ''}`}>
          {scene === 5 && <ConclusionScene onReplay={replay} />}
        </section>
      </div>

      <SceneControls scene={scene} onPrev={prev} onNext={next} />
      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} sceneId={scenes[scene].id} />
    </main>
  )
}

function BackgroundLayer() {
  return (
    <>
      <div className="site-bg" />
      <div className="site-overlay" />
    </>
  )
}

function AmbientGrain() {
  return <div className="ambient-grain" aria-hidden="true" />
}

function TopBar({ scene, setScene, onNotes, onReplay }) {
  return (
    <header className="topbar">
      <button className="brand-lockup" onClick={() => setScene(0)} aria-label="Retour à l'accueil">
        <span className="chef-dot"><ChefHat size={16} /></span>
        <span>
          <strong>ansamble</strong>
          <small>Cuisiner le collectif</small>
        </span>
      </button>

      <nav className="nav-dots" aria-label="Navigation principale">
        {scenes.map((item, index) => (
          <button key={item.id} className={index === scene ? 'active' : ''} onClick={() => setScene(index)}>
            <span>{index + 1}</span>
          </button>
        ))}
      </nav>

      <div className="top-actions">
        <button className="ghost-button" onClick={onNotes}><BookOpen size={16} /> Notes</button>
        <button className="primary-button compact" onClick={() => {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
          else document.exitFullscreen?.()
        }}><Maximize size={15} /> Plein écran</button>
        <button className="icon-button" onClick={onReplay} title="Rejouer"><RotateCcw size={16} /></button>
      </div>
    </header>
  )
}

function Progress({ scene }) {
  return (
    <div className="progress-line" aria-hidden="true">
      <span style={{ width: `${((scene + 1) / scenes.length) * 100}%` }} />
    </div>
  )
}

function SceneHeader({ eyebrow, title, accent, text, align = 'left' }) {
  return (
    <div className={`scene-header ${align}`}>
      <div className="eyebrow reveal">{eyebrow}</div>
      <h1 className="scene-title reveal">
        {title} {accent && <em>{accent}</em>}
      </h1>
      {text && <p className="scene-copy reveal">{text}</p>}
    </div>
  )
}

function HeroScene({ onNext }) {
  return (
    <div className="scene-wrap hero-scene">
      <div className="hero-visual" />
      <div className="hero-gradient" />
      <div className="hero-content">
        <div className="hero-chip reveal"><Sparkles size={14} /> Saison 2025/2026 · Projet logistique</div>
        <h1 className="hero-title reveal">
          Ma recette <br />
          <em>logistique</em>
        </h1>
        <p className="hero-copy reveal">
          Rendre les flux lisibles, les données fiables et les pratiques partageables.
        </p>
        <div className="hero-tags reveal">
          <span>Grand Ouest multi-sites</span>
          <span>Portage de repas</span>
          <span>Ansamble 2030</span>
        </div>
        <div className="hero-actions reveal">
          <button className="primary-button" onClick={onNext}>Lancer la recette <ArrowRight size={16} /></button>
          <span className="duration-pill">5 à 7 min</span>
        </div>
      </div>
      <div className="hero-note reveal">Un mini-site immersif : une seule direction artistique, plein écran, navigation fluide et notes masquées.</div>
    </div>
  )
}

function ThemesScene() {
  const cards = [
    {
      title: 'Réorganisation logistique Grand Ouest',
      text: 'Passer d’une vision locale à une vision globale des flux, des volumes et des capacités entre ateliers.'
    },
    {
      title: 'Digitalisation du portage de repas',
      text: 'Fiabiliser la préparation, guider l’opérateur et réduire les erreurs sans complexifier le terrain.'
    },
    {
      title: 'Structuration de la donnée — Ansamble 2030',
      text: 'Créer des référentiels utiles, des indicateurs communs et une base fiable pour piloter et standardiser.'
    },
    {
      title: 'Démarche méthode',
      text: 'Observer, cartographier, tester, puis transformer les constats terrain en standards partageables.'
    }
  ]

  return (
    <div className="scene-wrap themed-scene">
      <div className="content-shell wide">
        <SceneHeader
          eyebrow="Scène 02 · La méthode"
          title="Une année structurée en"
          accent="trois projets et une démarche."
          text="Même univers, même langage visuel : ici, on ne change pas de thème. On déroule la recette dans un seul site immersif."
        />

        <div className="themes-grid">
          {cards.map((card) => (
            <article className="theme-card reveal" key={card.title}>
              <span className="theme-index">•</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function IngredientsScene() {
  const [selectedId, setSelectedId] = useState('clients')
  const [added, setAdded] = useState([])
  const sceneRef = useRef(null)
  const potRef = useRef(null)

  const selected = useMemo(
    () => ingredientItems.find((item) => item.id === selectedId) ?? ingredientItems[0],
    [selectedId]
  )

  const handleIngredient = (item, event) => {
    setSelectedId(item.id)
    if (added.includes(item.id)) return

    const source = event.currentTarget.getBoundingClientRect()
    const pot = potRef.current?.getBoundingClientRect()
    if (!pot) return

    const fly = document.createElement('div')
    fly.className = 'ingredient-fly'
    document.body.appendChild(fly)

    const startX = source.left + source.width / 2
    const startY = source.top + source.height / 2
    const endX = pot.left + pot.width / 2
    const endY = pot.top + pot.height / 2 + 26

    gsap.set(fly, { x: startX, y: startY, scale: 1, opacity: 1 })
    gsap.to(fly, {
      duration: 0.8,
      x: endX,
      y: endY,
      scale: 0.28,
      ease: 'power2.inOut',
      onComplete: () => {
        fly.remove()
        setAdded((current) => [...current, item.id])
        gsap.fromTo(
          potRef.current,
          { scale: 1 },
          { scale: 1.05, duration: 0.22, yoyo: true, repeat: 1, ease: 'power1.inOut' }
        )
      }
    })
  }

  const count = added.length

  return (
    <div className="scene-wrap ingredients-scene" ref={sceneRef}>
      <div className="ingredients-backdrop" />
      <div className="ingredients-overlay" />
      <div className="ingredients-layout">
        <aside className="ingredient-side reveal">
          <div className="eyebrow">Scène 03 · Les ingrédients</div>
          <h1 className="scene-title compact">Les données entrent dans la <em>marmite.</em></h1>
          <p className="scene-copy compact">
            La marmite devient un vrai visuel réaliste et les ingrédients sont volontairement espacés tout autour pour éviter les superpositions.
          </p>

          <div className="selected-card">
            <span className="selected-kicker">Ingrédient sélectionné</span>
            <h3>{selected.label}</h3>
            <p>{selected.short}</p>
            <small>{selected.project}</small>
          </div>

          <div className="progress-card">
            <div className="mini-track"><span style={{ width: `${(count / ingredientItems.length) * 100}%` }} /></div>
            <strong>{count} / {ingredientItems.length}</strong>
            <p>Clique sur les ingrédients pour les ajouter à la marmite.</p>
          </div>
        </aside>

        <div className="pot-stage reveal">
          <div className={`pot-real ${count > 0 ? 'is-awake' : ''}`} ref={potRef} />
          <div className="pot-glow" />
          {ingredientItems.map((item) => (
            <button
              key={item.id}
              className={`ingredient-chip ${selectedId === item.id ? 'is-selected' : ''} ${added.includes(item.id) ? 'is-added' : ''}`}
              style={item.position}
              onClick={(event) => handleIngredient(item, event)}
            >
              <span className="dot" />
              <span className="ingredient-number">{item.number}</span>
              <span className="ingredient-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function OvenScene() {
  const [activeStep, setActiveStep] = useState(2)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((step) => (step + 1) % methodSteps.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="scene-wrap oven-scene">
      <div className="content-shell centered">
        <SceneHeader
          eyebrow="Scène 04 · La cuisson"
          title="Transformer les constats terrain en"
          accent="décisions."
          align="center"
        />

        <div className="oven-immersive reveal">
          <div className="oven-room">
            <div className="oven-shadow" />
            <div className="oven-box">
              <div className="oven-door" />
              <div className="oven-interior">
                <div className="heat haze-1" />
                <div className="heat haze-2" />
                <div className="heat haze-3" />
                <div className="pot-cutout" />
              </div>
            </div>
          </div>
        </div>

        <div className="method-pills reveal">
          {methodSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              className={index === activeStep ? 'active' : ''}
              onClick={() => setActiveStep(index)}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DressageScene() {
  const benefits = [
    'Moins d’erreurs terrain',
    'Meilleure visibilité des flux',
    'Décisions plus rapides',
    'Standards partageables entre sites',
    'Logistique plus robuste pour le portage'
  ]

  return (
    <div className="scene-wrap dressage-scene">
      <div className="content-shell dressage-layout">
        <div>
          <SceneHeader
            eyebrow="Scène 05 · Le dressage"
            title="Une logistique servie de façon"
            accent="claire et robuste."
            text="Le dressage n’est plus une slide finale : c’est une scène à part entière, avec une assiette en relief et une finition plus premium."
          />

          <ul className="benefits-list reveal">
            {benefits.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>
            ))}
          </ul>
        </div>

        <div className="plate-stage reveal">
          <div className="plate-cloche" />
          <div className="plate-shadow" />
          <div className="plate-3d">
            <div className="plate-rim" />
            <div className="plate-inner" />
            <div className="garnish garnish-a" />
            <div className="garnish garnish-b" />
            <div className="garnish garnish-c" />
            <div className="main-quenelle" />
            <div className="micro-herbs" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ConclusionScene({ onReplay }) {
  return (
    <div className="scene-wrap conclusion-scene">
      <div className="conclusion-overlay" />
      <div className="content-shell centered narrow">
        <div className="eyebrow reveal">Scène 06 · Conclusion</div>
        <blockquote className="closing-quote reveal">
          Avant d’optimiser une organisation, il faut d’abord rendre ses flux <em>lisibles</em>, ses données <em>fiables</em> et ses pratiques <em>partageables</em>.
        </blockquote>
        <button className="primary-button reveal" onClick={onReplay}>Revoir la recette <RotateCcw size={16} /></button>
      </div>
    </div>
  )
}

function SceneControls({ scene, onPrev, onNext }) {
  return (
    <div className="scene-controls">
      <button className="ghost-button" onClick={onPrev} disabled={scene === 0}><ArrowLeft size={16} /> Précédent</button>
      <button className="primary-button" onClick={onNext} disabled={scene === scenes.length - 1}>Suivant <ArrowRight size={16} /></button>
    </div>
  )
}

function NotesPanel({ open, onClose, sceneId }) {
  const data = notes[sceneId]

  return (
    <aside className={`notes-panel ${open ? 'open' : ''}`}>
      <button className="notes-close" onClick={onClose}><X size={18} /></button>
      <div className="notes-kicker">Notes orales</div>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
    </aside>
  )
}

export default App
