import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'
import GlowCard from '@/components/GlowCard'
import Tag from '@/components/Tag'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    big: true,
    title: '首届 48 队世界杯',
    body: '12 个小组 + 新增 32 强轮次，104 场比赛、39 天史上最长赛程。',
    tag: '赛制革命',
    tone: 'gold' as const,
  },
  {
    big: false,
    title: '上座狂潮',
    body: '6,527,410 名观众（截至 7/13），超 2018+2022 两届总和；上座率 99.7%。',
    tag: '6.5M+',
    tone: 'cyan' as const,
  },
  {
    big: false,
    title: '进球风暴',
    body: '小组赛 72 场轰 215 球（场均 2.99，1950 年代以来最高），小组赛进球已超 2022 整届。',
    tag: '215 球',
    tone: 'volt' as const,
  },
  {
    big: false,
    title: '商业新纪元',
    body: 'FIFA 收入预计超 110 亿美元；200 亿+ 次视频观看；决赛首创“超级碗式”中场秀。',
    tag: '$11B+',
    tone: 'gold' as const,
  },
]

/** S3 本届之最：4 张 GlowCard，桌面 2×2（首卡跨 2 列），点击 → /milestones */
export default function TournamentBest() {
  const rootRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-best-card]'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="container-x py-24 md:py-36">
      <SectionHead kickerEn="TOURNAMENT" kickerZh="赛事之最" title="一届改写历史的世界杯" />
      <div className="grid gap-6 md:grid-cols-2">
        {CARDS.map((card) => (
          <div key={card.title} data-best-card className={card.big ? 'md:col-span-2' : ''}>
            <GlowCard className="h-full p-8 md:p-10" onClick={() => navigate('/milestones')}>
              <div className="flex items-start justify-between gap-4">
                <h3 className={`font-sans font-bold leading-[1.3] text-tx-hi ${card.big ? 'text-2xl md:text-3xl' : 'text-[1.375rem]'}`}>
                  {card.title}
                </h3>
                <Tag tone={card.tone}>{card.tag}</Tag>
              </div>
              <p className="mt-4 max-w-[62ch] text-sm leading-7 text-tx-mid md:text-base">{card.body}</p>
              <p className="mt-6 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                查看赛事里程碑 →
              </p>
            </GlowCard>
          </div>
        ))}
      </div>
    </section>
  )
}
