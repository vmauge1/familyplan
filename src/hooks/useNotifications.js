import { useEffect } from 'react'
import { messaging, getToken, onMessage, VAPID_KEY } from '../lib/firebase'
import { supabase } from '../lib/supabase'

/**
 * Demande la permission de notification, récupère le token FCM
 * et le sauvegarde dans la table push_tokens de Supabase.
 */
export function useNotifications(user) {
  useEffect(() => {
    if (!user) return
    if (!VAPID_KEY || VAPID_KEY === '') return // Firebase pas encore configuré

    async function init() {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          ),
        })

        if (!token) return

        // Sauvegarder le token en base
        await supabase.from('push_tokens').upsert(
          { user_id: user.id, token, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      } catch (err) {
        // Notifications refusées ou Firebase non configuré → pas bloquant
        console.warn('[FCM] init skipped:', err.message)
      }
    }

    init()

    // Notification reçue quand l'app est au premier plan
    const unsub = onMessage(messaging, payload => {
      const { title, body } = payload.notification ?? {}
      if (Notification.permission === 'granted') {
        new Notification(title ?? 'FamilyPlan', { body, icon: '/icon-192.png' })
      }
    })

    return unsub
  }, [user])
}

/**
 * Envoie une notification via la Supabase Edge Function.
 */
export async function notifyPartner({ senderId, senderName, date, type, title }) {
  try {
    await supabase.functions.invoke('notify-partner', {
      body: { senderId, senderName, date, type, title },
    })
  } catch (err) {
    console.warn('[FCM] notify skipped:', err.message)
  }
}
