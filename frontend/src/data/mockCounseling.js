export const MOCK_SESSIONS = [
  { id: 1, title: '발표 불안 상담', createdAt: '2026-05-07', messageCount: 12 },
  { id: 2, title: '직장 내 대인관계', createdAt: '2026-05-05', messageCount: 8 },
  { id: 3, title: '면접 준비 상담', createdAt: '2026-05-03', messageCount: 15 },
]

export const MOCK_MESSAGES = [
  { id: 1, role: 'ai', content: '안녕하세요. 오늘은 어떤 일이 있으셨나요?', createdAt: '2026-05-07T10:00:00' },
  { id: 2, role: 'user', content: '다음 주 발표가 있는데 자료를 못 만들겠어요. 손도 못 대겠어서요.', createdAt: '2026-05-07T10:01:00' },
  { id: 3, role: 'ai', content: '시작이 어렵게 느껴지시는군요. 이 감정에 가까운 단어를 찾아볼까요? \'회피\', \'압박감\', \'완벽에 대한 두려움\' 중 어떤 게 가장 가까울까요?', createdAt: '2026-05-07T10:01:30' },
  { id: 4, role: 'user', content: '완벽에 대한 두려움이 큰 것 같아요. 잘 못할 것 같아서요.', createdAt: '2026-05-07T10:02:00' },
  { id: 5, role: 'ai', content: '잘 알려주셨어요. 한 가지 제안을 해볼게요. 지금 발표 자료의 \'제목 한 줄\'만 적어보는 건 어떨까요? 1분이면 충분합니다.', createdAt: '2026-05-07T10:02:30' },
]

export const MOCK_ANALYSIS = {
  emotions: [
    { label: '불안', value: 72, color: 'var(--terra-500)' },
    { label: '완벽주의', value: 68, color: 'var(--amber-500)' },
    { label: '회피 경향', value: 54, color: 'var(--sage-500)' },
  ],
  structure: {
    event: '다음 주 발표 준비',
    emotion: '압박감, 회피',
    cause: '완벽주의 + 평가 두려움',
    action: '제목 한 줄만 작성하기 · 1분',
  },
}
