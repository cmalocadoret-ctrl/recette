import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
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

const deepGreen = '#243A2C'
const terracotta = '#C66A3A'
const terracottaLight = '#E0843F'
const cream = '#F4E8D1'
const dark = '#17120D'

const scenes = [
  { id: 'hero', label: 'Introduction' },
  { id: 'themes', label: 'Mise en place' },
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'cuisson', label: 'Cuisson' },
  { id: 'dressage', label: 'Dressage' },
  { id: 'conclusion', label: 'Conclusion' }
]

const notes = {
  hero: {
    title: 'Introduction',
    body: `Bonjour à tous. J’ai choisi de présenter mon année sous la forme d’une recette, parce que chez Ansamble, un bon résultat dépend à la fois des bons ingrédients, d’une bonne méthode, et d’une vraie adaptation au terrain. Mon fil rouge cette année a été simple : rendre les flux plus lisibles, fiabiliser les données, et construire des pratiques plus faciles à partager entre les sites.`
  },
  themes: {
    title: 'Les grands axes',
    body: `J’ai structuré mon année autour de quatre axes. D’abord, passer d’une vision locale des flux à une vision plus globale, notamment sur le Grand Ouest. Ensuite, fiabiliser le terrain avec le sujet du portage de repas. Troisième axe : la donnée, parce qu’on ne peut pas piloter durablement avec des informations dispersées. Enfin, une conviction méthode : avant d’optimiser, il faut observer, comprendre et cartographier.`
  },
  ingredients: {
    title: 'Les ingrédients',
    body: `Les projets reposent tous sur quelques ingrédients logistiques très concrets : les données clients, les volumes repas, les tournées, les contraintes multi-sites, les régimes, les menus et les indicateurs. Pris séparément, ce sont des informations de terrain. Une fois réunies, elles deviennent une vraie base de pilotage.`
  },
  cuisson: {
    title: 'La transformation',
    body: `La cuisson représente le travail méthode : observer le terrain, cartographier les flux, structurer les données, tester des scénarios, puis formaliser des standards. C’est là que les constats terrain deviennent des décisions opérationnelles.`
  },
  dressage: {
    title: 'Les bénéfices',
    body: `Le résultat attendu n’est pas seulement un outil ou une belle cartographie. C’est une logistique plus robuste : moins d’erreurs terrain, une meilleure visibilité des flux, des décisions plus rapides, et des standards plus faciles à partager entre les ateliers.`
  },
  conclusion: {
    title: 'Conclusion',
    body: `Cette année m’a montré qu’avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables. C’est cette base qui permet ensuite de développer le portage et de faire grandir les pratiques logistiques.`
  }
}

const ingredients = [
  {
    id: 'clients',
    label: 'Données clients',
    short: 'Qui livrer, à quelle maille, client final ou bénéficiaire.',
    shape: 'peas',
    color: '#5F7D4E',
    angle: 95
  },
  {
    id: 'volumes',
    label: 'Volumes repas',
    short: 'Charge, répartition, équilibre entre sites.',
    shape: 'carrots',
    color: terracottaLight,
    angle: 25
  },
  {
    id: 'tournees',
    label: 'Tournées multi-sites',
    short: 'Géographie, temps, capacité et organisation des flux.',
    shape: 'herbs',
    color: '#3F684A',
    angle: -35
  },
  {
    id: 'menus',
    label: 'Régimes & menus',
    short: 'Composition des sacs, choix menus, contraintes alimentaires.',
    shape: 'lemon',
    color: '#D5A044',
    angle: -145
  },
  {
    id: 'kpi',
    label: 'KPI & référentiels',
    short: 'Erreurs, coûts, temps opérationnels et indicateurs communs.',
    shape: 'tomatoes',
    color: '#BB4B38',
    angle: 170
  }
]

function App() {
  const [scene, setScene] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const sceneData = scenes[scene]

  const next = () => setScene((s) => Math.min(scenes.length - 1, s + 1))
  const prev = () => setScene((s) => Math.max(0, s - 1))
  const replay = () => {
    setReplayKey((k) => k + 1)
    setScene(0)
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') next()
      if (event.key === 'ArrowLeft') prev()
      if (event.key.toLowerCase() === 'n') setNotesOpen((v) => !v)
      if (event.key.toLowerCase() === 'r') replay()
      if (event.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    gsap.fromTo(
      '.scene.is-active .motion-in',
      { y: 28, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.08 }
    )
  }, [scene, replayKey])

  return (
    <main className="app" data-scene={sceneData.id}>
      <AmbientGrain />
      <TopBar scene={scene} setScene={setScene} onNotes={() => setNotesOpen(true)} onReplay={replay} />
      <div className="presentation-shell">
        <Progress scene={scene} />
        <section className={`scene ${scene === 0 ? 'is-active' : ''}`} aria-hidden={scene !== 0}>
          {scene === 0 && <HeroScene onNext={next} key={`hero-${replayKey}`} />}
        </section>
        <section className={`scene ${scene === 1 ? 'is-active' : ''}`} aria-hidden={scene !== 1}>
          {scene === 1 && <ThemesScene />}
        </section>
        <section className={`scene ${scene === 2 ? 'is-active' : ''}`} aria-hidden={scene !== 2}>
          {scene === 2 && <IngredientsScene />}
        </section>
        <section className={`scene ${scene === 3 ? 'is-active' : ''}`} aria-hidden={scene !== 3}>
          {scene === 3 && <OvenScene />}
        </section>
        <section className={`scene ${scene === 4 ? 'is-active' : ''}`} aria-hidden={scene !== 4}>
          {scene === 4 && <DressageScene />}
        </section>
        <section className={`scene ${scene === 5 ? 'is-active' : ''}`} aria-hidden={scene !== 5}>
          {scene === 5 && <ConclusionScene onReplay={replay} />}
        </section>
      </div>
      <SceneControls scene={scene} onPrev={prev} onNext={next} onReplay={replay} />
      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} sceneId={sceneData.id} />
    </main>
  )
}

function TopBar({ scene, setScene, onNotes, onReplay }) {
  return (
    <header className="topbar">
      <button className="brand-lockup" onClick={() => setScene(0)} aria-label="Retour à l'introduction">
        <span className="chef-dot"><ChefHat size={16} /></span>
        <span>
          <strong>ansamble</strong>
          <small>Cuisiner le collectif</small>
        </span>
      </button>
      <nav className="nav-dots" aria-label="Navigation de la présentation">
        {scenes.map((item, index) => (
          <button
            key={item.id}
            className={index === scene ? 'active' : ''}
            onClick={() => setScene(index)}
            title={item.label}
          >
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

function SceneControls({ scene, onPrev, onNext, onReplay }) {
  return (
    <div className="scene-controls">
      <button onClick={onPrev} disabled={scene === 0}><ArrowLeft size={18} /> Précédent</button>
      {scene < scenes.length - 1 ? (
        <button className="next" onClick={onNext}>Suivant <ArrowRight size={18} /></button>
      ) : (
        <button className="next" onClick={onReplay}>Rejouer <RotateCcw size={18} /></button>
      )}
    </div>
  )
}

function Progress({ scene }) {
  return (
    <div className="progress-line" aria-hidden="true">
      <span style={{ width: `${((scene + 1) / scenes.length) * 100}%` }} />
    </div>
  )
}

function HeroScene({ onNext }) {
  return (
    <div className="hero-layout">
      <div className="hero-backdrop-canvas">
        <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 2.8, 8], fov: 45 }}>
          <HeroFood3D />
        </Canvas>
      </div>
      <div className="hero-card motion-in">
        <div className="browser-bar">
          <span className="mini-brand"><ChefHat size={14} /> Ansamble Method Lab</span>
          <button onClick={onNext}>Commencer</button>
        </div>
        <div className="hero-visual">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 1.8, 6]} fov={42} />
            <HeroFood3D compact />
          </Canvas>
          <div className="hero-overlay" />
          <div className="hero-copy">
            <div className="season-pill motion-in"><Sparkles size={14} /> Saison 2025/2026 · Projet logistique</div>
            <h1 className="motion-in">Ma recette <span>logistique</span></h1>
            <p className="motion-in">Rendre les flux lisibles, les données fiables et les pratiques partageables.</p>
            <div className="hero-tags motion-in">
              <span>Grand Ouest multi-sites</span>
              <span>Portage de repas</span>
              <span>Ansamble 2030</span>
            </div>
            <div className="hero-buttons motion-in">
              <button className="primary-button" onClick={onNext}>Lancer la recette <ArrowRight size={17} /></button>
              <button className="glass-button">5 à 7 min</button>
            </div>
          </div>
        </div>
      </div>
      <p className="hero-caption motion-in">Un support interactif, pensé comme un mini-site de marque : 3D, navigation clavier, notes masquées et scène plein écran.</p>
    </div>
  )
}

function HeroFood3D({ compact = false }) {
  return (
    <>
      <color attach="background" args={[compact ? '#16120d' : '#21170f']} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 6, 4]} intensity={2.5} castShadow />
      <pointLight position={[-4, -2, 3]} intensity={1.6} color={terracottaLight} />
      <group rotation={[0.15, 0, -0.05]} scale={compact ? 1 : 1.35}>
        <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.35}>
          <CarrotCluster position={[2.25, 0.15, 0]} rotation={[0.1, -0.7, -0.25]} scale={0.9} />
        </Float>
        <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.25}>
          <PeaBowl position={[-2.2, -0.2, 0.2]} scale={0.95} />
        </Float>
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.25}>
          <HerbBundle position={[0.2, 0.9, -0.45]} rotation={[0.4, 0.3, -0.15]} scale={1.0} />
        </Float>
        <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.2}>
          <TomatoGroup position={[2.05, -1.1, 0.35]} scale={0.78} />
        </Float>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, -0.5]}>
          <planeGeometry args={[8, 5]} />
          <meshStandardMaterial color="#382718" roughness={0.9} metalness={0.05} />
        </mesh>
      </group>
    </>
  )
}

function ThemesScene() {
  const items = [
    ['01', 'Vision globale des flux', 'Réorganisation logistique Grand Ouest : comprendre les clients, volumes, tournées et arbitrages multi-sites.'],
    ['02', 'Fiabilisation terrain', 'Portage de repas : guider la préparation, sécuriser les sacs, réduire les écarts tout en gardant la cadence.'],
    ['03', 'Donnée utile et partageable', 'Ansamble 2030 : passer de fichiers dispersés à des référentiels et indicateurs exploitables.'],
    ['04', 'Observer avant d’optimiser', 'Une démarche méthodes : terrain, cartographie, scénarios, décision, standardisation.']
  ]
  return (
    <div className="editorial-layout">
      <div className="kicker motion-in">Scène 02 · La mise en place</div>
      <h2 className="section-title motion-in">Avant la recette, choisir les <em>bons axes</em>.</h2>
      <div className="theme-grid">
        {items.map(([n, title, text]) => (
          <article className="theme-card motion-in" key={n}>
            <span>{n}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="signature-note motion-in">Objectif : raconter l’année sans afficher un dashboard, en gardant uniquement les décisions fortes à l’écran.</div>
    </div>
  )
}

function IngredientsScene() {
  const [collected, setCollected] = useState([])
  const selected = collected.length
  const collect = (id) => setCollected((old) => old.includes(id) ? old : [...old, id])

  return (
    <div className="ingredients-layout">
      <div className="ingredients-copy">
        <div className="kicker motion-in">Scène 03 · Les ingrédients</div>
        <h2 className="section-title motion-in">Les données entrent dans la <em>marmite</em>.</h2>
        <p className="lead motion-in">Clique sur les ingrédients : ils se détachent, entrent réellement dans la marmite 3D et déclenchent la progression de la recette.</p>
        <div className="recipe-meter motion-in">
          <div><span style={{ width: `${(selected / ingredients.length) * 100}%` }} /></div>
          <strong>{selected} / {ingredients.length}</strong>
          <small>{selected === ingredients.length ? 'Base prête pour la cuisson.' : 'Ingrédients ajoutés à la méthode.'}</small>
        </div>
      </div>
      <div className="canvas-card motion-in">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2.4, 7.2], fov: 44 }}>
          <IngredientKitchen3D collected={collected} onCollect={collect} />
        </Canvas>
      </div>
    </div>
  )
}

function IngredientKitchen3D({ collected, onCollect }) {
  return (
    <>
      <color attach="background" args={['#f5ead5']} />
      <ambientLight intensity={0.85} />
      <directionalLight castShadow position={[3, 5, 4]} intensity={2.2} />
      <pointLight position={[-3, 2, 3]} color={terracottaLight} intensity={1.2} />
      <Pot3D progress={collected.length / ingredients.length} />
      {ingredients.map((item) => (
        <IngredientObject
          key={item.id}
          item={item}
          collected={collected.includes(item.id)}
          onCollect={() => onCollect(item.id)}
        />
      ))}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.06, 0]}>
        <planeGeometry args={[8.5, 6]} />
        <meshStandardMaterial color="#eadcc4" roughness={0.95} />
      </mesh>
    </>
  )
}

function IngredientObject({ item, collected, onCollect }) {
  const ref = useRef()
  const progress = useRef(0)
  const angle = THREE.MathUtils.degToRad(item.angle)
  const start = useMemo(() => new THREE.Vector3(Math.cos(angle) * 2.75, 0.1, Math.sin(angle) * 1.6), [angle])
  const target = useMemo(() => new THREE.Vector3(0, 0.55, 0), [])

  useFrame((state, delta) => {
    progress.current = THREE.MathUtils.damp(progress.current, collected ? 1 : 0, 4.2, delta)
    const p = progress.current
    const arc = Math.sin(p * Math.PI) * 1.65
    const x = THREE.MathUtils.lerp(start.x, target.x, p)
    const y = THREE.MathUtils.lerp(start.y, target.y, p) + arc
    const z = THREE.MathUtils.lerp(start.z, target.z, p)
    if (ref.current) {
      ref.current.position.set(x, y, z)
      ref.current.rotation.y += delta * (collected ? 2 : 0.45)
      ref.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.08, Math.max(0, (p - 0.85) / 0.15)))
      ref.current.visible = p < 0.99
    }
  })

  return (
    <group ref={ref} onClick={(e) => { e.stopPropagation(); onCollect() }}>
      <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.18}>
        <IngredientShape item={item} />
        <Html center distanceFactor={8} position={[0, -0.78, 0]} occlude>
          <button className="ingredient-label" onClick={onCollect}>
            <strong>{item.label}</strong>
            <small>{item.short}</small>
          </button>
        </Html>
      </Float>
    </group>
  )
}

function IngredientShape({ item }) {
  if (item.shape === 'carrots') return <CarrotCluster scale={0.36} />
  if (item.shape === 'peas') return <PeaBowl scale={0.42} />
  if (item.shape === 'herbs') return <HerbBundle scale={0.44} />
  if (item.shape === 'lemon') return <LemonSlice color={item.color} />
  return <TomatoGroup scale={0.35} />
}

function OvenScene() {
  const steps = ['Observer le terrain', 'Cartographier les flux', 'Structurer la donnée', 'Tester les scénarios', 'Standardiser']
  const [activeStep, setActiveStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActiveStep((s) => (s + 1) % steps.length), 1250)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="oven-layout">
      <div className="kicker motion-in">Scène 04 · La cuisson</div>
      <h2 className="section-title light motion-in">Transformer les constats terrain en <em>décisions</em>.</h2>
      <div className="oven-canvas motion-in">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2.2, 7], fov: 42 }}>
          <Oven3D activeStep={activeStep} />
        </Canvas>
      </div>
      <div className="method-track motion-in">
        {steps.map((step, index) => (
          <span key={step} className={index === activeStep ? 'active' : ''}>{step}</span>
        ))}
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
    'Logistique plus robuste pour accompagner le portage'
  ]
  return (
    <div className="dressage-layout">
      <div className="dish-canvas motion-in">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2.8, 7], fov: 43 }}>
          <Plate3D />
        </Canvas>
      </div>
      <div className="benefits-panel">
        <div className="kicker motion-in">Scène 05 · Le dressage final</div>
        <h2 className="section-title motion-in">Ce que la recette <em>donne en bouche</em>.</h2>
        <ul>
          {benefits.map((benefit, index) => <li className="motion-in" key={benefit}><span>{String(index + 1).padStart(2, '0')}</span>{benefit}</li>)}
        </ul>
      </div>
    </div>
  )
}

function ConclusionScene({ onReplay }) {
  return (
    <div className="conclusion-layout">
      <Canvas className="conclusion-canvas" dpr={[1, 2]} camera={{ position: [0, 1.6, 7], fov: 45 }}>
        <Conclusion3D />
      </Canvas>
      <div className="conclusion-copy">
        <div className="kicker light motion-in">Conclusion</div>
        <blockquote className="motion-in">Avant d’optimiser une organisation, il faut d’abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables.</blockquote>
        <p className="motion-in">Ma recette logistique 2025/2026 · Ansamble</p>
        <button className="primary-button motion-in" onClick={onReplay}>Rejouer l’expérience <RotateCcw size={17} /></button>
      </div>
    </div>
  )
}

function NotesPanel({ open, onClose, sceneId }) {
  const current = notes[sceneId]
  return (
    <aside className={`notes-panel ${open ? 'open' : ''}`}>
      <button className="close-notes" onClick={onClose}><X size={20} /></button>
      <span className="notes-eyebrow">Notes orales</span>
      <h3>{current.title}</h3>
      <p>{current.body}</p>
      <div className="shortcuts">
        <strong>Raccourcis</strong>
        <span>→ / Espace : avancer</span>
        <span>← : revenir</span>
        <span>N : notes · F : plein écran · R : rejouer</span>
      </div>
    </aside>
  )
}

function AmbientGrain() {
  return <div className="ambient-grain" />
}

/* ---------- 3D PRIMITIVES ---------- */

function Pot3D({ progress = 0 }) {
  const ref = useRef()
  const fillRef = useRef()
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06
    if (fillRef.current) fillRef.current.scale.y = THREE.MathUtils.lerp(fillRef.current.scale.y, Math.max(0.03, progress), 0.08)
  })
  return (
    <group ref={ref} position={[0, -0.15, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.28, 1.45, 1.18, 64, 1, true]} />
        <meshStandardMaterial color={deepGreen} roughness={0.55} metalness={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow position={[0, 0.62, 0]}>
        <torusGeometry args={[1.28, 0.055, 12, 64]} />
        <meshStandardMaterial color="#1a2d22" roughness={0.45} metalness={0.28} />
      </mesh>
      <mesh ref={fillRef} position={[0, -0.43, 0]} scale={[1, Math.max(0.03, progress), 1]}>
        <cylinderGeometry args={[1.17, 1.22, 0.55, 64]} />
        <meshStandardMaterial color={terracotta} roughness={0.7} metalness={0.08} transparent opacity={0.82} />
      </mesh>
      <group position={[0, 0.75, 0]}>
        {Array.from({ length: 9 }).map((_, i) => (
          <SteamBubble key={i} delay={i * 0.4} x={(i % 3 - 1) * 0.35} z={(Math.floor(i / 3) - 1) * 0.22} active={progress > 0.2} />
        ))}
      </group>
      <mesh position={[-1.47, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.035, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#1a2d22" />
      </mesh>
      <mesh position={[1.47, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.035, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#1a2d22" />
      </mesh>
    </group>
  )
}

function SteamBubble({ x, z, delay, active }) {
  const ref = useRef()
  useFrame((state) => {
    const t = (state.clock.elapsedTime + delay) % 3
    const p = t / 3
    if (ref.current) {
      ref.current.position.set(x + Math.sin(t * 2) * 0.08, p * 1.15, z)
      ref.current.scale.setScalar(0.15 + p * 0.55)
      ref.current.material.opacity = active ? (1 - p) * 0.28 : 0
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

function CarrotCluster(props) {
  return (
    <group {...props}>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0.2, 0, -0.45 + i * 0.25]} position={[i * 0.22 - 0.22, i * 0.03, 0]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.11, 1.1, 22]} />
            <meshStandardMaterial color={terracottaLight} roughness={0.75} />
          </mesh>
          <mesh castShadow position={[0, 0.58, 0]}>
            <coneGeometry args={[0.2, 0.36, 8]} />
            <meshStandardMaterial color="#496e3d" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function PeaBowl(props) {
  return (
    <group {...props}>
      <mesh castShadow receiveShadow rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.58, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#efe2c7" roughness={0.7} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        const r = 0.15 + (i % 4) * 0.075
        return (
          <mesh castShadow key={i} position={[Math.cos(a) * r, 0.1 + (i % 3) * 0.025, Math.sin(a) * r]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#5F7D4E" roughness={0.75} />
          </mesh>
        )
      })}
    </group>
  )
}

function HerbBundle(props) {
  return (
    <group {...props}>
      {Array.from({ length: 9 }).map((_, i) => (
        <group key={i} rotation={[0, 0, -0.55 + i * 0.14]} position={[0, 0, 0]}>
          <mesh castShadow position={[0, 0.32, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 1.2, 8]} />
            <meshStandardMaterial color="#3F684A" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.05, 0.86, 0]} rotation={[0, 0, 0.45]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#4E7D52" roughness={0.8} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.025, 8, 32]} />
        <meshStandardMaterial color="#b66a44" roughness={0.85} />
      </mesh>
    </group>
  )
}

function TomatoGroup(props) {
  return (
    <group {...props}>
      {[[-0.25, 0, 0], [0.08, 0.08, 0.08], [0.32, -0.02, -0.05], [0.05, -0.22, 0.1]].map((pos, i) => (
        <mesh castShadow key={i} position={pos}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color="#BB4B38" roughness={0.62} />
        </mesh>
      ))}
      <mesh position={[0.05, 0.28, 0]} rotation={[0.6, 0, 0.8]}>
        <cylinderGeometry args={[0.018, 0.018, 0.8, 8]} />
        <meshStandardMaterial color="#3F684A" />
      </mesh>
    </group>
  )
}

function LemonSlice({ color = '#D5A044' }) {
  return (
    <group>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.09, 48]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.02, 8, 48]} />
        <meshStandardMaterial color="#fff0ad" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Oven3D({ activeStep }) {
  const ovenRef = useRef()
  const glowRef = useRef()
  useFrame((state) => {
    if (ovenRef.current) ovenRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.07
    if (glowRef.current) glowRef.current.material.emissiveIntensity = 0.9 + Math.sin(state.clock.elapsedTime * 2) * 0.35 + activeStep * 0.03
  })
  return (
    <>
      <color attach="background" args={[dark]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} castShadow />
      <pointLight position={[0, 0, 2.5]} color={terracottaLight} intensity={2.4} />
      <group ref={ovenRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.15, 1.55]} />
          <meshStandardMaterial color="#241a12" roughness={0.7} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0, 0.82]}>
          <boxGeometry args={[2.18, 1.38, 0.06]} />
          <meshStandardMaterial color="#392719" roughness={0.5} metalness={0.25} />
        </mesh>
        <mesh ref={glowRef} position={[0, -0.05, 0.87]}>
          <boxGeometry args={[1.8, 1.05, 0.04]} />
          <meshStandardMaterial color={terracottaLight} emissive={terracottaLight} emissiveIntensity={1.1} transparent opacity={0.55} />
        </mesh>
        <group position={[0, -0.18, 1.02]} scale={0.55}>
          <Pot3D progress={0.95} />
        </group>
      </group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.24, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#1c150f" roughness={0.95} />
      </mesh>
    </>
  )
}

function Plate3D() {
  const group = useRef()
  const cloche = useRef()
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.16
      group.current.rotation.x = -0.08 + Math.sin(state.clock.elapsedTime * 0.26) * 0.04
    }
    if (cloche.current) {
      const t = Math.min(state.clock.elapsedTime / 2.2, 1)
      cloche.current.position.y = THREE.MathUtils.lerp(0.35, 3.15, t)
      cloche.current.material.opacity = 1 - t
    }
  })
  return (
    <>
      <color attach="background" args={['#f4ead8']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} castShadow />
      <pointLight position={[-2, 2, 3]} intensity={1.2} color={terracottaLight} />
      <group ref={group} position={[0, -0.4, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.7, 1.85, 0.17, 80]} />
          <meshStandardMaterial color="#fff7e7" roughness={0.56} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.018, 8, 80]} />
          <meshStandardMaterial color={deepGreen} roughness={0.75} />
        </mesh>
        <HerbBundle position={[-0.3, 0.3, 0.08]} rotation={[0, 0, -0.2]} scale={0.42} />
        <LemonSlice position={[0.42, 0.22, 0.1]} />
        <TomatoGroup position={[0.68, 0.18, -0.35]} scale={0.25} />
        <mesh ref={cloche} position={[0, 0.35, 0]} castShadow>
          <sphereGeometry args={[1.75, 64, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d6c8ac" roughness={0.38} metalness={0.45} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#efe2cc" roughness={0.95} />
      </mesh>
    </>
  )
}

function Conclusion3D() {
  return (
    <>
      <color attach="background" args={['#15100b']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 3]} color={terracottaLight} intensity={2.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.35}>
        <group scale={0.95} position={[0, -0.35, 0]}>
          <Pot3D progress={1} />
        </group>
      </Float>
    </>
  )
}

export default App
