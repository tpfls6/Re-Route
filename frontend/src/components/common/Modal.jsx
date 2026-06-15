import { useState, useRef } from 'react'

const backdropStyle = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(30,28,24,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 20,
  animation: 'modalFadeIn 0.15s ease',
}

const cardStyle = {
  background: '#ffffff',
  borderRadius: 20,
  padding: '32px 28px 24px',
  maxWidth: 420,
  width: '100%',
  boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
  animation: 'modalSlideUp 0.18s ease',
}

function ModalBase({ onBackdropClick, children }) {
  return (
    <div style={backdropStyle} onClick={onBackdropClick}>
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function ConfirmModal({ open, icon, title, message, confirmLabel = '확인', cancelLabel = '취소', danger = false, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <ModalBase onBackdropClick={onCancel}>
      {icon && (
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: danger ? 'var(--coral-50)' : 'var(--sage-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, marginBottom: 14,
        }}>
          <i className={`bi ${icon}`} style={{ color: danger ? 'var(--coral-500)' : 'var(--sage-600)' }} />
        </div>
      )}
      {title && (
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>
          {title}
        </div>
      )}
      {message && (
        <div style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.65, marginBottom: 22, whiteSpace: 'pre-line' }}>
          {message}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--line)', marginTop: 4 }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>{cancelLabel}</button>
        <button
          className={`btn btn-sm${!danger ? ' btn-primary' : ''}`}
          onClick={onConfirm}
          style={danger ? { background: '#e53935', color: '#fff', border: 'none', fontWeight: 600 } : {}}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalBase>
  )
}

export function AlertModal({ open, icon, title, message, type = 'info', onClose }) {
  if (!open) return null

  const isSafety = type === 'safety'

  return (
    <ModalBase onBackdropClick={onClose}>
      {isSafety ? (
        <div style={{
          background: 'var(--coral-50)', border: '1px solid var(--coral-200)',
          borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 18,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <i className="bi bi-heart-pulse-fill" style={{ color: 'var(--coral-500)', fontSize: 18, flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: 'var(--coral-700)', lineHeight: 1.6 }}>
            {title || message}
          </div>
        </div>
      ) : (
        <>
          {icon && (
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--sage-50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, marginBottom: 14,
            }}>
              <i className={`bi ${icon}`} style={{ color: 'var(--sage-600)' }} />
            </div>
          )}
          {title && (
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>
              {title}
            </div>
          )}
          {message && (
            <div style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.65, marginBottom: 22, whiteSpace: 'pre-line' }}>
              {message}
            </div>
          )}
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-sm" onClick={onClose}>확인</button>
      </div>
    </ModalBase>
  )
}

export function useModal() {
  const [modal, setModal] = useState(null)
  const resolveRef = useRef(null)

  function confirm(options) {
    const opts = typeof options === 'string' ? { message: options } : options
    return new Promise(resolve => {
      resolveRef.current = resolve
      setModal({ kind: 'confirm', ...opts })
    })
  }

  function showAlert(options) {
    const opts = typeof options === 'string' ? { message: options } : options
    return new Promise(resolve => {
      resolveRef.current = resolve
      setModal({ kind: 'alert', ...opts })
    })
  }

  function handleConfirm() {
    resolveRef.current?.(true)
    setModal(null)
  }

  function handleCancel() {
    resolveRef.current?.(false)
    setModal(null)
  }

  const ModalElement = modal ? (
    modal.kind === 'confirm' ? (
      <ConfirmModal
        open={true}
        icon={modal.icon}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
        cancelLabel={modal.cancelLabel}
        danger={modal.danger}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ) : (
      <AlertModal
        open={true}
        icon={modal.icon}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={handleConfirm}
      />
    )
  ) : null

  return { confirm, showAlert, ModalElement }
}
