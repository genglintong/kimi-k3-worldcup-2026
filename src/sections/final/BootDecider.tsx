import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'
import { STATS_AS_OF } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

interface Contender {
  name: string
  team: string
  goals: number
  assists: number
  widthPct: number
  color: string
  note: string
  img: string
}

/** 与首页 S5 同一数据口径（截至 2026-07-16） */
const CONTENDERS: Contender[] = [
  { name: '梅西', team: '阿根廷', goals: 8, assists: 4, widthPct: 100, color: '#F5C452', note: '领跑。从未拿过金靴，这是最后的机会', img: '/portrait-messi.png' },
  { name: '姆巴佩', team: '法国', goals: 8, assists: 3, widthPct: 96, color: '#3D9BFF', note: '还有季军战可踢；若卫冕金靴，史上第一人', img: '/portrait-mbappe.png' },
  { name: '哈兰德', team: '挪威', goals: 7, assists: 0, widthPct: 87, color: '#4DD8FF', note: '已锁定第三', img: '/portrait-haaland.png' },
]

/**
 * S3 金靴决战（数据竞速）：obsidian + 金色环境光。
 * 条形 scaleX 0→1（1.6s，power4.inOut，stagger 0.25s）；球数滚动计数；
 * 条末端光点呼吸；悬停某行其余降至 40% 透明度。
 */
export default function BootDecider() {
  const rootRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-boot-bar]').forEach((bar, i) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.6,
            delay: i * 0.25,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: root, start: 'top 75%', once: true },
          },
        )
      })
      root.querySelectorAll<HTMLElement>('[data-boot-goals]').forEach((el, i) => {
        const target = Number(el.dataset.bootGoals)
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          delay: i * 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v))
          },
        })
      })
      /* 底部注释带 */
      gsap.fromTo(
        root.querySelector('[data-boot-note]'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 65%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-obsidian py-24 md:py-36">
      {/* 金色环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(245,196,82,0.09), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(217,160,59,0.07), transparent 70%)' }}
      />

      <div className="container-x relative">
        <SectionHead
          kickerEn="GOLDEN BOOT DECIDER"
          kickerZh="金靴决战"
          title="最后一天，三个人，一只金靴"
          description={`金靴悬念保留到最后一刻——决赛与季军战都可能改写排序。统计${STATS_AS_OF}。`}
        />

        <div className="flex flex-col gap-8 md:gap-10">
          {CONTENDERS.map((c, i) => (
            <div
              key={c.name}
              data-cursor
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="transition-opacity duration-300"
              style={{ opacity: hovered === null || hovered === i ? 1 : 0.4 }}
            >
              <div className="mb-3 flex items-center gap-4">
                <img
                  src={c.img}
                  alt={`${c.name}头像`}
                  className="h-12 w-12 rounded-full border border-line object-cover object-top md:h-14 md:w-14"
                  style={{ boxShadow: `0 0 20px ${c.color}44` }}
                />
                <div>
                  <p className="font-sans text-lg font-bold text-tx-hi">
                    {c.name}
                    <span className="ml-2 text-sm font-medium text-tx-mid">{c.team}</span>
                  </p>
                  <p className="text-xs text-tx-low">{c.note}</p>
                </div>
                <p className="ml-auto font-display text-3xl leading-none md:text-4xl" style={{ color: c.color }}>
                  <span data-boot-goals={c.goals}>0</span>
                  <span className="ml-2 font-sans text-xs font-medium text-tx-mid">
                    球{c.assists > 0 ? ` ${c.assists} 助` : ''}
                  </span>
                </p>
              </div>
              <div className="h-3.5 overflow-hidden rounded-full bg-panel">
                <div
                  data-boot-bar
                  className="relative h-full origin-left rounded-full"
                  style={{
                    width: `${c.widthPct}%`,
                    background: `linear-gradient(90deg, ${c.color}55, ${c.color})`,
                    boxShadow: `0 0 18px ${c.color}66`,
                  }}
                >
                  {/* 条末端光点呼吸 */}
                  <span
                    aria-hidden
                    className="absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 animate-pulse rounded-full"
                    style={{ background: c.color, boxShadow: `0 0 14px 3px ${c.color}` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部注释带 */}
        <div data-boot-note className="mt-12 rounded-2xl border border-gold/20 bg-panel/60 px-6 py-5 backdrop-blur">
          <p className="text-sm leading-7 text-tx-mid">
            <span className="font-sans font-bold text-gold">决胜变量：</span>
            助攻数是金靴同球决胜的关键变量——梅西 4 助、姆巴佩 3 助。
            <span className="ml-2 font-grotesk text-[0.65rem] uppercase tracking-datalabel text-tx-low">
              {STATS_AS_OF}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
