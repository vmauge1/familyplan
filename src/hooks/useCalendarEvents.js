import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SEED } from '../lib/seed'

/**
 * Syncs calendar events with Supabase.
 * Falls back to SEED data when Supabase is not configured.
 *
 * Supabase table expected:
 *   calendar_events (
 *     id uuid primary key default gen_random_uuid(),
 *     date text not null unique,          -- 'YYYY-MM-DD'
 *     vincent_work text,
 *     marie_work text,
 *     perso jsonb default '[]'
 *   )
 */
export function useCalendarEvents() {
  const [events, setEvents] = useState(SEED)
  const [synced, setSynced] = useState(false)

  // Initial load
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')

      if (error || !data) return // stay on SEED

      if (data.length > 0) {
        const map = {}
        data.forEach(row => {
          map[row.date] = {
            V: row.vincent_work,
            F: row.marie_work,
            P: row.perso || [],
          }
        })
        setEvents(map)
      }
      setSynced(true)
    }
    load()
  }, [])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('calendar_events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, payload => {
        if (payload.eventType === 'DELETE') {
          setEvents(prev => {
            const next = { ...prev }
            delete next[payload.old.date]
            return next
          })
        } else {
          const row = payload.new
          setEvents(prev => ({
            ...prev,
            [row.date]: { V: row.vincent_work, F: row.marie_work, P: row.perso || [] },
          }))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function saveDay(date, data) {
    // Optimistic update
    setEvents(prev => ({ ...prev, [date]: data }))

    await supabase
      .from('calendar_events')
      .upsert({
        date,
        vincent_work: data.V,
        marie_work:   data.F,
        perso:        data.P,
      }, { onConflict: 'date' })
  }

  return { events, saveDay, synced }
}
