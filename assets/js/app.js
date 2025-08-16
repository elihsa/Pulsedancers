async function loadJSON(p){const r=await fetch(p,{cache:'no-store'});return r.json();}
async function hydrateHome(){const el=document.querySelector('[data-home]');if(!el)return;const d=await loadJSON('/data/home.json');
  el.querySelector('[data-hero-title]').textContent=d.hero_title;el.querySelector('[data-hero-sub]').textContent=d.hero_subtitle;
  const cta=el.querySelector('[data-cta]');cta.textContent=d.cta_text;cta.href=d.cta_url;
  const logoEl=document.querySelector('nav .logo img');if(logoEl&&d.logo)logoEl.src=d.logo;
  const heroImg=document.querySelector('.hero img.responsive');if(heroImg&&d.hero_image)heroImg.src=d.hero_image;
  const ab=document.querySelector('[data-about]');if(ab){ab.querySelector('h2').textContent=d.about_title||'About';
    const box=ab.querySelector('[data-about-body]');box.innerHTML='';(d.about_paragraphs||[]).forEach(p=>{const q=document.createElement('p');q.textContent=p;box.appendChild(q);});}
  const ul=document.querySelector('[data-services]');if(ul){ul.innerHTML='';(d.services||[]).forEach(s=>{const li=document.createElement('li');li.textContent=s;ul.appendChild(li);});}
}
async function hydratePrices(){const wrap=document.querySelector('[data-prices]');if(!wrap)return;const d=await loadJSON('/data/prices.json');const tbody=wrap.querySelector('tbody');
  d.items.forEach(i=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${i.name}</td><td>${i.duration||''}</td><td>${i.price}</td>`;tbody.appendChild(tr);});
  const notes=document.querySelector('[data-price-notes]');if(notes&&d.notes)notes.textContent=d.notes;}
async function hydrateFAQ(){const wrap=document.querySelector('[data-faq]');if(!wrap)return;const d=await loadJSON('/data/faq.json');
  d.groups.forEach(g=>{const h=document.createElement('h3');h.textContent=g.title;h.className='badge';wrap.appendChild(h);
    const acc=document.createElement('div');acc.className='accordion';
    g.qas.forEach(qa=>{const details=document.createElement('details');const sum=document.createElement('summary');sum.textContent=qa.q;
      const content=document.createElement('div');content.className='content';content.textContent=qa.a;details.appendChild(sum);details.appendChild(content);acc.appendChild(details);});
    wrap.appendChild(acc);});}
async function hydrateTestimonials(){const wrap=document.querySelector('[data-testimonials]');if(!wrap)return;const d=await loadJSON('/data/testimonials.json');
  const list=wrap.querySelector('.reviews');list.innerHTML='';(d.items||[]).forEach(t=>{const card=document.createElement('div');card.className='review';
    card.innerHTML=`<div class="star">${''.repeat(t.rating||5)}</div><p>${t.text}</p><p class="small"> ${t.name}${t.location?', '+t.location:''}</p>`;list.appendChild(card);});}
async function hydrateSocial(){const s=await loadJSON('/data/social.json');const slot1=document.getElementById('ig1');const slot2=document.getElementById('ig2');const posts=s.instagram_posts||[];
  [slot1,slot2].forEach((slot,idx)=>{if(slot&&posts[idx]){slot.innerHTML=`<blockquote class="instagram-media" data-instgrm-permalink="${posts[idx]}" data-instgrm-version="14"></blockquote>`;}});
  if(window.instgrm){window.instgrm.Embeds.process();}}
document.addEventListener('DOMContentLoaded',()=>{hydrateHome();hydratePrices();hydrateFAQ();hydrateTestimonials();hydrateSocial();});
