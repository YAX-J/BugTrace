import type { Attempt, CollectorEvent, KnowledgeItem, Metric, SessionSummary, TraceEvent } from '../types'

export const dashboardMetrics: Metric[] = [
  { label: '当前会话', value: 1, note: '正在排查', tone: 'primary', icon: 'session' },
  { label: '历史会话', value: 12, note: '已完成', tone: 'success', icon: 'archive' },
  { label: '待确认方案', value: 3, note: '需要人工确认', tone: 'warning', icon: 'review' },
  { label: '经验知识', value: 16, note: '可复用方案', tone: 'neutral', icon: 'book' },
]

export const activeSession: SessionSummary = {
  id: 'BS-20250427-001',
  title: '数据库连接异常',
  project: 'SpringBoot-Project',
  startedAt: '2025-04-27 10:21',
  status: '进行中',
  eventCount: 23,
  progress: 76,
  updatedAt: '刚刚',
}

export const recentSessions: SessionSummary[] = [
  activeSession,
  { id: 'BS-20250430-003', title: '数据库慢查询', project: 'SpringBoot-Project', startedAt: '2025-04-30 09:10', status: '已解决', eventCount: 18, progress: 100, updatedAt: '2 小时前' },
  { id: 'BS-20250406-002', title: 'Redis 连接超时', project: 'SpringBoot-Project', startedAt: '2025-04-06 14:33', status: '已解决', eventCount: 14, progress: 100, updatedAt: '5 小时前' },
  { id: 'BS-20250403-001', title: 'Maven 依赖冲突', project: 'Web-Project', startedAt: '2025-04-03 17:42', status: '已解决', eventCount: 9, progress: 100, updatedAt: '1 天前' },
  { id: 'BS-20250304-004', title: '文件权限异常', project: 'SpringBoot-Project', startedAt: '2025-03-04 11:26', status: '已解决', eventCount: 7, progress: 100, updatedAt: '1 天前' },
]

export const traceEvents: TraceEvent[] = [
  { id: 'EVT-0018', time: '10:21:03', type: '异常', title: '数据库连接失败', summary: 'Connection refused', source: 'application.log', file: 'application.log', relevance: 0.95, related: true, tone: 'danger', code: 'org.postgresql.util.PSQLException:\nConnection to localhost:5432 refused.' },
  { id: 'EVT-0021', time: '10:23:17', type: '文件', title: '修改数据库连接 URL', summary: 'application.yml +2 / -2', source: '文件快照', file: 'application.yml', relevance: 0.86, related: true, tone: 'primary', code: 'spring.datasource.url=jdbc:mysql://localhost:3306/dev' },
  { id: 'EVT-0024', time: '10:26:34', type: '测试', title: '排查尝试 1：连接仍失败', summary: 'mvn test · exit 1', source: 'Surefire XML', file: 'TEST-HealthCheck.xml', relevance: 0.81, related: true, tone: 'danger', code: 'Tests run: 1, Failures: 1\nConnection timed out' },
  { id: 'EVT-0027', time: '10:28:08', type: '命令', title: '检查数据库服务端口', summary: 'netstat -ano | findstr 3306', source: 'terminal', relevance: 0.78, related: true, tone: 'neutral', code: 'TCP  192.168.1.100:3306  LISTENING' },
  { id: 'EVT-0030', time: '10:31:52', type: '测试', title: '排查尝试 2：相关测试通过', summary: 'mvn test · exit 0', source: 'Surefire XML', file: 'TEST-HealthCheck.xml', relevance: 0.92, related: true, tone: 'success', code: 'Tests run: 1, Failures: 0\nBUILD SUCCESS' },
  { id: 'EVT-0031', time: '10:33:20', type: 'Git', title: '提交修复代码', summary: 'fix datasource host configuration', source: 'Git CLI', relevance: 0.78, related: true, tone: 'success', code: '4f92c8a fix: use reachable database host' },
  { id: 'EVT-0033', time: '10:34:20', type: '命令', title: '健康检查返回正常', summary: 'GET /api/health · 200', source: 'terminal', relevance: 0.88, related: true, tone: 'success', code: '{ "status": "UP" }' },
  { id: 'EVT-0034', time: '10:35:06', type: '命令', title: '查看工作区状态', summary: 'git status --short', source: 'terminal', relevance: 0.22, related: false, tone: 'neutral', code: 'M application.yml' },
]

export const attempts: Attempt[] = [
  { id: 'Attempt-01', description: '修改数据库 URL', file: 'application.yml', result: '无效', evidence: '连接仍然失败', time: '10:23', diff: { removed: 'spring.datasource.url=jdbc:mysql://localhost:3306/dev', added: 'spring.datasource.url=jdbc:mysql://127.0.0.1:3306/dev' } },
  { id: 'Attempt-02', description: '调整连接池参数', file: 'application.yml', result: '无效', evidence: '连接超时', time: '10:26', diff: { removed: 'connection-timeout: 30000', added: 'connection-timeout: 60000' } },
  { id: 'Attempt-03', description: '修改数据库地址并重启', file: 'application.yml', result: '有效', evidence: '测试通过', time: '10:31', diff: { removed: 'spring.datasource.url=jdbc:mysql://localhost:3306/dev', added: 'spring.datasource.url=jdbc:mysql://192.168.1.100:3306/dev' } },
]

export const knowledgeItems: KnowledgeItem[] = [
  { id: 'KB-0016', title: '数据库连接失败（Connection refused）', description: '检查数据库监听地址、容器网络及连接 URL；修改后通过健康检查验证。', tags: ['高频问题', 'SpringBoot', '数据库'], confidence: 94, source: '完整轨迹', status: '已验证', project: 'SpringBoot-Project', updatedAt: '2025-04-15' },
  { id: 'KB-0012', title: 'Redis 连接超时', description: '检查 Redis 服务状态、网络策略与连接池配置，确认超时发生阶段。', tags: ['Redis', '超时', '高频问题'], confidence: 81, source: '完整轨迹', status: '已验证', project: 'SpringBoot-Project', updatedAt: '2025-04-10' },
  { id: 'KB-0009', title: 'Maven 依赖冲突', description: '使用 dependency:tree 定位传递依赖，并在父 POM 统一版本。', tags: ['Maven', '依赖', '构建'], confidence: 66, source: '仅提交证据', status: '未验证', project: 'Web-Project', updatedAt: '2025-04-08' },
  { id: 'KB-0006', title: '接口返回 500 错误', description: '从请求 ID 关联异常日志和对应提交，优先确认空值与参数校验。', tags: ['接口', '日志'], confidence: 72, source: '完整轨迹', status: '已验证', project: 'Gateway-Project', updatedAt: '2025-04-02' },
]

export const collectorEvents: CollectorEvent[] = [
  { time: '10:32:15', type: '异常', content: 'Connection refused', source: 'application.log', status: '已脱敏' },
  { time: '10:32:10', type: '命令', content: 'mvn test', source: 'terminal', status: '成功' },
  { time: '10:31:52', type: '文件', content: '修改 application.yml', source: 'file', status: '成功' },
  { time: '10:31:20', type: 'Git', content: '提交代码', source: 'git', status: '成功' },
  { time: '10:30:48', type: '记录', content: '网络短暂不可用，事件写入本地缓冲', source: 'collector', status: '已缓冲' },
]

