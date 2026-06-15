import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { useQuests } from '../../hooks/useQuests'
import { QuestCard } from '../../components/quest/QuestCard'
import { PaginationBar } from '../../components/common/PaginationBar'

export default function Quests() {
  const navigate = useNavigate()
  const {
    quests,
    loading,
    sourceTab,
    setSourceTab,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    paged,
    totalPages,
    completing,
    handleComplete,
    counselingCount,
    rehearsalCount,
    doneCount,
  } = useQuests()

  return (
    <AppLayout>
      {/* 헤더 */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">퀘스트</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          AI 상담과 VR 리허설에서 생성된 맞춤 퀘스트 · {doneCount}/{quests.length} 완료
        </p>
      </div>

      {/* 출처 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[
          { key: 'all',        label: `전체 ${quests.length}`,       icon: 'bi-grid' },
          { key: 'counseling', label: `AI 상담 ${counselingCount}`,  icon: 'bi-chat-dots-fill' },
          { key: 'rehearsal',  label: `VR 리허설 ${rehearsalCount}`, icon: 'bi-stars' },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            className={`btn btn-sm ${sourceTab === key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSourceTab(key)}
          >
            <i className={`bi ${icon}`} style={{ marginRight: 5 }} />
            {label}
          </button>
        ))}
      </div>

      {/* 상태 필터 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {[
          { key: 'all',     label: '전체' },
          { key: 'pending', label: '미완료' },
          { key: 'done',    label: '완료' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            style={{
              padding: '3px 12px', borderRadius: 100, fontSize: 12, cursor: 'pointer',
              border: '1px solid var(--line)',
              background: statusFilter === key ? 'var(--ink-900)' : 'transparent',
              color: statusFilter === key ? 'white' : 'var(--ink-400)',
              fontWeight: statusFilter === key ? 700 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="spinner" /> 퀘스트를 불러오는 중...
        </div>
      )}

      {/* 목록 */}
      {!loading && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paged.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="bi bi-trophy" style={{ color: 'var(--sage-300)', fontSize: 48 }} />
                </div>
                <div className="empty-title">
                  {sourceTab === 'counseling'
                    ? 'AI 상담을 완료하면 퀘스트가 생성됩니다'
                    : sourceTab === 'rehearsal'
                      ? 'VR 리허설 저장 후 퀘스트를 받을 수 있어요'
                      : '아직 퀘스트가 없습니다'}
                </div>
              </div>
            ) : (
              paged.map(q => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  completing={completing}
                  onComplete={handleComplete}
                  onClick={() => navigate(`/quests/${q.id}`)}
                />
              ))
            )}
          </div>

          <PaginationBar
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}
    </AppLayout>
  )
}
