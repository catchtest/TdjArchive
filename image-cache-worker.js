// Cache only this site's content-versioned images. HTML, scripts and JSON keep
// their normal update behavior; an edited image gets a different URL.
const scope=new URL(self.registration.scope);
const prefix=`tdj-images:${scope.href}:`;
const cacheName=prefix+'v1';
const imageRoot=new URL('assets/images/',scope).pathname;
const pending=new Map();
const limit=256;

self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const name of await caches.keys())if(name.startsWith(prefix)&&name!==cacheName)await caches.delete(name);
 await self.clients.claim();
})()));

async function imageResponse(request){
 const cache=await caches.open(cacheName).catch(()=>null);
 const cached=await cache?.match(request).catch(()=>null);
 if(cached)return cached;
 const response=await fetch(request,{cache:'force-cache'});
 if(cache&&response.ok&&response.type!=='opaque'){
  try{
   await cache.put(request,response.clone());
   const keys=await cache.keys();
   await Promise.all(keys.slice(0,Math.max(0,keys.length-limit)).map(key=>cache.delete(key)));
  }catch{} // Storage restrictions must never prevent an image from displaying.
 }
 return response;
}

self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(imageRoot)
  ||!/^[a-f\d]{12}$/.test(url.searchParams.get('v')||'')
  ||request.headers.has('range'))return;
 if(!pending.has(url.href))pending.set(url.href,imageResponse(request).finally(()=>pending.delete(url.href)));
 event.respondWith(pending.get(url.href).then(response=>response.clone()));
});
