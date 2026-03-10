import { useState } from 'react'
import { C, WORK } from '../lib/constants'
import { SheetOverlay, SheetHeader } from './SheetOverlay'

export default function WorkSheet({ date, ev, onClose, onSave }) {
  const [vSel, setV] = useState(ev?.V || null)
  const [fSel, setF] = useState(ev?.F || null)

  const d = new Date(date + 'T00:00:00')
  const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  const users = [
    { who: '🧑 Vincent', sel: vSel, set: setV },
    { who: '👩 Marie',   sel: fSel, set: setF },
  ]

  return (
    <SheetOverlay onClose={onClose}>
      <SheetHeader dateStr={dateStr} title="Planning travail" />

      <div style={{ overflowY: 'auto', padding: '20px 22px 0' }}>
        {users.map(({ who, sel, set }) => (
          <div key={who} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              {who}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(WORK).map(([key, t]) => (
                <button
                  key={key}
                  className="chip-btn"
                  onClick={() => set(sel === key ? null : key)}
                  style={{
                    padding: '9px 16px', borderRadius: 10,
                    background: sel === key ? t.bg : C.surface2,
                    color: sel === key ? t.text : C.muted,
                    fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans',sans-serif",
                    outline: sel === key ? `2px solid ${t.bg}` : 'none',
                    outlineOffset: 2,
                    transition: 'all .12s',
                  }}
                >
                  {t.label}
                </button>
              ))}
              {sel && (
                <button
                  onClick={() => set(null)}
                  style={{
                    padding: '9px 14px', borderRadius: 10,
                    background: C.surface3, color: C.muted,
                    fontWeight: 600, fontSize: 12, border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  ✕ Effacer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 22px 36px', flexShrink: 0 }}>
        <button
          onClick={() => { onSave(date, { V: vSel, F: fSel, P: ev?.P || [] }); onClose() }}
          style={{
            width: '100%', padding: '15px', background: C.accent,
            color: '#fff', fontWeight: 800, fontSize: 16, border: 'none',
            borderRadius: 14, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            letterSpacing: '-0.2px',
          }}
        >
          Valider
        </button>
      </div>
    </SheetOverlay>
  )
}
