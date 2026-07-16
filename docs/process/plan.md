# 2026 世界杯里程碑炫酷网站 — 执行计划

## 背景
- 当前时间：2026-07-16，2026 美加墨世界杯半决赛刚结束，决赛（7/19）在即
- 目标：一个视觉炫酷、动效丰富的网站，展示本届世界杯的精彩里程碑（纪录、突破、经典时刻、数据）
- 关键约束：所有事实性内容（比分、纪录、数据）必须来自实时联网调研，禁止编造

## Stage 1 — 调研（deep-research 思路，并行 explore 子代理）
- Agent A「赛况纵览」：半决赛结果、决赛对阵、本届总进球/上座等核心数据、金靴争夺
- Agent B「里程碑与纪录」：48 队扩军、首次参赛国、破纪录事件（最年轻/最年长、最快进球等）、经典战役、冷门、球星表现（梅西/C罗/姆巴佩/贝林厄姆等）
- 产出：validated facts 简报（含数据出处日期），写入 research/ 目录

## Stage 2 — 设计与构建（加载 vibecoding-webapp-swarm skill）
- React + Vite + Tailwind + Framer Motion（滚动视差、数字滚动计数、粒子/光效、时间轴动画）
- 页面结构（单页沉浸式）：
  1. Hero：大字标题 + 动态光效 + 决赛倒计时
  2. 里程碑时间轴（里程碑事件滚动触发动画）
  3. 纪录数据墙（animated counters）
  4. 经典时刻卡片（hover 3D/光晕效果）
  5. 决赛前瞻 Footer
- 风格：深色底 + 金/青点缀，高级感，避免高饱和渐变
- 由 coder 子代理在 swarm-workspace 工作区构建，build 通过为验收门槛

## Stage 3 — 交付
- 调用 mshtools-website_version_manager（build_version, type=static）
- 向用户汇报版本 URL
