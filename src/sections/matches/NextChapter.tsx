import { useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'

/**
 * S4 下一章 CTA：豪门会倒下，新军正在崛起 → 新军物语 /newcomers。
 * 标准 CTA 入场（data-reveal）；箭头悬停位移。
 */
export default function NextChapter() {
  const navigate = useNavigate()

  return (
    <section className="container-x py-24 md:py-32">
      <div
        data-reveal
        data-cursor
        role="link"
        tabIndex={0}
        onClick={() => navigate('/newcomers')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            navigate('/newcomers')
          }
        }}
        className="group cursor-pointer border-y border-line py-14 text-center md:py-20"
      >
        <p className="flex items-center justify-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
          NEXT CHAPTER
          <span className="text-tx-low">/ 下一章</span>
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
        </p>

        <p className="mx-auto mt-7 max-w-[22ch] font-sans text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.2] tracking-[0.02em] text-tx-hi">
          豪门会倒下，<span className="text-gold-gradient">新军正在崛起</span>
        </p>

        <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/50 px-7 py-3 font-sans text-sm font-bold text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10">
          新军物语
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
        </p>
      </div>
    </section>
  )
}
