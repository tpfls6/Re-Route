import { useNavigate } from 'react-router-dom'

const DIFFICULTY_CLASS = { 1: 'ql1', 2: 'ql2', 3: 'ql3' }
const STATUS_LABEL = { PENDING: '진행 중', COMPLETED: '완료', SKIPPED: '건너뜀' }

export function QuestCard({ quest: q, completing, onComplete, onClick }) {
  const navigate = useNavigate()
  const done      = q.status === 'COMPLETED'
  const skipped   = q.status === 'SKIPPED'
  const pending   = !done && !skipped
  const hasRetro  = q.feeling != null || q.reflection != null
  const isCounseling = q.sourceType === 'COUNSELING'
  const isRehearsal  = q.sourceType === 'REHEARSAL'

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        opacity: skipped ? 0.55 : 1,
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '' }}
    >
      {/* 첫 번째 행: 레벨 + 유형 + 출처뱃지 | 상태뱃지 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        flexWrap: 'wrap',
        gap: 6,
      }}>
        {/* 좌측: 레벨·유형·출처 — 한 줄 수평 정렬 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', minWidth: 0 }}>
          <span
            className={`quest-level ${DIFFICULTY_CLASS[q.difficulty] ?? 'ql1'}`}
            style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, marginBottom: 0 }}
          >
            {q.difficultyLabel}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', flexShrink: 0,
            fontSize: 12, fontWeight: 600,
            padding: '2px 8px', borderRadius: 100,
            background: 'rgba(110,154,101,0.1)',
            color: 'var(--sage-600)',
          }}>
            {q.recoveryTypeName}
          </span>
          {(isCounseling || isRehearsal) && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', flexShrink: 0,
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              borderRadius: 100,
              background: isCounseling ? 'rgba(110,154,101,0.12)' : 'rgba(240,198,116,0.15)',
              color: isCounseling ? 'var(--sage-600)' : 'var(--amber-500)',
            }}>
              <i className={`bi ${isCounseling ? 'bi-chat-dots-fill' : 'bi-stars'}`} style={{ marginRight: 4 }} />
              {isCounseling ? 'AI 상담' : 'VR 리허설'}
            </span>
          )}
        </div>

        {/* 우측: 상태 뱃지 */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', flexShrink: 0,
          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
          background: done ? 'var(--sage-50)' : skipped ? 'var(--line)' : 'transparent',
          color: done ? 'var(--sage-700)' : skipped ? 'var(--ink-400)' : 'var(--ink-400)',
          border: done ? '1px solid var(--sage-100)' : '1px solid var(--line)',
        }}>
          {done && <i className="bi bi-check-circle-fill" style={{ marginRight: 3 }} />}
          {STATUS_LABEL[q.status] ?? '진행 중'}
        </span>
      </div>

      {/* 제목 */}
      <div style={{
        fontWeight: done ? 400 : 700, fontSize: 15, marginBottom: 10,
        color: done ? 'var(--ink-300)' : 'var(--ink-900)',
      }}>
        {q.title}
      </div>

      {/* 하단: 출처명 + 날짜 | 완료 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: 'var(--ink-400)' }}>
          <span>
            <i className="bi bi-link-45deg" style={{ marginRight: 3 }} />
            {isCounseling
              ? (q.counselingSessionTitle ?? 'AI 상담')
              : isRehearsal
                ? (q.rehearsalScenarioName ?? 'VR 리허설')
                : '—'}
          </span>
          <span>
            <i className="bi bi-clock" style={{ marginRight: 3 }} />
            {q.estimatedMinutes}분
          </span>
          <span>
            <i className="bi bi-calendar3" style={{ marginRight: 3 }} />
            {q.createdAt?.slice(0, 10)}
          </span>
        </div>

        {/* 인라인 버튼 영역 */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {/* 완료 전: 완료 버튼 */}
          {pending && (
            <button
              className="btn btn-sm btn-primary"
              style={{ fontSize: 12, padding: '4px 12px' }}
              onClick={e => onComplete(e, q.id)}
              disabled={completing === q.id}
            >
              {completing === q.id
                ? <><span className="spinner" style={{ width: 12, height: 12, marginRight: 4 }} />처리 중</>
                : <><i className="bi bi-check2" style={{ marginRight: 4 }} />완료</>}
            </button>
          )}

          {/* 완료 후 회고 없으면: 회고 작성 버튼 */}
          {done && !hasRetro && (
            <button
              className="btn btn-sm"
              style={{
                fontSize: 12, padding: '4px 12px',
                background: 'var(--sage-50)',
                color: 'var(--sage-700)',
                border: '1px solid var(--sage-100)',
              }}
              onClick={() => navigate(`/quests/${q.id}/complete`)}
            >
              <i className="bi bi-journal-text" style={{ marginRight: 4 }} />
              회고 작성
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
