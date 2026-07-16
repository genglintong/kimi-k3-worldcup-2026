import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'
import { STATS_AS_OF } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

interface RecordItem {
  figure: string
  label: string
  back: string
}

const RECORDS: RecordItem[] = [
  { figure: '64秒', label: '最快进球', back: '巴拉圭 Galarza，对土耳其' },
  { figure: '7-1', label: '最大比分', back: '德国 vs 库拉索，本届最悬殊' },
  { figure: '96分钟', label: '最晚制胜球', back: '马丁内利，巴西 vs 日本（淘汰赛常规时间）' },
  { figure: '15次', label: '单场扑救', back: '库拉索门将 Eloy Room，1966 年有统计以来纪录' },
  { figure: '43岁', label: '最年长球员', back: '苏格兰门将克雷格·戈登' },
  { figure: '22年183天', label: '最大年龄差', back: '41 岁 C 罗 vs 18 岁 Karimov 同场首发' },
  { figure: '兄弟', label: '各为其主', back: '布罗比（荷兰）& Luckassen（加纳）：首对为不同国家进球的兄弟' },
  { figure: '6届', label: '参赛传奇', back: '梅西 / C 罗 / 奥乔亚；奥乔亚为首位入选 6 届名单者' },
  { figure: '44年', label: '定律终结', back: '1982 年以来首次：决赛没有拜仁球员' },
  { figure: '新规', label: '同分先看相互战绩', back: '世界杯史上首次采用' },
]

interface FlipTileProps {
  item: RecordItem
  flipped: boolean
  onToggle: () => void
}

/** 数据墙瓷贴：与共享 RecordTile 同款视觉；桌面悬停翻转，移动端点击翻转，支持受控自动翻转 */
function FlipTile({ item, flipped, onToggle }: FlipTileProps) {
  return (
    <div data-record-tile className="group h-full [perspective:1000px]" onClick={onToggle}>
      <div
        className="relative h-full min-h-[148px] w-full transition-transform duration-600 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
        style={flipped ? { transform: 'rotateY(180deg)' } : undefined}
      >
        <div className="absolute inset-0 flex flex-col justify-center gap-1.5 rounded-2xl border border-line bg-panel px-5 py-5 [backface-visibility:hidden]">
          <p className={`font-display leading-none text-gold ${item.figure.length > 4 ? 'text-2xl' : 'text-3xl'}`}>
            {item.figure}
          </p>
          <p className="text-sm leading-6 text-tx-mid">{item.label}</p>
        </div>
        <div className="absolute inset-0 flex items-center rounded-2xl border border-gold/40 bg-panel px-5 py-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm leading-6 text-tx-hi">{item.back}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * S7 纪录速览 · 数据墙：10 张瓷贴（桌面 5×2，移动 2 列）。
 * 入场 y:40→0 stagger 0.06；悬停 rotateY 180°（0.6s）；移动端点击翻转；
 * 每 6s 随机一枚瓷贴自动轻翻一次。
 */
export default function RecordWall() {
  const rootRef = useRef<HTMLElement>(null)
  const [flippedIdx, setFlippedIdx] = useState<number | null>(null)
  const flippedRef = useRef<number | null>(null)

  const applyFlip = (idx: number | null) => {
    flippedRef.current = idx
    setFlippedIdx(idx)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-record-tile]',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  /* 每 6s 随机一枚瓷贴自动轻翻一次（降低动效偏好时关闭） */
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let unflip: number | undefined
    const id = window.setInterval(() => {
      if (flippedRef.current !== null) {
        applyFlip(null)
        return
      }
      applyFlip(Math.floor(Math.random() * RECORDS.length))
      window.clearTimeout(unflip)
      unflip = window.setTimeout(() => applyFlip(null), 1600)
    }, 6000)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(unflip)
    }
  }, [])

  return (
    <section ref={rootRef} id="records" className="relative bg-obsidian py-24 md:py-36">
      <div className="container-wide">
        <SectionHead kickerEn="Record Wall" kickerZh="纪录速览" title="一面墙的数字传奇" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {RECORDS.map((item, i) => (
            <FlipTile
              key={item.label}
              item={item}
              flipped={flippedIdx === i}
              onToggle={() => applyFlip(flippedRef.current === i ? null : i)}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-tx-low">
          数据综合自 ESPN / AP / Reuters / SI / Opta 公开报道 · 统计{STATS_AS_OF}
        </p>
      </div>
    </section>
  )
}
