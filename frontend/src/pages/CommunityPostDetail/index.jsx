import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { CATEGORY_COLORS } from '../../data/mockCommunity'
import {
  delete_community_comment,
  delete_community_comment_like,
  delete_community_post,
  delete_community_post_like,
  get_community_post,
  patch_community_comment,
  post_community_comment,
  post_community_comment_like,
  post_community_post_like,
} from '../../api/communityApi'

function displayDate(value) {
  return value ? value.slice(0, 10) : ''
}

export default function CommunityPostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [commentInput, setCommentInput] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadPost()
  }, [id])

  async function loadPost() {
    const res = await get_community_post(id)
    setPost(res.data.data)
  }

  async function handleLike() {
    const res = post.liked
      ? await delete_community_post_like(post.id)
      : await post_community_post_like(post.id)
    setPost(res.data.data)
  }

  async function handleDeletePost() {
    if (!window.confirm('게시글을 삭제할까요?')) return
    await delete_community_post(post.id)
    navigate('/community')
  }

  async function handleCommentSubmit(e) {
    e.preventDefault()
    const text = commentInput.trim()
    if (!text) return
    setErrorMessage('')
    try {
      const res = await post_community_comment(post.id, text)
      setCommentInput('')
      if (res.data.data.safetyNotice) window.alert(res.data.data.safetyNotice)
      await loadPost()
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? '댓글을 등록하지 못했습니다.')
    }
  }

  function startEditComment(comment) {
    setEditingCommentId(comment.id)
    setEditingCommentContent(comment.content)
  }

  function cancelEditComment() {
    setEditingCommentId(null)
    setEditingCommentContent('')
  }

  async function handleCommentUpdate(commentId) {
    const text = editingCommentContent.trim()
    if (!text) return
    setErrorMessage('')
    try {
      const res = await patch_community_comment(commentId, text)
      if (res.data.data.safetyNotice) window.alert(res.data.data.safetyNotice)
      cancelEditComment()
      await loadPost()
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? '댓글을 수정하지 못했습니다.')
    }
  }

  async function handleCommentDelete(commentId) {
    if (!window.confirm('댓글을 삭제할까요?')) return
    await delete_community_comment(commentId)
    await loadPost()
  }

  async function handleCommentLike(comment) {
    await (comment.liked
      ? delete_community_comment_like(comment.id)
      : post_community_comment_like(comment.id))
    await loadPost()
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="card">게시글을 불러오는 중입니다.</div>
      </AppLayout>
    )
  }

  const catStyle = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['질문']
  const comments = post.comments ?? []

  return (
    <AppLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/community')} style={{ marginBottom: 24 }}>
        <i className="bi bi-arrow-left" /> 커뮤니티로 돌아가기
      </button>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{
            padding: '4px 12px', borderRadius: 100,
            fontSize: 12, fontWeight: 700,
            background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}`,
          }}>
            {post.category}
          </span>
          {post.mine && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/community/post/${post.id}/edit`)}>
                <i className="bi bi-pencil" /> 수정
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleDeletePost}>
                <i className="bi bi-trash" /> 삭제
              </button>
            </div>
          )}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink-900)', lineHeight: 1.3, marginBottom: 16 }}>
          {post.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--sage-300), var(--sage-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--white)', fontWeight: 700, fontSize: 12, flexShrink: 0,
            }}>
              {post.author?.charAt(0) ?? '익'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)' }}>{post.author}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{post.authorType}</div>
            </div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--ink-300)' }}>{displayDate(post.createdAt)}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {post.tags?.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
              background: 'var(--bg-soft)', color: 'var(--ink-700)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{
          fontSize: 15, color: 'var(--ink-900)', lineHeight: 1.8,
          whiteSpace: 'pre-line',
        }}>
          {post.content}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <button
          onClick={handleLike}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 100,
            border: `1.5px solid ${post.liked ? 'var(--terra-300)' : 'var(--line)'}`,
            background: post.liked ? '#fff0ee' : 'var(--white)',
            color: post.liked ? 'var(--terra-500)' : 'var(--ink-500)',
            cursor: 'pointer', transition: 'all 0.2s',
            fontWeight: 600, fontSize: 14,
          }}
        >
          <i className={`bi bi-heart${post.liked ? '-fill' : ''}`} />
          공감해요 {post.likes}
        </button>
        <span style={{ fontSize: 13, color: 'var(--ink-300)' }}>
          <i className="bi bi-chat-dots" style={{ marginRight: 4 }} />
          {comments.length}개의 댓글
        </span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 20 }}>
          <i className="bi bi-chat-dots-fill" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
          댓글 {comments.length}개
        </div>
        {comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-300)', fontSize: 14 }}>
            첫 댓글을 남겨보세요
          </div>
        )}
        {comments.map((c, i) => (
          <div key={c.id} style={{
            padding: '16px 0',
            borderBottom: i < comments.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--amber-300), var(--amber-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--white)', fontWeight: 700, fontSize: 11, flexShrink: 0,
              }}>
                {c.author?.charAt(0) ?? '익'}
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', marginRight: 6 }}>{c.author}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-300)' }}>{c.authorType} · {displayDate(c.createdAt)}</span>
              </div>
              <button
                onClick={() => handleCommentLike(c)}
                style={{
                  marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, color: c.liked ? 'var(--terra-500)' : 'var(--ink-300)',
                  padding: '4px 8px',
                }}
              >
                <i className={`bi bi-heart${c.liked ? '-fill' : ''}`} />
                {c.likes}
              </button>
              {c.mine && (
                <>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEditComment(c)}>수정</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleCommentDelete(c.id)}>삭제</button>
                </>
              )}
            </div>
            {editingCommentId === c.id ? (
              <div style={{ paddingLeft: 36 }}>
                <textarea
                  className="form-input"
                  style={{ borderRadius: 'var(--radius-md)', minHeight: 80, marginBottom: 8 }}
                  value={editingCommentContent}
                  onChange={e => setEditingCommentContent(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" onClick={cancelEditComment}>취소</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleCommentUpdate(c.id)}>저장</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6, paddingLeft: 36 }}>
                {c.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 14 }}>댓글 작성</div>
        {errorMessage && (
          <div style={{ marginBottom: 12, color: 'var(--terra-500)', fontSize: 13 }}>
            <i className="bi bi-shield-exclamation" style={{ marginRight: 6 }} />
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="form-input"
            style={{ borderRadius: 'var(--radius-md)', resize: 'vertical', minHeight: 80, lineHeight: 1.6, marginBottom: 10 }}
            placeholder="따뜻한 댓글을 남겨주세요."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!commentInput.trim()}
            >
              <i className="bi bi-send-fill" /> 댓글 등록
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
