export const MOCK_USER = {
  id: 1,
  nickname: '민준',
  email: 'minjun@example.com',
  resilienceType: '완벽주의형',
  resilienceTypeCode: 'E',
  joinedAt: '2026-04-01',
  questsCompleted: 28,
  totalQuests: 40,
  streak: 7,
  confidenceScore: 64,
  avoidanceIndex: 42,
}

export const RESILIENCE_TYPES = {
  A: { label: '회피형', strategy: '단계적 노출', color: 'var(--terra-500)', bg: '#ffe8dc' },
  B: { label: '과몰입형', strategy: '리프레이밍', color: 'var(--amber-500)', bg: '#f4e5d0' },
  C: { label: '무기력형', strategy: '1분 과제', color: 'var(--sage-700)', bg: 'var(--sage-50)' },
  D: { label: '관계불안형', strategy: '대화 훈련', color: '#5a6b85', bg: '#e5e8f0' },
  E: { label: '완벽주의형', strategy: '실패 연습', color: '#8e5a8e', bg: '#f0e5f0' },
}
