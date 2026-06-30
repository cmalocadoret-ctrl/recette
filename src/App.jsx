import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, BookOpen, ChefHat, Maximize, RotateCcw, Sparkles, X } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* =========================================================================
   DONNÉES (script entièrement filé "recette")
   ========================================================================= */
const sections = [
  { id: 'intro', label: 'La carte' },
  { id: 'method', label: 'La mise en place' },
  { id: 'ingredients', label: 'Les ingrédients' },
  { id: 'transform', label: 'La cuisson' },
  { id: 'dressage', label: 'Le dressage' },
  { id: 'final', label: 'Le service' }
]

const notes = {
  intro: { title: 'La carte', body: "On ouvre comme une carte de restaurant : une année de logistique racontée en recette. On choisit les ingrédients, on les fait mijoter, puis on dresse une logistique plus lisible, fiable et pilotée." },
  method: { title: 'La mise en place', body: "Avant d'allumer le feu, on prépare le plan de travail : vision globale des flux, fiabilisation terrain, donnée utile, et le réflexe de goûter le terrain avant d'assaisonner." },
  ingredients: { title: 'Les ingrédients', body: "Chaque donnée est un ingrédient. Au clic, l'ingrédient tombe réellement dans la marmite (3D) : séparés ce sont des données éparses, réunis ils deviennent une base de pilotage." },
  transform: { title: 'La cuisson', body: "On laisse mijoter puis on passe au four : observer, cartographier, structurer, tester, standardiser. La chaleur transforme les constats terrain en décisions." },
  dressage: { title: 'Le dressage', body: "On soulève le couvercle et on dresse : moins d'erreurs, meilleure visibilité, décisions plus rapides, standards partageables, logistique robuste pour le portage." },
  final: { title: 'Le service', body: "Le mot de la fin : avant d'optimiser une organisation, il faut d'abord rendre ses flux lisibles, ses données fiables et ses pratiques partageables." }
}

const ingredientData = [
  { id: 'clients',  shape: 'peas',   color: '#6f9a4e', number: '01', label: 'Données clients',     text: "Qui livrer, à quelle maille, jusqu'au bénéficiaire final. La base de toute la recette.", link: 'Le point de départ', rest: [-2.6, 1.7, 0.5] },
  { id: 'volumes',  shape: 'carrot', color: '#d4742b', number: '02', label: 'Volumes repas',       text: "La charge à produire et sa répartition : le dosage qui équilibre ateliers et tournées.", link: 'Réorganisation Grand Ouest', rest: [2.55, 1.85, -0.2] },
  { id: 'tournees', shape: 'herb',   color: '#5d8a3f', number: '03', label: 'Tournées multi-sites', text: "Géographie, temps, capacités : passer d'une vision locale à une vision globale et pilotée.", link: 'Réorganisation Grand Ouest', rest: [2.75, 0.55, 0.7] },
  { id: 'menus',    shape: 'onion',  color: '#e7d9b8', number: '04', label: 'Régimes & menus',      text: "Composition des sacs, choix de menu, régimes : la finesse, au cœur de la digitalisation du portage.", link: 'Digitalisation du portage', rest: [-2.75, 0.5, -0.4] },
  { id: 'kpi',      shape: 'grains', color: '#c79a3c', number: '05', label: 'KPI & référentiels',   text: "Erreurs, coûts, temps opérationnels : des indicateurs partagés pour mesurer et comparer.", link: 'Donnée & pilotage', rest: [0.1, 2.15, -1.1] }
]

const methodItems = [
  ['01', 'Dresser le plan de travail', 'Vision globale des flux', "Clients, volumes, tournées et arbitrages multi-sites posés à plat avant de cuisiner."],
  ['02', 'Sécuriser le tour de main', 'Fiabilisation terrain', "Guider la préparation, sécuriser les sacs du portage et réduire les écarts."],
  ['03', 'Peser les bons ingrédients', 'Donnée utile et partageable', "Passer de fichiers dispersés à des référentiels réellement exploitables."],
  ['04', 'Goûter avant d’assaisonner', 'Observer avant d’optimiser', "Terrain, cartographie, scénarios, décision, puis standardisation."]
]

const transformSteps = ['Observer', 'Cartographier', 'Structurer', 'Tester', 'Standardiser']

/* =========================================================================
   HELPERS 3D
   ========================================================================= */
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
function quadBezier(a, c, b, t) {
  const u = 1 - t
  return new THREE.Vector3(
    u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    u * u * a.z + 2 * u * t * c.z + t * t * b.z
  )
}

function SceneLights({ warm = false }) {
  return (
    <>
      <ambientLight intensity={warm ? 0.45 : 0.62} />
      <directionalLight position={[4, 7, 5]} intensity={warm ? 0.7 : 1.05} color={warm ? '#ffd9a0' : '#fff6e9'} />
      <directionalLight position={[-6, 3, -3]} intensity={0.4} color="#ffd9a8" />
      <pointLight position={[0, 3, 2]} intensity={warm ? 0.5 : 0.3} color="#ffcaa0" />
    </>
  )
}

/* ---- Marmite émaillée (LatheGeometry) ---- */
function Marmite({ color = '#2e4736', broth = true, scale = 1 }) {
  const geo = useMemo(() => {
    const pts = [
      [0.0, 0.06], [0.5, 0.0], [0.95, 0.06], [1.14, 0.5], [1.09, 1.06], [1.0, 1.26],
      [1.15, 1.34], [1.06, 1.43], [0.96, 1.36], [0.9, 1.2], [0.86, 0.55], [0.5, 0.42], [0.0, 0.4]
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(pts, 72)
  }, [])
  return (
    <group scale={scale}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.12} side={THREE.DoubleSide} />
      </mesh>
      {broth && (
        <mesh position={[0, 0.54, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.84, 48]} />
          <meshStandardMaterial color="#c8612f" roughness={0.5} emissive="#7a3015" emissiveIntensity={0.18} />
        </mesh>
      )}
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 1.12, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.05, 14, 28]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.16} />
        </mesh>
      ))}
    </group>
  )
}

/* ---- Géométries d'aliments ---- */
function FoodGeo({ shape, color }) {
  if (shape === 'peas') {
    const pods = [[-0.16, 0, 0.04], [0.17, 0.03, -0.05], [0.02, 0.06, 0.16], [0.04, 0.22, 0.02]]
    return <group>{pods.map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[0.2, 22, 22]} /><meshStandardMaterial color={color} roughness={0.34} /></mesh>)}</group>
  }
  if (shape === 'carrot') {
    return (
      <group>
        <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.05, 0]}><coneGeometry args={[0.24, 0.86, 24]} /><meshStandardMaterial color={color} roughness={0.42} /></mesh>
        {[-0.12, 0, 0.12].map((x, i) => <mesh key={i} position={[x, 0.5, 0]} rotation={[0, 0, x * 2]}><coneGeometry args={[0.05, 0.34, 8]} /><meshStandardMaterial color="#5d8a3f" roughness={0.5} /></mesh>)}
      </group>
    )
  }
  if (shape === 'herb') {
    const leaves = [[0, 0, 0, 0], [0.16, 0.1, 0, 0.6], [-0.16, 0.08, 0, -0.6], [0.04, 0.24, 0.05, 0.2]]
    return <group>{leaves.map((l, i) => <mesh key={i} position={[l[0], l[1], l[2]]} rotation={[0.4, 0, l[3]]} scale={[0.5, 1, 0.18]}><sphereGeometry args={[0.26, 16, 16]} /><meshStandardMaterial color={color} roughness={0.45} /></mesh>)}</group>
  }
  if (shape === 'onion') {
    return (
      <group>
        <mesh scale={[1, 1.1, 1]}><sphereGeometry args={[0.34, 26, 26]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh>
        <mesh position={[0, 0.4, 0]}><coneGeometry args={[0.05, 0.2, 8]} /><meshStandardMaterial color="#b9a878" roughness={0.6} /></mesh>
      </group>
    )
  }
  // grains
  const seeds = [[-0.18, 0, 0], [0.18, 0.05, 0.05], [0, 0.04, -0.18], [0.1, 0.2, 0.08], [-0.12, 0.16, -0.06]]
  return <group>{seeds.map((p, i) => <mesh key={i} position={p} rotation={[i, i * 0.6, 0]} scale={[1, 0.5, 0.5]}><sphereGeometry args={[0.16, 14, 14]} /><meshStandardMaterial color={color} roughness={0.4} metalness={0.05} /></mesh>)}</group>
}

/* ---- Ingrédient cliquable qui vole dans la marmite ---- */
function Ingredient({ data, added, selected, onPick }) {
  const ref = useRef()
  const flying = useRef(false)
  const landed = useRef(false)
  const t = useRef(0)
  const start = useMemo(() => new THREE.Vector3(...data.rest), [data.rest])
  const ctrl = useMemo(() => new THREE.Vector3(data.rest[0] * 0.35, Math.max(data.rest[1], 1.5) + 1.7, data.rest[2] * 0.35), [data.rest])
  const end = useMemo(() => new THREE.Vector3(0, 1.3, 0), [])
  const BASE = 0.62

  useEffect(() => { if (added && !flying.current && !landed.current) { flying.current = true; t.current = 0 } }, [added])

  useFrame((state, dt) => {
    const m = ref.current
    if (!m) return
    if (landed.current) { m.visible = false; return }
    if (flying.current) {
      t.current = Math.min(1, t.current + dt / 0.85)
      const e = easeInOut(t.current)
      m.position.copy(quadBezier(start, ctrl, end, e))
      m.scale.setScalar(BASE * (1 - 0.82 * e))
      m.rotation.x += dt * 6; m.rotation.y += dt * 5
      if (t.current >= 1) { flying.current = false; landed.current = true; m.visible = false }
    } else {
      const k = state.clock.elapsedTime
      m.position.set(start.x, start.y + Math.sin(k * 1.2 + start.x) * 0.09, start.z)
      m.rotation.y += dt * 0.5
      const s = BASE * (selected ? 1.18 : 1)
      m.scale.x += (s - m.scale.x) * 0.15; m.scale.y = m.scale.x; m.scale.z = m.scale.x
    }
  })

  return (
    <group ref={ref}
      onClick={(e) => { e.stopPropagation(); onPick(data.id) }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}>
      <FoodGeo shape={data.shape} color={data.color} />
      {!added && (
        <Html center position={[0, 0.75, 0]} distanceFactor={9}>
          <div className={`scene-label ${selected ? 'on' : ''}`}><span>{data.number}</span>{data.label}</div>
        </Html>
      )}
    </group>
  )
}

/* ---- Scène 3D des ingrédients + marmite ---- */
function IngredientsCanvas({ added, selected, onPick }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.7, 6.4], fov: 42 }} gl={{ antialias: true }}>
      <SceneLights />
      <group position={[0, -0.7, 0]}>
        <Marmite />
        {ingredientData.map((d) => <Ingredient key={d.id} data={d} added={added.includes(d.id)} selected={selected === d.id} onPick={onPick} />)}
        <ContactShadows position={[0, 0.005, 0]} opacity={0.38} scale={9} blur={2.6} far={4} color="#5a3d22" />
      </group>
    </Canvas>
  )
}

/* ---- Marmite vitrine (hero) ---- */
function ShowcaseCanvas() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.9, 6], fov: 40 }} gl={{ antialias: true }}>
      <SceneLights />
      <group position={[0, -0.7, 0]}>
        <SpinGroup speed={0.25}><Marmite /></SpinGroup>
        <FloatFood shape="carrot" color="#d4742b" base={[2.1, 1.7, 0.3]} />
        <FloatFood shape="herb" color="#5d8a3f" base={[-2.1, 1.5, -0.2]} />
        <FloatFood shape="peas" color="#6f9a4e" base={[-1.9, 0.6, 0.6]} />
        <ContactShadows position={[0, 0.005, 0]} opacity={0.34} scale={8} blur={2.6} far={4} color="#5a3d22" />
      </group>
    </Canvas>
  )
}
function SpinGroup({ children, speed = 0.3 }) {
  const ref = useRef()
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * speed })
  return <group ref={ref}>{children}</group>
}
function FloatFood({ shape, color, base }) {
  const ref = useRef()
  const b = useMemo(() => new THREE.Vector3(...base), [base])
  useFrame((s, dt) => { const m = ref.current; if (!m) return; m.position.set(b.x, b.y + Math.sin(s.clock.elapsedTime * 1.1 + b.x) * 0.12, b.z); m.rotation.y += dt * 0.5 })
  return <group ref={ref} scale={0.6}><FoodGeo shape={shape} color={color} /></group>
}

/* ---- Scène du four (cuisson) ---- */
function OvenCanvas() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.4, 6.2], fov: 42 }} gl={{ antialias: true }}>
      <SceneLights warm />
      <group position={[0, -0.2, 0]}>
        <RoundedBox args={[4.4, 3.4, 2.2]} radius={0.16} smoothness={4} position={[0, 0.4, -0.4]}>
          <meshStandardMaterial color="#2a2018" roughness={0.6} metalness={0.2} />
        </RoundedBox>
        {/* cavité */}
        <mesh position={[0, 0.45, 0.2]}><boxGeometry args={[3.2, 2.2, 0.1]} /><meshStandardMaterial color="#140e09" roughness={0.9} /></mesh>
        <mesh position={[0, 0.45, 0.18]}><planeGeometry args={[3.2, 2.2]} /><meshStandardMaterial color="#e07a32" emissive="#e07a32" emissiveIntensity={0.5} transparent opacity={0.28} /></mesh>
        <OvenLight />
        <group position={[0, -0.2, 0.5]}><Marmite scale={0.62} /></group>
        {/* poignée de porte */}
        <mesh position={[0, -0.85, 0.62]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 2.6, 16]} /><meshStandardMaterial color="#8a958c" metalness={0.5} roughness={0.4} /></mesh>
        <ContactShadows position={[0, -1.05, 0.4]} opacity={0.4} scale={7} blur={2.4} far={4} color="#3a2615" />
      </group>
    </Canvas>
  )
}
function OvenLight() {
  const ref = useRef()
  useFrame((s) => { if (ref.current) ref.current.intensity = 1.6 + Math.sin(s.clock.elapsedTime * 3) * 0.4 })
  return <pointLight ref={ref} position={[0, 0.4, 1]} color="#ff9a4d" intensity={1.6} distance={6} />
}

/* ---- Scène de l'assiette dressée (dressage) ---- */
function PlateCanvas() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 3.4, 4.6], fov: 40 }} gl={{ antialias: true }}>
      <SceneLights warm />
      <SpinGroup speed={0.18}>
        <group position={[0, 0, 0]}>
          {/* assiette */}
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[1.95, 1.85, 0.16, 64]} /><meshStandardMaterial color="#fbf7ee" roughness={0.25} metalness={0.04} /></mesh>
          <mesh position={[0, 0.08, 0]}><torusGeometry args={[1.78, 0.09, 18, 64]} /><meshStandardMaterial color="#f2ead9" roughness={0.3} /></mesh>
          <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.7, 1.5, 64]} /><meshStandardMaterial color="#ede2cd" roughness={0.4} side={THREE.DoubleSide} /></mesh>
          {/* houmous */}
          <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.62, 0.66, 0.12, 40]} /><meshStandardMaterial color="#e6cf94" roughness={0.6} /></mesh>
          {/* falafels */}
          {[[0.35, 0.4], [-0.4, 0.45], [0.5, -0.4], [-0.2, -0.5]].map((p, i) => <mesh key={'f' + i} position={[p[0], 0.27, p[1]]}><sphereGeometry args={[0.2, 20, 20]} /><meshStandardMaterial color="#a9712f" roughness={0.7} /></mesh>)}
          {/* quartiers de courge */}
          {[[1.0, 0.2], [0.9, -0.5], [1.15, -0.1]].map((p, i) => <mesh key={'pk' + i} position={[p[0], 0.22, p[1]]} rotation={[0, i, 0.3]}><coneGeometry args={[0.16, 0.5, 4]} /><meshStandardMaterial color="#e08a36" roughness={0.55} /></mesh>)}
          {/* chou-fleur */}
          {[[-1.0, 0.3], [-1.1, -0.2], [-0.9, -0.6]].map((p, i) => <group key={'c' + i} position={[p[0], 0.24, p[1]]}>{[[0, 0, 0], [0.12, 0.05, 0], [-0.1, 0.04, 0.08], [0.02, 0.12, -0.06]].map((q, j) => <mesh key={j} position={q}><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color="#f0ead8" roughness={0.7} /></mesh>)}</group>)}
          {/* feuilles */}
          {[[0.2, 1.1], [-0.3, 1.0], [0.6, 0.9], [-0.7, 0.8]].map((p, i) => <mesh key={'l' + i} position={[p[0], 0.2, p[1]]} rotation={[0.3, i, 0.2]} scale={[0.6, 1, 0.2]}><sphereGeometry args={[0.22, 14, 14]} /><meshStandardMaterial color="#557f37" roughness={0.5} /></mesh>)}
          {/* graines de grenade */}
          {[[0.1, 0.1], [-0.1, -0.1], [0.2, -0.05], [-0.2, 0.08]].map((p, i) => <mesh key={'s' + i} position={[p[0], 0.24, p[1]]}><sphereGeometry args={[0.05, 10, 10]} /><meshStandardMaterial color="#b23a2e" roughness={0.4} /></mesh>)}
        </group>
        <ContactShadows position={[0, -0.12, 0]} opacity={0.4} scale={6} blur={2.4} far={3} color="#5a3d22" />
      </SpinGroup>
    </Canvas>
  )
}

/* =========================================================================
   APP
   ========================================================================= */
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
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          setCurrent(Number(entry.target.dataset.index))
        }
      })
    }, { threshold: 0.4 })
    sectionRefs.current.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      document.documentElement.style.setProperty('--progress', `${max > 0 ? (window.scrollY / max) * 100 : 0}%`)
    }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
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
  return <section id={id} data-index={index} ref={(el) => (refs.current[index] = el)} className={`journey-section ${id}`}><div className="section-curtain" />{children}</section>
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
          <p className="body-lead reveal">Une année racontée comme une recette : on choisit les ingrédients, on les fait mijoter, puis on dresse une logistique plus lisible, fiable et pilotée par la donnée.</p>
          <div className="tag-row reveal"><span>Grand Ouest multi-sites</span><span>Portage de repas</span><span>Pilotage par la donnée</span></div>
          <button className="main-cta reveal" onClick={onNext}>Passer en cuisine</button>
        </div>
        <div className="hero-showcase reveal">
          <div className="scene-canvas hero-canvas"><ShowcaseCanvas /></div>
          <div className="hero-float-card"><strong>Le fil rouge</strong><p>Rendre les flux lisibles, les données fiables et les pratiques partageables.</p></div>
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
          <h2 className="display-title smaller reveal">Réunir les <em>bons ingrédients.</em></h2>
          <p className="body-lead reveal">Avant d'allumer le feu, on prépare le plan de travail. Toute la recette part de là : choisir les ingrédients utiles, écarter le bruit, et construire une méthode réutilisable.</p>
          <div className="quote-block reveal"><span className="quote-line" /><p>« Une bonne recette logistique, c'est d'abord une bonne mise en place. »</p></div>
        </div>
        <div className="method-rail">
          {methodItems.map(([number, small, title, text]) => <article className="rail-row reveal" key={number}><div className="rail-number">{number}</div><div className="rail-texts"><small>{small}</small><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </div>
    </div>
  )
}

function IngredientsSection() {
  const rootRef = useRevealScope()
  const [selected, setSelected] = useState('clients')
  const [added, setAdded] = useState([])
  const selData = ingredientData.find((d) => d.id === selected)
  const progress = `${(added.length / ingredientData.length) * 100}%`

  const onPick = (id) => {
    setSelected(id)
    setAdded((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div className="section-frame ingredients-frame" ref={rootRef}>
      <div className="ingredients-layout">
        <div className="ingredients-side">
          <Kicker>Les ingrédients</Kicker>
          <h2 className="display-title smaller reveal">Les données tombent dans la <em>marmite.</em></h2>
          <p className="body-lead reveal">Chaque donnée est un ingrédient en 3D : cliquez pour le faire réellement tomber dans la marmite. Séparés, ce sont des fichiers épars ; réunis, une base de pilotage.</p>
          <div className="info-card reveal"><span>Ingrédient — {selData.link}</span><h3>{selData.label}</h3><p>{selData.text}</p></div>
          <div className="info-card reveal"><div className="mini-track"><b style={{ width: progress }} /></div><h3>{added.length} / {ingredientData.length}</h3><p>Ingrédients réunis dans la base de pilotage.</p></div>
        </div>
        <div className="ingredient-scene reveal">
          <div className="scene-canvas tall"><IngredientsCanvas added={added} selected={selected} onPick={onPick} /></div>
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
          <Kicker>La cuisson</Kicker>
          <h2 className="display-title smaller reveal">On laisse <em>mijoter,</em> puis au four.</h2>
          <p className="body-lead reveal">La chaleur fait son travail : elle transforme les constats terrain en décisions. On observe, on cartographie, on structure, on teste, puis on standardise.</p>
          <div className="step-row reveal">{transformSteps.map((step, index) => <span key={step} className={index === 2 ? 'active' : ''}>{step}</span>)}</div>
        </div>
        <div className="oven-scene reveal"><div className="scene-canvas tall"><OvenCanvas /></div></div>
      </div>
    </div>
  )
}

function DressageSection() {
  const rootRef = useRevealScope()
  const benefits = [['01', 'Moins d’erreurs terrain'], ['02', 'Meilleure visibilité des flux'], ['03', 'Décisions plus rapides'], ['04', 'Standards partageables'], ['05', 'Logistique robuste pour le portage']]
  return (
    <div className="section-frame" ref={rootRef}>
      <div className="dressage-head"><Kicker>Le dressage</Kicker><h2 className="display-title smaller reveal">On dresse <em>l'assiette.</em></h2><p className="body-lead center reveal">Le résultat se sert clairement. L'assiette est entièrement modélisée en 3D : houmous, falafels, courge rôtie, chou-fleur et herbes fraîches.</p></div>
      <div className="dressage-stage reveal">
        <div className="benefit-col left">{benefits.slice(0, 3).map(([n, t]) => <div className="benefit-card" key={n}><span>{n}</span><p>{t}</p></div>)}</div>
        <div className="scene-canvas plate-canvas"><PlateCanvas /></div>
        <div className="benefit-col right">{benefits.slice(3).map(([n, t]) => <div className="benefit-card" key={n}><span>{n}</span><p>{t}</p></div>)}</div>
      </div>
    </div>
  )
}

function ConclusionSection({ onReplay }) {
  const rootRef = useRevealScope()
  return <div className="section-frame" ref={rootRef}><div className="final-card reveal"><Kicker>Le service</Kicker><blockquote>Avant d'optimiser une organisation, il faut d'abord rendre ses flux <em>lisibles</em>, ses données <em>fiables</em> et ses pratiques <em>partageables</em>.</blockquote><div className="final-sign reveal">Ma recette logistique · 2025 / 2026</div><button className="main-cta" onClick={onReplay}><RotateCcw size={16} /> Revoir le parcours</button></div></div>
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
        entry.target.querySelectorAll('.reveal').forEach((el, index) => { el.style.setProperty('--delay', `${index * 0.07}s`); el.classList.add('visible') })
      })
    }, { threshold: 0.2 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])
  return rootRef
}
