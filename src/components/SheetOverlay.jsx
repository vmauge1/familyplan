import { C } from '../lib/constants'

export function SheetOverlay({ onClose, children, zIndex = 60 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="sheet-enter"
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface, borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: 490,
          boxShadow: '0 -2px 60px rgba(0,0,0,0.8), 0 0 0 .5px rgba(255,255,255,0.06)',
          maxHeight: '91vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0', flexShrink: 0 }}>
          <div style={{ width: 32, height: 3.5, borderRadius: 4, background: C.surface3 }} />
        </div>
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ dateStr, title }) {
  return (
    <div style={{ padding: '14px 22px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'capitalize', letterSpacing: '0.05em' }}>
        {dateStr}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>
        {title}
      </div>
    </div>
  )
}

export function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </div>
  )
}
