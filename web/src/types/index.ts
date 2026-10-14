export type Tone = 'primary' | 'success' | 'danger' | 'warning' | 'neutral'

export interface Metric {
  label: string
  value: number | string
  note: string
  tone: Tone
  icon: string
}

export interface SessionSummary {
  id: string
  title: string
  project: string
  startedAt: string
  status: '进行中' | '已解决' | '已放弃'
  eventCount: number
  progress: number
  updatedAt: string
}

export interface TraceEvent {
  id: string
  time: string
  type: '异常' | '命令' | '文件' | 'Git' | '测试' | '记录'
  title: string
  summary: string
  source: string
  file?: string
  relevance: number
  related: boolean
  tone: Tone
  code?: string
}

export interface Attempt {
  id: string
  description: string
  file: string
  result: '有效' | '无效' | '待验证'
  evidence: string
  time: string
  diff: { removed: string; added: string }
}

export interface KnowledgeItem {
  id: string
  title: string
  description: string
  tags: string[]
  confidence: number
  source: '完整轨迹' | '仅提交证据'
  status: '已验证' | '未验证'
  project: string
  updatedAt: string
}

export interface CollectorEvent {
  time: string
  type: TraceEvent['type']
  content: string
  source: string
  status: '成功' | '已脱敏' | '已缓冲'
}

