import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft } from 'lucide-react'
import { STATS_AS_OF } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

/** 背景金色微粒缓慢上飘（轻量 2D canvas，离屏暂停，reduced-motion 不渲染） */
function GoldDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas || !canvas.parentElement) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    const N = window.innerWidth < 768 ? 32 : 64
    const parts = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      vy: 0.018 + Math.random() * 0.04,
      drift: Math.random() * Math.PI * 2,
      a: 0.12 + Math.random() * 0.42,
    }))

    let raf = 0
    let running = false
    let last = performance.now()
    let t = 0
    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y -= p.vy * dt
        if (p.y < -0.05) {
          p.y = 1.05
          p.x = Math.random()
        }
        const x = (p.x + Math.sin(t * 0.3 + p.drift) * 0.006) * w
        const alpha = p.a * (0.55 + 0.45 * Math.sin(t * 1.2 + p.drift))
        ctx.beginPath()
        ctx.arc(x, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,196,82,${alpha.toFixed(3)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          last = performance.now()
          raf = requestAnimationFrame(tick)
        } else if (!entry.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

const LINE1: { ch: string; latin: boolean }[] = [
  { ch: '7', latin: true },
  { ch: ' ', latin: false },
  { ch: '月', latin: false },
  { ch: ' ', latin: false },
  { ch: '1', latin: true },
  { ch: '9', latin: true },
  { ch: ' ', latin: false },
  { ch: '日', latin: false },
  { ch: '，', latin: false },
  { ch: '新', latin: false },
  { ch: '泽', latin: false },
  { ch: '西', latin: false },
  { ch: '。', latin: false },
]

const LINE2_WORDS = ['39', '岁的', 'GOAT，', '19', '岁的新王。', '650', '万人的夏天，', '只剩', '最后一夜。']

/**
 * S7 结语：居中大字收尾。
 * 首行字符级 stagger 0.04s；次行词级 0.03s；按钮 scale 0.9→1；背景金色微粒缓慢上飘。
 */
export default function Outro() {
  const rootRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      })
      tl.fromTo(
        '[data-outro-char]',
        { yPercent: 110, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 0.9, ease: 'power4.out', stagger: 0.04 },
        0,
      )
        .fromTo(
          '[data-outro-word]',
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.03 },
          0.5,
        )
        .fromTo('[data-outro-btn]', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' }, 0.9)
        .fromTo('[data-outro-note]', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.1)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-obsidian py-32 md:py-44">
      {/* 底部金色环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(245,196,82,0.1), transparent 70%)' }}
      />
      <GoldDust />

      <div className="container-x relative text-center">
        <h2 className="overflow-hidden font-sans text-[clamp(2.75rem,7vw,6rem)] font-black leading-[1.05] tracking-[0.01em]">
          {LINE1.map((c, i) => (
            <span
              key={i}
              data-outro-char
              className={`text-gold-gradient inline-block will-change-transform ${c.latin ? 'font-display text-[1.08em]' : ''}`}
            >
              {c.ch === ' ' ? ' ' : c.ch}
            </span>
          ))}
        </h2>

        <p className="mx-auto mt-8 max-w-[46rem] text-base leading-[1.9] text-tx-mid md:text-lg">
          {LINE2_WORDS.map((w, i) => (
            <span key={i} data-outro-word className="inline-block">
              <span className={/^[0-9A-Z]/.test(w) ? 'font-display text-[1.1em] text-gold' : undefined}>{w}</span>
              &nbsp;
            </span>
          ))}
        </p>

        <button
          type="button"
          data-outro-btn
          data-cursor
          onClick={() => navigate('/')}
          className="btn-shine mt-12 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-sm font-bold text-obsidian transition-transform duration-300 hover:scale-[1.04]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          回到首页
        </button>

        <p data-outro-note className="mt-10 font-grotesk text-[0.65rem] uppercase tracking-datalabel text-tx-low">
          统计{STATS_AS_OF} · 决赛尚未进行，本站为前瞻内容
        </p>
      </div>
    </section>
  )
}
