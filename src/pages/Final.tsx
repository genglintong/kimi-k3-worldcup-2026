import DuelHero from '@/sections/final/DuelHero'
import Storyline from '@/sections/final/Storyline'
import BootDecider from '@/sections/final/BootDecider'
import RoadToFinal from '@/sections/final/RoadToFinal'
import ThirdPlace from '@/sections/final/ThirdPlace'
import FinalNight from '@/sections/final/FinalNight'
import Outro from '@/sections/final/Outro'

/**
 * 巅峰对决 `/final` —— 7.19 · 新泽西（决赛前瞻专题页）
 * S1 分屏英雄区（西班牙 × 阿根廷 + 决赛倒计时）
 * S2 故事线：梅西 × 亚马尔（钉住交叉叙事）
 * S3 金靴决战（数据竞速）
 * S4 晋级之路（双列对照 stepper）
 * S5 季军战卡（金铜色调）
 * S6 决赛之夜看点 + 趣闻走马灯
 * S7 结语（Footer 由全局 Layout 提供）
 */
export default function Final() {
  return (
    <>
      <DuelHero />
      <Storyline />
      <BootDecider />
      <RoadToFinal />
      <ThirdPlace />
      <FinalNight />
      <Outro />
    </>
  )
}
