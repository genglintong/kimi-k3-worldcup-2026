import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface BigStatProps {
  /** 目标数值（计数器终点）。 */
  value: number
  /** 数字前缀，如 "$" */
  prefix?: string
  /** 数字后缀，如 "万+" / "%" */
  suffix?: string
  /** 数据标签（Space Grotesk 大写） */
  label: string
  /** 1 行中文注释 */
  note?: string
  className?: string
}

/**
 * Anton 巨数（金色渐变）+ 数据标签 + 1 行注释。
 * 计数器入场：0 → 目标值，2s，power2.out，千分位，trigger "top 75%"，仅触发一次。
 */
export default function BigStat({ value, prefix = '', suffix = '', label, note, className = '' }: BigStatProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const num = numRef.current
    if (!root || !num) return
    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      gsap.to(counter, {
        v: value,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        onUpdate: () => {
          num.textContent = `${prefix}${Math.round(counter.v).toLocaleString('en-US')}${suffix}`
        },
      })
      gsap.fromTo(
        root.querySelectorAll('[data-stat-fade]'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [value, prefix, suffix])

  return (
    <div ref={rootRef} className={className}>
      <p className="text-gold-gradient font-display text-[clamp(3rem,8vw,6.5rem)] leading-none">
        <span ref={numRef}>{prefix}0{suffix}</span>
      </p>
      <p data-stat-fade className="mt-3 font-grotesk text-[0.8125rem] font-medium uppercase tracking-datalabel text-gold">
        {label}
      </p>
      {note && (
        <p data-stat-fade className="mt-2 text-sm leading-7 text-tx-mid">
          {note}
        </p>
      )}
    </div>
  )
}
