import { memo } from 'react'

/** 英雄区底部「SCROLL」+ 上下呼吸的金色细线（1.6s 循环） */
const ScrollCue = memo(function ScrollCue() {
  return (
    <div aria-hidden className="flex flex-col items-center gap-3">
      <span className="font-grotesk text-[0.65rem] font-medium uppercase tracking-kicker text-tx-mid">Scroll</span>
      <span className="animate-cue-breathe block h-12 w-px origin-top bg-gradient-to-b from-gold to-transparent" />
    </div>
  )
})

export default ScrollCue
