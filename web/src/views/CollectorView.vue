<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppIcon from '../components/AppIcon.vue'
import StatusPill from '../components/StatusPill.vue'
import { collectorEvents } from '../mocks/data'

const running = ref(true)
const settings = reactive({ git: true, files: true, logs: true, tests: true })

function saveSettings() {
  ElMessage.success('采集配置已保存（mock）')
}
</script>

<template>
  <section class="page">
    <header class="page-header"><div><div class="heading-line"><h1>采集器管理</h1><StatusPill :label="running ? '8/8 运行中' : '已暂停'" :tone="running ? 'success' : 'warning'" /></div><p>采集器先在本地脱敏与缓冲，再将事件幂等上传。暂停采集不会删除本地缓冲。</p></div></header>
    <div class="collector-grid">
      <article class="panel collector-status"><div class="panel-head"><h2>采集器状态</h2></div><div class="panel-body status-body"><div class="computer"><AppIcon name="monitor" :size="42" /></div><div><h3>本地采集器</h3><dl><div><dt>运行时长</dt><dd>2 天 4 小时 32 分钟</dd></div><div><dt>最后更新</dt><dd>2025-04-27 10:32:15</dd></div><div><dt>版本</dt><dd>v1.0.0</dd></div></dl></div></div></article>
      <article class="panel project-config"><div class="panel-head"><h2>项目配置</h2><span class="evidence-id">SpringBoot-Project</span></div><div class="panel-body"><div class="project-path"><span>项目路径</span><code>/Users/dev/projects/demo</code></div><el-checkbox v-model="settings.git">Git 提交（提交记录、代码差异）</el-checkbox><el-checkbox v-model="settings.files">文件变更（新增、修改、删除）</el-checkbox><el-checkbox v-model="settings.logs">异常日志（中间件、输出、超时信息）</el-checkbox><el-checkbox v-model="settings.tests">测试结果（测试日志、执行耗时）</el-checkbox><div class="config-actions"><el-button :type="running ? 'warning' : 'success'" plain @click="running = !running">{{ running ? '暂停采集' : '恢复采集' }}</el-button><el-button type="primary" @click="saveSettings">保存配置</el-button></div></div></article>
    </div>
    <article class="panel events-panel"><div class="panel-head"><h2>最近采集事件</h2><span class="subtle">mock 数据，每 5 秒刷新</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>时间</th><th>类型</th><th>内容</th><th>来源</th><th>状态</th></tr></thead><tbody><tr v-for="event in collectorEvents" :key="`${event.time}-${event.type}`"><td class="mono">{{ event.time }}</td><td><StatusPill :label="event.type" :tone="event.type === '异常' ? 'danger' : event.type === '测试' ? 'success' : 'primary'" /></td><td>{{ event.content }}</td><td class="mono">{{ event.source }}</td><td><StatusPill :label="event.status" :tone="event.status === '已缓冲' ? 'warning' : 'success'" /></td></tr></tbody></table></div></article>
    <div class="privacy-note"><AppIcon name="review" :size="18" /><div><strong>脱敏在上传前完成</strong><p>默认排除 .env、密钥和证书文件；令牌、口令与邮箱按规则替换。无法确认的数据停止上传并留在本地。</p></div></div>
  </section>
</template>

<style scoped>
.heading-line { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }.heading-line h1 { margin: 0; }.collector-grid { display: grid; grid-template-columns: minmax(0,.85fr) minmax(0,1.15fr); gap: 16px; }.status-body { display: flex; gap: 20px; align-items: flex-start; }.computer { display: grid; place-items: center; flex: 0 0 74px; height: 74px; border-radius: 10px; background: #eaf2ff; color: var(--blue-600); }.collector-status h3 { margin: 2px 0 14px; }.collector-status dl { display: grid; gap: 8px; margin: 0; }.collector-status dl div { display: grid; grid-template-columns: 74px 1fr; }.collector-status dt { color: var(--ink-500); }.collector-status dd { margin: 0; }.project-config .panel-body { display: grid; }.project-path { display: flex; gap: 14px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }.project-path span { color: var(--ink-500); }.project-path code { overflow-wrap: anywhere; }.project-config .el-checkbox { margin: 0 0 10px; }.config-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }.events-panel { margin-top: 16px; }.privacy-note { display: flex; gap: 12px; margin-top: 16px; padding: 16px 18px; border: 1px solid #e6d5ad; border-left: 4px solid var(--amber-600); background: #fffaf0; }.privacy-note strong { display: block; }.privacy-note p { margin: 5px 0 0; color: var(--ink-500); line-height: 1.55; }
@media (max-width: 880px) { .collector-grid { grid-template-columns: 1fr; } }
</style>

