import type { ReactNode } from 'react'

interface RecordTileProps {
  /** 正面大数字（Anton 金色） */
  figure: ReactNode
  /** 正面标签 */
  label: string
  /** 背面注解（悬停 3D 翻转显示） */
  back?: string
  className?: string
}

/**
 * 数据墙瓷贴：正面大数字 + 标签，悬停 3D 翻转（rotateY 180°，0.6s）显示背面注解。
 * 未提供 back 时退化为悬停描边点亮 + 微放大。
 */
export default function RecordTile({ figure, label, back, className = '' }: RecordTileProps) {
  if (!back) {
    return (
      <div
        className={`group flex min-w-[220px] shrink-0 flex-col justify-center gap-1 rounded-2xl border border-line bg-panel px-6 py-5 transition-all duration-300 hover:scale-[1.05] hover:border-gold/60 ${className}`}
      >
        <p className="font-display text-3xl leading-none text-gold">{figure}</p>
        <p className="text-sm leading-6 text-tx-mid">{label}</p>
      </div>
    )
  }

  return (
    <div className={`group min-w-[220px] shrink-0 [perspective:1000px] ${className}`}>
      <div className="relative h-full min-h-[120px] w-full transition-transform duration-600 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 flex flex-col justify-center gap-1 rounded-2xl border border-line bg-panel px-6 py-5 [backface-visibility:hidden]">
          <p className="font-display text-3xl leading-none text-gold">{figure}</p>
          <p className="text-sm leading-6 text-tx-mid">{label}</p>
        </div>
        <div className="absolute inset-0 flex items-center rounded-2xl border border-gold/40 bg-panel px-6 py-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm leading-6 text-tx-hi">{back}</p>
        </div>
      </div>
    </div>
  )
}
