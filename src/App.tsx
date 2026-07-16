import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Milestones from '@/pages/Milestones'
import Legends from '@/pages/Legends'
import Matches from '@/pages/Matches'
import Newcomers from '@/pages/Newcomers'
import Final from '@/pages/Final'

/**
 * 路由模式：嵌套路由（Layout 渲染 <Outlet/>）。
 * App 与 Layout 必须使用同一种模式 —— 禁止混用 children 包裹。
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="legends" element={<Legends />} />
        <Route path="matches" element={<Matches />} />
        <Route path="newcomers" element={<Newcomers />} />
        <Route path="final" element={<Final />} />
      </Route>
    </Routes>
  )
}
