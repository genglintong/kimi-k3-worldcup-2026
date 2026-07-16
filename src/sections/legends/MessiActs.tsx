import { memo, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** 幕 2 · 全能之王：4 枚纪录芯片 */
const RECORD_CHIPS = [
  { figure: '33 场', label: '出场历史第一' },
  { figure: '连续 9 场', label: '世界杯进球（首位）' },
  { figure: '10 次助攻', label: '首位助攻上双' },
  { figure: '两届 7+ 球', label: '史上唯一' },
]

/** 幕 1 · 射手王：时间刻度 */
const STEPS = [
  { when: '6/23 · 对奥地利', what: '梅开二度，18 球超越克洛泽（16）与玛塔（17）' },
  { when: '对佛得角', what: '第 20 球 · 史上首位世界杯 20 球球员' },
  { when: '对埃及', what: '第 21 球 · 继续刷新历史' },
]

/** 梅西肖像：底部天蓝雾化光晕 + 常驻缓慢浮动 ±8px/4s（memo 隔离，避免重渲染重置动画） */
const FloatingPortrait = memo(function FloatingPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const tween = gsap.fromTo(el, { y: 8 }, { y: -8, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative flex h-full items-end justify-center will-change-transform">
      {/* 底部天蓝雾化光晕 */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-2/5 w-[130%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(111,195,255,0.22),transparent)] blur-2xl"
      />
      <img
        data-messi-portrait
        src="/portrait-messi.png"
        alt="梅西：天蓝白条纹战袍动态剪影"
        draggable={false}
        className="relative max-h-[46vh] w-auto select-none object-contain md:max-h-[76vh] will-change-transform"
      />
    </div>
  )
})

/**
 * S2 梅西专题（天蓝×金，钉住叙事 180vh）。
 * 桌面：pin + scrub 三幕切换（旧幕 opacity 0 / y:-30，新幕 y:30→0），肖像 y:-40 视差，底部 3 枚进度点。
 * 移动（<768px）：不钉住，三幕垂直堆叠逐块入场。
 */
export default function MessiActs() {
  const rootRef = useRef<HTMLElement>(null)
  const [activeDot, setActiveDot] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 巨数 21 计数器（1.8s，仅一次） */
      const num = root.querySelector<HTMLElement>('[data-messi-count]')
      if (num) {
        const counter = { v: 0 }
        gsap.to(counter, {
          v: 21,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 55%', once: true },
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v))
          },
        })
      }

      const mm = gsap.matchMedia()

      /* —— 桌面：钉住三幕叙事 —— */
      mm.add('(min-width: 768px)', () => {
        const acts = gsap.utils.toArray<HTMLElement>('[data-act]')
        gsap.set(acts[1], { autoAlpha: 0, y: 30 })
        gsap.set(acts[2], { autoAlpha: 0, y: 30 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress
              const idx = p < 0.35 ? 0 : p < 0.8 ? 1 : 2
              setActiveDot((prev) => (prev === idx ? prev : idx))
            },
          },
        })

        tl.to(acts[0], { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' }, 0.8)
          .fromTo(acts[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 1.2)
          .fromTo(
            '[data-mchip]',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)', stagger: 0.1 },
            1.35,
          )
          .to(acts[1], { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' }, 2.1)
          .fromTo(acts[2], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 2.5)
          /* 肖像随滚动 y:-40 视差 */
          .fromTo('[data-messi-portrait]', { y: 0 }, { y: -40, duration: 2.95, ease: 'none' }, 0)

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      /* —— 移动：垂直堆叠，逐块入场 —— */
      mm.add('(max-width: 767px)', () => {
        const tweens = gsap.utils.toArray<HTMLElement>('[data-act]').map((act) =>
          gsap.fromTo(
            act,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: act, start: 'top 82%', once: true } },
          ),
        )
        return () => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill()
            t.kill()
          })
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="messi" ref={rootRef} className="relative border-t border-line bg-ink md:h-[100dvh] md:overflow-hidden">
      {/* 天蓝环境光 */}
      <div aria-hidden className="absolute left-0 top-1/3 h-[50vh] w-[36vw] rounded-full bg-[radial-gradient(circle,rgba(111,195,255,0.07),transparent_70%)] blur-[100px]" />

      <div className="grid h-full md:grid-cols-[45%_55%]">
        {/* 左 45%：肖像 */}
        <div className="relative flex items-end justify-center pt-16 md:pt-0">
          <FloatingPortrait />
        </div>

        {/* 右 55%：叙事区 */}
        <div className="relative flex flex-col px-6 pb-20 pt-10 md:h-full md:px-12 md:pb-0 md:pt-24 lg:px-16">
          {/* 顶部固定标识 */}
          <p className="font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-albiceleste">
            Lionel Messi
            <span className="text-tx-low"> · 阿根廷 · 39 岁 · 第 6 届</span>
          </p>

          <div className="relative mt-8 md:mt-0 md:flex-1">
            {/* 幕 1 · 射手王 */}
            <div data-act className="md:absolute md:inset-0 md:flex md:flex-col md:justify-center">
              <p className="font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">Act 01 · 射手王</p>
              <p className="mt-4">
                <span className="text-gold-gradient font-display text-[clamp(4.5rem,10vw,9rem)] leading-none">
                  <span data-messi-count>0</span>
                </span>
                <span className="ml-4 font-sans text-xl font-bold text-tx-hi md:text-2xl">球</span>
              </p>
              <p className="mt-2 font-sans text-2xl font-black text-tx-hi">世界杯历史射手王</p>
              {/* 时间刻度 */}
              <ol className="mt-8 space-y-4">
                {STEPS.map((s) => (
                  <li key={s.when} className="flex items-start gap-4">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold shadow-gold-glow" aria-hidden />
                    <p className="text-sm leading-7 text-tx-mid md:text-base">
                      <span className="font-grotesk font-medium uppercase tracking-datalabel text-albiceleste">{s.when}</span>
                      <span className="mx-2 text-tx-low">→</span>
                      {s.what}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* 幕 2 · 全能之王 */}
            <div data-act className="mt-16 md:absolute md:inset-0 md:mt-0 md:flex md:flex-col md:justify-center">
              <p className="font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">Act 02 · 全能之王</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {RECORD_CHIPS.map((chip) => (
                  <div
                    key={chip.figure}
                    data-mchip
                    className="rounded-2xl border border-albiceleste/25 bg-panel/80 px-5 py-4 backdrop-blur will-change-transform"
                  >
                    <p className="font-display text-2xl leading-none text-albiceleste md:text-3xl">{chip.figure}</p>
                    <p className="mt-2 text-sm leading-6 text-tx-mid">{chip.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-[60ch] text-sm leading-7 text-tx-low">
                揭幕战 38 岁帽子戏法——世界杯史上最年长；追平斯塔比莱 1930 年阿根廷单届 8 球纪录；35 岁后世界杯 14 球（第二名米拉仅 5 球）。
              </p>
            </div>

            {/* 幕 3 · 最后的决战 */}
            <div data-act className="mt-16 md:absolute md:inset-0 md:mt-0 md:flex md:flex-col md:justify-center">
              <p className="font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">Act 03 · 最后的决战</p>
              <p className="mt-6 max-w-[34ch] font-sans text-xl font-bold leading-[1.7] text-tx-hi md:text-2xl">
                半决赛两助攻导演 2-1 逆转英格兰，第三次站上决赛舞台（2014 / 2022 / 2026）。
              </p>
              <p className="mt-6 max-w-[34ch] border-l-2 border-gold pl-5 font-sans text-lg font-black leading-[1.7] text-gold md:text-xl">
                他从未拿过世界杯金靴——7 月 19 日，是金靴与冠军的双重决战。
              </p>
              <p className="mt-6 text-sm leading-7 text-tx-low">本届两失点球，史上首位单届两失点球的球员。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 3 枚进度点（仅桌面钉住模式） */}
      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 md:flex" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-full transition-all duration-300 ${
              activeDot === i ? 'w-8 bg-gold' : 'w-1.5 bg-tx-low/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
