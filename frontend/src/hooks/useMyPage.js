import { useCallback, useState } from 'react'
import { delete_my_account, get_my_page, patch_my_page } from '../api/userApi'
import { useAuth } from './useAuth'

const unwrap = (res) => res.data?.data ?? res.data

export function useMyPage() {
  const { updateUser, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const fetchMyPage = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await get_my_page()
      const nextProfile = unwrap(res)
      setProfile(nextProfile)
      updateUser(nextProfile)
      return nextProfile
    } catch (err) {
      setError(err.response?.data?.message ?? '마이페이지 정보를 불러오지 못했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  const updateMyPage = useCallback(async (payload) => {
    setSaving(true)
    setError('')
    try {
      const res = await patch_my_page(payload)
      const nextProfile = unwrap(res)
      setProfile(nextProfile)
      updateUser(nextProfile)
      return nextProfile
    } catch (err) {
      setError(err.response?.data?.message ?? '프로필 수정에 실패했습니다.')
      throw err
    } finally {
      setSaving(false)
    }
  }, [updateUser])

  const deleteMyAccount = useCallback(async () => {
    setDeleting(true)
    setError('')
    try {
      await delete_my_account()
      await logout()
    } catch (err) {
      setError(err.response?.data?.message ?? '회원 탈퇴에 실패했습니다.')
      throw err
    } finally {
      setDeleting(false)
    }
  }, [logout])

  return {
    profile,
    loading,
    saving,
    deleting,
    error,
    fetchMyPage,
    updateMyPage,
    deleteMyAccount,
  }
}
