# Repository Guidelines

## Project Structure & Module Organization
This repository is a multi-module monorepo. Backend services live in top-level directories such as `itm-user/`, `itm-team/`, `itm-study/`, and `itm-cloud-framework/`; each service usually follows the same split: `*-server`, `*-domain`, `*-app`, `*-interface`, `*-infra`, and `*-api`. Java sources use standard Maven paths under `src/main/java` and tests under `src/test/java`.

Frontend applications are separate workspaces: `itm-ui/` for the desktop app, `itm-mobile-ui/` for the mobile app, and `deploy-tool/front-end/` for deployment tooling. Shared docs and helper scripts are in `docs/`, `scripts/`, and each module’s own `scripts/` directory.

## Build, Test, and Development Commands
Use module-local commands rather than assuming a single root build.

- `mvn -f itm-user/pom.xml test`: run backend tests for one service.
- `mvn -f itm-cloud-framework/pom.xml clean install`: build shared framework modules.
- `npm install && npm run dev` in `itm-ui/`: start the desktop frontend with Rsbuild.
- `npm install && npm run dev` in `itm-mobile-ui/`: start the mobile frontend locally.
- `pnpm install && pnpm dev` in `deploy-tool/front-end/`: run the deployment center UI.
- `npm test` in `itm-ui/` or `itm-mobile-ui/`: run Jest tests.

## Coding Style & Naming Conventions
Java targets JDK 17 and standard Maven conventions. Keep packages lowercase (`com.codingapi.itm...`), classes `PascalCase`, methods and fields `camelCase`, and test classes suffixed with `Test`. In the frontends, prefer `PascalCase` for React components and `camelCase` for hooks, helpers, and API modules.

Follow existing file patterns: page code under `src/pages/`, API clients under `src/api/`, and assets under `src/assets/`. Match surrounding indentation and formatting in touched files; this repo does not expose a single root formatter config.

## Testing Guidelines
Backend tests use Spring Boot’s Maven test stack with JaCoCo enabled in shared POMs. Add tests beside the module you change, under `src/test/java`, and name them `*Test.java`. Frontend tests use Jest; keep tests in existing patterns such as `jest/map.test.ts` or `*.test.ts(x)`.

Run the smallest relevant test set before opening a PR, and include any skipped coverage in the PR description.

## Commit & Pull Request Guidelines
Recent history shows a mix of Conventional Commits and short fix messages; prefer Conventional Commit prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`. Keep each commit focused on one change.

PRs should target `develop`, include a short problem/solution summary, reference the related issue or task ID, and attach screenshots for `itm-ui`, `itm-mobile-ui`, or `deploy-tool/front-end` changes. Rebase or merge from the latest `develop` before submitting.

# Development Rules

After completing code changes:

1. Run tests if possible
2. Run eslint/prettier if available
3. git add modified files
4. Generate a clear conventional commit message
5. git commit automatically
6. git push origin current branch

Commit style:
- feat:
- fix:
- refactor:
- perf:
- style:
- docs:

Examples:
feat(annotation): support dynamic comment layout
fix(editor): resolve overlapping highlight issue
refactor(signature): optimize canvas rendering


# Git 规范

- 禁止直接 push master
- 所有修改必须创建 feature 分支
- push 到 origin
- commit 使用 conventional commit
- commit message 使用中文
- push 后自动创建 MR

# UI Rules

所有页面必须：

- 使用 8px spacing system
- Card 圆角 12px
- 禁止大面积纯白
- 操作按钮右对齐
- 表单自动响应式
- Tag 使用统一状态色
- 优先使用tailwind.css
- 页面层级：
  Header
  Toolbar
  Content
  Sidebar(optional)

# UX Rules

- 减少 Modal 嵌套
- 减少用户滚动
- 优先信息分组
- 高危操作二次确认

# Stack

React + Ant Design + TypeScript

# Git 分支规则

当用户说“新建一个 xx 的分支”时，按下面流程执行：



1. 从 upstream/develop 新建分支：
   git checkout -b <branch-name> upstream/develop

2. 分支命名规则：
   - 功能开发：feature/<简短英文功能名>
   - 修复问题：fix/<简短英文问题名>
   - 优化重构：refactor/<简短英文说明>
   - 样式调整：style/<简短英文说明>
   - 文档变更：docs/<简短英文说明>

3. 如果用户只用中文描述功能，自动翻译成简短英文 kebab-case。
   例如：
   - 新建一个风险排查列表优化的分支
     => feature/risk-check-list-optimization
   - 新建一个修复登录跳转的分支
     => fix/login-redirect
   - 新建一个批注连线重构的分支
     => refactor/annotation-line

4. 新建分支前必须先检查当前工作区：
   git status --short

5. 如果当前工作区有未提交修改，不要直接切分支，先询问用户如何处理。

6. 分支创建成功后执行：
   git fetch upstream



   # File Structure Rules

创建新页面、新组件、新模块时，必须先创建目录。

目录命名规则：

- 使用 kebab-case
- 禁止 camelCase
- 禁止 PascalCase

正确示例：

- risk-check-list
- annotation-panel
- user-profile-card

错误示例：

- riskCheckList
- RiskCheckList

---

---

# Component Rules

创建组件时：

目录结构：

```text
name/
├── index.tsx
├── index.scss
├── types.ts
```

禁止：

- 单独创建 Component.tsx
- 文件直接散落当前目录
- 超长 jsx 文件

---

# Hooks Rules

复杂逻辑必须抽离 hooks：

```text
hooks/
├── use-table.ts
├── use-selection.ts
└── use-annotation.ts
```

禁止：

- 巨型 useEffect
- 页面内超过 3 个 useState 仍不拆 hooks

---

# Style Rules

样式文件：

- 默认使用 index.scss
- 与组件同目录
- 禁止全局污染

---

# Done Criteria

创建页面后必须：

1. 自动创建目录结构
2. 自动补充空文件
3. 自动 export
4. 运行：


## 执行规则

- 不要自动执行 npm run build
- 不要自动执行 npm run dev
- 不要自动执行 npm run test
- 不要自动启动本地服务
- 修改代码后只输出变更内容
- 除非我明确要求，否则不要运行任何耗时命令

# 通用规则

- 所有代码必须可读、可维护、可扩展
- 优先保证代码清晰，而不是炫技
- 优先使用已有工具函数、组件、hooks
- 修改代码时必须保持现有代码风格一致
- 禁止随意修改无关代码
- 禁止删除已有业务逻辑
- 禁止生成无意义代码
- 禁止生成临时代码后不清理
- 禁止保留 debug 代码
- 禁止输出乱码
- 所有新增代码必须通过 TypeScript 类型检查
- 优先复用已有类型定义
- 优先复用已有组件
- 优先复用已有 hooks
- 优先复用已有 api 方法

---

# 注释规则

## 总原则

- 注释解释“为什么”
- 不要重复“做了什么”
- 所有注释必须使用中文
- 注释必须简洁清晰
- 优先通过命名提升可读性
- 不得生成无意义注释
- 不得生成英文注释

---

# 必须添加注释的场景

以下情况必须添加注释：

- 复杂业务逻辑
- 特殊边界处理
- 防抖/节流逻辑
- 权限逻辑
- 兼容逻辑
- DOM 定位逻辑
- 富文本处理逻辑
- 布局计算逻辑
- 高亮逻辑
- 排序逻辑
- 递归逻辑
- useEffect 依赖原因
- 性能优化逻辑
- magic number
- 状态同步逻辑
- 异步竞态处理

---

# 禁止的垃圾注释

禁止：

```ts
// 设置 loading
setLoading(true)

// 获取数据
const data = await api()

// 遍历数组
list.map()

// 判断是否为空
if (!list.length)


# Repository Guidelines

## Project Structure & Module Organization
This repository is a multi-module monorepo. Backend services live in top-level directories such as `itm-user/`, `itm-team/`, `itm-study/`, and `itm-cloud-framework/`; each service usually follows the same split: `*-server`, `*-domain`, `*-app`, `*-interface`, `*-infra`, and `*-api`. Java sources use standard Maven paths under `src/main/java` and tests under `src/test/java`.

Frontend applications are separate workspaces: `itm-ui/` for the desktop app, `itm-mobile-ui/` for the mobile app, and `deploy-tool/front-end/` for deployment tooling. Shared docs and helper scripts are in `docs/`, `scripts/`, and each module’s own `scripts/` directory.

## Build, Test, and Development Commands
Use module-local commands rather than assuming a single root build.

- `mvn -f itm-user/pom.xml test`: run backend tests for one service.
- `mvn -f itm-cloud-framework/pom.xml clean install`: build shared framework modules.
- `npm install && npm run dev` in `itm-ui/`: start the desktop frontend with Rsbuild.
- `npm install && npm run dev` in `itm-mobile-ui/`: start the mobile frontend locally.
- `pnpm install && pnpm dev` in `deploy-tool/front-end/`: run the deployment center UI.
- `npm test` in `itm-ui/` or `itm-mobile-ui/`: run Jest tests.

## Coding Style & Naming Conventions
Java targets JDK 17 and standard Maven conventions. Keep packages lowercase (`com.codingapi.itm...`), classes `PascalCase`, methods and fields `camelCase`, and test classes suffixed with `Test`. In the frontends, prefer `PascalCase` for React components and `camelCase` for hooks, helpers, and API modules.

Follow existing file patterns: page code under `src/pages/`, API clients under `src/api/`, and assets under `src/assets/`. Match surrounding indentation and formatting in touched files; this repo does not expose a single root formatter config.

## Testing Guidelines
Backend tests use Spring Boot’s Maven test stack with JaCoCo enabled in shared POMs. Add tests beside the module you change, under `src/test/java`, and name them `*Test.java`. Frontend tests use Jest; keep tests in existing patterns such as `jest/map.test.ts` or `*.test.ts(x)`.

Run the smallest relevant test set before opening a PR, and include any skipped coverage in the PR description.

## Commit & Pull Request Guidelines
Recent history shows a mix of Conventional Commits and short fix messages; prefer Conventional Commit prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`. Keep each commit focused on one change.

PRs should target `develop`, include a short problem/solution summary, reference the related issue or task ID, and attach screenshots for `itm-ui`, `itm-mobile-ui`, or `deploy-tool/front-end` changes. Rebase or merge from the latest `develop` before submitting.

# Development Rules

After completing code changes:

1. Run tests if possible
2. Run eslint/prettier if available
3. git add modified files
4. Generate a clear conventional commit message
5. git commit automatically
6. git push origin current branch

Commit style:
- feat:
- fix:
- refactor:
- perf:
- style:
- docs:

Examples:
feat(annotation): support dynamic comment layout
fix(editor): resolve overlapping highlight issue
refactor(signature): optimize canvas rendering


# Git 规范

- 禁止直接 push master
- 所有修改必须创建 feature 分支
- push 到 origin
- commit 使用 conventional commit
- commit message 使用中文
- push 后自动创建 MR

# UI Rules

所有页面必须：

- 使用 8px spacing system
- Card 圆角 12px
- 禁止大面积纯白
- 操作按钮右对齐
- 表单自动响应式
- Tag 使用统一状态色
- 页面层级：
  Header
  Toolbar
  Content
  Sidebar(optional)

# UX Rules

- 减少 Modal 嵌套
- 减少用户滚动
- 优先信息分组
- 高危操作二次确认

# Stack

React + Ant Design + TypeScript

# Git 分支规则

当用户说“新建一个 xx 的分支”时，按下面流程执行：



1. 从 upstream/develop 新建分支：
   git checkout -b <branch-name> upstream/develop

2. 分支命名规则：
   - 功能开发：feature/<简短英文功能名>
   - 修复问题：fix/<简短英文问题名>
   - 优化重构：refactor/<简短英文说明>
   - 样式调整：style/<简短英文说明>
   - 文档变更：docs/<简短英文说明>

3. 如果用户只用中文描述功能，自动翻译成简短英文 kebab-case。
   例如：
   - 新建一个风险排查列表优化的分支
     => feature/risk-check-list-optimization
   - 新建一个修复登录跳转的分支
     => fix/login-redirect
   - 新建一个批注连线重构的分支
     => refactor/annotation-line

4. 新建分支前必须先检查当前工作区：
   git status --short

5. 如果当前工作区有未提交修改，不要直接切分支，先询问用户如何处理。

6. 分支创建成功后执行：
   git fetch upstream



   # File Structure Rules

创建新页面、新组件、新模块时，必须先创建目录。

目录命名规则：

- 使用 kebab-case
- 禁止 camelCase
- 禁止 PascalCase

正确示例：

- risk-check-list
- annotation-panel
- user-profile-card

错误示例：

- riskCheckList
- RiskCheckList

---

---

# Component Rules

创建组件时：

目录结构：

```text
name/
├── index.tsx
├── index.scss
├── types.ts
```

禁止：

- 单独创建 Component.tsx
- 文件直接散落当前目录
- 超长 jsx 文件

---

# Hooks Rules

复杂逻辑必须抽离 hooks：

```text
hooks/
├── use-table.ts
├── use-selection.ts
└── use-annotation.ts
```

禁止：

- 巨型 useEffect
- 页面内超过 3 个 useState 仍不拆 hooks

---

# Style Rules

样式文件：

- 默认使用 index.scss
- 与组件同目录
- 禁止全局污染

---

# Done Criteria

创建页面后必须：

1. 自动创建目录结构
2. 自动补充空文件
3. 自动 export
4. 运行：


## 执行规则

- 不要自动执行 npm run build
- 不要自动执行 npm run dev
- 不要自动执行 npm run test
- 不要自动启动本地服务
- 修改代码后只输出变更内容
- 除非我明确要求，否则不要运行任何耗时命令

# 通用规则

- 所有代码必须可读、可维护、可扩展
- 优先保证代码清晰，而不是炫技
- 优先使用已有工具函数、组件、hooks
- 修改代码时必须保持现有代码风格一致
- 禁止随意修改无关代码
- 禁止删除已有业务逻辑
- 禁止生成无意义代码
- 禁止生成临时代码后不清理
- 禁止保留 debug 代码
- 禁止输出乱码
- 所有新增代码必须通过 TypeScript 类型检查
- 优先复用已有类型定义
- 优先复用已有组件
- 优先复用已有 hooks
- 优先复用已有 api 方法

---

# 注释规则

## 总原则

- 注释解释“为什么”
- 不要重复“做了什么”
- 所有注释必须使用中文
- 注释必须简洁清晰
- 优先通过命名提升可读性
- 不得生成无意义注释
- 不得生成英文注释

---

# 必须添加注释的场景

以下情况必须添加注释：

- 复杂业务逻辑
- 特殊边界处理
- 防抖/节流逻辑
- 权限逻辑
- 兼容逻辑
- DOM 定位逻辑
- 富文本处理逻辑
- 布局计算逻辑
- 高亮逻辑
- 排序逻辑
- 递归逻辑
- useEffect 依赖原因
- 性能优化逻辑
- magic number
- 状态同步逻辑
- 异步竞态处理

---

# 禁止的垃圾注释

禁止：

```ts
// 设置 loading
setLoading(true)

// 获取数据
const data = await api()

// 遍历数组
list.map()

// 判断是否为空
if (!list.length)



## Styling Rules

- 默认使用 Tailwind CSS
- 禁止创建新的 css/scss/less 文件
- 禁止使用 styled-components/emotion
- 禁止使用内联 style

### Tailwind

- 优先使用 flex/grid 布局
- 优先使用 gap 替代 margin
- 使用 Tailwind spacing scale
- 使用响应式断点 sm/md/lg/xl
- className 保持可读性

### antd

- 优先通过 className + Tailwind 覆盖样式
- 非必要不要覆盖 antd 内部 css
- 不要使用 !important

---

## Component Rules

- 使用函数组件
- 使用 hooks
- 组件尽量拆分
- 保持类型完整

---

## Output Rules

- 修改 UI 默认使用 Tailwind
- 不要生成 CSS 文件
- 不要生成无意义注释
- 不要过度封装

# UI / Design Rules

## Theme

Primary color: #1677ff
Success color: #52c41a
Warning color: #faad14
Error color: #ff4d4f

## Tailwind Rules

- Always use Tailwind utility classes first
- Do NOT create new css/scss files unless absolutely necessary
- Prefer existing design tokens
- Avoid inline styles
- Avoid random colors

## Color Usage

Use ONLY the following colors:

- Primary: `text-blue-500 bg-blue-500 border-blue-500`
- Success: `text-green-500 bg-green-500`
- Error: `text-red-500 bg-red-500`
- Warning: `text-yellow-500 bg-yellow-500`

Do NOT use arbitrary hex colors unless explicitly required.

## Component Style

- Prefer rounded-xl
- Prefer subtle shadows
- Use spacing scale from Tailwind
- Use consistent hover transitions
- Use `transition-all duration-200`

## Layout

- Mobile-first responsive
- Prefer flex/grid layouts
- Avoid fixed widths
- Prefer max-width containers

## Typography

- Prefer text-sm / text-base
- Avoid oversized titles
- Keep visual hierarchy clean

## Forbidden

- No hardcoded random colors
- No legacy css modules
- No !important
- No duplicated styles


# 强制样式规则（最高优先级）

- 所有新增 UI 必须使用 Tailwind CSS
- 禁止修改已有 scss/css/less 文件
- 禁止新增 scss/css/less 文件
- 即使当前页面存在 scss，也必须优先改为 Tailwind className
- antd 样式优先通过 className + Tailwind 覆盖
- 除非我明确要求，否则不要使用 index.scss


