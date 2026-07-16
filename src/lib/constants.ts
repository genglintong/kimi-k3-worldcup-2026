/** 全站共享常量 */

/** 决赛开球时间：北京时间 2026-07-20 03:00（美东 7/19 15:00） */
export const FINAL_KICKOFF_ISO = '2026-07-20T03:00:00+08:00'

export const STATS_AS_OF = '截至 2026-07-16'

export interface NavItem {
  path: string
  label: string
  en: string
}

/** 全站 6 个路由（顺序即导航顺序） */
export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: '首页', en: 'HOME' },
  { path: '/milestones', label: '赛事里程碑', en: 'MILESTONES' },
  { path: '/legends', label: '巨星', en: 'LEGENDS' },
  { path: '/matches', label: '经典战役', en: 'MATCHES' },
  { path: '/newcomers', label: '新军物语', en: 'DEBUTANTS' },
  { path: '/final', label: '巅峰对决', en: 'THE FINAL' },
]
