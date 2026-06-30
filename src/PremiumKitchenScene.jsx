import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, useTexture } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

const ingredientObjects = [
  { id: 'clients', kind: 'peas', start: [-1.9, 1.25, .4], orbit: [-1.7, 1.15, .2] },
  { id: 'volumes', kind: 'carrot', start: [1.75, 1.1, .25], orbit: [1.75, 1.05, .1] },
  { id: 'tournees', kind: 'grains', start: [2.1, -.1, .4], orbit: [2.1, -.05, .05] },
  { id: 'menus', kind: 'herbs', start: [-1.8, -.9, .25], orbit: [-1.8, -.8, .05] },
  { id: 'kpi', kind: 'garlic', start: [1.35, -1.05, .35], orbit: [1.35, -.95, .05] }
]

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function smooth(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function lerpVec(a, b, t) {
  return [
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t)
  ]
}

export default function PremiumKitchenScene({ progress, addedIngredients, selectedIngredient }) {
  return (
    <Canvas dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 1.45, 6.2], fov: 42 }}>
      <color attach="background" args={["#000000"]} />
      <Suspense fallback={null}>
        <SceneContent progress={progress} addedIngredients={addedIngredients} selectedIngredient={selectedIngredient} />
      </Suspense>
    </Canvas>
  )
}

function SceneContent({ progress, addedIngredients, selectedIngredient }) {
  const rig = useRef()
  const pot = useRef()
  const oven = useRef()
  const plate = useRef()
  const lights = useRef()

  useFrame((state, delta) => {
    const p = progress

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, p > .64 ? .35 : .12, 2.6, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, p > .64 ? 1.35 : 1.55, 2.6, delta)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, p > .64 ? 5.7 : 6.2, 2.6, delta)
    state.camera.lookAt(0.4, 0.15, 0)

    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, Math.sin(state.clock.elapsedTime * .25) * .035, 2.4, delta)
    }

    if (pot.current) {
      const toOven = smooth(.50, .62, p)
      const toPlate = smooth(.72, .84, p)
      const base = p < .25 ? [1.75, -.15, .1] : [1.48, -.18, .05]
      const cooked = [1.35, -.58, -.55]
      const away = [3.8, -.5, -1.2]
      const pos = lerpVec(lerpVec(base, cooked, toOven), away, toPlate)
      pot.current.position.set(
        THREE.MathUtils.damp(pot.current.position.x, pos[0], 4, delta),
        THREE.MathUtils.damp(pot.current.position.y, pos[1], 4, delta),
        THREE.MathUtils.damp(pot.current.position.z, pos[2], 4, delta)
      )
      pot.current.rotation.y = THREE.MathUtils.damp(pot.current.rotation.y, -0.18 + toOven * 0.2, 3, delta)
      const s = THREE.MathUtils.lerp(1.05, .74, toOven) * THREE.MathUtils.lerp(1, .15, toPlate)
      pot.current.scale.setScalar(THREE.MathUtils.damp(pot.current.scale.x, s, 4, delta))
    }

    if (oven.current) {
      const t = smooth(.46, .60, p)
      const out = smooth(.69, .76, p)
      const s = t * (1 - out)
      oven.current.scale.setScalar(THREE.MathUtils.damp(oven.current.scale.x, Math.max(s, .001), 4, delta))
      oven.current.position.y = THREE.MathUtils.damp(oven.current.position.y, -0.05 + (1 - t) * .25, 4, delta)
      oven.current.rotation.y = THREE.MathUtils.damp(oven.current.rotation.y, -0.12, 3, delta)
    }

    if (plate.current) {
      const t = smooth(.67, .82, p)
      const pos = lerpVec([1.5, -1.2, -.4], [1.25, -.32, .05], t)
      plate.current.position.set(
        THREE.MathUtils.damp(plate.current.position.x, pos[0], 3.8, delta),
        THREE.MathUtils.damp(plate.current.position.y, pos[1], 3.8, delta),
        THREE.MathUtils.damp(plate.current.position.z, pos[2], 3.8, delta)
      )
      const s = THREE.MathUtils.lerp(.15, 1.16, t)
      plate.current.scale.setScalar(THREE.MathUtils.damp(plate.current.scale.x, s, 4, delta))
      plate.current.rotation.y = THREE.MathUtils.damp(plate.current.rotation.y, .18, 3, delta)
    }

    if (lights.current) {
      lights.current.intensity = THREE.MathUtils.damp(lights.current.intensity, p > .48 && p < .72 ? 4.2 : 2.7, 2.5, delta)
    }
  })

  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[-3, 5, 4]} intensity={2.1} />
      <pointLight ref={lights} position={[1.8, 1.2, 2.4]} intensity={2.4} color="#ffd4a5" />
      <spotLight position={[0, 5, 4]} angle={0.35} penumbra={0.7} intensity={2.6} castShadow />

      <group ref={rig}>
        <TableSurface />
        <group ref={pot} position={[1.75, -.15, .1]} scale={1.05}>
          <Float speed={1.2} rotationIntensity={0.025} floatIntensity={0.08}>
            <PremiumPot active={addedIngredients.length > 0 || progress > .38} />
          </Float>
        </group>

        <group position={[1.48, -.05, .15]}>
          {ingredientObjects.map((item, index) => (
            <IngredientMover
              key={item.id}
              item={item}
              index={index}
              progress={progress}
              added={addedIngredients.includes(item.id)}
              selected={selectedIngredient === item.id}
            />
          ))}
        </group>

        <group ref={oven} position={[1.32, -.05, -.55]} scale={.001}>
          <PremiumOven />
        </group>

        <group ref={plate} position={[1.5, -1.2, -.4]} scale={.15}>
          <PremiumPlate />
        </group>
      </group>

      <ContactShadows position={[0, -1.24, 0]} opacity={0.32} scale={8} blur={2.8} far={3} />
    </>
  )
}

function TableSurface() {
  return (
    <group position={[.95, -1.28, -.18]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow>
        <circleGeometry args={[3.8, 96]} />
        <meshStandardMaterial color="#f1dfc4" roughness={0.86} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0, .006]}>
        <ringGeometry args={[2.5, 3.8, 96]} />
        <meshBasicMaterial color="#fff7ea" transparent opacity={0.24} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function PremiumPot({ active }) {
  return (
    <group rotation={[0.05, -0.18, 0]}>
      <mesh castShadow receiveShadow position={[0, -.08, 0]}>
        <cylinderGeometry args={[1.18, 1.28, .9, 128, 1, true]} />
        <meshPhysicalMaterial color="#45644e" roughness={0.34} metalness={0.18} clearcoat={0.75} clearcoatRoughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -.55, 0]}>
        <cylinderGeometry args={[1.17, 1.26, .16, 128]} />
        <meshPhysicalMaterial color="#304638" roughness={0.38} metalness={0.25} clearcoat={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, .4, 0]}>
        <torusGeometry args={[1.18, .045, 18, 128]} />
        <meshPhysicalMaterial color="#1e2a23" roughness={0.25} metalness={0.35} clearcoat={0.7} />
      </mesh>
      <mesh receiveShadow position={[0, .36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 128]} />
        <meshPhysicalMaterial color="#e9cc9f" roughness={0.42} metalness={0.04} clearcoat={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, .42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[.55, 1.02, 96]} />
        <meshBasicMaterial color="#fff1d5" transparent opacity={active ? .28 : .12} side={THREE.DoubleSide} />
      </mesh>
      <Handle side={-1} />
      <Handle side={1} />
      {active && <Steam />}
    </group>
  )
}

function Handle({ side }) {
  return (
    <group position={[side * 1.24, -.05, 0]} rotation={[0, 0, Math.PI / 2]} scale={[.72, .42, .42]}>
      <mesh castShadow>
        <torusGeometry args={[.38, .055, 18, 64]} />
        <meshPhysicalMaterial color="#45644e" roughness={0.32} metalness={0.22} clearcoat={0.65} />
      </mesh>
    </group>
  )
}

function Steam() {
  return (
    <group>
      {[[-.34, .78, 0], [0, .88, .04], [.34, .78, -.02]].map((pos, i) => (
        <mesh key={i} position={pos} scale={[.22, .48, .22]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function IngredientMover({ item, index, progress, added, selected }) {
  const ref = useRef()
  const seed = index * 0.72

  useFrame((state, delta) => {
    if (!ref.current) return
    const auto = smooth(.32 + index * .025, .48 + index * .025, progress)
    const click = added ? 1 : 0
    const t = Math.max(auto, click)
    const swirl = Math.sin(state.clock.elapsedTime * .75 + seed) * .12 * (1 - t)
    const base = lerpVec(item.start, item.orbit, smooth(.16, .32, progress))
    const final = [0, .1, .02]
    const pos = lerpVec(base, final, t)
    ref.current.position.set(
      THREE.MathUtils.damp(ref.current.position.x, pos[0] + swirl, 4.2, delta),
      THREE.MathUtils.damp(ref.current.position.y, pos[1] + Math.sin(state.clock.elapsedTime + seed) * .035, 4.2, delta),
      THREE.MathUtils.damp(ref.current.position.z, pos[2], 4.2, delta)
    )
    const s = THREE.MathUtils.lerp(selected ? .46 : .4, .05, t)
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, s, 5, delta))
    ref.current.rotation.y += delta * (0.35 + index * 0.05)
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, selected ? .12 : 0, 4, delta)
  })

  return (
    <group ref={ref} scale={.4}>
      <IngredientObject kind={item.kind} />
    </group>
  )
}

function IngredientObject({ kind }) {
  if (kind === 'carrot') return <Carrot />
  if (kind === 'peas') return <Peas />
  if (kind === 'herbs') return <Herbs />
  if (kind === 'grains') return <Grains />
  return <Garlic />
}

function Carrot() {
  return (
    <group rotation={[0, 0, -.9]}>
      {[0, .18, -.18].map((y, i) => (
        <group key={i} position={[0, y, 0]} rotation={[0, 0, i * .2]}>
          <mesh castShadow>
            <coneGeometry args={[.16, .85, 32]} />
            <meshStandardMaterial color="#e87932" roughness={0.55} />
          </mesh>
          <mesh position={[0, .46, 0]} scale={[.12, .18, .12]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#3e7a4c" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Peas() {
  const balls = useMemo(() => Array.from({ length: 14 }, (_, i) => [Math.cos(i) * .28 * Math.random(), Math.sin(i * 1.7) * .22, (Math.random() - .5) * .22]), [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.08, 0]}>
        <cylinderGeometry args={[.52, .42, .12, 48]} />
        <meshStandardMaterial color="#d9c8a9" roughness={0.75} />
      </mesh>
      {balls.map((pos, i) => (
        <mesh castShadow key={i} position={pos}>
          <sphereGeometry args={[.08, 16, 16]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#76a840' : '#4f8a37'} roughness={0.55} />
        </mesh>
      ))}
    </group>
  )
}

function Herbs() {
  return (
    <group>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i) * .18, Math.sin(i * 2.1) * .12, (i - 4) * .025]} rotation={[0, 0, i * .45]} scale={[.08, .24, .025]} castShadow>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={i % 2 ? '#326340' : '#6b8f3f'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Grains() {
  const grains = useMemo(() => Array.from({ length: 26 }, () => [(Math.random() - .5) * .62, (Math.random() - .5) * .18, (Math.random() - .5) * .32]), [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.1, 0]}>
        <cylinderGeometry args={[.5, .42, .14, 48]} />
        <meshStandardMaterial color="#c8b391" roughness={0.8} />
      </mesh>
      {grains.map((pos, i) => (
        <mesh key={i} position={pos} scale={[.05, .04, .05]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#d7b45b" roughness={0.75} />
        </mesh>
      ))}
    </group>
  )
}

function Garlic() {
  return (
    <group>
      {[[-.16, 0, 0], [.08, .02, .02], [.24, -.03, -.03]].map((pos, i) => (
        <mesh key={i} position={pos} scale={[.18, .22, .18]} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color={i === 1 ? '#d7b1a4' : '#f4eadb'} roughness={0.78} />
        </mesh>
      ))}
    </group>
  )
}

function PremiumOven() {
  const frameMat = <meshPhysicalMaterial color="#4a3020" roughness={0.58} metalness={0.1} clearcoat={0.25} />
  return (
    <group rotation={[0, -.1, 0]}>
      <mesh position={[0, 0, -.18]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 2.15, 1.15]} />
        <meshPhysicalMaterial color="#2b1b12" roughness={0.62} metalness={0.12} clearcoat={0.2} />
      </mesh>
      <mesh position={[0, .95, .42]} castShadow>{frameMat}<boxGeometry args={[3.35, .38, .32]} /></mesh>
      <mesh position={[0, -.88, .42]} castShadow>{frameMat}<boxGeometry args={[3.35, .42, .32]} /></mesh>
      <mesh position={[-1.52, 0, .42]} castShadow>{frameMat}<boxGeometry args={[.38, 1.55, .32]} /></mesh>
      <mesh position={[1.52, 0, .42]} castShadow>{frameMat}<boxGeometry args={[.38, 1.55, .32]} /></mesh>
      <mesh position={[0, 0, .35]}>
        <planeGeometry args={[2.3, 1.38]} />
        <meshBasicMaterial color="#25120a" />
      </mesh>
      <mesh position={[0, -.12, .37]}>
        <planeGeometry args={[1.7, .86]} />
        <meshBasicMaterial color="#ff9f44" transparent opacity={0.22} />
      </mesh>
      {[.25, -.05, -.35].map((y, i) => (
        <mesh key={i} position={[0, y, .45]}>
          <boxGeometry args={[1.9, .025, .035]} />
          <meshBasicMaterial color="#f8d8b5" transparent opacity={0.24} />
        </mesh>
      ))}
      <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.85, 72]} />
        <meshBasicMaterial color="#3b2b21" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function PremiumPlate() {
  const texture = useTexture('/assets/dressage-photo.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return (
    <group rotation={[0, .2, 0]}>
      <mesh castShadow receiveShadow position={[0, -.08, 0]}>
        <cylinderGeometry args={[1.62, 1.55, .18, 128]} />
        <meshPhysicalMaterial color="#d8c8b3" roughness={0.56} metalness={0.02} clearcoat={0.55} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0, .04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.12, 1.55, 128]} />
        <meshPhysicalMaterial color="#f0e5d4" roughness={0.46} metalness={0.02} clearcoat={0.72} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, .065, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.12, 128]} />
        <meshStandardMaterial map={texture} roughness={0.72} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, .1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[.28, 1.0, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, .18, 0]} rotation={[-Math.PI / 2, 0, .25]}>
        <planeGeometry args={[1.05, .18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  )
}
