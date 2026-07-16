import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const QUOTE = '“梅西抱过的那个婴儿，如今站在了他的对面。”'

/** 侧栏数据卡 */
function SideCard({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left'
  return (
    <div
      data-card={side}
      className="rounded-2xl border border-line bg-panel/85 p-4 backdrop-blur transition-none lg:p-5"
    >
      <p className="font-sans text-base font-black text-tx-hi lg:text-lg">
        {isLeft ? '梅西' : '亚马尔'}
        <span className={`ml-2 font-grotesk text-[0.65rem] uppercase tracking-datalabel ${isLeft ? 'text-albiceleste' : 'text-espana'}`}>
          {isLeft ? 'MESSI · ARG' : 'YAMAL · ESP'}
        </span>
      </p>
      <ul className="mt-2 space-y-1 text-xs leading-6 text-tx-mid lg:text-[0.8125rem]">
        {isLeft ? (
          <>
            <li>8 球 4 助 · 本届领跑</li>
            <li>世界杯 21 球 · 历史第一</li>
            <li>从未拿过金靴</li>
          </>
        ) : (
          <>
            <li>19 岁 · 决赛日 19 岁零 6 天</li>
            <li>西班牙进攻发动机</li>
            <li>第一次决赛</li>
          </>
        )}
      </ul>
    </div>
  )
}

/**
 * S2 故事线：梅西 × 亚马尔（钉住交叉叙事，滚动区间 200vh）。
 * 背景 final-duel.png（15%）；左梅西、右亚马尔双栏常驻（随段落切换高亮对应侧，
 * 另一侧降至 35% 透明度）；中央三段叙事随滚动依次点亮；段 3 金句字符级 stagger + 金色扫光；
 * 双侧肖像 y:∓30px 反向视差。
 */
export default function Storyline() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      /* 双栏入场 + 肖像反向视差（贯穿全程） */
      tl.fromTo('[data-side="left"]', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }, 0)
        .fromTo('[data-side="right"]', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }, 0)
        .fromTo('[data-story-kicker]', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, 0)
        .fromTo('[data-portrait="left"]', { y: 30 }, { y: -30, duration: 3.1, ease: 'none' }, 0)
        .fromTo('[data-portrait="right"]', { y: -30 }, { y: 30, duration: 3.1, ease: 'none' }, 0)

      /* —— 段 1（梅西侧点亮，右侧降至 35%） —— */
      tl.fromTo('[data-seg="1"]', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.15)
        .to('[data-side="right"]', { opacity: 0.35, duration: 0.3 }, 0.2)
        .to(
          '[data-card="left"]',
          { borderColor: 'rgba(245,196,82,0.7)', boxShadow: '0 0 34px rgba(245,196,82,0.16)', duration: 0.3 },
          0.2,
        )
        .to('[data-seg="1"]', { y: -40, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.8)

      /* —— 段 2（亚马尔侧点亮，左侧降至 35%） —— */
      tl.fromTo('[data-seg="2"]', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 1.1)
        .to('[data-side="left"]', { opacity: 0.35, duration: 0.3 }, 1.15)
        .to('[data-side="right"]', { opacity: 1, duration: 0.3 }, 1.15)
        .to(
          '[data-card="left"]',
          { borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3 },
          1.15,
        )
        .to(
          '[data-card="right"]',
          { borderColor: 'rgba(255,65,54,0.7)', boxShadow: '0 0 34px rgba(255,65,54,0.16)', duration: 0.3 },
          1.15,
        )
        .to('[data-seg="2"]', { y: -40, opacity: 0, duration: 0.25, ease: 'power2.in' }, 1.8)

      /* —— 段 3 金句：字符级 stagger，双侧同时点亮 —— */
      tl.to('[data-side="left"]', { opacity: 1, duration: 0.3 }, 2.05)
        .to(
          '[data-card="left"]',
          { borderColor: 'rgba(245,196,82,0.7)', boxShadow: '0 0 34px rgba(245,196,82,0.16)', duration: 0.3 },
          2.05,
        )
        .fromTo(
          '[data-seg3-char]',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.014 },
          2.1,
        )
        .fromTo('[data-seg3-note]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 2.6)

      /* 段 3 金句金色扫光（2s 循环，钉住区间内才运行） */
      const quote = root.querySelector('[data-seg3-quote]')
      const sweep = gsap.to(quote, { backgroundPosition: '200% center', duration: 2, repeat: -1, ease: 'none', paused: true })
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: '+=200%',
        onToggle: (self) => (self.isActive ? sweep.play() : sweep.pause()),
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-obsidian">
      {/* 背景 final-duel.png 15% */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img src="/final-duel.png" alt="" className="h-full w-full object-cover opacity-[0.15]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #04060F 0%, rgba(4,6,15,0.55) 40%, #04060F 100%)' }} />
      </div>

      {/* Kicker */}
      <p
        data-story-kicker
        className="absolute inset-x-0 top-24 z-10 flex items-center justify-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold md:top-28"
      >
        <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
        THE STORYLINE
        <span className="text-tx-low">/ 本届最大故事线</span>
      </p>

      {/* 左栏：梅西（钉住期常驻） */}
      <div
        data-side="left"
        className="absolute left-[4%] top-[13%] z-10 w-[34vw] max-md:top-[12%] md:top-1/2 md:w-[22vw] md:max-w-[280px] md:-translate-y-1/2"
      >
        <div data-portrait="left" className="will-change-transform">
          <img
            src="/portrait-messi.png"
            alt="梅西肖像"
            className="aspect-[3/4] w-full rounded-2xl border border-albiceleste/25 object-cover object-top max-md:h-[16vh]"
            style={{ boxShadow: '0 0 44px rgba(111,195,255,0.14)' }}
          />
        </div>
        <div className="mt-3 max-md:hidden">
          <SideCard side="left" />
        </div>
        {/* 移动端简版卡 */}
        <div data-card="left" className="mt-2 rounded-xl border border-line bg-panel/85 p-2.5 text-[0.65rem] leading-5 text-tx-mid md:hidden">
          <span className="font-sans text-xs font-black text-tx-hi">梅西</span> · 8 球 4 助 · 世界杯 21 球历史第一
        </div>
      </div>

      {/* 右栏：亚马尔（钉住期常驻） */}
      <div
        data-side="right"
        className="absolute right-[4%] top-[13%] z-10 w-[34vw] max-md:top-[12%] md:top-1/2 md:w-[22vw] md:max-w-[280px] md:-translate-y-1/2"
      >
        <div data-portrait="right" className="will-change-transform">
          <img
            src="/portrait-yamal.png"
            alt="亚马尔肖像"
            className="aspect-[3/4] w-full rounded-2xl border border-espana/25 object-cover object-top max-md:h-[16vh]"
            style={{ boxShadow: '0 0 44px rgba(255,65,54,0.14)' }}
          />
        </div>
        <div className="mt-3 max-md:hidden">
          <SideCard side="right" />
        </div>
        <div data-card="right" className="mt-2 rounded-xl border border-line bg-panel/85 p-2.5 text-[0.65rem] leading-5 text-tx-mid md:hidden">
          <span className="font-sans text-xs font-black text-tx-hi">亚马尔</span> · 19 岁 · 西班牙进攻发动机
        </div>
      </div>

      {/* 中央叙事：三段随滚动依次点亮 */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 max-md:top-[58%]">
        <div className="relative mx-auto h-[240px] w-full max-w-md text-center md:h-[280px] lg:max-w-xl xl:max-w-2xl">
          {/* 段 1 */}
          <div data-seg="1" className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <p className="font-sans text-[clamp(1.5rem,3.2vw,2.5rem)] font-black leading-[1.4] text-tx-hi">
              他 <span className="text-gold-gradient font-display text-[1.25em] tracking-[0.01em]">39</span> 岁。
              <br />
              第三次世界杯决赛（<span className="font-display text-albiceleste">2014 / 2022 / 2026</span>），
              <br />
              冲击 <span className="text-gold-gradient font-display text-[1.25em]">64</span> 年来首次有球队卫冕成功。
            </p>
          </div>
          {/* 段 2 */}
          <div data-seg="2" className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <p className="font-sans text-[clamp(1.5rem,3.2vw,2.5rem)] font-black leading-[1.4] text-tx-hi">
              他 <span className="font-display text-[1.25em] text-espana">19</span> 岁零{' '}
              <span className="font-display text-[1.25em] text-espana">6</span> 天。
              <br />
              决赛日，就是这个西班牙少年的年纪。
            </p>
          </div>
          {/* 段 3：金句 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              data-seg3-quote
              className="font-sans text-[clamp(1.35rem,3vw,2.4rem)] font-black leading-[1.5]"
              style={{
                background: 'linear-gradient(120deg, #FF9E3D 0%, #F5C452 35%, #FFF3D6 50%, #F5C452 65%, #D9A03B 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              {Array.from(QUOTE).map((ch, i) => (
                <span key={i} data-seg3-char className="inline-block will-change-transform">
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </p>
            <p data-seg3-note className="mt-6 text-sm leading-7 text-tx-mid opacity-0 md:text-base">
              ——媒体津津乐道的传承故事，将在 7 月 19 日写下结局。
            </p>
          </div>
        </div>
      </div>

      {/* 底部统计口径 */}
      <p className="absolute inset-x-0 bottom-6 z-10 text-center font-grotesk text-[0.65rem] uppercase tracking-datalabel text-tx-low">
        数据截至 2026-07-16
      </p>
    </section>
  )
}
