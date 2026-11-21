"use client"

import { useEffect, useRef, useState } from "react"
import type * as Three from "three"
import "./atmosphere.css"

type AtmosphereProps = {
  variant: "orb" | "ink"
  paused?: boolean
  className?: string
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// A lit sphere and flowing pigment share the same restrained material palette.
// No remote textures, model requests or post-processing passes are required.
const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uInk;
  const vec3 gold = vec3(.776, .647, .424);
  const vec3 ivory = vec3(.949, .918, .863);
  const vec3 oxblood = vec3(.38, .085, .13);

  float field(vec3 p) {
    return sin(p.x * 3.1 + sin(p.y * 2.8 + p.z)) * .45
      + sin(p.y * 4.3 - p.z * .8 + sin(p.x * 2.2)) * .28
      + sin(p.z * 5.6 + p.x * 3.7 - p.y * 1.4) * .16;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.);
    vec2 p = (vUv - .5) * vec2(aspect, 1.) * 2.65;
    float t = uTime * .13;
    vec2 cursor = uPointer * .055;
    if (uInk > .5) {
      vec2 q = vec2(p.x * .7, p.y * 1.5);
      q += cursor * .9;
      float flow = sin(q.x * 1.5 + t) * .3 + sin(q.x * 3.1 - t * .6) * .11;
      float d = q.y - flow;
      float pigment = exp(-abs(d + sin(q.x * 2. + t) * .1) * 2.8);
      float threads = pow(.5 + .5 * sin(d * 34. + field(vec3(q * 1.1, t)) * 9.), 12.);
      float warm = .5 + .5 * sin(q.x * .7 - t * .4);
      vec3 color = mix(oxblood * 1.25, gold * .7, warm) * pigment;
      color += gold * threads * pigment * .42;
      float vignette = 1. - smoothstep(.12, 1.45, abs(vUv.y - .5) * 2.);
      gl_FragColor = vec4(color, min(.78, pigment * .74) * vignette);
      return;
    }

    p -= cursor;
    float radius = length(p);
    float edge = 1. + sin(atan(p.y, p.x) * 5. + t * .5) * .007;
    float disc = 1. - smoothstep(edge - .015, edge + .009, radius);
    float z = sqrt(max(0., 1. - dot(p, p)));
    vec3 normal = normalize(vec3(p, z));
    // Rotate the material coordinates around the visible sphere. Previously
    // only an almost-black noise field drifted, so the orb read as a still.
    vec3 surface = normal;
    float rotation = uTime * .23;
    surface.xz = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation)) * surface.xz;
    surface.yz = mat2(cos(.36), -sin(.36), sin(.36), cos(.36)) * surface.yz;
    float noise = field(vec3(surface.xy * 1.6, surface.z * 2. + t));
    float ribbons = pow(.5 + .5 * sin(noise * 13. + surface.y * 7. + t), 10.);
    float thin = pow(.5 + .5 * sin(noise * 32. - surface.x * 5.), 22.);
    float fresnel = pow(1. - max(normal.z, 0.), 2.8);
    float light = max(dot(normal, normalize(vec3(-.65, .9, 1.2))), 0.);
    float redLight = max(dot(normal, normalize(vec3(.8, -.6, .3))), 0.);
    float spec = pow(max(dot(reflect(-normalize(vec3(-.6, .9, 1.2)), normal), vec3(0., 0., 1.)), 0.), 38.);
    vec3 base = vec3(.029, .025, .029) + gold * light * .12 + oxblood * redLight * .48;
    base += mix(oxblood * 1.3, gold, light) * ribbons * (.55 + fresnel * .9);
    base += gold * thin * (.18 + fresnel * .7);
    base += gold * fresnel * .82 + ivory * spec * .58;
    float halo = exp(-abs(radius - 1.) * 14.) * (1. - disc);
    vec3 color = base * disc + mix(oxblood, gold, vUv.y) * halo * .4;
    gl_FragColor = vec4(color, min(1., disc + halo * .52));
  }
`

export function Atmosphere({ variant, paused = false, className = "" }: AtmosphereProps) {
  const host = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  const controls = useRef<{ sync: () => void } | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading")

  useEffect(() => {
    pausedRef.current = paused
    controls.current?.sync()
  }, [paused])

  useEffect(() => {
    const element = host.current
    if (!element) return
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let dead = false
    let visible = false
    let loading = false
    let failed = false
    let frame = 0
    let previousTime = 0
    let renderer: Three.WebGLRenderer | undefined
    let geometry: Three.PlaneGeometry | undefined
    let material: Three.ShaderMaterial | undefined
    let scene: Three.Scene | undefined
    let camera: Three.OrthographicCamera | undefined
    const pointer = { x: 0, y: 0 }

    const canAnimate = () => visible && !document.hidden && !media.matches && !pausedRef.current && !dead && !failed
    const render = (now: number) => {
      frame = 0
      if (!renderer || !scene || !camera || !material || !canAnimate()) return
      const delta = previousTime ? Math.min((now - previousTime) / 1000, .05) : 0
      previousTime = now
      material.uniforms.uTime.value += delta
      const point = material.uniforms.uPointer.value as Three.Vector2
      point.x += (pointer.x - point.x) * .035
      point.y += (pointer.y - point.y) * .035
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }
    const sync = () => {
      if (!canAnimate()) {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = 0
      } else if (!frame && renderer) frame = requestAnimationFrame(render)
    }
    controls.current = { sync }

    const resize = () => {
      if (!renderer || !material) return
      const width = element.clientWidth
      const height = element.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      material.uniforms.uResolution.value.set(width, height)
      if (scene && camera) renderer.render(scene, camera)
    }
    const lost = (event: Event) => {
      event.preventDefault()
      failed = true
      sync()
      if (!dead) setState("fallback")
    }
    const initialize = async () => {
      if (renderer || loading || dead || failed || media.matches || !visible) return
      loading = true
      try {
        const THREE = await import("three")
        if (dead) return
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" })
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25))
        renderer.setClearColor(0x000000, 0)
        renderer.domElement.setAttribute("aria-hidden", "true")
        renderer.domElement.addEventListener("webglcontextlost", lost)
        scene = new THREE.Scene()
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        geometry = new THREE.PlaneGeometry(2, 2)
        material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uResolution: { value: new THREE.Vector2(1, 1) },
            uPointer: { value: new THREE.Vector2(0, 0) },
            uTime: { value: 4.5 },
            uInk: { value: variant === "ink" ? 1 : 0 },
          },
        })
        scene.add(new THREE.Mesh(geometry, material))
        element.appendChild(renderer.domElement)
        resize()
        if (!dead) setState("ready")
        sync()
      } catch {
        failed = true
        if (!dead) setState("fallback")
      } finally {
        loading = false
      }
    }
    const preference = () => {
      if (media.matches && !renderer) setState("fallback")
      if (!media.matches) void initialize()
      sync()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) void initialize()
      sync()
    }, { rootMargin: "0px", threshold: .01 })
    observer.observe(element)
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(element)
    const pointerTarget = element.closest("footer") ?? element.parentElement
    const move = (event: PointerEvent) => {
      if (!canAnimate()) return
      const bounds = element.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - .5) * 2
      pointer.y = -((event.clientY - bounds.top) / Math.max(bounds.height, 1) - .5) * 2
    }
    const leave = () => { pointer.x = 0; pointer.y = 0 }
    pointerTarget?.addEventListener("pointermove", move, { passive: true })
    pointerTarget?.addEventListener("pointerdown", move, { passive: true })
    pointerTarget?.addEventListener("pointerleave", leave)
    pointerTarget?.addEventListener("pointerup", leave)
    pointerTarget?.addEventListener("pointercancel", leave)
    media.addEventListener("change", preference)
    document.addEventListener("visibilitychange", sync)
    if (media.matches) setState("fallback")

    return () => {
      dead = true
      controls.current = null
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizeObserver.disconnect()
      media.removeEventListener("change", preference)
      document.removeEventListener("visibilitychange", sync)
      pointerTarget?.removeEventListener("pointermove", move)
      pointerTarget?.removeEventListener("pointerdown", move)
      pointerTarget?.removeEventListener("pointerleave", leave)
      pointerTarget?.removeEventListener("pointerup", leave)
      pointerTarget?.removeEventListener("pointercancel", leave)
      renderer?.domElement.removeEventListener("webglcontextlost", lost)
      geometry?.dispose()
      material?.dispose()
      scene?.clear()
      renderer?.dispose()
      renderer?.domElement.remove()
    }
  }, [variant])

  return <div ref={host} className={`portfolio-atmosphere portfolio-atmosphere--${variant} ${className}`} data-atmosphere={variant} data-scene-state={state} aria-hidden="true"><div className="atmosphere-still" /></div>
}
