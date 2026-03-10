import { useState, useMemo } from 'react'
import { C, PERSO, MONTHS } from '../lib/constants'
import { SheetOverlay } from './SheetOverlay'

export default function SearchSheet({ events, onClose, onDayClick }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    const found = []
    Object.entries(events).forEach(([date, ev]) => {
      // Chercher dans les événements perso
      ;(ev.P || []).forEach(item => {
        const t = PERSO[item.type] || PERSO.autre
        if (
          item.title?.toLowerCase().includes(q) ||
          item.note?.toLowerCase().includes(q)  ||
          t.label.toLowerCase().includes(q)
        ) {
          found.push({ date, item, type: 'perso' })
        }
      })
      // Chercher dans les notes du jour
      if (ev.note?.toLowerCase().includes(q)) {
        found.push({ date, item: { title: ev.note }, type: 'note' })
      }
    })

    // Trier par date
    return found.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 30)
  }, [query, events])

  const formatDate = date => {
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })
  }

  return (
    <SheetOverlay onClose={onClose}>
      <div style={{ padding: '14px 22px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>
          🔍 Recherche
        </div>
        <input
          autoFocus
          placeholder="Running, Dentiste, Anniv…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', padding: '13px 15px', borderRadius: 12,
            background: C.surface2, color: C.text,
            border: `1.5px solid ${C.accent}`, fontSize: 15, outline: 'none',
            boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif",
            boxShadow: '0 0 0 3px rgba(47,129,247,0.15)',
          }}
        />
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '12px 22px' }}>
        {query.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted, fontSize: 14 }}>
            Tape un mot pour chercher dans tes événements
          </div>
        )}

        {query.length > 0 && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔎</div>
            <div style={{ color: C.muted, fontSize: 14 }}>Aucun résultat pour "{query}"</div>
          </div>
        )}

        {results.map((r, i) => {
          const t = r.type === 'perso' ? (PERSO[r.item.type] || PERSO.autre) : null
          return (
            <div
              key={i}
              className="perso-row"
              onClick={() => { onDayClick(r.date); onClose() }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                background: C.surface2, border: `1px solid ${C.border}`,
                cursor: 'pointer', animation: `fadeIn .15s ease ${i * 0.03}s both`,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: t ? t.dim : C.surface3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                {t ? t.emoji : '📝'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.item.title}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {formatDate(r.date)}
                  {r.item.heure && ` · ${r.item.heure}`}
                </div>
              </div>
              {t && (
                <span style={{ fontSize: 11, fontWeight: 700, color: t.bg, background: t.dim, padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>
                  {t.label}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </SheetOverlay>
  )
}
