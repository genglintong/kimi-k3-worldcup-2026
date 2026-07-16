import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { Landmark, MapPin, Trophy } from 'lucide-react'
import SectionHead from '@/components/SectionHead'

gsap.registerPlugin(ScrollTrigger)

type Country = '美国' | '加拿大' | '墨西哥'

interface City {
  name: string
  short: string
  country: Country
  x: number
  y: number
  role?: string
}

const COUNTRY_COLOR: Record<Country, string> = {
  美国: '#F5C452',
  加拿大: '#4DD8FF',
  墨西哥: '#3BFFB2',
}

/** 16 座主办城市（坐标与 public/map-northamerica.svg 圆点一致，viewBox 1600×1000） */
const CITIES: City[] = [
  { name: '温哥华', short: '温哥华', country: '加拿大', x: 548, y: 330 },
  { name: '西雅图', short: '西雅图', country: '美国', x: 558, y: 356 },
  { name: '旧金山湾区', short: '旧金山', country: '美国', x: 478, y: 478 },
  { name: '洛杉矶', short: '洛杉矶', country: '美国', x: 568, y: 625 },
  { name: '多伦多', short: '多伦多', country: '加拿大', x: 880, y: 490 },
  { name: '波士顿', short: '波士顿', country: '美国', x: 912, y: 515 },
  { name: '纽约 / 新泽西', short: '新泽西', country: '美国', x: 902, y: 545, role: '决赛 · 7.19 MetLife 体育场' },
  { name: '费城', short: '费城', country: '美国', x: 892, y: 560 },
  { name: '亚特兰大', short: '亚特兰大', country: '美国', x: 940, y: 690 },
  { name: '迈阿密', short: '迈阿密', country: '美国', x: 1092, y: 862, role: '季军战 · 7.18' },
  { name: '堪萨斯城', short: '堪萨斯城', country: '美国', x: 740, y: 560 },
  { name: '达拉斯', short: '达拉斯', country: '美国', x: 790, y: 680 },
  { name: '休斯顿', short: '休斯顿', country: '美国', x: 812, y: 732 },
  { name: '蒙特雷', short: '蒙特雷', country: '墨西哥', x: 795, y: 800 },
  { name: '墨西哥城', short: '墨西哥城', country: '墨西哥', x: 818, y: 915, role: '揭幕战 · 墨西哥 2-0 南非' },
  { name: '瓜达拉哈拉', short: '瓜达拉哈拉', country: '墨西哥', x: 765, y: 878 },
]

const FACTS = [
  { icon: MapPin, text: '16 座城市 · 16 座球场，横跨北美大陆' },
  { icon: Trophy, text: '墨西哥成为史上首个三度主办世界杯的国家' },
  { icon: Landmark, text: '阿兹特克球场成为首个举办三届世界杯的球场（本届承办揭幕战：墨西哥 2-0 南非）' },
]

/** 标志性城市在地图上的常亮标签（墨西哥城 / 新泽西 / 迈阿密） */
const LABEL_ANCHOR: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  墨西哥城: { dx: 0, dy: -26, anchor: 'middle' },
  新泽西: { dx: 22, dy: 6, anchor: 'start' },
  迈阿密: { dx: 0, dy: -26, anchor: 'middle' },
}

/**
 * S3 三国联办（ink 底）：左 55% 互动地图（路径描绘入场 + 城市点脉冲），
 * 右 45% 信息栈（事实列表 hover 高亮）。悬停城市点 → 浮出城市卡。
 */
export default function ThreeNations() {
  const rootRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const activeCity = activeIdx !== null ? CITIES[activeIdx] : null

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      /* 地图轮廓 stroke-dashoffset 描绘入场（2s，trigger 70%） */
      const outline = root.querySelector<SVGPathElement>('[data-map-outline]')
      if (outline) {
        const len = outline.getTotalLength()
        gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(outline, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        })
      }
      /* 国界虚线淡入 */
      gsap.fromTo(
        '[data-map-border]',
        { opacity: 0 },
        { opacity: 0.28, duration: 1.2, delay: 0.8, scrollTrigger: { trigger: root, start: 'top 70%', once: true } },
      )
      /* 城市点 scale 0→1, stagger 0.05, back.out(2) */
      gsap.fromTo(
        '[data-city-dot]',
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.05,
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        },
      )
      /* 城市标签淡入 */
      gsap.fromTo(
        '[data-city-label]',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, stagger: 0.15, delay: 1, scrollTrigger: { trigger: root, start: 'top 70%', once: true } },
      )
      /* 事实列表 x:40→0, stagger 0.1 */
      gsap.fromTo(
        '[data-fact]',
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: root, start: 'top 72%', once: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
        {/* 左：互动地图 */}
        <div className="relative">
          <svg viewBox="0 0 1600 1000" role="img" aria-label="2026 世界杯 16 座主办城市分布图" className="w-full">
            <defs>
              <radialGradient id="ms-dot" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#FFF3D6" />
                <stop offset="0.4" stopColor="#F5C452" />
                <stop offset="1" stopColor="#D9A03B" />
              </radialGradient>
            </defs>

            {/* 北美大陆极简地块 */}
            <path
              data-map-outline
              d="M200 330 L150 220 L330 150 L300 90 L560 70 L820 80 L900 150 L840 250 L740 240 L700 300 L780 340 L900 360 L980 400 L930 480 L870 500 L900 570 L960 620 L1010 680 L990 750 L1060 800 L1100 880 L1050 890 L960 800 L880 790 L830 830 L790 900 L850 960 L880 990 L800 940 L730 880 L670 810 L640 740 L610 720 L560 640 L500 560 L470 470 L500 400 L560 360 L530 300 L400 330 Z"
              fill="#0E1628"
              stroke="#F5C452"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* 国界示意（虚线） */}
            <g data-map-border stroke="#F5C452" strokeWidth="1" strokeDasharray="6 8" opacity="0.28" fill="none">
              <path d="M560 440 L900 445" />
              <path d="M612 722 L700 760 L790 898" />
            </g>

            {/* 16 座城市圆点（美=金 / 加=cyan / 墨=volt） */}
            {CITIES.map((city, i) => {
              const color = COUNTRY_COLOR[city.country]
              const iconic = Boolean(city.role)
              const hovered = activeIdx === i
              return (
                <g
                  key={city.name}
                  data-city-dot
                  style={{ transformBox: 'fill-box', transformOrigin: 'center', cursor: 'pointer' }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx((cur) => (cur === i ? null : cur))}
                  onClick={() => setActiveIdx((cur) => (cur === i ? null : i))}
                >
                  {/* 常亮脉冲（2s 呼吸，悬停加速） */}
                  <circle cx={city.x} cy={city.y} r={iconic ? 18 : 16} fill={color} opacity="0.18">
                    <animate
                      attributeName="r"
                      values={iconic ? '16;24;16' : '13;19;13'}
                      dur={hovered ? '0.9s' : '2s'}
                      repeatCount="indefinite"
                    />
                    <animate attributeName="opacity" values="0.28;0.08;0.28" dur={hovered ? '0.9s' : '2s'} repeatCount="indefinite" />
                  </circle>
                  {/* 悬停 ripple：光晕扩散一圈（0.8s 循环） */}
                  {hovered && (
                    <circle cx={city.x} cy={city.y} r="10" fill="none" stroke={color} strokeWidth="2" opacity="0.6">
                      <animate attributeName="r" from="10" to="38" dur="0.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* 内核 */}
                  <circle cx={city.x} cy={city.y} r={iconic ? 8 : 6} fill="url(#ms-dot)" stroke={color} strokeWidth="1.5" />
                  {/* 触控热区 */}
                  <circle cx={city.x} cy={city.y} r="30" fill="transparent" />
                </g>
              )
            })}

            {/* 标志性城市常亮标签 */}
            {CITIES.filter((c) => c.role).map((city) => {
              const a = LABEL_ANCHOR[city.short === '新泽西' ? '新泽西' : city.name] ?? { dx: 0, dy: -26, anchor: 'middle' as const }
              const color = COUNTRY_COLOR[city.country]
              return (
                <text
                  key={city.name}
                  data-city-label
                  x={city.x + a.dx}
                  y={city.y + a.dy}
                  textAnchor={a.anchor}
                  fill={color}
                  fontSize="24"
                  fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  {city.short}
                </text>
              )
            })}
          </svg>

          {/* 城市卡：悬停浮出（地图右上） */}
          <div className="pointer-events-none absolute right-1 top-1 md:right-4 md:top-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCity ? activeCity.name : 'default'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-line bg-obsidian/85 px-5 py-4 backdrop-blur"
              >
                {activeCity ? (
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: COUNTRY_COLOR[activeCity.country] }}
                      aria-hidden
                    />
                    <div>
                      <p className="font-sans text-sm font-bold text-tx-hi">{activeCity.name}</p>
                      <p className="mt-0.5 text-xs text-tx-mid">
                        {activeCity.country}
                        {activeCity.role && <span className="text-gold"> · {activeCity.role}</span>}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-tx-mid">
                    <span className="font-display text-base text-gold">16</span> 座城市 · 3 个主办国
                    <span className="mt-0.5 block text-tx-low">悬停圆点查看城市</span>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 图例 */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-tx-mid">
            {(Object.keys(COUNTRY_COLOR) as Country[]).map((c) => (
              <span key={c} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COUNTRY_COLOR[c] }} aria-hidden />
                {c}
              </span>
            ))}
            <span className="text-tx-low">常亮标签：墨西哥城（揭幕战）/ 新泽西（决赛）/ 迈阿密（季军战）</span>
          </div>
        </div>

        {/* 右：信息栈 */}
        <div>
          <SectionHead kickerEn="Three Nations" kickerZh="三国联办" title="史上第一次，三个国家共同举办" className="mb-8 md:mb-10" />
          <ul className="space-y-3">
            {FACTS.map((fact) => (
              <li
                key={fact.text}
                data-fact
                className="flex items-start gap-4 rounded-2xl border border-transparent px-5 py-4 transition-colors duration-300 hover:border-gold/25 hover:bg-white/[0.04]"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                  <fact.icon className="h-4 w-4 text-gold" />
                </span>
                <p className="text-sm leading-7 text-tx-hi md:text-base md:leading-8">{fact.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
