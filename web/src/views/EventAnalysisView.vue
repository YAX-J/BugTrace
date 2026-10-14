<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import StatusPill from '../components/StatusPill.vue'
import { traceEvents } from '../mocks/data'

const filter = ref('全部')
const events = ref(traceEvents.map((event) => ({ ...event })))
const filteredEvents = computed(() => filter.value === '全部' ? events.value.filter((event) => event.related) : events.value.filter((event) => event.related && event.type === filter.value))
const excludedEvents = computed(() => events.value.filter((event) => !event.related))
const typeCounts = computed(() => ['日志', '命令', 'Git', '文件', '测试'].map((label, index) => ({ label, value: [8, 6, 5, 3, 1][index], color: ['#246bfd', '#38a0b8', '#53ad8a', '#f07855', '#8b69d4'][index] })))

function restore(id: string) {
  const event = events.value.find((item) => item.id === id)
  if (event) event.related = true
  ElMessage.success('事件已恢复到当前会话')
}
</script>

<template>
  <section class="page">
    <header class="page-header"><div><div class="heading-line"><h1>事件关联分析</h1><span class="evidence-id">#BS-20250427-001</span><StatusPill label="已关联" tone="success" /></div><p>规则根据时间、错误指纹、文件和测试关系标记事件，最终范围仍由用户确认。</p></div></header>
    <div class="analysis-metrics"><div><span>关联事件</span><b>23</b></div><div><span>时间跨度</span><b>10:21–10:34</b></div><div><span>平均关联度</span><b>92%</b></div></div>
    <div class="analysis-grid">
      <article class="panel distribution"><div class="panel-head"><h2>事件来源分布</h2></div><div class="panel-body distribution-body"><div class="donut"><span><b>23</b><small>关联事件</small></span></div><div class="legend"><div v-for="item in typeCounts" :key="item.label"><i :style="{ background: item.color }"></i><span>{{ item.label }}</span><b>{{ item.value }}</b><small>{{ Math.round(item.value / 23 * 100) }}%</small></div></div></div></article>
      <article class="panel scores"><div class="panel-head"><h2>关联规则评分</h2></div><div class="score-list"><div v-for="item in [{name:'时间相似',value:95},{name:'错误相似',value:88},{name:'文件关联',value:83},{name:'命令关联',value:76},{name:'测试关联',value:69}]" :key="item.name"><span>{{ item.name }}</span><i><em :style="{ width: `${item.value}%` }"></em></i><b>{{ (item.value / 100).toFixed(2) }}</b></div></div></article>
    </div>
    <div class="event-grid">
      <article class="panel">
        <div class="filter-row"><button v-for="type in ['全部','异常','命令','Git','文件','测试']" :key="type" :class="{ active: filter === type }" @click="filter = type">{{ type }}</button></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>时间</th><th>类型</th><th>内容摘要</th><th>来源</th><th>关联度</th><th></th></tr></thead><tbody><tr v-for="event in filteredEvents" :key="event.id"><td class="mono">{{ event.time }}</td><td><StatusPill :label="event.type" :tone="event.tone" /></td><td>{{ event.summary }}</td><td>{{ event.source }}</td><td class="confidence">{{ event.relevance.toFixed(2) }}</td><td><button class="section-link">查看</button></td></tr></tbody></table></div>
      </article>
      <aside class="panel excluded"><div class="panel-head"><h2>未归属事件</h2><StatusPill :label="`${excludedEvents.length} 条待处理`" tone="danger" /></div><div v-if="excludedEvents.length" class="excluded-list"><article v-for="event in excludedEvents" :key="event.id"><div><span class="mono">{{ event.time }}</span><StatusPill :label="event.type" tone="neutral" /></div><strong>{{ event.title }}</strong><p>{{ event.summary }}</p><el-button size="small" @click="restore(event.id)">加入会话</el-button></article></div><div v-else class="empty-note">未归属事件已处理完成</div></aside>
    </div>
  </section>
</template>

<style scoped>
.heading-line { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }.heading-line h1 { margin: 0; }
.analysis-metrics { display: grid; grid-template-columns: repeat(3, 1fr); margin-bottom: 16px; border: 1px solid var(--line); background: white; }.analysis-metrics div { padding: 17px 20px; border-right: 1px solid var(--line); }.analysis-metrics div:last-child { border: 0; }.analysis-metrics span, .analysis-metrics b { display: block; }.analysis-metrics span { color: var(--ink-500); font-size: 12px; }.analysis-metrics b { margin-top: 6px; font: 740 20px var(--mono); }
.analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }.distribution-body { display: flex; align-items: center; justify-content: space-around; gap: 30px; }.donut { display: grid; place-items: center; width: 154px; height: 154px; border-radius: 50%; background: conic-gradient(#246bfd 0 34%, #38a0b8 34% 60%, #53ad8a 60% 82%, #f07855 82% 95%, #8b69d4 95% 100%); }.donut::before { content: ""; grid-area: 1/1; width: 94px; height: 94px; border-radius: 50%; background: white; }.donut span { z-index: 1; grid-area: 1/1; text-align: center; }.donut b, .donut small { display: block; }.donut b { font: 750 25px var(--mono); }.donut small { color: var(--ink-500); }
.legend { display: grid; min-width: 200px; gap: 11px; }.legend div { display: grid; grid-template-columns: 8px 1fr 24px 35px; gap: 9px; align-items: center; font-size: 12px; }.legend i { width: 8px; height: 8px; border-radius: 50%; }.legend b { font: 700 12px var(--mono); }.legend small { color: var(--ink-500); }
.score-list { display: grid; gap: 17px; padding: 24px 20px; }.score-list div { display: grid; grid-template-columns: 70px 1fr 36px; gap: 13px; align-items: center; font-size: 12px; }.score-list i { height: 7px; background: #e8edf3; }.score-list em { display: block; height: 100%; background: var(--blue-600); }.score-list b { font: 700 11px var(--mono); }
.event-grid { display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 16px; margin-top: 16px; }.filter-row { display: flex; flex-wrap: wrap; gap: 5px; padding: 13px 16px; border-bottom: 1px solid var(--line); }.filter-row button { padding: 6px 14px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--ink-500); cursor: pointer; }.filter-row button.active { border-color: var(--blue-600); background: var(--blue-600); color: white; }.confidence { color: var(--green-600) !important; font: 700 12px var(--mono); }
.excluded-list { display: grid; }.excluded-list article { padding: 16px 18px; border-bottom: 1px solid var(--line); }.excluded-list article:last-child { border: 0; }.excluded-list article > div { display: flex; align-items: center; justify-content: space-between; }.excluded-list strong { display: block; margin-top: 10px; font-size: 13px; }.excluded-list p { color: var(--ink-500); font-size: 12px; }.excluded-list .el-button { width: 100%; }
@media (max-width: 1050px) { .event-grid { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .analysis-grid { grid-template-columns: 1fr; }.analysis-metrics { grid-template-columns: 1fr; }.analysis-metrics div { border-right: 0; border-bottom: 1px solid var(--line); }.distribution-body { align-items: flex-start; flex-direction: column; } }
</style>

