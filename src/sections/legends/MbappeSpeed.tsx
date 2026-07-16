import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** 纪录芯片 */
const CHIPS = [
  '史上最快达成世界杯 20 球',
  '世界杯淘汰赛历史射手王（10 球，超大罗 / 莱昂尼达斯 8 球）',
  '首位在两届世界杯均进 8 球',
]

const MAX_SPEED = 40
const TOP_SPEED = 37.6
/** 半圆弧长（r = 90） */
const ARC_LEN = Math.PI * 90
/** 无缝平铺的斜向速度线 SVG 瓦片（120×120，对角线） */
const SPEEDLINE_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><line x1="-12" y1="132" x2="132" y2="-12" stroke="rgba(77,216,255,0.07)" stroke-width="1.5"/></svg>',
)}")`

/**
 * S4 姆巴佩（速度主题）。
 * 电光蓝速度线背景（斜向细线缓慢流动）；速度表弧 stroke-dashoffset 至 37.6 刻度（1.6s）+ 指针弹性到位；
 * 数据带 x:60→0；芯片 stagger 0.1s。
 */
export default function MbappeSpeed() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      /* 背景速度线：backgroundPositionX 循环（一个瓦片周期，无缝） */
      if (!reduced) {
        gsap.to('[data-speedlines]', { backgroundPositionX: '-120px', duration: 6, ease: 'none', repeat: -1 })
      }

      /* 数据带 x:60→0 */
      gsap.fromTo(
        '[data-mb-band]',
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 70%', once: true } },
      )

      /* 速度表：弧 stroke-dashoffset 满 → 37.6 刻度（1.6s, power3.out） */
      const frac = TOP_SPEED / MAX_SPEED
      gsap.fromTo(
        '[data-gauge-arc]',
        { strokeDashoffset: ARC_LEN },
        {
          strokeDashoffset: ARC_LEN * (1 - frac),
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-gauge]', start: 'top 78%', once: true },
        },
      )
      /* 指针：-90° → 刻度角，弹性抖动到位（svgOrigin 以 SVG 绝对坐标为圆心） */
      gsap.fromTo(
        '[data-gauge-needle]',
        { rotation: -90, svgOrigin: '110 110' },
        {
          rotation: -90 + frac * 180,
          svgOrigin: '110 110',
          duration: 1.6,
          ease: 'elastic.out(1, 0.45)',
          scrollTrigger: { trigger: '[data-gauge]', start: 'top 78%', once: true },
        },
      )
      /* 读数 0 → 37.6 */
      const readout = root.querySelector<HTMLElement>('[data-gauge-num]')
      if (readout) {
        const counter = { v: 0 }
        gsap.to(counter, {
          v: TOP_SPEED,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-gauge]', start: 'top 78%', once: true },
          onUpdate: () => {
            readout.textContent = counter.v.toFixed(1)
          },
        })
      }

      /* 纪录芯片 stagger 0.1s */
      gsap.fromTo(
        '[data-mb-chip]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '[data-mb-chips]', start: 'top 82%', once: true } },
      )

      /* 肖像入场 */
      gsap.fromTo(
        '[data-mb-portrait]',
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 70%', once: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="mbappe" ref={rootRef} className="relative overflow-hidden border-t border-line bg-obsidian py-24 md:py-36">
      {/* 电光蓝速度线背景 */}
      <div
        data-speedlines
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: SPEEDLINE_TILE, backgroundSize: '120px 120px' }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/40 to-obsidian/80" />
      <div aria-hidden className="absolute left-[-8vw] top-1/3 h-[46vh] w-[36vw] rounded-full bg-[radial-gradient(circle,rgba(77,216,255,0.08),transparent_70%)] blur-[110px]" />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[42%_58%]">
        {/* 左：肖像 */}
        <div data-mb-portrait className="relative mx-auto w-full max-w-[400px] will-change-transform">
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 h-2/5 w-[130%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(77,216,255,0.22),transparent)] blur-2xl"
          />
          <img
            src="/portrait-mbappe.png"
            alt="姆巴佩：深蓝战袍高速冲刺剪影"
            draggable={false}
            className="relative w-full select-none object-contain"
          />
        </div>

        {/* 右：内容 */}
        <div>
          <p className="font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-cyanx">
            Kylian Mbappé
            <span className="text-tx-low"> · 法国 · 27 岁</span>
          </p>

          {/* 核心数据带 */}
          <div data-mb-band className="mt-8 will-change-transform">
            <p className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <span className="font-display text-[clamp(4rem,9vw,7.5rem)] leading-none">
                <span className="text-gold-gradient">8</span>
                <span className="ml-2 font-sans text-2xl font-black text-tx-hi md:text-3xl">球</span>
              </span>
              <span className="font-display text-[clamp(4rem,9vw,7.5rem)] leading-none">
                <span className="text-gold-gradient">3</span>
                <span className="ml-2 font-sans text-2xl font-black text-tx-hi md:text-3xl">助</span>
              </span>
            </p>

            {/* 速度表 */}
            <div data-gauge className="mt-8 flex flex-wrap items-center gap-8">
              <svg viewBox="0 0 220 128" className="w-[240px] max-w-full" role="img" aria-label="最快冲刺速度表 37.6 km/h">
                {/* 刻度 */}
                {[-90, -45, 0, 45, 90].map((deg) => (
                  <line
                    key={deg}
                    x1="110"
                    y1="26"
                    x2="110"
                    y2="34"
                    stroke="rgba(245,247,255,0.25)"
                    strokeWidth="2"
                    transform={`rotate(${deg} 110 110)`}
                  />
                ))}
                <text x="22" y="126" fill="#6B7492" fontSize="10" fontFamily="Space Grotesk">0</text>
                <text x="186" y="126" fill="#6B7492" fontSize="10" fontFamily="Space Grotesk">40</text>
                {/* 底弧 */}
                <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />
                {/* 值弧 */}
                <path
                  data-gauge-arc
                  d="M 20 110 A 90 90 0 0 1 200 110"
                  fill="none"
                  stroke="#4DD8FF"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ARC_LEN}
                  strokeDashoffset={ARC_LEN}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(77,216,255,0.55))' }}
                />
                {/* 指针 */}
                <g data-gauge-needle>
                  <line x1="110" y1="110" x2="110" y2="40" stroke="#F5C452" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="110" cy="110" r="6" fill="#F5C452" />
                </g>
              </svg>
              <div>
                <p className="font-display leading-none">
                  <span data-gauge-num className="text-gold-gradient text-6xl md:text-7xl">0.0</span>
                  <span className="ml-2 font-grotesk text-lg font-medium uppercase tracking-datalabel text-cyanx">km/h</span>
                </p>
                <p className="mt-3 text-sm leading-7 text-tx-mid">
                  最快冲刺 <span className="font-bold text-tx-hi">37.6 km/h</span>——全赛事最快
                </p>
              </div>
            </div>
          </div>

          {/* 纪录芯片 */}
          <div data-mb-chips className="mt-8 flex flex-wrap gap-3">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                data-mb-chip
                className="inline-flex items-center rounded-full border border-cyanx/40 bg-panel/70 px-4 py-2 text-sm font-bold text-cyanx backdrop-blur"
              >
                {chip}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-tx-low">季军战后，他可能成为史上首位卫冕金靴的球员。</p>
        </div>
      </div>
    </section>
  )
}
