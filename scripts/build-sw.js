/**
 * Génère public/firebase-messaging-sw.js avec les vraies valeurs d'env
 * injectées depuis .env.local (ou les variables d'env Vercel en prod).
 */
import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Charge .env.local si présent (dev local)
const envPath = resolve(__dirname, '../.env.local')
try {
  const raw = readFileSync(envPath, 'utf8')
  raw.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  })
} catch { /* pas de .env.local en prod → les vars viennent de Vercel */ }

const {
  VITE_FIREBASE_API_KEY            = '',
  VITE_FIREBASE_AUTH_DOMAIN        = '',
  VITE_FIREBASE_PROJECT_ID         = '',
  VITE_FIREBASE_MESSAGING_SENDER_ID= '',
  VITE_FIREBASE_APP_ID             = '',
} = process.env

const sw = `// Firebase Messaging Service Worker — généré automatiquement
// Ne pas modifier ce fichier manuellement.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "${VITE_FIREBASE_API_KEY}",
  authDomain:        "${VITE_FIREBASE_AUTH_DOMAIN}",
  projectId:         "${VITE_FIREBASE_PROJECT_ID}",
  messagingSenderId: "${VITE_FIREBASE_MESSAGING_SENDER_ID}",
  appId:             "${VITE_FIREBASE_APP_ID}",
});

const messaging = firebase.messaging();

// Notification reçue quand l'app est en arrière-plan
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'FamilyPlan', {
    body:  body  ?? '',
    icon:  icon  ?? '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: payload.data,
  });
});

// Clic sur la notification → ouvre l'app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
`

writeFileSync(resolve(__dirname, '../public/firebase-messaging-sw.js'), sw)
console.log('[build-sw] ✓ firebase-messaging-sw.js généré')
