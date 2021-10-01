// https://www.youtube.com/watch?v=jVfXiv03y5c&ab_channel=GoogleChromeDevelopers
// https://developers.google.com/web/ilt/pwa/introduction-to-service-worker

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
  });

// self.addEventListener('activate', (event) => {
//     // console.log('Clear the cache etc')

// })

// self.addEventListener('install', function(event) {
//     // console.log('Cache the object')
// })


// self.addEventListener('sync', function(event) {
//     if (event.tag  === "foo"){

//     }
// })