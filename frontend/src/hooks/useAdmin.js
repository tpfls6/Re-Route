import { useState, useEffect, useCallback } from 'react'
import {
  get_admin_users,
  delete_admin_user,
  get_admin_posts,
  delete_admin_post,
  get_admin_campfires,
  delete_admin_campfire,
} from '../api/adminApi'

const unwrap = (res) => res.data?.data ?? res.data

export function useAdmin() {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [campfires, setCampfires] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await get_admin_users()
      setUsers(unwrap(res))
    } catch {
      setError('사용자 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadPosts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await get_admin_posts()
      setPosts(unwrap(res))
    } catch {
      setError('게시글 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCampfires = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await get_admin_campfires()
      setCampfires(unwrap(res))
    } catch {
      setError('캠프파이어 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'users') loadUsers()
    else if (tab === 'posts') loadPosts()
    else loadCampfires()
  }, [tab, loadUsers, loadPosts, loadCampfires])

  async function handleDeleteCampfire(campfire, { confirm }) {
    const ok = await confirm({
      icon: 'bi-fire',
      title: '캠프파이어 삭제',
      message: `"${campfire.name}" 캠프파이어를 삭제하시겠습니까?\n채팅 메시지와 멤버 데이터가 모두 삭제됩니다.`,
      confirmLabel: '삭제',
      danger: true,
    })
    if (!ok) return
    try {
      await delete_admin_campfire(campfire.id)
      setCampfires(prev => prev.filter(c => c.id !== campfire.id))
    } catch (err) {
      setError(err.response?.data?.message ?? '캠프파이어 삭제에 실패했습니다.')
    }
  }

  async function handleDeleteUser(user, { confirm }) {
    const ok = await confirm({
      icon: 'bi-person-x-fill',
      title: '계정 삭제',
      message: `"${user.nickname}" (${user.email}) 계정을 삭제하시겠습니까?\n해당 사용자의 모든 데이터가 삭제됩니다.`,
      confirmLabel: '삭제',
      danger: true,
    })
    if (!ok) return
    try {
      await delete_admin_user(user.id)
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (err) {
      setError(err.response?.data?.message ?? '사용자 삭제에 실패했습니다.')
    }
  }

  async function handleDeletePost(post, { confirm }) {
    const ok = await confirm({
      icon: 'bi-file-x-fill',
      title: '게시글 삭제',
      message: `"${post.title}" 게시글을 삭제하시겠습니까?`,
      confirmLabel: '삭제',
      danger: true,
    })
    if (!ok) return
    try {
      await delete_admin_post(post.id)
      setPosts(prev => prev.filter(p => p.id !== post.id))
    } catch (err) {
      setError(err.response?.data?.message ?? '게시글 삭제에 실패했습니다.')
    }
  }

  return {
    tab,
    setTab,
    users,
    setUsers,
    posts,
    setPosts,
    campfires,
    setCampfires,
    loading,
    error,
    handleDeleteCampfire,
    handleDeleteUser,
    handleDeletePost,
  }
}
