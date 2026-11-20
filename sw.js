// Mette in cache l'app e il modello: dopo la prima apertura funziona anche senza rete.
const CACHE = 'colori-live-v1';
const FILES = [
  './', 'index.html', 'manifest.json',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'mp/pose.js', 'mp/pose_solution_packed_assets_loader.js', 'mp/pose_solution_packed_assets.data',
  'mp/pose_solution_simd_wasm_bin.js', 'mp/pose_solution_simd_wasm_bin.wasm',
  'mp/pose_solution_wasm_bin.js', 'mp/pose_solution_wasm_bin.wasm',
  'mp/pose_web.binarypb', 'mp/pose_landmark_lite.tflite'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
});
