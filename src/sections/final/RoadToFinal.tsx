import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'

gsap.registerPlugin(ScrollTrigger)

interface RoadNode {
  round: string
  /** 比分（如 "1–0"），状态节点为空 */
  score?: string
  /** 对阵描述（状态节点为空） */
  fixture?: string
  note: string
  /** 是否为该列最后一个节点（汇合时描边点亮） */
  final?: boolean
}

interface RoadColumnData {
  id: 'spain' | 'argentina'
  team: string
  en: string
  color: string
  nodes: RoadNode[]
}

const COLUMNS: RoadColumnData[] = [
  {
    id: 'spain',
    team: '西班牙',
    en: 'SPAIN',
    color: '#FF4136',
    nodes: [
      { round: '1/8 决赛 · 7/6', score: '1–0', fixture: '西班牙 vs 葡萄牙', note: "梅里诺 91' 绝杀" },
      { round: '半决赛 · 7/14', score: '2–0', fixture: '西班牙 vs 法国', note: '奥亚萨瓦尔点射 + 波罗建功' },
      { round: '状态', note: '连续 37 场 90 分钟不败 · 时隔 16 年重返决赛', final: true },
    ],
  },
  {
    id: 'argentina',
    team: '阿根廷',
    en: 'ARGENTINA',
    color: '#6FC3FF',
    nodes: [
      { round: '1/8 决赛 · 7/7', score: '3–2', fixture: '阿根廷 vs 埃及', note: '0-2 落后，11 分钟三球逆转' },
      { round: '1/4 决赛 · 7/12', score: '3–1', fixture: '阿根廷 vs 瑞士（加时）', note: '阿尔瓦雷斯加时世界波' },
      { round: '半决赛 · 7/15', score: '2–1', fixture: '阿根廷 vs 英格兰', note: "恩佐 85' 世界波 + 劳塔罗 92' 绝杀 · 梅西两助攻", final: true },
    ],
  },
]

/**
 * S4 晋级之路：双列对照 stepper（左西班牙红 / 右阿根廷天蓝），底部汇合金色奖杯。
 * 节点 y:40→0（stagger 0.15s）；连线 scaleY 依次生长；滚到底部奖杯 scale 0→1、
 * rotate -10°→0（back.out(1.6)）+ 金色光晕扩散；两列最后同时亮起描边，中间闪现 VS。
 */
export default function RoadToFinal() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 每列：节点入场 + 连线依次生长（stagger 0.15s） */
      root.querySelectorAll<HTMLElement>('[data-road-col]').forEach((col) => {
        const items = col.querySelectorAll<HTMLElement>('[data-road-item]')
        const colTl = gsap.timeline({
          scrollTrigger: { trigger: col, start: 'top 72%', once: true },
        })
        items.forEach((el, i) => {
          if (el.hasAttribute('data-road-conn')) {
            colTl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, i * 0.15)
          } else {
            colTl.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, i * 0.15)
          }
        })
      })

      /* 底部汇合：VS 闪现 → 奖杯弹入 → 光晕扩散 → 两列末节点描边点亮 */
      const trophyTl = gsap.timeline({
        scrollTrigger: { trigger: root.querySelector('[data-road-merge]'), start: 'top 85%', once: true },
      })
      trophyTl
        .fromTo('[data-road-vs]', { scale: 2.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0)
        .to('[data-road-vs]', { opacity: 0.35, duration: 0.1, ease: 'power1.in' }, 0.55)
        .to('[data-road-vs]', { opacity: 1, duration: 0.2, ease: 'power1.out' }, 0.65)
        .fromTo(
          '[data-road-trophy]',
          { scale: 0, rotate: -10 },
          { scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.6)' },
          0.15,
        )
        .fromTo(
          '[data-road-halo]',
          { scale: 0.4, opacity: 0.7 },
          { scale: 1.7, opacity: 0, duration: 1.3, ease: 'power2.out' },
          0.35,
        )
        .to(
          '[data-final-node]',
          { borderColor: 'rgba(245,196,82,0.65)', boxShadow: '0 0 30px rgba(245,196,82,0.14)', duration: 0.5 },
          0.55,
        )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* 中央对决渐变微光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[560px] -translate-x-1/2 opacity-[0.05] blur-2xl"
        style={{ background: 'linear-gradient(90deg, #FF4136, #04060F 50%, #6FC3FF)' }}
      />

      <div className="container-x relative">
        <SectionHead
          kickerEn="ROAD TO THE FINAL"
          kickerZh="晋级之路"
          title="两条路，汇成新泽西一夜"
          description="仅列关键战役——从 1/8 决赛到半决赛，两支决赛球队各自的来路。"
        />

        <div className="grid gap-14 md:grid-cols-2 md:gap-10 lg:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.id} data-road-col={col.id}>
              {/* 列头 */}
              <div className="mb-8 flex items-baseline gap-3">
                <h3 className="font-sans text-2xl font-black text-tx-hi">{col.team}</h3>
                <span className="font-grotesk text-xs uppercase tracking-datalabel" style={{ color: col.color }}>
                  {col.en}
                </span>
                <span className="ml-auto h-px flex-1 self-center" style={{ background: `linear-gradient(to right, ${col.color}55, transparent)` }} aria-hidden />
              </div>

              {/* 节点 */}
              <div className="flex flex-col">
                {col.nodes.map((node, i) => (
                  <div key={node.round}>
                    {i > 0 && (
                      <div
                        data-road-item
                        data-road-conn
                        aria-hidden
                        className="mx-auto my-0 h-9 w-px origin-top"
                        style={{ background: `linear-gradient(to bottom, ${col.color}66, ${col.color}1f)` }}
                      />
                    )}
                    <div
                      data-road-item
                      {...(node.final ? { 'data-final-node': '' } : {})}
                      className="rounded-2xl border border-line bg-panel/85 p-5 backdrop-blur md:p-6"
                    >
                      <p className="font-grotesk text-[0.72rem] font-medium uppercase tracking-datalabel" style={{ color: col.color }}>
                        {node.round}
                      </p>
                      {node.score ? (
                        <p className="mt-2.5 flex flex-wrap items-baseline gap-x-3 font-sans text-lg font-bold text-tx-hi">
                          {node.fixture}
                          <span className="font-display text-2xl leading-none text-gold">{node.score}</span>
                        </p>
                      ) : (
                        <p className="mt-2.5 font-sans text-lg font-bold leading-7 text-tx-hi">{node.note}</p>
                      )}
                      {node.score && <p className="mt-1.5 text-sm leading-7 text-tx-mid">{node.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 底部汇合：VS + 金色奖杯 */}
        <div data-road-merge className="mt-16 flex flex-col items-center md:mt-20">
          <span data-road-vs className="text-gold-gradient font-display text-4xl leading-none md:text-5xl">
            VS
          </span>
          <div className="relative mt-6">
            <div
              data-road-halo
              aria-hidden
              className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(245,196,82,0.5), transparent 70%)' }}
            />
            <img
              data-road-trophy
              src="/trophy-gold.png"
              alt="世界杯奖杯"
              className="relative h-44 w-auto will-change-transform md:h-56"
              style={{ filter: 'drop-shadow(0 0 36px rgba(245,196,82,0.35))' }}
            />
          </div>
          <p className="mt-6 text-center text-sm text-tx-mid">
            7月19日 · 新泽西 MetLife 体育场 · 两队史上第一次在决赛相遇
          </p>
        </div>
      </div>
    </section>
  )
}
