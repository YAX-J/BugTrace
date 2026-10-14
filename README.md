# BugTrace

BugTrace 帮助开发者重建 Bug 排查过程，并把经过证据校验的经验保存为可检索方案。MVP 先跑通两条路径：

1. 手动开始/结束排查会话，采集命令、文件、Git 和测试事件，生成有证据来源的总结。
2. 导入公开仓库或本地仓库，由用户选择提交后生成“仅提交证据”的 Bug 总结。

## 项目状态

当前仓库处于工程初始化阶段。`web/` 已实现基于 mock 数据的 Vue 前端，服务端和采集器仍只有目录骨架。产品范围与验收基线见 [MVP 范围摘要](docs/MVP_SCOPE.md)；本地完整方案为 `docs/Bug排查轨迹重建与经验复用_MVP阶段方案_v2.docx`。文档中的“待定/建议”是实施前需要确认的事项，不应当被当作已实现能力。

## 文档入口

- [AI 与贡献者工作约定](AGENTS.md)
- [工程规范](docs/ENGINEERING_STANDARDS.md)
- [开发与交付约定](docs/DEVELOPMENT.md)
- [安全与隐私基线](docs/SECURITY.md)
- [MVP 实施决策清单](docs/DECISIONS.md)
- [贡献指南](CONTRIBUTING.md)

## 技术方向（以 MVP 方案为准）

- 服务端：Java 17 或 21、Spring Boot 3、MyBatis-Plus
- 本地采集器：Java、JDK `WatchService`、Git CLI
- 前端：Vue 3、Element Plus
- 存储：MySQL 8；中文全文检索方案仍待验证
- 模型：支持工具调用的模型 API，供应商与模型版本待选

这些是方案中的候选/目标，不代表仓库已锁定版本或已经搭建对应工程。开始实现时，应把实际版本、构建命令、格式化与静态检查工具写入本 README 和相应配置。

## 目录结构

```text
BugTrace/
├─ server/       服务端 API、规则、会话与 Agent 编排
├─ collector/    本地事件采集、脱敏、缓冲与上传
├─ web/          Vue 管理页面
├─ contracts/    跨模块事件及 API 契约
├─ database/     数据库迁移与数据说明
├─ demo/         可重复的 MVP 演示场景
├─ scripts/      开发、构建与运维入口脚本
└─ docs/         产品、工程、安全与架构决策文档
```

目录职责见各目录内的 README，布局决策见 [ADR-0001](docs/decisions/0001-repository-layout.md)。

## 运行前端

```powershell
cd web
pnpm install
pnpm dev
```

前端当前使用 mock 数据，不会连接服务端。访问 Vite 输出的本地地址后，可通过左侧导航查看六个 MVP 页面。

## MVP 的硬边界

- 规则代码负责指纹、尝试分类和事件相关性；Agent 不替代规则，也不向排查中的用户主动给建议。
- Agent 输出必须引用可核验的证据；不能证明的内容标为“未验证”或“推断”。校验失败时重试一次，然后退回模板。
- 方案只有用户确认后才进入知识库。提交推荐只供参考，提交由用户选择。
- 采集端先脱敏并在本地缓冲；默认排除密钥文件和 `.env`。
- 导入仓库只读；禁用仓库钩子，不运行仓库内代码、脚本或构建；限制仓库大小、耗时和读取范围。

