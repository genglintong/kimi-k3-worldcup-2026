import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import SectionHead from '@/components/SectionHead'

type Accent = 'gold' | 'cyan' | 'red'

interface PlayerCardData {
  name: string
  team: string
  img: string
  stat: number
  unit: string
  desc: string
  accent: Accent
}

const PAIR1_LEFT: PlayerCardData = {
  name: '贝林厄姆',
  team: '英格兰',
  img: '/portrait-bellingham.png',
  stat: 6,
  unit: '球',
  desc: '1/8 决赛对墨西哥 100 秒内梅开二度；1/4 决赛对挪威加时绝杀再梅开二度——1986 年马拉多纳之后，首位世界杯淘汰赛连续两场独中两元。',
  accent: 'gold',
}
const PAIR1_RIGHT: PlayerCardData = {
  name: '凯恩',
  team: '英格兰',
  img: '/portrait-kane.png',
  stat: 6,
  unit: '球',
  desc: '世界杯总进球 13 个，超越贝利（12）。',
  accent: 'gold',
}
const PAIR2_LEFT: PlayerCardData = {
  name: '哈兰德',
  team: '挪威',
  img: '/portrait-haaland.png',
  stat: 7,
  unit: '球',
  desc: '率挪威队史首进八强（含 2-1 淘汰巴西）；史上最快国家队 60 球（53 场）；连续 14 场国家队进球。',
  accent: 'cyan',
}
const PAIR2_RIGHT: PlayerCardData = {
  name: '亚马尔',
  team: '西班牙',
  img: '/portrait-yamal.png',
  stat: 19,
  unit: '岁',
  desc: '赛中度过 19 岁生日，西班牙进攻发动机；决赛日 19 岁零 6 天——直面梅西。',
  accent: 'red',
}

const ACCENT_CLASS: Record<Accent, { border: string; text: string; glow: string }> = {
  gold: {
    border: 'hover:border-gold/50',
    text: 'text-gold',
    glow: 'bg-[radial-gradient(closest-side,rgba(245,196,82,0.16),transparent)]',
  },
  cyan: {
    border: 'hover:border-albiceleste/50',
    text: 'text-albiceleste',
    glow: 'bg-[radial-gradient(closest-side,rgba(111,195,255,0.14),transparent)]',
  },
  red: {
    border: 'hover:border-espana/50',
    text: 'text-espana',
    glow: 'bg-[radial-gradient(closest-side,rgba(255,65,54,0.14),transparent)]',
  },
}

/** 视口内数字计数器（Framer Motion，1.6s） */
function PairCounter({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => String(Math.round(v)))

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] })
    return () => controls.stop()
  }, [inView, mv, value])

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
    </span>
  )
}

interface PairRowProps {
  left: PlayerCardData
  right: PlayerCardData
  /** 中央连接符：「&」（队友）或「×」（对决） */
  connector: string
  /** 连接注（如“史上首对同届各进 6+ 球的队友”） */
  note?: string
  title: string
  titleAccent: Accent
}

/** 单排 pair 卡：两侧对撞入场，悬停单侧提亮、对侧降透明度 50% */
function PairRow({ left, right, connector, note, title, titleAccent }: PairRowProps) {
  const [hovered, setHovered] = useState<'left' | 'right' | null>(null)
  const accent = ACCENT_CLASS[titleAccent]

  const renderCard = (p: PlayerCardData, side: 'left' | 'right') => {
    const a = ACCENT_CLASS[p.accent]
    const dim = hovered !== null && hovered !== side
    const dir = side === 'left' ? -80 : 80
    return (
      <motion.div
        initial={{ x: dir, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="will-change-transform"
      >
        <motion.article
          data-cursor
          onMouseEnter={() => setHovered(side)}
          onMouseLeave={() => setHovered(null)}
          animate={{ opacity: dim ? 0.5 : 1, scale: hovered === side ? 1.02 : 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`group overflow-hidden rounded-[20px] border border-line bg-panel transition-colors duration-300 ${a.border}`}
        >
          <div className="relative h-44 overflow-hidden md:h-52">
            <div aria-hidden className={`absolute bottom-0 left-1/2 h-3/4 w-3/4 -translate-x-1/2 blur-2xl ${a.glow}`} />
            <img
              src={p.img}
              alt={`${p.name}风格化剪影`}
              draggable={false}
              className="relative h-full w-full select-none object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-panel to-transparent" />
          </div>
          <div className="p-6">
            <p className="flex items-baseline justify-between gap-3">
              <span className="font-sans text-xl font-black text-tx-hi">
                {p.name}
                <span className="ml-2 text-sm font-medium text-tx-low">{p.team}</span>
              </span>
              <span className="font-display leading-none">
                <PairCounter value={p.stat} className={`text-5xl md:text-6xl ${a.text}`} />
                <span className="ml-1 font-sans text-lg font-bold text-tx-mid">{p.unit}</span>
              </span>
            </p>
            <p className="mt-4 text-sm leading-7 text-tx-mid">{p.desc}</p>
          </div>
        </motion.article>
      </motion.div>
    )
  }

  return (
    <div className="mt-14 first:mt-0">
      <p className={`flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker ${accent.text}`}>
        <span className={`inline-block h-0.5 w-6 ${titleAccent === 'red' ? 'bg-espana' : titleAccent === 'cyan' ? 'bg-albiceleste' : 'bg-gold'}`} aria-hidden />
        {title}
      </p>
      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        {renderCard(left, 'left')}
        {/* 中央连接符：scale 0→1 弹入 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 240, damping: 13, delay: 0.55 }}
          className="flex flex-col items-center gap-3 justify-self-center px-2 text-center md:max-w-[180px]"
        >
          <span className={`font-display text-6xl leading-none md:text-7xl ${accent.text}`}>{connector}</span>
          {note && <span className="text-sm font-bold leading-6 text-tx-mid">{note}</span>}
        </motion.div>
        {renderCard(right, 'right')}
      </div>
    </div>
  )
}

/**
 * S5 群星双 pair（锚点 #stars）。
 * Pair 1 英格兰双枪（金色，「&」）；Pair 2 新王对决（红蓝撞色，「×」）。
 */
export default function StarPairs() {
  return (
    <section id="stars" className="relative border-t border-line bg-ink py-24 md:py-36">
      <div className="container-x">
        <SectionHead
          kickerEn="Stars"
          kickerZh="群星"
          title="双枪与新王"
          description="纪录从不孤单——有人并肩刷新队史，有人隔场写下时代交接的注脚。"
        />
        <PairRow left={PAIR1_LEFT} right={PAIR1_RIGHT} connector="&" note="史上首对同届各进 6+ 球的队友。" title="英格兰双枪" titleAccent="gold" />
        <PairRow left={PAIR2_LEFT} right={PAIR2_RIGHT} connector="×" title="新王对决" titleAccent="red" />
      </div>
    </section>
  )
}
