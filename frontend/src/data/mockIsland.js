export const MOCK_ISLAND = {
  questsCompleted: 28,
  totalQuests: 40,
  trees: ['t-a', 't-b', 't-c', 't-d'],
  flowers: ['f1', 'f2', 'f3'],
}

export const MOCK_SCENARIOS = [
  { id: 1, icon: 'bi-mic-fill', name: '발표 리허설', desc: '청중 앞에서 발표하는 상황 연습', diffClass: 'ql2', diffLabel: '중급' },
  { id: 2, icon: 'bi-briefcase', name: '면접 리허설', desc: '면접관과 1:1 대화 시뮬레이션', diffClass: 'ql3', diffLabel: '고급' },
  { id: 3, icon: 'bi-hand-thumbs-up', name: '사과 연습', desc: '상대방에게 진심 어린 사과하기', diffClass: 'ql2', diffLabel: '중급' },
  { id: 4, icon: 'bi-x-circle', name: '거절 연습', desc: '상대의 부탁을 정중하게 거절하기', diffClass: 'ql1', diffLabel: '입문' },
  { id: 5, icon: 'bi-chat-dots', name: '첫인사 연습', desc: '낯선 사람에게 먼저 말 걸기', diffClass: 'ql1', diffLabel: '입문' },
  { id: 6, icon: 'bi-telephone', name: '전화 통화 연습', desc: '어색한 전화 상황 대처 연습', diffClass: 'ql2', diffLabel: '중급' },
]

export const MOCK_CAMPFIRES = [
  { id: 1, name: '완벽주의 탈출 모임', desc: '잘해야만 시작하는 분들의 이야기', members: 5, keyword: '완벽주의 · 발표 불안' },
  { id: 2, name: '사회불안 극복 캠프', desc: '사람 많은 공간이 두려운 분들', members: 8, keyword: '사회불안 · 대인관계' },
  { id: 3, name: '작은 용기 한 걸음', desc: '무기력에서 벗어나는 여정', members: 4, keyword: '무기력 · 회피' },
  { id: 4, name: '직장인 멘탈 케어', desc: '직장 스트레스와 번아웃 이야기', members: 11, keyword: '번아웃 · 직장 스트레스' },
]
