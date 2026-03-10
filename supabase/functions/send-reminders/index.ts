import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Même helper JWT que notify-partner ───────────────────────────────────
async function getGoogleAccessToken(sa: Record<string, string>): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const header  = encode({ alg:'RS256', typ:'JWT' })
  const payload = encode({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })
  const signingInput = `${header}.${payload}`
  const pem     = sa.private_key.replace(/\\n/g, '\n')
  const keyBody = pem.replace(/-----[^-]+-----/g,'').replace(/\s/g,'')
  const binary  = Uint8Array.from(atob(keyBody), c => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binary,
    { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' },
    false, ['sign'],
  )
  const sig    = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const jwt = `${signingInput}.${sigB64}`
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion:jwt }),
  })
  const { access_token } = await res.json()
  return access_token
}

async function sendFCM(token: string, title: string, body: string, projectId: string, accessToken: string) {
  await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        webpush: { notification: { title, body, icon:'/icon-192.svg', badge:'/icon-192.svg', vibrate:[200,100,200] } },
      },
    }),
  })
}

// ── Handler ───────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Heure Paris (UTC+1 hiver, UTC+2 été)
    const nowParis  = new Date(new Date().toLocaleString('en-US', { timeZone:'Europe/Paris' }))
    const hourParis = nowParis.getHours()
    const isMorning = hourParis < 12 // job 8h → rappels du jour J

    // Date cible : aujourd'hui (matin) ou demain (soir)
    const target = new Date(nowParis)
    if (!isMorning) target.setDate(target.getDate() + 1)
    const targetKey = `${target.getFullYear()}-${String(target.getMonth()+1).padStart(2,'0')}-${String(target.getDate()).padStart(2,'0')}`

    // Récupérer les événements de ce jour
    const { data: rows } = await supabase
      .from('calendar_events')
      .select('perso')
      .eq('date', targetKey)

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ ok: true, skipped: 'no events' }), { headers: corsHeaders })
    }

    // Filtrer les événements avec rappel activé et une heure définie
    const events = (rows[0].perso ?? []).filter((ev: Record<string, unknown>) =>
      ev.rappel !== false && ev.heure
    )

    if (events.length === 0) {
      return new Response(JSON.stringify({ ok: true, skipped: 'no reminders' }), { headers: corsHeaders })
    }

    // Récupérer tous les tokens FCM
    const { data: tokens } = await supabase.from('push_tokens').select('token')
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ ok: true, skipped: 'no tokens' }), { headers: corsHeaders })
    }

    const sa          = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!)
    const accessToken = await getGoogleAccessToken(sa)
    const projectId   = sa.project_id

    // Envoyer une notification par événement
    for (const ev of events) {
      const heure = ev.heure as string
      const titre = (ev.title as string) || '(sans titre)'

      // Déterminer le message selon matin ou veille
      let notifTitle: string
      let notifBody: string

      if (isMorning) {
        // Comparer l'heure de l'événement pour savoir si c'est matin ou soir
        const [h] = heure.replace('h',':').split(':').map(Number)
        notifTitle = h < 14 ? '⏰ Ce matin' : '⏰ Ce soir'
        notifBody  = `${titre} à ${heure}`
      } else {
        notifTitle = '📅 Demain'
        notifBody  = `${titre} à ${heure}`
      }

      await Promise.all(tokens.map(({ token }: { token: string }) =>
        sendFCM(token, notifTitle, notifBody, projectId, accessToken)
      ))
    }

    return new Response(JSON.stringify({ ok: true, sent: events.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
