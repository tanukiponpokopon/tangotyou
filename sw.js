"use strict";

const CACHE_PREFIX = "gogen-vocab-pwa-";
const CACHE_NAME = CACHE_PREFIX + "2026-07-16-1";
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./favicon-32.png",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./icon-maskable-1024.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable().catch(() => {});
    }
    await self.clients.claim();
  })());
});

async function cacheResponse(request, response) {
  if (!response || !response.ok || response.type === "opaque") return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function navigate(request, preloadResponse) {
  try {
    const response = await preloadResponse || await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    if (response && response.ok) await cache.put("./index.html", response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match("./index.html", { ignoreSearch: true });
    if (cached) return cached;
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(navigate(request, event.preloadResponse));
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: false });
    if (cached) return cached;
    try {
      return await cacheResponse(request, await fetch(request));
    } catch (error) {
      return new Response("", { status: 504, statusText: "Offline" });
    }
  })());
});
