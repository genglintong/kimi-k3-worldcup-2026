import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown } from 'lucide-react'

const CHIPS = [
  { label: '赛制革命', target: 'format' },
  { label: '上座狂潮', target: 'attendance' },
  { label: '纪录速览', target: 'records' },
]

const TITLE = '一届改写历史的世界杯'
const SUBTITLE = '从 32 队到 48 队，从 358 万到 650 万——2026 年的北美之夏，重新定义了世界杯的尺度。'

/**
 * S1 页头 PageHero（80vh）：obsidian 底 + 顶部金色径向光，居中排版。
 * Kicker → H1（字符级）→ 副标（词级）→ 3 枚锚点芯片（平滑滚动）。
 */
export default function PageHero() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('[data-hero="kicker"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0)
        .fromTo(
          '[data-hero-char]',
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.04 },
          0.2,
        )
        .fromTo('[data-hero-word]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.02 }, 0.7)
        .fromTo('[data-chip]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 1)
    }, root)
    return () => ctx.revert()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[max(80dvh,600px)] flex-col items-center justify-center overflow-hidden bg-obsidian text-center"
    >
      {/* 顶部金色径向光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
        style={{ background: 'radial-gradient(720px 360px at 50% -12%, rgba(245,196,82,0.14), transparent)' }}
      />

      <div className="container-x relative">
        <p
          data-hero="kicker"
          className="flex items-center justify-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold"
        >
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
          Tournament Milestones
          <span className="text-tx-low">/ 赛事里程碑</span>
        </p>

        <h1 className="mt-7 overflow-hidden font-sans text-[clamp(2.25rem,5.5vw,4.25rem)] font-black leading-[1.1] tracking-[0.02em] text-tx-hi">
          {Array.from(TITLE).map((ch, i) => (
            <span key={i} data-hero-char className="inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </h1>

        <p className="mx-auto mt-6 max-w-[62ch] text-base leading-[1.85] text-tx-mid md:text-lg">
          {SUBTITLE.split(' ').map((w, i) => (
            <span key={i} data-hero-word className="inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>

        {/* 锚点芯片 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {CHIPS.map((chip) => (
            <button
              key={chip.target}
              type="button"
              data-chip
              onClick={() => scrollToSection(chip.target)}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2 font-sans text-sm font-medium text-gold transition-colors duration-300 hover:bg-gold/15"
            >
              {chip.label}
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
