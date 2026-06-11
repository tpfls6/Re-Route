import { useState, useEffect, useCallback } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { useModal } from '../../components/common/Modal'
import {
  get_admin_users,
  delete_admin_user,
  get_admin_posts,
  delete_admin_post,
  get_admin_post_comments,
  delete_admin_comment,
} from '../../api/adminApi'

const unwrap = (res) => res.data?.data ?? res.data

export default function Admin() {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { confirm, ModalElement } = useModal()

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

  useEffect(() => {
    if (tab === 'users') loadUsers()
    else loadPosts()
  }, [tab, loadUsers, loadPosts])

  async function handleDeleteUser(user) {
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

  async function handleDeletePost(post) {
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

  return (
    <AppLayout>
      {ModalElement}
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">관리자 패널</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          사용자 및 커뮤니티 콘텐츠를 관리합니다.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          onClick={() => setTab('users')}
        >
          <i className="bi bi-people" style={{ marginRight: 4 }} />
          사용자 관리
          {users.length > 0 && (
            <span style={{
              marginLeft: 6, background: 'var(--sage-100)', color: 'var(--sage-700)',
              borderRadius: 10, padding: '0 6px', fontSize: 11
            }}>
              {users.length}
            </span>
          )}
        </button>
        <button
          className={`btn ${tab === 'posts' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          onClick={() => setTab('posts')}
        >
          <i className="bi bi-file-text" style={{ marginRight: 4 }} />
          커뮤니티 관리
          {posts.length > 0 && (
            <span style={{
              marginLeft: 6, background: 'var(--sage-100)', color: 'var(--sage-700)',
              borderRadius: 10, padding: '0 6px', fontSize: 11
            }}>
              {posts.length}
            </span>
          )}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--coral-50)', borderRadius: 10, fontSize: 13, color: 'var(--coral-600)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-400)' }}>
          <span className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }} />
        </div>
      ) : tab === 'users' ? (
        <UserTable users={users} onDelete={handleDeleteUser} />
      ) : (
        <PostTable posts={posts} onDeletePost={handleDeletePost} confirm={confirm} onPostsChange={setPosts} />
      )}
    </AppLayout>
  )
}

function UserTable({ users, onDelete }) {
  if (users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-400)', fontSize: 14 }}>
        등록된 사용자가 없습니다.
      </div>
    )
  }

  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: 'var(--sage-50)', borderBottom: '1px solid var(--sage-100)' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>이메일</th>
            <th style={thStyle}>닉네임</th>
            <th style={thStyle}>권한</th>
            <th style={thStyle}>가입일</th>
            <th style={{ ...thStyle, width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid var(--sage-50)' }}>
              <td style={tdStyle}>{user.id}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.nickname}</td>
              <td style={tdStyle}>
                <span style={{
                  padding: '2px 8px', borderRadius: 8, fontSize: 12,
                  background: user.role === 'ADMIN' ? 'var(--coral-50)' : 'var(--sage-50)',
                  color: user.role === 'ADMIN' ? 'var(--coral-600)' : 'var(--sage-600)',
                }}>
                  {user.role === 'ADMIN' ? '관리자' : '일반'}
                </span>
              </td>
              <td style={tdStyle}>{user.createdAt}</td>
              <td style={tdStyle}>
                {user.role !== 'ADMIN' && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 8px', color: 'var(--coral-500)', fontSize: 13 }}
                    onClick={() => onDelete(user)}
                    title="삭제"
                  >
                    <i className="bi bi-trash3" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PostTable({ posts, onDeletePost, confirm, onPostsChange }) {
  const [expandedPostId, setExpandedPostId] = useState(null)
  const [commentsByPost, setCommentsByPost] = useState({})
  const [loadingComments, setLoadingComments] = useState(null)
  const [commentError, setCommentError] = useState('')

  async function toggleComments(postId) {
    if (expandedPostId === postId) {
      setExpandedPostId(null)
      return
    }
    setExpandedPostId(postId)
    if (commentsByPost[postId]) return
    setLoadingComments(postId)
    setCommentError('')
    try {
      const res = await get_admin_post_comments(postId)
      setCommentsByPost(prev => ({ ...prev, [postId]: res.data?.data ?? res.data ?? [] }))
    } catch {
      setCommentError('댓글을 불러오지 못했습니다.')
    } finally {
      setLoadingComments(null)
    }
  }

  async function handleDeleteComment(postId, comment) {
    const ok = await confirm({
      icon: 'bi-chat-x-fill',
      title: '댓글 삭제',
      message: `"${comment.author}"의 댓글을 삭제하시겠습니까?`,
      confirmLabel: '삭제',
      danger: true,
    })
    if (!ok) return
    try {
      await delete_admin_comment(comment.id)
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: prev[postId].filter(c => c.id !== comment.id),
      }))
      onPostsChange(prev => prev.map(p =>
        p.id === postId ? { ...p, commentCount: (p.commentCount ?? 1) - 1 } : p
      ))
    } catch (err) {
      setCommentError(err.response?.data?.message ?? '댓글 삭제에 실패했습니다.')
    }
  }

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-400)', fontSize: 14 }}>
        등록된 게시글이 없습니다.
      </div>
    )
  }

  return (
    <>
      {commentError && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: 'var(--coral-50)', borderRadius: 10, fontSize: 13, color: 'var(--coral-600)' }}>
          {commentError}
        </div>
      )}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--sage-50)', borderBottom: '1px solid var(--sage-100)' }}>
              <th style={thStyle}>ID</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>제목</th>
              <th style={thStyle}>카테고리</th>
              <th style={thStyle}>작성자</th>
              <th style={thStyle}>좋아요</th>
              <th style={thStyle}>댓글</th>
              <th style={thStyle}>작성일</th>
              <th style={{ ...thStyle, width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <>
                <tr
                  key={post.id}
                  style={{
                    borderBottom: expandedPostId === post.id ? 'none' : '1px solid var(--sage-50)',
                    background: expandedPostId === post.id ? 'var(--sage-50)' : 'transparent',
                  }}
                >
                  <td style={tdStyle}>{post.id}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', maxWidth: 260 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </div>
                  </td>
                  <td style={tdStyle}>{post.category}</td>
                  <td style={tdStyle}>{post.author}</td>
                  <td style={tdStyle}>{post.likes}</td>
                  <td style={tdStyle}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{
                        padding: '2px 8px', fontSize: 12,
                        color: expandedPostId === post.id ? 'var(--sage-600)' : 'var(--ink-500)',
                        fontWeight: expandedPostId === post.id ? 700 : 400,
                      }}
                      onClick={() => toggleComments(post.id)}
                      title="댓글 관리"
                    >
                      <i className={`bi bi-chat-dots${expandedPostId === post.id ? '-fill' : ''}`} style={{ marginRight: 3 }} />
                      {post.commentCount ?? 0}
                      <i className={`bi bi-chevron-${expandedPostId === post.id ? 'up' : 'down'}`} style={{ marginLeft: 4, fontSize: 10 }} />
                    </button>
                  </td>
                  <td style={tdStyle}>{post.createdAt?.slice(0, 10)}</td>
                  <td style={tdStyle}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 8px', color: 'var(--coral-500)', fontSize: 13 }}
                      onClick={() => onDeletePost(post)}
                      title="게시글 삭제"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </td>
                </tr>
                {expandedPostId === post.id && (
                  <tr key={`comments-${post.id}`} style={{ borderBottom: '1px solid var(--sage-100)' }}>
                    <td colSpan={8} style={{ padding: 0 }}>
                      <CommentPanel
                        postId={post.id}
                        comments={commentsByPost[post.id]}
                        loading={loadingComments === post.id}
                        onDelete={(comment) => handleDeleteComment(post.id, comment)}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function CommentPanel({ postId, comments, loading, onDelete }) {
  if (loading) {
    return (
      <div style={{ padding: '16px 24px', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-400)' }}>
        <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
        댓글 불러오는 중...
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <div style={{ padding: '14px 24px', background: 'var(--bg-soft)', fontSize: 13, color: 'var(--ink-400)' }}>
        댓글이 없습니다.
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-soft)', padding: '8px 0' }}>
      {comments.map((c, i) => (
        <div
          key={c.id}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 24px',
            borderBottom: i < comments.length - 1 ? '1px solid var(--sage-100)' : 'none',
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--amber-300), var(--amber-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 11,
          }}>
            {c.author?.charAt(0) ?? '익'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-800)' }}>{c.author}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-300)' }}>{c.createdAt?.slice(0, 10)}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-300)' }}>
                <i className="bi bi-heart-fill" style={{ fontSize: 9, marginRight: 2, color: 'var(--coral-300)' }} />
                {c.likes}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.55 }}>{c.content}</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px 6px', color: 'var(--coral-500)', fontSize: 13, flexShrink: 0 }}
            onClick={() => onDelete(c)}
            title="댓글 삭제"
          >
            <i className="bi bi-trash3" />
          </button>
        </div>
      ))}
    </div>
  )
}

const thStyle = {
  padding: '10px 14px',
  textAlign: 'center',
  fontWeight: 600,
  color: 'var(--ink-600)',
  fontSize: 13,
}

const tdStyle = {
  padding: '10px 14px',
  textAlign: 'center',
  color: 'var(--ink-700)',
}
