# Web

BugTrace Web 使用 Vue 3、TypeScript、Vite、Vue Router 和 Element Plus，实现 MVP 原型中的六个页面。当前数据全部来自 `src/mocks/data.ts`，不会访问服务端。

## 运行

```powershell
pnpm install
pnpm dev
```

构建与类型检查：

```powershell
pnpm build
pnpm typecheck
```

## 页面

- `/`：工作台
- `/sessions/BS-20250427-001`：Bug 排查会话详情
- `/events`：事件关联分析
- `/attempts`：修复尝试管理
- `/knowledge`：经验知识库
- `/collectors`：采集器管理

交互状态只保存在页面内存中，包括移出/恢复事件、结束会话、知识库搜索和采集配置。接入后端时应通过 API 层替换 mock 数据，并继续保留证据来源、Agent 草稿和用户确认状态。

