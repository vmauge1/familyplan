import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SEED } from '../lib/seed'

export function useCalendarEvents() {
  const [events, setEvents] = useState(SEED)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('calendar_events').select('*')
      if (error || !data) return
      if (data.length > 0) {
        const map = {}
        data.forEach(row => {
          map[row.date] = {
            V:    row.vincent_work,
            F:    row.marie_work,
            P:    row.perso    || [],
            note: row.day_note || '',
          }
        })
        setEvents(map)
      }
      setSynced(true)
    }
    load()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('calendar_events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, payload => {
        if (payload.eventType === 'DELETE') {
          setEvents(prev => { const next = { ...prev }; delete next[payload.old.date]; return next })
        } else {
          const row = payload.new
          setEvents(prev => ({
            ...prev,
            [row.date]: { V: row.vincent_work, F: row.marie_work, P: row.perso || [], note: row.day_note || '' },
          }))
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function saveDay(date, data) {
    setEvents(prev => ({ ...prev, [date]: data }))
    await supabase.from('calendar_events').upsert({
      date,
      vincent_work: data.V,
      marie_work:   data.F,
      perso:        data.P,
      day_note:     data.note || null,
    }, { onConflict: 'date' })
  }

  return { events, saveDay, synced }
}
