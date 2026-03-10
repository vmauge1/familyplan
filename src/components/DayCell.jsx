import { C } from '../lib/constants'
import WorkPill from './WorkPill'
import PersoBar from './PersoBar'

export default function DayCell({ day, ev, isToday, isWeekend, onWork, onPerso, anniversaires = [] }) {
  const hasNote = ev?.note && ev.note.trim().length > 0
  const hasAnniv = anniversaires.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      {/* Work zone */}
      <div
        className="day-cell"
        onClick={onWork}
        style={{
          borderRadius: 10, padding: '7px 5px 5px',
          background: isToday ? 'rgba(47,129,247,0.12)' : C.surface,
          border: isToday ? `1.5px solid ${C.accent}` : `1.5px solid ${C.border}`,
          cursor: 'pointer', transition: 'background .15s',
          display: 'flex', flexDirection: 'column', gap: 4,
          position: 'relative',
        }}
      >
        {/* Indicateur anniversaire */}
        {hasAnniv && (
          <div style={{
            position: 'absolute', top: 3, right: 3,
            fontSize: 7, lineHeight: 1,
          }}>
            {anniversaires[0].emoji}
          </div>
        )}

        <div style={{
          textAlign: 'center', fontFamily: "'DM Sans',sans-serif",
          fontSize: 13, fontWeight: isToday ? 800 : 500,
          color: isToday ? C.accent : isWeekend ? C.muted : C.text,
          lineHeight: 1,
        }}>{day}</div>
        <WorkPill code={ev?.V || null} size="sm" />
        <WorkPill code={ev?.F || null} size="sm" />

        {/* Indicateur note */}
        {hasNote && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#E3B341' }} />
          </div>
        )}
      </div>

      {/* Perso zone */}
      <PersoBar items={ev?.P || []} onClick={onPerso} />
    </div>
  )
}
