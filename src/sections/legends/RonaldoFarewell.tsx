import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** 纪录网格 2×2 */
const RECORDS = [
  {
    value: 6,
    suffix: '届',
    label: '史上首位在 6 届世界杯进球的球员',
    note: '6/23 对乌兹别克斯坦梅开二度',
  },
  {
    value: 147,
    prefix: '41 岁 ',
    suffix: ' 天',
    label: '对克罗地亚打进生涯首个世界杯淘汰赛进球',
    note: '最年长淘汰赛进球者（另：41 岁 138 天，世界杯史上第二年长进球者）',
  },
  {
    value: 10,
    suffix: '球',
    label: '超越尤西比奥，葡萄牙队史世界杯射手王',
  },
  {
    value: 145,
    suffix: '球',
    label: '国家队进球世界纪录',
  },
]

const STATEMENT = ['时代落幕，', '他以', '纪录', '作别。']

/**
 * S3 C 罗专题（暗红暮光，与 S2 镜像：肖像在右，不钉住，逐块入场）。
 * 主视觉句词级升起；纪录卡 y:70→0 / rotateX 10°→0 / stagger 0.12s；
 * 落幕卡 1.4s 缓慢浮现 + 红色描边呼吸（3s 循环）。
 */
export default function RonaldoFarewell() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 主视觉句：词级升起 */
      gsap.fromTo(
        '[data-cr-word]',
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.04,
          scrollTrigger: { trigger: '[data-cr-statement]', start: 'top 80%', once: true },
        },
      )

      /* 纪录卡：y:70→0, rotateX 10°→0, stagger 0.12s, 1s */
      gsap.fromTo(
        '[data-cr-card]',
        { y: 70, rotateX: 10, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-cr-grid]', start: 'top 78%', once: true },
        },
      )

      /* 数字计数 */
      root.querySelectorAll<HTMLElement>('[data-cr-count]').forEach((el) => {
        const target = Number(el.dataset.crCount || '0')
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v))
          },
        })
      })

      /* 落幕卡：opacity 0→1 缓慢浮现（1.4s） */
      gsap.fromTo(
        '[data-cr-farewell]',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-cr-farewell]', start: 'top 82%', once: true },
        },
      )
      /* 红色描边呼吸（3s 循环） */
      gsap.fromTo(
        '[data-cr-farewell]',
        { borderColor: 'rgba(255,65,54,0.25)', boxShadow: '0 0 0 rgba(255,65,54,0)' },
        { borderColor: 'rgba(255,65,54,0.7)', boxShadow: '0 0 36px rgba(255,65,54,0.22)', duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      )

      /* 肖像入场 */
      gsap.fromTo(
        '[data-cr-portrait]',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="ronaldo"
      ref={rootRef}
      className="relative overflow-hidden border-t border-line py-24 md:py-36"
      style={{ background: 'linear-gradient(180deg, #090E1D 0%, #120A0C 28%, #120A0C 72%, #04060F 100%)' }}
    >
      {/* 暮光环境光 */}
      <div aria-hidden className="absolute right-[-10vw] top-1/4 h-[52vh] w-[42vw] rounded-full bg-[radial-gradient(circle,rgba(255,65,54,0.08),transparent_70%)] blur-[110px]" />
      <div aria-hidden className="absolute bottom-[-8vh] left-[-6vw] h-[40vh] w-[34vw] rounded-full bg-[radial-gradient(circle,rgba(217,160,59,0.07),transparent_70%)] blur-[110px]" />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[55%_45%]">
        {/* 左：叙事 */}
        <div>
          <p className="font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-espana">
            Cristiano Ronaldo
            <span className="text-tx-low"> · 葡萄牙 · 41 岁 · 第 6 届 · 确认谢幕</span>
          </p>

          {/* 主视觉句 */}
          <h2 data-cr-statement className="mt-6 font-sans text-[clamp(1.75rem,4vw,3rem)] font-black italic leading-[1.3] tracking-[0.02em] text-tx-hi">
            {STATEMENT.map((w, i) => (
              <span key={i} data-cr-word className="inline-block will-change-transform">
                {w}
              </span>
            ))}
          </h2>

          {/* 纪录网格 2×2 */}
          <div data-cr-grid className="mt-10 grid gap-4 sm:grid-cols-2" style={{ perspective: '900px' }}>
            {RECORDS.map((r) => (
              <div
                key={r.label}
                data-cr-card
                className="rounded-2xl border border-line bg-panel/80 p-6 backdrop-blur will-change-transform"
              >
                <p className="font-display leading-none">
                  {r.prefix && <span className="text-2xl text-gold md:text-3xl">{r.prefix}</span>}
                  <span data-cr-count={r.value} className="text-gold-gradient text-5xl md:text-6xl">
                    0
                  </span>
                  <span className="ml-1 text-2xl text-gold md:text-3xl">{r.suffix}</span>
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-tx-hi">{r.label}</p>
                {r.note && <p className="mt-2 text-xs leading-6 text-tx-low">{r.note}</p>}
              </div>
            ))}
          </div>

          {/* 落幕卡 */}
          <div data-cr-farewell className="mt-6 rounded-2xl border bg-[#150B0D]/90 p-6 md:p-7">
            <p className="flex items-center gap-3 font-grotesk text-[0.72rem] font-medium uppercase tracking-kicker text-espana">
              <span className="inline-block h-0.5 w-6 bg-espana" aria-hidden />
              The Final Whistle / 落幕
            </p>
            <p className="mt-4 font-sans text-lg font-bold leading-[1.8] text-tx-hi md:text-xl">
              1/8 决赛 0-1 负西班牙——梅里诺 91' 绝杀。
            </p>
            <p className="mt-2 text-base leading-[1.85] text-tx-mid">41 岁的背影，走出世界杯的灯火。</p>
          </div>
        </div>

        {/* 右：肖像 */}
        <div data-cr-portrait className="relative mx-auto w-full max-w-[420px] will-change-transform">
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 h-2/5 w-[130%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,65,54,0.2),transparent)] blur-2xl"
          />
          <div
            aria-hidden
            className="absolute right-0 top-0 h-1/3 w-full bg-[radial-gradient(closest-side,rgba(245,196,82,0.12),transparent)] blur-2xl"
          />
          <img
            src="/portrait-ronaldo.png"
            alt="C 罗：暗红战袍腾空倒钩剪影"
            draggable={false}
            className="relative w-full select-none object-contain"
          />
        </div>
      </div>
    </section>
  )
}
