import { useState } from 'react'
import { C, MONTHS } from '../lib/constants'
import { SheetOverlay, FieldLabel } from './SheetOverlay'

export default function AnniversairesSheet({ anniversaires, onClose, onAdd, onDelete }) {
  const [name,  setName]  = useState('')
  const [month, setMonth] = useState(1)
  const [day,   setDay]   = useState(1)
  const [emoji, setEmoji] = useState('🎉')
  const [adding, setAdding] = useState(false)

  const inputStyle = {
    padding: '12px 14px', borderRadius: 11,
    background: C.surface2, color: C.text,
    border: `1px solid ${C.border}`, fontSize: 15, outline: 'none',
    fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
  }

  const emojis = ['🎉','🎂','💍','👶','🏆','❤️','⭐','🌟']

  return (
    <SheetOverlay onClose={onClose}>
      <div style={{ padding: '14px 22px 0', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calendrier</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: "'DM Sans',sans-serif", paddingBottom: 14 }}>🎉 Anniversaires & dates</div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '16px 22px' }}>

        {/* Formulaire ajout */}
        <div style={{ background: C.surface2, borderRadius: 14, padding: '14px', marginBottom: 20, border: `1px solid ${C.border}` }}>
          <FieldLabel>Nom</FieldLabel>
          <input
            placeholder="Maman, Anniversaire Vincent…"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ ...inputStyle, width: '100%', marginBottom: 12 }}
          />

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <FieldLabel>Mois</FieldLabel>
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                style={{ ...inputStyle, width: '100%' }}
              >
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div style={{ width: 80 }}>
              <FieldLabel>Jour</FieldLabel>
              <input
                type="number" min={1} max={31}
                value={day}
                onChange={e => setDay(Number(e.target.value))}
                style={{ ...inputStyle, width: '100%', textAlign: 'center' }}
              />
            </div>
          </div>

          <FieldLabel>Emoji</FieldLabel>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {emojis.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  width: 40, height: 40, borderRadius: 10, fontSize: 20,
                  background: emoji === e ? C.accent + '30' : C.surface3,
                  border: emoji === e ? `2px solid ${C.accent}` : `2px solid transparent`,
                  cursor: 'pointer',
                }}
              >
                {e}
              </button>
            ))}
          </div>

          <button
            disabled={!name.trim()}
            onClick={() => { onAdd({ name: name.trim(), month, day, emoji, color: '#FF9F0A' }); setName(''); setAdding(false) }}
            style={{
              width: '100%', padding: '12px',
              background: name.trim() ? 'linear-gradient(135deg, #2F81F7, #7C3AED)' : C.surface3,
              color: '#fff', fontWeight: 700, fontSize: 14, border: 'none',
              borderRadius: 11, cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            ＋ Ajouter
          </button>
        </div>

        {/* Liste */}
        {anniversaires.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.muted, fontSize: 14 }}>
            Aucune date enregistrée
          </div>
        ) : anniversaires.map(a => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12, marginBottom: 8,
            background: C.surface2, border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 24 }}>{a.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{a.name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{MONTHS[a.month - 1]} {a.day}</div>
            </div>
            <button
              onClick={() => onDelete(a.id)}
              style={{ background: C.surface3, border: 'none', color: '#DA3633', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}
            >
              🗑
            </button>
          </div>
        ))}
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
