import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface GlowCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

/**
 * 发光卡片：panel 底 + 1px line 描边 + 圆角 20px。
 * 悬停：translateY -6px、描边变 gold/40、顶部径向底光增强、
 * 微倾斜跟随鼠标（rotateX/rotateY ≤ 4°，离开弹回）。
 */
export default function GlowCard({ children, className = '', onClick }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 260, damping: 22 })
  const sy = useSpring(my, { stiffness: 260, damping: 22 })
  const rotateX = useTransform(sy, [0, 1], [4, -4])
  const rotateY = useTransform(sx, [0, 1], [-4, 4])

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      data-cursor
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative overflow-hidden rounded-[20px] border border-line bg-panel transition-colors duration-300 hover:border-gold/40 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* 顶部径向底光：悬停 0.12 → 0.25 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(600px 300px at 50% -10%, rgba(245,196,82,0.12), transparent)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(600px 300px at 50% -10%, rgba(245,196,82,0.25), transparent)' }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
