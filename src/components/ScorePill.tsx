interface ScorePillProps {
  home: string
  away: string
  homeScore: number
  awayScore: number
  /** 点球比分附注，如 "点球 3-4" */
  penaltyNote?: string
  className?: string
}

/** 比分胶囊：队名 Noto 700、比分 Anton 金色、居中「–」，点球比分以小字附注 */
export default function ScorePill({ home, away, homeScore, awayScore, penaltyNote, className = '' }: ScorePillProps) {
  return (
    <div className={`inline-flex items-center gap-3 rounded-full border border-line bg-obsidian/70 px-5 py-2 backdrop-blur ${className}`}>
      <span className="font-sans text-sm font-bold text-tx-hi">{home}</span>
      <span className="font-display text-2xl leading-none text-gold">
        {homeScore}
        <span className="mx-1.5 text-tx-low">–</span>
        {awayScore}
      </span>
      <span className="font-sans text-sm font-bold text-tx-hi">{away}</span>
      {penaltyNote && <span className="text-xs text-tx-low">（{penaltyNote}）</span>}
    </div>
  )
}
