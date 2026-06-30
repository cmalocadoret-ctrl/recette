import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const palette = {
  cream: 0xf6ead9,
  paper: 0xfffaf1,
  green: 0x243a2c,
  greenSoft: 0x55745f,
  terra: 0xc66a3a,
  carrot: 0xe7772e,
  pea: 0x6aa24a,
  brass: 0xd5a768,
  dark: 0x21150d,
  oven: 0x3a2618,
  hummus: 0xd8c19a,
  falafel: 0xa77638,
  squash: 0xe67d2d,
  cauliflower: 0xf2e1c6
}

function roundedBox(width, height, depth, radius, smoothness) {
  const shape = new THREE.Shape()
  const eps = 0.00001
  const r = radius - eps
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
  shape.absarc(eps, height - r * 2, eps, Math.PI, Math.PI / 2, true)
  shape.absarc(width - r * 2, height - r * 2, eps, Math.PI / 2, 0, true)
  shape.absarc(width - r * 2, eps, eps, 0, -Math.PI / 2, true)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius,
    curveSegments: smoothness
  })
  geometry.center()
  return geometry
}

function material(color, roughness = 0.58, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    envMapIntensity: 0.45
  })
}

function createPot() {
  const group = new THREE.Group()
  const bodyMat = material(palette.greenSoft, 0.42, 0.1)
  const innerMat = material(0xd9bd8e, 0.42, 0.04)
  const rimMat = material(0x1f2a22, 0.4, 0.18)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.12, 1.02, 96, 8, false), bodyMat)
  body.position.y = 0
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  const hollow = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.02, 0.52, 96, 4, false), innerMat)
  hollow.position.y = 0.31
  hollow.scale.y = 0.35
  hollow.castShadow = true
  group.add(hollow)

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.055, 16, 128), rimMat)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.52
  rim.castShadow = true
  group.add(rim)

  const surface = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.025, 96), material(0xd6b77f, 0.68, 0))
  surface.position.y = 0.56
  group.add(surface)
  group.userData.surface = surface

  const handleL = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.045, 12, 64), bodyMat)
  handleL.rotation.y = Math.PI / 2
  handleL.position.set(-1.42, 0.05, 0)
  handleL.scale.x = 0.66
  handleL.castShadow = true
  group.add(handleL)

  const handleR = handleL.clone()
  handleR.position.x = 1.42
  group.add(handleR)

  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.95, 0.1, 96), rimMat)
  foot.position.y = -0.56
  group.add(foot)

  return group
}

function createCarrot() {
  const g = new THREE.Group()
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.7, 24), material(palette.carrot, 0.52, 0))
  cone.rotation.z = Math.PI
  cone.castShadow = true
  g.add(cone)
  for (let i = 0; i < 3; i += 1) {
    const leaf = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.32, 8), material(palette.greenSoft, 0.62, 0))
    leaf.position.set((i - 1) * 0.05, 0.43, 0)
    leaf.rotation.z = (i - 1) * 0.25
    leaf.castShadow = true
    g.add(leaf)
  }
  return g
}

function createPeas() {
  const g = new THREE.Group()
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.22, 64, 1, true), material(0xe8d8bf, 0.55, 0))
  bowl.position.y = -0.08
  bowl.castShadow = true
  g.add(bowl)
  for (let i = 0; i < 16; i += 1) {
    const pea = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 18), material(palette.pea, 0.46, 0))
    const angle = (i / 16) * Math.PI * 2
    const radius = 0.12 + (i % 4) * 0.065
    pea.position.set(Math.cos(angle) * radius, 0.06 + (i % 3) * 0.025, Math.sin(angle) * radius)
    pea.castShadow = true
    g.add(pea)
  }
  return g
}

function createHerbs() {
  const g = new THREE.Group()
  for (let i = 0; i < 7; i += 1) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.62, 8), material(palette.greenSoft, 0.7, 0))
    stem.position.x = (i - 3) * 0.055
    stem.rotation.z = (i - 3) * 0.08
    stem.castShadow = true
    g.add(stem)
    for (let j = 0; j < 3; j += 1) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), material(0x3c704b, 0.65, 0))
      leaf.scale.set(1.5, 0.25, 0.65)
      leaf.position.set((i - 3) * 0.055 + (j % 2 ? 0.06 : -0.06), -0.18 + j * 0.18, 0)
      leaf.rotation.z = j % 2 ? 0.8 : -0.8
      leaf.castShadow = true
      g.add(leaf)
    }
  }
  return g
}

function createGrainBowl() {
  const g = new THREE.Group()
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.36, 0.25, 64, 1, true), material(0xe9d7bb, 0.52, 0))
  bowl.castShadow = true
  g.add(bowl)
  for (let i = 0; i < 24; i += 1) {
    const grain = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), material(0xd9a84d, 0.66, 0))
    const angle = (i / 24) * Math.PI * 2
    const radius = Math.random() * 0.34
    grain.position.set(Math.cos(angle) * radius, 0.13 + Math.random() * 0.07, Math.sin(angle) * radius)
    g.add(grain)
  }
  return g
}

function createRouteIngredient() {
  const g = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: palette.terra, roughness: 0.45 })
  const pts = [new THREE.Vector3(-0.35, 0, 0), new THREE.Vector3(-0.05, 0.28, 0.05), new THREE.Vector3(0.25, -0.08, 0)]
  const curve = new THREE.CatmullRomCurve3(pts)
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.02, 8, false), mat)
  g.add(tube)
  pts.forEach((p) => {
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), material(palette.greenSoft, 0.44, 0.04))
    node.position.copy(p)
    g.add(node)
  })
  return g
}

function createIngredient(id) {
  if (id === 'clients') return createPeas()
  if (id === 'volumes') return createCarrot()
  if (id === 'tournees') return createRouteIngredient()
  if (id === 'menus') return createHerbs()
  return createGrainBowl()
}

function createPlate() {
  const group = new THREE.Group()
  const plateMat = material(0xddd0bd, 0.44, 0.02)
  const innerMat = material(0xf5ebdb, 0.5, 0.01)
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.18, 0.18, 128), plateMat)
  rim.castShadow = true
  rim.receiveShadow = true
  group.add(rim)
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(1.86, 1.9, 0.08, 128), innerMat)
  inner.position.y = 0.08
  inner.castShadow = true
  group.add(inner)

  // roasted squash arcs
  for (let i = 0; i < 5; i += 1) {
    const squash = new THREE.Mesh(new THREE.TorusGeometry(0.62 + i * 0.06, 0.045, 12, 64, Math.PI * 0.82), material(palette.squash, 0.5, 0))
    squash.position.set(-0.55 + i * 0.04, 0.2 + i * 0.014, -0.12 + i * 0.04)
    squash.rotation.x = Math.PI / 2
    squash.rotation.z = -0.95 + i * 0.18
    squash.scale.z = 0.35
    squash.castShadow = true
    group.add(squash)
  }

  // falafel balls
  for (let i = 0; i < 5; i += 1) {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), material(palette.falafel, 0.82, 0))
    ball.position.set(0.75 + (i % 2) * 0.28, 0.28, -0.12 + Math.floor(i / 2) * 0.28)
    ball.scale.y = 0.9
    ball.castShadow = true
    group.add(ball)
    for (let j = 0; j < 5; j += 1) {
      const crumb = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), material(0x7a5528, 0.8, 0))
      crumb.position.set(ball.position.x + (Math.random() - 0.5) * 0.23, ball.position.y + 0.14, ball.position.z + (Math.random() - 0.5) * 0.2)
      group.add(crumb)
    }
  }

  // hummus mound + sesame
  const hummus = new THREE.Mesh(new THREE.SphereGeometry(0.36, 48, 24), material(palette.hummus, 0.65, 0))
  hummus.position.set(0.78, 0.25, -0.78)
  hummus.scale.set(1, 0.42, 1)
  hummus.castShadow = true
  group.add(hummus)
  for (let i = 0; i < 16; i += 1) {
    const sesame = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), material(0x18120e, 0.5, 0))
    sesame.position.set(0.78 + (Math.random() - 0.5) * 0.42, 0.42, -0.78 + (Math.random() - 0.5) * 0.32)
    sesame.scale.y = 0.45
    group.add(sesame)
  }

  // cauliflower and grains
  for (let i = 0; i < 16; i += 1) {
    const floret = new THREE.Mesh(new THREE.SphereGeometry(0.085 + Math.random() * 0.04, 14, 14), material(palette.cauliflower, 0.78, 0))
    floret.position.set(-0.5 + (Math.random() - 0.5) * 0.9, 0.25, 0.25 + (Math.random() - 0.5) * 0.5)
    floret.scale.set(1.15, 0.68, 0.95)
    floret.castShadow = true
    group.add(floret)
  }

  // leaves
  for (let i = 0; i < 8; i += 1) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), material(0x3c704b, 0.7, 0))
    leaf.scale.set(1.7, 0.12, 0.7)
    leaf.position.set(-0.3 + i * 0.12, 0.28, -0.7 + Math.sin(i) * 0.18)
    leaf.rotation.y = i * 0.22
    leaf.rotation.z = i * 0.18
    leaf.castShadow = true
    group.add(leaf)
  }

  group.rotation.x = -0.58
  group.rotation.z = 0.12
  return group
}

function setupRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)
  return renderer
}

export function ThreeKitchen({ variant = 'hero' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = setupRenderer(container)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 3.6, 7.7)

    const ambient = new THREE.AmbientLight(0xfff2df, 1.8)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xfff2df, 3.2)
    key.position.set(4, 7, 5)
    key.castShadow = true
    scene.add(key)
    const fill = new THREE.PointLight(0xe58a4a, 2.2, 12)
    fill.position.set(-3, 2, 3)
    scene.add(fill)

    const root = new THREE.Group()
    scene.add(root)

    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.9, 96), new THREE.MeshStandardMaterial({ color: 0xf5ead8, roughness: 0.78 }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.82
    floor.receiveShadow = true
    root.add(floor)

    if (variant === 'hero') {
      const pot = createPot()
      pot.position.set(0.45, 0.0, 0)
      pot.rotation.y = -0.45
      root.add(pot)
      const items = [createPeas(), createCarrot(), createHerbs(), createGrainBowl()]
      const positions = [[-1.7, -0.3, 0.9], [-1.15, -0.2, -1.1], [1.65, -0.2, -1.0], [1.7, -0.2, 0.8]]
      items.forEach((it, i) => {
        it.position.set(...positions[i])
        it.scale.setScalar(i === 1 ? 0.72 : 0.9)
        it.rotation.y = i * 0.8
        root.add(it)
      })
    }

    let frame = 0
    const animate = () => {
      frame += 0.01
      root.rotation.y = Math.sin(frame * 0.6) * 0.08
      root.position.y = Math.sin(frame) * 0.035
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      container.replaceChildren()
    }
  }, [variant])

  return <div className="three-canvas" ref={containerRef} aria-hidden="true" />
}

export function Ingredients3D({ added, lastIngredient }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = setupRenderer(container)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 3.7, 8)

    const ambient = new THREE.AmbientLight(0xfff2df, 1.7)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xfff4e4, 3.5)
    key.position.set(4, 7, 5)
    key.castShadow = true
    scene.add(key)
    const point = new THREE.PointLight(0xe58a4a, 1.7, 10)
    point.position.set(-2, 2, 3)
    scene.add(point)

    const root = new THREE.Group()
    scene.add(root)

    const board = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.35, 0.12, 128), material(0xf2e5d1, 0.72, 0))
    board.rotation.x = Math.PI / 2
    board.position.y = -0.83
    board.receiveShadow = true
    root.add(board)

    const pot = createPot()
    pot.scale.setScalar(1.18)
    pot.position.y = -0.1
    root.add(pot)

    const ingredientGroup = new THREE.Group()
    scene.add(ingredientGroup)

    const steamGroup = new THREE.Group()
    root.add(steamGroup)
    const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false })
    for (let i = 0; i < 7; i += 1) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.16 + i * 0.012, 16, 12), steamMat.clone())
      s.position.set((i - 3) * 0.13, 0.88 + i * 0.08, (i % 2 ? 0.12 : -0.1))
      steamGroup.add(s)
    }

    sceneRef.current = { ingredientGroup, pot, root, steamGroup, renderer, camera, scene, frame: 0, currentProgress: 0 }

    const animate = () => {
      const st = sceneRef.current
      st.frame += 0.012
      root.rotation.y = Math.sin(st.frame * 0.65) * 0.06
      pot.rotation.y = Math.sin(st.frame * 0.8) * 0.04
      const target = added / 5
      st.currentProgress += (target - st.currentProgress) * 0.08
      if (pot.userData.surface) {
        pot.userData.surface.position.y = 0.54 + st.currentProgress * 0.23
        pot.userData.surface.material.color.setHex(st.currentProgress > 0 ? 0xc98b51 : 0xd6b77f)
      }
      steamGroup.children.forEach((s, i) => {
        s.material.opacity = target > 0 ? Math.max(0, 0.16 + Math.sin(st.frame * 3 + i) * 0.08) : 0
        s.position.y = 0.85 + ((st.frame * 0.5 + i * 0.14) % 0.85)
        s.position.x = (i - 3) * 0.13 + Math.sin(st.frame * 2 + i) * 0.08
      })
      ingredientGroup.children.forEach((m) => {
        m.userData.t += 0.018
        const t = Math.min(1, m.userData.t)
        const start = m.userData.start
        const mid = m.userData.mid
        const end = m.userData.end
        const a = start.clone().lerp(mid, t)
        const b = mid.clone().lerp(end, t)
        m.position.copy(a.lerp(b, t))
        m.rotation.x += 0.06
        m.rotation.y += 0.08
        m.scale.setScalar(Math.max(0.03, 0.86 * (1 - t * 0.82)))
        if (t >= 1) m.visible = false
      })
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      container.replaceChildren()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const st = sceneRef.current
    if (!st || !lastIngredient) return
    const positions = {
      clients: new THREE.Vector3(-2.65, 0.45, -0.85),
      volumes: new THREE.Vector3(2.55, 0.55, -0.8),
      tournees: new THREE.Vector3(2.75, 0.3, 0.7),
      menus: new THREE.Vector3(-2.55, 0.2, 0.95),
      kpi: new THREE.Vector3(2.05, 0.1, 1.35)
    }
    const obj = createIngredient(lastIngredient)
    obj.position.copy(positions[lastIngredient] || positions.clients)
    obj.scale.setScalar(0.86)
    obj.userData = {
      t: 0,
      start: obj.position.clone(),
      mid: new THREE.Vector3(0, 1.85, 0.25),
      end: new THREE.Vector3(0, 0.67, 0)
    }
    st.ingredientGroup.add(obj)
  }, [lastIngredient])

  return <div className="three-canvas" ref={containerRef} aria-hidden="true" />
}

export function Oven3D() {
  const containerRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const renderer = setupRenderer(container)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 3.0, 8.2)
    scene.add(new THREE.AmbientLight(0xffead4, 1.35))
    const key = new THREE.DirectionalLight(0xfff1df, 2.6)
    key.position.set(4, 6, 5)
    key.castShadow = true
    scene.add(key)
    const glow = new THREE.PointLight(0xff8a3d, 5, 7)
    glow.position.set(0, 0.4, 0.5)
    scene.add(glow)

    const root = new THREE.Group()
    scene.add(root)

    const body = new THREE.Mesh(roundedBox(4.0, 3.2, 0.8, 0.22, 6), material(palette.oven, 0.52, 0.06))
    body.position.y = 0.6
    body.castShadow = true
    root.add(body)

    const cavity = new THREE.Mesh(roundedBox(2.65, 1.45, 0.12, 0.12, 5), new THREE.MeshStandardMaterial({ color: 0x160d07, roughness: 0.5, emissive: 0x5b260f, emissiveIntensity: 0.55 }))
    cavity.position.set(0, 0.45, 0.43)
    root.add(cavity)

    const glass = new THREE.Mesh(roundedBox(2.65, 1.45, 0.03, 0.12, 5), new THREE.MeshPhysicalMaterial({ color: 0x2a1a12, roughness: 0.18, transmission: 0.15, transparent: true, opacity: 0.38 }))
    glass.position.set(0, 0.45, 0.5)
    root.add(glass)

    const slot = new THREE.Mesh(roundedBox(2.6, 0.28, 0.08, 0.12, 5), material(0x1e120b, 0.5, 0.02))
    slot.position.set(0, 1.82, 0.44)
    root.add(slot)

    const pot = createPot()
    pot.scale.setScalar(0.56)
    pot.position.set(0, 0.15, 0.76)
    pot.rotation.y = 0.25
    root.add(pot)

    const particles = []
    for (let i = 0; i < 28; i += 1) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffb36e, transparent: true, opacity: 0.42 }))
      p.position.set((Math.random() - 0.5) * 1.6, -0.05 + Math.random() * 1.0, 0.82 + Math.random() * 0.08)
      particles.push(p)
      root.add(p)
    }

    let frame = 0
    const animate = () => {
      frame += 0.014
      root.rotation.y = Math.sin(frame * 0.5) * 0.045
      pot.position.y = 0.15 + Math.sin(frame * 2) * 0.025
      particles.forEach((p, i) => {
        p.position.y += 0.007 + (i % 3) * 0.001
        p.material.opacity = 0.15 + Math.sin(frame * 3 + i) * 0.14
        if (p.position.y > 1.05) p.position.y = -0.05
      })
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      container.replaceChildren()
    }
  }, [])
  return <div className="three-canvas" ref={containerRef} aria-hidden="true" />
}

export function Plate3D() {
  const containerRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const renderer = setupRenderer(container)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 4.2, 7.2)
    scene.add(new THREE.AmbientLight(0xfff1df, 1.8))
    const key = new THREE.DirectionalLight(0xfff7ec, 3.2)
    key.position.set(4, 7, 4)
    key.castShadow = true
    scene.add(key)
    const fill = new THREE.PointLight(0xe58a4a, 1.2, 8)
    fill.position.set(-3, 2.2, 3)
    scene.add(fill)

    const root = new THREE.Group()
    scene.add(root)
    const table = new THREE.Mesh(new THREE.CircleGeometry(4.3, 128), material(0xf1e2cc, 0.76, 0))
    table.rotation.x = -Math.PI / 2
    table.position.y = -0.42
    table.receiveShadow = true
    root.add(table)

    const plate = createPlate()
    plate.position.y = -0.14
    root.add(plate)

    let frame = 0
    const animate = () => {
      frame += 0.012
      root.rotation.y = Math.sin(frame * 0.5) * 0.08
      plate.position.y = -0.14 + Math.sin(frame * 0.9) * 0.018
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      container.replaceChildren()
    }
  }, [])
  return <div className="three-canvas" ref={containerRef} aria-hidden="true" />
}
