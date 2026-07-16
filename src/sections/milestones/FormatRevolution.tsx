import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scale } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

interface Step {
  n: string
  title: string
  desc: string
}

const STEPS: Step[] = [
  { n: '01', title: '104 场比赛', desc: '史上最长赛程 39 天（6.11–7.19），新增 32 强轮次。' },
  { n: '02', title: '12 个小组', desc: '48 队分为 12 个小组——2006 年以来新军最多的一届由此诞生。' },
  { n: '03', title: '新规则', desc: '世界杯史上首次：小组赛同分先看相互战绩。规则与规模，一起被改写。' },
]

/** Step 1 舞台：Anton 巨字 104 + 2026(104 场，金) vs 2022(64 场，灰 61%) 对比条 */
function VisualBars({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <p
        className={`text-gold-gradient font-display leading-none ${
          compact ? 'text-[clamp(4.5rem,20vw,7rem)]' : 'text-[clamp(6rem,14vw,12rem)]'
        }`}
      >
        104
      </p>
      <p className="mt-2 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-tx-low">
        Matches / 场比赛
      </p>
      <div className="mt-9 w-full max-w-[420px] space-y-4">
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="font-medium text-tx-hi">2026 · 美加墨</span>
            <span className="font-display text-xl text-gold">104 场</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/5">
            <div
              data-bar="gold"
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-gold-deep via-gold to-amber"
            />
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="text-tx-low">2022 · 卡塔尔</span>
            <span className="font-display text-xl text-tx-mid">64 场</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/5">
            <div data-bar="gray" className="h-full w-[61%] origin-left rounded-full bg-tx-low/50" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Step 2 舞台：12 枚发光小组方块（A–L） */
function VisualGroups({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {GROUPS.map((g) => (
          <div
            key={g}
            data-group-tile
            className={`flex items-center justify-center rounded-2xl border border-gold/30 bg-panel font-display text-gold shadow-gold-glow ${
              compact ? 'h-14 w-14 text-2xl' : 'h-16 w-16 text-3xl md:h-20 md:w-20'
            }`}
          >
            {g}
          </div>
        ))}
      </div>
      <p className="mt-8 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-tx-low">
        12 Groups / 12 个小组 · A–L
      </p>
    </div>
  )
}

/** Step 3 舞台：金色法典卡片 */
function VisualCodex() {
  return (
    <div className="flex h-full items-center justify-center" style={{ perspective: '1000px' }}>
      <div
        data-codex
        className="w-full max-w-[400px] rounded-[20px] border border-gold/40 bg-gradient-to-b from-gold/[0.14] to-panel p-8 shadow-gold-glow"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15">
            <Scale className="h-5 w-5 text-gold" />
          </span>
          <p className="font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-gold">
            New Rule / 新规则
          </p>
        </div>
        <p className="text-gold-gradient mt-6 font-display text-[2rem] leading-tight md:text-4xl">同分先看相互战绩</p>
        <p className="mt-4 text-sm leading-7 text-tx-mid">世界杯史上首次采用 · 小组赛排名新规</p>
      </div>
    </div>
  )
}

function StepText({ step }: { step: Step }) {
  return (
    <div>
      <p className="font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">Step {step.n}</p>
      <h3 className="mt-3 font-sans text-3xl font-black text-tx-hi md:text-4xl">{step.title}</h3>
      <p className="mt-4 max-w-[46ch] text-base leading-[1.85] text-tx-mid">{step.desc}</p>
    </div>
  )
}

/**
 * S2 赛制革命：32 → 48（钉住三步叙事，200vh 滚动区间）。
 * 桌面：ScrollTrigger pin + scrub，左侧巨型数字舞台（104 巨字 / 12 小组方块 / 法典卡片
 * 三层叠放随步骤切换，trophy-gold.png 背景微光），右侧三步文本叠放 + 进度点。
 * 移动端：垂直堆叠三步卡片。
 */
export default function FormatRevolution() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      /* —— 桌面：钉住 + scrub —— */
      mm.add('(min-width: 768px)', () => {
        const desktop = root.querySelector<HTMLElement>('[data-mq="desktop"]')
        if (!desktop) return
        const q = gsap.utils.selector(desktop)

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: desktop,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        // Step 1：金条 scaleX 0→1
        tl.fromTo(q('[data-bar="gold"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, 0.1)

        // → Step 2：旧文本 y:-40 淡出，新文本 y:40→0；舞台切换；方块从中心爆散
        tl.to(q('[data-d-text="1"]'), { y: -40, opacity: 0, duration: 0.5 }, 0.9)
          .fromTo(q('[data-d-text="2"]'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.9)
          .to(q('[data-d-stage="1"]'), { opacity: 0, scale: 0.94, duration: 0.5 }, 0.9)
          .fromTo(q('[data-d-stage="2"]'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.95)
          .fromTo(
            q('[data-group-tile]'),
            { scale: 0 },
            { scale: 1, duration: 0.4, ease: 'back.out(1.7)', stagger: { each: 0.04, from: 'center' } },
            1.05,
          )
          .to(q('[data-dot="1"]'), { backgroundColor: 'rgba(255,255,255,0.15)', scale: 1, duration: 0.25 }, 0.9)
          .to(q('[data-dot="2"]'), { backgroundColor: '#F5C452', scale: 1.35, duration: 0.25 }, 0.9)

        // → Step 3：法典卡片 rotateY 90°→0
        tl.to(q('[data-d-text="2"]'), { y: -40, opacity: 0, duration: 0.5 }, 1.9)
          .fromTo(q('[data-d-text="3"]'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.9)
          .to(q('[data-d-stage="2"]'), { opacity: 0, scale: 0.94, duration: 0.5 }, 1.9)
          .fromTo(q('[data-d-stage="3"]'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.95)
          .fromTo(q('[data-codex]'), { rotateY: 90 }, { rotateY: 0, duration: 0.6, ease: 'power2.out' }, 2.05)
          .to(q('[data-dot="2"]'), { backgroundColor: 'rgba(255,255,255,0.15)', scale: 1, duration: 0.25 }, 1.9)
          .to(q('[data-dot="3"]'), { backgroundColor: '#F5C452', scale: 1.35, duration: 0.25 }, 1.9)

        // 尾部停留
        tl.to({}, { duration: 0.5 }, 2.65)
      })

      /* —— 移动端：垂直堆叠三步卡片 —— */
      mm.add('(max-width: 767px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-m-step]')
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 82%', once: true },
            },
          )
          const goldBar = card.querySelector('[data-bar="gold"]')
          if (goldBar) {
            gsap.fromTo(
              goldBar,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 1.1,
                ease: 'power4.inOut',
                scrollTrigger: { trigger: card, start: 'top 78%', once: true },
              },
            )
          }
          const tiles = card.querySelectorAll('[data-group-tile]')
          if (tiles.length) {
            gsap.fromTo(
              tiles,
              { scale: 0 },
              {
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                stagger: { each: 0.04, from: 'center' },
                scrollTrigger: { trigger: card, start: 'top 78%', once: true },
              },
            )
          }
          const codex = card.querySelector('[data-codex]')
          if (codex) {
            gsap.fromTo(
              codex,
              { rotateY: 90 },
              {
                rotateY: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 78%', once: true },
              },
            )
          }
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="format" className="relative bg-obsidian">
      {/* —— 桌面：钉住舞台 —— */}
      <div data-mq="desktop" className="hidden md:block">
        <div className="flex h-[100dvh] items-center overflow-hidden">
          <div className="container-x grid w-full grid-cols-[1.1fr_1fr] items-center gap-14 lg:gap-20">
            {/* 左：巨型数字舞台（三层叠放） */}
            <div className="relative h-[560px]">
              <img
                src="/trophy-gold.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute -right-12 top-1/2 w-[400px] -translate-y-1/2 opacity-[0.14]"
              />
              <div data-d-stage="1" className="absolute inset-0">
                <VisualBars />
              </div>
              <div data-d-stage="2" className="absolute inset-0">
                <VisualGroups />
              </div>
              <div data-d-stage="3" className="absolute inset-0">
                <VisualCodex />
              </div>
            </div>

            {/* 右：步骤文本（叠放）+ 进度点 */}
            <div className="flex items-center gap-8">
              <div className="flex shrink-0 flex-col gap-3" aria-hidden>
                <span data-dot="1" className="h-2.5 w-2.5 rounded-full bg-gold" style={{ transform: 'scale(1.35)' }} />
                <span data-dot="2" className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span data-dot="3" className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <div className="relative h-[240px] flex-1">
                <div data-d-text="1" className="absolute inset-0">
                  <StepText step={STEPS[0]} />
                </div>
                <div data-d-text="2" className="absolute inset-0">
                  <StepText step={STEPS[1]} />
                </div>
                <div data-d-text="3" className="absolute inset-0">
                  <StepText step={STEPS[2]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* —— 移动端：垂直堆叠 —— */}
      <div className="container-x space-y-8 py-16 md:hidden">
        {STEPS.map((step, i) => (
          <div key={step.n} data-m-step className="rounded-[20px] border border-line bg-panel/60 p-6">
            <StepText step={step} />
            <div className="mt-8">
              {i === 0 && <VisualBars compact />}
              {i === 1 && <VisualGroups compact />}
              {i === 2 && <VisualCodex />}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
