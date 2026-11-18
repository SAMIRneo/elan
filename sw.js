const CACHE="elan-v40";
const CRITICAL=["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png"];
const OPTIONAL=[
  "./assets/cos-flame-gold.jpg","./assets/cos-flame-ice.jpg","./assets/cos-flame-rainbow.jpg",
  "./assets/cos-title-pr.jpg","./assets/cos-title-streak.jpg","./assets/cos-title-olympe.jpg",
  "./assets/cos-frame-gold.jpg","./assets/cos-frame-laurel.jpg","./assets/cos-frame-volt.jpg",
  "./assets/cos-banner-stade.jpg","./assets/cos-banner-temple.jpg","./assets/cos-banner-neon.jpg",
  "./assets/cos-avatar-1.jpg","./assets/cos-avatar-2.jpg","./assets/cos-avatar-3.jpg","./assets/laurel-gold.svg"
];
self.addEventListener("install",e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    // les ressources critiques sont obligatoires, les images sont tolérantes aux erreurs
    await Promise.allSettled([...CRITICAL,...OPTIONAL].map(u=>c.add(u)));
    await c.addAll(CRITICAL);
    self.skipWaiting();
  })());
});
self.addEventListener("activate",e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith("elan-")&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return; // jamais de cache cross-origin
  const isNav=req.mode==="navigate"||url.pathname.endsWith(".html");
  if(isNav){
    // network-first avec cache:no-store pour éviter les 304 masquant une nouvelle version
    e.respondWith(fetch(req,{cache:"no-store"}).then(async res=>{
      if(!res.ok)throw new Error("offline");
      const copy=res.clone(),c=await caches.open(CACHE);
      await c.put("./index.html",copy);
      return res;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  // assets : cache immédiat + revalidation silencieuse en tâche de fond
  e.respondWith((async()=>{
    const cached=await caches.match(req);
    if(cached){
      fetch(req).then(async res=>{
        if(res.ok){const c=await caches.open(CACHE);await c.put(req,res.clone())}
      }).catch(()=>{});
      return cached;
    }
    try{
      const res=await fetch(req);
      if(res.ok){const c=await caches.open(CACHE);await c.put(req,res.clone())}
      return res;
    }catch{
      // pas de fallback HTML pour un asset : on échoue proprement
      return new Response("",{status:504,statusText:"Asset indisponible hors ligne"});
    }
  })());
});
self.addEventListener("message",e=>{if(e.data==="skipWaiting")self.skipWaiting()});
