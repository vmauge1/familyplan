// Firebase Messaging Service Worker — généré automatiquement
// Ne pas modifier ce fichier manuellement.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "",
  authDomain:        "",
  projectId:         "",
  messagingSenderId: "",
  appId:             "",
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
