import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import GlowCard from '@/components/GlowCard'
import SectionHead from '@/components/SectionHead'
import Tag from '@/components/Tag'
import { SIDELINES } from '@/sections/matches/data'

gsap.registerPlugin(ScrollTrigger)

/**
 * S3 场外风云（ink 底）：4 张横向 GlowCard（移动 2×2）。
 * 入场 y:60→0 stagger 0.12s；悬停时左上角 Tag 闪烁一次金光；
 * 「FBI 调查」卡加一枚缓慢旋转的雷达扫描圈（conic 渐变，6s 循环）。
 */
export default function Sidelines() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-side-card]'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="bg-ink py-24 md:py-36">
      <div className="container-x">
        <SectionHead kickerEn="SIDELINES" kickerZh="场外风云" title="球场之外，同样滚烫" />

        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {SIDELINES.map((s, i) => (
            <div key={s.title} data-side-card>
              <GlowCard className="h-full p-5 md:p-7">
                {/* FBI 调查卡：雷达扫描圈（conic 渐变，6s 循环） */}
                {s.radar && (
                  <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full border border-gold/20">
                    <div
                      className="absolute inset-0 rounded-full motion-safe:animate-[spin_6s_linear_infinite]"
                      style={{
                        background: 'conic-gradient(from 0deg, rgba(245,196,82,0.5) 0deg, rgba(245,196,82,0.1) 90deg, transparent 140deg)',
                      }}
                    />
                    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
                  </div>
                )}

                {/* 左上角 Tag：悬停闪烁一次金光 */}
                <motion.div
                  whileHover={{ opacity: [1, 0.35, 1], scale: [1, 1.08, 1], filter: ['brightness(1)', 'brightness(1.9)', 'brightness(1)'] }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="inline-flex"
                >
                  <Tag tone="gold">{s.tag}</Tag>
                </motion.div>

                <div className="mt-6 flex items-center gap-3 md:mt-8">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                    <s.icon className="h-5 w-5 text-gold" aria-hidden />
                  </span>
                  <h3 className="font-sans text-lg font-bold leading-tight text-tx-hi md:text-[1.375rem]">{s.title}</h3>
                </div>

                <p className="mt-4 text-xs leading-6 text-tx-mid md:text-sm md:leading-7">{s.text}</p>

                {/* 角落序号（装饰） */}
                <span aria-hidden className="text-stroke-soft pointer-events-none absolute bottom-3 right-4 font-display text-4xl opacity-50 md:text-5xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
