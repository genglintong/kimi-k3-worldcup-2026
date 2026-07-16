import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import SectionHead from '@/components/SectionHead'

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

const CONTENDERS: Contender[] = [
  { name: '梅西', team: '阿根廷', goals: 8, assists: 4, widthPct: 100, color: '#F5C452', note: '从未拿过金靴，决赛是双重决战', img: '/portrait-messi.png' },
  { name: '姆巴佩', team: '法国', goals: 8, assists: 3, widthPct: 96, color: '#3D9BFF', note: '还有季军战；若卫冕金靴将成史上第一人', img: '/portrait-mbappe.png' },
  { name: '哈兰德', team: '挪威', goals: 7, assists: 0, widthPct: 87, color: '#4DD8FF', note: '已锁定第三', img: '/portrait-haaland.png' },
]

/**
 * S5 金靴之争：三条横向竞速条（ink 底 + 电光绿环境光）。
 * 触发 75%：条形 scaleX 0→1（1.4s，power4.inOut，依次延迟 0.2s），球数滚动计数；
 * 悬停某行其余降至 40% 透明度。
 */
export default function GoldenBoot() {
  const rootRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const navigate = useNavigate()

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
            duration: 1.4,
            delay: i * 0.2,
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
          duration: 1.4,
          delay: i * 0.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v))
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* 电光绿环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(59,255,178,0.08), transparent 70%)' }}
      />

      <div className="container-x relative">
        <SectionHead kickerEn="GOLDEN BOOT" kickerZh="金靴决战" title="8 比 8 比 7，决战最后一天" tone="volt" />

        <div className="flex flex-col gap-8">
          {CONTENDERS.map((c, i) => (
            <div
              key={c.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="transition-opacity duration-300"
              style={{ opacity: hovered === null || hovered === i ? 1 : 0.4 }}
            >
              <div className="mb-3 flex items-center gap-4">
                <img src={c.img} alt={`${c.name}头像`} className="h-12 w-12 rounded-full border border-line object-cover object-top" />
                <div>
                  <p className="font-sans text-lg font-bold text-tx-hi">
                    {c.name}
                    <span className="ml-2 text-sm font-medium text-tx-mid">{c.team}</span>
                  </p>
                  <p className="text-xs text-tx-low">{c.note}</p>
                </div>
                <p className="ml-auto font-display text-3xl leading-none" style={{ color: c.color }}>
                  <span data-boot-goals={c.goals}>0</span>
                  <span className="ml-2 font-sans text-xs font-medium text-tx-mid">
                    球{c.assists > 0 ? ` ${c.assists} 助` : ''}
                  </span>
                </p>
              </div>
              <div className="h-3.5 overflow-hidden rounded-full bg-panel">
                <div
                  data-boot-bar
                  className="h-full origin-left rounded-full"
                  style={{
                    width: `${c.widthPct}%`,
                    background: `linear-gradient(90deg, ${c.color}55, ${c.color})`,
                    boxShadow: `0 0 18px ${c.color}66`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/final')}
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-volt/60 px-7 py-3 font-sans text-sm font-bold text-volt transition-colors hover:bg-volt/10"
        >
          金靴决战全解析
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
