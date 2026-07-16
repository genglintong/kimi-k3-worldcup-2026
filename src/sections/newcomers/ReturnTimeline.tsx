import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'

gsap.registerPlugin(ScrollTrigger)

interface ReturnNode {
  /** 等待年数；意大利为缺席节点，无年数 */
  years: number | null
  team: string
  note: string
  absent?: boolean
}

const NODES: ReturnNode[] = [
  { years: 52, team: '民主刚果', note: '时隔 52 年重返，并拿下队史世界杯首胜 + 首次出线' },
  { years: 52, team: '海地', note: '时隔 52 年重返世界杯' },
  { years: 28, team: '苏格兰', note: '时隔 28 年重返' },
  { years: 28, team: '挪威', note: '时隔 28 年重返，并一路杀进八强' },
  { years: null, team: '意大利', note: '连续第三届无缘世界杯', absent: true },
]

/**
 * S5 情怀回归带：横向时间轴（年份刻度）+ 5 个节点卡（移动端降级为竖向时间轴）。
 * 时间轴横线 scaleX 0→1（1.6s）；节点 scale 0→1 stagger 0.15s back.out(1.8)；
 * 年份巨数计数；意大利节点灰化 + 轻微抖动入场；悬停节点卡上浮 8px。
 */
export default function ReturnTimeline() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '[data-rt="wrap"]', start: 'top 80%', once: true },
      })
      /* 时间轴横线 scaleX 0→1（移动端为竖线 scaleY） */
      tl.fromTo('[data-rt="line"]', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power3.inOut' }, 0).fromTo(
        '[data-rt="vline"]',
        { scaleY: 0 },
        { scaleY: 1, duration: 1.6, ease: 'power3.inOut' },
        0,
      )
      /* 节点 scale 0→1，stagger 0.15s，back.out(1.8) */
      tl.fromTo(
        '[data-rt="node"]',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.15 },
        0.25,
      )
      /* 年份巨数计数（随各自节点入场启动） */
      root.querySelectorAll<HTMLElement>('[data-rt="years"]').forEach((el, i) => {
        const target = Number(el.dataset.target ?? 0)
        const counter = { v: 0 }
        tl.to(
          counter,
          {
            v: target,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v))
            },
          },
          0.4 + i * 0.15,
        )
      })
      /* 意大利节点：灰化 + 轻微抖动入场（唏嘘）；结束后清理 transform，避免压住悬停上浮 */
      const italy = root.querySelector('[data-rt="italy"]')
      if (italy) {
        const p = 0.25 + 4 * 0.15 + 0.7
        tl.to(italy, { x: -5, duration: 0.07 }, p)
          .to(italy, { x: 4, duration: 0.09 })
          .to(italy, { x: -3, duration: 0.08 })
          .to(italy, { x: 2, duration: 0.08 })
          .to(italy, { x: 0, duration: 0.12 })
          .set(italy, { clearProps: 'transform' })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden py-24 md:py-36">
      {/* 金色环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(245,196,82,0.06), transparent 70%)' }}
      />

      <div className="container-x relative">
        <SectionHead kickerEn="THE RETURN" kickerZh="情怀回归" title="有人等了半个世纪" tone="volt" />

        <div data-rt="wrap" className="relative">
          {/* 桌面横向时间轴线 */}
          <div
            data-rt="line"
            aria-hidden
            className="absolute left-0 top-[7px] hidden h-[2px] w-full origin-left rounded bg-gradient-to-r from-volt via-gold/70 to-tx-low/30 lg:block"
          />
          {/* 移动端竖向时间轴线 */}
          <div
            data-rt="vline"
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-[2px] origin-top rounded bg-gradient-to-b from-volt via-gold/70 to-tx-low/30 lg:hidden"
          />

          <ol className="grid gap-8 lg:grid-cols-5 lg:gap-6">
            {NODES.map((n) => (
              <li key={n.team} data-rt="node" className="relative pl-9 lg:pl-0 lg:pt-12">
                {/* 刻度圆点 */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-[3px] h-[15px] w-[15px] rounded-full border-2 lg:top-0 ${
                    n.absent ? 'border-tx-low/60 bg-panel' : 'border-volt bg-volt/25 shadow-volt-glow'
                  }`}
                />
                {n.absent ? (
                  /* 意大利：灰色节点（与金色节点对比） */
                  <div
                    data-rt="italy"
                    className="rounded-2xl border border-line bg-panel/60 p-5 transition-transform duration-300 hover:-translate-y-2"
                  >
                    <p className="font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none text-tx-low">缺席</p>
                    <h3 className="mt-3 font-sans text-lg font-bold text-tx-low">{n.team}</h3>
                    <p className="mt-2 text-sm leading-6 text-tx-low">{n.note}</p>
                  </div>
                ) : (
                  /* 回归节点：金色年份巨数 + 计数 */
                  <div className="rounded-2xl border border-line bg-panel p-5 transition-all duration-300 hover:-translate-y-2 hover:border-gold/40">
                    <p className="font-display text-[clamp(2.5rem,4.5vw,3.75rem)] leading-none">
                      <span className="text-gold-gradient" data-rt="years" data-target={n.years ?? 0}>
                        0
                      </span>
                      <span className="ml-1 font-sans text-lg font-bold text-gold">年</span>
                    </p>
                    <h3 className="mt-3 font-sans text-lg font-bold text-tx-hi">{n.team}</h3>
                    <p className="mt-2 text-sm leading-6 text-tx-mid">{n.note}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 text-xs leading-6 text-tx-low">回归与缺席 · 统计截至 2026-07-16</p>
      </div>
    </section>
  )
}
