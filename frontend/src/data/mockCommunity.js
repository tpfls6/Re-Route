export const MOCK_COMMUNITY_POSTS = [
  {
    id: 1,
    category: '경험 나눔',
    title: '발표 불안을 극복한 저의 작은 성공 이야기',
    preview: '작년까지만 해도 발표만 생각하면 며칠 전부터 잠을 못 잘 정도였어요...',
    content: `작년까지만 해도 발표만 생각하면 며칠 전부터 잠을 못 잘 정도였어요.

Re-Route를 시작한지 한 달이 됐는데, 어제 처음으로 팀원들 앞에서 5분짜리 발표를 했어요. 완벽하지 않았지만, 끝까지 해냈다는 것 자체가 저한테는 엄청난 일이에요.

처음엔 '발표 자료 제목 한 줄 쓰기' 퀘스트부터 시작했는데, 그게 이렇게 연결될 줄은 몰랐어요. 작은 걸음이 쌓이는 게 느껴졌어요.

비슷한 고민을 가진 분들, 포기하지 마세요!`,
    author: '조용한참새',
    authorType: '완벽주의형',
    createdAt: '2026-05-13',
    likes: 24,
    comments: [
      { id: 1, author: '초록숲사슴', authorType: '회피형', content: '정말 대단해요! 저도 비슷한 상황인데 용기가 생겼어요.', createdAt: '2026-05-13', likes: 3 },
      { id: 2, author: '밤하늘별', authorType: '관계불안형', content: '제목 한 줄부터 시작하는 거 저도 했는데 신기하게 도움이 되더라고요!', createdAt: '2026-05-13', likes: 2 },
    ],
    tags: ['발표불안', '성장', '소셜불안'],
  },
  {
    id: 2,
    category: '도움 요청',
    title: '거절을 너무 못 해서 힘들어요',
    preview: '부탁을 거절하는 게 너무 어려워서 항상 제 것을 희생하게 되는데...',
    content: `부탁을 거절하는 게 너무 어려워서 항상 제 것을 희생하게 되는데, 같은 경험 있으신 분 계세요?

회사에서도 집에서도 항상 "어, 내가 할게"가 돼버리는 상황이에요. AI 상담을 통해 이게 관계불안형 패턴이라는 걸 알게 됐는데, 어떻게 연습하셨나요?`,
    author: '흰구름여행자',
    authorType: '관계불안형',
    createdAt: '2026-05-12',
    likes: 31,
    comments: [
      { id: 1, author: '산들바람', authorType: '관계불안형', content: '저도 같은 유형이에요. "지금은 좀 어렵다"는 말부터 연습해보는 게 퀘스트로 나왔었는데 도움됐어요.', createdAt: '2026-05-12', likes: 8 },
    ],
    tags: ['관계불안', '거절', '경계설정'],
  },
  {
    id: 3,
    category: '일상 공유',
    title: '오늘 편의점 퀘스트 완료했어요',
    preview: '처음엔 말도 안 된다고 생각했는데 직접 해보니까 진짜 뿌듯하더라고요...',
    content: `처음엔 말도 안 된다고 생각했는데 직접 해보니까 진짜 뿌듯하더라고요.

집 앞 편의점에서 계산할 때 카드 꺼내기 전에 "영수증은 괜찮아요"라고 먼저 말하는 퀘스트였는데, 별거 아닌 것 같아도 이게 저한테는 정말 큰 한 걸음이었어요.

다들 오늘도 작은 퀘스트 완료하셨나요?`,
    author: '새벽별빛',
    authorType: '회피형',
    createdAt: '2026-05-11',
    likes: 18,
    comments: [],
    tags: ['회피형', '퀘스트완료', '일상'],
  },
  {
    id: 4,
    category: '질문',
    title: 'AI 상담 처음에 어떤 주제로 시작하셨어요?',
    preview: '오늘 처음 Re-Route를 시작했는데 뭘 말해야 할지 몰라서요...',
    content: `오늘 처음 Re-Route를 시작했는데 뭘 말해야 할지 몰라서요.

막상 AI 앞에 앉으니까 뭐부터 말해야 할지 모르겠더라고요. 다들 처음에 어떻게 시작하셨나요?`,
    author: '처음오는비',
    authorType: '무기력형',
    createdAt: '2026-05-10',
    likes: 12,
    comments: [
      { id: 1, author: '조용한참새', authorType: '완벽주의형', content: '저는 "오늘 가장 힘든 게 뭐야?"라고 AI가 물어봤는데 그냥 솔직하게 말했어요.', createdAt: '2026-05-10', likes: 5 },
      { id: 2, author: '산들바람', authorType: '관계불안형', content: '지금 기분이 어때요? 라는 질문부터 시작했어요. 간단한 것부터요!', createdAt: '2026-05-11', likes: 3 },
    ],
    tags: ['처음사용', '질문'],
  },
]

export const CATEGORY_COLORS = {
  '경험 나눔': { bg: 'var(--sage-50)', color: 'var(--sage-700)', border: 'var(--sage-100)' },
  '도움 요청': { bg: '#fff0dc', color: 'var(--amber-500)', border: '#ffe0b0' },
  '일상 공유': { bg: '#ffe8dc', color: 'var(--terra-500)', border: '#ffd0b8' },
  '질문': { bg: '#e8e8f8', color: '#5a5a9a', border: '#d0d0f0' },
}
