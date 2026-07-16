import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const TITLE = Array.from('8 个不眠之夜')

/** 副标词级入场；拉丁数字用 Anton 并加大 */
const SUBTITLE: { t: string; num?: boolean }[] = [
  { t: '补时绝杀、' },
  { t: '点球梦魇、' },
  { t: '11', num: true },
  { t: '分钟三球、' },
  { t: '世界第一差点翻船——' },
  { t: '2026', num: true },
  { t: '的淘汰赛，' },
  { t: '每一夜都值得重看一遍。' },
]

/**
 * S1 页头（70vh，居中）：Kicker → H1 字符级 stagger 0.05s → 副标词级 → 提示芯片 pulse 两次后静止。
 */
export default function MatchesHero() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('[data-mh="bg"]', { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
        .fromTo('[data-mh="kicker"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.15)
        .fromTo(
          '[data-mh-char]',
          { yPercent: 110, rotate: 5 },
          { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: 0.05 },
          0.3,
        )
        .fromTo('[data-mh-word]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04 }, 0.85)
    }, root)
    return () => ctx.revert()
  }, [])

  const scrollToBattles = () => {
    document.getElementById('battles')?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  return (
    <section ref={rootRef} className="relative flex min-h-[70dvh] flex-col items-center justify-center overflow-hidden py-24">
      {/* 背景：超大描边空心字 + 金色径向光 */}
      <div data-mh="bg" aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-stroke-soft select-none whitespace-nowrap font-display text-[20vw] leading-none opacity-40">
          EPIC NIGHTS
        </span>
        <div
          className="absolute inset-x-0 top-0 h-[40vh]"
          style={{ background: 'radial-gradient(600px 300px at 50% -10%, rgba(245,196,82,0.12), transparent)' }}
        />
      </div>

      <div className="container-x relative z-10 flex flex-col items-center text-center">
        {/* Kicker：— EPIC NIGHTS / 经典战役 */}
        <p
          data-mh="kicker"
          className="flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold"
        >
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
          EPIC NIGHTS
          <span className="text-tx-low">/ 经典战役</span>
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
        </p>

        {/* H1：8 个不眠之夜（字符级，拉丁数字 Anton 加大） */}
        <h1 className="mt-8 overflow-hidden font-sans text-[clamp(2.75rem,7vw,6rem)] font-black leading-[1.05] tracking-[0.02em]">
          {TITLE.map((ch, i) => (
            <span
              key={i}
              data-mh-char
              className={`text-gold-gradient inline-block will-change-transform ${
                /\d/.test(ch) ? 'mx-1 font-display text-[1.12em] tracking-[0.01em]' : ''
              }`}
            >
              {ch}
            </span>
          ))}
        </h1>

        {/* 副标（词级） */}
        <p className="mt-7 max-w-[68ch] text-base leading-[1.85] text-tx-mid md:text-lg">
          {SUBTITLE.map((w, i) => (
            <span key={i} data-mh-word className="inline-block">
              {w.num ? <span className="mx-0.5 font-display text-[1.1em] text-gold">{w.t}</span> : w.t}&nbsp;
            </span>
          ))}
        </p>

        {/* 提示芯片：pulse 呼吸两次后静止，点击跳转时间线 */}
        <motion.button
          type="button"
          onClick={scrollToBattles}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [0.9, 1, 1.06, 1, 1.06, 1] }}
          transition={{ delay: 1.5, duration: 1.9, times: [0, 0.16, 0.38, 0.58, 0.79, 1], ease: 'easeInOut' }}
          className="mt-11 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-6 py-2.5 font-sans text-sm text-gold transition-colors hover:bg-gold/15"
        >
          点击任意战役可展开完整战报
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.button>
      </div>
    </section>
  )
}
