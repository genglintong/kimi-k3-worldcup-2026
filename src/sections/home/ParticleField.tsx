import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * 英雄区 3D 粒子场（Three.js Points）：
 * 约 2000 个金色/白色粒子（7:3），缓慢上飘 + 鼠标视差 ±20px，
 * 其中约 40% 粒子从离屏画布的「26」字形采样，字形区域密度更高。
 * 移动端粒子数量减半；prefers-reduced-motion 时整体不渲染。
 */

interface ParticleData {
  base: Float32Array
  phase: Float32Array
  speed: Float32Array
  colors: Float32Array
  count: number
}

/** 从离屏画布采样「26」字形内的点 */
function sampleGlyph(count: number, spread: { x: number; y: number }): Float32Array {
  const c = document.createElement('canvas')
  c.width = 260
  c.height = 140
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.font = '900 110px "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('26', 130, 74)
  const pixels = ctx.getImageData(0, 0, c.width, c.height).data
  const lit: number[] = []
  for (let y = 0; y < c.height; y += 2) {
    for (let x = 0; x < c.width; x += 2) {
      if (pixels[(y * c.width + x) * 4 + 3] > 128) lit.push(x, y)
    }
  }
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * (lit.length / 2)) * 2
    out[i * 3] = (lit[idx] / c.width - 0.5) * spread.x
    out[i * 3 + 1] = (0.5 - lit[idx + 1] / c.height) * spread.y
    out[i * 3 + 2] = (Math.random() - 0.5) * 1.2
  }
  return out
}

function buildParticles(count: number): ParticleData {
  const glyphCount = Math.floor(count * 0.4)
  const ambientCount = count - glyphCount
  const base = new Float32Array(count * 3)
  base.set(sampleGlyph(glyphCount, { x: 9, y: 5 }), 0)
  for (let i = 0; i < ambientCount; i++) {
    const o = (glyphCount + i) * 3
    base[o] = (Math.random() - 0.5) * 14
    base[o + 1] = (Math.random() - 0.5) * 8
    base[o + 2] = (Math.random() - 0.5) * 3
  }
  const phase = new Float32Array(count)
  const speed = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const gold = new THREE.Color('#F5C452')
  const white = new THREE.Color('#F5F7FF')
  for (let i = 0; i < count; i++) {
    phase[i] = Math.random() * Math.PI * 2
    speed[i] = 0.15 + Math.random() * 0.35
    const c = Math.random() < 0.7 ? gold : white
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  return { base, phase, speed, colors, count }
}

/** 柔和圆点贴图 */
function useDotTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 64
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
}

function Points({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const mouseTarget = useRef({ x: 0, y: 0 })
  const data = useMemo(() => buildParticles(count), [count])
  const texture = useDotTexture()

  /* 全局鼠标追踪（canvas 位于内容层下方，直接监听 window） */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseTarget.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.base.slice(), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3))
    return geo
  }, [data])

  /* eslint-disable react-hooks/immutability -- R3F 标准模式：在 useFrame 中直接改写 BufferAttribute */
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pos = geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < data.count; i++) {
      const o = i * 3
      // 缓慢上飘 + 正弦摆动（不修改基准位置，直接计算偏移）
      const rise = ((t * data.speed[i] + data.phase[i]) % 6) - 3
      arr[o] = data.base[o] + Math.sin(t * 0.4 + data.phase[i]) * 0.25
      arr[o + 1] = data.base[o + 1] + rise * 0.35 + Math.cos(t * 0.3 + data.phase[i]) * 0.15
    }
    pos.needsUpdate = true

    // 鼠标视差 ±20px（世界坐标约 ±0.8），lerp 衰减
    mouse.current.x += (mouseTarget.current.x * 0.8 - mouse.current.x) * 0.05
    mouse.current.y += (mouseTarget.current.y * 0.5 - mouse.current.y) * 0.05
    if (groupRef.current) {
      groupRef.current.position.x = mouse.current.x
      groupRef.current.position.y = mouse.current.y
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.055}
          map={texture}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function ParticleField({ visible = true }: { visible?: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 1000 : 2000
  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      camera={{ position: [0, 0, 7], fov: 55 }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true }}
    >
      <Points count={count} />
    </Canvas>
  )
}
