import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScorePill from '@/components/ScorePill'

gsap.registerPlugin(ScrollTrigger)

const JORDAN_RESULTS = [
  { home: '约旦', away: '奥地利', homeScore: 1, awayScore: 3 },
  { home: '约旦', away: '阿尔及利亚', homeScore: 1, awayScore: 2 },
  { home: '约旦', away: '阿根廷', homeScore: 1, awayScore: 3 },
]

/**
 * S4 约旦 × 乌兹别克斯坦：两张并列半宽卡。
 * 双卡 y:80→0 stagger 0.2s（1s）；约旦战报条逐条 x:-30→0；
 * 「22年183天」数字滚动组装（年 / 天两段分别计数）。
 */
export default function JordanUzbekCards() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 双卡入场：y:80→0，stagger 0.2s，1s */
      gsap.fromTo('[data-ju="card"]', { y: 80, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
      })
      /* 约旦战报条逐条 x:-30→0 */
      gsap.fromTo('[data-ju="jrow"]', { x: -30, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '[data-ju="jrows"]', start: 'top 85%', once: true },
      })
      /* 「22年183天」两段分别计数 */
      const years = root.querySelector<HTMLElement>('[data-ju="years"]')
      const days = root.querySelector<HTMLElement>('[data-ju="days"]')
      if (years && days) {
        const yCounter = { v: 0 }
        const dCounter = { v: 0 }
        gsap.to(yCounter, {
          v: 22,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-ju="age"]', start: 'top 85%', once: true },
          onUpdate: () => {
            years.textContent = String(Math.round(yCounter.v))
          },
        })
        gsap.to(dCounter, {
          v: 183,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-ju="age"]', start: 'top 85%', once: true },
          onUpdate: () => {
            days.textContent = String(Math.round(dCounter.v))
          },
        })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* 电光绿环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[480px] w-[480px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(59,255,178,0.06), transparent 70%)' }}
      />

      <div className="container-x relative">
        <div className="grid gap-6 md:grid-cols-2">
          {/* 卡 A · 约旦（红白） */}
          <div data-ju="card">
            <article className="group h-full overflow-hidden rounded-[20px] border border-line bg-panel transition-all duration-300 hover:-translate-y-1.5 hover:border-volt/40">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src="/newcomer-jordan.png"
                  alt="约旦沙漠骑士红白战袍劲射破门的插画"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-sans text-[1.375rem] font-bold leading-[1.3] tracking-[0.01em] text-tx-hi">
                  约旦：三战皆墨，场场进球
                </h3>
                <div data-ju="jrows" className="mt-6 flex flex-col items-start gap-2.5">
                  {JORDAN_RESULTS.map((r) => (
                    <div key={r.away} data-ju="jrow">
                      <ScorePill home={r.home} away={r.away} homeScore={r.homeScore} awayScore={r.awayScore} />
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-tx-mid">
                  没有积分，但<span className="font-bold text-volt">没有一场空手而归</span>
                  ——包括对阿根廷。新军的尊严，写在每一次破门里。
                </p>
              </div>
            </article>
          </div>

          {/* 卡 B · 乌兹别克斯坦（白蓝） */}
          <div data-ju="card">
            <article className="group h-full overflow-hidden rounded-[20px] border border-line bg-panel transition-all duration-300 hover:-translate-y-1.5 hover:border-volt/40">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src="/newcomer-uzbekistan.png"
                  alt="乌兹别克斯坦 18 岁小将与 41 岁 C 罗并肩站在中圈的插画"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-sans text-[1.375rem] font-bold leading-[1.3] tracking-[0.01em] text-tx-hi">
                  乌兹别克斯坦：首球与同框
                </h3>
                <p className="mt-6 text-sm leading-7 text-tx-mid">
                  Fayzullaev 打进队史世界杯首球（1-3 哥伦比亚）；18 岁的 Karimov 与 41 岁的 C
                  罗同场首发——22 年 183 天，世界杯首发最大年龄差。
                </p>

                {/* 大数字装置：22年183天（Anton，volt） */}
                <div data-ju="age" className="mt-8">
                  <p className="font-display text-[clamp(2.75rem,5vw,4rem)] leading-none text-volt">
                    <span data-ju="years">0</span>
                    <span className="mx-1.5 font-sans text-[0.45em] font-bold">年</span>
                    <span data-ju="days">0</span>
                    <span className="ml-1.5 font-sans text-[0.45em] font-bold">天</span>
                  </p>
                  <p className="mt-3 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-volt">
                    Max age gap · 同场首发最大年龄差
                  </p>
                  <p className="mt-2 text-xs leading-6 text-tx-low">
                    C 罗 41 岁 × Karimov 18 岁 · 统计截至 2026-07-16
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
