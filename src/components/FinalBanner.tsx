import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * 各页底部共用 CTA：决赛对决渐变边缘横幅。
 * 中缝光刃呼吸（2.4s 循环）；标题双色分别从左右滑入；
 * 入场 scale 0.96 → 1；点击 → /final。
 */
export default function FinalBanner() {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        },
      )
      gsap.fromTo(
        root.querySelector('[data-duel-left]'),
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        },
      )
      gsap.fromTo(
        root.querySelector('[data-duel-right]'),
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="container-x py-24">
      <div
        ref={rootRef}
        data-cursor
        onClick={() => navigate('/final')}
        className="relative cursor-pointer overflow-hidden rounded-[28px] border border-line bg-ink px-6 py-16 text-center md:py-24"
      >
        {/* 左红 / 右蓝渐变边缘 + 中缝光刃 */}
        <div aria-hidden className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-espana/25 to-transparent" />
        <div aria-hidden className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-albiceleste/25 to-transparent" />
        <div
          aria-hidden
          className="animate-blade-breathe absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold to-transparent"
        />

        <div className="relative">
          <p className="font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">
            <span className="mr-3 inline-block h-0.5 w-6 translate-y-[-3px] bg-gold" aria-hidden />
            THE FINAL / 决赛前瞻
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-[0.01em]">
            <span data-duel-left className="inline-block text-espana">西班牙</span>
            <span className="mx-4 inline-block text-tx-low md:mx-6">VS</span>
            <span data-duel-right className="inline-block text-albiceleste">阿根廷</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[68ch] text-sm leading-7 text-tx-mid md:text-base">
            7月19日 15:00 ET（北京时间 7/20 凌晨 3:00）· MetLife 体育场 · 两队史上首次在决赛相遇
          </p>
          <button
            type="button"
            className="btn-shine mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-sm font-bold text-obsidian transition-transform duration-300 hover:scale-[1.04]"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/final')
            }}
          >
            进入巅峰对决
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
