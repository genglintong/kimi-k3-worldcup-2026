import { Link } from 'react-router'
import NewcomersHero from '@/sections/newcomers/NewcomersHero'
import CuracaoFeature from '@/sections/newcomers/CuracaoFeature'
import CapeVerdeFeature from '@/sections/newcomers/CapeVerdeFeature'
import JordanUzbekCards from '@/sections/newcomers/JordanUzbekCards'
import ReturnTimeline from '@/sections/newcomers/ReturnTimeline'
import FinalBanner from '@/components/FinalBanner'

/**
 * 新军物语 /newcomers —— 「小国大梦」
 * S1 页头 PageHero → S2 库拉索大专题 → S3 佛得角大专题（镜像）
 * → S4 约旦 × 乌兹别克斯坦双卡 → S5 情怀回归时间轴 → S6 下一章 CTA（/final）。
 * 主题色：volt 电光绿（新生）+ 金。事实出自 info.md，统计截至 2026-07-16。
 */
export default function Newcomers() {
  return (
    <>
      <NewcomersHero />
      <CuracaoFeature />
      <CapeVerdeFeature />
      <JordanUzbekCards />
      <ReturnTimeline />

      {/* S6 下一章 CTA：新军的故事讲完，诸神的决战将至 → 巅峰对决 */}
      <div className="container-x pt-20 text-center" data-reveal>
        <p className="text-base leading-8 text-tx-mid md:text-lg">
          新军的故事讲完，诸神的决战将至{' '}
          <Link to="/final" className="font-bold text-gold transition-colors duration-300 hover:text-amber">
            → 巅峰对决
          </Link>
        </p>
      </div>
      <FinalBanner />
    </>
  )
}
