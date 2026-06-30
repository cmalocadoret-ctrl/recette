import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowDown,
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
  { id: 'themes', label: 'Mise en place' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'oven', label: 'Transformation' },
  { id: 'dressage', label: 'Dressage' },
  { id: 'conclusion', label: 'Conclusion' }
]

const notes = {
  hero: {
    title: 'Introduction',
    body:
      'J’ai choisi le format recette parce que chez Ansamble, la réussite dépend du bon dosage entre méthode, terrain et exécution. Le fil rouge de l’année : rendre les flux plus lisibles, la donnée plus fiable et les pratiques plus partageables.'
  },
  themes: {
    title: 'Mise en place',
    body:
      'Cette partie présente les axes structurants de l’année : Grand Ouest multi-sites, portage de repas, structuration de la donnée et démarche méthode. L’idée est d’annoncer les chantiers sans tomber dans une logique de slide classique.'
  },
  ingredients: {
    title: 'Ingrédients',
    body:
      'Les données prennent ici la forme d’ingrédients concrets : clients, volumes, tournées, menus et KPI. Ils s’animent autour de la marmite pour montrer que la donnée n’est utile que lorsqu’elle est rassemblée et exploitée.'
  },
  oven: {
    title: 'Transformation',
    body:
      'La cuisson représente le moment méthode : observation terrain, cartographie des flux, structuration des données, tests de scénarios et standardisation. C’est la phase où les constats deviennent décisions.'
  },
  dressage: {
    title: 'Dressage',
    body:
      'Le dressage montre le résultat attendu : une logistique plus claire, plus robuste, plus rapide à piloter et plus simple à partager. La photo réelle donne un rendu plus premium et plus crédible.'
  },
  conclusion: {
    title: 'Conclusion',
    body:
      'Le message final : avant d’optimiser, il faut d’abord rendre les flux lisibles, la donnée fiable et les pratiques partageables. Cette base est ce qui permettra ensuite de faire grandir les projets.'
  }
}

const ingredients = [
  {
    id: 'clients',
    number: '01',
    label: 'Données clients',
    short: 'Qui livrer, à quelle maille, client final ou bénéficiaire.',
    position: { top: '16%', left: '7%' }
  },
  {
    id: 'volumes',
    number: '02',
    label: 'Volumes repas',
    short: 'Charge, répartition et équilibre entre ateliers.',
    position: { top: '12%', right: '5%' }
  },
  {
    id: 'tournees',
    number: '03',
    label: 'Tournées multi-sites',
    short: 'Temps, capacités, géographie et organisation des flux.',
    position: { top: '48%', right: '2%' }
  },
  {
    id: 'menus',
    number: '04',
    label: 'Régimes & menus',
    short: 'Composition des sacs, choix menus et contraintes alimentaires.',
    position: { bottom: '13%', left: '6%' }
  },
  {
    id: 'kpi',
    number: '05',
    label: 'KPI & référentiels',
    short: 'Erreurs, coûts, temps opérationnels et indicateurs communs.',
    position: { bottom: '15%', right: '8%' }
  }
]

const transforms = [
  'Observer le terrain',
  'Cartographier les flux',
  'Structurer la donnée',
  'Tester les scénarios',
  'Standardiser'
]

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const sectionRefs = useRef([])

  const scrollToIndex = (index) => {
    const clamped = Math.max(0, Math.min(index, scenes.length - 1))
    sectionRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'))
            setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.55 }
    )

    sectionRefs.current.forEach((section) => section && observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        scrollToIndex(activeIndex + 1)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        scrollToIndex(activeIndex - 1)
      }
      if (key === 'n') setNotesOpen((v) => !v)
      if (key === 'r') scrollToIndex(0)
      if (key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex])

  return (
    <main className="site-shell">
      <BackgroundLayer />
      <AmbientGrain />
      <TopBar
        activeIndex={activeIndex}
        onSelect={scrollToIndex}
        onNotes={() => setNotesOpen(true)}
        onReplay={() => scrollToIndex(0)}
      />
      <Progress activeIndex={activeIndex} />

      <div className="scroll-root">
        <Section id="hero" index={0} sectionRefs={sectionRefs}>
          <HeroSection onNext={() => scrollToIndex(1)} />
        </Section>
        <Section id="themes" index={1} sectionRefs={sectionRefs}>
          <MethodSection />
        </Section>
        <Section id="ingredients" index={2} sectionRefs={sectionRefs}>
          <IngredientsSection isActive={activeIndex === 2} />
        </Section>
        <Section id="oven" index={3} sectionRefs={sectionRefs}>
          <TransformationSection isActive={activeIndex === 3} />
        </Section>
        <Section id="dressage" index={4} sectionRefs={sectionRefs}>
          <DressageSection />
        </Section>
        <Section id="conclusion" index={5} sectionRefs={sectionRefs}>
          <ConclusionSection onReplay={() => scrollToIndex(0)} />
        </Section>
      </div>

      <ScrollControls
        activeIndex={activeIndex}
        onPrev={() => scrollToIndex(activeIndex - 1)}
        onNext={() => scrollToIndex(activeIndex + 1)}
      />
      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} sceneId={scenes[activeIndex].id} />
    </main>
  )
}

function Section({ id, index, sectionRefs, children }) {
  return (
    <section
      id={id}
      data-index={index}
      ref={(el) => (sectionRefs.current[index] = el)}
      className="immersive-section"
    >
      {children}
    </section>
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

function TopBar({ activeIndex, onSelect, onNotes, onReplay }) {
  return (
    <header className="topbar">
      <button className="brand-lockup" onClick={() => onSelect(0)} aria-label="Retour à l'accueil">
        <span className="chef-dot"><ChefHat size={16} /></span>
        <span>
          <strong>ansamble</strong>
          <small>Cuisiner le collectif</small>
        </span>
      </button>

      <nav className="nav-dots" aria-label="Navigation principale">
        {scenes.map((item, index) => (
          <button key={item.id} className={index === activeIndex ? 'active' : ''} onClick={() => onSelect(index)}>
            <span>{index + 1}</span>
          </button>
        ))}
      </nav>

      <div className="top-actions">
        <button className="ghost-button" onClick={onNotes}><BookOpen size={16} /> Notes</button>
        <button
          className="primary-button compact"
          onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
            else document.exitFullscreen?.()
          }}
        >
          <Maximize size={15} /> Plein écran
        </button>
        <button className="icon-button" onClick={onReplay} title="Revenir en haut"><RotateCcw size={16} /></button>
      </div>
    </header>
  )
}

function Progress({ activeIndex }) {
  return (
    <div className="progress-line" aria-hidden="true">
      <span style={{ width: `${((activeIndex + 1) / scenes.length) * 100}%` }} />
    </div>
  )
}

function SectionEyebrow({ children }) {
  return <div className="eyebrow reveal">{children}</div>
}

function HeroSection({ onNext }) {
  useRevealAnimation()

  return (
    <div className="section-shell hero-shell">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-chip reveal"><Sparkles size={14} /> Saison 2025/2026 · Projet logistique</div>
          <h1 className="hero-title reveal">Ma recette <em>logistique</em></h1>
          <p className="hero-text reveal">
            Un site immersif pour raconter comment transformer les flux, la donnée et les pratiques terrain en une supply chain plus lisible et plus fiable.
          </p>
          <div className="hero-tags reveal">
            <span>Grand Ouest multi-sites</span>
            <span>Portage de repas</span>
            <span>Ansamble 2030</span>
          </div>
          <div className="hero-actions reveal">
            <button className="primary-button" onClick={onNext}>Explorer <ArrowDown size={16} /></button>
            <p>Descends dans la page : les transitions se font désormais naturellement, sans logique de slides.</p>
          </div>
        </div>

        <div className="hero-media reveal">
          <div className="hero-photo" />
          <div className="hero-floating-card card-a">
            <strong>Objectif</strong>
            <p>Rendre les flux lisibles, les données fiables et les pratiques partageables.</p>
          </div>
          <div className="hero-floating-card card-b">
            <strong>Format</strong>
            <p>Un parcours web immersif, en plein écran, plus proche d’un site de marque que d’une présentation.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MethodSection() {
  useRevealAnimation()

  const entries = [
    {
      number: '01',
      lead: 'Grand Ouest',
      title: 'Vision globale des flux',
      text: 'Comprendre les clients, volumes, tournées et arbitrages multi-sites pour passer d’une logique locale à une logique réseau.'
    },
    {
      number: '02',
      lead: 'Portage de repas',
      title: 'Fiabilisation terrain',
      text: 'Guider la préparation, sécuriser les sacs et réduire les écarts tout en gardant une solution adaptée au quotidien des opérateurs.'
    },
    {
      number: '03',
      lead: 'Ansamble 2030',
      title: 'Donnée utile et partageable',
      text: 'Passer de fichiers dispersés à des référentiels et indicateurs réellement exploitables pour piloter et standardiser.'
    },
    {
      number: '04',
      lead: 'Démarche méthode',
      title: 'Observer avant d’optimiser',
      text: 'Terrain, cartographie, scénarios, décision, standardisation : la méthode structure l’ensemble du travail.'
    }
  ]

  return (
    <div className="section-shell method-shell">
      <div className="method-layout">
        <div className="method-copy">
          <SectionEyebrow>Scène 02 · La mise en place</SectionEyebrow>
          <h2 className="section-title reveal">Avant la recette, choisir les <em>bons axes.</em></h2>
          <p className="section-text reveal">
            Ici, plus de rendu PowerPoint : la lecture se fait comme sur une page éditoriale, avec une narration continue et une hiérarchie visuelle plus premium.
          </p>
          <div className="quote-block reveal">
            <span className="quote-line" />
            <p><strong>Objectif :</strong> raconter l’année sans afficher un dashboard, en gardant uniquement les décisions fortes à l’écran.</p>
          </div>
        </div>

        <div className="method-rail">
          <span className="method-rail-line" />
          {entries.map((entry) => (
            <article className="method-row reveal" key={entry.number}>
              <div className="method-badge">{entry.number}</div>
              <div className="method-texts">
                <small>{entry.lead}</small>
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function IngredientsSection({ isActive }) {
  const [selectedId, setSelectedId] = useState('clients')
  const [added, setAdded] = useState([])
  const potRef = useRef(null)
  const nodesRef = useRef([])

  const selected = useMemo(
    () => ingredients.find((item) => item.id === selectedId) ?? ingredients[0],
    [selectedId]
  )

  useEffect(() => {
    if (!isActive) return
    gsap.fromTo(
      nodesRef.current,
      { opacity: 0, y: 26, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out' }
    )
    gsap.fromTo(
      potRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
  }, [isActive])

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
    const endY = pot.top + pot.height / 2 + 22

    gsap.set(fly, { x: startX, y: startY, scale: 1, opacity: 1 })
    gsap.to(fly, {
      duration: 0.8,
      x: endX,
      y: endY,
      scale: 0.22,
      ease: 'power2.inOut',
      onComplete: () => {
        fly.remove()
        setAdded((current) => [...current, item.id])
        gsap.fromTo(potRef.current, { scale: 1 }, { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1 })
      }
    })
  }

  return (
    <div className="section-shell ingredients-shell">
      <div className="ingredients-grid">
        <div className="ingredients-copy reveal">
          <SectionEyebrow>Scène 03 · Les ingrédients</SectionEyebrow>
          <h2 className="section-title dark reveal">Les données entrent dans la <em>marmite.</em></h2>
          <p className="section-text dark reveal">
            Les ingrédients s’animent autour d’une marmite réaliste. Ils sont espacés, lisibles, et chaque clic déclenche une animation vers le centre.
          </p>

          <div className="selected-card reveal">
            <span>Ingrédient sélectionné</span>
            <h3>{selected.label}</h3>
            <p>{selected.short}</p>
          </div>

          <div className="ingredients-progress reveal">
            <div className="mini-track"><span style={{ width: `${(added.length / ingredients.length) * 100}%` }} /></div>
            <strong>{added.length} / {ingredients.length}</strong>
            <p>Chaque ingrédient enrichit la base de pilotage.</p>
          </div>
        </div>

        <div className="ingredients-stage">
          <div className={`pot-real ${added.length > 0 ? 'is-awake' : ''}`} ref={potRef}>
            <div className="pot-steam s1" />
            <div className="pot-steam s2" />
            <div className="pot-steam s3" />
          </div>
          {ingredients.map((item, idx) => (
            <button
              key={item.id}
              ref={(el) => (nodesRef.current[idx] = el)}
              className={`ingredient-node ${selectedId === item.id ? 'is-selected' : ''} ${added.includes(item.id) ? 'is-added' : ''}`}
              style={item.position}
              onClick={(event) => handleIngredient(item, event)}
            >
              <span className="ingredient-dot" />
              <span className="ingredient-number">{item.number}</span>
              <span className="ingredient-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function TransformationSection({ isActive }) {
  const [activeStep, setActiveStep] = useState(2)
  useRevealAnimation()

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => setActiveStep((v) => (v + 1) % transforms.length), 1400)
    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="section-shell transform-shell">
      <div className="transform-grid">
        <div className="transform-copy">
          <SectionEyebrow>Scène 04 · La transformation</SectionEyebrow>
          <h2 className="section-title reveal">Transformer les constats terrain en <em>décisions.</em></h2>
          <p className="section-text reveal">
            La transition ne coupe plus le récit : on avance naturellement dans une nouvelle ambiance, où la cuisson symbolise le passage du constat à l’action.
          </p>
          <div className="transform-pills reveal">
            {transforms.map((step, index) => (
              <button key={step} className={index === activeStep ? 'active' : ''} onClick={() => setActiveStep(index)}>{step}</button>
            ))}
          </div>
        </div>

        <div className="oven-stage reveal">
          <div className="oven-box">
            <div className="oven-glow" />
            <div className="oven-cavity">
              <div className="heat-wave w1" />
              <div className="heat-wave w2" />
              <div className="heat-wave w3" />
              <div className="pot-in-oven" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DressageSection() {
  useRevealAnimation()

  const benefits = [
    { cls: 'b1', text: 'Moins d’erreurs terrain' },
    { cls: 'b2', text: 'Meilleure visibilité des flux' },
    { cls: 'b3', text: 'Décisions plus rapides' },
    { cls: 'b4', text: 'Standards partageables entre sites' }
  ]

  return (
    <div className="section-shell dressage-shell">
      <div className="dressage-header reveal">
        <SectionEyebrow>Scène 05 · Le dressage</SectionEyebrow>
        <h2 className="section-title dark reveal">Le résultat se <em>sert</em> clairement.</h2>
        <p className="section-text dark reveal">
          La photo réelle est maintenant intégrée au site et posée dans une mise en scène 3D plus crédible, avec un rendu plus premium et plus concret.
        </p>
      </div>

      <div className="dressage-stage reveal">
        {benefits.map((item, index) => (
          <div key={item.text} className={`benefit-chip ${item.cls}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{item.text}</p>
          </div>
        ))}

        <div className="plate-scene">
          <div className="plate-shadow" />
          <div className="plate-3d-wrap">
            <div className="plate-rim" />
            <div className="plate-photo" />
            <div className="plate-gloss" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ConclusionSection({ onReplay }) {
  useRevealAnimation()

  return (
    <div className="section-shell conclusion-shell">
      <div className="conclusion-card reveal">
        <SectionEyebrow>Scène 06 · Conclusion</SectionEyebrow>
        <blockquote>
          Avant d’optimiser une organisation, il faut d’abord rendre ses flux <em>lisibles</em>, sa donnée <em>fiable</em> et ses pratiques <em>partageables</em>.
        </blockquote>
        <div className="conclusion-actions">
          <button className="primary-button" onClick={onReplay}>Revoir le parcours <RotateCcw size={16} /></button>
        </div>
      </div>
    </div>
  )
}

function ScrollControls({ activeIndex, onPrev, onNext }) {
  return (
    <div className="scene-controls">
      <button className="ghost-button" onClick={onPrev} disabled={activeIndex === 0}><ArrowLeft size={16} /> Précédent</button>
      <button className="primary-button" onClick={onNext} disabled={activeIndex === scenes.length - 1}>Suivant <ArrowRight size={16} /></button>
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

function useRevealAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    if (!elements.length) return
    gsap.fromTo(
      elements,
      { y: 24, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.8, ease: 'power3.out' }
    )
  }, [])
}

export default App
