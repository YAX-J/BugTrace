<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import StatusPill from '../components/StatusPill.vue'
import { knowledgeItems } from '../mocks/data'

const query = ref('')
const category = ref('全部')
const selectedId = ref(knowledgeItems[0].id)
const categories = ['全部', '数据库', 'Redis', 'Maven', '网络', '其他']
const results = computed(() => knowledgeItems.filter((item) => {
  const matchesQuery = `${item.title}${item.description}${item.tags.join('')}`.toLowerCase().includes(query.value.toLowerCase())
  const matchesCategory = category.value === '全部' || item.tags.includes(category.value)
  return matchesQuery && matchesCategory
}))
const selected = computed(() => knowledgeItems.find((item) => item.id === selectedId.value) ?? results.value[0])
</script>

<template>
  <section class="page">
    <header class="page-header"><div><h1>经验知识库 <small>共 {{ knowledgeItems.length }} 条经验</small></h1><p>优先显示经过完整轨迹验证的方案；仅提交证据的内容会降低排序权重并明确标记。</p></div><div class="page-actions"><el-button type="primary">新增经验</el-button></div></header>
    <div class="knowledge-tools">
      <el-input v-model="query" size="large" placeholder="搜索错误信息、关键词、解决方案…" clearable><template #prefix><AppIcon name="search" :size="17" /></template></el-input>
      <div class="category-tabs"><button v-for="item in categories" :key="item" :class="{ active: category === item }" @click="category = item">{{ item }}</button></div>
    </div>
    <div class="knowledge-layout">
      <div class="knowledge-list">
        <article v-for="item in results" :key="item.id" :class="['knowledge-item', { selected: selected?.id === item.id }]" @click="selectedId = item.id">
          <div class="knowledge-title"><h2>{{ item.title }}</h2><strong>{{ item.confidence }}%</strong></div>
          <p>{{ item.description }}</p>
          <div class="knowledge-tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span><StatusPill :label="item.status" :tone="item.status === '已验证' ? 'success' : 'warning'" /><StatusPill :label="item.source" :tone="item.source === '完整轨迹' ? 'primary' : 'neutral'" /></div>
          <footer><span>关联项目：{{ item.project }}</span><span>更新于 {{ item.updatedAt }}</span></footer>
        </article>
        <div v-if="!results.length" class="panel empty-note">没有匹配的经验。可以换一个关键词，或清除分类筛选。</div>
      </div>
      <aside class="panel knowledge-aside" v-if="selected">
        <div class="panel-head"><h2>方案摘要</h2><span class="evidence-id">{{ selected.id }}</span></div>
        <div class="panel-body"><StatusPill :label="selected.source" :tone="selected.source === '完整轨迹' ? 'primary' : 'neutral'" /><h3>{{ selected.title }}</h3><p>{{ selected.description }}</p><div class="confidence-ring" :style="{ '--score': `${selected.confidence * 3.6}deg` }"><span><b>{{ selected.confidence }}</b><small>可信度</small></span></div><dl><div><dt>验证状态</dt><dd>{{ selected.status }}</dd></div><div><dt>失败尝试</dt><dd>{{ selected.id === 'KB-0016' ? 2 : 1 }} 次</dd></div><div><dt>证据来源</dt><dd>{{ selected.source }}</dd></div></dl><el-button type="primary" plain class="full">查看完整方案</el-button></div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.page-header h1 small { color: var(--ink-500); font-size: 12px; font-weight: 500; letter-spacing: 0; }.knowledge-tools { margin-bottom: 16px; }.knowledge-tools > .el-input { max-width: 520px; }.category-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }.category-tabs button { padding: 7px 17px; border: 1px solid var(--line); border-radius: 6px; background: white; color: var(--ink-500); cursor: pointer; }.category-tabs button.active { border-color: var(--blue-600); background: var(--blue-600); color: white; }.knowledge-layout { display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 16px; align-items: start; }.knowledge-list { display: grid; gap: 10px; }.knowledge-item { padding: 18px 20px; border: 1px solid var(--line); border-radius: 8px; background: white; cursor: pointer; }.knowledge-item:hover, .knowledge-item.selected { border-color: #9bb8e7; box-shadow: inset 3px 0 0 var(--blue-600); }.knowledge-title { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }.knowledge-title h2 { margin: 0; font-size: 16px; }.knowledge-title strong { color: var(--red-600); font: 750 16px var(--mono); }.knowledge-item p { margin: 9px 0 13px; color: var(--ink-500); line-height: 1.6; }.knowledge-tags { display: flex; flex-wrap: wrap; gap: 7px; }.knowledge-tags > span:not(.status-pill) { padding: 4px 8px; border-radius: 4px; background: #edf4ff; color: #3d6cab; font-size: 11px; }.knowledge-item footer { display: flex; justify-content: space-between; gap: 16px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); color: var(--ink-500); font-size: 11px; }.knowledge-aside { position: sticky; top: 84px; }.knowledge-aside h3 { margin: 14px 0 7px; }.knowledge-aside p { color: var(--ink-500); line-height: 1.65; }.confidence-ring { display: grid; place-items: center; width: 120px; height: 120px; margin: 22px auto; border-radius: 50%; background: conic-gradient(var(--green-600) var(--score), #e7edf3 0); }.confidence-ring::before { content: ""; grid-area: 1/1; width: 82px; height: 82px; border-radius: 50%; background: white; }.confidence-ring span { z-index: 1; grid-area: 1/1; text-align: center; }.confidence-ring b, .confidence-ring small { display: block; }.confidence-ring b { font: 750 26px var(--mono); }.confidence-ring small { color: var(--ink-500); }.knowledge-aside dl { display: grid; gap: 10px; margin: 0 0 20px; }.knowledge-aside dl div { display: flex; justify-content: space-between; }.knowledge-aside dt { color: var(--ink-500); }.knowledge-aside dd { margin: 0; font-weight: 650; }.full { width: 100%; }
@media (max-width: 960px) { .knowledge-layout { grid-template-columns: 1fr; }.knowledge-aside { position: static; } }
</style>

