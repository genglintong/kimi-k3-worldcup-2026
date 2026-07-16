import { memo, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'
import GlowCard from '@/components/GlowCard'

gsap.registerPlugin(ScrollTrigger)

/** 迷你「维京战船」几何图标：循环摇摆（rotate ±6°，2s 周期）。隔离为 memo 微组件。 */
const VikingShip = memo(function VikingShip() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { rotate: -6 },
      { rotate: 6, duration: 1, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 65%' },
    )
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 72 48" className="h-12 w-[72px]" aria-hidden>
      {/* 帆（金色三角） */}
      <path d="M36 4 L36 26" stroke="#F5C452" strokeWidth="2" />
      <path d="M38 6 L58 24 L38 24 Z" fill="#F5C452" opacity="0.9" />
      <path d="M34 8 L20 24 L34 24 Z" fill="#3BFFB2" opacity="0.55" />
      {/* 船体 */}
      <path d="M6 30 Q36 46 66 30 L58 26 L14 26 Z" fill="#F5C452" />
      {/* 龙头 / 船尾 */}
      <path d="M6 30 L2 22 L10 26 Z" fill="#D9A03B" />
      <path d="M66 30 L70 22 L62 26 Z" fill="#D9A03B" />
      {/* 盾牌 */}
      <circle cx="24" cy="31" r="3" fill="#04060F" stroke="#3BFFB2" strokeWidth="1.4" />
      <circle cx="36" cy="32.5" r="3" fill="#04060F" stroke="#3BFFB2" strokeWidth="1.4" />
      <circle cx="48" cy="31" r="3" fill="#04060F" stroke="#3BFFB2" strokeWidth="1.4" />
    </svg>
  )
})

interface BizCard {
  value?: number
  prefix?: string
  suffix?: string
  staticText?: string
  label: string
  note: string
  ship?: boolean
}

const CARDS: BizCard[] = [
  { value: 110, prefix: '$', suffix: '亿+', label: 'FIFA 预计收入', note: '历史之最——世界杯商业收入的新巅峰' },
  { value: 200, suffix: '亿+', label: '视频观看次数', note: '全平台曝光超 300 亿次' },
  {
    value: 17,
    suffix: '亿',
    label: '社媒互动',
    note: '最火内容：挪威「维京战船」庆祝（TikTok 1.74 亿播放）',
    ship: true,
  },
  { staticText: '首次', label: '决赛中场秀', note: '决赛将上演「超级碗式」中场秀' },
]

/**
 * S6 商业与传播新纪元：4 张 GlowCard（2×2）。
 * 入场 y:60→0, rotateX 8°→0, stagger 0.12s；数字计数器；卡 3 内嵌战船图标摇摆。
 */
export default function Business() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 卡片入场：y:60→0, rotateX 8°→0, stagger 0.12s, 0.9s */
      gsap.fromTo(
        '[data-biz-card]',
        { y: 60, opacity: 0, rotateX: 8, transformPerspective: 900 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          transformPerspective: 900,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      )
      /* 数字计数器 */
      root.querySelectorAll<HTMLElement>('[data-biz-num]').forEach((el) => {
        const target = Number(el.dataset.bizNum)
        const prefix = el.dataset.prefix ?? ''
        const suffix = el.dataset.suffix ?? ''
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.v)}${suffix}`
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative bg-ink py-24 md:py-36">
      <div className="container-x">
        <SectionHead kickerEn="Business" kickerZh="商业新纪元" title="球场之外，同样是历史级" />

        <div className="grid gap-6 md:grid-cols-2">
          {CARDS.map((card) => (
            <div key={card.label} data-biz-card className="will-change-transform">
              <GlowCard className="h-full">
                <div className="flex h-full flex-col p-8 md:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-gold-gradient font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none">
                      {card.value !== undefined ? (
                        <span data-biz-num={card.value} data-prefix={card.prefix ?? ''} data-suffix={card.suffix ?? ''}>
                          {card.prefix ?? ''}0{card.suffix ?? ''}
                        </span>
                      ) : (
                        card.staticText
                      )}
                    </p>
                    {card.ship && (
                      <div className="mt-2 shrink-0">
                        <VikingShip />
                      </div>
                    )}
                  </div>
                  <p className="mt-5 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-gold">
                    {card.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-tx-mid">{card.note}</p>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
