import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * S8 下一章 CTA：「下一章 · 巨星里程碑」+「纪录是人创造的」（金色 H2）+ 按钮 → /legends。
 * 文字 y:40→0；按钮悬停箭头 x:+6px 循环。
 */
export default function NextChapter() {
  const rootRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-nc]',
        { y: 40, opacity: 0 },
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
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* 顶部金色微光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <style>{`@keyframes milestones-arrow-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }`}</style>

      <div className="container-x text-center">
        <p data-nc className="flex items-center justify-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
          Next Chapter
          <span className="text-tx-low">/ 下一章 · 巨星里程碑</span>
        </p>

        <h2 data-nc className="text-gold-gradient mt-7 font-sans text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.15] tracking-[0.02em]">
          纪录是人创造的
        </h2>

        <div data-nc className="mt-10">
          <button
            type="button"
            onClick={() => navigate('/legends')}
            className="btn-shine group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-sm font-bold text-obsidian transition-transform duration-300 hover:scale-[1.04]"
          >
            进入巨星里程碑
            <ArrowRight className="h-4 w-4 group-hover:animate-[milestones-arrow-nudge_1s_ease-in-out_infinite]" />
          </button>
        </div>
      </div>
    </section>
  )
}
