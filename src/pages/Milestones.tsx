import PageHero from '@/sections/milestones/PageHero'
import FormatRevolution from '@/sections/milestones/FormatRevolution'
import ThreeNations from '@/sections/milestones/ThreeNations'
import Attendance from '@/sections/milestones/Attendance'
import GoalRush from '@/sections/milestones/GoalRush'
import Business from '@/sections/milestones/Business'
import RecordWall from '@/sections/milestones/RecordWall'
import NextChapter from '@/sections/milestones/NextChapter'

/**
 * 赛事里程碑 `/milestones` —— 一届改写历史的世界杯
 * S1 页头 → S2 赛制革命（钉住三步）→ S3 三国联办 → S4 上座狂潮
 * → S5 进球风暴 → S6 商业新纪元 → S7 纪录数据墙 → S8 下一章 CTA
 */
export default function Milestones() {
  return (
    <>
      <PageHero />
      <FormatRevolution />
      <ThreeNations />
      <Attendance />
      <GoalRush />
      <Business />
      <RecordWall />
      <NextChapter />
    </>
  )
}
