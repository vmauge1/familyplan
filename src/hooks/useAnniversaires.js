import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAnniversaires() {
  const [anniversaires, setAnniversaires] = useState([])

  useEffect(() => {
    supabase.from('anniversaires').select('*').order('month').then(({ data }) => {
      if (data) setAnniversaires(data)
    })
  }, [])

  async function add(item) {
    const { data } = await supabase.from('anniversaires').insert(item).select().single()
    if (data) setAnniversaires(prev => [...prev, data])
  }

  async function remove(id) {
    await supabase.from('anniversaires').delete().eq('id', id)
    setAnniversaires(prev => prev.filter(a => a.id !== id))
  }

  // Retourne les anniversaires d'un jour donné (YYYY-MM-DD)
  function forDay(dateKey) {
    const [, m, d] = dateKey.split('-').map(Number)
    return anniversaires.filter(a => a.month === m && a.day === d)
  }

  return { anniversaires, add, remove, forDay }
}
