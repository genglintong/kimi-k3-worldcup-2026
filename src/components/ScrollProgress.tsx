import { memo } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/** 顶部 3px 金色渐变滚动进度条（scaleX 驱动），z-index 最高 */
const ScrollProgress = memo(function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-amber via-gold to-gold-deep"
      style={{ scaleX }}
    />
  )
})

export default ScrollProgress
