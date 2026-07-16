import { memo, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * 自定义光标：12px 金色圆点 + 36px 描边圆环，spring 跟随（≈lerp 0.15）。
 * 悬停可交互元素（a / button / [data-cursor]）时圆环放大 2.2 倍并变金。
 * 触摸设备（pointer: coarse）禁用。
 */
const CustomCursor = memo(function CustomCursor() {
  /* 触摸设备（pointer: coarse）禁用 —— 惰性初始化避免 effect 内同步 setState */
  const [enabled] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHovering(!!t?.closest('a, button, [data-cursor]'))
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: hovering ? 2.2 : 1,
          borderColor: hovering ? 'rgba(245,196,82,0.9)' : 'rgba(245,247,255,0.35)',
        }}
        transition={{ duration: 0.25 }}
      />
    </>
  )
})

export default CustomCursor
