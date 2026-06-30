import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, BookOpen, ChefHat, Maximize, RotateCcw, Sparkles, X } from 'lucide-react'

const sections = [
  { id: 'intro', label: 'Accueil' },
  { id: 'method', label: 'Mise en place' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'transform', label: 'Cuisson' },
  { id: 'dressage', label: 'Dressage' },
  { id: 'final', label: 'Conclusion' }
]

const notes = {
  intro: { title: 'Introduction', body: 'Le format recette sert de fil rouge à toute la présentation : choisir les bons ingrédients, les préparer, les faire mijoter, puis dresser un résultat clair.' },
  method: { title: 'Mise en place', body: 'La mise en place présente les axes de l’année : flux multi-sites, fiabilisation terrain, donnée utile et méthode.' },
  ingredients: { title: 'Ingrédients', body: 'Les données deviennent des ingrédients 3D : elles se déplacent vers la marmite pour symboliser la structuration progressive de la base de pilotage.' },
  transform: { title: 'Cuisson', body: 'La cuisson transforme les constats terrain en décisions : observer, cartographier, structurer, tester puis standardiser.' },
  dressage: { title: 'Dressage', body: 'Le dressage est recréé en 3D sans photo : assiette, légumes, falafels, houmous et feuilles, inspirés du plat de référence.' },
  final: { title: 'Conclusion', body: 'Avant d’optimiser, il faut rendre les flux lisibles, les données fiables et les pratiques partageables.' }
}

const ingredientData = [
  { id: 'clients', type: 'peas', number: '01', label: 'Données clients', text: 'Qui livrer, à quelle maille, client final ou bénéficiaire.', pos: { left: '4%', top: '13%' } },
  { id: 'volumes', type: 'carrot', number: '02', label: 'Volumes repas', text: 'Charge, répartition et équilibre entre ateliers.', pos: { right: '3%', top: '11%' } },
  { id: 'tournees', type: 'herb', number: '03', label: 'Tournées multi-sites', text: 'Temps, capacités, géographie et organisation des flux.', pos: { right: '1%', top: '47%' } },
  { id: 'menus', type: 'onion', number: '04', label: 'Régimes & menus', text: 'Composition des sacs, choix menus et contraintes alimentaires.', pos: { left: '5%', bottom: '12%' } },
  { id: 'kpi', type: 'grains', number: '05', label: 'KPI & référentiels', text: 'Erreurs, coûts, temps opérationnels et indicateurs communs.', pos: { right: '9%', bottom: '14%' } }
]

const methodItems = [
  ['01', 'Préparer le plan de travail', 'Vision globale des flux', 'Comprendre les clients, volumes, tournées et arbitrages multi-sites.'],
  ['02', 'Sécuriser le geste', 'Fiabilisation terrain', 'Guider la préparation, sécuriser les sacs et réduire les écarts.'],
  ['03', 'Peser les bonnes données', 'Donnée utile et partageable', 'Passer de fichiers dispersés à des référentiels réellement exploitables.'],
  ['04', 'Goûter avant d’assaisonner', 'Observer avant d’optimiser', 'Terrain, cartographie, scénarios, décision et standardisation.']
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setCurrent(Number(entry.target.dataset.index)))
    }, { threshold: 0.56 })
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
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); goTo(current + 1) }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); goTo(current - 1) }
      if (key === 'n') setNotesOpen((v) => !v)
      if (key === 'r') goTo(0)
      if (key === 'f') !document.fullscreenElement ? document.documentElement.requestFullscreen?.() : document.exitFullscreen?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current])

  return (
    <main className="site-shell">
      <div className="global-grain" />
      <Header current={current} onNav={goTo} onNotes={() => setNotesOpen(true)} />
      <div className="global-progress"><span /></div>
      <Section id="intro" index={0} refs={sectionRefs}><IntroSection onNext={() => goTo(1)} /></Section>
      <Section id="method" index={1} refs={sectionRefs}><MethodSection /></Section>
      <Section id="ingredients" index={2} refs={sectionRefs}><IngredientsSection /></Section>
      <Section id="transform" index={3} refs={sectionRefs}><TransformSection /></Section>
      <Section id="dressage" index={4} refs={sectionRefs}><DressageSection /></Section>
      <Section id="final" index={5} refs={sectionRefs}><ConclusionSection onReplay={() => goTo(0)} /></Section>
      {current < sections.length - 1 && <button className="scroll-pill" onClick={() => goTo(current + 1)}>Scroll <ArrowDown size={16} /></button>}
      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} sectionId={sections[current].id} />
    </main>
  )
}

function Section({ id, index, refs, children }) {
  return <section id={id} data-index={index} ref={(el) => (refs.current[index] = el)} className={`journey-section ${id}`}>{children}</section>
}

function Header({ current, onNav, onNotes }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNav(0)}><span className="brand-mark"><ChefHat size={16} /></span><span><strong>ansamble</strong><small>Cuisiner le collectif</small></span></button>
      <nav className="site-nav">{sections.map((item, index) => <button key={item.id} className={current === index ? 'active' : ''} onClick={() => onNav(index)}>{item.label}</button>)}</nav>
      <div className="header-actions"><button className="ghost-btn" onClick={onNotes}><BookOpen size={15} /> Notes</button><button className="solid-btn" onClick={() => !document.fullscreenElement ? document.documentElement.requestFullscreen?.() : document.exitFullscreen?.()}><Maximize size={15} /> Plein écran</button></div>
    </header>
  )
}

function Kicker({ children }) { return <div className="kicker reveal">{children}</div> }

function IntroSection({ onNext }) {
  const rootRef = useRevealScope()
  return (
    <div className="section-frame intro-frame" ref={rootRef}>
      <div className="split-layout">
        <div className="copy-side">
          <div className="hero-chip reveal"><Sparkles size={14} /> Saison 2025/2026 · Projet logistique</div>
          <h1 className="display-title reveal">Ma recette <em>logistique</em></h1>
          <p className="body-lead reveal">Un site immersif en forme de recette : on prépare, on assemble, on fait mijoter, puis on sert une logistique plus lisible.</p>
          <div className="tag-row reveal"><span>Grand Ouest multi-sites</span><span>Portage de repas</span><span>Pilotage par la donnée</span></div>
          <button className="main-cta reveal" onClick={onNext}>Commencer le parcours</button>
        </div>
        <div className="hero-showcase reveal"><div className="hero-single-photo"><div className="hero-float-card"><strong>Fil rouge</strong><p>Rendre les flux lisibles, les données fiables et les pratiques partageables.</p></div></div></div>
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
          <h2 className="display-title smaller reveal">Avant la cuisson, préparer les <em>bons axes.</em></h2>
          <p className="body-lead reveal">Le thème recette est maintenant présent partout : cette étape correspond à la préparation du plan de travail avant de lancer les projets.</p>
          <div className="quote-block reveal"><span className="quote-line" /><p>Objectif : choisir les ingrédients utiles, éviter le bruit, puis construire une méthode réutilisable.</p></div>
        </div>
        <div className="method-rail">
          {methodItems.map(([number, small, title, text]) => <article className="rail-row reveal" key={number}><div className="rail-number">{number}</div><div className="rail-texts"><small>{small}</small><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </div>
    </div>
  )
}

function FoodIcon({ type }) {
  return <span className={`food-icon ${type}`}><i /><i /><i /></span>
}

function Pot3D({ active, oven = false }) {
  return (
    <div className={`css-pot ${active ? 'active' : ''} ${oven ? 'oven-pot' : ''}`}>
      <div className="pot-handle left" />
      <div className="pot-handle right" />
      <div className="pot-body" />
      <div className="pot-rim" />
      <div className="pot-inner" />
      <div className="pot-liquid" />
      <span className="steam s1" /><span className="steam s2" /><span className="steam s3" />
    </div>
  )
}

function IngredientsSection() {
  const rootRef = useRevealScope()
  const [selected, setSelected] = useState(ingredientData[0])
  const [added, setAdded] = useState([])
  const potRef = useRef(null)
  const progress = useMemo(() => `${(added.length / ingredientData.length) * 100}%`, [added])

  const animateToPot = (ingredient, event) => {
    const source = event.currentTarget.getBoundingClientRect()
    const pot = potRef.current?.getBoundingClientRect()
    if (!pot) return
    const fly = document.createElement('div')
    fly.className = `flying-food ${ingredient.type}`
    fly.innerHTML = '<i></i><i></i><i></i>'
    document.body.appendChild(fly)
    const sx = source.left + source.width / 2
    const sy = source.top + source.height / 2
    const ex = pot.left + pot.width / 2
    const ey = pot.top + pot.height / 2
    fly.style.left = `${sx}px`; fly.style.top = `${sy}px`
    fly.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${(ex - sx) * .45}px, ${(ey - sy) * .52 - 130}px) scale(.9) rotate(160deg)`, opacity: .95 },
      { transform: `translate(${ex - sx}px, ${ey - sy}px) scale(.25) rotate(320deg)`, opacity: 0 }
    ], { duration: 920, easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = () => fly.remove()
  }

  const handleClick = (ingredient, event) => {
    setSelected(ingredient)
    if (!added.includes(ingredient.id)) {
      setAdded((prev) => [...prev, ingredient.id])
      animateToPot(ingredient, event)
    }
  }

  return (
    <div className="section-frame ingredients-frame" ref={rootRef}>
      <div className="ingredients-layout">
        <div className="ingredients-side">
          <Kicker>Les ingrédients</Kicker>
          <h2 className="display-title smaller reveal">Les données entrent dans la <em>marmite.</em></h2>
          <p className="body-lead reveal">La marmite est maintenant reconstruite en 3D CSS : plus de photo posée. Les ingrédients sont des visualisations 3D qui volent vers le centre au clic.</p>
          <div className="info-card reveal"><span>Ingrédient sélectionné</span><h3>{selected.label}</h3><p>{selected.text}</p></div>
          <div className="info-card reveal"><div className="mini-track"><b style={{ width: progress }} /></div><h3>{added.length} / {ingredientData.length}</h3><p>Ingrédients intégrés à la base de pilotage.</p></div>
        </div>
        <div className="ingredient-scene reveal">
          <div className={`scene-3d ${added.length ? 'active' : ''}`} ref={potRef}>
            <div className="table-shadow" /><div className="table-plane" /><div className="pot-pedestal" /><Pot3D active={added.length > 0} />
          </div>
          {ingredientData.map((item) => <button key={item.id} className={`ingredient-chip ${selected.id === item.id ? 'selected' : ''} ${added.includes(item.id) ? 'added' : ''}`} style={item.pos} onClick={(event) => handleClick(item, event)}><FoodIcon type={item.type} /><span className="chip-number">{item.number}</span><span className="chip-label">{item.label}</span></button>)}
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
        <div><Kicker>La cuisson</Kicker><h2 className="display-title smaller reveal">Transformer les constats terrain en <em>décisions.</em></h2><p className="body-lead reveal">La scène de cuisson a été refaite : four, chaleur, profondeur et marmite sont reconstruits en 3D CSS, sans photo de marmite.</p><div className="step-row reveal">{transformSteps.map((step, index) => <span key={step} className={index === 2 ? 'active' : ''}>{step}</span>)}</div></div>
        <div className="oven-scene reveal"><div className="oven-shell"><div className="oven-top" /><div className="oven-body" /><div className="oven-cavity"><div className="rack rack-a" /><div className="rack rack-b" /><div className="heat-orb heat-a" /><div className="heat-orb heat-b" /><div className="heat-orb heat-c" /><div className="oven-pot-wrap"><Pot3D active oven /></div></div><div className="oven-floor-shadow" /></div></div>
      </div>
    </div>
  )
}

function Dish3D() {
  return (
    <div className="dish-scene">
      <div className="plating-shadow" />
      <div className="plate-base" />
      <div className="plate-rim" />
      <div className="plate-inner" />
      <div className="pumpkin p1" /><div className="pumpkin p2" /><div className="pumpkin p3" />
      <div className="cauli c1" /><div className="cauli c2" /><div className="cauli c3" /><div className="cauli c4" />
      <div className="falafel f1" /><div className="falafel f2" /><div className="falafel f3" /><div className="falafel f4" />
      <div className="hummus"><i /><i /><i /><i /></div>
      <div className="leaf l1" /><div className="leaf l2" /><div className="leaf l3" /><div className="leaf l4" />
      <div className="plate-gloss" />
    </div>
  )
}

function DressageSection() {
  const rootRef = useRevealScope()
  const benefits = [['01', 'Moins d’erreurs terrain'], ['02', 'Meilleure visibilité des flux'], ['03', 'Décisions plus rapides'], ['04', 'Standards partageables']]
  return (
    <div className="section-frame" ref={rootRef}>
      <div className="dressage-head"><Kicker>Le dressage</Kicker><h2 className="display-title smaller reveal">Le résultat se <em>sert</em> clairement.</h2><p className="body-lead center reveal">Plus de photo : le plat de référence est recréé en 3D avec légumes, falafels, houmous, feuilles et volume d’assiette.</p></div>
      <div className="dressage-stage reveal">{benefits.map(([number, text], index) => <div className={`benefit-card b${index + 1}`} key={number}><span>{number}</span><p>{text}</p></div>)}<Dish3D /></div>
    </div>
  )
}

function ConclusionSection({ onReplay }) {
  const rootRef = useRevealScope()
  return <div className="section-frame" ref={rootRef}><div className="final-card reveal"><Kicker>Conclusion</Kicker><blockquote>Avant d’optimiser une organisation, il faut d’abord rendre ses flux <em>lisibles</em>, ses données <em>fiables</em> et ses pratiques <em>partageables</em>.</blockquote><button className="main-cta" onClick={onReplay}><RotateCcw size={16} /> Revoir le parcours</button></div></div>
}

function NotesPanel({ open, onClose, sectionId }) {
  const data = notes[sectionId]
  return <aside className={`notes-panel ${open ? 'open' : ''}`}><button className="notes-close" onClick={onClose}><X size={18} /></button><div className="kicker">Notes orales</div><h3>{data.title}</h3><p>{data.body}</p></aside>
}

function useRevealScope() {
  const rootRef = useRef(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.querySelectorAll('.reveal').forEach((el, index) => { el.style.setProperty('--delay', `${index * 0.055}s`); el.classList.add('visible') })
      })
    }, { threshold: 0.22 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])
  return rootRef
}
