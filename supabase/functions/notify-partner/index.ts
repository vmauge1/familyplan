import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Génère un access token Google OAuth2 depuis un service account ────────
async function getGoogleAccessToken(sa: Record<string, string>): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const header  = encode({ alg: 'RS256', typ: 'JWT' })
  const payload = encode({
    iss:   sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  })

  const signingInput = `${header}.${payload}`

  const pem     = sa.private_key.replace(/\\n/g, '\n')
  const keyBody = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')
  const binary  = Uint8Array.from(atob(keyBody), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign'],
  )

  const sig    = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const jwt = `${signingInput}.${sigB64}`

  const res  = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  })
  const { access_token } = await res.json()
  return access_token
}

// ── Handler principal ─────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { senderId, senderName, date, type, title } = await req.json()

    // Client Supabase avec la clé service_role (accès complet)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Récupérer le token FCM de l'AUTRE utilisateur
    const { data: tokens } = await supabase
      .from('push_tokens')
      .select('token')
      .neq('user_id', senderId)

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ skipped: 'no partner token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Construire le message de notification
    const d = new Date(date + 'T00:00:00')
    const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

    const notifTitle = 'FamilyPlan 📅'
    const notifBody  = type === 'work'
      ? `${senderName} a modifié le planning du ${dateStr}`
      : `${senderName} a ajouté "${title}" le ${dateStr}`

    // Service account Firebase (stocké comme secret Supabase)
    const sa = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!)

    const accessToken = await getGoogleAccessToken(sa)
    const projectId   = sa.project_id

    // Envoyer à chaque token FCM
    await Promise.all(tokens.map(({ token }: { token: string }) =>
      fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          message: {
            token,
            notification: { title: notifTitle, body: notifBody },
            webpush: {
              notification: {
                title: notifTitle,
                body:  notifBody,
                icon:  '/icon-192.svg',
                badge: '/icon-192.svg',
              },
            },
          },
        }),
      })
    ))

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
