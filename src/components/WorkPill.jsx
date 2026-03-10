import { C, WORK } from '../lib/constants'

export default function WorkPill({ code, size = 'md' }) {
  const h  = size === 'sm' ? 26 : 30
  const fs = size === 'sm' ? 10 : 11

  if (!code) return (
    <div style={{
      height: h, borderRadius: 7, background: C.surface2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: 16, height: 1.5, background: C.surface3, borderRadius: 2 }} />
    </div>
  )

  const t = WORK[code]
  return (
    <div style={{
      height: h, borderRadius: 7, background: t.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: t.border ? `1px solid ${t.border}` : 'none',
    }}>
      <span style={{ fontSize: fs, fontWeight: 800, color: t.text, letterSpacing: '0.02em', fontFamily: "'DM Sans',sans-serif" }}>
        {t.short}
      </span>
    </div>
  )
}
