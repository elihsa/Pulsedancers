let mapsCfg=null,mapsDM=null,baseLoc=null;
async function loadBookingCfg(){const d=await fetch('/data/booking.json',{cache:'no-store'}).then(r=>r.json());mapsCfg=d;return d;}
function geocodePlace(geocoder,address){return new Promise((resolve,reject)=>{geocoder.geocode({address},(res,status)=>{if(status==='OK'&&res&&res[0])resolve(res[0].geometry.location);else reject(status);});});}
function calcDistance(orig,dest){return new Promise((resolve,reject)=>{if(!mapsDM)mapsDM=new google.maps.DistanceMatrixService();
  mapsDM.getDistanceMatrix({origins:[orig],destinations:[dest],travelMode:'DRIVING'},(res,status)=>{if(status!=='OK'){reject(status);return;}
  const el=res.rows[0]?.elements[0];if(!el||el.status!=='OK'){reject(el?.status||'NO_RESULT');return;}resolve(el.distance.value/1000.0);});});}
async function initBookingMaps(){const cfg=await loadBookingCfg();const geocoder=new google.maps.Geocoder();baseLoc=await geocodePlace(geocoder,cfg.base_location_address).catch(()=>null);
  const addrInput=document.getElementById('exact_address');if(addrInput){const ac=new google.maps.places.Autocomplete(addrInput,{types:['geocode']});
    ac.addListener('place_changed',async()=>{const p=ac.getPlace();if(!p.geometry){return;}const dest=p.geometry.location;const km=await calcDistance(baseLoc,dest).catch(()=>0);updateTravelAndTotal(km);});}
  document.getElementById('service')?.addEventListener('change',()=>updateTravelAndTotal(window.__lastKm||0));
  document.getElementById('performers')?.addEventListener('change',()=>updateTravelAndTotal(window.__lastKm||0));
}
function priceNumber(txt){if(!txt)return 0;const m=(txt+'').match(/[\\d,]+(\\.\\d+)?/g);if(!m)return 0;return parseFloat(m[0].replace(/,/g,''));}
async function loadPrices(){const d=await fetch('/data/prices.json',{cache:'no-store'}).then(r=>r.json());const map={};d.items.forEach(i=>{map[i.name.toLowerCase()]=priceNumber(i.price);});return map;}
async function computePerformance(){const prices=await loadPrices();const service=(document.getElementById('service')?.value||'').toLowerCase();
  const performers=parseInt(document.getElementById('performers')?.value||'1',10);let perf=0;
  if(service.includes('xpress'))perf=prices['1 man xpress show']||0;
  else if(service.includes('1 man show'))perf=prices['1 man show']||0;
  else if(service.includes('2 man show'))perf=prices['2 man show']||0;
  else if(service.includes('3 man show'))perf=prices['3 man show']||0;
  else if(service.includes('4 man show'))perf=prices['4 man show']||0;
  else if(service.includes('topless'))perf=prices['topless waiter (per guy)']||0;
  else if(service.includes('bottomless'))perf=prices['bottomless waiter (per guy)']||0;
  else if(service.includes('naughty'))perf=prices['naughty games']||0;
  return perf*performers;
}
async function updateTravelAndTotal(km){window.__lastKm=km;const s=document.querySelector('[data-travel]');const t=document.querySelector('[data-total]');
  const cfg=mapsCfg||await loadBookingCfg();const free=Math.max(0,km-(cfg.free_km||0));const travel=Math.max(0,Math.round(free*(cfg.rand_per_km||0)));
  const perf=await computePerformance();const total=perf+travel;if(s){s.innerHTML=`${cfg.currency||'R'} ${travel}`;}if(t){t.innerHTML=`${cfg.currency||'R'} ${total}`;}}
window.initBookingMaps=initBookingMaps;
