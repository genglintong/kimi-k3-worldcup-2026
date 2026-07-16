import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NoiseOverlay from '@/components/NoiseOverlay'
import ScrollProgress from '@/components/ScrollProgress'
import CustomCursor from '@/components/CustomCursor'
import PageTransition from '@/components/PageTransition'

gsap.registerPlugin(ScrollTrigger)

/**
 * 全站布局（嵌套路由模式：渲染 <Outlet/>，与 App.tsx 的路由结构一一对应）。
 * 职责：Lenis 平滑滚动（与 ScrollTrigger 同步）、环境光斑、滚动进度条、
 * 自定义光标、噪点覆盖层、Navbar / Footer、页面转场。
 */
export default function Layout() {
  const location = useLocation()

  /* Lenis 平滑滚动：lerp 0.09，与 ScrollTrigger 同步 */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  /* 路由变化回到顶部（Lenis 接管原生滚动，直接操作 window） */
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [location.pathname])

  /* 通用入场（data-reveal）：y:48→0, opacity:0→1, 0.9s, power3.out, trigger "top 82%" */
  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]:not([data-reveal-done])')
    const tweens = els.map((el) => {
      el.setAttribute('data-reveal-done', '')
      return gsap.fromTo(
        el,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } },
      )
    })
    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
    }
  }, [location.pathname])

  return (
    <div className="relative min-h-[100dvh] bg-obsidian text-tx-hi">
      <div className="ambient-glows" aria-hidden />
      <div className="ambient-glow-volt" aria-hidden />
      <ScrollProgress />
      <CustomCursor />
      <PageTransition />
      <Navbar />
      {/* 页面转场后内容入场：y:24→0, opacity:0→1（0.5s，延迟 0.1s） */}
      <motion.main
        key={location.pathname}
        className="relative z-10"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        onAnimationComplete={() => ScrollTrigger.refresh()}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <NoiseOverlay />
    </div>
  )
}
