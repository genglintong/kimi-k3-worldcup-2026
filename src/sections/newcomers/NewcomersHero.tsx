import { memo, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollCue from '@/components/ScrollCue'

gsap.registerPlugin(ScrollTrigger)

/** 四支新军国旗代表色：库拉索蓝 / 佛得角星黄 / 约旦红 / 乌兹别克绿 */
const FLAG_COLORS = ['#2E7CD6', '#F5C452', '#E5484D', '#1EB53A'] as const

/** 微粒上升关键帧（作用域限定在本组件内联 <style>，避免改动全局样式） */
const FLAG_RISE_KEYFRAMES = `
@keyframes nc-flag-rise {
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
  12% { opacity: var(--po, 0.55); }
  86% { opacity: var(--po, 0.55); }
  100% { transform: translate3d(var(--dx, 24px), -105vh, 0) scale(0.5); opacity: 0; }
}
`

/** H1 电光绿渐变文字（volt 主题，与全站金色标题渐变同构） */
const VOLT_GRADIENT_TEXT: CSSProperties = {
  background: 'linear-gradient(120deg, #3BFFB2 0%, #8AFFD6 45%, #F0FFF8 60%, #1FD993 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

/** 模块加载时预生成微粒布局（一次性的随机，保持在渲染纯函数之外） */
const PARTICLES = (() => {
  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 18 : 40
  return Array.from({ length: count }, (_, i) => {
    const color = FLAG_COLORS[i % FLAG_COLORS.length]
    const dur = 11 + Math.random() * 9
    return {
      id: i,
      color,
      size: 3 + Math.random() * 4,
      left: `${Math.random() * 100}%`,
      dur,
      delay: -(Math.random() * dur),
      dx: (Math.random() - 0.5) * 120,
      po: 0.3 + Math.random() * 0.45,
    }
  })
})()

/**
 * 背景四色国旗色微粒：自页头底部缓慢升起，无限循环。
 * 独立 memo 组件隔离永续动画，父级重渲染不会重置粒子；
 * prefers-reduced-motion 时整体不渲染。
 */
const FlagParticles = memo(function FlagParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{FLAG_RISE_KEYFRAMES}</style>
      {PARTICLES.map((p) => {
        const style = {
          left: p.left,
          bottom: '-8px',
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color,
          boxShadow: `0 0 10px ${p.color}`,
          animation: `nc-flag-rise ${p.dur}s linear ${p.delay}s infinite`,
          '--dx': `${p.dx}px`,
          '--po': String(p.po),
        } as CSSProperties
        return <span key={p.id} className="absolute rounded-full" style={style} />
      })}
    </div>
  )
})

/**
 * S1 页头 PageHero（70vh）：居中，电光绿环境光 + 四色国旗色微粒缓慢升起。
 * H1「小国大梦」字符级入场（stagger 0.05s），副标词级入场。
 */
export default function NewcomersHero() {
  const rootRef = useRef<HTMLElement>(null)
  /* prefers-reduced-motion：禁用微粒（惰性初始化，避免 effect 内同步 setState） */
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('[data-nch="kicker"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.15)
        .fromTo(
          '[data-nch-char]',
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 1.05, ease: 'power4.out', stagger: 0.05 },
          0.3,
        )
        .fromTo('[data-nch-word]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.035 }, 0.95)
        .fromTo('[data-nch="note"]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5)
        .fromTo('[data-nch="cue"]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.7)
    }, root)
    return () => ctx.revert()
  }, [])

  const subtitleChunks = [
    '四支新军，',
    '2006',
    '年以来最多的一届。',
    '有人只有',
    '15',
    '万人口，',
    '有人靠一封',
    'LinkedIn',
    '私信凑齐国脚——',
    '他们都把名字写进了世界杯。',
  ]

  return (
    <section ref={rootRef} className="relative flex min-h-[70dvh] flex-col overflow-hidden">
      {/* 电光绿环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[560px] w-[720px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(59,255,178,0.10), transparent 70%)' }}
      />
      {!reducedMotion && <FlagParticles />}

      <div className="container-x relative z-10 flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p
          data-nch="kicker"
          className="flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-volt"
        >
          <span className="inline-block h-0.5 w-6 bg-volt" aria-hidden />
          Debutants
          <span className="text-tx-low">/ 新军物语</span>
        </p>

        <h1 className="mt-6 overflow-hidden font-sans text-[clamp(3rem,9vw,7rem)] font-black leading-[1.0] tracking-[0.02em]">
          {Array.from('小国大梦').map((ch, i) => (
            <span key={i} data-nch-char className="inline-block will-change-transform" style={VOLT_GRADIENT_TEXT}>
              {ch}
            </span>
          ))}
        </h1>

        <p className="mt-7 max-w-[68ch] text-base leading-[1.85] text-tx-mid md:text-lg">
          {subtitleChunks.map((w, i) => (
            <span key={i} data-nch-word className="inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>

        <p data-nch="note" className="mt-8 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-tx-low">
          4 Debutants · Most since 2006 · 统计截至 2026-07-16
        </p>
      </div>

      <div data-nch="cue" className="relative z-10 pb-10">
        <ScrollCue />
      </div>
    </section>
  )
}
