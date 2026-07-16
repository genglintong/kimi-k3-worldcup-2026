import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, useMotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionHead from '@/components/SectionHead'

interface Player {
  name: string
  team: string
  meta: string
  reveal: string
  img: string
}

const PLAYERS: Player[] = [
  { name: '梅西', team: '阿根廷', meta: '39 岁 · 第 6 届', reveal: '21 球 · 世界杯历史射手王', img: '/portrait-messi.png' },
  { name: 'C 罗', team: '葡萄牙', meta: '41 岁 · 第 6 届', reveal: '史上首位 6 届世界杯进球', img: '/portrait-ronaldo.png' },
  { name: '姆巴佩', team: '法国', meta: '27 岁', reveal: '淘汰赛 10 球 · 历史第一', img: '/portrait-mbappe.png' },
  { name: '贝林厄姆', team: '英格兰', meta: '中场新王', reveal: '100 秒内梅开二度', img: '/portrait-bellingham.png' },
  { name: '哈兰德', team: '挪威', meta: '魔人射手', reveal: '7 球 · 率挪威首进八强', img: '/portrait-haaland.png' },
  { name: '亚马尔', team: '西班牙', meta: '19 岁', reveal: '决赛日 19 岁零 6 天', img: '/portrait-yamal.png' },
]

/**
 * S4 巨星长廊：Framer Motion 横向拖拽带（drag="x" + 惯性），
 * 两端渐隐遮罩，支持滚轮横向映射；悬停揭示金色数据条。
 */
export default function LegendsRail() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragLimit, setDragLimit] = useState(0)
  const x = useMotionValue(0)
  const navigate = useNavigate()

  /* 计算拖拽边界 + 滚轮横向映射 */
  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const measure = () => setDragLimit(Math.max(0, track.scrollWidth - viewport.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(viewport)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const next = x.get() - e.deltaY
      if (next <= 0 && next >= -dragLimit) {
        e.preventDefault()
        x.set(Math.max(-dragLimit, Math.min(0, next)))
      }
    }
    viewport.addEventListener('wheel', onWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', onWheel)
  }, [dragLimit, x])

  return (
    <section className="overflow-hidden py-24 md:py-36">
      <div className="container-x">
        <SectionHead kickerEn="LEGENDS" kickerZh="巨星里程碑" title="诸神与新王" />
      </div>

      <div ref={viewportRef} className="relative">
        {/* 两端渐隐遮罩 */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-obsidian to-transparent md:w-28" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-obsidian to-transparent md:w-28" />

        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -dragLimit, right: 0 }}
          dragElastic={0.06}
          className="flex cursor-grab gap-6 px-6 active:cursor-grabbing md:px-10"
        >
          {PLAYERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ x: 120, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileDrag={{ rotate: i % 2 === 0 ? 2 : -2 }}
              className="group relative w-[260px] shrink-0 overflow-hidden rounded-[20px] border border-line bg-panel md:w-[300px]"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={p.img}
                  alt={`${p.name}风格化剪影`}
                  draggable={false}
                  className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </div>
              {/* 底部常驻信息 */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent p-5 pt-14">
                <p className="font-sans text-xl font-black text-tx-hi">{p.name}</p>
                <p className="mt-1 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-tx-mid">
                  {p.team} · {p.meta}
                </p>
              </div>
              {/* 悬停揭示：金色数据条上滑 */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gold p-4 transition-transform duration-400 ease-out group-hover:translate-y-0">
                <p className="font-sans text-sm font-bold text-obsidian">{p.reveal}</p>
                <p className="mt-1 flex items-center gap-1 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-obsidian/70">
                  查看传奇 <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </motion.div>
          ))}

          {/* 末张：全部巨星 → */}
          <button
            type="button"
            onClick={() => navigate('/legends')}
            className="group flex w-[220px] shrink-0 flex-col items-center justify-center gap-4 rounded-[20px] border border-gold/30 bg-panel/60 text-center transition-colors hover:border-gold/60 hover:bg-gold/5 md:w-[260px]"
          >
            <span className="text-gold-gradient font-display text-4xl">ALL</span>
            <span className="flex items-center gap-2 font-sans text-base font-bold text-gold">
              全部巨星
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
