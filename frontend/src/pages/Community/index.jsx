import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { CATEGORY_COLORS } from '../../data/mockCommunity'
import {
  delete_campfire,
  delete_campfire_join,
  get_campfires,
  get_community_posts,
  patch_campfire,
  post_campfire,
  post_campfire_join,
} from '../../api/communityApi'

const emptyCampfire = { name: '', description: '', keyword: '', open: true }

function displayDate(value) {
  return value ? value.slice(0, 10) : ''
}

export default function Community() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('board')
  const [joined, setJoined] = useState(null)
  const [filterCategory, setFilterCategory] = useState('전체')
  const [posts, setPosts] = useState([])
  const [campfires, setCampfires] = useState([])
  const [loading, setLoading] = useState(false)
  const [campfireForm, setCampfireForm] = useState(emptyCampfire)
  const [editingCampfireId, setEditingCampfireId] = useState(null)
  const [communityError, setCommunityError] = useState('')

  const categories = ['전체', ...Object.keys(CATEGORY_COLORS)]

  useEffect(() => {
    loadPosts()
  }, [filterCategory])

  useEffect(() => {
    if (tab === 'campfire') loadCampfires()
  }, [tab])

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await get_community_posts(filterCategory)
      setPosts(res.data.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function loadCampfires() {
    setLoading(true)
    try {
      const res = await get_campfires(false)
      setCampfires(res.data.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  function startEditCampfire(campfire) {
    setEditingCampfireId(campfire.id)
    setCampfireForm({
      name: campfire.name,
      description: campfire.description ?? campfire.desc,
      keyword: campfire.keyword,
      open: campfire.open,
    })
  }

  function resetCampfireForm() {
    setEditingCampfireId(null)
    setCampfireForm(emptyCampfire)
  }

  async function handleCampfireSubmit(e) {
    e.preventDefault()
    setCommunityError('')
    const payload = {
      ...campfireForm,
      name: campfireForm.name.trim(),
      description: campfireForm.description.trim(),
      keyword: campfireForm.keyword.trim(),
    }
    if (!payload.name || !payload.description || !payload.keyword) return
    try {
      const res = editingCampfireId
        ? await patch_campfire(editingCampfireId, payload)
        : await post_campfire(payload)
      if (res.data.data.safetyNotice) window.alert(res.data.data.safetyNotice)
      resetCampfireForm()
      await loadCampfires()
    } catch (error) {
      setCommunityError(error.response?.data?.message ?? '캠프파이어를 저장하지 못했습니다.')
    }
  }

  async function handleCampfireDelete(campfireId) {
    if (!window.confirm('캠프파이어를 삭제할까요?')) return
    await delete_campfire(campfireId)
    if (joined?.id === campfireId) setJoined(null)
    await loadCampfires()
  }

  async function handleCampfireJoin(campfire) {
    const res = campfire.joined
      ? await delete_campfire_join(campfire.id)
      : await post_campfire_join(campfire.id)
    const updated = res.data.data
    setJoined(updated.joined ? updated : null)
    await loadCampfires()
  }

  if (joined) {
    return (
      <AppLayout>
        <button className="btn btn-ghost btn-sm" onClick={() => setJoined(null)} style={{ marginBottom: 20 }}>
          <i className="bi bi-arrow-left" /> 캠프파이어 목록으로
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #2c2a26, #3a372f)',
          borderRadius: 'var(--radius-xl)',
          padding: 40, color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <i className="bi bi-fire" style={{ color: 'var(--amber-300)', fontSize: 28 }} />
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{joined.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{joined.keyword}</p>
            </div>
            <span style={{
              marginLeft: 'auto', padding: '4px 12px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 100, fontSize: 13, color: 'var(--amber-300)',
            }}>
              <i className="bi bi-people-fill" style={{ marginRight: 4 }} />
              {joined.members}명 참여 중
            </span>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 'var(--radius-lg)',
            padding: 24, marginBottom: 20,
            minHeight: 280, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
          }}>
            <div className="fire" style={{ position: 'static', transform: 'none', marginBottom: 24 }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center' }}>
              AI 모더레이팅 VR 캠프파이어가 준비 중입니다.<br />
              곧 실시간 음성 대화를 즐길 수 있습니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="vr-btn primary" style={{ flex: 1 }}>
              <i className="bi bi-mic-fill" /> 음성으로 참여
            </button>
            <button className="vr-btn" style={{ flex: 1 }}>
              <i className="bi bi-chat-dots" /> 텍스트로 참여
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">커뮤니티</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          같은 고민을 가진 사람들과 안전하게 연대합니다.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {[
          { key: 'board', icon: 'bi-file-text', label: '게시판' },
          { key: 'campfire', icon: 'bi-fire', label: '캠프파이어' },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            className={`btn btn-sm ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab(key)}
          >
            <i className={`bi ${icon}`} /> {label}
          </button>
        ))}
      </div>

      {communityError && (
        <div style={{
          padding: '14px 18px',
          marginBottom: 16,
          border: '1px solid var(--terra-300)',
          borderRadius: 'var(--radius-md)',
          background: '#fff0ee',
          color: 'var(--terra-500)',
          fontSize: 13,
        }}>
          <i className="bi bi-shield-exclamation" style={{ marginRight: 8 }} />
          {communityError}
        </div>
      )}

      {tab === 'board' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map(cat => {
                const s = CATEGORY_COLORS[cat]
                const active = filterCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    style={{
                      padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s',
                      border: `1.5px solid ${active && s ? s.color : 'var(--line)'}`,
                      background: active && s ? s.bg : active ? 'var(--sage-50)' : 'var(--white)',
                      color: active && s ? s.color : active ? 'var(--sage-700)' : 'var(--ink-500)',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/community/write')}>
              <i className="bi bi-pencil" /> 글 쓰기
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map(post => {
              const catStyle = CATEGORY_COLORS[post.category]
              return (
                <div
                  key={post.id}
                  style={{
                    background: 'var(--white)', borderRadius: 'var(--radius-md)',
                    padding: '20px 24px', border: '1px solid var(--line)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onClick={() => navigate(`/community/post/${post.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: catStyle?.bg ?? 'var(--bg-soft)', color: catStyle?.color ?? 'var(--ink-700)', border: `1px solid ${catStyle?.border ?? 'var(--line)'}`,
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--ink-300)' }}>{displayDate(post.createdAt)}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink-900)', marginBottom: 6 }}>
                    {post.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 14, lineHeight: 1.5 }}>
                    {post.preview}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--sage-300), var(--sage-500))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--white)', fontWeight: 700, fontSize: 10,
                      }}>
                        {post.author?.charAt(0) ?? '익'}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-700)' }}>{post.author}</span>
                      <span style={{ fontSize: 11, color: 'var(--ink-300)' }}>{post.authorType}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-300)' }}>
                      <span><i className="bi bi-heart" style={{ marginRight: 3 }} />{post.likes}</span>
                      <span><i className="bi bi-chat-dots" style={{ marginRight: 3 }} />{post.commentCount}</span>
                    </div>
                  </div>
                  {post.tags?.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {post.tags.map(tag => (
                        <span key={tag} style={{
                          padding: '2px 8px', borderRadius: 100, fontSize: 11,
                          background: 'var(--bg-soft)', color: 'var(--ink-500)',
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {!loading && posts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><i className="bi bi-file-text" style={{ color: 'var(--ink-300)', fontSize: 48 }} /></div>
              <div className="empty-title">해당 카테고리에 글이 없어요</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/community/write')}>
                첫 글 작성하기
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'campfire' && (
        <>
          <div className="community-card" style={{ marginBottom: 24 }}>
            <div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--amber-300)', borderColor: 'rgba(255,255,255,0.15)', marginBottom: 16 }}>
                <span className="badge-dot" style={{ background: 'var(--amber-300)' }} /> Camp Fire
              </span>
              <h3>혼자가 아니라는 감각이<br />다시 일어설 힘을 만듭니다.</h3>
              <p>AI가 분석한 고민 키워드가 유사한 사용자들이 VR 캠프파이어에 모입니다. 실시간 음성 대화는 AI가 모더레이팅합니다.</p>
            </div>
            <div className="campfire">
              <div className="fire" />
              <div className="avatar-circle ac1"><div className="av purple" /></div>
              <div className="avatar-circle ac2"><div className="av peach" /></div>
              <div className="avatar-circle ac3"><div className="av amber" /></div>
              <div className="avatar-circle ac4"><div className="av green" /></div>
              <div className="avatar-circle ac5"><div className="av" /></div>
            </div>
          </div>

          <form className="card" onSubmit={handleCampfireSubmit} style={{ marginBottom: 20 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>
              {editingCampfireId ? '캠프파이어 수정' : '캠프파이어 만들기'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr auto', gap: 10, alignItems: 'center' }}>
              <input className="form-input" placeholder="이름" value={campfireForm.name} onChange={e => setCampfireForm(v => ({ ...v, name: e.target.value }))} />
              <input className="form-input" placeholder="설명" value={campfireForm.description} onChange={e => setCampfireForm(v => ({ ...v, description: e.target.value }))} />
              <input className="form-input" placeholder="키워드" value={campfireForm.keyword} onChange={e => setCampfireForm(v => ({ ...v, keyword: e.target.value }))} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-500)' }}>
                <input type="checkbox" checked={campfireForm.open} onChange={e => setCampfireForm(v => ({ ...v, open: e.target.checked }))} />
                공개
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              {editingCampfireId && <button type="button" className="btn btn-ghost btn-sm" onClick={resetCampfireForm}>취소</button>}
              <button type="submit" className="btn btn-primary btn-sm">
                <i className={`bi ${editingCampfireId ? 'bi-check2' : 'bi-plus-lg'}`} /> {editingCampfireId ? '저장' : '만들기'}
              </button>
            </div>
          </form>

          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--ink-900)' }}>
            열린 캠프파이어
          </h2>
          <div className="campfire-grid">
            {campfires.map(c => (
              <div key={c.id} className="campfire-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div className="campfire-name">{c.name}</div>
                  <i className="bi bi-fire" style={{ color: c.open ? 'var(--amber-300)' : 'var(--ink-300)', fontSize: 18 }} />
                </div>
                <div className="campfire-desc">{c.desc}</div>
                <div className="campfire-meta">
                  <i className="bi bi-people-fill" />
                  <span>{c.members}명 참여 중</span>
                  <span style={{ margin: '0 4px' }}>·</span>
                  <span>{c.keyword}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                  <button className={`btn btn-sm ${c.joined ? 'btn-ghost' : 'btn-primary'}`} onClick={() => handleCampfireJoin(c)} disabled={!c.open && !c.joined}>
                    <i className={`bi ${c.joined ? 'bi-box-arrow-right' : 'bi-door-open'}`} /> {c.joined ? '나가기' : '참여'}
                  </button>
                  {c.joined && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setJoined(c)}>
                      <i className="bi bi-fire" /> 입장
                    </button>
                  )}
                  {c.mine && (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => startEditCampfire(c)}>
                        <i className="bi bi-pencil" /> 수정
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleCampfireDelete(c.id)}>
                        <i className="bi bi-trash" /> 삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!loading && campfires.length === 0 && (
            <div className="empty-state">
              <div className="empty-title">아직 열린 캠프파이어가 없어요</div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  )
}
