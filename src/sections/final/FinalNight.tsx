import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Music, Users, History } from 'lucide-react'
import SectionHead from '@/components/SectionHead'
import GlowCard from '@/components/GlowCard'
import type { LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Highlight {
  icon: LucideIcon
  title: string
  body: string
  accent: string
  bounce?: boolean
}

const HIGHLIGHTS: Highlight[] = [
  {
    icon: Music,
    title: '超级碗式中场秀',
    body: '世界杯决赛首创，足球与流行文化的历史性碰撞。',
    accent: '#F5C452',
    bounce: true,
  },
  {
    icon: Users,
    title: 'MetLife 之夜',
    body: '82,500 个座位、99.7% 上座率的一届，将迎来最满的一夜。',
    accent: '#4DD8FF',
  },
  {
    icon: History,
    title: '64 年的等待',
    body: '上一次有球队卫冕世界杯冠军还是 1962 年；阿根廷距此只差 90 分钟。',
    accent: '#F5C452',
  },
]

const TRIVIA = [
  '“44 年定律终结” · 1982 年以来，决赛第一次没有拜仁球员',
  '本届 8 名 40+ 球员入选 · 超过此前 22 届总和',
  '奥乔亚 · 首位 6 届世界杯名单成员',
]

const CHIP_TONES = ['#F5C452', '#4DD8FF', '#3BFFB2']

/**
 * S6 决赛之夜看点：3 张 GlowCard + 底部趣闻走马灯。
 * 卡片 y:50→0（stagger 0.12s）；卡 1 音符图标轻微跳动；走马灯 30s 循环、悬停暂停。
 */
export default function FinalNight() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-night-card]'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative bg-ink py-24 md:py-36">
      <div className="container-x">
        <SectionHead
          kickerEn="FINAL NIGHT"
          kickerZh="决赛之夜"
          title="7 月 19 日，看点拉满"
          description="决赛尚未进行，以下看点均来自已确定的赛事安排与历史纪录。"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} data-night-card>
              <GlowCard className="h-full p-7 md:p-8">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                  style={{ borderColor: `${h.accent}55`, background: `${h.accent}14` }}
                >
                  <h.icon
                    className={`h-5 w-5 ${h.bounce ? 'animate-bounce' : ''}`}
                    style={{ color: h.accent, animationDuration: '1.8s' }}
                    aria-hidden
                  />
                </div>
                <h3 className="mt-6 font-sans text-[1.375rem] font-bold leading-[1.3] tracking-[0.01em] text-tx-hi">
                  {h.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-tx-mid">{h.body}</p>
              </GlowCard>
            </div>
          ))}
        </div>

        {/* 趣闻走马灯（30s 循环，悬停暂停） */}
        <div className="marquee-paused mt-16 overflow-hidden border-t border-line pt-10" aria-hidden>
          <div className="animate-marquee flex whitespace-nowrap" style={{ animationDuration: '30s' }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {[0, 1, 2].map((round) => (
                  <div key={round} className="flex items-center">
                    {TRIVIA.map((t, i) => (
                      <span key={t} className="flex items-center">
                        <span
                          className="inline-flex items-center rounded-full border px-4 py-1.5 font-grotesk text-[0.72rem] font-medium uppercase tracking-datalabel"
                          style={{ borderColor: `${CHIP_TONES[i]}55`, color: CHIP_TONES[i] }}
                        >
                          TRIVIA
                        </span>
                        <span className="mx-4 text-sm text-tx-mid">{t}</span>
                        <span className="mr-4 text-tx-low">｜</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
