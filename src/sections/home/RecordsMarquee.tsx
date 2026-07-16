import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RecordTile from '@/components/RecordTile'

gsap.registerPlugin(ScrollTrigger)

const ROW_UP = [
  { figure: '64 秒', label: '本届最快进球（巴拉圭 Galarza）' },
  { figure: '7-1', label: '本届最大比分（德国 vs 库拉索）' },
  { figure: '96 分钟', label: '淘汰赛最晚制胜球（马丁内利）' },
  { figure: '15 次', label: '单场扑救纪录（Eloy Room）' },
  { figure: '43 岁', label: '最年长参赛球员（克雷格·戈登）' },
]

const ROW_DOWN = [
  { figure: '22 年 183 天', label: '同场首发最大年龄差' },
  { figure: '6 届', label: '梅西 / C 罗 / 奥乔亚的参赛届数' },
  { figure: '50 球', label: '替补球员进球（占 18.6%）' },
  { figure: '44 年', label: '“决赛必有拜仁球员”定律终结' },
  { figure: '首次', label: '同分先看相互战绩新规' },
]

/**
 * S8 纪录速览墙：上下两行反向走马灯（上行 36s 正向 / 下行 44s 反向），
 * 悬停暂停；瓷贴入场 stagger 0.06s。
 */
export default function RecordsMarquee() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-record-row]'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: root, start: 'top 82%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="marquee-paused overflow-hidden border-y border-line bg-obsidian py-16">
      {/* 上行：正向 36s（4 份拷贝保证超宽屏无缝循环） */}
      <div data-record-row className="flex whitespace-nowrap">
        <div className="animate-marquee flex shrink-0 gap-4 pr-4" style={{ animationDuration: '36s' }}>
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} className="flex gap-4" aria-hidden={copy > 0}>
              {ROW_UP.map((r) => (
                <RecordTile key={`${copy}-${r.label}`} figure={r.figure} label={r.label} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* 下行：反向 44s */}
      <div data-record-row className="mt-4 flex whitespace-nowrap">
        <div className="animate-marquee-reverse flex shrink-0 gap-4 pr-4" style={{ animationDuration: '44s' }}>
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} className="flex gap-4" aria-hidden={copy > 0}>
              {ROW_DOWN.map((r) => (
                <RecordTile key={`${copy}-${r.label}`} figure={r.figure} label={r.label} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
