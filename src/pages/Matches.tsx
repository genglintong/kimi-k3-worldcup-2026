import { useEffect } from 'react'
import { useLocation } from 'react-router'
import MatchesHero from '@/sections/matches/MatchesHero'
import BattlesTimeline from '@/sections/matches/BattlesTimeline'
import Sidelines from '@/sections/matches/Sidelines'
import NextChapter from '@/sections/matches/NextChapter'

/**
 * 经典战役 `/matches` —— 8 个不眠之夜
 * S1 页头 → S2 战役时间线（8 场淘汰赛可展开战报）→ S3 场外风云 → S4 下一章 CTA
 * 支持锚点直达（如 /matches#nor-bra）：自动展开对应战报并滚动到位。
 */
export default function Matches() {
  const { hash, pathname } = useLocation()
  const anchorId = hash ? hash.slice(1) : undefined

  /* 锚点滚动：延迟执行，避开 Layout 路由切换的回顶；二次尝试以覆盖展开动画后的位移 */
  useEffect(() => {
    if (!anchorId) return
    const scrollToAnchor = () => {
      document.getElementById(anchorId)?.scrollIntoView({ block: 'start', behavior: 'auto' })
    }
    const t1 = window.setTimeout(scrollToAnchor, 450)
    const t2 = window.setTimeout(scrollToAnchor, 1200)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [anchorId, pathname])

  return (
    <>
      <MatchesHero />
      <BattlesTimeline anchorOpenId={anchorId} />
      <Sidelines />
      <NextChapter />
    </>
  )
}
