import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import SectionHead from '@/components/SectionHead'
import ScorePill from '@/components/ScorePill'
import Tag from '@/components/Tag'

gsap.registerPlugin(ScrollTrigger)

const BIG = [
  {
    img: '/match-nor-bra.png',
    meta: '1/8 决赛 · 7/5 · MetLife',
    home: '挪威',
    away: '巴西',
    hs: 2,
    as: 1,
    desc: '本届最大冷门：哈兰德 79’/90’ 双响逆转，内马尔百分钟点球无用，赛后含泪退役。',
    tag: '最大冷门',
    anchor: 'nor-bra',
  },
  {
    img: '/match-arg-egy.png',
    meta: '1/8 决赛 · 7/7',
    home: '阿根廷',
    away: '埃及',
    hs: 3,
    as: 2,
    desc: '0-2 落后、梅西失点 + VAR 争议，随后 11 分钟三球：罗梅罗 79’、梅西 83’、恩佐 92’。',
    tag: '11分钟三球',
    anchor: 'arg-egy',
  },
]

const SMALL = [
  { home: '德国', away: '巴拉圭', score: '点球 3-4', note: '四冠王首轮出局' },
  { home: '阿根廷', away: '佛得角', score: '3-2', note: '第 1 对第 67' },
  { home: '西班牙', away: '葡萄牙', score: '1-0', note: 'C 罗谢幕' },
]

/** S6 经典战役预览：2 张大战役卡 + 1 行 3 个小条目 */
export default function MatchesPreview() {
  const rootRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 大卡图片 scrub 视差：scale 1.08 → 1 */
      root.querySelectorAll('[data-match-img]').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      /* 内容入场 */
      gsap.fromTo(
        root.querySelectorAll('[data-match-card]'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="container-x py-24 md:py-36">
      <SectionHead kickerEn="EPIC NIGHTS" kickerZh="经典战役" title="8 个不眠之夜" />

      {/* 2 张大战役卡 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {BIG.map((m) => (
          <div
            key={m.anchor}
            data-match-card
            data-cursor
            onClick={() => navigate(`/matches#${m.anchor}`)}
            className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-line bg-panel transition-colors duration-300 hover:border-gold/50"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                data-match-img
                src={m.img}
                alt={`${m.home} vs ${m.away} 战役插画`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
              <div className="absolute left-4 top-4">
                <Tag>{m.tag}</Tag>
              </div>
            </div>
            <div className="relative p-6 md:p-8">
              <p className="font-grotesk text-[0.72rem] uppercase tracking-datalabel text-tx-low">{m.meta}</p>
              <div className="mt-3">
                <ScorePill home={m.home} away={m.away} homeScore={m.hs} awayScore={m.as} />
              </div>
              <p className="mt-4 text-sm leading-7 text-tx-mid">{m.desc}</p>
              <p className="mt-4 flex items-center gap-2 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                阅读全场 <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3 个小条目 */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {SMALL.map((m) => (
          <button
            key={`${m.home}-${m.away}`}
            type="button"
            data-match-card
            onClick={() => navigate('/matches')}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-6 py-5 text-left transition-colors hover:border-gold/40"
          >
            <div>
              <p className="font-sans text-base font-bold text-tx-hi">
                {m.home} <span className="mx-1 font-display text-gold">{m.score}</span> {m.away}
              </p>
              <p className="mt-1 text-xs text-tx-low">{m.note}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-tx-low transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
          </button>
        ))}
      </div>
    </section>
  )
}
