# 传奇里程碑 Milestones·26 — 2026 世界杯 ⚽🏆

> 一句话提示词 → Kimi K3 集群（调研 + 设计 + 6 个构建代理）→ 数据真实、动效拉满的世界杯里程碑网站。全程零人工代码。

[🇺🇸 English](README.md) · [🌐 **在线访问**](https://l3lpakqodhark.ok.kimi.link) · [它是怎么被 K3 集群造出来的](#-它是怎么被-k3-集群造出来的)

![整页滚动浏览](docs/media/scroll.gif)

**「午夜球场 · 金色时刻」——史上最疯狂的一届世界杯：48 队、104 场、三国联办、650 万+现场观众。**

## 🌐 访问

**在线版：** https://l3lpakqodhark.ok.kimi.link （Kimi 托管）

**本地跑：**

```bash
npm install
npm run dev                  # 开发模式
# 或
npm run build && npm run preview   # 生产构建 + 本地预览
```

## ✨ 内容

六个页面，全部由集群在赛事期间联网调研真实数据（截至 2026-07-16 半决赛后）：

- **首页** — AI 生成的午夜球场上电影感 Hero + 决赛（7月19日 西班牙 vs 阿根廷 · MetLife）实时倒计时
- **赛事里程碑** — 本届改写的纪录：首届 48 队、首次三国联办、史上最长赛程、上座纪录
- **巨星** — 梅西第 21 球加冕世界杯历史射手王、C罗告别、亚马尔崛起
- **经典战役** — 淘汰赛经典战役的动效卡片
- **新军物语** — 佛得角、库拉索、约旦、乌兹别克斯坦：新军故事
- **巅峰对决** — 西阿决赛前瞻

![首页 Hero](docs/media/hero.jpg)

### 设计与动效

- 🎨 「午夜球场 × 金色时刻」视觉体系：深色底 + 金/青点缀
- 🖼 **27 张 AI 生成视觉资产**：球星肖像、比赛场景、球场 Hero、大力神杯
- 🎬 Three.js 粒子场、GSAP 滚动触发、Framer Motion 页面过渡、Lenis 平滑滚动、数字滚动计数、自定义光标
- 📊 所有事实（比分、纪录、日期）均来自实时联网调研 —— 执行计划明令禁止编造

![梅西 · 21 球世界杯历史射手王](docs/media/legends-messi.jpg)

## 🛠 技术栈

React 19 · TypeScript · Vite · Tailwind CSS · Three.js · GSAP · Framer Motion · Lenis

## 🐝 它是怎么被 K3 集群造出来的

整个过程中人类只输入了一句话：

> 「帮我做一个炫酷的网站 来展示本届世界杯的精彩里程碑，要炫酷的动态的效果」

### 1️⃣ 先计划后编码

编排器先写 [`docs/process/plan.md`](docs/process/plan.md)：调研先行（禁止编造事实）、设计驱动构建、静态交付。

### 2️⃣ 双调研子代理并行

**华拓**（赛况与决赛对阵）与**柏格**（里程碑与纪录）分头核实真实赛事数据，带回带出处的事实简报。

### 3️⃣ 设计定稿

6 页「午夜球场·金色时刻」方案，规划 28 项视觉资产。

### 4️⃣ 脚手架子代理

**黎曼**用图像生成工具产出 27 张资产图，同时完成首页与共享组件库。

### 5️⃣ 五页面子代理并行 + 章鱼合并

五个页面（里程碑/巨星/经典战役/新军物语/巅峰对决）在各自 git 分支并行开发，最后一记 **octopus merge** 合体。中途有子代理工作区被并发清掉，集群自己恢复继续。

### 6️⃣ 自愈式发布

首个版本快照漏带 `dist/`（被 `.gitignore` 忽略）导致预览失败 —— 集群自己诊断、重建、强制提交产物、重新发版。现在线上的就是修复后的 V3。

![集群工作实况](docs/media/swarm.jpg)

## 📂 目录结构

```
src/
├── pages/         # 首页 / 里程碑 / 巨星 / 经典战役 / 新军物语 / 巅峰对决
├── sections/      # 首页区块（Hero、粒子场、数字墙……）
├── components/    # 共享组件（辉光卡片、比分胶囊、自定义光标……）
└── lib/
public/            # 27 张 AI 生成配图
docs/process/      # K3 集群的过程产物（plan.md 等）
```

## 🎁 想亲手试试 Kimi K3？

通过我的邀请链接注册 Kimi，双方 100% 拿奖，最高可得 1 年会员等值权益 👉 [点击助力](https://kimi-bot.com/activities/zh-cn/viral-referral/share?scenario=invite&from=share_poster&invitation_code=YZYK4)

<a href="https://kimi-bot.com/activities/zh-cn/viral-referral/share?scenario=invite&from=share_poster&invitation_code=YZYK4">
  <img src="docs/referral.png" alt="Kimi 邀请海报" width="280">
</a>

---

同一个集群的另一个作品：[kimi-k3-fps-arena](https://github.com/genglintong/kimi-k3-fps-arena) —— 可玩的浏览器 AI 对战枪战游戏。

由 [Kimi K3](https://www.kimi.com) 集群模式构建。觉得不错就 ⭐ 一个。
