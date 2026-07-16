# Milestones·26 — 2026 FIFA World Cup ⚽🏆

> One prompt → a Kimi K3 agent swarm (research + design + 6 build agents) → an animated, data-driven World Cup milestones site. **Zero human-written code.**

[🇨🇳 中文文档](README.zh-CN.md) · [🌐 **Live Site**](https://l3lpakqodhark.ok.kimi.link) · [How the swarm built it](#-how-the-k3-swarm-built-this)

![Scrolling tour](docs/media/scroll.gif)

**「午夜球场 · 金色时刻」— a midnight-stadium, golden-moment themed showcase of the wildest World Cup ever: 48 teams, 104 matches, 3 host countries, 6.5M+ fans.**

## 🌐 Visit

**Online:** https://l3lpakqodhark.ok.kimi.link (hosted on Kimi)

**Local:**

```bash
npm install
npm run dev                  # dev mode
# or
npm run build && npm run preview   # production build + preview
```

## ✨ What's Inside

Six pages, all content researched live by the swarm during the actual tournament (data as of 2026-07-16, post-semifinals):

- **首页 Home** — cinematic hero over an AI-generated night stadium, live countdown to the July 19 final (Spain vs Argentina, MetLife)
- **赛事里程碑 Milestones** — the records this tournament rewrote: first 48-team WC, first 3-nation host, longest schedule, attendance record
- **巨星 Legends** — Messi's 21st WC goal (all-time top scorer), Ronaldo's farewell, Yamal's rise…
- **经典战役 Matches** — the knockout classics, recreated as animated cards
- **新军物语 Newcomers** — Cape Verde, Curaçao, Jordan, Uzbekistan: the debutants' stories
- **巅峰对决 Final** — the Spain vs Argentina final preview

![Hero](docs/media/hero.jpg)

### Design & motion

- 🎨 "Midnight stadium × golden moment" art direction: dark base, gold/cyan accents
- 🖼 **27 AI-generated visuals** — player portraits, match scenes, stadium hero, the trophy
- 🎬 Three.js particle field, GSAP scroll triggers, Framer Motion page transitions, Lenis smooth scroll, animated stat counters, custom cursor
- 📊 Every fact (scores, records, dates) sourced by live web research — the plan explicitly forbade fabrication

![Messi — 21 goals, all-time WC top scorer](docs/media/legends-messi.jpg)

## 🛠 Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS · Three.js (@react-three/fiber) · GSAP · Framer Motion · Lenis

## 🐝 How the K3 Swarm Built This

The only human input was one sentence:

> 「帮我做一个炫酷的网站 来展示本届世界杯的精彩里程碑，要炫酷的动态的效果」

**1. Plan before code.** The orchestrator wrote [`docs/process/plan.md`](docs/process/plan.md): live-research-first (no fabricated facts), design-then-build, static delivery.

**2. Parallel research agents.** Two agents fanned out to verify real tournament data — 华拓 (results & the final matchup) and 柏格 (milestones & records) — and came back with sourced briefs.

**3. Design lock.** A 6-page「午夜球场·金色时刻」system with 28 planned visual assets.

**4. Scaffold agent** 黎曼 generated 27 images with an image tool, built the Home page and the shared component library.

**5. Five page agents in parallel** built Milestones / Legends / Matches / Newcomers / Final on separate git branches, then an **octopus merge** assembled the site. The swarm even recovered when one agent's worktree got wiped mid-task.

**6. Self-healing release.** The first version snapshot missed `dist/` (it was in `.gitignore`) and the preview failed — the swarm diagnosed it, rebuilt, force-committed dist, re-versioned, shipped. V3 is what's live now.

![The swarm at work](docs/media/swarm.jpg)

## 📂 Structure

```
src/
├── pages/         # Home / Milestones / Legends / Matches / Newcomers / Final
├── sections/      # home sections (Hero, ParticleField, NumbersGallery, …)
├── components/    # shared UI (GlowCard, ScorePill, CustomCursor, …)
└── lib/
public/            # 27 AI-generated images
docs/process/      # the swarm's own artifacts (plan.md, design notes)
```

## 🎁 Try Kimi K3 Yourself

通过我的邀请链接注册 Kimi，双方 100% 拿奖，最高可得 1 年会员等值权益 👉 [点击助力](https://kimi-bot.com/activities/zh-cn/viral-referral/share?scenario=invite&from=share_poster&invitation_code=YZYK4)

<a href="https://kimi-bot.com/activities/zh-cn/viral-referral/share?scenario=invite&from=share_poster&invitation_code=YZYK4">
  <img src="docs/referral.png" alt="Kimi referral" width="280">
</a>

---

Also built by the same swarm: [kimi-k3-fps-arena](https://github.com/genglintong/kimi-k3-fps-arena) — a playable browser arena shooter vs AI bots.

Built with [Kimi K3](https://www.kimi.com) swarm mode. If AI-built sites impress you, drop a ⭐.
