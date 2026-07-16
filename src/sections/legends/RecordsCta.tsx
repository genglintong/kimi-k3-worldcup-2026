import { useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { STATS_AS_OF } from '@/lib/constants'

/** 更多纪录带 */
const RECORDS = [
  { figure: '皮克福德 · 18 场', label: '超希尔顿成英格兰队史世界杯出场王' },
  { figure: 'Gilberto Mora · 17 岁', label: '贝利之后最年轻的淘汰赛首发（墨西哥）' },
  { figure: '皇马球员 · 19 球', label: '创单俱乐部单届进球纪录' },
  { figure: '奥乔亚', label: '首位入选 6 届世界杯名单者' },
]

/**
 * S7 更多纪录带（34s 循环走马灯，悬停暂停）+ CTA → /matches。
 */
export default function RecordsCta() {
  const navigate = useNavigate()

  return (
    <section className="relative border-t border-line bg-obsidian">
      {/* 纪录走马灯 */}
      <div className="marquee-paused overflow-hidden border-b border-line py-10">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10" style={{ animationDuration: '34s' }}>
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className="flex items-center gap-10" aria-hidden={copy > 0}>
                {RECORDS.map((r) => (
                  <span key={`${copy}-${r.figure}`} className="flex shrink-0 items-center gap-4">
                    <span className="font-display text-2xl leading-none text-gold md:text-3xl">{r.figure}</span>
                    <span className="text-sm leading-6 text-tx-mid md:text-base">{r.label}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/40" aria-hidden />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA → 经典战役 */}
      <div data-reveal className="container-x flex flex-col items-center py-24 text-center md:py-32">
        <p className="font-grotesk text-xs font-medium uppercase tracking-kicker text-tx-low">
          纪录数据{STATS_AS_OF} · 半决赛后
        </p>
        <p className="mt-6 max-w-[26ch] font-sans text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.3] text-tx-hi">
          纪录已就位，
          <span className="text-gold-gradient">战役才刚开始</span>
        </p>
        <button
          type="button"
          data-cursor
          onClick={() => navigate('/matches')}
          className="btn-shine group mt-10 inline-flex items-center gap-3 rounded-full border border-gold/50 bg-gold/10 px-8 py-4 font-sans text-base font-bold text-gold transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-obsidian"
        >
          进入经典战役
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  )
}
