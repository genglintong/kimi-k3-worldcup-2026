import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface NumCard {
  value: number
  suffix: string
  label: string
  note: string
}

const CARDS: NumCard[] = [
  { value: 48, suffix: '', label: '参赛队', note: '史上首届 48 队世界杯' },
  { value: 3, suffix: '', label: '主办国', note: '美 / 加 / 墨，史上首次三国联办' },
  { value: 16, suffix: '', label: '主办城市', note: '16 座球场横跨北美' },
  { value: 104, suffix: '', label: '场比赛', note: '2022 年仅为 64 场' },
  { value: 39, suffix: '', label: '天赛程', note: '6.11–7.19，史上最长' },
  { value: 650, suffix: '万+', label: '现场观众', note: '打破 1994 年 358.7 万纪录' },
  { value: 84, suffix: '', label: '支历史参赛队', note: '世界杯历史版图' },
]

/**
 * S2 数字长廊：钉住横向滚动（桌面，150vh+ 区间）。
 * 左侧固定竖排标签；右侧 7 张超大数字卡随滚动整体平移；
 * 卡片进入视口中心时计数器触发一次；rotateY 随滚动速度微倾 ±3°；
 * 底部细金线 scaleX 跟随滚动进度。移动端降级为垂直堆叠。
 */
export default function NumbersGallery() {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth + 120)
        const progressBar = root.querySelector('[data-progress]')

        const horizontal = gsap.to(track, {
          x: () => -getAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${getAmount()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // 底部进度金线
              if (progressBar) gsap.set(progressBar, { scaleX: self.progress })
              // 卡片 rotateY 随滚动速度微倾 ±3°
              const v = gsap.utils.clamp(-3, 3, self.getVelocity() / 600)
              gsap.to(track.querySelectorAll('[data-num-card]'), {
                rotateY: v,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto',
              })
            },
          },
        })

        // 每张卡进入视口中心时触发一次计数器（1.6s）
        track.querySelectorAll<HTMLElement>('[data-num-card]').forEach((card) => {
          const numEl = card.querySelector<HTMLElement>('[data-num-value]')
          if (!numEl) return
          const target = Number(numEl.dataset.numValue)
          const suffix = numEl.dataset.suffix ?? ''
          const counter = { v: 0 }
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: horizontal,
            start: 'center 65%',
            once: true,
            onEnter: () => {
              gsap.to(counter, {
                v: target,
                duration: 1.6,
                ease: 'power2.out',
                onUpdate: () => {
                  numEl.textContent = `${Math.round(counter.v)}${suffix}`
                },
              })
            },
          })
        })

        // 奖杯背景慢速视差
        gsap.to(root.querySelector('[data-trophy]'), {
          x: -160,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 1 },
        })
      })

      // 移动端：垂直堆叠 + 简单入场
      mm.add('(max-width: 767px)', () => {
        track.querySelectorAll<HTMLElement>('[data-num-card]').forEach((card) => {
          const numEl = card.querySelector<HTMLElement>('[data-num-value]')
          const target = Number(numEl?.dataset.numValue ?? 0)
          const suffix = numEl?.dataset.suffix ?? ''
          const counter = { v: 0 }
          gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 82%',
                once: true,
                onEnter: () => {
                  if (!numEl) return
                  gsap.to(counter, {
                    v: target,
                    duration: 1.6,
                    ease: 'power2.out',
                    onUpdate: () => {
                      numEl.textContent = `${Math.round(counter.v)}${suffix}`
                    },
                  })
                },
              },
            },
          )
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-obsidian py-24 md:flex md:min-h-[100dvh] md:flex-col md:justify-center md:py-0">
      {/* 背景：金奖杯慢速视差（20% 透明度） */}
      <img
        data-trophy
        src="/trophy-gold.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 w-[46vw] max-w-[560px] opacity-20 md:-right-8"
      />

      <div className="flex h-full flex-col md:flex-row md:items-center">
        {/* 左侧固定竖排标签 */}
        <div className="shrink-0 px-6 md:w-[220px] md:pl-10">
          <p className="flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold md:[writing-mode:vertical-rl]">
            <span className="inline-block h-0.5 w-6 bg-gold md:h-6 md:w-0.5" aria-hidden />
            BY THE NUMBERS
            <span className="text-tx-low">/ 数字丰碑</span>
          </p>
        </div>

        {/* 横向数字卡轨道 */}
        <div
          ref={trackRef}
          className="mt-10 flex flex-col gap-6 px-6 md:mt-0 md:flex-row md:flex-nowrap md:gap-10 md:pl-0 md:pr-[20vw]"
        >
          {CARDS.map((card) => (
            <div
              key={card.label}
              data-num-card
              className="shrink-0 rounded-[20px] border border-line bg-panel/85 p-8 backdrop-blur md:w-[400px] md:p-10"
            >
              <p className="text-gold-gradient font-display text-[clamp(3rem,8vw,6.5rem)] leading-none">
                <span data-num-value={card.value} data-suffix={card.suffix}>
                  0{card.suffix}
                </span>
              </p>
              <p className="mt-4 font-sans text-xl font-bold text-tx-hi">{card.label}</p>
              <p className="mt-2 text-sm leading-7 text-tx-mid">{card.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 底部进度细金线 */}
      <div className="absolute inset-x-10 bottom-8 hidden h-px bg-line md:block">
        <div data-progress className="h-full origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
      </div>
    </section>
  )
}
