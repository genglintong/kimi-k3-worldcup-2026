import type { ReactNode } from 'react'

type TagTone = 'gold' | 'volt' | 'cyan'

const TONE_CLASS: Record<TagTone, string> = {
  gold: 'border-gold/50 text-gold',
  volt: 'border-volt/50 text-volt',
  cyan: 'border-cyanx/50 text-cyanx',
}

interface TagProps {
  children: ReactNode
  tone?: TagTone
  className?: string
}

/** 圆角全描边小胶囊（电光绿 / 金 / cyan 三色变体），用于分钟事件、纪录标签 */
export default function Tag({ children, tone = 'gold', className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-grotesk text-[0.72rem] font-medium uppercase tracking-datalabel ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
