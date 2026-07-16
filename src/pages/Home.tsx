import Hero from '@/sections/home/Hero'
import NumbersGallery from '@/sections/home/NumbersGallery'
import TournamentBest from '@/sections/home/TournamentBest'
import LegendsRail from '@/sections/home/LegendsRail'
import GoldenBoot from '@/sections/home/GoldenBoot'
import MatchesPreview from '@/sections/home/MatchesPreview'
import NewcomersPreview from '@/sections/home/NewcomersPreview'
import RecordsMarquee from '@/sections/home/RecordsMarquee'
import FinalBanner from '@/components/FinalBanner'

/**
 * 首页 `/` —— 传奇里程碑
 * S1 英雄区 → S2 数字长廊 → S3 本届之最 → S4 巨星长廊 → S5 金靴之争
 * → S6 经典战役预览 → S7 新军物语预览 → S8 纪录速览墙 → S9 FinalBanner
 */
export default function Home() {
  return (
    <>
      <Hero />
      <NumbersGallery />
      <TournamentBest />
      <LegendsRail />
      <GoldenBoot />
      <MatchesPreview />
      <NewcomersPreview />
      <RecordsMarquee />
      <FinalBanner />
    </>
  )
}
