export function PaginationBar({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 4, marginTop: 24,
    }}>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <i className="bi bi-chevron-left" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
        // 현재 페이지 ±2 범위만 표시, 나머지는 ...
        if (
          p === 1 || p === totalPages ||
          (p >= page - 2 && p <= page + 2)
        ) {
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: p === page ? 700 : 400,
                background: p === page ? 'var(--ink-900)' : 'transparent',
                color: p === page ? 'white' : 'var(--ink-400)',
              }}
            >
              {p}
            </button>
          )
        }
        if (p === page - 3 || p === page + 3) {
          return <span key={p} style={{ color: 'var(--ink-300)', fontSize: 13 }}>…</span>
        }
        return null
      })}

      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  )
}
