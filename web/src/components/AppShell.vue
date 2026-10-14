<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AppIcon from './AppIcon.vue'

const mobileOpen = ref(false)
const project = ref('SpringBoot-Project')

const navigation = [
  { label: '工作台', to: '/', icon: 'home' },
  { label: 'Bug 排查', to: '/sessions/BS-20250427-001', icon: 'bug' },
  { label: '事件关联', to: '/events', icon: 'link' },
  { label: '修复尝试', to: '/attempts', icon: 'wrench' },
  { label: '经验知识库', to: '/knowledge', icon: 'book' },
  { label: '采集器管理', to: '/collectors', icon: 'monitor' },
]
</script>

<template>
  <div class="shell">
    <div v-if="mobileOpen" class="nav-backdrop" @click="mobileOpen = false" />
    <aside class="sidebar" :class="{ 'is-open': mobileOpen }">
      <div class="brand"><span class="brand-mark">B</span><span>BugTrace</span></div>
      <nav class="sidebar-nav" aria-label="主要导航">
        <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" @click="mobileOpen = false">
          <AppIcon :name="item.icon" :size="17" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-foot">
        <RouterLink to="/collectors"><AppIcon name="settings" :size="17" /><span>系统设置</span></RouterLink>
        <div class="collector-indicator"><span></span><div><strong>采集器在线</strong><small>最近同步 8 秒前</small></div></div>
      </div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <button class="mobile-menu" aria-label="打开导航" @click="mobileOpen = true"><AppIcon name="menu" /></button>
        <div class="quick-search"><AppIcon name="search" :size="16" /><span>搜索会话、经验、错误指纹…</span><kbd>Ctrl K</kbd></div>
        <div class="topbar-actions">
          <el-select v-model="project" class="project-select" aria-label="当前项目">
            <el-option label="SpringBoot-Project" value="SpringBoot-Project" />
            <el-option label="Web-Project" value="Web-Project" />
          </el-select>
          <button class="icon-button" aria-label="通知"><AppIcon name="bell" :size="18" /><i></i></button>
          <div class="user"><span class="avatar">开</span><span>开发者 1</span><AppIcon name="chevron" :size="14" /></div>
        </div>
      </header>
      <main class="content"><RouterView /></main>
    </section>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; background: var(--canvas); }
.sidebar { position: fixed; z-index: 30; inset: 0 auto 0 0; display: flex; flex-direction: column; width: 212px; padding: 20px 14px; background: linear-gradient(180deg, var(--navy-900), var(--navy-950)); color: #d7e5f3; }
.brand { display: flex; align-items: center; gap: 10px; padding: 0 8px 24px; color: white; font-size: 17px; font-weight: 760; letter-spacing: -.02em; }
.brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid rgba(255,255,255,.34); border-radius: 8px; background: #246bfd; box-shadow: inset 0 0 0 3px rgba(255,255,255,.1); }
.sidebar-nav { display: grid; gap: 4px; }
.sidebar-nav a, .sidebar-foot > a { display: flex; align-items: center; gap: 11px; min-height: 42px; padding: 0 12px; border-radius: 7px; color: #b9cbdd; font-size: 13px; font-weight: 650; }
.sidebar-nav a:hover, .sidebar-foot > a:hover { background: rgba(255,255,255,.07); color: white; }
.sidebar-nav a.router-link-active { background: #155bc0; color: white; box-shadow: inset 3px 0 0 #6ea6ff; }
.sidebar-foot { display: grid; gap: 16px; margin-top: auto; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.1); }
.collector-indicator { display: flex; align-items: center; gap: 9px; padding: 9px 10px; }
.collector-indicator > span { width: 8px; height: 8px; border-radius: 50%; background: #35d79b; box-shadow: 0 0 0 4px rgba(53,215,155,.12); }
.collector-indicator strong, .collector-indicator small { display: block; }
.collector-indicator strong { color: #eaf4fd; font-size: 12px; }
.collector-indicator small { margin-top: 3px; color: #829bb1; font-size: 10px; }
.workspace { min-height: 100vh; margin-left: 212px; }
.topbar { position: sticky; z-index: 20; top: 0; display: flex; align-items: center; justify-content: space-between; gap: 24px; height: 66px; padding: 0 28px; border-bottom: 1px solid var(--line); background: rgba(255,255,255,.94); backdrop-filter: blur(14px); }
.quick-search { display: flex; align-items: center; gap: 9px; min-width: 280px; color: var(--ink-500); font-size: 12px; }
.quick-search kbd { margin-left: 8px; padding: 3px 6px; border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 5px; background: #f8fafc; font: 10px var(--mono); }
.topbar-actions { display: flex; align-items: center; gap: 14px; }
.project-select { width: 188px; }
.icon-button, .mobile-menu { position: relative; display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid var(--line); border-radius: 8px; background: white; color: var(--ink-700); cursor: pointer; }
.icon-button i { position: absolute; top: 7px; right: 7px; width: 6px; height: 6px; border: 1px solid white; border-radius: 50%; background: var(--red-600); }
.user { display: flex; align-items: center; gap: 8px; color: var(--ink-700); font-size: 12px; font-weight: 650; }
.avatar { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #172c42; color: white; }
.content { padding: 28px; }
.mobile-menu, .nav-backdrop { display: none; }
@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); transition: transform .2s ease; }
  .sidebar.is-open { transform: translateX(0); }
  .nav-backdrop { position: fixed; z-index: 25; inset: 0; display: block; background: rgba(5,18,30,.48); }
  .workspace { margin-left: 0; }
  .mobile-menu { display: grid; }
  .quick-search { display: none; }
  .topbar { padding-inline: 18px; }
}
@media (max-width: 600px) {
  .content { padding: 18px 14px; }
  .project-select, .user > span:not(.avatar), .user svg { display: none; }
}
</style>

