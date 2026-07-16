import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from '@/components/SectionHead'

gsap.registerPlugin(ScrollTrigger)

const TEAMS = [
  { name: '库拉索', fact: '15 万人口 · 史上最小参赛国', highlight: '门将 Room 单场 15 次扑救创纪录', img: '/newcomer-curacao.png' },
  { name: '佛得角', fact: '史上闯入淘汰赛的最小国家', highlight: '加时 2-3 惜败卫冕冠军阿根廷', img: '/newcomer-capeverde.png' },
  { name: '约旦', fact: '三战皆墨，场场进球', highlight: '对阿根廷也取得进球', img: '/newcomer-jordan.png' },
  { name: '乌兹别克斯坦', fact: '队史世界杯首球', highlight: '18 岁与 41 岁 C 罗同场首发', img: '/newcomer-uzbekistan.png' },
]

/**
 * S7 新军物语预览：volt 电光绿主题区，4 张横排小卡。
 * 入场 y:70→0 + rotate:2°→0（back.out(1.2)，stagger 0.1）；
 * 悬停顶部电光绿光带扫过；整卡点击 → /newcomers。
 */
export default function NewcomersPreview() {
  const rootRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-newcomer-card]'),
        { y: 70, rotate: 2, opacity: 0 },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.2)',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* 电光绿环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(59,255,178,0.07), transparent 70%)' }}
      />

      <div className="container-x relative">
        <SectionHead kickerEn="DEBUTANTS" kickerZh="新军物语" title="2006 年以来新军最多的一届" tone="volt" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map((t) => (
            <div
              key={t.name}
              data-newcomer-card
              data-cursor
              onClick={() => navigate('/newcomers')}
              className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-line bg-panel transition-colors duration-300 hover:border-volt/50"
            >
              {/* 悬停：顶部电光绿光带扫过 */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-volt to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={t.img}
                  alt={`${t.name}新军插画`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-5">
                <h3 className="font-sans text-[1.125rem] font-bold text-tx-hi">{t.name}</h3>
                <p className="mt-2 text-xs leading-6 text-volt">{t.fact}</p>
                <p className="mt-2 text-sm leading-6 text-tx-mid">{t.highlight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
