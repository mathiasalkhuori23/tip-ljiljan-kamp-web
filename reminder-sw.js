self.addEventListener('push', event => {
  if (!event.data) return;
  const {title, body, tag, url} = event.data.json();
  event.waitUntil(self.registration.showNotification(title, {
    body, tag, data: {url}, icon: new URL('ljiljan-icon-192.png', self.registration.scope).href
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const scope = self.registration.scope;
  const requested = new URL(event.notification.data.url, scope).href;
  event.waitUntil(self.clients.openWindow(requested.startsWith(scope) ? requested : scope));
});
