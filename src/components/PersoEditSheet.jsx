import { useState } from 'react'
import { C, PERSO } from '../lib/constants'
import { SheetOverlay, SheetHeader, FieldLabel } from './SheetOverlay'

let _id = 200
const uid = () => _id++

export default function PersoEditSheet({ date, item, onClose, onSave }) {
  const isNew = !item
  const [type,  setType]  = useState(item?.type  || null)
  const [title, setTitle] = useState(item?.title || '')
  const [heure, setHeure] = useState(item?.heure || '')
  const [note,  setNote]  = useState(item?.note  || '')
  const [who,    setWho]    = useState(item?.who    || 'tous')
  const [rappel, setRappel] = useState(item?.rappel !== false)

  const d = new Date(date + 'T00:00:00')
  const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const accent = type ? (PERSO[type]?.bg ?? C.accent) : C.accent

  const inputStyle = {
    width: '100%', padding: '13px 15px', borderRadius: 11,
    background: C.surface2, color: C.text,
    border: `1px solid ${C.border}`, fontSize: 15, outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif",
    transition: 'border .15s',
  }

  return (
    <SheetOverlay onClose={onClose} zIndex={70}>
      <SheetHeader dateStr={dateStr} title={isNew ? 'Nouvel événement' : 'Modifier'} />

      <div style={{ overflowY: 'auto', padding: '20px 22px 0' }}>
        {/* Catégorie */}
        <FieldLabel>Catégorie</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
          {Object.entries(PERSO).map(([key, t]) => (
            <button
              key={key}
              className="chip-btn"
              onClick={() => setType(type === key ? null : key)}
              style={{
                padding: '12px 6px', borderRadius: 13,
                background: type === key ? t.dim : C.surface2,
                border: type === key ? `2px solid ${t.bg}` : `2px solid ${C.border}`,
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                transition: 'all .12s',
              }}
            >
              <span style={{ fontSize: 24 }}>{t.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: type === key ? t.bg : C.muted, fontFamily: "'DM Sans',sans-serif" }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <FieldLabel>Titre</FieldLabel>
        <input
          placeholder="Dentiste Dr Martin, Anniversaire…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ ...inputStyle, marginBottom: 14 }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e  => e.target.style.borderColor = C.border}
        />

        <FieldLabel>Heure (optionnel)</FieldLabel>
        <input
          placeholder="14h30"
          value={heure}
          onChange={e => setHeure(e.target.value)}
          style={{ ...inputStyle, marginBottom: 14 }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e  => e.target.style.borderColor = C.border}
        />

        <FieldLabel>Note (optionnel)</FieldLabel>
        <textarea
          placeholder="Carte vitale, réservation faite…"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'none', marginBottom: 18 }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e  => e.target.style.borderColor = C.border}
        />

        {/* Toggle rappel */}
        <div
          onClick={() => setRappel(r => !r)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 12, marginBottom: 18,
            background: C.surface2, border: `1px solid ${rappel ? C.accent : C.border}`,
            cursor: 'pointer', transition: 'border .15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>
                Me rappeler
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>
                Veille à 20h · Jour J à 8h
              </div>
            </div>
          </div>
          {/* Toggle pill */}
          <div style={{
            width: 44, height: 26, borderRadius: 13,
            background: rappel ? C.accent : C.surface3,
            position: 'relative', transition: 'background .2s', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: rappel ? 21 : 3,
              width: 20, height: 20, borderRadius: '50%',
              background: '#fff', transition: 'left .2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
          </div>
        </div>

        <FieldLabel>Pour qui ?</FieldLabel>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[
            { v: 'tous',    l: '👥 Tous'    },
            { v: 'Vincent', l: '🧑 Vincent' },
            { v: 'Marie',   l: '👩 Marie'   },
          ].map(({ v, l }) => (
            <button
              key={v}
              className="chip-btn"
              onClick={() => setWho(v)}
              style={{
                flex: 1, padding: '11px 6px', borderRadius: 11,
                background: who === v ? C.accent : C.surface2,
                color: who === v ? '#fff' : C.muted,
                fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif",
                outline: who === v ? `2px solid ${C.accent}` : 'none', outlineOffset: 2,
                transition: 'all .12s',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 22px 36px', flexShrink: 0, display: 'flex', gap: 10 }}>
        <button
          onClick={onClose}
          style={{ flex: 1, padding: '14px', background: C.surface2, color: C.muted, fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
        >
          Annuler
        </button>
        <button
          onClick={() => onSave({ id: item?.id || uid(), type: type || 'autre', title, heure, note, who, rappel })}
          style={{
            flex: 2, padding: '14px', background: accent,
            color: '#fff', fontWeight: 800, fontSize: 15, border: 'none',
            borderRadius: 14, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {isNew ? 'Ajouter' : 'Enregistrer'}
        </button>
      </div>
    </SheetOverlay>
  )
}
