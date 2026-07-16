import { memo, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'

gsap.registerPlugin(ScrollTrigger)

const FAREWELLS = [
  {
    name: '内马尔',
    team: '巴西',
    img: '/portrait-neymar.png',
    alt: '内马尔：黄色战袍低头掩面剪影',
    text: '1/8 决赛负挪威后含泪宣布退出国家队。80 球，巴西队史射手王。',
  },
  {
    name: '莫德里奇',
    team: '克罗地亚',
    img: '/portrait-modric.png',
    alt: '莫德里奇：红白格战袍外脚背传球剪影',
    text: '世界杯史上最年长助攻者——40 岁 291 天。本届共有 8 名 40+ 球员入选，超过此前 22 届总和。',
  },
  {
    name: 'C 罗',
    team: '葡萄牙',
    img: '/portrait-ronaldo.png',
    alt: 'C 罗：暗红战袍剪影',
    text: '第 6 届，确认谢幕。',
  },
]

/** 预计算的微粒布局（稳定引用，避免重渲染漂移） */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61.8) % 100,
  top: 12 + ((i * 37.3) % 76),
  size: 2 + (i % 3),
}))

/** 缓慢上飘的金色微粒（12s 循环，memo 隔离无限动画） */
const GoldDust = memo(function GoldDust() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-dust]').forEach((p, i) => {
        gsap.set(p, { y: 60, opacity: 0 })
        gsap.to(p, {
          y: -140,
          keyframes: { opacity: [0, 0.85, 0] },
          duration: 12,
          ease: 'none',
          repeat: -1,
          delay: -((i * 12) / PARTICLES.length),
        })
      })
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          data-dust
          className="absolute rounded-full bg-gold"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, boxShadow: '0 0 8px rgba(245,196,82,0.8)' }}
        />
      ))}
    </div>
  )
})

/**
 * S6 告别时刻（暗色情感区）。
 * 全区压暗 + 金色微粒上飘；卡片 opacity 0→1 / y:30→0 / 1.4s / stagger 0.25s（刻意放慢）；
 * 肖像 grayscale 60%→0（hover 0.6s）。
 */
export default function FarewellMoments() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-fw-card]',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          stagger: 0.25,
          scrollTrigger: { trigger: '[data-fw-list]', start: 'top 80%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="farewell" ref={rootRef} className="relative overflow-hidden border-t border-line bg-[#05070F] py-24 md:py-36">
      {/* 压暗的环境微光 */}
      <div aria-hidden className="absolute left-1/2 top-0 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,196,82,0.05),transparent_70%)] blur-[120px]" />
      <GoldDust />

      <div className="container-x relative">
        <SectionHead kickerEn="Farewell" kickerZh="告别时刻" title="有些人，把背影留在了 2026" />

        <div data-fw-list className="mx-auto flex max-w-4xl flex-col gap-6">
          {FAREWELLS.map((f) => (
            <article
              key={f.name}
              data-fw-card
              className="group flex flex-col gap-6 rounded-[20px] border border-line bg-panel/70 p-5 backdrop-blur transition-colors duration-500 hover:border-gold/30 sm:flex-row md:p-6"
            >
              <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl sm:w-40 md:w-44">
                <img
                  src={f.img}
                  alt={f.alt}
                  draggable={false}
                  className="h-full w-full select-none object-cover grayscale-[60%] transition-all duration-600 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-sans text-2xl font-black text-tx-hi">
                  {f.name}
                  <span className="ml-3 font-grotesk text-[0.72rem] font-medium uppercase tracking-datalabel text-tx-low">{f.team}</span>
                </p>
                <p className="mt-3 text-base leading-[1.85] text-tx-mid">{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
