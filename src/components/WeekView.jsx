import { C, WORK, PERSO, DAYS_S, toKey } from '../lib/constants'
import WorkPill from './WorkPill'

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export default function WeekView({ weekStart, events, onWork, onPerso }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {days.map((date, i) => {
        const key      = toKey(date.getFullYear(), date.getMonth(), date.getDate())
        const ev       = events[key] || {}
        const isToday  = date.getTime() === today.getTime()
        const isWeekend = i >= 5
        const persoItems = ev.P || []

        return (
          <div
            key={key}
            style={{
              borderRadius: 14,
              background: isToday ? 'rgba(47,129,247,0.08)' : C.surface,
              border: isToday ? `1.5px solid ${C.accent}` : `1.5px solid ${C.border}`,
              overflow: 'hidden',
            }}
          >
            {/* ── En-tête du jour ── */}
            <div
              onClick={() => onWork(key, ev)}
              className="day-cell"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', cursor: 'pointer',
              }}
            >
              {/* Numéro + nom du jour */}
              <div style={{ width: 38, flexShrink: 0, textAlign: 'center' }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  color: isWeekend ? C.muted : C.muted, letterSpacing: '0.06em',
                }}>
                  {DAYS_S[i]}
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 800, lineHeight: 1,
                  color: isToday ? C.accent : isWeekend ? C.muted : C.text,
                }}>
                  {date.getDate()}
                </div>
              </div>

              {/* Pills travail */}
              <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', marginBottom: 3 }}>V</div>
                  <WorkPill code={ev.V || null} size="sm" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', marginBottom: 3 }}>M</div>
                  <WorkPill code={ev.F || null} size="sm" />
                </div>
              </div>

              {/* Chevron */}
              <div style={{ color: C.surface3, fontSize: 16, flexShrink: 0 }}>›</div>
            </div>

            {/* ── Événements perso ── */}
            {persoItems.length > 0 && (
              <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {persoItems.map((item, j) => {
                  const t = PERSO[item.type] || PERSO.autre
                  return (
                    <div
                      key={item.id || j}
                      onClick={() => onPerso(key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        cursor: 'pointer', padding: '4px 6px', borderRadius: 8,
                        transition: 'background .12s',
                      }}
                      className="perso-row"
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: t.dim, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 14, flexShrink: 0,
                      }}>
                        {t.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title || t.label}
                        </div>
                        {item.heure && (
                          <div style={{ fontSize: 11, color: C.muted }}>🕐 {item.heure}</div>
                        )}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: t.bg, background: t.dim, padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>
                        {t.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Ajouter un événement ── */}
            {persoItems.length === 0 && (
              <div
                onClick={() => onPerso(key)}
                style={{
                  borderTop: `1px solid ${C.border}`,
                  padding: '7px 14px',
                  fontSize: 12, color: C.surface3,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}
                className="perso-row"
              >
                <span style={{ fontSize: 14 }}>＋</span> Ajouter un événement
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { getMonday }
