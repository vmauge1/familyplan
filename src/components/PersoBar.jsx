import { C, PERSO } from '../lib/constants'

export default function PersoBar({ items, onClick }) {
  const has = items && items.length > 0
  return (
    <div
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        height: 18, borderRadius: 5, cursor: 'pointer',
        background: has ? 'transparent' : C.surface2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
        padding: '0 3px', transition: 'background .15s',
      }}
    >
      {!has && <div style={{ width: 12, height: 1.5, background: C.surface3, borderRadius: 2 }} />}
      {has && items.slice(0, 4).map((ev, i) => {
        const t = PERSO[ev.type] || PERSO.autre
        return <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: t.bg, flexShrink: 0 }} />
      })}
      {has && items.length > 4 && (
        <span style={{ fontSize: 7, fontWeight: 700, color: C.muted }}>+{items.length - 4}</span>
      )}
    </div>
  )
}
