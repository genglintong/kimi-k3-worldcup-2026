import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail } from 'lucide-react'
import Tag from '@/components/Tag'
import ScorePill from '@/components/ScorePill'

gsap.registerPlugin(ScrollTrigger)

const TAGS = ['人口约 52-60 万', '史上闯入淘汰赛的最小国家']

const GROUP_RESULTS = [
  { home: '佛得角', away: '西班牙', homeScore: 0, awayScore: 0 },
  { home: '佛得角', away: '乌拉圭', homeScore: 2, awayScore: 2 },
  { home: '佛得角', away: '沙特', homeScore: 0, awayScore: 0 },
]

/** 史诗段落三句：按句渐入（stagger 0.2s） */
const EPIC_SENTENCES = [
  '32 强战对世界第一阿根廷：两度落后、两度扳平——Cabral 第 103 分钟轰出世界波，',
  '直到第 111 分钟一记乌龙才让比分定格在 2-3。',
  '这险些成为世界杯淘汰赛史上最大的冷门。',
]

/** 温情卡金色描边呼吸（内联 <style>，作用域类名，避免改动全局样式） */
const WARM_CARD_STYLE = `
@keyframes nc-cpv-breathe {
  0%, 100% { border-color: rgba(245,196,82,0.25); box-shadow: 0 0 0 rgba(245,196,82,0); }
  50% { border-color: rgba(245,196,82,0.65); box-shadow: 0 0 28px rgba(245,196,82,0.12); }
}
.nc-cpv-breathe { animation: nc-cpv-breathe 2.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .nc-cpv-breathe { animation: none !important; } }
`

/**
 * S3 佛得角大专题卡（深蓝主题，镜像布局）：右图左文。
 * 比分胶囊 y:30→0 stagger 0.15s；史诗段落按句渐入（stagger 0.2s）；
 * 温情卡 scale 0.94→1 延迟入场 + 金色描边呼吸；图片自右侧 clip-path 揭幕。
 */
export default function CapeVerdeFeature() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 图片自右侧揭幕（镜像） */
      gsap.fromTo(
        '[data-cpv="img"]',
        { clipPath: 'inset(0 0 0 100%)' },
        {
          clipPath: 'inset(0 0 0 0%)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '[data-cpv="img"]', start: 'top 75%', once: true },
        },
      )
      /* Tag scale 0→1 */
      gsap.fromTo('[data-cpv="tag"]', { scale: 0 }, {
        scale: 1,
        duration: 0.55,
        ease: 'back.out(1.7)',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-cpv="tags"]', start: 'top 80%', once: true },
      })
      /* 比分胶囊依次 y:30→0，stagger 0.15s */
      gsap.fromTo('[data-cpv="pill"]', { y: 30, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '[data-cpv="pills"]', start: 'top 82%', once: true },
      })
      /* 史诗段落按句渐入（opacity 0→1, y:14→0，stagger 0.2s） */
      gsap.fromTo('[data-cpv="sentence"]', { y: 14, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: { trigger: '[data-cpv="epic"]', start: 'top 82%', once: true },
      })
      /* 温情卡 scale 0.94→1, opacity 0→1 延迟入场 */
      gsap.fromTo(
        '[data-cpv="warm"]',
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.25,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cpv="warm"]', start: 'top 85%', once: true },
        },
      )
      /* 标题与注释渐入 */
      gsap.fromTo('[data-cpv="fade"]', { y: 24, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-cpv="body"]', start: 'top 80%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden py-24 md:py-36">
      <style>{WARM_CARD_STYLE}</style>
      {/* 深蓝环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-16 h-[540px] w-[540px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(43,77,190,0.12), transparent 70%)' }}
      />

      <div className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-[45fr_55fr] lg:gap-16">
          {/* 左文 */}
          <div data-cpv="body">
            <div data-cpv="tags" className="flex flex-wrap gap-2.5">
              {TAGS.map((t) => (
                <span key={t} data-cpv="tag" className="inline-block">
                  <Tag tone="volt">{t}</Tag>
                </span>
              ))}
            </div>

            <h2
              data-cpv="fade"
              className="mt-7 font-sans text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.15] tracking-[0.02em] text-tx-hi"
            >
              佛得角：差一点掀翻卫冕冠军
            </h2>

            {/* 小组赛战报条（三枚比分胶囊） */}
            <div data-cpv="pills" className="mt-7 flex flex-wrap items-center gap-2.5">
              {GROUP_RESULTS.map((r) => (
                <div key={r.away} data-cpv="pill">
                  <ScorePill home={r.home} away={r.away} homeScore={r.homeScore} awayScore={r.awayScore} />
                </div>
              ))}
              <span data-cpv="pill" className="text-sm font-medium text-volt">
                三连平不败出线
              </span>
            </div>

            {/* 史诗段落（按句渐入） */}
            <p data-cpv="epic" className="mt-7 text-base leading-[1.85] text-tx-mid">
              {EPIC_SENTENCES.map((s, i) => (
                <span
                  key={i}
                  data-cpv="sentence"
                  className={`block ${i === EPIC_SENTENCES.length - 1 ? 'font-bold text-tx-hi' : ''}`}
                >
                  {s}
                </span>
              ))}
            </p>

            {/* 温情卡（金描边 + 呼吸） */}
            <div data-cpv="warm" className="nc-cpv-breathe mt-8 rounded-2xl border border-gold/40 bg-panel p-5 md:p-6">
              <p className="flex items-center gap-2 font-grotesk text-[0.72rem] font-medium uppercase tracking-datalabel text-gold">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                Warm story / 温情爆款
              </p>
              <p className="mt-3 text-sm leading-7 text-tx-mid">
                40 岁门将 Vozinha 单场 8-10 次扑救高接低挡；而国脚 Pico Lopes 的招募故事——一封
                <span className="font-bold text-gold"> LinkedIn 私信</span>
                ——成了本届最出圈的温情爆款。
              </p>
            </div>

            <p data-cpv="fade" className="mt-5 text-xs leading-6 text-tx-low">
              小组赛与 32 强战战报 · 统计截至 2026-07-16
            </p>
          </div>

          {/* 右图（镜像） */}
          <div data-cpv="img" className="overflow-hidden rounded-[24px] border border-volt/20">
            <img
              src="/newcomer-capeverde.png"
              alt="佛得角 40 岁门将 Vozinha 门前怒吼、蓝色防线众志成城的插画"
              className="aspect-[16/9] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
