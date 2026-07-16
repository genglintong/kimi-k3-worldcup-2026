import { memo } from 'react'

/** 全站胶片噪点覆盖层：texture-noise.png，3% 不透明，mix-blend overlay */
const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.03] mix-blend-overlay"
      style={{ backgroundImage: 'url(/texture-noise.png)', backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }}
    />
  )
})

export default NoiseOverlay
