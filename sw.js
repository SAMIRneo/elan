const CACHE="elan-v23";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  // Network-first pour la page, retombe sur le cache si la réponse n'est pas ok (502 inclus)
  if(e.request.mode==="navigate"||e.request.url.endsWith(".html")){
    // cache:no-store évite les 304 conditionnels qui déclencheraient un retour
    // au cache et masqueraient une nouvelle version de la page
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{if(!res.ok)throw new Error("offline");const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{
    const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res
  }).catch(()=>caches.match("./index.html"))));
});
self.addEventListener("message",e=>{if(e.data==="skipWaiting")self.skipWaiting()});
