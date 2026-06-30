import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, ChefHat, Maximize, RotateCcw, X } from 'lucide-react'
import PremiumKitchenScene from './PremiumKitchenScene.jsx'

const sections = [
  { id: 'intro', label: 'Accueil' },
  { id: 'mise-en-place', label: 'Mise en place' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'cuisson', label: 'Cuisson' },
  { id: 'dressage', label: 'Dressage' },
  { id: 'conclusion', label: 'Conclusion' }
]

const notes = {
  intro: {
    title: 'Introduction',
    body: 'Je présente mon année comme une recette logistique : les bons ingrédients, une méthode claire, une cuisson maîtrisée et un dressage lisible. L’objectif est de montrer comment les flux, la donnée et les pratiques terrain peuvent devenir un système plus robuste.'
  },
  'mise-en-place': {
    title: 'Mise en place',
    body: 'Avant d’optimiser, il faut choisir les bons axes : vision globale des flux Grand Ouest, fiabilisation du portage de repas, référentiels utiles, puis observation terrain avant standardisation.'
  },
  ingredients: {
    title: 'Ingrédients',
    body: 'Les données deviennent des ingrédients : clients, volumes repas, tournées multi-sites, régimes et KPI. La scène montre ces éléments qui rejoignent la marmite : séparés, ils sont descriptifs ; ensemble, ils deviennent pilotables.'
  },
  cuisson: {
    title: 'Cuisson',
    body: 'La cuisson symbolise le travail méthode : observation, cartographie, structuration, test de scénarios et standardisation. La marmite entre dans le four pour représenter la transformation des constats en décisions.'
  },
  dressage: {
    title: 'Dressage',
    body: 'Le dressage représente les bénéfices attendus : moins d’erreurs, plus de visibilité sur les flux, des décisions plus rapides et des standards partageables entre sites.'
  },
  conclusion: {
    title: 'Conclusion',
    body: 'Le message final : avant d’optimiser une organisation, il faut rendre ses flux lisibles, sa donnée fiable et ses pratiques partageables.'
  }
}

const ingredientCards = [
  { id: 'clients', number: '01', title: 'Données clients', text: 'Qui livrer, à quelle maille, client final ou bénéficiaire.' },
  { id: 'volumes', number: '02', title: 'Volumes repas', text: 'Charge quotidienne, répartition et équilibre entre ateliers.' },
  { id: 'tournees', number: '03', title: 'Tournées multi-sites', text: 'Temps, géographie, capacités et organisation des flux.' },
  { id: 'menus', number: '04', title: 'Régimes & menus', text: 'Composition des sacs, choix menus et contraintes alimentaires.' },
  { id: 'kpi', number: '05', title: 'KPI & référentiels', text: 'Erreurs, coûts, temps opérationnels et indicateurs partagés.' }
]

const methodCards = [
  ['01', 'Vision globale des flux', 'Comprendre les clients, volumes, tournées et arbitrages multi-sites.'],
  ['02', 'Fiabilisation terrain', 'Guider la préparation, sécuriser les sacs et réduire les écarts.'],
  ['03', 'Donnée utile', 'Passer de fichiers dispersés à des référentiels vraiment exploitables.'],
  ['04', 'Observer avant d’optimiser', 'Terrain, cartographie, scénarios, décision, standardisation.']
]

export default function App() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState('clients')
  const [addedIngredients, setAddedIngredients] = useState([])
  const sectionRefs = useRef([])

  const selectedCard = useMemo(
    () => ingredientCards.find((card) => card.id === selectedIngredient) || ingredientCards[0],
    [selectedIngredient]
  )

  const goTo = (index) => {
    const next = Math.max(0, Math.min(sections.length - 1, index))
    sectionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const value = max > 0 ? window.scrollY / max : 0
      setProgress(value)
      document.documentElement.style.setProperty('--progress', `${value * 100}%`)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index))
        })
      },
      { threshold: 0.58 }
    )
    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.querySelectorAll('.reveal').forEach((el, index) => {
            el.style.setProperty('--delay', `${index * 0.06}s`)
            el.classList.add('visible')
          })
        })
      },
      { threshold: 0.22 }
    )
    document.querySelectorAll('.panel, .ingredient-board, .final-card').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        goTo(active + 1)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        goTo(active - 1)
      }
      if (key === 'n') setNotesOpen((open) => !open)
      if (key === 'r') goTo(0)
      if (key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const addIngredient = (id) => {
    setSelectedIngredient(id)
    setAddedIngredients((current) => current.includes(id) ? current : [...current, id])
  }

  return (
    <main className="app-shell">
      <div className="grain" />
      <div className="canvas-layer" aria-hidden="true">
        <PremiumKitchenScene progress={progress} addedIngredients={addedIngredients} selectedIngredient={selectedIngredient} />
      </div>

      <Header active={active} onNav={goTo} onNotes={() => setNotesOpen(true)} />
      <div className="progress-bar"><span /></div>

      <section id="intro" className="scene-section intro-section" data-index="0" ref={(el) => (sectionRefs.current[0] = el)}>
        <div className="panel hero-panel">
          <div className="eyebrow reveal">Saison 2025/2026 · Projet logistique</div>
          <h1 className="hero-title reveal">Ma recette <em>logistique</em></h1>
          <p className="lead reveal">Une expérience web premium pour raconter comment les flux, la donnée et le terrain deviennent une organisation plus lisible, plus fiable et plus partageable.</p>
          <div className="tag-row reveal">
            <span>Grand Ouest multi-sites</span>
            <span>Portage de repas</span>
            <span>Méthode terrain</span>
          </div>
          <button className="primary-cta reveal" onClick={() => goTo(1)}>Entrer dans la recette</button>
        </div>
      </section>

      <section id="mise-en-place" className="scene-section method-section" data-index="1" ref={(el) => (sectionRefs.current[1] = el)}>
        <div className="panel wide-panel">
          <div className="eyebrow reveal">01 · La mise en place</div>
          <h2 className="section-title reveal">Choisir les <em>bons axes</em> avant d’optimiser.</h2>
          <p className="lead reveal">La présentation devient un site narratif : on ne liste pas des slides, on installe une méthode.</p>
          <div className="method-grid reveal">
            {methodCards.map(([number, title, text]) => (
              <article className="method-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ingredients" className="scene-section ingredients-section" data-index="2" ref={(el) => (sectionRefs.current[2] = el)}>
        <div className="ingredient-board">
          <div className="ingredient-copy">
            <div className="eyebrow reveal">02 · Les ingrédients</div>
            <h2 className="section-title reveal">La donnée entre dans la <em>marmite.</em></h2>
            <p className="lead reveal">Clique sur les ingrédients : ils rejoignent réellement la scène 3D, au lieu d’être de simples pastilles décoratives.</p>
            <div className="selected-card reveal">
              <span>Ingrédient sélectionné</span>
              <h3>{selectedCard.title}</h3>
              <p>{selectedCard.text}</p>
            </div>
            <div className="ingredient-progress reveal">
              <div><b style={{ width: `${(addedIngredients.length / ingredientCards.length) * 100}%` }} /></div>
              <strong>{addedIngredients.length} / {ingredientCards.length}</strong>
              <p>Ingrédients intégrés à la recette.</p>
            </div>
          </div>
          <div className="ingredient-actions reveal">
            {ingredientCards.map((item) => (
              <button
                key={item.id}
                className={`${selectedIngredient === item.id ? 'selected' : ''} ${addedIngredients.includes(item.id) ? 'added' : ''}`}
                onClick={() => addIngredient(item.id)}
              >
                <span>{item.number}</span>
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="cuisson" className="scene-section cooking-section" data-index="3" ref={(el) => (sectionRefs.current[3] = el)}>
        <div className="panel cooking-panel">
          <div className="eyebrow reveal">03 · La cuisson</div>
          <h2 className="section-title reveal">Transformer les constats terrain en <em>décisions.</em></h2>
          <p className="lead reveal">La marmite passe dans le four : observation, cartographie, structuration, test des scénarios, puis standardisation.</p>
          <div className="step-row reveal">
            <span>Observer</span>
            <span>Cartographier</span>
            <span className="active">Structurer</span>
            <span>Tester</span>
            <span>Standardiser</span>
          </div>
        </div>
      </section>

      <section id="dressage" className="scene-section dressage-section" data-index="4" ref={(el) => (sectionRefs.current[4] = el)}>
        <div className="panel dressage-panel">
          <div className="eyebrow reveal">04 · Le dressage</div>
          <h2 className="section-title reveal">Un résultat plus <em>clair</em> et plus robuste.</h2>
          <p className="lead reveal">Le dressage utilise une vraie photo comme texture de l’assiette, intégrée dans une scène 3D sobre pour éviter le rendu gadget.</p>
          <div className="benefit-list reveal">
            <span>Moins d’erreurs terrain</span>
            <span>Meilleure visibilité des flux</span>
            <span>Décisions plus rapides</span>
            <span>Standards partageables</span>
          </div>
        </div>
      </section>

      <section id="conclusion" className="scene-section final-section" data-index="5" ref={(el) => (sectionRefs.current[5] = el)}>
        <div className="final-card">
          <div className="eyebrow reveal">Conclusion</div>
          <blockquote className="reveal">Avant d’optimiser une organisation, il faut rendre ses flux <em>lisibles</em>, sa donnée <em>fiable</em> et ses pratiques <em>partageables</em>.</blockquote>
          <button className="primary-cta reveal" onClick={() => goTo(0)}><RotateCcw size={16} /> Revoir le parcours</button>
        </div>
      </section>

      {active < sections.length - 1 && (
        <button className="scroll-cue" onClick={() => goTo(active + 1)}>Scroll</button>
      )}

      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} id={sections[active].id} />
    </main>
  )
}

function Header({ active, onNav, onNotes }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNav(0)}>
        <span><ChefHat size={16} /></span>
        <strong>ansamble</strong>
        <small>Cuisiner le collectif</small>
      </button>
      <nav>
        {sections.map((item, index) => (
          <button key={item.id} onClick={() => onNav(index)} className={active === index ? 'active' : ''}>{item.label}</button>
        ))}
      </nav>
      <div className="header-actions">
        <button onClick={onNotes}><BookOpen size={15} /> Notes</button>
        <button onClick={() => !document.fullscreenElement ? document.documentElement.requestFullscreen?.() : document.exitFullscreen?.()}><Maximize size={15} /> Plein écran</button>
      </div>
    </header>
  )
}

function NotesPanel({ open, onClose, id }) {
  const note = notes[id]
  return (
    <aside className={`notes-panel ${open ? 'open' : ''}`}>
      <button className="close-notes" onClick={onClose}><X size={18} /></button>
      <div className="eyebrow">Notes orales</div>
      <h3>{note.title}</h3>
      <p>{note.body}</p>
    </aside>
  )
}
