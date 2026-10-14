<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppIcon from '../components/AppIcon.vue'
import StatusPill from '../components/StatusPill.vue'
import { activeSession, traceEvents } from '../mocks/data'
import type { TraceEvent } from '../types'

const events = reactive(traceEvents.map((event) => ({ ...event })))
const activeTab = ref('trace')
const selectedId = ref('EVT-0030')
const dialogVisible = ref(false)
const outcome = ref<'已解决' | '已放弃'>('已解决')
const rootCause = ref('')
const sessionStatus = ref(activeSession.status)

const selectedEvent = computed(() => events.find((event) => event.id === selectedId.value) ?? events[0])
const relatedEvents = computed(() => events.filter((event) => event.related))

function toneForType(event: TraceEvent) {
  return event.tone
}

function finishSession() {
  sessionStatus.value = outcome.value
  dialogVisible.value = false
  ElMessage.success(`${outcome.value}，已生成待确认方案草稿`)
}

function toggleRelated() {
  selectedEvent.value.related = !selectedEvent.value.related
}
</script>

<template>
  <section class="page session-page">
    <header class="page-header session-heading">
      <div><div class="heading-line"><span class="evidence-id">#{{ activeSession.id }}</span><StatusPill :label="sessionStatus" :tone="sessionStatus === '进行中' ? 'success' : 'neutral'" /></div><h1>{{ activeSession.title }}</h1><p>Spring Boot 启动时数据库连接失败，主错误指纹为 <code>Connection refused</code>。</p></div>
      <div class="page-actions"><el-button @click="outcome = '已放弃'; dialogVisible = true">放弃排查</el-button><el-button type="primary" @click="outcome = '已解决'; dialogVisible = true">结束排查</el-button></div>
    </header>

    <div class="session-meta">
      <span><AppIcon name="session" :size="15" />项目 <b>{{ activeSession.project }}</b></span>
      <span><AppIcon name="clock" :size="15" />发起时间 <b>{{ activeSession.startedAt }}</b></span>
      <span><AppIcon name="link" :size="15" />关联事件 <b>{{ relatedEvents.length }}</b></span>
      <span><AppIcon name="review" :size="15" />复现概率 <b>92%</b></span>
    </div>

    <el-tabs v-model="activeTab" class="session-tabs">
      <el-tab-pane label="排查轨迹" name="trace">
        <div class="trace-layout">
          <article class="panel timeline-panel">
            <div class="timeline">
              <button v-for="(event, index) in events" :key="event.id" :class="['timeline-item', { selected: event.id === selectedId, excluded: !event.related }]" @click="selectedId = event.id">
                <span class="timeline-index" :class="`tone-${toneForType(event)}`">{{ index + 1 }}</span>
                <span class="timeline-copy"><span class="timeline-title"><b>{{ event.title }}</b><small>{{ event.time }}</small></span><span class="timeline-summary">{{ event.summary }}</span><span class="timeline-source"><code>{{ event.id }}</code><em>{{ event.source }}</em></span></span>
                <StatusPill v-if="event.tone === 'danger'" label="失败" tone="danger" />
                <StatusPill v-else-if="event.tone === 'success'" label="已验证" tone="success" />
              </button>
            </div>
          </article>

          <aside class="side-stack">
            <article class="panel evidence-panel">
              <div class="panel-head"><h2>证据详情</h2><span class="evidence-id">{{ selectedEvent.id }}</span></div>
              <div class="panel-body">
                <StatusPill :label="selectedEvent.type" :tone="selectedEvent.tone" />
                <h3>{{ selectedEvent.title }}</h3>
                <dl><div><dt>来源</dt><dd>{{ selectedEvent.source }}</dd></div><div><dt>关联度</dt><dd>{{ Math.round(selectedEvent.relevance * 100) }}%</dd></div><div><dt>文件</dt><dd>{{ selectedEvent.file ?? '—' }}</dd></div></dl>
                <pre>{{ selectedEvent.code }}</pre>
                <el-button :type="selectedEvent.related ? 'danger' : 'primary'" plain class="wide-button" @click="toggleRelated">{{ selectedEvent.related ? '移出会话' : '恢复到会话' }}</el-button>
              </div>
            </article>
            <article class="panel source-panel"><div class="panel-head"><h2>事件来源占比</h2></div><div class="source-bars"><div><span>日志</span><i style="--width: 80%"></i><b>8</b></div><div><span>命令</span><i style="--width: 55%"></i><b>6</b></div><div><span>代码</span><i style="--width: 38%"></i><b>3</b></div><div><span>测试</span><i style="--width: 22%"></i><b>1</b></div></div></article>
          </aside>
        </div>
      </el-tab-pane>
      <el-tab-pane label="错误日志" name="logs"><div class="panel log-view"><pre>2025-04-27 10:21:03 ERROR Connection to localhost:5432 refused.\nCaused by: java.net.ConnectException: Connection refused</pre></div></el-tab-pane>
      <el-tab-pane label="关联事件" name="events"><div class="panel empty-note">共 {{ relatedEvents.length }} 条事件被规则标记为相关，可在排查轨迹中人工调整。</div></el-tab-pane>
      <el-tab-pane label="修复方案" name="solution"><div class="panel draft-solution"><StatusPill label="Agent 草稿" tone="warning" /><h2>修改数据库主机地址并验证连接</h2><p>当前结论引用 EVT-0021、EVT-0030 和 EVT-0033。根因尚待用户确认，方案不会自动入库。</p></div></el-tab-pane>
      <el-tab-pane label="相关文件" name="files"><div class="panel empty-note"><code>application.yml</code>、<code>TEST-HealthCheck.xml</code>、<code>application.log</code></div></el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible" :title="outcome === '已解决' ? '结束这次排查' : '放弃这次排查'" width="min(520px, 92vw)">
      <p class="dialog-copy">系统将基于保留的 {{ relatedEvents.length }} 条证据生成方案草稿。草稿需要人工检查并确认后才会进入知识库。</p>
      <label class="field-label" for="root-cause">根因（可选，标记为用户陈述）</label>
      <el-input id="root-cause" v-model="rootCause" type="textarea" :rows="4" placeholder="例如：容器内 localhost 指向当前容器，无法访问宿主机数据库。" />
      <template #footer><el-button @click="dialogVisible = false">继续排查</el-button><el-button type="primary" @click="finishSession">{{ outcome }}并生成草稿</el-button></template>
    </el-dialog>
  </section>
</template>

<style scoped>
.heading-line { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.session-heading h1 { margin-top: 0; }
.session-meta { display: flex; flex-wrap: wrap; gap: 10px 28px; margin: -8px 0 18px; padding: 13px 17px; border: 1px solid var(--line); border-radius: 8px; background: white; }
.session-meta span { display: flex; align-items: center; gap: 7px; color: var(--ink-500); font-size: 12px; }
.session-meta b { color: var(--ink-700); }
.session-tabs :deep(.el-tabs__header) { margin-bottom: 14px; }
.trace-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 16px; align-items: start; }
.timeline-panel { padding: 8px 0; }
.timeline { position: relative; }
.timeline::before { content: ""; position: absolute; top: 28px; bottom: 28px; left: 37px; width: 1px; background: #ced9e6; }
.timeline-item { position: relative; display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 14px; align-items: start; width: 100%; padding: 15px 18px; border: 0; background: transparent; text-align: left; cursor: pointer; }
.timeline-item:hover, .timeline-item.selected { background: #f4f8ff; }
.timeline-item.excluded { opacity: .42; }
.timeline-index { z-index: 1; display: grid; place-items: center; width: 28px; height: 28px; border: 4px solid white; border-radius: 50%; background: #5f7690; color: white; font: 700 11px var(--mono); box-shadow: 0 0 0 1px #5f7690; }
.tone-danger { background: var(--red-600); box-shadow: 0 0 0 1px var(--red-600); }.tone-success { background: var(--green-600); box-shadow: 0 0 0 1px var(--green-600); }.tone-primary { background: var(--blue-600); box-shadow: 0 0 0 1px var(--blue-600); }
.timeline-title { display: flex; align-items: baseline; gap: 12px; }.timeline-title b { color: var(--ink-900); }.timeline-title small { color: var(--ink-500); font: 11px var(--mono); }
.timeline-summary { display: block; margin-top: 5px; color: var(--ink-700); font: 12px/1.5 var(--mono); }
.timeline-source { display: flex; gap: 10px; margin-top: 7px; color: var(--ink-500); font-size: 11px; }.timeline-source em { font-style: normal; }
.side-stack { display: grid; gap: 16px; position: sticky; top: 84px; }
.evidence-panel h3 { margin: 13px 0; font-size: 18px; }.evidence-panel dl { display: grid; gap: 8px; margin: 0; }.evidence-panel dl div { display: grid; grid-template-columns: 66px 1fr; }.evidence-panel dt { color: var(--ink-500); }.evidence-panel dd { margin: 0; color: var(--ink-700); font-weight: 600; overflow-wrap: anywhere; }
.evidence-panel pre, .log-view pre { overflow: auto; margin: 16px 0; padding: 14px; border-left: 3px solid var(--red-600); background: #152434; color: #d8e6f3; font: 11px/1.7 var(--mono); white-space: pre-wrap; }
.wide-button { width: 100%; }.source-bars { display: grid; gap: 13px; padding: 16px 18px; }.source-bars div { display: grid; grid-template-columns: 44px 1fr 18px; gap: 9px; align-items: center; font-size: 11px; }.source-bars i { height: 6px; background: linear-gradient(90deg, var(--blue-600) var(--width), #e8edf3 var(--width)); }.source-bars b { font: 700 12px var(--mono); }
.log-view { padding: 12px; }.draft-solution { padding: 24px; }.draft-solution h2 { margin: 14px 0 8px; }.draft-solution p, .dialog-copy { color: var(--ink-500); line-height: 1.65; }.field-label { display: block; margin: 18px 0 8px; font-weight: 700; }
@media (max-width: 1050px) { .trace-layout { grid-template-columns: 1fr; }.side-stack { position: static; grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 700px) { .side-stack { grid-template-columns: 1fr; }.timeline-item { grid-template-columns: 38px 1fr; padding-inline: 12px; }.timeline-item > .status-pill { grid-column: 2; }.timeline::before { left: 29px; } }
</style>

