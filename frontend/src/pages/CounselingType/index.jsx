import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'

const TYPES = [
  {
    id: 'free',
    icon: 'bi-chat-heart-fill',
    label: '자유 대화',
    desc: 'AI와 지금 느끼는 감정과 고민을 자연스럽게 이야기해요.',
    tag: '추천',
    tagColor: 'var(--sage-700)',
    tagBg: 'var(--sage-50)',
    detail: ['감정을 있는 그대로 표현할 수 있어요', '정해진 주제 없이 자유롭게 시작해요', '대화 속에서 AI가 자연스럽게 구조화해줘요'],
  },
  {
    id: 'structure',
    icon: 'bi-diagram-3-fill',
    label: '감정 구조화',
    desc: '사건-감정-원인-대응 4단계로 현재 상황을 체계적으로 정리해요.',
    tag: '심층 분석',
    tagColor: 'var(--amber-500)',
    tagBg: '#fff0dc',
    detail: ['사건과 감정을 명확하게 구분해요', '감정의 근본 원인을 파악해요', '실행 가능한 대응 방법을 함께 찾아요'],
  },
  {
    id: 'action',
    icon: 'bi-lightning-charge-fill',
    label: '행동 계획 수립',
    desc: '오늘 당장 실행할 수 있는 마이크로 퀘스트 중심으로 상담해요.',
    tag: '실천형',
    tagColor: 'var(--terra-500)',
    tagBg: '#ffe8dc',
    detail: ['구체적인 행동 목표를 설정해요', '달성 가능한 작은 단계로 나눠요', '퀘스트로 연결돼 꾸준히 실천할 수 있어요'],
  },
  {
    id: 'rehearsal',
    icon: 'bi-joystick',
    label: '리허설 준비',
    desc: '다가올 발표, 면접, 대화 상황을 미리 연습하고 준비해요.',
    tag: 'VR 연동',
    tagColor: '#5a5a9a',
    tagBg: '#e8e8f8',
    detail: ['실제 상황을 가상으로 시뮬레이션해요', 'AI 피드백으로 대응 방식을 개선해요', 'VR 리허설 세션과 연동돼요'],
  },
]

export default function CounselingType() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <AppLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        <i className="bi bi-arrow-left" /> 이전으로
      </button>

      <div style={{ marginBottom: 36 }}>
        <h1 className="page-title">어떤 상담을 시작할까요?</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          상담 방식을 선택해주세요. 언제든 바꿀 수 있어요.
        </p>
      </div>

      <div className="type-select-grid">
        {TYPES.map(t => (
          <button
            key={t.id}
            className={`type-select-card${selected === t.id ? ' selected' : ''}`}
            onClick={() => setSelected(t.id)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: selected === t.id ? 'var(--sage-100)' : 'var(--bg-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: selected === t.id ? 'var(--sage-700)' : 'var(--ink-300)',
                transition: 'all 0.2s',
              }}>
                <i className={`bi ${t.icon}`} />
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 100,
                fontSize: 11, fontWeight: 700,
                background: t.tagBg, color: t.tagColor,
              }}>
                {t.tag}
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink-900)', marginBottom: 8, textAlign: 'left' }}>
              {t.label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 16, textAlign: 'left' }}>
              {t.desc}
            </div>
            <ul style={{ listStyle: 'none', textAlign: 'left' }}>
              {t.detail.map((d, i) => (
                <li key={i} style={{
                  fontSize: 12, color: 'var(--ink-700)',
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                  padding: '3px 0',
                }}>
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--sage-300)', marginTop: 2, flexShrink: 0 }} />
                  {d}
                </li>
              ))}
            </ul>
            {selected === t.id && (
              <div style={{
                position: 'absolute', top: 14, left: 14,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--sage-500)',
              }} />
            )}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <button
          className="btn btn-primary btn-lg"
          disabled={!selected}
          onClick={() => navigate('/counseling')}
          style={{ flex: 1 }}
        >
          <i className="bi bi-robot" /> 상담 시작하기
        </button>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/counseling')} style={{ flex: 1 }}>
          건너뛰고 바로 시작
        </button>
      </div>
    </AppLayout>
  )
}
