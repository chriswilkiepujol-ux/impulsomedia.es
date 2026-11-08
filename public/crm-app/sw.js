// ImpulsoMedia CRM service worker: push notifications + opening the right screen when one is tapped.
// No offline caching of data on purpose: the CRM always shows live numbers.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('push', event => {
  let d = {}
  try { d = event.data ? event.data.json() : {} } catch { d = { title: 'ImpulsoMedia CRM', body: event.data ? event.data.text() : '' } }
  event.waitUntil(self.registration.showNotification(d.title || 'ImpulsoMedia CRM', {
    body: d.body || '',
    icon: '/crm-app/icons/icon-192.png',
    badge: '/crm-app/icons/badge-96.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { url: d.url || '/' },
  }))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const c of all) {
      if (new URL(c.url).origin === self.location.origin) { await c.focus(); c.postMessage({ type: 'open', url }); return }
    }
    await self.clients.openWindow(url)
  })())
})

