import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { post_onboarding } from '../api/userApi'
import { useAuth } from './useAuth'

export const QUESTIONS = [
  '해야 할 일이 생기면 자꾸 미루게 되는 편인가요?',
  '한 가지 걱정이 머릿속에서 계속 맴돌 때가 많나요?',
  '뭔가 시작하는 것 자체가 특히 힘들게 느껴지나요?',
  '상대방의 반응이나 답장이 많이 신경 쓰이나요?',
  '실수할까봐 행동을 주저할 때가 많나요?',
  '불편한 감정이나 상황을 피하려는 경향이 있나요?',
  '특정 관계나 목표에 지나치게 집착하게 되는 편인가요?',
  '에너지나 의욕이 없어서 일상이 잘 안 돌아갈 때가 있나요?',
  '거절당하거나 무시당할까봐 두려울 때가 있나요?',
  '완벽하게 못 할 것 같아서 시작을 못 하는 경우가 있나요?',
]

export const SCALE_LABELS = ['전혀 아니다', '아니다', '보통', '그렇다', '매우 그렇다']

export const RECOVERY_TYPE_INFO = {
  AVOIDANT: { label: '회피형', desc: '감정이나 문제를 마주하기보다 미루거나 피하는 경향이 있어요.', strategy: '단계적 노출', color: 'var(--terra-500)', bg: '#ffe8dc' },
  OVERFOCUSED: { label: '과몰입형', desc: '특정 고민, 관계, 목표에 지나치게 몰두하고 끊어내기 어려운 경향이 있어요.', strategy: '리프레이밍', color: 'var(--amber-500)', bg: '#f4e5d0' },
  LETHARGIC: { label: '무기력형', desc: '에너지와 동기가 낮아 시작 자체가 어려운 경향이 있어요.', strategy: '1분 과제', color: 'var(--sage-700)', bg: 'var(--sage-50)' },
  RELATION_ANXIOUS: { label: '관계불안형', desc: '타인의 반응, 거절, 거리감, 인정 욕구에 민감한 경향이 있어요.', strategy: '대화 훈련', color: '#5a6b85', bg: '#e5e8f0' },
  PERFECTIONIST: { label: '완벽주의형', desc: '높은 기준과 실패에 대한 두려움 때문에 실행이 막히는 경향이 있어요.', strategy: '실패 연습', color: '#8e5a8e', bg: '#f0e5f0' },
}

export function useOnboarding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { updateUser } = useAuth()
  const isRetake = searchParams.get('retake') === 'true'

  const [step, setStep] = useState(isRetake ? 2 : 1)
  const [answers, setAnswers] = useState(Array(10).fill(null))
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const answeredCount = answers.filter(a => a !== null).length
  const allAnswered = answeredCount === 10

  function setAnswer(index, value) {
    setAnswers(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  async function onSubmit() {
    if (!allAnswered) return
    setSubmitting(true)
    setError('')
    try {
      const res = await post_onboarding(answers)
      const data = res.data?.data ?? res.data
      setResult(data.primaryRecoveryType)
      updateUser({
        primaryRecoveryType: data.primaryRecoveryType,
        primaryRecoveryTypeName: data.primaryRecoveryTypeName,
        onboardingCompleted: true,
      })
      setStep(3)
    } catch {
      setError('잠시 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    navigate,
    isRetake,
    step,
    setStep,
    answers,
    setAnswer,
    result,
    submitting,
    error,
    answeredCount,
    allAnswered,
    onSubmit,
  }
}
