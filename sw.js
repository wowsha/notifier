// sw.js
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data;

    self.registration.showNotification(title, {
      body: body,
      tag: 'custom-notif',     // replaces previous notification
      data: { url: url },      // stores the website to open
      vibrate: [200, 100, 200]
      // NO icon, NO badge (as requested)
    });
  }
});

// When user clicks the notification
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || 'https://example.com';

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
