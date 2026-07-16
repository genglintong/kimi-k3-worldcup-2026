import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SectionHeadProps {
  /** Kicker 英文部分，如 "RECORDS" */
  kickerEn: string
  /** Kicker 中文部分，如 "纪录" */
  kickerZh: string
  /** H2 标题（字符级 split 入场） */
  title: string
  /** 可选描述（词级入场） */
  description?: string
  /** 主题色：kicker 短线与斜杠色 */
  tone?: 'gold' | 'volt'
  className?: string
}

/**
 * 区块头：Kicker（金线 + 英文/中文）→ H2 标题（字符级 split 入场）→ 可选描述。
 * GSAP ScrollTrigger 驱动，trigger "top 82%"。
 */
export default function SectionHead({ kickerEn, kickerZh, title, description, tone = 'gold', className = '' }: SectionHeadProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const chars = root.querySelectorAll('[data-char]')
      const words = root.querySelectorAll('[data-word]')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 82%', once: true },
      })
      tl.fromTo(
        root.querySelector('[data-kicker]'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      )
      if (chars.length) {
        tl.fromTo(
          chars,
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.9, ease: 'power4.out', stagger: 0.03 },
          '-=0.3',
        )
      }
      if (words.length) {
        tl.fromTo(words, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.03 }, '-=0.5')
      }
    }, root)
    return () => ctx.revert()
  }, [])

  const toneClass = tone === 'volt' ? 'text-volt' : 'text-gold'
  const lineClass = tone === 'volt' ? 'bg-volt' : 'bg-gold'

  return (
    <div ref={rootRef} className={`mb-12 md:mb-16 ${className}`}>
      <p data-kicker className={`flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker ${toneClass}`}>
        <span className={`inline-block h-0.5 w-6 ${lineClass}`} aria-hidden />
        {kickerEn}
        <span className="text-tx-low">/ {kickerZh}</span>
      </p>
      <h2 className="mt-5 overflow-hidden font-sans text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.15] tracking-[0.02em] text-tx-hi">
        {Array.from(title).map((ch, i) => (
          <span key={i} data-char className="inline-block will-change-transform">
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </h2>
      {description && (
        <p className="mt-5 max-w-[68ch] text-base leading-[1.85] text-tx-mid">
          {description.split(' ').map((w, i) => (
            <span key={i} data-word className="inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
