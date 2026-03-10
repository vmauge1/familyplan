import { C, PERSO } from '../lib/constants'
import { SheetOverlay } from './SheetOverlay'

export default function PersoListSheet({ date, items, onClose, onAdd, onEdit, onDelete }) {
  const d = new Date(date + 'T00:00:00')
  const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <SheetOverlay onClose={onClose}>
      {/* Header */}
      <div style={{ padding: '14px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'capitalize', letterSpacing: '0.05em' }}>{dateStr}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>Événements</div>
        </div>
        <button
          onClick={onAdd}
          style={{
            background: C.accent, border: 'none', color: '#fff',
            borderRadius: 10, padding: '8px 15px', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginTop: 4,
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          ＋ Ajouter
        </button>
      </div>

      <div style={{ height: 1, background: C.border, margin: '14px 0 0', flexShrink: 0 }} />

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '12px 22px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '44px 0', animation: 'fadeIn .3s ease both' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <div style={{ fontSize: 15, color: C.muted, fontFamily: "'DM Sans',sans-serif" }}>Aucun événement</div>
            <div style={{ fontSize: 13, color: C.surface3, marginTop: 6 }}>Appuie sur ＋ pour en ajouter</div>
          </div>
        ) : items.map((ev, i) => {
          const t = PERSO[ev.type] || PERSO.autre
          return (
            <div
              key={ev.id}
              className="perso-row"
              style={{
                display: 'flex', alignItems: 'center', gap: 13,
                padding: '12px 14px', borderRadius: 14, marginBottom: 8,
                background: C.surface2, animation: `fadeIn .2s ease ${i * 0.05}s both`,
                border: `1px solid ${C.border}`,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: t.dim, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 22, flexShrink: 0,
                border: `1px solid ${t.bg}30`,
              }}>
                {t.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ev.title || t.label}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 3 }}>
                  {ev.heure && (
                    <span style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 3 }}>
                      🕐 {ev.heure}
                    </span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.bg, background: t.dim, padding: '2px 7px', borderRadius: 6 }}>
                    {t.label}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted, background: C.surface3, padding: '2px 7px', borderRadius: 6 }}>
                    {ev.who === 'tous' ? '👥 Tous' : ev.who === 'Vincent' ? '🧑 Vin.' : '👩 Marie'}
                  </span>
                </div>
                {ev.note && (
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.note}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                <button
                  onClick={() => onEdit(ev)}
                  style={{ background: C.surface3, border: 'none', color: C.muted, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(ev.id)}
                  style={{ background: C.surface3, border: 'none', color: '#DA3633', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}
                >
                  🗑
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '8px 22px 36px', flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{ width: '100%', padding: '14px', background: C.surface2, color: C.muted, fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
        >
          Fermer
        </button>
      </div>
    </SheetOverlay>
  )
}
