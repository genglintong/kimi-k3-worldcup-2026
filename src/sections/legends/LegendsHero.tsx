import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollCue from '@/components/ScrollCue'
import { STATS_AS_OF } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

/** 背景拼贴用的球星肖像（8% 透明度平铺） */
const COLLAGE = [
  '/portrait-messi.png',
  '/portrait-ronaldo.png',
  '/portrait-mbappe.png',
  '/portrait-yamal.png',
  '/portrait-haaland.png',
  '/portrait-bellingham.png',
]

/** 快速索引芯片（锚点跳转） */
const CHIPS = [
  { id: 'messi', label: '梅西' },
  { id: 'ronaldo', label: 'C罗' },
  { id: 'mbappe', label: '姆巴佩' },
  { id: 'stars', label: '群星' },
  { id: 'farewell', label: '告别' },
]

const TITLE = '诸神与新王'

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * S1 页头（75vh，居中）。
 * 背景：球星剪影拼贴（8% 透明度 + 深色蒙版），scale 1.1→1 缓慢推近 2.5s。
 * H1 字符级 stagger 0.05s（power4.out）；索引芯片 stagger 0.08s。
 */
export default function LegendsHero() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('[data-lh="bg"]', { scale: 1.1 }, { scale: 1, duration: 2.5, ease: 'power2.out' }, 0)
        .fromTo('[data-lh="kicker"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.25)
        .fromTo(
          '[data-lh-char]',
          { yPercent: 110, rotate: 5 },
          { yPercent: 0, rotate: 0, duration: 1.05, ease: 'power4.out', stagger: 0.05 },
          0.4,
        )
        .fromTo('[data-lh="sub"]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 }, 1.05)
        .fromTo('[data-lh-chip]', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, 1.25)
        .fromTo('[data-lh="cue"]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.7)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative flex min-h-[75dvh] flex-col items-center justify-center overflow-hidden py-24">
      {/* 球星剪影拼贴背景（8% 透明度 + 深色蒙版） */}
      <div data-lh="bg" aria-hidden className="absolute inset-0 will-change-transform">
        <div className="flex h-full items-stretch justify-center gap-2">
          {COLLAGE.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              draggable={false}
              className="h-full w-1/3 select-none object-cover opacity-[0.08] grayscale-[40%] md:w-1/6"
            />
          ))}
        </div>
      </div>
      {/* 深色蒙版 */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/60 to-obsidian" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(720px_360px_at_50%_60%,rgba(245,196,82,0.07),transparent)]" />

      {/* 内容层 */}
      <div className="container-x relative z-10 flex flex-col items-center text-center">
        <p data-lh="kicker" className="flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
          Legends
          <span className="text-tx-low">/ 巨星里程碑</span>
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
        </p>

        <h1 className="mt-6 overflow-hidden font-sans text-[clamp(2.25rem,7vw,4.25rem)] font-black leading-[1.1] tracking-[0.02em] text-tx-hi">
          {Array.from(TITLE).map((ch, i) => (
            <span key={i} data-lh-char className="inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </h1>

        <p data-lh="sub" className="mt-6 max-w-[56ch] text-base leading-[1.85] text-tx-mid">
          39 岁的梅西还在改写历史，19 岁的亚马尔已经站在决赛门口。这是一届关于传承的世界杯。
        </p>

        {/* 快速索引芯片 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              data-lh-chip
              data-cursor
              onClick={() => jumpTo(chip.id)}
              className="rounded-full border border-line bg-panel/70 px-5 py-2 font-sans text-sm font-bold text-tx-mid backdrop-blur transition-colors duration-300 hover:border-gold/60 hover:text-gold"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <p data-lh="sub" className="mt-8 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-tx-low">
          数据{STATS_AS_OF} · 半决赛后
        </p>
      </div>

      <div data-lh="cue" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <ScrollCue />
      </div>
    </section>
  )
}
