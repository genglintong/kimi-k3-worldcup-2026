import LegendsHero from '@/sections/legends/LegendsHero'
import MessiActs from '@/sections/legends/MessiActs'
import RonaldoFarewell from '@/sections/legends/RonaldoFarewell'
import MbappeSpeed from '@/sections/legends/MbappeSpeed'
import StarPairs from '@/sections/legends/StarPairs'
import FarewellMoments from '@/sections/legends/FarewellMoments'
import RecordsCta from '@/sections/legends/RecordsCta'
import FinalBanner from '@/components/FinalBanner'

/**
 * 巨星里程碑 `/legends` —— 「诸神与新王」
 * S1 页头 → S2 梅西三幕钉住叙事 → S3 C 罗落幕专题 → S4 姆巴佩速度仪表
 * → S5 群星双 pair → S6 告别时刻 → S7 更多纪录带 + CTA → FinalBanner
 */
export default function Legends() {
  return (
    <>
      <LegendsHero />
      <MessiActs />
      <RonaldoFarewell />
      <MbappeSpeed />
      <StarPairs />
      <FarewellMoments />
      <RecordsCta />
      <FinalBanner />
    </>
  )
}
