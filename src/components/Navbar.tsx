import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import { useCountdown } from '@/hooks/useCountdown'

/** 右端决赛倒计时芯片：金描边胶囊，每秒跳动，点击进入 /final */
function CountdownChip({ onClick }: { onClick?: () => void }) {
  const { dday } = useCountdown()
  return (
    <Link
      to="/final"
      onClick={onClick}
      className="group flex items-center gap-2 rounded-full border border-gold/60 px-4 py-1.5 font-grotesk text-[0.8125rem] tracking-datalabel text-gold transition-colors hover:bg-gold/10"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <span>D-{String(dday).padStart(2, '0')}</span>
      <span className="text-tx-mid transition-colors group-hover:text-gold">· 7.19</span>
    </Link>
  )
}

/**
 * 全站导航：高 72px，sticky top-0 z-50，backdrop-blur-xl，底边 1px 金线。
 * 向下滚动隐藏 / 向上滚动显示；当前页金色常亮 + 下划线常驻。
 * 移动端：汉堡 → 全屏覆盖菜单（链接 Anton 大号逐条 stagger 升起）。
 */
export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(latest > prev && latest > 160)
  })

  return (
    <>
      <motion.header
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="sticky top-0 z-50 h-[72px] border-b border-gold/[0.14] bg-obsidian/70 backdrop-blur-xl"
      >
        <div className="container-x flex h-full items-center justify-between">
          {/* 左：Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="回到首页">
            <img src="/logo.svg" alt="MILESTONES·26 标志" className="h-7 w-7" />
            <span className="leading-tight">
              <span className="block font-sans text-sm font-black tracking-wide text-tx-hi">传奇里程碑</span>
              <span className="block font-grotesk text-[0.6rem] tracking-datalabel text-gold">MILESTONES·26</span>
            </span>
          </Link>

          {/* 中/右：导航链接（桌面） */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="主导航">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                {({ isActive }) => (
                  <span
                    className={`group relative py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-tx-mid hover:text-tx-hi'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <CountdownChip />
            </div>
            {/* 移动端汉堡 */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-tx-hi lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* 移动端全屏覆盖菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-obsidian/[0.98] lg:hidden"
          >
            {/* 金色粒子微光 */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(245,196,82,0.14), transparent 70%)' }}
            />
            <nav className="container-x relative flex flex-col gap-5" aria-label="移动端导航">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.07 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`font-display text-4xl tracking-wide ${
                      location.pathname === item.path ? 'text-gold' : 'text-tx-hi'
                    }`}
                  >
                    {item.label}
                    <span className="ml-3 font-grotesk text-xs tracking-datalabel text-tx-low">{item.en}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 48, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.07 * NAV_ITEMS.length, duration: 0.5 }}
                className="mt-6"
              >
                <CountdownChip onClick={() => setMenuOpen(false)} />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
