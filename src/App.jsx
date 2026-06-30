import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { BookOpen, ChefHat, Maximize, RotateCcw, Sparkles, X } from 'lucide-react'

const sections = [
  { id: 'intro', label: 'Accueil' },
  { id: 'method', label: 'Méthode' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'transform', label: 'Transformation' },
  { id: 'dressage', label: 'Dressage' },
  { id: 'final', label: 'Conclusion' }
]

const notes = {
  intro: {
    title: 'Introduction',
    body: 'J’ai choisi le format recette parce que chez Ansamble, un bon résultat dépend des bons ingrédients, d’une bonne méthode et d’une exécution terrain rigoureuse. Le fil rouge de mon année : rendre les flux lisibles, les données fiables et les pratiques partageables.'
  },
  method: {
    title: 'Mise en place',
    body: 'Cette partie pose les axes de l’année : vision multi-sites Grand Ouest, fiabilisation du portage, structuration de la donnée et démarche méthode. L’objectif est de raconter le sens des projets, pas d’afficher une liste de slides.'
  },
  ingredients: {
    title: 'Ingrédients',
    body: 'Les données deviennent des ingrédients. Clients, volumes, tournées, menus et KPI sont animés vers la marmite pour montrer que la donnée devient utile lorsqu’elle est rassemblée et structurée.'
  },
  transform: {
    title: 'Transformation',
    body: 'La cuisson symbolise le travail méthode : observer le terrain, cartographier les flux, structurer les données, tester les scénarios puis standardiser.'
  },
  dressage: {
    title: 'Dressage',
    body: 'Le dressage montre les bénéfices attendus : moins d’erreurs terrain, plus de visibilité sur les flux, des décisions plus rapides et des standards plus faciles à partager entre sites.'
  },
  final: {
    title: 'Conclusion',
    body: 'Avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables.'
  }
}

const ingredientItems = [
  { id: 'clients', number: '01', label: 'Données clients', text: 'Qui livrer, à quelle maille, client final ou bénéficiaire.', pos: { left: '5%', top: '14%' } },
  { id: 'volumes', number: '02', label: 'Volumes repas', text: 'Charge, répartition et équilibre entre ateliers.', pos: { right: '4%', top: '10%' } },
  { id: 'tournees', number: '03', label: 'Tournées multi-sites', text: 'Temps, capacités, géographie et organisation des flux.', pos: { right: '0%', top: '46%' } },
  { id: 'menus', number: '04', label: 'Régimes & menus', text: 'Composition des sacs, choix menus et contraintes alimentaires.', pos: { left: '5%', bottom: '14%' } },
  { id: 'kpi', number: '05', label: 'KPI & référentiels', text: 'Erreurs, coûts, temps opérationnels et indicateurs communs.', pos: { right: '8%', bottom: '12%' } }
]

function App() {
  const [current, setCurrent] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const sectionRefs = useRef([])

  const scrollTo = (index) => {
    const target = Math.max(0, Math.min(sections.length - 1, index))
    sectionRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(Number(entry.target.dataset.index))
        })
      },
      { threshold: 0.58 }
    )
    sectionRefs.current.forEach((section) => section && obs.observe(section))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0
      document.documentElement.style.setProperty('--scroll-progress', `${progress}%`)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        scrollTo(current + 1)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        scrollTo(current - 1)
      }
      if (key === 'n') setNotesOpen((v) => !v)
      if (key === 'r') scrollTo(0)
      if (key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current])

  return (
    <main className="site">
      <div className="grain" />
      <Header current={current} onNav={scrollTo} onNotes={() => setNotesOpen(true)} />
      <Progress />

      <JourneySection id="intro" index={0} refs={sectionRefs}><Intro onNext={() => scrollTo(1)} /></JourneySection>
      <JourneySection id="method" index={1} refs={sectionRefs}><Method /></JourneySection>
      <JourneySection id="ingredients" index={2} refs={sectionRefs}><Ingredients /></JourneySection>
      <JourneySection id="transform" index={3} refs={sectionRefs}><Transform /></JourneySection>
      <JourneySection id="dressage" index={4} refs={sectionRefs}><Dressage /></JourneySection>
      <JourneySection id="final" index={5} refs={sectionRefs}><Final onReplay={() => scrollTo(0)} /></JourneySection>

      <ScrollCue current={current} onNext={() => scrollTo(current + 1)} />
      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} sectionId={sections[current].id} />
    </main>
  )
}

function Header({ current, onNav, onNotes }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNav(0)}>
        <span className="brand-mark"><ChefHat size={16} /></span>
        <span><strong>ansamble</strong><small>Cuisiner le collectif</small></span>
      </button>

      <nav className="site-menu" aria-label="Navigation du site">
        {sections.map((item, index) => (
          <button key={item.id} onClick={() => onNav(index)} className={current === index ? 'active' : ''}>{item.label}</button>
        ))}
      </nav>

      <div className="top-actions">
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

function Progress() { return <div className="page-progress"><span /></div> }

function JourneySection({ id, index, refs, children }) {
  return <section id={id} data-index={index} ref={(el) => (refs.current[index] = el)} className={`journey-section ${id}`}>{children}</section>
}

function SectionKicker({ children }) { return <div className="kicker reveal">{children}</div> }

function Intro({ onNext }) {
  useReveal()
  return (
    <div className="section-inner intro-grid">
      <div className="intro-copy">
        <div className="hero-chip reveal"><Sparkles size={14} /> Saison 2025/2026 · Projet logistique</div>
        <h1 className="display-title reveal">Ma recette <em>logistique</em></h1>
        <p className="lead reveal">Un vrai parcours web immersif pour montrer comment les flux, la donnée et les pratiques terrain deviennent une organisation plus lisible et plus fiable.</p>
        <div className="tag-row reveal"><span>Grand Ouest multi-sites</span><span>Portage de repas</span><span>Ansamble 2030</span></div>
        <button className="main-cta reveal" onClick={onNext}>Commencer le parcours</button>
      </div>
      <div className="intro-photo reveal">
        <div className="floating-note"><strong>Fil rouge</strong><p>Rendre les flux lisibles, les données fiables et les pratiques partageables.</p></div>
      </div>
    </div>
  )
}

function Method() {
  useReveal()
  const items = [
    ['01', 'Grand Ouest', 'Vision globale des flux', 'Comprendre les clients, volumes, tournées et arbitrages multi-sites.'],
    ['02', 'Portage de repas', 'Fiabilisation terrain', 'Guider la préparation, sécuriser les sacs et réduire les écarts.'],
    ['03', 'Ansamble 2030', 'Donnée utile et partageable', 'Passer de fichiers dispersés à des référentiels réellement exploitables.'],
    ['04', 'Méthode', 'Observer avant d’optimiser', 'Terrain, cartographie, scénarios, décision et standardisation.']
  ]
  return (
    <div className="section-inner method-grid">
      <div>
        <SectionKicker>La mise en place</SectionKicker>
        <h2 className="display-title smaller reveal">Avant la recette, choisir les <em>bons axes.</em></h2>
        <p className="lead reveal">La lecture se fait comme sur une page éditoriale : un fil continu, pas une succession de cartes figées.</p>
        <blockquote className="method-quote reveal">Objectif : raconter l’année sans dashboard, en gardant uniquement les décisions fortes à l’écran.</blockquote>
      </div>
      <div className="method-rail">
        {items.map(([number, label, title, text]) => (
          <article className="method-row reveal" key={number}>
            <div className="method-number">{number}</div>
            <div><small>{label}</small><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Ingredients() {
  const [selected, setSelected] = useState(ingredientItems[0])
  const [added, setAdded] = useState([])
  const potRef = useRef(null)
  const nodeRefs = useRef([])
  useReveal()

  useEffect(() => {
    gsap.fromTo(
      nodeRefs.current.filter(Boolean),
      { opacity: 0, y: 28, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.25 }
    )
  }, [])

  const addIngredient = (ingredient, event) => {
    setSelected(ingredient)
    if (added.includes(ingredient.id)) return
    const source = event.currentTarget.getBoundingClientRect()
    const pot = potRef.current?.getBoundingClientRect()
    if (!pot) return
    const fly = document.createElement('div')
    fly.className = 'flying-seed'
    document.body.appendChild(fly)
    const startX = source.left + source.width / 2
    const startY = source.top + source.height / 2
    const endX = pot.left + pot.width / 2
    const endY = pot.top + pot.height / 2 + 10
    const midX = (startX + endX) / 2
    const midY = Math.min(startY, endY) - 120
    gsap.set(fly, { x: startX, y: startY, opacity: 1, scale: 1 })
    gsap.to(fly, {
      duration: 0.95,
      keyframes: [
        { x: midX, y: midY, scale: 0.72, opacity: 0.95, ease: 'power2.out' },
        { x: endX, y: endY, scale: 0.18, opacity: 0, ease: 'power2.in' }
      ],
      onComplete: () => {
        fly.remove()
        setAdded((current) => [...current, ingredient.id])
        gsap.fromTo(potRef.current, { scale: 1 }, { scale: 1.045, yoyo: true, repeat: 1, duration: 0.22 })
      }
    })
  }

  return (
    <div className="section-inner ingredients-grid">
      <div className="ingredients-copy">
        <SectionKicker>Les ingrédients</SectionKicker>
        <h2 className="display-title smaller reveal">Les données entrent dans la <em>marmite.</em></h2>
        <p className="lead reveal">Les ingrédients sont espacés et animés. Chaque clic les fait entrer dans la recette, au lieu d’afficher une simple carte.</p>
        <div className="ingredient-panel reveal"><span>Ingrédient sélectionné</span><h3>{selected.label}</h3><p>{selected.text}</p></div>
        <div className="ingredient-panel progress-card reveal"><div className="mini-track"><b style={{ width: `${(added.length / ingredientItems.length) * 100}%` }} /></div><h3>{added.length} / {ingredientItems.length}</h3><p>Ingrédients ajoutés à la base de pilotage.</p></div>
      </div>
      <div className="ingredient-stage">
        <div className={`real-pot ${added.length ? 'awake' : ''}`} ref={potRef}><span className="steam s1" /><span className="steam s2" /><span className="steam s3" /></div>
        {ingredientItems.map((item, index) => (
          <button ref={(el) => (nodeRefs.current[index] = el)} key={item.id} className={`ingredient-node ${selected.id === item.id ? 'selected' : ''} ${added.includes(item.id) ? 'added' : ''}`} style={item.pos} onClick={(event) => addIngredient(item, event)}>
            <span className="dot" /><span className="num">{item.number}</span><span className="label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Transform() {
  useReveal()
  const steps = ['Observer', 'Cartographier', 'Structurer', 'Tester', 'Standardiser']
  return (
    <div className="section-inner transform-grid">
      <div>
        <SectionKicker>La transformation</SectionKicker>
        <h2 className="display-title smaller reveal">Transformer les constats terrain en <em>décisions.</em></h2>
        <p className="lead reveal">La cuisson marque la transition : le terrain, les flux et la donnée deviennent une méthode de travail.</p>
        <div className="step-row reveal">{steps.map((step, index) => <span key={step} className={index === 2 ? 'active' : ''}>{step}</span>)}</div>
      </div>
      <div className="oven-scene reveal"><div className="oven"><div className="oven-cavity"><span className="heat h1" /><span className="heat h2" /><span className="heat h3" /><span className="pot-in-oven" /></div></div></div>
    </div>
  )
}

function Dressage() {
  useReveal()
  const benefits = [['01', 'Moins d’erreurs terrain'], ['02', 'Meilleure visibilité des flux'], ['03', 'Décisions plus rapides'], ['04', 'Standards partageables entre sites']]
  return (
    <div className="section-inner dressage-inner">
      <div className="dressage-head">
        <SectionKicker>Le dressage</SectionKicker>
        <h2 className="display-title smaller reveal">Le résultat se <em>sert</em> clairement.</h2>
        <p className="lead reveal">La photo réelle remplace le rendu 3D artificiel. Le relief est léger, uniquement pour donner de la profondeur au site.</p>
      </div>
      <div className="dressage-stage reveal">
        {benefits.map(([number, text], index) => <div className={`benefit-card b${index + 1}`} key={number}><span>{number}</span><p>{text}</p></div>)}
        <div className="photo-plate"><div className="plate-shadow" /><div className="plate-frame"><div className="plate-photo" /><div className="plate-shine" /></div></div>
      </div>
    </div>
  )
}

function Final({ onReplay }) {
  useReveal()
  return (
    <div className="section-inner final-inner">
      <div className="final-card reveal">
        <SectionKicker>Conclusion</SectionKicker>
        <blockquote>Avant d’optimiser une organisation, il faut d’abord rendre ses flux <em>lisibles</em>, ses données <em>fiables</em> et ses pratiques <em>partageables</em>.</blockquote>
        <button className="main-cta" onClick={onReplay}><RotateCcw size={16} /> Revoir le parcours</button>
      </div>
    </div>
  )
}

function ScrollCue({ current, onNext }) {
  if (current === sections.length - 1) return null
  return <button className="scroll-cue" onClick={onNext}>Scroll <span>↓</span></button>
}

function NotesPanel({ open, onClose, sectionId }) {
  const data = notes[sectionId]
  return (
    <aside className={`notes-panel ${open ? 'open' : ''}`}>
      <button className="notes-close" onClick={onClose}><X size={18} /></button>
      <div className="kicker">Notes orales</div><h3>{data.title}</h3><p>{data.body}</p>
    </aside>
  )
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal').forEach((el, index) => {
            el.style.setProperty('--delay', `${index * 0.055}s`)
            el.classList.add('visible')
          })
        }
      })
    }, { threshold: 0.24 })
    document.querySelectorAll('.journey-section').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
}

export default App
