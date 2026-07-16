import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCountdown } from '@/hooks/useCountdown'

gsap.registerPlugin(ScrollTrigger)

const DuelParticles = lazy(() => import('@/sections/final/DuelParticles'))

/** 翻牌式倒计时卡片：值变化时 rotateX 90°→0（0.4s），与首页同款 */
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
        className="flex h-[64px] w-[56px] items-center justify-center rounded-xl border border-gold/30 bg-obsidian/80 shadow-gold-glow backdrop-blur md:h-[84px] md:w-[72px] lg:h-[96px] lg:w-[88px]"
        style={{ perspective: '600px' }}
      >
        <span className="text-gold-gradient font-display text-[2.25rem] leading-none md:text-[3rem] lg:text-[4rem]">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-grotesk text-[0.65rem] uppercase tracking-datalabel text-tx-mid">{label}</span>
    </div>
  )
}

const QUOTE_WORDS = ['两队', '史上', '第一次，', '在', '世界杯', '决赛', '相遇。']

/**
 * S1 分屏英雄区（100vh，min 720px）：
 * 左半 espana 红渐变 + 右半 albiceleste 天蓝渐变，中央金色「光刃」中缝；
 * final-metlife.png 以 12% 透明度铺满；两半各漂浮对应色粒子（鼠标视差反向）。
 * 加载序列 2.4s：光刃 scaleY → 双队滑入 → VS 落位金光爆闪 → 倒计时 stagger → 金句词级淡入。
 * 滚动：左右半屏 x:∓5% 分离，中央内容淡出。
 */
export default function DuelHero() {
  const rootRef = useRef<HTMLElement>(null)
  const [particlesVisible, setParticlesVisible] = useState(true)
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const countdown = useCountdown()

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
      const isDesktop = window.matchMedia('(min-width: 768px)').matches

      /* —— 加载序列（总长 2.4s） —— */
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      /* 中缝光刃 scaleY 0→1（移动端横刃 scaleX），0.8s power4.inOut */
      tl.fromTo(
        '[data-blade]',
        isDesktop ? { scaleY: 0 } : { scaleX: 0 },
        { scaleY: 1, scaleX: 1, duration: 0.8, ease: 'power4.inOut' },
        0,
      )
        /* 左半 x:-80→0 / 右半 x:80→0（1s power4.out，延迟 0.3s） */
        .fromTo('[data-team="left"]', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0.3)
        .fromTo('[data-team="right"]', { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0.3)
        /* VS scale 3→1 + 落位时中缝金光爆闪一次（延迟 0.8s） */
        .fromTo('[data-vs]', { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.2)' }, 0.8)
        .fromTo('[data-flash]', { opacity: 0 }, { opacity: 0.9, duration: 0.12, ease: 'power1.in' }, 1.42)
        .to('[data-flash]', { opacity: 0, duration: 0.55, ease: 'power2.out' }, 1.54)
        /* 倒计时卡片 stagger 0.1s（延迟 1.2s） */
        .fromTo(
          '[data-hero="countdown"]',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.1 },
          1.2,
        )
        .fromTo('[data-info]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 1.55)
        /* 金句词级淡入（延迟 1.6s） */
        .fromTo(
          '[data-quote-word]',
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06 },
          1.6,
        )

      /* VS 沿中缝呼吸（scale 1↔1.05，3s 循环，加载序列落位后开始） */
      gsap.to('[data-vs]', { scale: 1.05, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.7 })

      /* —— 滚动 scrub：左右半屏 x:∓5% 缓慢分离，中央内容淡出 —— */
      gsap.to('[data-half="left"]', {
        xPercent: -5,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-half="right"]', {
        xPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-content]', {
        yPercent: -15,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '75% top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative flex min-h-[max(100dvh,720px)] flex-col overflow-hidden">
      {/* 左半 espana 红渐变（#1A0505→#04060F） */}
      <div
        data-half="left"
        aria-hidden
        className="absolute will-change-transform max-md:inset-x-0 max-md:top-0 max-md:h-1/2 md:inset-y-0 md:left-0 md:w-1/2"
        style={{ background: 'linear-gradient(to right, #1A0505 0%, #04060F 100%)' }}
      />
      {/* 右半 albiceleste 天蓝渐变（#0A1626→#04060F） */}
      <div
        data-half="right"
        aria-hidden
        className="absolute will-change-transform max-md:inset-x-0 max-md:bottom-0 max-md:h-1/2 md:inset-y-0 md:right-0 md:w-1/2"
        style={{ background: 'linear-gradient(to left, #0A1626 0%, #04060F 100%)' }}
      />
      {/* MetLife 球场外景 12% 透明度铺满 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img src="/final-metlife.png" alt="" className="h-full w-full object-cover opacity-[0.12]" />
      </div>

      {/* 双色粒子场（红 / 天蓝，视差反向） */}
      <div className="absolute inset-0">
        {!reducedMotion && (
          <Suspense fallback={null}>
            <DuelParticles visible={particlesVisible} />
          </Suspense>
        )}
      </div>

      {/* 中央金色「光刃」中缝：2px 金线 + 60px 辉光（桌面竖刃 / 移动横刃） */}
      <div
        data-blade
        aria-hidden
        className="absolute z-[5] bg-gradient-to-b from-transparent via-gold to-transparent will-change-transform max-md:inset-x-0 max-md:top-1/2 max-md:h-[2px] max-md:-translate-y-1/2 md:inset-y-0 md:left-1/2 md:w-[2px] md:-translate-x-1/2"
        style={{ boxShadow: '0 0 60px 6px rgba(245,196,82,0.45)' }}
      />
      {/* VS 落位爆闪 */}
      <div
        data-flash
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[34%] z-[6] h-[320px] w-[320px] -translate-x-1/2 rounded-full opacity-0 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,196,82,0.75), transparent 70%)' }}
      />

      {/* 内容层 */}
      <div data-hero-content className="relative z-10 flex flex-1 items-center justify-center py-24">
        <div className="flex w-full items-center justify-center max-md:flex-col max-md:gap-10">
          {/* 左半（右对齐）：西班牙 */}
          <div data-team="left" className="flex min-w-0 flex-1 flex-col items-end px-6 text-right max-md:items-center max-md:text-center">
            <h2
              className="font-sans text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[1.1] tracking-[0.02em] text-espana"
              style={{ textShadow: '0 0 44px rgba(255,65,54,0.55)' }}
            >
              西班牙
            </h2>
            <p
              className="mt-2 font-grotesk text-[clamp(1.4rem,3.4vw,2.75rem)] font-bold tracking-[0.12em]"
              style={{ WebkitTextStroke: '1px rgba(255,65,54,0.7)', color: 'transparent' }}
            >
              SPAIN
            </p>
            <p className="mt-3 text-sm text-tx-mid md:text-base">时隔 16 年 · 重返决赛</p>
          </div>

          {/* 中央：VS → 倒计时 → 信息行 */}
          <div className="flex shrink-0 flex-col items-center px-4">
            <span
              data-vs
              className="text-gold-gradient font-display text-[clamp(4.5rem,10vw,9rem)] leading-none will-change-transform"
            >
              VS
            </span>
            <div className="mt-8 flex items-end gap-2 md:gap-3">
              <FlipCard value={countdown.days} label="天 Days" />
              <FlipCard value={countdown.hours} label="时 Hrs" />
              <FlipCard value={countdown.minutes} label="分 Min" />
              <FlipCard value={countdown.seconds} label="秒 Sec" />
            </div>
            <p data-info className="mt-6 max-w-[420px] text-center text-xs leading-6 text-tx-mid md:text-sm md:leading-7">
              7月19日 15:00 ET（北京时间 7/20 凌晨 3:00）
              <br />
              新泽西 MetLife 体育场（New York New Jersey Stadium）· 容量约 82,500
            </p>
          </div>

          {/* 右半（左对齐）：阿根廷 */}
          <div data-team="right" className="flex min-w-0 flex-1 flex-col items-start px-6 text-left max-md:items-center max-md:text-center">
            <h2
              className="font-sans text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[1.1] tracking-[0.02em] text-albiceleste"
              style={{ textShadow: '0 0 44px rgba(111,195,255,0.55)' }}
            >
              阿根廷
            </h2>
            <p
              className="mt-2 font-grotesk text-[clamp(1.4rem,3.4vw,2.75rem)] font-bold tracking-[0.12em]"
              style={{ WebkitTextStroke: '1px rgba(111,195,255,0.7)', color: 'transparent' }}
            >
              ARGENTINA
            </p>
            <p className="mt-3 text-sm text-tx-mid md:text-base">卫冕冠军 · 第三次决赛之旅</p>
          </div>
        </div>
      </div>

      {/* 底部金句 */}
      <p className="relative z-10 pb-12 text-center font-sans text-base font-medium text-tx-hi md:text-lg">
        {QUOTE_WORDS.map((w, i) => (
          <span key={i} data-quote-word className="inline-block">
            {w}&nbsp;
          </span>
        ))}
      </p>
    </section>
  )
}
