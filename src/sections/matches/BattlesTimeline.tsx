import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, Flame, Plus } from 'lucide-react'
import SectionHead from '@/components/SectionHead'
import ScorePill from '@/components/ScorePill'
import Tag from '@/components/Tag'
import { BATTLES } from '@/sections/matches/data'
import type { Battle } from '@/sections/matches/data'

gsap.registerPlugin(ScrollTrigger)

/** 事件流 Tag：展开后 scale 0→1，stagger 0.06s，弹性回位 */
const tagListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
}
const tagItemVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 420, damping: 19 } },
}

/** 冷门指数条：5 格阶梯。折叠时暗态预览，展开时逐格点亮（stagger 0.08s）；5/5 用 espana 红，其余金色 */
function UpsetMeter({ value, active }: { value: number; active: boolean }) {
  const hot = value >= 5
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 font-grotesk text-[0.65rem] uppercase tracking-datalabel text-tx-low">
        <Flame className={`h-3 w-3 ${hot ? 'text-espana' : 'text-gold'}`} aria-hidden />
        冷门指数
        <span className={`font-display text-[0.85rem] tracking-normal ${hot ? 'text-espana' : 'text-gold'}`}>{value}/5</span>
      </p>
      <div className="flex items-end gap-1" aria-label={`冷门指数 ${value} / 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < value
          return (
            <motion.span
              key={i}
              initial={false}
              animate={
                active && filled
                  ? { opacity: 1, scale: [1, 1.45, 1] }
                  : { opacity: filled ? 0.45 : 0.14, scale: 1 }
              }
              transition={{ duration: 0.45, delay: active && filled ? 0.3 + i * 0.08 : 0, ease: 'easeOut' }}
              className={`w-5 origin-bottom rounded-[3px] ${
                filled ? (hot ? 'bg-espana shadow-[0_0_10px_rgba(255,65,54,0.45)]' : 'bg-gold shadow-[0_0_10px_rgba(245,196,82,0.35)]') : 'bg-tx-low'
              }`}
              style={{ height: `${10 + i * 4}px` }}
            />
          )
        })}
      </div>
    </div>
  )
}

interface BattleCardProps {
  battle: Battle
  open: boolean
  onToggle: () => void
}

/** 战役卡：默认折叠（轮次 Tag + 日期/球场 + ScorePill + 钩子 + 冷门指数条 + 展开按钮），点击展开完整战报 */
function BattleCard({ battle: b, open, onToggle }: BattleCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-[20px] border bg-panel transition-[border-color,transform] duration-300 hover:-translate-y-1 ${
        open ? 'border-gold/40 shadow-gold-glow' : 'border-line hover:border-gold/40'
      }`}
    >
      {/* 卡头（折叠态全部信息 + 展开触发） */}
      <button
        type="button"
        data-cursor
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${b.id}-panel`}
        className="block w-full p-6 text-left md:p-8"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Tag tone="gold">{b.round}</Tag>
          {b.upsetTag && (
            <span className="inline-flex items-center rounded-full border border-espana/60 px-3 py-1 font-grotesk text-[0.72rem] font-medium uppercase tracking-datalabel text-espana">
              {b.upsetTag}
            </span>
          )}
          <span className="font-grotesk text-[0.72rem] uppercase tracking-datalabel text-tx-low">
            {b.dateLabel}
            {b.venue ? ` · ${b.venue}` : ''}
            {b.extra ? ` · ${b.extra}` : ''}
          </span>
        </div>

        <div className="mt-5">
          <ScorePill home={b.home} away={b.away} homeScore={b.homeScore} awayScore={b.awayScore} penaltyNote={b.penaltyNote} />
        </div>

        <p className="mt-4 max-w-[58ch] text-sm leading-7 text-tx-mid md:text-[0.95rem]">{b.hook}</p>

        <div className="mt-6 flex items-end justify-between gap-4">
          <UpsetMeter value={b.upset} active={open} />
          <span className="flex shrink-0 items-center gap-2 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-gold">
            {open ? '收起战报' : '展开战报'}
            <motion.span
              initial={false}
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/50"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </motion.span>
          </span>
        </div>
      </button>

      {/* 展开区：完整战报 + 事件流 + 配图（手风琴，同时仅一张展开） */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="report"
            id={`${b.id}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.645, 0.045, 0.355, 1] as [number, number, number, number] }}
            onAnimationComplete={() => ScrollTrigger.refresh()}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <div className="mb-6 h-px bg-gradient-to-r from-gold/40 via-line to-transparent" aria-hidden />

              <p className="max-w-[68ch] text-sm leading-[1.9] text-tx-hi/90 md:text-[0.95rem]">{b.report}</p>

              {/* 关键分钟事件流 */}
              <motion.div
                className="mt-5 flex flex-wrap gap-2"
                variants={tagListVariants}
                initial="hidden"
                animate="show"
                aria-label="关键分钟事件"
              >
                {b.events.map((e) => (
                  <motion.span key={e.label} variants={tagItemVariants} className="inline-flex">
                    <Tag tone={e.tone}>{e.label}</Tag>
                  </motion.span>
                ))}
              </motion.div>

              {/* 配图：clip-path 自上而下揭幕 */}
              <motion.div
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="mt-6 overflow-hidden rounded-xl border border-line"
              >
                <img src={b.img} alt={b.imgAlt} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              </motion.div>

              {/* 交叉链接（德国/巴拉圭卡 → 新军物语） */}
              {b.crossLink && (
                <Link
                  to={b.crossLink.to}
                  className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-volt/30 bg-volt/5 px-5 py-4 transition-colors hover:border-volt/60 hover:bg-volt/10"
                >
                  <p className="text-xs leading-6 text-tx-mid md:text-sm">{b.crossLink.text}</p>
                  <ArrowRight className="h-4 w-4 shrink-0 text-volt transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

interface BattlesTimelineProps {
  /** 锚点命中的战役 id（来自 /matches#xxx）：自动展开该卡 */
  anchorOpenId?: string
}

/**
 * S2 战役时间线：中央金色主线（移动端线在左 24px），卡片左右交替。
 * 主线 scaleY 跟随滚动 scrub；节点到达时弹现 + 金色脉冲扩散；
 * 左卡 x:-60→0 / 右卡 x:60→0 入场；卡片手风琴展开（同时仅一张）。
 */
export default function BattlesTimeline({ anchorOpenId }: BattlesTimelineProps) {
  const rootRef = useRef<HTMLElement>(null)
  const validAnchor = anchorOpenId && BATTLES.some((b) => b.id === anchorOpenId) ? anchorOpenId : null
  const [openId, setOpenId] = useState<string | null>(validAnchor)

  /* 锚点变化（如同页内点击 #xxx）时在渲染期间同步展开（React 推荐的 adjust-state-during-render） */
  const [prevAnchor, setPrevAnchor] = useState<string | null>(validAnchor)
  if (prevAnchor !== validAnchor) {
    setPrevAnchor(validAnchor)
    if (validAnchor) setOpenId(validAnchor)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 主线：scaleY 0→1（origin top）跟随滚动 scrub */
      gsap.fromTo(root.querySelector('[data-tl-line]'), { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: { trigger: root.querySelector('[data-tl-track]'), start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
      })

      /* 节点圆点：到达时 scale 0→1（back.out(2)）+ 金色脉冲扩散 */
      root.querySelectorAll<HTMLElement>('[data-tl-node]').forEach((node) => {
        const pulse = node.querySelector('[data-tl-pulse]')
        const tl = gsap.timeline({ scrollTrigger: { trigger: node, start: 'top 80%', once: true } })
        tl.fromTo(node, { scale: 0 }, { scale: 1, duration: 0.55, ease: 'back.out(2)' })
        if (pulse) {
          tl.fromTo(pulse, { scale: 0.6, opacity: 0.9 }, { scale: 3, opacity: 0, duration: 1.1, ease: 'power2.out' }, 0.1)
        }
      })

      /* 卡片与对侧日期入场：桌面左右相向，移动端统一从右侧 */
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        root.querySelectorAll<HTMLElement>('[data-tl-card]').forEach((card) => {
          const fromX = card.dataset.side === 'left' ? -60 : 60
          gsap.fromTo(
            card,
            { x: fromX, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%', once: true } },
          )
        })
        root.querySelectorAll<HTMLElement>('[data-tl-date]').forEach((date) => {
          const fromX = date.dataset.side === 'left' ? -40 : 40
          gsap.fromTo(
            date,
            { x: fromX, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: date, start: 'top 85%', once: true } },
          )
        })
      })
      mm.add('(max-width: 767px)', () => {
        root.querySelectorAll<HTMLElement>('[data-tl-card]').forEach((card) => {
          gsap.fromTo(
            card,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } },
          )
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id))

  return (
    <section ref={rootRef} id="battles" className="container-x scroll-mt-20 py-24 md:py-36">
      <SectionHead
        kickerEn="TIMELINE"
        kickerZh="战役时间线"
        title="八场战役，一线串起"
        description="按时间倒序排列，半决赛在前。点击任意战役卡，展开完整战报、关键分钟事件流与配图。比分与事件综合自多源公开报道，截至 2026-07-16（半决赛后）。"
      />

      {/* 时间线轨道 */}
      <div data-tl-track className="relative mt-4">
        {/* 主线：暗色底轨 + 金色 scrub 亮线（移动端左 24px，桌面居中） */}
        <div aria-hidden className="absolute inset-y-0 left-6 w-px -translate-x-1/2 bg-gold/15 md:left-1/2" />
        <div
          data-tl-line
          aria-hidden
          className="absolute inset-y-0 left-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-amber via-gold to-gold-deep shadow-[0_0_12px_rgba(245,196,82,0.35)] md:left-1/2"
        />

        {BATTLES.map((b, i) => {
          const cardLeft = i % 2 === 0
          return (
            <div
              key={b.id}
              id={b.id}
              className="relative mb-12 scroll-mt-28 pl-14 last:mb-0 md:mb-20 md:grid md:grid-cols-2 md:gap-x-24 md:pl-0"
            >
              {/* 节点圆点 + 脉冲 */}
              <span
                data-tl-node
                aria-hidden
                className="absolute left-6 top-10 z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center md:left-1/2"
              >
                <span data-tl-pulse className="absolute h-full w-full rounded-full bg-gold/70" />
                <span className="relative h-3.5 w-3.5 rounded-full bg-gold ring-4 ring-gold/25" />
              </span>

              {/* 桌面端对侧大日期（移动端由卡头元信息呈现日期） */}
              <div
                data-tl-date
                data-side={cardLeft ? 'right' : 'left'}
                className={`hidden md:flex md:row-start-1 md:flex-col md:justify-center ${
                  cardLeft ? 'md:col-start-2 md:items-start' : 'md:col-start-1 md:items-end md:text-right'
                }`}
              >
                <p className="text-gold-gradient font-display text-6xl leading-none xl:text-7xl">{b.dateBig}</p>
                <p className="mt-3 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-tx-low">
                  {b.round} · {b.roundEn}
                </p>
                {b.venue && (
                  <p className="mt-1.5 font-grotesk text-[0.72rem] uppercase tracking-datalabel text-tx-low/70">{b.venue}</p>
                )}
              </div>

              {/* 战役卡（外层包裹供 GSAP 入场，内层卡片自带 hover 位移，避免 transform 冲突） */}
              <div
                data-tl-card
                data-side={cardLeft ? 'left' : 'right'}
                className={cardLeft ? 'md:col-start-1 md:row-start-1' : 'md:col-start-2 md:row-start-1'}
              >
                <BattleCard battle={b} open={openId === b.id} onToggle={() => toggle(b.id)} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
