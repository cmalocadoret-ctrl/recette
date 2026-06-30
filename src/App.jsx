import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  BookOpen,
  ChefHat,
  Maximize,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react'

const sections = [
  { id: 'intro', label: 'Accueil' },
  { id: 'method', label: 'Axes' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'transform', label: 'Transformation' },
  { id: 'dressage', label: 'Dressage' },
  { id: 'final', label: 'Conclusion' }
]

const notes = {
  intro: {
    title: 'Introduction',
    body: 'Le format recette me permet de raconter l’année autrement : comme un vrai parcours, où l’on passe des ingrédients à la méthode, puis au résultat. Le fil rouge reste le même : rendre les flux lisibles, la donnée fiable et les pratiques partageables.'
  },
  method: {
    title: 'Mise en place',
    body: 'Cette étape pose les grands chantiers : Grand Ouest multi-sites, portage de repas, Ansamble 2030 et la démarche méthode. L’objectif est de donner une direction claire avant d’entrer dans les détails.'
  },
  ingredients: {
    title: 'Ingrédients',
    body: 'Les données deviennent des ingrédients concrets : clients, volumes, tournées, menus et KPI. Chaque ingrédient rejoint la marmite pour symboliser la structuration progressive de la donnée.'
  },
  transform: {
    title: 'Transformation',
    body: 'La cuisson symbolise le moment où les constats deviennent actionnables : on observe, on cartographie, on structure, on teste, puis on standardise.'
  },
  dressage: {
    title: 'Dressage',
    body: 'Le dressage représente les bénéfices attendus : moins d’erreurs, plus de visibilité, des décisions plus rapides et des standards partageables. La photo réelle sert ici de base crédible au rendu.'
  },
  final: {
    title: 'Conclusion',
    body: 'Avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables.'
  }
}

const ingredientData = [
  { id: 'clients', number: '01', label: 'Données clients', text: 'Qui livrer, à quelle maille, client final ou bénéficiaire.', pos: { left: '4%', top: '13%' } },
  { id: 'volumes', number: '02', label: 'Volumes repas', text: 'Charge, répartition et équilibre entre ateliers.', pos: { right: '3%', top: '11%' } },
  { id: 'tournees', number: '03', label: 'Tournées multi-sites', text: 'Temps, capacités, géographie et organisation des flux.', pos: { right: '1%', top: '47%' } },
  { id: 'menus', number: '04', label: 'Régimes & menus', text: 'Composition des sacs, choix menus et contraintes alimentaires.', pos: { left: '5%', bottom: '12%' } },
  { id: 'kpi', number: '05', label: 'KPI & référentiels', text: 'Erreurs, coûts, temps opérationnels et indicateurs communs.', pos: { right: '9%', bottom: '14%' } }
]

const methodItems = [
  ['01', 'Grand Ouest', 'Vision globale des flux', 'Comprendre les clients, les volumes, les tournées et les arbitrages multi-sites.'],
  ['02', 'Portage de repas', 'Fiabilisation terrain', 'Guider la préparation, sécuriser les sacs et réduire les écarts.'],
  ['03', 'Ansamble 2030', 'Donnée utile et partageable', 'Passer de fichiers dispersés à des référentiels réellement exploitables.'],
  ['04', 'Méthode', 'Observer avant d’optimiser', 'Terrain, cartographie, scénarios, décision et standardisation.']
]

const transformSteps = ['Observer', 'Cartographier', 'Structurer', 'Tester', 'Standardiser']

export default function App() {
  const [current, setCurrent] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const sectionRefs = useRef([])

  const goTo = (index) => {
    const target = Math.max(0, Math.min(sections.length - 1, index))
    sectionRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(Number(entry.target.dataset.index))
        })
      },
      { threshold: 0.56 }
    )
    sectionRefs.current.forEach((section) => section && observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0
      document.documentElement.style.setProperty('--progress', `${progress}%`)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        goTo(current + 1)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        goTo(current - 1)
      }
      if (key === 'n') setNotesOpen((v) => !v)
      if (key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
      if (key === 'r') goTo(0)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current])

  return (
    <main className="site-shell">
      <div className="global-grain" />
      <SiteHeader current={current} onNav={goTo} onNotes={() => setNotesOpen(true)} />
      <div className="global-progress"><span /></div>

      <Section id="intro" index={0} refs={sectionRefs}><IntroSection onNext={() => goTo(1)} /></Section>
      <Section id="method" index={1} refs={sectionRefs}><MethodSection /></Section>
      <Section id="ingredients" index={2} refs={sectionRefs}><IngredientsSection /></Section>
      <Section id="transform" index={3} refs={sectionRefs}><TransformSection /></Section>
      <Section id="dressage" index={4} refs={sectionRefs}><DressageSection /></Section>
      <Section id="final" index={5} refs={sectionRefs}><ConclusionSection onReplay={() => goTo(0)} /></Section>

      {current < sections.length - 1 && (
        <button className="scroll-pill" onClick={() => goTo(current + 1)}>
          Scroll <ArrowDown size={16} />
        </button>
      )}

      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} sectionId={sections[current].id} />
    </main>
  )
}

function Section({ id, index, refs, children }) {
  return (
    <section id={id} data-index={index} ref={(el) => (refs.current[index] = el)} className={`journey-section ${id}`}>
      {children}
    </section>
  )
}

function SiteHeader({ current, onNav, onNotes }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNav(0)}>
        <span className="brand-mark"><ChefHat size={16} /></span>
        <span>
          <strong>ansamble</strong>
          <small>Cuisiner le collectif</small>
        </span>
      </button>

      <nav className="site-nav" aria-label="Navigation du parcours">
        {sections.map((item, index) => (
          <button key={item.id} className={current === index ? 'active' : ''} onClick={() => onNav(index)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button className="ghost-btn" onClick={onNotes}><BookOpen size={15} /> Notes</button>
        <button
          className="solid-btn"
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

function Kicker({ children }) {
  return <div className="kicker reveal">{children}</div>
}

function IntroSection({ onNext }) {
  const rootRef = useRevealScope()

  return (
    <div className="section-frame intro-frame" ref={rootRef}>
      <div className="split-layout">
        <div className="copy-side">
          <div className="hero-chip reveal"><Sparkles size={14} /> Saison 2025/2026 · Projet logistique</div>
          <h1 className="display-title reveal">Ma recette <em>logistique</em></h1>
          <p className="body-lead reveal">Un site immersif pour raconter comment les flux, la donnée et les pratiques terrain deviennent une organisation plus lisible et plus fiable.</p>
          <div className="tag-row reveal">
            <span>Grand Ouest multi-sites</span>
            <span>Portage de repas</span>
            <span>Ansamble 2030</span>
          </div>
          <button className="main-cta reveal" onClick={onNext}>Commencer le parcours</button>
        </div>

        <div className="hero-showcase reveal">
          <div className="hero-photo-card">
            <div className="hero-float-card">
              <strong>Fil rouge</strong>
              <p>Rendre les flux lisibles, les données fiables et les pratiques partageables.</p>
            </div>
            <div className="photo-glow photo-glow-a" />
            <div className="photo-glow photo-glow-b" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MethodSection() {
  const rootRef = useRevealScope()

  return (
    <div className="section-frame" ref={rootRef}>
      <div className="method-layout">
        <div>
          <Kicker>La mise en place</Kicker>
          <h2 className="display-title smaller reveal">Avant la recette, choisir les <em>bons axes.</em></h2>
          <p className="body-lead reveal">On quitte la logique slide pour une lecture plus fluide, comme un vrai site éditorial qui annonce les priorités avant l’exécution.</p>
          <div className="quote-block reveal">
            <span className="quote-line" />
            <p>Objectif : raconter l’année sans dashboard, en gardant uniquement les décisions fortes à l’écran.</p>
          </div>
        </div>

        <div className="method-rail">
          {methodItems.map(([number, small, title, text]) => (
            <article className="rail-row reveal" key={number}>
              <div className="rail-number">{number}</div>
              <div className="rail-texts">
                <small>{small}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function IngredientsSection() {
  const rootRef = useRevealScope()
  const [selected, setSelected] = useState(ingredientData[0])
  const [added, setAdded] = useState([])
  const potRef = useRef(null)

  const progress = useMemo(() => `${(added.length / ingredientData.length) * 100}%`, [added])

  const animateToPot = (event) => {
    const source = event.currentTarget.getBoundingClientRect()
    const pot = potRef.current?.getBoundingClientRect()
    if (!pot) return
    const dot = document.createElement('div')
    dot.className = 'flying-seed'
    document.body.appendChild(dot)

    const sx = source.left + source.width / 2
    const sy = source.top + source.height / 2
    const ex = pot.left + pot.width / 2
    const ey = pot.top + pot.height / 2

    dot.style.left = `${sx}px`
    dot.style.top = `${sy}px`

    dot.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${(ex - sx) * 0.45}px, ${(ey - sy) * 0.5 - 110}px) scale(.88)`, opacity: .95 },
        { transform: `translate(${ex - sx}px, ${ey - sy}px) scale(.2)`, opacity: 0 }
      ],
      { duration: 820, easing: 'cubic-bezier(.2,.7,.2,1)' }
    ).onfinish = () => dot.remove()

    potRef.current.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)' },
        { transform: 'translate(-50%, -50%) scale(1.04)' },
        { transform: 'translate(-50%, -50%) scale(1)' }
      ],
      { duration: 420, easing: 'ease-in-out' }
    )
  }

  const handleClick = (ingredient, event) => {
    setSelected(ingredient)
    if (!added.includes(ingredient.id)) {
      setAdded((prev) => [...prev, ingredient.id])
      animateToPot(event)
    }
  }

  return (
    <div className="section-frame ingredients-frame" ref={rootRef}>
      <div className="ingredients-layout">
        <div className="ingredients-side">
          <Kicker>Les ingrédients</Kicker>
          <h2 className="display-title smaller reveal">Les données entrent dans la <em>marmite.</em></h2>
          <p className="body-lead reveal">Toute la 3D a été refaite : une scène plus propre, plus légère et plus premium, avec de vrais volumes et des éléments mieux espacés.</p>

          <div className="info-card reveal">
            <span>Ingrédient sélectionné</span>
            <h3>{selected.label}</h3>
            <p>{selected.text}</p>
          </div>

          <div className="info-card reveal">
            <div className="mini-track"><b style={{ width: progress }} /></div>
            <h3>{added.length} / {ingredientData.length}</h3>
            <p>Ingrédients intégrés à la base de pilotage.</p>
          </div>
        </div>

        <div className="ingredient-scene reveal">
          <div className={`scene-3d ${added.length ? 'active' : ''}`}>
            <div className="table-shadow" />
            <div className="table-plane" />
            <div className="pot-pedestal" />
            <div className="real-pot" ref={potRef}>
              <span className="steam s1" />
              <span className="steam s2" />
              <span className="steam s3" />
            </div>
          </div>

          {ingredientData.map((item) => (
            <button
              key={item.id}
              className={`ingredient-chip ${selected.id === item.id ? 'selected' : ''} ${added.includes(item.id) ? 'added' : ''}`}
              style={item.pos}
              onClick={(event) => handleClick(item, event)}
            >
              <span className="chip-dot" />
              <span className="chip-number">{item.number}</span>
              <span className="chip-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function TransformSection() {
  const rootRef = useRevealScope()

  return (
    <div className="section-frame" ref={rootRef}>
      <div className="transform-layout">
        <div>
          <Kicker>La transformation</Kicker>
          <h2 className="display-title smaller reveal">Transformer les constats terrain en <em>décisions.</em></h2>
          <p className="body-lead reveal">Ici aussi, la 3D est simplifiée et renforcée : plus de faux objet plat, mais une scène de cuisson plus lisible, avec relief et profondeur.</p>
          <div className="step-row reveal">
            {transformSteps.map((step, index) => (
              <span key={step} className={index === 2 ? 'active' : ''}>{step}</span>
            ))}
          </div>
        </div>

        <div className="oven-scene reveal">
          <div className="oven-shell">
            <div className="oven-top" />
            <div className="oven-body" />
            <div className="oven-cavity">
              <div className="rack rack-a" />
              <div className="rack rack-b" />
              <div className="heat-orb heat-a" />
              <div className="heat-orb heat-b" />
              <div className="heat-orb heat-c" />
              <div className="pot-in-oven" />
            </div>
            <div className="oven-floor-shadow" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DressageSection() {
  const rootRef = useRevealScope()
  const benefits = [
    ['01', 'Moins d’erreurs terrain'],
    ['02', 'Meilleure visibilité des flux'],
    ['03', 'Décisions plus rapides'],
    ['04', 'Standards partageables']
  ]

  return (
    <div className="section-frame" ref={rootRef}>
      <div className="dressage-head">
        <Kicker>Le dressage</Kicker>
        <h2 className="display-title smaller reveal">Le résultat se <em>sert</em> clairement.</h2>
        <p className="body-lead reveal center">L’assiette a été entièrement refaite : on part de ta photo réelle, intégrée dans un volume discret et crédible, sans faux effet gadget.</p>
      </div>

      <div className="dressage-stage reveal">
        {benefits.map(([number, text], index) => (
          <div className={`benefit-card b${index + 1}`} key={number}>
            <span>{number}</span>
            <p>{text}</p>
          </div>
        ))}

        <div className="plating-scene">
          <div className="plating-shadow" />
          <div className="plate-base" />
          <div className="plate-rim" />
          <div className="plate-photo" />
          <div className="plate-gloss" />
          <div className="plate-underlight" />
        </div>
      </div>
    </div>
  )
}

function ConclusionSection({ onReplay }) {
  const rootRef = useRevealScope()

  return (
    <div className="section-frame" ref={rootRef}>
      <div className="final-card reveal">
        <Kicker>Conclusion</Kicker>
        <blockquote>
          Avant d’optimiser une organisation, il faut d’abord rendre ses flux <em>lisibles</em>, ses données <em>fiables</em> et ses pratiques <em>partageables</em>.
        </blockquote>
        <button className="main-cta" onClick={onReplay}><RotateCcw size={16} /> Revoir le parcours</button>
      </div>
    </div>
  )
}

function NotesPanel({ open, onClose, sectionId }) {
  const data = notes[sectionId]
  return (
    <aside className={`notes-panel ${open ? 'open' : ''}`}>
      <button className="notes-close" onClick={onClose}><X size={18} /></button>
      <div className="kicker">Notes orales</div>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
    </aside>
  )
}

function useRevealScope() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.querySelectorAll('.reveal').forEach((el, index) => {
            el.style.setProperty('--delay', `${index * 0.055}s`)
            el.classList.add('visible')
          })
        })
      },
      { threshold: 0.22 }
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return rootRef
}
