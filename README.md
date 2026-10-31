# Spring Learn

移动优先的交互式学习应用：用「费曼学习法 + 习题带练」系统吃透 **Spring / Spring Boot / RuoYi**。

核心闭环：**学知识点 → 用自己的话讲一遍 → 做题检验 → 记录掌握度 → 复习未掌握项。**

## 本地预览

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000/spring （basePath 为 `/spring`，与 GitHub Pages 子路径一致）。

```bash
pnpm build      # 静态导出到 out/
pnpm typecheck  # TS 严格检查
```

## 技术栈

- Next.js 15（App Router · TypeScript 严格模式 · `output: 'export'` 静态导出）
- Tailwind CSS v4 + shadcn/ui（code-block 为同接口本地实现，Shiki 高亮）
- 视觉：Apple Liquid Glass —— 动态 mesh gradient 背景 + `backdrop-filter` 玻璃层 + 彩色边缘高光；iOS Safari 通过 `@supports` 自动降级
- 数据：纯 localStorage（key 前缀 `spring-learn:`），支持 JSON 导出 / 导入（覆盖 / 合并）/ 清空

## 目录速览

```
src/
├── app/                 # 路由：/ /learn/[track]/[id] /practice /notes /roadmap
├── components/
│   ├── glass/           # 液态玻璃基础组件
│   ├── learning/        # 费曼面板 / 刷题引擎 UI / 笔记 / 进度环
│   ├── layout/          # Sidebar(桌面) + BottomNav(移动)
│   └── ui/              # shadcn 组件 + code-block
├── data/
│   ├── topics/          # 知识点 JSON（按 track 分目录）
│   └── quiz/            # 习题 JSON（与 topics 同构组织）
├── hooks/               # use-learning-store / use-quiz-engine / use-import-export
└── lib/                 # types / content(注册表) / learning-store / quiz-utils
```

## 内容批次

| 批次 | 内容 | 状态 |
|---|---|---|
| 第一批 | Spring 核心：IoC/DI/Bean/AOP 10 讲 + 30 题 | ✅ 已上线 |
| 第二批 | Spring Boot：自动装配/配置体系 10 讲 + 30 题 | ⏳ 筹备中 |
| 第三批 | RuoYi：架构/RBAC/核心源码 10 讲 + 30 题 | ⏳ 筹备中 |

## 部署

push 到 `main` 触发 GitHub Actions（`.github/workflows/deploy.yml`）：Node 22 + pnpm 9 构建，静态产物部署到 GitHub Pages（`https://laihaibo.github.io/spring/`）。首次部署需在仓库 Settings → Pages 中把 Source 设为 **GitHub Actions**。
