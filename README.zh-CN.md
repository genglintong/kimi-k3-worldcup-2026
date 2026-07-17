# 传奇里程碑 Milestones·26 — 2026 世界杯 ⚽🏆

> 一句话提示词 → Kimi K3 集群（调研 + 设计 + 6 个构建代理）→ 数据真实、动效拉满的世界杯里程碑网站。全程零人工代码。

[🇺🇸 English](README.md) · [🌐 **在线访问**](https://l3lpakqodhark.ok.kimi.link) · [它是怎么被 K3 集群造出来的](#-它是怎么被-k3-集群造出来的全程实录)

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
- **新军物语** — 库拉索 15 扑救门神、佛得角黑马传奇、约旦、乌兹别克斯坦
- **巅峰对决** — 西阿决赛前瞻：红蓝分屏英雄区、梅西×亚马尔竞速图、晋级之路 stepper

![首页 Hero](docs/media/hero.jpg)

### 设计与动效

- 🎨 「午夜球场 × 金色时刻」视觉体系：深色底 + 金/青点缀
- 🖼 **27 张 AI 生成视觉资产**：球星肖像、比赛场景、球场 Hero、大力神杯
- 🎬 GSAP 滚动钉住 + Lenis 平滑滚动 + 字符级标题入场 + 数字滚动计数 + 金色斜切页面转场 + 自定义光标 + 可拖拽巨星长廊，外加 Three.js 粒子场
- 📊 所有比分、纪录、日期均由 ESPN/AP/Reuters/Opta 多源交叉验证 —— 执行计划明令禁止编造

![梅西 · 21 球世界杯历史射手王](docs/media/legends-messi.jpg)

## 🛠 技术栈

React 19 · TypeScript · Vite · Tailwind CSS · Three.js · GSAP · Framer Motion · Lenis

## 🐝 它是怎么被 K3 集群造出来的（全程实录）

整个过程中人类只输入了一句话：

> 「帮我做一个炫酷的网站 来展示本届世界杯的精彩里程碑，要炫酷的动态的效果」

### 1️⃣ 先计划 —— 而且先立事实规矩

编排器先写 [`docs/process/plan.md`](docs/process/plan.md)：必须联网调研真实数据，明令禁止编造，最后静态交付。

### 2️⃣ 双调研子代理，动真格的严谨

**华拓**（赛况与决赛对阵）与**柏格**（里程碑与纪录）分头核实，ESPN/AP/Reuters/Opta 多源交叉验证。遇到来源打架（比如佛得角到底小组第几出线），代理自己算积分而不是照抄标题。全站标注"截至 2026-07-16"，决赛以前瞻姿态呈现 —— "毕竟 7 月 19 日还没踢呢 😄"。

![一句话 → plan.md → 双调研代理](docs/media/swarm.jpg)

### 3️⃣ 设计定稿，资产工厂开工

6 页「午夜球场·金色时刻」方案，规划 28 项视觉资产。脚手架代理**黎曼**用图像生成工具产出 27 张电影感配图，同时完成首页与共享组件库。

![设计定稿与黎曼生成 27 张资产](docs/media/story-scaffold.jpg)

### 4️⃣ 💥 五页面代理并行 —— 一个的工作树被清了

五个页面在各自 git 分支并行开发。中途里程碑代理的工作区**被并发操作异常清理** —— 集群发现后自己恢复，其余四个不停工。

![5 页面代理并行；一个工作树被清后恢复](docs/media/story-wipe.jpg)

### 5️⃣ 章鱼合并 + 契约检查

五个分支一记 **octopus merge 零冲突**合体。路由由脚手架预接线（页面代理直接替换实现文件），契约检查 + 生产构建通过。

![章鱼合并成功无冲突](docs/media/story-merge.jpg)

### 6️⃣ 💥 发布栽了两次 —— 两次都自己爬起来了

- **V1 `94a88ec`**：版本快照漏带 `dist/`（被 `.gitignore` 忽略）→ 预览失败。集群诊断后重建，强制提交 35 个产物文件 → **V2 `e1907a4`**。
- 平台预览继续抖动 → 重建快照 → **V3 `f97853e`**，即当前线上版本。
- 附带收获：之后发现「全部文件」工作区停在旧脚手架状态（分支指针走了、工作区没跟上）—— 也一并定位修复。

![交付总结与 V1 失败反馈](docs/media/story-final.jpg)

### 📊 成绩单

- ✅ 多源交叉验证的真调研 · 诚实的数据标注 · 27 张自制视觉资产 · 6 代理并行构建 · 章鱼合并 · 两度自愈发布
- 💥 子代理工作区被清（已恢复）· V1 快照漏产物（V2 修复）· 工作区快照陈旧（导出时修复）

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
