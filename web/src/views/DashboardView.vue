<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import MetricCard from '../components/MetricCard.vue'
import StatusPill from '../components/StatusPill.vue'
import { activeSession, dashboardMetrics, recentSessions } from '../mocks/data'

const router = useRouter()
</script>

<template>
  <section class="page dashboard">
    <header class="page-header welcome">
      <div><h1>你好，开发者 1 <span>👋</span></h1><p>这里是你的 Bug 排查工作台。先把当前问题闭环，再把证据完整地留下来。</p></div>
      <div class="today"><AppIcon name="clock" :size="16" /><span>2025 年 4 月 27 日</span></div>
    </header>

    <div class="metric-grid">
      <MetricCard v-for="metric in dashboardMetrics" :key="metric.label" :metric="metric" />
    </div>

    <div class="dashboard-grid">
      <article class="panel active-case">
        <div class="panel-head"><div class="head-group"><h2>当前排查会话</h2><StatusPill label="紧急" tone="danger" /></div><button class="section-link" @click="router.push(`/sessions/${activeSession.id}`)">查看详情</button></div>
        <div class="panel-body">
          <span class="evidence-id">#{{ activeSession.id }}</span>
          <h3>{{ activeSession.title }}</h3>
          <dl class="case-meta">
            <div><dt>项目</dt><dd>{{ activeSession.project }}</dd></div>
            <div><dt>开始时间</dt><dd>{{ activeSession.startedAt }}</dd></div>
            <div><dt>关联事件</dt><dd>{{ activeSession.eventCount }} 条</dd></div>
            <div><dt>当前尝试</dt><dd>第 3 次</dd></div>
          </dl>
          <div class="progress-row"><span>解决进度</span><b>{{ activeSession.progress }}%</b></div>
          <el-progress :percentage="activeSession.progress" :stroke-width="7" :show-text="false" />
          <div class="case-actions"><span><i></i>采集器正在记录事件</span><el-button type="primary" @click="router.push(`/sessions/${activeSession.id}`)">继续排查</el-button></div>
        </div>
      </article>

      <article class="panel recent-cases">
        <div class="panel-head"><h2>最近排查记录</h2><button class="section-link" @click="router.push('/sessions')">查看全部</button></div>
        <div class="session-list">
          <button v-for="session in recentSessions.slice(1)" :key="session.id" @click="router.push(`/sessions/${session.id}`)">
            <span class="session-main"><b>#{{ session.id }}</b><strong>{{ session.title }}</strong></span>
            <span class="session-tail"><small>{{ session.updatedAt }}</small><StatusPill :label="session.status" tone="success" /></span>
          </button>
        </div>
      </article>
    </div>

    <section class="activity-ledger">
      <div><span class="evidence-id">今日采集摘要</span><strong>23 个事件形成了 2 次修复尝试，其中 1 次已验证有效。</strong></div>
      <div class="ledger-items"><span><b>8</b> 日志</span><span><b>6</b> 命令</span><span><b>5</b> Git</span><span><b>3</b> 文件</span><span><b>1</b> 测试</span></div>
    </section>
  </section>
</template>

<style scoped>
.welcome span { font-size: .78em; }
.today { display: flex; align-items: center; gap: 8px; padding-top: 6px; color: var(--ink-500); font-size: 12px; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(360px, .9fr); gap: 16px; margin-top: 16px; }
.head-group { display: flex; align-items: center; gap: 10px; }
.active-case h3 { margin: 8px 0 20px; font-size: 24px; letter-spacing: -.025em; }
.case-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px 24px; margin: 0 0 24px; }
.case-meta div { display: grid; grid-template-columns: 72px 1fr; }
.case-meta dt { color: var(--ink-500); }
.case-meta dd { margin: 0; color: var(--ink-700); font-weight: 650; }
.progress-row { display: flex; justify-content: space-between; margin-bottom: 9px; color: var(--ink-700); font-size: 12px; }
.case-actions { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 22px; }
.case-actions > span { display: flex; align-items: center; gap: 8px; color: var(--ink-500); font-size: 12px; }
.case-actions i { width: 8px; height: 8px; border-radius: 50%; background: #1bb978; box-shadow: 0 0 0 4px #e2f7ed; }
.session-list { display: grid; }
.session-list button { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 72px; padding: 12px 18px; border: 0; border-bottom: 1px solid var(--line); background: transparent; text-align: left; cursor: pointer; }
.session-list button:last-child { border-bottom: 0; }
.session-list button:hover { background: #f7faff; }
.session-main { min-width: 0; }
.session-main b, .session-main strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.session-main b { margin-bottom: 5px; color: var(--ink-500); font: 11px var(--mono); }
.session-main strong { color: var(--ink-700); font-size: 13px; }
.session-tail { display: flex; align-items: center; gap: 10px; }
.session-tail small { color: var(--ink-500); white-space: nowrap; }
.activity-ledger { display: flex; align-items: center; justify-content: space-between; gap: 30px; margin-top: 16px; padding: 20px 22px; border: 1px solid var(--line); border-left: 4px solid var(--blue-600); background: white; }
.activity-ledger > div:first-child strong { display: block; margin-top: 7px; color: var(--ink-700); }
.ledger-items { display: flex; gap: 18px; color: var(--ink-500); font-size: 12px; }
.ledger-items b { color: var(--ink-900); font: 700 17px var(--mono); }
@media (max-width: 1050px) { .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 700px) { .case-meta { grid-template-columns: 1fr; }.activity-ledger { align-items: flex-start; flex-direction: column; }.ledger-items { flex-wrap: wrap; } }
</style>

