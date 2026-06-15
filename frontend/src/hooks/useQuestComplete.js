import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get_quest_detail, complete_quest, save_retrospective } from '../api/questApi'

const unwrap = (res) => res.data?.data ?? res.data

export function useQuestComplete() {
  const { id } = useParams()

  const [quest, setQuest] = useState(null)
  const [questLoading, setQuestLoading] = useState(true)
  const [feeling, setFeeling] = useState(null)
  const [difficulty, setDifficulty] = useState(0)
  const [reflection, setReflection] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completionResult, setCompletionResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    get_quest_detail(id)
      .then(res => {
        if (!mounted) return
        const nextQuest = unwrap(res)
        setQuest(nextQuest)
        setFeeling(nextQuest?.feeling ?? null)
        setDifficulty(nextQuest?.difficultyRating ?? 0)
        setReflection(nextQuest?.reflection ?? '')
        setNextStep(nextQuest?.nextStep ?? '')
      })
      .catch(err => {
        if (mounted) setError(err.response?.data?.message ?? '퀘스트를 불러오지 못했습니다.')
      })
      .finally(() => { if (mounted) setQuestLoading(false) })
    return () => { mounted = false }
  }, [id])

  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      if (quest?.status !== 'COMPLETED') {
        await complete_quest(id)
      }
      await save_retrospective(id, {
        feeling: feeling ?? null,
        difficultyRating: difficulty > 0 ? difficulty : null,
        reflection: reflection.trim() || null,
        nextStep: nextStep.trim() || null,
      })
      setCompletionResult('retrospective')
    } catch (err) {
      setError(err.response?.data?.message ?? '회고를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCompleteWithoutRetrospective() {
    setError('')
    setSubmitting(true)
    try {
      if (quest?.status !== 'COMPLETED') {
        await complete_quest(id)
      }
      setCompletionResult('quest-only')
    } catch (err) {
      setError(err.response?.data?.message ?? '퀘스트를 완료하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    id,
    quest,
    questLoading,
    feeling,
    setFeeling,
    difficulty,
    setDifficulty,
    reflection,
    setReflection,
    nextStep,
    setNextStep,
    submitting,
    completionResult,
    setCompletionResult,
    error,
    handleSubmit,
    handleCompleteWithoutRetrospective,
  }
}
