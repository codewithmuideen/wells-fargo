const CACHE_NAME = "wells-fargo-v1";
const OFFLINE_URL = "/";

const PRECACHE_URLS = [
  "/",
  "/login",
  "/dashboard",
  "/favicon_2.png",
  "/well_logo.png",
  "/wf_logo_white.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r || new Response("Offline"))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (
          response.ok &&
          event.request.url.startsWith(self.location.origin) &&
          (event.request.url.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff2?)$/) ||
            event.request.url.includes("/_next/static/"))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "Wells Fargo", body: "You have a new notification." };
  try {
    if (event.data) data = event.data.json();
  } catch {
    // use default
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon_2.png",
      badge: "/favicon_2.png",
      vibrate: [200, 100, 200],
      tag: data.tag || "wells-fargo-notification",
      data: { url: data.url || "/dashboard" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
