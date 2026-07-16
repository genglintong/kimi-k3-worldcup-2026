import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Tag from '@/components/Tag'

gsap.registerPlugin(ScrollTrigger)

const TAGS = ['人口约 15 万', '史上最小参赛国', '预选赛 10 场不败出线']

/**
 * S2 库拉索大专题卡（国旗蓝主题）：左图（55%）右文。
 * 图片 clip-path inset(0 100% 0 0 → 0) 1.2s 揭幕（trigger 75%）；
 * Tag scale 0→1 stagger 0.08 back.out；大数字「15」计数器 + 完成瞬间 volt 光脉冲；
 * 悬停图片 scale 1.03。
 */
export default function CuracaoFeature() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 图片揭幕：clip-path inset(0 100% 0 0 → 0)，1.2s，trigger 75% */
      gsap.fromTo(
        '[data-cur="img"]',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '[data-cur="img"]', start: 'top 75%', once: true },
        },
      )
      /* Tag scale 0→1，stagger 0.08，back.out */
      gsap.fromTo('[data-cur="tag"]', { scale: 0 }, {
        scale: 1,
        duration: 0.55,
        ease: 'back.out(1.7)',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-cur="tags"]', start: 'top 80%', once: true },
      })
      /* 文本块渐入 */
      gsap.fromTo('[data-cur="fade"]', { y: 28, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-cur="body"]', start: 'top 78%', once: true },
      })
      /* 大数字 15 计数器 + 数字完成瞬间 volt 光脉冲 */
      const num = root.querySelector<HTMLElement>('[data-cur="num"]')
      const pulse = root.querySelector<HTMLElement>('[data-cur="pulse"]')
      if (num) {
        const counter = { v: 0 }
        gsap.to(counter, {
          v: 15,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-cur="stat"]', start: 'top 78%', once: true },
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v))
          },
          onComplete: () => {
            if (pulse) {
              gsap.fromTo(
                pulse,
                { opacity: 0.85, scale: 0.5 },
                { opacity: 0, scale: 2.6, duration: 1, ease: 'power2.out' },
              )
            }
          },
        })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* 国旗蓝 / 电光绿环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(46,124,214,0.10), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(59,255,178,0.06), transparent 70%)' }}
      />

      <div className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16">
          {/* 左图（55% 宽，圆角 24px，描边 volt/20） */}
          <div data-cur="img" className="overflow-hidden rounded-[24px] border border-volt/20">
            <img
              src="/newcomer-curacao.png"
              alt="库拉索门将 Eloy Room 飞身单掌托出必进球的插画"
              className="aspect-[16/9] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </div>

          {/* 右文 */}
          <div data-cur="body">
            <div data-cur="tags" className="flex flex-wrap gap-2.5">
              {TAGS.map((t) => (
                <span key={t} data-cur="tag" className="inline-block">
                  <Tag tone="volt">{t}</Tag>
                </span>
              ))}
            </div>

            <h2
              data-cur="fade"
              className="mt-7 font-sans text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.15] tracking-[0.02em] text-tx-hi"
            >
              库拉索：15 万人口的加勒比奇迹
            </h2>

            <p data-cur="fade" className="mt-6 text-base leading-[1.85] text-tx-mid">
              36 岁门将 Eloy Room 对厄瓜多尔单场 <span className="font-bold text-volt">15 次扑救</span>
              ——1966 年有统计以来世界杯常规时间单场扑救纪录，为小岛带来队史第一个世界杯积分（0-0）。
            </p>

            <p data-cur="fade" className="mt-4 text-sm leading-7 text-tx-low">
              小组赛末战 1-7 负德国，是本届最大比分——奇迹与学费，都是历史的一部分。
            </p>

            {/* 大数字装置：15（Anton 巨号 volt 色）+ 单场扑救 · 世界杯纪录 */}
            <div data-cur="stat" className="mt-10">
              <div className="relative inline-block">
                <div
                  data-cur="pulse"
                  aria-hidden
                  className="absolute inset-[-30%] rounded-full opacity-0"
                  style={{ background: 'radial-gradient(circle, rgba(59,255,178,0.5), transparent 70%)' }}
                />
                <p className="relative font-display text-[clamp(5.5rem,11vw,9rem)] leading-none text-volt">
                  <span data-cur="num">0</span>
                </p>
              </div>
              <p className="mt-3 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-volt">
                Single-match saves · 单场扑救 · 世界杯纪录
              </p>
              <p className="mt-2 text-xs leading-6 text-tx-low">
                1966 年有统计以来常规时间单场扑救之最 · 统计截至 2026-07-16
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
