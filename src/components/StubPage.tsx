import { Link } from 'react-router'
import { ArrowLeft, Construction } from 'lucide-react'

interface StubPageProps {
  en: string
  zh: string
  note: string
}

/** 占位页：后续页面代理将替换为真实页面 */
export default function StubPage({ en, zh, note }: StubPageProps) {
  return (
    <section className="container-x flex min-h-[60dvh] flex-col items-start justify-center py-24">
      <p className="flex items-center gap-3 font-grotesk text-xs font-medium uppercase tracking-kicker text-gold">
        <span className="inline-block h-0.5 w-6 bg-gold" aria-hidden />
        {en}
      </p>
      <h1 className="text-gold-gradient mt-6 font-sans text-[clamp(2.25rem,5.5vw,4.25rem)] font-black leading-[1.1]">
        {zh}
      </h1>
      <p className="mt-6 flex items-center gap-2 text-sm text-tx-mid">
        <Construction className="h-4 w-4 text-gold" />
        {note}
      </p>
      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold/60 px-6 py-3 font-sans text-sm font-bold text-gold transition-colors hover:bg-gold/10"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </Link>
    </section>
  )
}
