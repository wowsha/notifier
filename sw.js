self.addEventListener('install', (event) => {
  // Forces the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Allows the service worker to start controlling the page immediately
  event.waitUntil(clients.claim());
});

// Listen for messages from the main website
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data;
    
    const options = {
      body: body,
      data: { url: url }, // Attach the URL to the notification data
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: 'live-ping-notif' // Using a tag prevents notification stacking
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// Handle the click event on the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let targetUrl = event.notification.data?.url || 'https://google.com';

  // FIX: Ensure the URL is absolute. 
  // If the user typed "google.com", we turn it into "https://google.com" 
  // so it doesn't try to open your-site.com/google.com (which causes the 404).
  if (targetUrl && !targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if a tab with this URL is already open
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If no open tab is found, open a brand
