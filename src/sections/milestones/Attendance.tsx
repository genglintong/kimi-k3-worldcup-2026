import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'

gsap.registerPlugin(ScrollTrigger)

const RING_R = 60
const RING_C = 2 * Math.PI * RING_R

/** 99.7% 上座率环形 SVG（描边动画 1.6s） */
function OccupancyRing() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const arc = root.querySelector<SVGCircleElement>('[data-ring-arc]')
      const num = root.querySelector<HTMLElement>('[data-ring-num]')
      if (arc) {
        gsap.fromTo(
          arc,
          { strokeDashoffset: RING_C },
          {
            strokeDashoffset: RING_C * (1 - 0.997),
            duration: 1.6,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: root, start: 'top 78%', once: true },
          },
        )
      }
      if (num) {
        const counter = { v: 0 }
        gsap.to(counter, {
          v: 99.7,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
          onUpdate: () => {
            num.textContent = `${counter.v.toFixed(1)}%`
          },
        })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      <div className="relative h-[136px] w-[136px]">
        <svg viewBox="0 0 136 136" className="h-full w-full -rotate-90">
          <circle cx="68" cy="68" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            data-ring-arc
            cx="68"
            cy="68"
            r={RING_R}
            fill="none"
            stroke="#4DD8FF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span data-ring-num className="font-display text-2xl text-cyanx">
            0%
          </span>
        </div>
      </div>
      <p className="mt-4 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-cyanx">上座率</p>
      <p className="mt-2 text-center text-sm leading-6 text-tx-mid">场均 6.5 万+ 人</p>
    </div>
  )
}

/** 数字瓷贴（计数器入场） */
function StatTile({ value, decimals = 0, suffix, label, note }: { value: number; decimals?: number; suffix: string; label: string; note: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const num = root.querySelector<HTMLElement>('[data-tile-num]')
      if (!num) return
      const counter = { v: 0 }
      gsap.to(counter, {
        v: value,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        onUpdate: () => {
          num.textContent =
            decimals > 0
              ? `${counter.v.toFixed(decimals)}${suffix}`
              : `${Math.round(counter.v).toLocaleString('en-US')}${suffix}`
        },
      })
    }, root)
    return () => ctx.revert()
  }, [value, decimals, suffix])

  return (
    <div ref={rootRef} className="flex flex-col items-center text-center">
      <p className="font-display text-4xl leading-none text-tx-hi md:text-5xl">
        <span data-tile-num>0{suffix}</span>
      </p>
      <p className="mt-4 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-cyanx">{label}</p>
      <p className="mt-2 text-sm leading-6 text-tx-mid">{note}</p>
    </div>
  )
}

/**
 * S4 上座狂潮（数据剧场，cyan 主题）。
 * 中心大数字舞台 6,527,410（计数 2.4s）→ 对比横条（金条终点迸发 8 粒金色微粒）
 * → 4 格数据瓷贴（99.7% 环形 / 单日最高 / 球迷节 / 门票申请）。
 */
export default function Attendance() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 中心大数字：0 → 6,527,410，2.4s，千分位 */
      const big = root.querySelector<HTMLElement>('[data-big-num]')
      if (big) {
        const counter = { v: 0 }
        gsap.to(counter, {
          v: 6527410,
          duration: 2.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: big, start: 'top 75%', once: true },
          onUpdate: () => {
            big.textContent = Math.round(counter.v).toLocaleString('en-US')
          },
        })
      }

      /* 对比横条 scaleX 0→1，1.2s，power4.inOut；金条到达终点迸发 8 粒金色微粒（一次性） */
      const burst = () => {
        const particles = root.querySelectorAll<HTMLElement>('[data-burst-dot]')
        particles.forEach((p, i) => {
          const angle = (i / particles.length) * Math.PI * 2
          const dist = 26 + (i % 3) * 12
          gsap.fromTo(
            p,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0.2,
              duration: 0.9,
              ease: 'power2.out',
            },
          )
        })
      }
      gsap.fromTo('[data-att-bar="gold"]', { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '[data-att-bars]', start: 'top 80%', once: true },
        onComplete: burst,
      })
      gsap.fromTo('[data-att-bar="gray"]', { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.2,
        ease: 'power4.inOut',
        delay: 0.15,
        scrollTrigger: { trigger: '[data-att-bars]', start: 'top 80%', once: true },
      })

      /* 4 格瓷贴 y:50→0, stagger 0.1 */
      gsap.fromTo(
        '[data-att-tile]',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-att-grid]', start: 'top 82%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="attendance" className="relative overflow-hidden bg-obsidian py-24 md:py-36">
      {/* cyan 环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(77,216,255,0.08), transparent 70%)' }}
      />

      <div className="container-x relative">
        <SectionHead
          kickerEn="Attendance"
          kickerZh="上座狂潮"
          title="650 万人，把纪录踩在脚下"
          className="text-center [&>p]:justify-center [&>h2]:text-center"
        />

        {/* 中心大数字舞台 */}
        <div className="text-center">
          <p className="text-gold-gradient font-display text-[clamp(3rem,9vw,7.5rem)] leading-none">
            <span data-big-num>0</span>
          </p>
          <p className="mt-3 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-cyanx">
            Total Attendance / 总上座人数（截至 7/13）
          </p>
          <p className="mx-auto mt-3 max-w-[56ch] text-sm leading-7 text-tx-mid">
            已打破 1994 美国世界杯 358.7 万的历史纪录，超过 2018 + 2022 两届总和
          </p>
        </div>

        {/* 对比横条 */}
        <div data-att-bars className="mx-auto mt-14 max-w-[860px] space-y-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="font-medium text-tx-hi">2026 · 美加墨</span>
              <span className="font-display text-xl text-gold md:text-2xl">
                6,527,410<span className="animate-pulse">+</span>
              </span>
            </div>
            <div className="relative h-4 overflow-visible rounded-full bg-white/5">
              <div
                data-att-bar="gold"
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-gold-deep via-gold to-amber"
              />
              {/* 金条终点微粒迸发 */}
              <div className="pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} data-burst-dot className="absolute h-1.5 w-1.5 rounded-full bg-gold opacity-0" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="text-tx-low">1994 · 美国（原纪录）</span>
              <span className="font-display text-xl text-tx-mid md:text-2xl">3,587,000</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/5">
              <div data-att-bar="gray" className="h-full w-[55%] origin-left rounded-full bg-tx-low/50" />
            </div>
          </div>
        </div>

        {/* 4 格数据瓷贴 */}
        <div data-att-grid className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div data-att-tile className="rounded-[20px] border border-line bg-panel/60 px-6 py-8">
            <OccupancyRing />
          </div>
          <div data-att-tile className="flex items-center justify-center rounded-[20px] border border-line bg-panel/60 px-6 py-8">
            <StatTile value={426834} suffix="" label="单日最高上座" note="6 月 25 日，疯狂的一天" />
          </div>
          <div data-att-tile className="flex items-center justify-center rounded-[20px] border border-line bg-panel/60 px-6 py-8">
            <StatTile value={770} suffix=" 万" label="官方球迷节累计人次" note="球场之外的第二现场" />
          </div>
          <div data-att-tile className="flex items-center justify-center rounded-[20px] border border-line bg-panel/60 px-6 py-8">
            <StatTile value={5.08} decimals={2} suffix=" 亿" label="门票申请" note="对比仅约 700 万张球票" />
          </div>
        </div>
      </div>
    </section>
  )
}
