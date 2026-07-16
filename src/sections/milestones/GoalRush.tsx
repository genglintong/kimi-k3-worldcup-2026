import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'
import Tag from '@/components/Tag'

gsap.registerPlugin(ScrollTrigger)

const DONUT_R = 80
const DONUT_C = 2 * Math.PI * DONUT_R
const SUB_RATIO = 0.186
const SURPASS_MARK = 172 / 215 // volt 条经过 172 刻度 ≈ 80%

/**
 * S5 进球风暴（volt 电光绿主题）。
 * 左：巨数 215（计数 + 每跳 20 球微震，仅前 1s）+ 对比条（volt 经过 172 刻度闪「超越」印章）；
 * 右：环形图（替补 50 球 · 18.6%）；底部金色 Tag 时间刻度。
 */
export default function GoalRush() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* —— 巨数 215：计数 + 每跳 20 球屏幕微震（0.5px，仅前 1s） —— */
      const numEl = root.querySelector<HTMLElement>('[data-goal-num]')
      const stage = root.querySelector<HTMLElement>('[data-goal-stage]')
      if (numEl) {
        const counter = { v: 0 }
        const startedAt = { t: 0 }
        let lastTick = 0
        gsap.to(counter, {
          v: 215,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: numEl, start: 'top 75%', once: true },
          onStart: () => {
            startedAt.t = performance.now()
          },
          onUpdate: () => {
            numEl.textContent = String(Math.round(counter.v))
            const tick = Math.floor(counter.v / 20)
            if (tick > lastTick && performance.now() - startedAt.t < 1000 && stage) {
              lastTick = tick
              gsap.fromTo(stage, { x: -0.5 }, { x: 0, duration: 0.12, ease: 'power1.out' })
            }
          },
        })
      }

      /* —— volt 对比条：经过 172 刻度时闪「超越」印章 —— */
      let stampFired = false
      const fireStamp = () => {
        if (stampFired) return
        stampFired = true
        const stamp = root.querySelector('[data-stamp]')
        if (stamp) {
          gsap.fromTo(
            stamp,
            { opacity: 0, scale: 1.2, rotate: -8 },
            { opacity: 1, scale: 1, rotate: -8, duration: 0.35, ease: 'back.out(2)' },
          )
        }
      }
      const voltBar = gsap.fromTo('[data-goal-bar="volt"]', { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.4,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '[data-goal-bars]', start: 'top 80%', once: true },
        onUpdate: () => {
          if (voltBar.progress() >= SURPASS_MARK) fireStamp()
        },
      })
      gsap.fromTo('[data-goal-bar="gray"]', { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.4,
        ease: 'power4.inOut',
        delay: 0.15,
        scrollTrigger: { trigger: '[data-goal-bars]', start: 'top 80%', once: true },
      })

      /* —— 环形图描边 1.4s + 百分比计数 —— */
      const arc = root.querySelector<SVGCircleElement>('[data-donut-arc]')
      if (arc) {
        gsap.fromTo(
          arc,
          { strokeDashoffset: DONUT_C },
          {
            strokeDashoffset: DONUT_C * (1 - SUB_RATIO),
            duration: 1.4,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: '[data-donut]', start: 'top 78%', once: true },
          },
        )
      }
      const pctEl = root.querySelector<HTMLElement>('[data-donut-pct]')
      if (pctEl) {
        const counter = { v: 0 }
        gsap.to(counter, {
          v: 18.6,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-donut]', start: 'top 78%', once: true },
          onUpdate: () => {
            pctEl.textContent = `${counter.v.toFixed(1)}%`
          },
        })
      }

      /* —— 时间刻度 Tag：scale 0→1, back.out —— */
      gsap.fromTo(
        '[data-goal-tag]',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '[data-goal-tag]', start: 'top 88%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-obsidian py-24 md:py-36">
      {/* 电光绿环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(59,255,178,0.07), transparent 70%)' }}
      />

      <div className="container-x relative">
        <SectionHead kickerEn="Goal Rush" kickerZh="进球风暴" title="进球，像雨一样下" tone="volt" />

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* 左：巨数 215 + 对比条 */}
          <div data-goal-stage>
            <p className="font-display text-[clamp(4.5rem,12vw,9rem)] leading-none text-volt drop-shadow-[0_0_36px_rgba(59,255,178,0.35)]">
              <span data-goal-num>0</span>
            </p>
            <p className="mt-3 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-volt">
              Group-stage Goals / 小组赛进球
            </p>
            <p className="mt-3 max-w-[48ch] text-sm leading-7 text-tx-mid md:text-base md:leading-8">
              小组赛 72 场 215 球，场均 2.99——1950 年代以来最高
            </p>

            <div data-goal-bars className="relative mt-10 space-y-6">
              {/* 「超越」印章：位于 172 刻度（volt 条 80% 处） */}
              <div className="absolute -top-9 z-10 -translate-x-1/2" style={{ left: `${SURPASS_MARK * 100}%` }}>
                <div
                  data-stamp
                  className="rounded-lg border border-volt/60 bg-obsidian/90 px-3 py-1 font-sans text-xs font-bold text-volt opacity-0"
                >
                  超越
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between text-sm">
                  <span className="font-medium text-tx-hi">2026 · 小组赛</span>
                  <span className="font-display text-xl text-volt md:text-2xl">215 球</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-white/5">
                  <div
                    data-goal-bar="volt"
                    className="h-full w-full origin-left rounded-full bg-gradient-to-r from-volt/70 via-volt to-volt"
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between text-sm">
                  <span className="text-tx-low">2022 · 整届</span>
                  <span className="font-display text-xl text-tx-mid md:text-2xl">172 球</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-white/5">
                  <div data-goal-bar="gray" className="h-full w-[80%] origin-left rounded-full bg-tx-low/50" />
                </div>
              </div>
            </div>
          </div>

          {/* 右：环形图 */}
          <div data-donut className="flex flex-col items-center">
            <div className="relative h-[240px] w-[240px]">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle cx="100" cy="100" r={DONUT_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
                <circle
                  data-donut-arc
                  cx="100"
                  cy="100"
                  r={DONUT_R}
                  fill="none"
                  stroke="#3BFFB2"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={DONUT_C}
                  strokeDashoffset={DONUT_C}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span data-donut-pct className="font-display text-5xl text-volt">
                  0%
                </span>
                <span className="mt-2 text-sm text-tx-mid">替补打进 50 球</span>
              </div>
            </div>
            <p className="mt-6 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-volt">
              Super Subs / 替补奇兵
            </p>
            <p className="mt-2 text-center text-sm leading-7 text-tx-mid">截至 1/4 决赛，总进球约 268 球</p>
          </div>
        </div>

        {/* 底部里程碑时间刻度 */}
        <div className="mt-16 flex justify-center">
          <span data-goal-tag className="inline-block">
            <Tag tone="gold" className="px-5 py-2">
              6/25–26 · 总进球破 173 球 → 创单届历史纪录
            </Tag>
          </span>
        </div>
      </div>
    </section>
  )
}
