import { Flag, Gavel, Radar, ThermometerSun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** Tag 组件支持的三色变体 */
export type TagTone = 'gold' | 'volt' | 'cyan'

export interface BattleEvent {
  label: string
  tone: TagTone
}

export interface Battle {
  /** 锚点 id（首页战役卡链接 /matches#nor-bra、/matches#arg-egy 等） */
  id: string
  /** 轮次中文，如「半决赛」 */
  round: string
  /** 轮次英文（时间节点副标） */
  roundEn: string
  /** 时间节点大日期，如「7.15」 */
  dateBig: string
  /** 卡头元信息日期，如「7月15日」 */
  dateLabel: string
  /** 球场（仅有事实依据时填写） */
  venue?: string
  /** 附加赛制说明：加时 / 点球大战 */
  extra?: string
  /** 冷门场次点缀标签（espana 红） */
  upsetTag?: string
  home: string
  away: string
  homeScore: number
  awayScore: number
  /** 点球比分附注，如「点球 3-4」 */
  penaltyNote?: string
  /** 一句话钩子 */
  hook: string
  /** 完整战报 */
  report: string
  /** 关键分钟事件流 */
  events: BattleEvent[]
  /** 冷门指数 1-5 */
  upset: number
  /** 配图（public/ 下文件名） */
  img: string
  /** 配图 alt */
  imgAlt: string
  /** 交叉链接（如 → 新军物语） */
  crossLink?: { text: string; to: string }
}

/**
 * 8 场淘汰赛经典（按时间倒序，半决赛在前）。
 * 全部比分 / 分钟 / 进球者 / 争议均出自 info.md 与 design/matches.md，统计截至 2026-07-16。
 */
export const BATTLES: Battle[] = [
  {
    id: 'arg-eng',
    round: '半决赛',
    roundEn: 'SEMI-FINAL',
    dateBig: '7.15',
    dateLabel: '7月15日',
    home: '阿根廷',
    away: '英格兰',
    homeScore: 2,
    awayScore: 1,
    hook: '恩佐 85’ 世界波，劳塔罗 92’ 绝杀——梅西两助攻导演逆转。',
    report:
      '英格兰人把卫冕冠军逼到悬崖边，但 85 分钟恩佐远射破网、92 分钟劳塔罗完成绝杀。梅西送出两次助攻，第三次站上决赛舞台。',
    events: [
      { label: '85’ 恩佐 世界波', tone: 'volt' },
      { label: '90+2’ 劳塔罗 绝杀', tone: 'volt' },
      { label: '梅西 ×2 助攻', tone: 'gold' },
    ],
    upset: 2,
    img: '/match-arg-eng.png',
    imgAlt: '半决赛 阿根廷 2-1 英格兰：92 分钟绝杀瞬间插画',
  },
  {
    id: 'esp-fra',
    round: '半决赛',
    roundEn: 'SEMI-FINAL',
    dateBig: '7.14',
    dateLabel: '7月14日',
    home: '西班牙',
    away: '法国',
    homeScore: 2,
    awayScore: 0,
    hook: '奥亚萨瓦尔点射、波罗建功——西班牙时隔 16 年重返决赛。',
    report: '一场教科书级的控制。西班牙连续 37 场 90 分钟不败，优雅地送走了姆巴佩的法国。',
    events: [
      { label: '奥亚萨瓦尔 点球', tone: 'volt' },
      { label: '波罗 建功', tone: 'volt' },
      { label: '37 场不败', tone: 'gold' },
    ],
    upset: 1,
    img: '/match-esp-fra.png',
    imgAlt: '半决赛 西班牙 2-0 法国：点球命中与红色浪潮庆祝插画',
  },
  {
    id: 'arg-sui',
    round: '1/4 决赛',
    roundEn: 'QUARTER-FINAL',
    dateBig: '7.12',
    dateLabel: '7月12日',
    extra: '加时',
    home: '阿根廷',
    away: '瑞士',
    homeScore: 3,
    awayScore: 1,
    hook: 'VAR“认错人”改判恩博洛红牌——VAR 史上罕见判例。',
    report: 'VAR 先罚错人、再改判恩博洛红牌，瑞士少打一人。阿尔瓦雷斯加时世界波杀死悬念。',
    events: [
      { label: 'VAR 改判 恩博洛红牌', tone: 'gold' },
      { label: '加时 阿尔瓦雷斯 世界波', tone: 'volt' },
    ],
    upset: 2,
    img: '/match-arg-sui.png',
    imgAlt: '1/4 决赛 阿根廷 3-1 瑞士：加时世界波与 VAR 屏幕光插画',
  },
  {
    id: 'eng-nor',
    round: '1/4 决赛',
    roundEn: 'QUARTER-FINAL',
    dateBig: '7.11',
    dateLabel: '7月11日',
    extra: '加时',
    home: '英格兰',
    away: '挪威',
    homeScore: 2,
    awayScore: 1,
    hook: '贝林厄姆 vs 哈兰德——新王对决，贝林加时补射双响。',
    report:
      '哈兰德连续 14 场国家队进球的纪录在这一夜终结。贝林厄姆加时补射梅开二度，1986 年马拉多纳之后首位淘汰赛连续两场独中两元。',
    events: [
      { label: '贝林厄姆 ×2（加时）', tone: 'volt' },
      { label: '哈兰德 纪录终结', tone: 'gold' },
    ],
    upset: 3,
    img: '/match-eng-nor.png',
    imgAlt: '1/4 决赛 英格兰 2-1 挪威：加时补射双响插画',
  },
  {
    id: 'arg-egy',
    round: '1/8 决赛',
    roundEn: 'ROUND OF 16',
    dateBig: '7.07',
    dateLabel: '7月7日',
    home: '阿根廷',
    away: '埃及',
    homeScore: 3,
    awayScore: 2,
    hook: '0-2 落后、梅西失点、VAR 争议——然后 11 分钟连进三球。',
    report:
      '卫冕冠军 0-2 落后，梅西罚失点球、VAR 判罚引发埃及足协赛后正式申诉。第 79 分钟罗梅罗吹响号角，83 分钟梅西扳平，92 分钟恩佐绝杀。11 分钟，三球，翻天。',
    events: [
      { label: '79’ 罗梅罗', tone: 'volt' },
      { label: '83’ 梅西', tone: 'volt' },
      { label: '90+2’ 恩佐', tone: 'volt' },
    ],
    upset: 4,
    img: '/match-arg-egy.png',
    imgAlt: '1/8 决赛 阿根廷 3-2 埃及：补时绝杀插画',
  },
  {
    id: 'esp-por',
    round: '1/8 决赛',
    roundEn: 'ROUND OF 16',
    dateBig: '7.06',
    dateLabel: '7月6日',
    home: '西班牙',
    away: '葡萄牙',
    homeScore: 1,
    awayScore: 0,
    hook: '梅里诺 91’ 绝杀——C 罗的世界杯，停在了这一刻。',
    report: '伊比利亚德比闷战 90 分钟，梅里诺第 91 分钟一剑封喉。41 岁的 C 罗确认，这是他最后一届世界杯。',
    events: [
      { label: '90+1’ 梅里诺 绝杀', tone: 'volt' },
      { label: 'C 罗 谢幕', tone: 'gold' },
    ],
    upset: 3,
    img: '/match-esp-por.png',
    imgAlt: '1/8 决赛 西班牙 1-0 葡萄牙：91 分钟头槌绝杀插画',
  },
  {
    id: 'nor-bra',
    round: '1/8 决赛',
    roundEn: 'ROUND OF 16',
    dateBig: '7.05',
    dateLabel: '7月5日',
    venue: 'MetLife 体育场',
    upsetTag: '最大冷门',
    home: '挪威',
    away: '巴西',
    homeScore: 2,
    awayScore: 1,
    hook: '本届最大冷门：哈兰德 79’/90’ 双响，内马尔赛后退役。',
    report:
      '吉马良斯失点埋下伏笔，哈兰德 79 分钟扳平、90 分钟反超。内马尔百分钟点球已无力回天，赛后含泪宣布退出国家队。挪威队史首进八强。',
    events: [
      { label: '79’ 哈兰德', tone: 'volt' },
      { label: '90’ 哈兰德', tone: 'volt' },
      { label: '内马尔 百分钟点球', tone: 'gold' },
    ],
    upset: 5,
    img: '/match-nor-bra.png',
    imgAlt: '1/8 决赛 挪威 2-1 巴西：90 分钟绝杀瞬间插画',
  },
  {
    id: 'ger-par',
    round: '32 强战',
    roundEn: 'ROUND OF 32',
    dateBig: '6.29',
    dateLabel: '6月29日',
    extra: '点球大战',
    upsetTag: '神话破灭',
    home: '德国',
    away: '巴拉圭',
    homeScore: 1,
    awayScore: 1,
    penaltyNote: '点球 3-4',
    hook: '四冠王首轮淘汰赛出局——“德国点球神话”破灭之夜。',
    report:
      '点球大战 3-4——“德国点球神话”在这一夜破灭，四冠王首轮淘汰赛出局。同一天，荷兰点球负摩洛哥、日本负巴西——三大豪门同日回家。',
    events: [
      { label: '点球 3-4', tone: 'gold' },
      { label: '同日 荷兰/日本 出局', tone: 'gold' },
    ],
    upset: 5,
    img: '/match-ger-par.png',
    imgAlt: '32 强战 德国点球 3-4 负巴拉圭：雨夜点球大战插画',
    crossLink: {
      text: '另注：阿根廷 3-2 佛得角（7/3，加时）——世界第 1 对第 67，险些成为淘汰赛史上最大冷门，见新军物语页专题',
      to: '/newcomers',
    },
  },
]

export interface Sideline {
  icon: LucideIcon
  title: string
  tag: string
  text: string
  /** FBI 调查卡：缓慢旋转的雷达扫描圈 */
  radar?: boolean
}

/** S3 场外风云：争议与花边（出自 info.md §6） */
export const SIDELINES: Sideline[] = [
  {
    icon: Gavel,
    title: '红牌“缓刑”',
    tag: '规则争议',
    text: '美国前锋巴洛贡红牌获 FIFA 罕见缓刑得以继续参赛——1962 年以来首次世界杯红牌不停赛，比利时足协公开表示“震惊”。',
  },
  {
    icon: Radar,
    title: 'FBI 调查',
    tag: '调查中',
    radar: true,
    text: '7/8 曝出 FBI 调查阿根廷足协资金流动；目前无人被起诉。',
  },
  {
    icon: Flag,
    title: '正式申诉',
    tag: 'VAR 余波',
    text: '埃及足协就 1/8 决赛对阿根廷一役的执法，正式向 FIFA 申诉。',
  },
  {
    icon: ThermometerSun,
    title: '高温与科技',
    tag: '赛场之外',
    text: '高温下的“补水暂停”与 spidercam 机位争议持续发酵。',
  },
]
