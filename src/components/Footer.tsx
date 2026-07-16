import { Link } from 'react-router'
import { NAV_ITEMS, STATS_AS_OF } from '@/lib/constants'

/** 顶部双向走马灯带 */
function MarqueeBands() {
  const upper = 'SPAIN VS ARGENTINA · 7.19 · METLIFE STADIUM · '
  const lower = '传奇里程碑 · 2026 美加墨世界杯 · '
  return (
    <div className="marquee-paused overflow-hidden border-y border-line py-6" aria-hidden>
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee flex shrink-0">
          {[0, 1].map((i) => (
            <span key={i} className="text-stroke-gold pr-4 font-display text-4xl tracking-wide md:text-6xl">
              {upper.repeat(3)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex whitespace-nowrap">
        <div className="animate-marquee-reverse flex shrink-0">
          {[0, 1].map((i) => (
            <span key={i} className="pr-4 font-sans text-lg font-bold text-volt md:text-2xl">
              {lower.repeat(6)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 全站 Footer */
export default function Footer() {
  return (
    <footer className="relative z-10 mt-0 bg-obsidian" data-reveal>
      <MarqueeBands />
      <div className="container-x grid gap-12 py-16 md:grid-cols-3">
        {/* 页面导航 */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
            <span className="font-sans text-sm font-black text-tx-hi">
              传奇里程碑
              <span className="ml-2 font-grotesk text-[0.6rem] tracking-datalabel text-gold">MILESTONES·26</span>
            </span>
          </div>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2" aria-label="页脚导航">
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path} className="text-sm text-tx-mid transition-colors hover:text-gold">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 关键纪录速记 */}
        <div>
          <p className="mb-5 font-grotesk text-xs tracking-datalabel text-tx-low">KEY NUMBERS / 关键纪录</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['48', '参赛队 · 史上首届'],
              ['104', '场比赛 · 39 天'],
              ['650万+', '现场观众'],
              ['268', '总进球（约）'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="text-gold-gradient font-display text-3xl">{num}</p>
                <p className="mt-1 text-xs text-tx-mid">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 数据来源 */}
        <div>
          <p className="mb-5 font-grotesk text-xs tracking-datalabel text-tx-low">SOURCES / 数据来源</p>
          <p className="text-sm leading-7 text-tx-mid">
            数据综合自 ESPN / AP / Reuters / SI / Opta 公开报道，多源交叉验证。统计{STATS_AS_OF}；决赛尚未进行，本站为前瞻内容。
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-2 py-6 text-xs text-tx-low md:flex-row md:items-center">
          <p>数据综合自 ESPN / AP / Reuters / SI / Opta 公开报道，多源交叉验证 · 统计截至 2026-07-16 · 决赛尚未进行，本站为前瞻内容</p>
          <p className="font-grotesk tracking-datalabel">© 2026 MILESTONES·26</p>
        </div>
      </div>
    </footer>
  )
}
