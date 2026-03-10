import { useState, useEffect } from 'react'
import { C, WORK, PERSO, MONTHS, DAYS_S, toKey, daysInMonth, firstDayOfWeek } from './lib/constants'
import { useCalendarEvents } from './hooks/useCalendarEvents'
import { useNotifications, notifyPartner } from './hooks/useNotifications'
import DayCell        from './components/DayCell'
import WorkSheet      from './components/WorkSheet'
import PersoListSheet from './components/PersoListSheet'
import PersoEditSheet from './components/PersoEditSheet'

export default function FamilyPlan({ user, onSignOut }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [time,  setTime]  = useState(new Date())
  const [toast, setToast] = useState(null)

  const [workSheet,  setWork]  = useState(null)  // { date, ev }
  const [persoSheet, setPerso] = useState(null)  // { date, mode:'list'|'edit', editItem }

  const { events, saveDay, synced } = useCalendarEvents()
  useNotifications(user)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const senderName = user?.email?.split('@')[0] ?? 'Quelqu\'un'

  const handleWorkSave = (date, data) => {
    saveDay(date, data)
    showToast('Planning mis à jour ✓')
    notifyPartner({ senderId: user?.id, senderName, date, type: 'work', title: '' })
  }

  const handleAdd = (date, item) => {
    const cur = events[date] || { V: null, F: null, P: [] }
    saveDay(date, { ...cur, P: [...(cur.P || []), item] })
    showToast('Événement ajouté ✓')
    notifyPartner({ senderId: user?.id, senderName, date, type: 'perso', title: item.title })
  }

  const handleEdit = (date, item) => {
    const cur = events[date] || {}
    saveDay(date, { ...cur, P: (cur.P || []).map(e => e.id === item.id ? item : e) })
    showToast('Événement modifié ✓')
    notifyPartner({ senderId: user?.id, senderName, date, type: 'perso', title: item.title })
  }

  const handleDel = (date, id) => {
    const cur = events[date] || {}
    saveDay(date, { ...cur, P: (cur.P || []).filter(e => e.id !== id) })
    showToast('Événement supprimé')
  }

  // Calendar grid
  const n  = daysInMonth(year, month)
  const fd = firstDayOfWeek(year, month)
  const cells = [...Array(fd).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday = d =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const persoItems = persoSheet ? (events[persoSheet.date]?.P || []) : []

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans',sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(30,37,46,0.97)', color: C.text,
          padding: '11px 20px', borderRadius: 30, fontWeight: 600, fontSize: 13,
          zIndex: 300, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 .5px rgba(255,255,255,0.08)',
          animation: 'toastIn .25s ease both',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3FB950', animation: 'pulse 1.4s infinite' }} />
          {toast}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: 430, padding: '0 14px 48px' }}>

        {/* ── Status bar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 4px 0', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'DM Mono',monospace" }}>
            {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: synced ? '#3FB950' : '#E3B341', animation: 'pulse 1.4s infinite' }} />
              <span style={{ fontSize: 11, color: synced ? '#3FB950' : '#E3B341', fontWeight: 600, letterSpacing: '0.04em' }}>
                {synced ? 'Synced' : 'Demo'}
              </span>
            </div>
            <button
              onClick={onSignOut}
              title="Se déconnecter"
              style={{ background: 'none', border: 'none', color: C.muted, fontSize: 16, cursor: 'pointer', padding: '2px 4px' }}
            >
              ⎋
            </button>
          </div>
        </div>

        {/* ── Month nav ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 16px' }}>
          <button onClick={prev} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 22, cursor: 'pointer', padding: '4px 8px' }}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px', fontFamily: "'DM Sans',sans-serif" }}>
              {MONTHS[month]}
            </div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 3 }}>
              {year}
            </div>
          </div>
          <button onClick={next} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 22, cursor: 'pointer', padding: '4px 8px' }}>›</button>
        </div>

        {/* ── User badges ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, padding: '0 2px' }}>
          {[
            { init: 'V', name: 'Vincent', color: '#2F81F7' },
            { init: 'M', name: 'Marie',   color: '#E3B341' },
          ].map(u => (
            <div key={u.init} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px 6px 6px', background: C.surface, borderRadius: 30, border: `1px solid ${C.border}` }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#0D1117' }}>
                {u.init}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{u.name}</span>
            </div>
          ))}
        </div>

        {/* ── Day headers ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 8, padding: '0 1px' }}>
          {DAYS_S.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: C.muted }}>
              {d}
            </div>
          ))}
        </div>

        {/* ── Calendar grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />
            const key = toKey(year, month, day)
            const ev  = events[key] || {}
            const dow = (fd + day - 1) % 7
            return (
              <DayCell
                key={key}
                day={day}
                ev={ev}
                isToday={isToday(day)}
                isWeekend={dow >= 5}
                onWork={() => setWork({ date: key, ev })}
                onPerso={() => setPerso({ date: key, mode: 'list', editItem: null })}
              />
            )
          })}
        </div>

        {/* ── Legend ── */}
        <div style={{ marginTop: 24, background: C.surface, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
            Planning travail
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {Object.entries(WORK).map(([k, t]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: t.bg, borderRadius: 8, border: t.border ? `1px solid ${t.border}` : 'none' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.text === '#fff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{t.short} — {t.label}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
            Événements perso
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {Object.entries(PERSO).map(([k, t]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: t.dim, borderRadius: 8, border: `1px solid ${t.bg}40` }}>
                <span style={{ fontSize: 12 }}>{t.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: t.bg }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sheets ── */}
      {workSheet && (
        <WorkSheet
          date={workSheet.date}
          ev={workSheet.ev}
          onClose={() => setWork(null)}
          onSave={handleWorkSave}
        />
      )}

      {persoSheet?.mode === 'list' && (
        <PersoListSheet
          date={persoSheet.date}
          items={persoItems}
          onClose={() => setPerso(null)}
          onAdd={() => setPerso(s => ({ ...s, mode: 'edit', editItem: null }))}
          onEdit={item => setPerso(s => ({ ...s, mode: 'edit', editItem: item }))}
          onDelete={id => handleDel(persoSheet.date, id)}
        />
      )}

      {persoSheet?.mode === 'edit' && (
        <PersoEditSheet
          date={persoSheet.date}
          item={persoSheet.editItem}
          onClose={() => setPerso(s => ({ ...s, mode: 'list', editItem: null }))}
          onSave={item => {
            persoSheet.editItem
              ? handleEdit(persoSheet.date, item)
              : handleAdd(persoSheet.date, item)
            setPerso(s => ({ ...s, mode: 'list', editItem: null }))
          }}
        />
      )}
    </div>
  )
}
