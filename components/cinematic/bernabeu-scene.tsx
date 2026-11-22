"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePortfolioMotion } from "./portfolio-frame"

/** An original architectural study of the renovated Bernabéu, not a surveyed model. */
export function BernabeuScene() {
  const host = useRef<HTMLDivElement>(null)
  const { paused } = usePortfolioMotion()
  const [state, setState] = useState("loading")

  useEffect(() => {
    const element = host.current
    if (!element || paused) { setState("fallback"); return }
    let dead = false
    let visible = false
    let initialized = false
    let frame = 0
    let release = () => {}
    let synchronize = () => {}
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) void initialize(); synchronize() }, { rootMargin: "120px" })
    observer.observe(element)
    const visibility = () => synchronize()
    document.addEventListener("visibilitychange", visibility)

    async function initialize() {
      if (initialized || dead) return
      initialized = true
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([import("three"), import("three/addons/environments/RoomEnvironment.js")])
        if (dead || !element) return
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" })
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
        renderer.setClearColor(0x000000, 0)
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = .85
        renderer.domElement.setAttribute("aria-hidden", "true")
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(37, 1, .1, 50)
        camera.position.set(6.8, 6.4, 8.4)
        camera.lookAt(0, .5, 0)
        const pmrem = new THREE.PMREMGenerator(renderer)
        const room = new RoomEnvironment()
        const environment = pmrem.fromScene(room, .04)
        scene.environment = environment.texture
        room.dispose()
        pmrem.dispose()
        scene.add(new THREE.HemisphereLight(0xf5f0e6, 0x261b26, 1.3))
        const light = new THREE.DirectionalLight(0xfff6e8, 1.8)
        light.position.set(-3, 6, 4)
        scene.add(light)
        const stadium = new THREE.Group()
        scene.add(stadium)
        const silver = new THREE.MeshStandardMaterial({ color: 0x909ba9, metalness: .8, roughness: .3, side: THREE.DoubleSide })
        const rim = new THREE.MeshStandardMaterial({ color: 0xb7bec8, metalness: .65, roughness: .38, side: THREE.DoubleSide })
        const navy = new THREE.MeshStandardMaterial({ color: 0x203c6a, roughness: .8, side: THREE.DoubleSide })
        const glass = new THREE.MeshStandardMaterial({ color: 0x161e2b, metalness: .65, roughness: .2, side: THREE.DoubleSide })
        const green = new THREE.MeshStandardMaterial({ color: 0x33744c, roughness: 1 })
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x252229, roughness: .55, metalness: .3 })
        const geometries: import("three").BufferGeometry[] = []
        const point = (angle: number, x: number, z: number) => [Math.sign(Math.cos(angle)) * Math.abs(Math.cos(angle)) ** .64 * x, Math.sign(Math.sin(angle)) * Math.abs(Math.sin(angle)) ** .64 * z]
        const band = (outer: [number, number, number], inner: [number, number, number], material: import("three").Material) => {
          const vertices: number[] = [], indices: number[] = []
          for (let i = 0; i <= 128; i++) {
            const angle = i / 128 * Math.PI * 2
            for (const [x, z, y] of [outer, inner]) { const [px, pz] = point(angle, x, z); vertices.push(px, y, pz) }
            if (i < 128) { const v = i * 2; indices.push(v, v + 2, v + 1, v + 1, v + 2, v + 3) }
          }
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
          geometry.setIndex(indices)
          geometry.computeVertexNormals()
          geometries.push(geometry)
          stadium.add(new THREE.Mesh(geometry, material))
        }
        // The renewed stadium's continuous silver louvres wrap a rounded rectangle.
        for (let i = 0; i < 26; i++) {
          const y = .28 + i * .047
          const bulge = Math.sin(i / 26 * Math.PI) * .13
          band([3.35 + bulge, 2.35 + bulge, y], [3.32 + bulge, 2.32 + bulge, y + .035], silver)
        }
        band([3.28, 2.28, .08], [3.28, 2.28, .38], glass)
        // Open roof, exposed blue seating tiers and a regulation-shaped pitch.
        band([3.38, 2.38, 1.53], [2.45, 1.52, 1.46], rim)
        band([2.45, 1.52, 1.46], [2.45, 1.52, 1.33], glass)
        for (let i = 0; i < 16; i++) {
          const step = i / 16
          band([1.98 + step * 1.2, 1.17 + step * .97, .16 + step * 1.13], [1.94 + step * 1.2, 1.13 + step * .97, .16 + step * 1.13], navy)
        }
        const pitchGeometry = new THREE.PlaneGeometry(3.8, 2.12)
        geometries.push(pitchGeometry)
        const pitch = new THREE.Mesh(pitchGeometry, green)
        pitch.rotation.x = -Math.PI / 2
        pitch.position.y = .13
        stadium.add(pitch)
        const baseGeometry = new THREE.BoxGeometry(7.3, .12, 5.3)
        geometries.push(baseGeometry)
        const base = new THREE.Mesh(baseGeometry, baseMaterial)
        base.position.y = -.06
        stadium.add(base)
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf2eadc })
        const line = (coordinates: number[][], loop = false) => {
          const geometry = new THREE.BufferGeometry().setFromPoints(coordinates.map(([x, z]) => new THREE.Vector3(x, .14, z)))
          geometries.push(geometry)
          stadium.add(loop ? new THREE.LineLoop(geometry, lineMaterial) : new THREE.Line(geometry, lineMaterial))
        }
        line([[-1.78,-.94],[1.78,-.94],[1.78,.94],[-1.78,.94]], true)
        line([[0,-.94],[0,.94]])
        line(Array.from({length:65},(_,i)=>[Math.cos(i/64*Math.PI*2)*.28,Math.sin(i/64*Math.PI*2)*.28]), true)
        for (const side of [-1,1]) { line([[side*1.78,-.53],[side*1.2,-.53],[side*1.2,.53],[side*1.78,.53]]); line([[side*1.78,-.24],[side*1.58,-.24],[side*1.58,.24],[side*1.78,.24]]) }
        element.appendChild(renderer.domElement)
        const resize = () => {
          const width = element.clientWidth, height = element.clientHeight
          if (!width || !height) return
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
        }
        const sizing = new ResizeObserver(resize)
        sizing.observe(element)
        resize()
        let pointerX = 0, pointerY = 0
        const move = (event: PointerEvent) => { const bounds = element.getBoundingClientRect(); pointerX = (event.clientX - bounds.left) / bounds.width - .5; pointerY = (event.clientY - bounds.top) / bounds.height - .5 }
        const leave = () => { pointerX = 0; pointerY = 0 }
        element.addEventListener("pointermove", move, { passive: true })
        element.addEventListener("pointerleave", leave)
        const draw = (time: number) => {
          frame = 0
          if (dead || !visible || document.hidden) return
          stadium.rotation.y += (-.3 + Math.sin(time * .00012) * .14 + pointerX * .35 - stadium.rotation.y) * .035
          stadium.rotation.x += (pointerY * .1 - stadium.rotation.x) * .035
          renderer.render(scene, camera)
          frame = requestAnimationFrame(draw)
        }
        synchronize = () => { if (visible && !document.hidden && !frame) frame = requestAnimationFrame(draw); else if (!visible || document.hidden) { cancelAnimationFrame(frame); frame = 0 } }
        const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); frame = 0; synchronize = () => {}; setState("fallback") }
        renderer.domElement.addEventListener("webglcontextlost", lost)
        release = () => {
          cancelAnimationFrame(frame); sizing.disconnect()
          element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave)
          renderer.domElement.removeEventListener("webglcontextlost", lost)
          geometries.forEach(geometry => geometry.dispose())
          ;[silver,rim,navy,glass,green,baseMaterial,lineMaterial].forEach(material => material.dispose())
          environment.dispose(); scene.clear(); renderer.dispose(); renderer.domElement.remove()
        }
        setState("ready")
        synchronize()
      } catch { if (!dead) setState("fallback") }
    }
    return () => { dead = true; observer.disconnect(); document.removeEventListener("visibilitychange", visibility); release() }
  }, [paused])

  return <div ref={host} className="bernabeu-scene" data-scene-state={state} role="img" aria-label="A three-dimensional architectural study of Santiago Bernabéu stadium"><Image className="bernabeu-poster" src="/football/bernabeu-poster.png" alt="" fill sizes="(max-width: 767px) 100vw, 60vw" unoptimized /></div>
}
