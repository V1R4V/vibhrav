"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type * as Three from "three"

type SceneState = "loading" | "ready" | "fallback"
type SceneControls = { setPaused: (paused: boolean) => void }

/** An open, gently twisted ribbon swept along a spatial curve. */
function makeRibbonGeometry(THREE: typeof Three) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.35, -1.1, -0.2),
    new THREE.Vector3(-1.85, -0.25, -0.05),
    new THREE.Vector3(-1.25, 0.8, 0.3),
    new THREE.Vector3(-0.25, 1.03, 0.5),
    new THREE.Vector3(0.75, 0.55, 0.15),
    new THREE.Vector3(0.8, -0.3, -0.4),
    new THREE.Vector3(-0.05, -0.65, -0.25),
    new THREE.Vector3(-0.7, -0.15, 0.35),
  ], false, "centripetal")
  const segments = 112
  const sides = 24
  const frames = curve.computeFrenetFrames(segments, false)
  const positions = new Float32Array((segments + 1) * (sides + 1) * 3)
  const indices: number[] = []
  const normal = new THREE.Vector3()
  const binormal = new THREE.Vector3()
  const point = new THREE.Vector3()

  for (let segment = 0; segment <= segments; segment += 1) {
    const t = segment / segments
    curve.getPointAt(t, point)
    // Rounded ends, a broad satin face, and a slight twist catch softbox light.
    const taper = Math.max(0.025, Math.sin(Math.PI * t) ** 0.25)
    const twist = t * Math.PI * 0.7
    normal.copy(frames.normals[segment]).multiplyScalar(Math.cos(twist))
      .addScaledVector(frames.binormals[segment], Math.sin(twist))
    binormal.copy(frames.binormals[segment]).multiplyScalar(Math.cos(twist))
      .addScaledVector(frames.normals[segment], -Math.sin(twist))
    for (let side = 0; side <= sides; side += 1) {
      const angle = side / sides * Math.PI * 2
      const a = Math.cos(angle) * 0.34 * taper
      const b = Math.sin(angle) * 0.18 * taper
      const offset = (segment * (sides + 1) + side) * 3
      positions[offset] = point.x + normal.x * a + binormal.x * b
      positions[offset + 1] = point.y + normal.y * a + binormal.y * b
      positions[offset + 2] = point.z + normal.z * a + binormal.z * b
      if (segment < segments && side < sides) {
        const i = segment * (sides + 1) + side
        const j = i + sides + 1
        indices.push(i, i + 1, j, j, i + 1, j + 1)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

const staticScene = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900"><defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#40372a"/><stop offset=".3" stop-color="#cfb589"/><stop offset=".52" stop-color="#66543c"/><stop offset=".75" stop-color="#e5d2aa"/><stop offset="1" stop-color="#30291f"/></linearGradient><linearGradient id="red"><stop stop-color="#260d13"/><stop offset=".48" stop-color="#632632"/><stop offset=".65" stop-color="#8a4550"/><stop offset="1" stop-color="#210e13"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="1"/></filter></defs><g fill="none" stroke-linecap="round" filter="url(#soft)"><path d="M 1090 -60 C 1390 -10 1420 215 1260 285 C 1140 335 1050 250 1115 175" stroke="url(#gold)" stroke-width="65"/><path d="M -90 710 C 55 450 310 555 270 740 C 245 845 100 860 120 765" stroke="url(#gold)" stroke-width="75"/><path d="M 1195 900 C 1060 790 1190 635 1325 745 C 1410 820 1310 880 1270 815" stroke="url(#red)" stroke-width="50"/><path d="M 200 100 C 150 20 255 -30 300 30" stroke="url(#gold)" stroke-width="28" opacity=".65"/></g></svg>`)

const staticMobileScene = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844"><defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#40372a"/><stop offset=".3" stop-color="#cfb589"/><stop offset=".52" stop-color="#66543c"/><stop offset=".75" stop-color="#e5d2aa"/><stop offset="1" stop-color="#30291f"/></linearGradient><linearGradient id="red"><stop stop-color="#260d13"/><stop offset=".48" stop-color="#632632"/><stop offset=".65" stop-color="#8a4550"/><stop offset="1" stop-color="#210e13"/></linearGradient></defs><g fill="none" stroke-linecap="round"><path d="M 325 275 C 265 180 365 135 415 235 C 455 310 385 350 355 300" stroke="url(#gold)" stroke-width="35"/><path d="M -65 470 C 45 465 55 590 -30 645" stroke="url(#gold)" stroke-width="36"/><path d="M 440 695 C 355 605 295 685 360 725" stroke="url(#red)" stroke-width="31"/></g></svg>`)

/** The light cards exist only in the reflection map, never in the visible scene. */
function makeStudioEnvironment(THREE: typeof Three, renderer: Three.WebGLRenderer) {
  const studio = new THREE.Scene()
  studio.background = new THREE.Color("#171614")
  const geometry = new THREE.PlaneGeometry(1, 1)
  const materials: Three.MeshBasicMaterial[] = []

  function card(color: string, intensity: number, size: [number, number], position: [number, number, number]) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide,
    })
    materials.push(material)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.scale.set(size[0], size[1], 1)
    mesh.lookAt(0, 0, 0)
    studio.add(mesh)
  }

  // Large ivory softbox, narrow specular strips, a dim warm bounce, oxblood rim.
  card("#fff7e8", 5, [5, 8], [-4, 3, 5])
  card("#fffaf0", 6, [1.6, 8], [4, 1, 3])
  card("#eac99a", 3, [5, 1.2], [0, 6, 0])
  card("#e4af62", 1.2, [5, 3], [1, -5, 2])
  card("#6b2530", 2.5, [4, 6], [-3, 0, -4])
  card("#fff6e5", 3, [1, 4], [4, 2, -4])

  const pmrem = new THREE.PMREMGenerator(renderer)
  try {
    return pmrem.fromScene(studio, 0.045, 0.1, 30)
  } finally {
    geometry.dispose()
    materials.forEach((material) => material.dispose())
    pmrem.dispose()
    studio.clear()
  }
}

export function GoldSculpture({ paused }: { paused: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<SceneControls | null>(null)
  const pausedRef = useRef(paused)
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null)
  const [sceneState, setSceneState] = useState<SceneState>("loading")

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    pausedRef.current = paused
    controlsRef.current?.setPaused(paused)
  }, [paused])

  useEffect(() => {
    const host = hostRef.current
    if (!host || reducedMotion === null) return
    if (reducedMotion) {
      setSceneState("fallback")
      return
    }

    let cancelled = false
    let disposeScene = () => {}
    setSceneState("loading")

    async function initialize() {
      try {
        // This import intentionally stays behind the effect and motion preference.
        const THREE = await import("three")
        if (cancelled || !host) return

        let renderer: Three.WebGLRenderer | undefined
        let environment: Three.WebGLRenderTarget | undefined
        let geometry: Three.BufferGeometry | undefined
        const materials: Three.MeshPhysicalMaterial[] = []
        let resizeObserver: ResizeObserver | undefined
        let intersectionObserver: IntersectionObserver | undefined
        let frame = 0
        let disposed = false
        let inView = true
        let firstFrame = true
        let lastTime = 0
        let elapsed = 0
        let width = 1
        let height = 1
        let scrollTarget = 0
        let scrollPosition = 0
        let pointerX = 0
        let pointerY = 0
        let cameraX = 0
        let cameraY = 0
        const cameraDistance = 16
        const fragments: Three.Mesh[] = []
        const hero = host.closest<HTMLElement>("[data-cinematic-hero]") ?? host
        const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)")
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40)
        const sculpture = new THREE.Group()

        const canRender = () => !disposed && inView && !document.hidden
        const stop = () => {
          if (frame) cancelAnimationFrame(frame)
          frame = 0
          lastTime = 0
        }
        const schedule = () => {
          if (!frame && canRender()) frame = requestAnimationFrame(render)
        }

        function render(time: number) {
          frame = 0
          if (!canRender() || !renderer) return
          const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
          lastTime = time

          if (!pausedRef.current) {
            elapsed += delta
            const ease = 1 - Math.exp(-delta * 4)
            scrollPosition += (scrollTarget - scrollPosition) * ease
            cameraX += (pointerX - cameraX) * ease
            cameraY += (pointerY - cameraY) * ease
            fragments.forEach((fragment, index) => {
              const phase = index * 1.8
              fragment.rotation.x = Number(fragment.userData.baseX) + Math.sin(elapsed * 0.12 + phase) * 0.045
              fragment.rotation.y = Number(fragment.userData.baseY) + Math.sin(elapsed * 0.1 + phase) * 0.08 + scrollPosition * (index % 2 ? -0.16 : 0.16)
              fragment.rotation.z = Number(fragment.userData.baseZ) + Math.sin(elapsed * 0.08 + phase) * 0.025
              fragment.position.y = Number(fragment.userData.baseYPosition) + Math.sin(elapsed * 0.18 + phase) * 0.075
            })
            camera.position.set(cameraX * 0.18, cameraY * 0.12, cameraDistance + scrollPosition * 0.3)
            camera.lookAt(0, 0, 0)
          }

          renderer.render(scene, camera)
          if (firstFrame) {
            firstFrame = false
            host!.dataset.drawCalls = String(renderer.info.render.calls)
            host!.dataset.triangles = String(renderer.info.render.triangles)
            setSceneState("ready")
          }
          if (!pausedRef.current) schedule()
        }

        function updateScroll() {
          if (pausedRef.current) return
          const bounds = hero.getBoundingClientRect()
          scrollTarget = THREE.MathUtils.clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1)
        }

        function onPointerMove(event: PointerEvent) {
          if (pausedRef.current || (!pointerMedia.matches && event.pointerType !== "touch")) return
          const bounds = hero.getBoundingClientRect()
          pointerX = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1)
          pointerY = -THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1)
        }

        function resetPointer() {
          if (pausedRef.current) return
          pointerX = 0
          pointerY = 0
        }

        function onVisibilityChange() {
          if (document.hidden) stop()
          else schedule()
        }

        function resize() {
          if (!renderer || disposed) return
          const bounds = host!.getBoundingClientRect()
          width = Math.max(bounds.width, 1)
          height = Math.max(bounds.height, 1)
          const aspect = width / height
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5))
          renderer.setSize(width, height, false)
          camera.aspect = aspect
          // Full-bleed fragments deliberately crop at the frame edges. The centre
          // remains quiet for the wordmark; mobile gets its own arrangement.
          const halfHeight = Math.tan(THREE.MathUtils.degToRad(16)) * cameraDistance
          const halfWidth = halfHeight * aspect
          const narrow = aspect < 0.85
          const layouts = narrow ? [
            [halfWidth * 1.1, halfHeight * 0.34, -1.8, 0.82],
            [-halfWidth * 1.28, -halfHeight * 0.25, 0.2, 0.73],
            [halfWidth * 1.2, -halfHeight * 0.61, -1.3, 0.57],
            [-halfWidth * 0.95, halfHeight * 1.24, -3.2, 0.26],
          ] : [
            [halfWidth * 0.4, halfHeight * 0.35, -1.2, 1.25],
            [-halfWidth * 1.05, -halfHeight * 0.27, 0.5, 1.35],
            [halfWidth * 0.64, -halfHeight * 0.53, -1.4, 0.94],
            [-halfWidth * 0.55, halfHeight * 1.12, -3.2, 0.52],
          ]
          fragments.forEach((fragment, index) => {
            const [x, y, z, scale] = layouts[index]
            fragment.position.set(x, y, z)
            fragment.scale.setScalar(scale)
            fragment.visible = !(narrow && index === 3)
            fragment.userData.baseYPosition = y
          })
          camera.position.set(cameraX * 0.18, cameraY * 0.12, cameraDistance)
          camera.lookAt(0, 0, 0)
          camera.updateProjectionMatrix()
          updateScroll()
          schedule()
        }

        function onContextLost(event: Event) {
          event.preventDefault()
          setSceneState("fallback")
          disposeScene()
        }

        disposeScene = () => {
          if (disposed) return
          disposed = true
          stop()
          controlsRef.current = null
          resizeObserver?.disconnect()
          intersectionObserver?.disconnect()
          window.removeEventListener("scroll", updateScroll)
          document.removeEventListener("visibilitychange", onVisibilityChange)
          hero.removeEventListener("pointermove", onPointerMove)
          hero.removeEventListener("pointerdown", onPointerMove)
          hero.removeEventListener("pointerleave", resetPointer)
          hero.removeEventListener("pointerup", resetPointer)
          hero.removeEventListener("pointercancel", resetPointer)
          renderer?.domElement.removeEventListener("webglcontextlost", onContextLost)
          geometry?.dispose()
          materials.forEach((material) => material.dispose())
          scene.environment = null
          environment?.dispose()
          scene.clear()
          renderer?.dispose()
          renderer?.forceContextLoss()
          renderer?.domElement.remove()
          delete host!.dataset.drawCalls
          delete host!.dataset.triangles
        }

        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" })
          renderer.setClearColor(0x000000, 0)
          renderer.outputColorSpace = THREE.SRGBColorSpace
          renderer.toneMapping = THREE.ACESFilmicToneMapping
          renderer.toneMappingExposure = 0.92
          renderer.domElement.setAttribute("aria-hidden", "true")
          renderer.domElement.setAttribute("role", "presentation")
          renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none"
          renderer.domElement.addEventListener("webglcontextlost", onContextLost)

          environment = makeStudioEnvironment(THREE, renderer)
          scene.environment = environment.texture
          materials.push(
            new THREE.MeshPhysicalMaterial({
              color: "#bba67f", metalness: 0.98, roughness: 0.31,
              envMapIntensity: 0.85, clearcoat: 0.15, clearcoatRoughness: 0.3,
            }),
            new THREE.MeshPhysicalMaterial({
              color: "#43212b", metalness: 0.7, roughness: 0.27,
              envMapIntensity: 0.8, clearcoat: 0.3, clearcoatRoughness: 0.25,
            }),
          )
          geometry = makeRibbonGeometry(THREE)
          const poses = [
            [0.35, -0.52, -0.65],
            [-0.55, 0.55, 1.85],
            [0.65, -0.3, 0.65],
            [-0.35, 0.85, -1.2],
          ]
          poses.forEach(([x, y, z], index) => {
            const fragment = new THREE.Mesh(geometry, materials[index === 2 ? 1 : 0])
            fragment.rotation.set(x, y, z)
            fragment.userData = { baseX: x, baseY: y, baseZ: z, baseYPosition: 0 }
            fragments.push(fragment)
            sculpture.add(fragment)
          })
          scene.add(sculpture)

          const rim = new THREE.DirectionalLight("#79404b", 0.8)
          rim.position.set(-3, 1, -4)
          scene.add(rim)
          const key = new THREE.DirectionalLight("#fff0da", 1.6)
          key.position.set(-3, 5, 4)
          scene.add(key)

          host.appendChild(renderer.domElement)
          controlsRef.current = {
            setPaused: () => {
              stop()
              if (!pausedRef.current) updateScroll()
              schedule()
            },
          }
          resizeObserver = new ResizeObserver(resize)
          resizeObserver.observe(host)
          intersectionObserver = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            if (inView) schedule()
            else stop()
          }, { rootMargin: "80px" })
          intersectionObserver.observe(host)
          window.addEventListener("scroll", updateScroll, { passive: true })
          document.addEventListener("visibilitychange", onVisibilityChange)
          hero.addEventListener("pointermove", onPointerMove, { passive: true })
          hero.addEventListener("pointerdown", onPointerMove, { passive: true })
          hero.addEventListener("pointerleave", resetPointer)
          hero.addEventListener("pointerup", resetPointer)
          hero.addEventListener("pointercancel", resetPointer)
          resize()
        } catch {
          disposeScene()
          if (!cancelled) setSceneState("fallback")
        }
      } catch {
        if (!cancelled) setSceneState("fallback")
      }
    }

    void initialize()
    return () => {
      cancelled = true
      disposeScene()
    }
  }, [reducedMotion])

  return (
    <div ref={hostRef} className="gold-sculpture" data-scene-state={sceneState} aria-hidden="true">
      {/* Native image keeps the static composition available before WebGL, or without it. */}
      <picture style={{ display: "block", width: "100%", height: "100%" }}>
      <source media="(max-width: 767px)" srcSet={staticMobileScene} />
      <Image
        src={staticScene}
        alt=""
        draggable={false}
        width={1440}
        height={900}
        unoptimized
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          visibility: sceneState === "ready" ? "hidden" : "visible",
        }}
      />
      </picture>
    </div>
  )
}
