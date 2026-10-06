const PREFIX='table-for-two-'+encodeURIComponent(new URL(self.registration.scope).pathname)+'-';
const CACHE=PREFIX+'v1.0.1';
const ASSETS=['./','./index.html','./style.css','./game.css','./app.js','./rules.js','./favicon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const urls=ASSETS.map(path=>new URL(path,self.registration.scope).href);
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);for(const url of urls){const response=await fetch(new Request(url,{cache:'reload',credentials:'same-origin'}));if(!response.ok||response.redirected)throw Error('App assets not ready');await cache.put(url,response)}})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim()})())});
self.addEventListener('message',event=>{if(event.data==='CACHE_STATUS')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const ready=(await Promise.all(urls.map(url=>cache.match(url)))).every(Boolean);event.ports[0]?.postMessage(ready?'CACHE_READY':'CACHE_INCOMPLETE')})())});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);url.search='';url.hash='';if(!urls.includes(url.href))return;event.respondWith((async()=>{const cached=await(await caches.open(CACHE)).match(url.href);return cached||fetch(event.request)})())});
