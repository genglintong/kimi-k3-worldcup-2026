import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * 决赛英雄区双色粒子场（Three.js Points）：
 * 左半 espana 红粒子、右半 albiceleste 天蓝粒子（各 800，移动端减半），
 * 缓慢漂浮 + 鼠标视差反向移动（左随鼠标、右逆鼠标）。
 * prefers-reduced-motion 时整体不渲染（由父组件控制）。
 */

interface CloudData {
  base: Float32Array
  phase: Float32Array
  speed: Float32Array
  colors: Float32Array
  count: number
}

function buildCloud(count: number, side: 'left' | 'right'): CloudData {
  const base = new Float32Array(count * 3)
  const phase = new Float32Array(count)
  const speed = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const main = new THREE.Color(side === 'left' ? '#FF4136' : '#6FC3FF')
  const bright = new THREE.Color(side === 'left' ? '#FF8A7A' : '#C4E6FF')
  const sign = side === 'left' ? -1 : 1
  for (let i = 0; i < count; i++) {
    const o = i * 3
    base[o] = sign * (0.4 + Math.random() * 7.1)
    base[o + 1] = (Math.random() - 0.5) * 8
    base[o + 2] = (Math.random() - 0.5) * 3
    phase[i] = Math.random() * Math.PI * 2
    speed[i] = 0.12 + Math.random() * 0.3
    const c = Math.random() < 0.75 ? main : bright
    colors[o] = c.r
    colors[o + 1] = c.g
    colors[o + 2] = c.b
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

interface CloudProps {
  side: 'left' | 'right'
  count: number
  mouse: React.MutableRefObject<{ x: number; y: number }>
}

function Cloud({ side, count, mouse }: CloudProps) {
  const groupRef = useRef<THREE.Group>(null)
  const drift = useRef({ x: 0, y: 0 })
  const data = useMemo(() => buildCloud(count, side), [count, side])
  const texture = useDotTexture()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.base.slice(), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3))
    return geo
  }, [data])

  /* eslint-disable react-hooks/immutability -- R3F 标准模式：useFrame 中直接改写 BufferAttribute */
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pos = geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < data.count; i++) {
      const o = i * 3
      const rise = ((t * data.speed[i] + data.phase[i]) % 6) - 3
      arr[o] = data.base[o] + Math.sin(t * 0.35 + data.phase[i]) * 0.28
      arr[o + 1] = data.base[o + 1] + rise * 0.32 + Math.cos(t * 0.28 + data.phase[i]) * 0.16
    }
    pos.needsUpdate = true

    /* 鼠标视差：左半同向、右半反向（lerp 衰减） */
    const sign = side === 'left' ? 1 : -1
    drift.current.x += (sign * mouse.current.x * 0.7 - drift.current.x) * 0.05
    drift.current.y += (sign * mouse.current.y * 0.4 - drift.current.y) * 0.05
    if (groupRef.current) {
      groupRef.current.position.x = drift.current.x
      groupRef.current.position.y = drift.current.y
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.06}
          map={texture}
          vertexColors
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function DuelParticles({ visible = true }: { visible?: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 400 : 800
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      camera={{ position: [0, 0, 7], fov: 55 }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true }}
    >
      <Cloud side="left" count={count} mouse={mouse} />
      <Cloud side="right" count={count} mouse={mouse} />
    </Canvas>
  )
}
