import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, ChefHat, Maximize, RotateCcw, X } from 'lucide-react'

const SCENES = [
  { id: 'intro', nav: 'Accueil', eyebrow: 'Scène 01 · Entrée en matière' },
  { id: 'mise-en-place', nav: 'Mise en place', eyebrow: 'Scène 02 · Mise en place' },
  { id: 'ingredients', nav: 'Ingrédients', eyebrow: 'Scène 03 · Ingrédients' },
  { id: 'cuisson', nav: 'Cuisson', eyebrow: 'Scène 04 · Cuisson' },
  { id: 'dressage', nav: 'Dressage', eyebrow: 'Scène 05 · Dressage' },
]

const NOTES = {
  intro: {
    title: 'Ouverture',
    text:
      "Bonjour à tous. J’ai choisi de présenter mon année sous la forme d’une recette, parce que chez Ansamble, un bon résultat dépend toujours du bon dosage : les bons ingrédients, une méthode claire, et une exécution rigoureuse sur le terrain. Mon fil rouge cette année a été simple : rendre les flux plus lisibles, les données plus fiables, et les pratiques plus faciles à partager entre les sites."
  },
  'mise-en-place': {
    title: 'La mise en place',
    text:
      "Avant de cuisiner, il faut préparer le plan de travail. Pour moi, cela correspond aux grands axes de l’année : mieux comprendre les flux du Grand Ouest, fiabiliser le terrain autour du portage de repas, rendre la donnée vraiment utile, et surtout observer avant d’optimiser. L’idée n’est pas de plaquer une solution, mais de comprendre le terrain avant de proposer des standards."
  },
  ingredients: {
    title: 'Les ingrédients',
    text:
      "Dans cette scène, chaque ingrédient représente une donnée ou une contrainte logistique : les clients, les volumes, les tournées, les régimes et menus, puis les indicateurs. Séparément, ce sont des informations dispersées. Une fois réunies, elles deviennent une base de pilotage capable d’aider à mieux préparer, mieux livrer et mieux décider."
  },
  cuisson: {
    title: 'La cuisson',
    text:
      "La cuisson représente le travail méthode : on part de constats terrain, on cartographie les flux, on structure les données, on teste des scénarios, puis on transforme ce travail en standards plus robustes. C’est le passage entre l’observation et la décision opérationnelle."
  },
  dressage: {
    title: 'Le dressage',
    text:
      "Le dressage final correspond aux bénéfices attendus : moins d’erreurs sur le terrain, une meilleure visibilité des flux, des décisions plus rapides, et des standards plus faciles à partager entre les sites. Cette année m’a surtout montré qu’avant d’optimiser une organisation, il faut rendre ses flux lisibles, ses données fiables et ses pratiques partageables."
  }
}

const METHOD_ITEMS = [
  {
    number: '01',
    title: 'Vision globale des flux',
    text: 'Réorganisation logistique Grand Ouest et lecture multi-sites des volumes, clients et tournées.'
  },
  {
    number: '02',
    title: 'Fiabilisation terrain',
    text: 'Digitalisation du portage de repas pour sécuriser la préparation sans complexifier l’opérationnel.'
  },
  {
    number: '03',
    title: 'Donnée utile',
    text: 'Référentiels fiables, indicateurs communs et base solide pour piloter les décisions.'
  },
  {
    number: '04',
    title: 'Observer avant d’optimiser',
    text: 'Aller au terrain, cartographier les flux réels, tester puis seulement standardiser.'
  },
]

const INGREDIENTS = [
  {
    id: 'clients',
    number: '01',
    label: 'Données clients',
    caption: 'Qui livrer, à quelle maille, client final ou bénéficiaire.',
    type: 'peas',
    position: 'pos-a'
  },
  {
    id: 'volumes',
    number: '02',
    label: 'Volumes repas',
    caption: 'Charge, répartition et équilibre entre sites.',
    type: 'carrot',
    position: 'pos-b'
  },
  {
    id: 'routes',
    number: '03',
    label: 'Tournées multi-sites',
    caption: 'Géographie, temps, capacités et organisation des flux.',
    type: 'route',
    position: 'pos-c'
  },
  {
    id: 'menus',
    number: '04',
    label: 'Régimes & menus',
    caption: 'Composition des sacs, choix menus et sécurité de préparation.',
    type: 'herb',
    position: 'pos-d'
  },
  {
    id: 'kpi',
    number: '05',
    label: 'KPI & référentiels',
    caption: 'Erreurs, coûts, temps opérationnels et indicateurs de pilotage.',
    type: 'grain',
    position: 'pos-e'
  },
]

const BENEFITS = [
  'Moins d’erreurs terrain',
  'Meilleure visibilité des flux',
  'Décisions plus rapides',
  'Standards partageables',
  'Logistique plus robuste pour le portage'
]

const COOKING_STEPS = ['Observer', 'Cartographier', 'Structurer', 'Tester', 'Standardiser']

export default function App() {
  const [scene, setScene] = useState(0)
  const [direction, setDirection] = useState('next')
  const [notesOpen, setNotesOpen] = useState(false)
  const lockedRef = useRef(false)

  const goTo = (target) => {
    setScene((current) => {
      const next = Math.max(0, Math.min(SCENES.length - 1, target))
      if (next === current) return current
      setDirection(next > current ? 'next' : 'prev')
      return next
    })
  }

  const next = () => goTo(scene + 1)
  const prev = () => goTo(scene - 1)
  const replay = () => {
    setDirection('prev')
    setScene(0)
  }

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault()
        next()
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        prev()
      }
      if (key === 'n') setNotesOpen((open) => !open)
      if (key === 'r') replay()
      if (key === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scene])

  useEffect(() => {
    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 40 || lockedRef.current) return
      lockedRef.current = true
      if (event.deltaY > 0) next()
      else prev()
      setTimeout(() => {
        lockedRef.current = false
      }, 900)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [scene])

  return (
    <main className="experience-shell" data-scene={SCENES[scene].id}>
      <div className="paper-grain" />
      <Header scene={scene} onNav={goTo} onNotes={() => setNotesOpen(true)} onReplay={replay} />
      <div className="progress-track"><span style={{ width: `${((scene + 1) / SCENES.length) * 100}%` }} /></div>

      <section className={`scene-frame ${direction}`} key={SCENES[scene].id}>
        {scene === 0 && <IntroScene onNext={next} />}
        {scene === 1 && <MethodScene />}
        {scene === 2 && <IngredientsScene />}
        {scene === 3 && <CookingScene />}
        {scene === 4 && <DressageScene onReplay={replay} />}
      </section>

      <Controls scene={scene} onPrev={prev} onNext={next} />
      <NotesPanel open={notesOpen} data={NOTES[SCENES[scene].id]} onClose={() => setNotesOpen(false)} />
    </main>
  )
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
  else document.exitFullscreen?.()
}

function Header({ scene, onNav, onNotes, onReplay }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNav(0)} aria-label="Revenir à l’accueil">
        <span className="brand-mark"><ChefHat size={16} /></span>
        <span>
          <strong>ansamble</strong>
          <small>Cuisiner le collectif</small>
        </span>
      </button>

      <nav className="scene-nav" aria-label="Navigation par scènes">
        {SCENES.map((item, index) => (
          <button key={item.id} className={scene === index ? 'active' : ''} onClick={() => onNav(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.nav}
          </button>
        ))}
      </nav>

      <div className="top-actions">
        <button className="ghost-button" onClick={onNotes}><BookOpen size={15} /> Notes</button>
        <button className="primary-button compact" onClick={toggleFullscreen}><Maximize size={15} /> Plein écran</button>
        <button className="icon-button" onClick={onReplay} aria-label="Rejouer"><RotateCcw size={16} /></button>
      </div>
    </header>
  )
}

function Controls({ scene, onPrev, onNext }) {
  return (
    <div className="controls">
      <button className="ghost-button" disabled={scene === 0} onClick={onPrev}><ArrowLeft size={15} /> Précédent</button>
      <button className="primary-button" disabled={scene === SCENES.length - 1} onClick={onNext}>Suivant <ArrowRight size={15} /></button>
    </div>
  )
}

function IntroScene({ onNext }) {
  return (
    <div className="scene-content hero-scene">
      <EditorialBackdrop />
      <div className="hero-copy reveal-stack">
        <div className="eyebrow">Scène 01 · Recette logistique</div>
        <h1>Ma recette <em>logistique</em> 2025/2026</h1>
        <p>Rendre les flux lisibles, les données fiables et les pratiques partageables.</p>
        <div className="hero-actions">
          <button className="primary-button large" onClick={onNext}>Commencer la recette <ArrowRight size={17} /></button>
          <span>5 à 7 minutes · support oral interactif</span>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="recipe-card">
          <div className="recipe-card-top" />
          <div className="recipe-card-line large" />
          <div className="recipe-card-line" />
          <div className="recipe-card-line short" />
        </div>
        <IngredientStillLife />
      </div>
    </div>
  )
}

function MethodScene() {
  return (
    <div className="scene-content method-scene">
      <div className="method-copy reveal-stack">
        <div className="eyebrow">Scène 02 · La mise en place</div>
        <h2>Préparer le plan de travail avant de <em>cuisiner les flux.</em></h2>
        <p>Quatre partis pris structurent l’année. Le détail reste dans les notes, l’écran garde uniquement les décisions fortes.</p>
      </div>

      <div className="method-board">
        <div className="board-surface" />
        <div className="thin-spoon" />
        <div className="method-items">
          {METHOD_ITEMS.map((item, index) => (
            <article className="method-item" key={item.number} style={{ '--delay': `${index * 110}ms` }}>
              <span className="method-number">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function IngredientsScene() {
  const [selected, setSelected] = useState(INGREDIENTS[0])
  const [added, setAdded] = useState([])
  const potRef = useRef(null)
  const stageRef = useRef(null)

  const progress = Math.round((added.length / INGREDIENTS.length) * 100)

  const addIngredient = (item, event) => {
    setSelected(item)
    if (added.includes(item.id)) return

    const source = event.currentTarget.querySelector('.ingredient-visual')?.getBoundingClientRect()
    const target = potRef.current?.getBoundingClientRect()
    if (source && target) animateIngredientFlight(item.type, source, target)

    window.setTimeout(() => {
      setAdded((current) => [...current, item.id])
      emitParticles(target)
    }, 520)
  }

  const allAdded = added.length === INGREDIENTS.length

  return (
    <div className="scene-content ingredients-scene" ref={stageRef}>
      <div className="ingredients-copy reveal-stack">
        <div className="eyebrow">Scène 03 · Les ingrédients</div>
        <h2>Les données entrent dans la <em>marmite.</em></h2>
        <p>Chaque ingrédient est une donnée terrain. Clique dessus : il se détache, suit une trajectoire courbe et alimente la recette.</p>

        <div className="selected-panel">
          <span>Ingrédient sélectionné</span>
          <h3>{selected.label}</h3>
          <p>{selected.caption}</p>
        </div>
        <div className="recipe-progress" aria-label="Progression de la recette">
          <div><strong>{added.length}</strong><span>/ {INGREDIENTS.length}</span></div>
          <div className="progress-bar"><b style={{ width: `${progress}%` }} /></div>
          <small>{allAdded ? 'La base de pilotage est prête.' : 'Ajoute les ingrédients à la marmite.'}</small>
        </div>
      </div>

      <div className="ingredient-theatre">
        <div className="theatre-plane" />
        <div className={`premium-pot ${added.length > 0 ? 'awake' : ''}`} ref={potRef}>
          <PremiumPot fill={progress} />
        </div>
        {INGREDIENTS.map((item) => (
          <button
            key={item.id}
            className={`ingredient-button ${item.position} ${selected.id === item.id ? 'selected' : ''} ${added.includes(item.id) ? 'added' : ''}`}
            onClick={(event) => addIngredient(item, event)}
          >
            <IngredientVisual type={item.type} />
            <span className="ingredient-text"><b>{item.number}</b>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CookingScene() {
  return (
    <div className="scene-content cooking-scene">
      <div className="cooking-copy reveal-stack">
        <div className="eyebrow">Scène 04 · Au four</div>
        <h2>Transformer les constats terrain en <em>décisions.</em></h2>
        <p>La recette passe au four : les ingrédients deviennent une méthode de travail claire et réutilisable.</p>
        <div className="method-pills">
          {COOKING_STEPS.map((step, index) => <span key={step} style={{ '--delay': `${index * 260}ms` }}>{step}</span>)}
        </div>
      </div>

      <div className="oven-theatre" aria-hidden="true">
        <PremiumOven />
      </div>
    </div>
  )
}

function DressageScene({ onReplay }) {
  return (
    <div className="scene-content dressage-scene">
      <div className="dressage-header reveal-stack">
        <div className="eyebrow">Scène 05 · Dressage final</div>
        <h2>Le résultat se sert de façon <em>claire</em> et professionnelle.</h2>
        <p>Le dressage est recréé en illustration 3D éditoriale : pas de photo, pas de rendu gadget.</p>
      </div>

      <div className="dressage-theatre">
        <Dish3D />
        {BENEFITS.map((benefit, index) => (
          <div className={`benefit-chip benefit-${index + 1}`} key={benefit} style={{ '--delay': `${index * 110}ms` }}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{benefit}</p>
          </div>
        ))}
      </div>

      <div className="final-quote">
        <p>« Avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables. »</p>
        <button className="ghost-button" onClick={onReplay}><RotateCcw size={15} /> Rejouer la recette</button>
      </div>
    </div>
  )
}

function NotesPanel({ open, data, onClose }) {
  return (
    <aside className={`notes-panel ${open ? 'open' : ''}`}>
      <button className="notes-close" onClick={onClose} aria-label="Fermer les notes"><X size={18} /></button>
      <div className="eyebrow">Notes orales</div>
      <h3>{data.title}</h3>
      <p>{data.text}</p>
    </aside>
  )
}

function EditorialBackdrop() {
  return (
    <div className="editorial-backdrop" aria-hidden="true">
      <span className="botanical b1" />
      <span className="botanical b2" />
      <span className="botanical b3" />
      <span className="line-art l1" />
      <span className="line-art l2" />
    </div>
  )
}

function IngredientStillLife() {
  return (
    <div className="still-life">
      <div className="still-board" />
      <div className="still-item peas"><IngredientVisual type="peas" /></div>
      <div className="still-item carrot"><IngredientVisual type="carrot" /></div>
      <div className="still-item herb"><IngredientVisual type="herb" /></div>
      <div className="still-item grain"><IngredientVisual type="grain" /></div>
      <div className="still-spoon" />
    </div>
  )
}

function IngredientVisual({ type }) {
  if (type === 'peas') {
    return (
      <svg className="ingredient-visual" viewBox="0 0 120 95" aria-hidden="true">
        <defs>
          <radialGradient id="peasG" cx="35%" cy="30%"><stop offset="0" stopColor="#BEE882"/><stop offset="1" stopColor="#4D8C41"/></radialGradient>
          <linearGradient id="bowlG" x1="0" x2="1"><stop offset="0" stopColor="#F6E4C9"/><stop offset="1" stopColor="#CDB18E"/></linearGradient>
        </defs>
        <ellipse cx="60" cy="68" rx="48" ry="17" fill="#9B7D58" opacity=".28"/>
        <path d="M22 36h76l-10 33c-3 9-11 14-28 14s-25-5-28-14L22 36Z" fill="url(#bowlG)"/>
        <ellipse cx="60" cy="36" rx="38" ry="16" fill="#F7E7CF" stroke="#BFA17D" strokeWidth="2"/>
        {[36,48,60,72,84,43,55,67,79].map((x, i) => <circle key={i} cx={x} cy={32 + (i % 3) * 6} r="5.8" fill="url(#peasG)" />)}
      </svg>
    )
  }
  if (type === 'carrot') {
    return (
      <svg className="ingredient-visual" viewBox="0 0 120 95" aria-hidden="true">
        <defs>
          <linearGradient id="carrotG" x1="0" x2="1"><stop offset="0" stopColor="#F6A04D"/><stop offset="1" stopColor="#D45F2C"/></linearGradient>
          <linearGradient id="leafG" x1="0" x2="1"><stop offset="0" stopColor="#7FB46B"/><stop offset="1" stopColor="#2D5F3D"/></linearGradient>
        </defs>
        <ellipse cx="59" cy="72" rx="45" ry="12" fill="#8D6540" opacity=".20"/>
        <path d="M58 31c-10 9-22 35-24 48 13-4 43-22 57-39-9-2-23-7-33-9Z" fill="url(#carrotG)"/>
        <path d="M58 31c-4-14-12-19-23-22 1 9 8 18 23 22Z" fill="url(#leafG)"/>
        <path d="M60 31c3-15 12-23 27-26-2 13-11 21-27 26Z" fill="url(#leafG)"/>
        <path d="M52 48l21 4M45 61l18 3" stroke="#A94B29" strokeWidth="2" opacity=".55"/>
      </svg>
    )
  }
  if (type === 'route') {
    return (
      <svg className="ingredient-visual" viewBox="0 0 120 95" aria-hidden="true">
        <defs>
          <linearGradient id="routeG" x1="0" x2="1"><stop offset="0" stopColor="#EAD8BC"/><stop offset="1" stopColor="#C5A27C"/></linearGradient>
        </defs>
        <ellipse cx="62" cy="72" rx="46" ry="13" fill="#8D6540" opacity=".18"/>
        <path d="M21 38c24-19 54-19 78 0v32c-22 12-52 12-78 0V38Z" fill="url(#routeG)"/>
        <path d="M36 65c11-27 34-26 48-8" fill="none" stroke="#203628" strokeWidth="5" strokeLinecap="round"/>
        <path d="M51 66c8-19 21-19 31-6" fill="none" stroke="#F9F2E7" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round"/>
        <circle cx="35" cy="65" r="8" fill="#C66A3A"/><circle cx="87" cy="55" r="8" fill="#365642"/>
      </svg>
    )
  }
  if (type === 'herb') {
    return (
      <svg className="ingredient-visual" viewBox="0 0 120 95" aria-hidden="true">
        <defs>
          <linearGradient id="herbStem" x1="0" x2="1"><stop offset="0" stopColor="#83B16E"/><stop offset="1" stopColor="#284F37"/></linearGradient>
        </defs>
        <ellipse cx="61" cy="74" rx="42" ry="12" fill="#8D6540" opacity=".18"/>
        <path d="M35 75c10-26 20-43 34-62M58 75c3-24 15-43 31-58M75 75c-3-21 1-37 9-51" stroke="url(#herbStem)" strokeWidth="4" strokeLinecap="round"/>
        {[[40,55],[47,42],[57,36],[67,25],[76,42],[84,31],[86,53],[68,56]].map(([x,y], i) => <ellipse key={i} cx={x} cy={y} rx="10" ry="5" fill={i % 2 ? '#2D5F3D' : '#6FA15F'} transform={`rotate(${i % 2 ? -28 : 30} ${x} ${y})`} />)}
      </svg>
    )
  }
  return (
    <svg className="ingredient-visual" viewBox="0 0 120 95" aria-hidden="true">
      <defs>
        <linearGradient id="grainBowl" x1="0" x2="1"><stop offset="0" stopColor="#F2E1C6"/><stop offset="1" stopColor="#C69D70"/></linearGradient>
        <radialGradient id="grainG"><stop offset="0" stopColor="#F9D980"/><stop offset="1" stopColor="#B78538"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="70" rx="43" ry="13" fill="#8D6540" opacity=".18"/>
      <path d="M29 42h62l-8 28c-3 9-11 14-23 14s-20-5-23-14L29 42Z" fill="url(#grainBowl)"/>
      <ellipse cx="60" cy="42" rx="31" ry="12" fill="#F3D89B" stroke="#B98F5B" strokeWidth="2"/>
      {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={39 + (i * 7) % 44} cy={36 + (i * 5) % 14} r="2.2" fill="url(#grainG)" />)}
    </svg>
  )
}

function PremiumPot({ fill }) {
  return (
    <svg viewBox="0 0 320 250" className="pot-svg" aria-hidden="true">
      <defs>
        <linearGradient id="potBody" x1="0" x2="1"><stop offset="0" stopColor="#E7CB9E"/><stop offset=".45" stopColor="#F8E5C3"/><stop offset="1" stopColor="#B98C5E"/></linearGradient>
        <linearGradient id="potOuter" x1="0" x2="1"><stop offset="0" stopColor="#355E45"/><stop offset=".5" stopColor="#5E8369"/><stop offset="1" stopColor="#244732"/></linearGradient>
        <radialGradient id="inside" cx="50%" cy="45%"><stop offset="0" stopColor="#F3DCAE"/><stop offset="1" stopColor="#B68C5E"/></radialGradient>
        <clipPath id="fillClip"><path d="M76 97h168l-17 91c-3 18-19 28-67 28s-64-10-67-28L76 97Z" /></clipPath>
      </defs>
      <ellipse cx="160" cy="221" rx="96" ry="18" fill="#5B3A20" opacity=".18"/>
      <path d="M73 111c-31-7-51 6-51 30 0 26 25 38 60 23" fill="none" stroke="url(#potOuter)" strokeWidth="17" strokeLinecap="round"/>
      <path d="M247 111c31-7 51 6 51 30 0 26-25 38-60 23" fill="none" stroke="url(#potOuter)" strokeWidth="17" strokeLinecap="round"/>
      <path d="M76 97h168l-17 91c-3 18-19 28-67 28s-64-10-67-28L76 97Z" fill="url(#potBody)" stroke="#2C4434" strokeWidth="4"/>
      <g clipPath="url(#fillClip)">
        <rect x="70" y={216 - fill * 0.82} width="180" height={fill * 0.82} fill="#C66A3A" opacity=".82" />
        <path d="M75 183c35-14 53 12 83 0s49-7 84 4v35H75Z" fill="#E58A4A" opacity=".55" />
      </g>
      <ellipse cx="160" cy="96" rx="92" ry="33" fill="url(#potOuter)"/>
      <ellipse cx="160" cy="91" rx="76" ry="25" fill="url(#inside)" stroke="#2A4434" strokeWidth="4"/>
      <ellipse cx="160" cy="92" rx="54" ry="16" fill="#EACB98" opacity=".55"/>
      <path d="M111 129c6 12 21 21 49 21s44-8 50-20" stroke="#fff" strokeWidth="5" opacity=".23" fill="none" strokeLinecap="round"/>
      <g className="pot-steam">
        <path d="M128 57c-12-20 12-25 0-47" />
        <path d="M160 55c-12-20 12-25 0-47" />
        <path d="M192 57c-12-20 12-25 0-47" />
      </g>
    </svg>
  )
}

function PremiumOven() {
  return (
    <div className="oven-3d">
      <div className="oven-shadow" />
      <div className="oven-body">
        <div className="oven-top-slot" />
        <div className="oven-window">
          <div className="oven-light" />
          <div className="rack rack-1" />
          <div className="rack rack-2" />
          <div className="oven-pot"><PremiumPot fill={78} /></div>
          <span className="heat-particle p1" />
          <span className="heat-particle p2" />
          <span className="heat-particle p3" />
        </div>
        <div className="oven-base" />
      </div>
    </div>
  )
}

function Dish3D() {
  return (
    <div className="dish-3d" aria-hidden="true">
      <div className="dish-shadow" />
      <svg viewBox="0 0 600 420" className="dish-svg">
        <defs>
          <radialGradient id="plateG" cx="50%" cy="42%"><stop offset="0" stopColor="#FFF7E9"/><stop offset=".68" stopColor="#E7D7C2"/><stop offset=".88" stopColor="#BBA486"/><stop offset="1" stopColor="#F9F0E3"/></radialGradient>
          <radialGradient id="innerG" cx="50%" cy="40%"><stop offset="0" stopColor="#FFFDF7"/><stop offset="1" stopColor="#E8D6BF"/></radialGradient>
          <linearGradient id="squashG" x1="0" x2="1"><stop offset="0" stopColor="#F9A94D"/><stop offset="1" stopColor="#D55E2D"/></linearGradient>
          <radialGradient id="falafelG"><stop offset="0" stopColor="#D8A95D"/><stop offset="1" stopColor="#8D6330"/></radialGradient>
          <radialGradient id="hummusG"><stop offset="0" stopColor="#FFF1D4"/><stop offset="1" stopColor="#C5A878"/></radialGradient>
        </defs>
        <ellipse cx="300" cy="225" rx="244" ry="130" fill="url(#plateG)"/>
        <ellipse cx="300" cy="218" rx="193" ry="98" fill="url(#innerG)" opacity=".96"/>
        <ellipse cx="300" cy="232" rx="136" ry="54" fill="#C9B89F" opacity=".12"/>
        <g transform="translate(124 145) rotate(-12)">
          <path d="M40 45c30-20 72-17 101 8-35 12-68 30-103 45-6-18-5-37 2-53Z" fill="url(#squashG)"/>
          <path d="M63 65c25-12 46-14 70-5" stroke="#7A3E28" strokeWidth="4" opacity=".45" fill="none"/>
          <path d="M27 77c33-19 69-19 109 1-36 8-70 24-105 41-8-15-9-29-4-42Z" fill="#F5A143"/>
          <path d="M50 97c26-13 48-12 70-5" stroke="#7A3E28" strokeWidth="4" opacity=".38" fill="none"/>
        </g>
        <g transform="translate(333 150)">
          {[0,1,2,3,4].map((i) => <circle key={i} cx={36 + (i%3)*44} cy={42 + Math.floor(i/3)*44} r="24" fill="url(#falafelG)" />)}
          {[0,1,2,3,4].map((i) => <circle key={`s${i}`} cx={28 + (i%3)*44} cy={33 + Math.floor(i/3)*44} r="3" fill="#F2D087" opacity=".7" />)}
        </g>
        <g transform="translate(385 82)">
          <ellipse cx="55" cy="45" rx="55" ry="38" fill="url(#hummusG)"/>
          <path d="M25 44c20-18 45-20 66-2" fill="none" stroke="#8D714C" strokeWidth="4" opacity=".25"/>
          {[22,35,48,63,76,90].map((x,i)=><circle key={i} cx={x} cy={28 + (i%2)*14} r="4" fill="#1B1A15" />)}
        </g>
        <g transform="translate(210 96)">
          <path d="M18 92c20-60 68-78 116-66-36 16-52 58-116 66Z" fill="#5C8A55"/>
          <path d="M59 90c4-52 35-82 80-82-25 24-28 64-80 82Z" fill="#223B2B" opacity=".92"/>
          <path d="M20 86c36-15 68-31 103-59" stroke="#B7D3A1" strokeWidth="3" opacity=".45"/>
        </g>
        <g transform="translate(185 210)">
          {[0,1,2,3,4,5,6,7].map((i)=><ellipse key={i} cx={i*26} cy={(i%2)*9} rx="15" ry="8" fill="#EAD7B9" transform={`rotate(${i*21} ${i*26} ${(i%2)*9})`} />)}
        </g>
        <ellipse cx="260" cy="124" rx="15" ry="5" fill="#FFF" opacity=".35"/>
        <ellipse cx="410" cy="178" rx="18" ry="6" fill="#FFF" opacity=".28"/>
      </svg>
    </div>
  )
}

function animateIngredientFlight(type, source, target) {
  const node = document.createElement('div')
  node.className = 'flight-object'
  const wrapper = document.createElement('div')
  wrapper.innerHTML = ingredientSvgString(type)
  node.appendChild(wrapper.firstElementChild)
  document.body.appendChild(node)

  const sx = source.left + source.width / 2
  const sy = source.top + source.height / 2
  const ex = target.left + target.width / 2
  const ey = target.top + target.height * 0.42
  node.style.left = `${sx}px`
  node.style.top = `${sy}px`

  const dx = ex - sx
  const dy = ey - sy
  node.animate(
    [
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.45}px), calc(-50% + ${dy * 0.45 - 95}px)) scale(.92) rotate(-8deg)`, opacity: .96 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.22) rotate(18deg)`, opacity: 0 }
    ],
    { duration: 850, easing: 'cubic-bezier(.2,.75,.2,1)' }
  ).onfinish = () => node.remove()
}

function emitParticles(target) {
  if (!target) return
  const x = target.left + target.width / 2
  const y = target.top + target.height * 0.42
  for (let i = 0; i < 10; i += 1) {
    const particle = document.createElement('span')
    particle.className = 'pot-particle'
    document.body.appendChild(particle)
    particle.style.left = `${x}px`
    particle.style.top = `${y}px`
    const angle = Math.PI * 2 * (i / 10)
    const radius = 28 + (i % 3) * 14
    particle.animate(
      [
        { transform: 'translate(-50%, -50%) scale(.7)', opacity: .9 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * radius}px), calc(-50% + ${Math.sin(angle) * radius}px)) scale(0)`, opacity: 0 }
      ],
      { duration: 650, easing: 'ease-out' }
    ).onfinish = () => particle.remove()
  }
}

function ingredientSvgString(type) {
  const map = {
    peas: '<svg class="ingredient-visual" viewBox="0 0 120 95"><ellipse cx="60" cy="68" rx="48" ry="17" fill="#9B7D58" opacity=".28"/><path d="M22 36h76l-10 33c-3 9-11 14-28 14s-25-5-28-14L22 36Z" fill="#E8D1AF"/><ellipse cx="60" cy="36" rx="38" ry="16" fill="#F7E7CF" stroke="#BFA17D" stroke-width="2"/><circle cx="36" cy="32" r="6" fill="#4D8C41"/><circle cx="48" cy="38" r="6" fill="#77B65C"/><circle cx="60" cy="32" r="6" fill="#4D8C41"/><circle cx="72" cy="38" r="6" fill="#77B65C"/><circle cx="84" cy="32" r="6" fill="#4D8C41"/></svg>',
    carrot: '<svg class="ingredient-visual" viewBox="0 0 120 95"><ellipse cx="59" cy="72" rx="45" ry="12" fill="#8D6540" opacity=".20"/><path d="M58 31c-10 9-22 35-24 48 13-4 43-22 57-39-9-2-23-7-33-9Z" fill="#E87932"/><path d="M58 31c-4-14-12-19-23-22 1 9 8 18 23 22Z" fill="#4F7D49"/><path d="M60 31c3-15 12-23 27-26-2 13-11 21-27 26Z" fill="#2D5F3D"/></svg>',
    route: '<svg class="ingredient-visual" viewBox="0 0 120 95"><ellipse cx="62" cy="72" rx="46" ry="13" fill="#8D6540" opacity=".18"/><path d="M21 38c24-19 54-19 78 0v32c-22 12-52 12-78 0V38Z" fill="#DDC4A0"/><path d="M36 65c11-27 34-26 48-8" fill="none" stroke="#203628" stroke-width="5" stroke-linecap="round"/><circle cx="35" cy="65" r="8" fill="#C66A3A"/><circle cx="87" cy="55" r="8" fill="#365642"/></svg>',
    herb: '<svg class="ingredient-visual" viewBox="0 0 120 95"><ellipse cx="61" cy="74" rx="42" ry="12" fill="#8D6540" opacity=".18"/><path d="M35 75c10-26 20-43 34-62M58 75c3-24 15-43 31-58M75 75c-3-21 1-37 9-51" stroke="#365642" stroke-width="4" stroke-linecap="round"/><ellipse cx="40" cy="55" rx="10" ry="5" fill="#6FA15F" transform="rotate(30 40 55)"/><ellipse cx="57" cy="36" rx="10" ry="5" fill="#2D5F3D" transform="rotate(-28 57 36)"/><ellipse cx="76" cy="42" rx="10" ry="5" fill="#6FA15F" transform="rotate(30 76 42)"/></svg>',
    grain: '<svg class="ingredient-visual" viewBox="0 0 120 95"><ellipse cx="60" cy="70" rx="43" ry="13" fill="#8D6540" opacity=".18"/><path d="M29 42h62l-8 28c-3 9-11 14-23 14s-20-5-23-14L29 42Z" fill="#D7AF7E"/><ellipse cx="60" cy="42" rx="31" ry="12" fill="#F3D89B" stroke="#B98F5B" stroke-width="2"/><circle cx="43" cy="38" r="3" fill="#B78538"/><circle cx="55" cy="44" r="3" fill="#DCA84D"/><circle cx="69" cy="37" r="3" fill="#B78538"/><circle cx="81" cy="43" r="3" fill="#DCA84D"/></svg>'
  }
  return map[type] || map.grain
}
