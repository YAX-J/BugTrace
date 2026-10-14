import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: '工作台' } },
    { path: '/sessions/:id?', name: 'session', component: () => import('../views/SessionDetailView.vue'), meta: { title: 'Bug 排查' } },
    { path: '/events', name: 'events', component: () => import('../views/EventAnalysisView.vue'), meta: { title: '事件关联' } },
    { path: '/attempts', name: 'attempts', component: () => import('../views/AttemptsView.vue'), meta: { title: '修复尝试' } },
    { path: '/knowledge', name: 'knowledge', component: () => import('../views/KnowledgeView.vue'), meta: { title: '经验知识库' } },
    { path: '/collectors', name: 'collectors', component: () => import('../views/CollectorView.vue'), meta: { title: '采集器管理' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title)} · BugTrace`
})

export default router

