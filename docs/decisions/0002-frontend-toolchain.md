# ADR-0002: 前端采用 Vue 3、Vite、TypeScript 与 Element Plus

- 状态：已接受
- 日期：2026-10-14
- 关联：MVP F6、F7、F11、F12、F14、F16、F17

## 背景

MVP 方案已将 Vue 3 与 Element Plus 作为前端方向。仓库需要先基于 mock 数据实现工作台、会话详情、事件关联、修复尝试、经验知识库和采集器管理，以验证信息结构，再接入服务端 API。

## 决策

前端采用 Vue 3.5、Vite 8、TypeScript 5.9、Vue Router 5、Element Plus 2.14 和 pnpm。依赖的精确版本记录在 `web/package.json` 与 lockfile 中。TypeScript 保持在 5.9，是因为当前 `vue-tsc` 尚不能使用 TypeScript 7 的内部编译入口。

业务数据先集中在 `web/src/mocks/data.ts`。页面交互只修改内存数据，不模拟持久化成功。接入服务端时增加 API 适配层，并保持页面组件不直接依赖 HTTP 实现。

## 备选方案

- React：生态成熟，但与 MVP 方案已确定的 Vue 方向不一致。
- 仅使用静态 HTML 原型：制作快，但无法承载路由、交互状态和后续 API 接入。
- 自建组件库：控制力高，但 MVP 阶段会消耗过多实现与无障碍维护成本。

## 后果

- 六个页面可共享导航、状态色和基础组件，并可逐页替换 mock 数据。
- Element Plus 负责表单、弹窗和基础交互；产品识别度由布局、颜色、时间线和证据呈现方式实现。
- 正式 API 接入前，界面展示不代表后端、采集器或模型能力已经完成。

## 验证与回退

以类型检查和生产构建作为前端最低验证入口。若 Vite 或 Vue Router 的主版本造成生态兼容问题，通过新 ADR 记录降级或迁移原因，并更新 lockfile。

