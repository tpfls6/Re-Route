export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="empty-state">
      {icon && (
        <div className="empty-icon">
          {icon}
        </div>
      )}
      <div className="empty-title">{title}</div>
      {subtitle && (
        <div style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 4 }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
