import { useEffect, useMemo, useState } from 'react'
import { FINAL_KICKOFF_ISO } from '@/lib/constants'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** 赛程意义上的 D-Day（天） */
  dday: number
  /** 是否已过开球时间 */
  expired: boolean
}

function diff(target: number): CountdownParts {
  const ms = Math.max(0, target - Date.now())
  const total = Math.floor(ms / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    dday: Math.ceil(ms / 86400000),
    expired: ms <= 0,
  }
}

/** 决赛倒计时，每秒更新。目标：2026-07-20T03:00:00+08:00 */
export function useCountdown(): CountdownParts {
  const target = useMemo(() => new Date(FINAL_KICKOFF_ISO).getTime(), [])
  const [parts, setParts] = useState<CountdownParts>(() => diff(target))

  useEffect(() => {
    const id = window.setInterval(() => setParts(diff(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  return parts
}
