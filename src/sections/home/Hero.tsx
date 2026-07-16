import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import ScrollCue from '@/components/ScrollCue'
import { useCountdown } from '@/hooks/useCountdown'

gsap.registerPlugin(ScrollTrigger)

const ParticleField = lazy(() => import('@/sections/home/ParticleField'))

const MARQUEE_TEXT = '48 TEAMS · 104 MATCHES · 3 HOST NATIONS · 16 CITIES · 39 DAYS · 6.5M+ FANS · '

/** 翻牌式倒计时卡片：值变化时 rotateX 90°→0（0.4s） */
function FlipCard({ value, label }: { value: number; label: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current === value) return
    prevRef.current = value
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { rotateX: 90 }, { rotateX: 0, duration: 0.4, ease: 'power2.out' })
    }
  }, [value])

  return (
    <div data-hero="countdown" className="flex flex-col items-center gap-2">
      <div
        ref={cardRef}
        className="flex h-[72px] w-[64px] items-center justify-center rounded-xl border border-gold/30 bg-panel/80 shadow-gold-glow backdrop-blur md:h-[96px] md:w-[88px]"
        style={{ perspective: '600px' }}
      >
        <span className="text-gold-gradient font-display text-[2.5rem] leading-none md:text-[4rem]">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-grotesk text-[0.65rem] uppercase tracking-datalabel text-tx-mid">{label}</span>
    </div>
  )
}

/**
 * S1 英雄区：100vh（min 720px）。
 * 底层 hero-stadium.png（亮度 35% + obsidian 渐变蒙版）→ Three.js 金色粒子场 → 内容层。
 * 加载序列 GSAP timeline 总长 2.1s；滚动 scrub：内容 y:-25% 淡出，背景 y:+10% 视差。
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const [particlesVisible, setParticlesVisible] = useState(true)
  /* prefers-reduced-motion：禁用粒子（惰性初始化） */
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const countdown = useCountdown()
  const navigate = useNavigate()

  /* 粒子场离开视口时暂停渲染循环 */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([entry]) => setParticlesVisible(entry.isIntersecting), { threshold: 0 })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* —— 加载序列（总长 2.1s） —— */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('[data-hero="bg"]', { scale: 1.15 }, { scale: 1, duration: 2, ease: 'power2.out' }, 0)
        .fromTo('[data-hero="kicker"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.2)
        .fromTo(
          '[data-hero-char]',
          { yPercent: 110, rotate: 5 },
          { yPercent: 0, rotate: 0, duration: 1.1, ease: 'power4.out', stagger: 0.045 },
          0.35,
        )
        .fromTo('[data-hero-word]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.03 }, 0.9)
        .fromTo(
          '[data-hero="countdown"]',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.1 },
          1.1,
        )
        .fromTo('[data-hero="cta"]', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08 }, 1.4)
        .fromTo('[data-hero="note"]', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.6)

      /* —— 滚动 scrub：内容 y:-25% 淡出；背景 y:+10% 视差；粒子淡出 —— */
      gsap.to('[data-hero="content"]', {
        yPercent: -25,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '80% top', scrub: true },
      })
      gsap.to('[data-hero="bg"]', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero="particles"]', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '60% top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const subtitleWords = ['首届', '48', '队世界杯', '·', '104', '场比赛', '·', '39', '天', '·', '650', '万+', '现场观众——一届把一切纪录都改写的世界杯。']

  return (
    <section ref={rootRef} className="relative flex min-h-[max(100dvh,720px)] flex-col overflow-hidden">
      {/* 底层：球场夜景（亮度 35%）+ obsidian 渐变蒙版 */}
      <div data-hero="bg" className="absolute inset-0 will-change-transform">
        <img
          src="/hero-stadium.png"
          alt="世界杯球场夜景"
          className="h-full w-full object-cover"
          style={{ filter: 'brightness(0.35)' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #04060F 0%, rgba(4,6,15,0.4) 55%, rgba(4,6,15,0.55) 100%)' }}
        />
      </div>

      {/* 中层：金色粒子场 */}
      <div data-hero="particles" className="absolute inset-0">
        {!reducedMotion && (
          <Suspense fallback={null}>
            <ParticleField visible={particlesVisible} />
          </Suspense>
        )}
      </div>

      {/* 内容层：垂直居中偏左 */}
      <div data-hero="content" className="container-x relative z-10 flex flex-1 flex-col justify-center py-28">
        <p
          data-hero="kicker"
          className="flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold"
        >
          <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
          FIFA WORLD CUP 2026 · USA / CANADA / MEXICO
        </p>

        <h1 className="mt-6 overflow-hidden font-sans text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.95] tracking-[0.01em]">
          {Array.from('传奇里程碑').map((ch, i) => (
            <span key={i} data-hero-char className="text-gold-gradient inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-[68ch] text-base leading-[1.85] text-tx-mid md:text-lg">
          {subtitleWords.map((w, i) => (
            <span key={i} data-hero-word className="inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>

        {/* 决赛倒计时 */}
        <div className="mt-10 flex items-end gap-3 md:gap-4">
          <FlipCard value={countdown.days} label="天 Days" />
          <FlipCard value={countdown.hours} label="时 Hrs" />
          <FlipCard value={countdown.minutes} label="分 Min" />
          <FlipCard value={countdown.seconds} label="秒 Sec" />
        </div>
        <p data-hero="note" className="mt-4 text-sm text-tx-low">
          决赛 · 西班牙 vs 阿根廷 · 7月19日 15:00 ET · MetLife 体育场
        </p>

        {/* 双 CTA */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button
            type="button"
            data-hero="cta"
            onClick={() => navigate('/milestones')}
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-sm font-bold text-obsidian transition-transform duration-300 hover:scale-[1.04]"
          >
            探索里程碑
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-hero="cta"
            onClick={() => navigate('/final')}
            className="inline-flex items-center gap-2 rounded-full border border-gold/70 px-8 py-3.5 font-sans text-sm font-bold text-gold transition-colors duration-300 hover:bg-gold/15"
          >
            决赛前瞻
          </button>
        </div>
      </div>

      {/* 右下 ScrollCue */}
      <div className="absolute bottom-24 right-8 z-10 hidden md:block">
        <ScrollCue />
      </div>

      {/* 底部金色走马灯 */}
      <div className="marquee-paused relative z-10 overflow-hidden border-t border-gold/15 py-4" aria-hidden>
        <div className="animate-marquee flex whitespace-nowrap">
          {[0, 1].map((i) => (
            <span key={i} className="text-stroke-gold pr-4 font-display text-2xl tracking-wide md:text-3xl">
              {MARQUEE_TEXT.repeat(3)}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
