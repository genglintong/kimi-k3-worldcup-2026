import { memo } from 'react'
import { useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_ITEMS } from '@/lib/constants'

const PAGE_META: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((n, i) => [n.path, `${String(i + 1).padStart(2, '0')} / ${n.en}`]),
)

/**
 * 页面转场：金色斜切擦除 —— 黑色面板沿 -12° 斜边扫过（0.55s），
 * 中场闪现页面编号（Anton 金色），随后新页面内容淡入。
 */
const PageTransition = memo(function PageTransition() {
  const location = useLocation()
  const meta = PAGE_META[location.pathname] ?? 'MILESTONES·26'

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
        {/* 斜切黑色面板 */}
        <motion.div
          className="absolute -inset-y-[20%] -left-[30%] w-[260%] bg-ink"
          style={{ transform: 'skewX(-12deg)' }}
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        />
        {/* 页面编号闪现 */}
        <motion.p
          className="text-gold-gradient absolute inset-0 flex items-center justify-center font-display text-5xl tracking-wider md:text-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.55, times: [0, 0.45, 1], ease: 'easeInOut' }}
        >
          {meta}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
})

export default PageTransition
