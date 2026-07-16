import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Medal, CalendarClock, MapPin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STORY_POINTS = [
  '德尚告别战——26 场，执教世界杯场次最多的主帅；赛后齐达内接任。',
  '姆巴佩的最后机会：8 球 3 助，卫冕金靴在此一搏。',
]

/**
 * S5 季军战卡（单场预告，金铜色调）：半宽横卡，铜金描边 #CD7F32。
 * 卡片 y:60→0、rotateX 6°→0（1s）；铜金描边光泽流动（4s 循环）；
 * 故事点 x:30→0（stagger 0.15s）。
 */
export default function ThirdPlace() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelector('[data-tp-card]'),
        { y: 60, rotateX: 6, opacity: 0, transformPerspective: 900 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        },
      )
      /* 铜金描边光泽流动（4s 循环） */
      gsap.fromTo(
        root.querySelector('[data-tp-shine]'),
        { backgroundPosition: '-120% 0' },
        { backgroundPosition: '220% 0', duration: 4, repeat: -1, ease: 'none' },
      )
      gsap.fromTo(
        root.querySelectorAll('[data-tp-point]'),
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative bg-obsidian py-24 md:py-36">
      <div className="container-x flex justify-center">
        <div
          data-tp-card
          className="relative w-full max-w-[920px] overflow-hidden rounded-[24px] border bg-panel/80 backdrop-blur will-change-transform"
          style={{
            borderColor: 'rgba(205,127,50,0.55)',
            boxShadow: '0 0 44px rgba(205,127,50,0.12)',
          }}
        >
          {/* 铜金流光 */}
          <div
            data-tp-shine
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, transparent 35%, rgba(205,127,50,0.22) 48%, rgba(245,196,82,0.28) 52%, rgba(205,127,50,0.22) 56%, transparent 70%)',
              backgroundSize: '220% 100%',
            }}
          />
          {/* 顶部铜金径向光 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(600px 260px at 50% -10%, rgba(205,127,50,0.14), transparent)' }}
          />

          <div className="relative grid gap-10 p-8 md:grid-cols-[1fr_1.1fr] md:gap-12 md:p-12">
            {/* 左：标题 + 信息 */}
            <div>
              <p className="flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker" style={{ color: '#CD7F32' }}>
                <span className="inline-block h-0.5 w-6" style={{ background: '#CD7F32' }} aria-hidden />
                THIRD PLACE
                <span className="text-tx-low">/ 季军战</span>
              </p>
              <h3 className="mt-5 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.15] text-tx-hi">
                法国 <span className="font-display text-gold">vs</span> 英格兰
              </h3>
              <div className="mt-6 space-y-2.5 text-sm text-tx-mid">
                <p className="flex items-center gap-2.5">
                  <CalendarClock className="h-4 w-4 shrink-0" style={{ color: '#CD7F32' }} aria-hidden />
                  7月18日 17:00 ET（北京时间 7/19 凌晨 5:00）
                </p>
                <p className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: '#CD7F32' }} aria-hidden />
                  迈阿密硬石体育场
                </p>
                <p className="flex items-center gap-2.5">
                  <Medal className="h-4 w-4 shrink-0" style={{ color: '#CD7F32' }} aria-hidden />
                  铜牌争夺战 · 两队均止步半决赛
                </p>
              </div>
            </div>

            {/* 右：故事点 */}
            <div className="flex flex-col justify-center gap-5">
              {STORY_POINTS.map((point, i) => (
                <div
                  key={i}
                  data-tp-point
                  className="rounded-2xl border border-line bg-obsidian/60 p-5"
                  style={{ borderLeft: '3px solid rgba(205,127,50,0.7)' }}
                >
                  <p className="text-sm leading-7 text-tx-hi md:text-[0.9375rem]">{point}</p>
                </div>
              ))}
              <p className="text-xs text-tx-low">季军战为前瞻内容，尚未进行。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
