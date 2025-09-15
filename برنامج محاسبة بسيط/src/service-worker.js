self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('mohasaba-cache').then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './script.js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
        'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
        'https://cdn-icons-png.flaticon.com/512/2920/2920257.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
