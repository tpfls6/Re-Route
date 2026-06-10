import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { CATEGORY_COLORS } from '../../data/mockCommunity'
import { get_community_post, patch_community_post, post_community_post } from '../../api/communityApi'

const CATEGORIES = Object.keys(CATEGORY_COLORS)

export default function CommunityPostWrite() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isEdit) return
    async function loadPost() {
      const res = await get_community_post(id)
      const post = res.data.data
      setCategory(post.category)
      setTitle(post.title)
      setContent(post.content)
      setTags(post.tags ?? [])
    }
    loadPost()
  }, [id, isEdit])

  function handleTagAdd(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().replace(/^#/, '')
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags(prev => [...prev, tag])
      }
      setTagInput('')
    }
  }

  function removeTag(tag) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    setErrorMessage('')
    try {
      const payload = { category, title: title.trim(), content: content.trim(), tags }
      const res = isEdit
        ? await patch_community_post(id, payload)
        : await post_community_post(payload)
      if (res.data.data.safetyNotice) {
        window.alert(res.data.data.safetyNotice)
      }
      navigate(isEdit ? `/community/post/${res.data.data.id}` : '/community')
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? '글을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const isReady = title.trim().length > 0 && content.trim().length >= 10

  return (
    <AppLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/community')} style={{ marginBottom: 24 }}>
        <i className="bi bi-arrow-left" /> 커뮤니티로 돌아가기
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">{isEdit ? '글 수정' : '글 작성'}</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          비슷한 고민을 가진 분들과 이야기를 나눠보세요.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {errorMessage && (
            <div style={{
              padding: '14px 18px',
              border: '1px solid var(--terra-300)',
              borderRadius: 'var(--radius-md)',
              background: '#fff0ee',
              color: 'var(--terra-500)',
              fontSize: 13,
              lineHeight: 1.6,
            }}>
              <i className="bi bi-shield-exclamation" style={{ marginRight: 8 }} />
              {errorMessage}
            </div>
          )}

          {/* Category */}
          <div className="card">
            <div className="form-label" style={{ marginBottom: 14 }}>
              <i className="bi bi-tag-fill" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
              카테고리
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => {
                const style = CATEGORY_COLORS[cat]
                const active = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '7px 16px', borderRadius: 100,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                      border: `1.5px solid ${active ? style.color : 'var(--line)'}`,
                      background: active ? style.bg : 'var(--white)',
                      color: active ? style.color : 'var(--ink-500)',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div className="card">
            <label className="form-label" htmlFor="post-title" style={{ marginBottom: 8 }}>
              <i className="bi bi-pencil-fill" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
              제목
            </label>
            <input
              id="post-title"
              className="form-input"
              style={{ borderRadius: 'var(--radius-md)' }}
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={60}
            />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-300)', textAlign: 'right' }}>
              {title.length}/60
            </div>
          </div>

          {/* Content */}
          <div className="card">
            <label className="form-label" htmlFor="post-content" style={{ marginBottom: 8 }}>
              <i className="bi bi-file-text-fill" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
              내용
            </label>
            <textarea
              id="post-content"
              className="form-input"
              style={{ borderRadius: 'var(--radius-md)', resize: 'vertical', minHeight: 200, lineHeight: 1.7 }}
              placeholder="솔직하게 이야기해주세요. 이곳은 안전한 공간이에요."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-300)', textAlign: 'right' }}>
              {content.length}자 {content.length < 10 && content.length > 0 && <span style={{ color: 'var(--terra-500)' }}>(최소 10자)</span>}
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <label className="form-label" htmlFor="post-tags" style={{ marginBottom: 8 }}>
              <i className="bi bi-hash" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
              태그 <span style={{ fontWeight: 400, color: 'var(--ink-300)', fontSize: 12 }}>(선택, 최대 5개)</span>
            </label>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
              padding: '8px 12px', border: '1.5px solid var(--line)',
              borderRadius: 'var(--radius-md)', minHeight: 48,
              background: 'var(--white)',
            }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 100,
                  background: 'var(--sage-50)', color: 'var(--sage-700)',
                  border: '1px solid var(--sage-100)', fontSize: 12, fontWeight: 600,
                }}>
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sage-500)', padding: 0, lineHeight: 1 }}
                  >
                    <i className="bi bi-x" style={{ fontSize: 14 }} />
                  </button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  id="post-tags"
                  style={{
                    border: 'none', outline: 'none', fontSize: 13,
                    background: 'transparent', color: 'var(--ink-900)',
                    fontFamily: 'inherit', flexGrow: 1, minWidth: 120,
                  }}
                  placeholder="Enter로 태그 추가"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                />
              )}
            </div>
          </div>

          {/* Notice */}
          <div style={{
            padding: '14px 18px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-soft)', display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <i className="bi bi-shield-check-fill" style={{ color: 'var(--sage-300)', marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.6 }}>
              이 커뮤니티는 익명으로 운영됩니다. 닉네임은 랜덤으로 표시돼요. 서로를 배려하는 글을 작성해주세요.
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              style={{ flex: 1 }}
              onClick={() => navigate('/community')}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ flex: 2 }}
              disabled={!isReady || submitting}
            >
              {submitting ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> 저장 중...</>
              ) : (
                <><i className="bi bi-send-fill" /> {isEdit ? '저장하기' : '게시하기'}</>
              )}
            </button>
          </div>
        </div>
      </form>
    </AppLayout>
  )
}
