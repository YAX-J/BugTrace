<script setup lang="ts">
import { computed, ref } from 'vue'
import StatusPill from '../components/StatusPill.vue'
import { attempts } from '../mocks/data'
import type { Tone } from '../types'

const selectedId = ref('Attempt-03')
const selected = computed(() => attempts.find((attempt) => attempt.id === selectedId.value) ?? attempts[0])
const tone = (result: string): Tone => result === '有效' ? 'success' : result === '无效' ? 'danger' : 'warning'
</script>

<template>
  <section class="page">
    <header class="page-header"><div><div class="heading-line"><h1>修复尝试管理</h1><span class="evidence-id">#BS-20250427-001</span></div><p>两次验证之间的文件变化合并为一次尝试，结果由规则根据主指纹和测试状态判定。</p></div><div class="page-actions"><el-button type="primary">新增尝试</el-button></div></header>
    <article class="panel attempts-table"><div class="table-wrap"><table class="data-table"><thead><tr><th>尝试编号</th><th>操作描述</th><th>修改文件</th><th>结果</th><th>验证信息</th><th>时间</th></tr></thead><tbody><tr v-for="attempt in attempts" :key="attempt.id" :class="{ 'is-selected': selectedId === attempt.id }" @click="selectedId = attempt.id"><td class="mono">{{ attempt.id }}</td><td>{{ attempt.description }}</td><td class="mono">{{ attempt.file }}</td><td><StatusPill :label="attempt.result" :tone="tone(attempt.result)" /></td><td>{{ attempt.evidence }}</td><td class="mono">{{ attempt.time }}</td></tr></tbody></table></div></article>
    <div class="attempt-detail-grid">
      <article class="panel"><div class="panel-head"><div><span class="evidence-id">{{ selected.id }}</span><h2>{{ selected.description }}</h2></div><StatusPill :label="selected.result" :tone="tone(selected.result)" /></div><div class="panel-body"><dl class="detail-meta"><div><dt>修改文件</dt><dd class="mono">{{ selected.file }}</dd></div><div><dt>验证依据</dt><dd>{{ selected.evidence }}</dd></div></dl><div class="diff"><div class="removed">− {{ selected.diff.removed }}</div><div class="added">+ {{ selected.diff.added }}</div></div></div></article>
      <article class="panel validation"><div class="panel-head"><h2>验证结果</h2></div><div class="validation-body"><div class="check" :class="tone(selected.result)">✓</div><h3>{{ selected.result === '有效' ? '测试通过' : '验证未通过' }}</h3><p>{{ selected.evidence }}</p><dl><div><dt>触发器</dt><dd>/up/health 接口检查</dd></div><div><dt>验证时间</dt><dd>2025-04-27 {{ selected.time }}</dd></div></dl></div></article>
    </div>
  </section>
</template>

<style scoped>
.heading-line { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }.heading-line h1 { margin: 0; }.attempts-table { margin-bottom: 16px; }.attempt-detail-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(300px, .6fr); gap: 16px; }.panel-head > div h2 { margin: 6px 0 0; font-size: 17px; }.detail-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0 0 20px; }.detail-meta div { display: grid; grid-template-columns: 84px 1fr; }.detail-meta dt { color: var(--ink-500); }.detail-meta dd { margin: 0; }.diff { overflow: hidden; border: 1px solid var(--line); border-radius: 7px; font: 11px/1.7 var(--mono); }.diff div { padding: 9px 13px; overflow-wrap: anywhere; }.removed { color: #b83e2c; background: #fff0ed; }.added { color: #087b4e; background: #e8f8f1; }.validation-body { padding: 26px; }.check { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; color: white; font-size: 23px; font-weight: 700; }.check.success { background: var(--green-600); }.check.danger { background: var(--red-600); }.check.warning { background: var(--amber-600); }.validation h3 { margin: 13px 0 4px; }.validation p { color: var(--ink-500); }.validation dl { display: grid; gap: 9px; margin-top: 20px; }.validation dl div { display: grid; grid-template-columns: 72px 1fr; }.validation dt { color: var(--ink-500); }.validation dd { margin: 0; }
@media (max-width: 860px) { .attempt-detail-grid { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .detail-meta { grid-template-columns: 1fr; } }
</style>

