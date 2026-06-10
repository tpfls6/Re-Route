import { useState, useCallback } from 'react'
import { post_email_verification, post_verify_email_code } from '../api/authApi'

const unwrap = (res) => res.data?.data ?? res.data

export function useEmailVerification(purpose) {
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [issuedCode, setIssuedCode] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const requestCode = useCallback(async (email) => {
    setLoading(true)
    setError('')
    setMessage('')
    setVerified(false)
    try {
      const res = await post_email_verification(email, purpose)
      const data = unwrap(res)
      setIssuedCode(data?.code ?? '')
      setExpiresAt(data?.expiresAt ?? '')
      setMessage('인증코드를 발급했습니다.')
      return data
    } catch (err) {
      const nextError = err.response?.data?.message ?? '인증코드 발급에 실패했습니다.'
      setError(nextError)
      throw err
    } finally {
      setLoading(false)
    }
  }, [purpose])

  const verifyCode = useCallback(async (email, code) => {
    setVerifying(true)
    setError('')
    setMessage('')
    try {
      await post_verify_email_code(email, code, purpose)
      setVerified(true)
      setMessage('이메일 인증이 완료되었습니다.')
      return true
    } catch (err) {
      const nextError = err.response?.data?.message ?? '인증코드 확인에 실패했습니다.'
      setVerified(false)
      setError(nextError)
      throw err
    } finally {
      setVerifying(false)
    }
  }, [purpose])

  const resetVerification = useCallback(() => {
    setIssuedCode('')
    setExpiresAt('')
    setVerified(false)
    setMessage('')
    setError('')
  }, [])

  return {
    loading,
    verifying,
    issuedCode,
    expiresAt,
    verified,
    message,
    error,
    requestCode,
    verifyCode,
    resetVerification,
  }
}
