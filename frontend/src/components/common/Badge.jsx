export function Badge({ children, dot = false, style }) {
  return (
    <span className="badge" style={style}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  )
}
