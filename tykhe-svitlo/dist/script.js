const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const text = document.querySelector('.reveal-text');
const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
nodes.forEach(node => { const frag=document.createDocumentFragment(); node.textContent.split(/(\s+)/).forEach(word => { if (/^\s+$/.test(word)) frag.append(word); else if (word) { const span=document.createElement('span'); span.className='reveal-word'; span.textContent=word; frag.append(span); } }); node.replaceWith(frag); });
const words=[...text.querySelectorAll('.reveal-word')];
let frame=0;
function paintWords(){frame=0;const rect=text.getBoundingClientRect();const progress=Math.min(1,Math.max(0,(innerHeight*.88-rect.top)/(rect.height+innerHeight*.22)));words.forEach((word,i)=>{const fill=reducedMotion.matches?1:Math.max(0,Math.min(1,progress*(words.length+3)-i));word.style.setProperty('--fill',`${fill*100}%`);});}
function schedule(){if(!frame)frame=requestAnimationFrame(paintWords);}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reducedMotion.addEventListener('change',schedule);paintWords();document.fonts.ready.then(schedule);
let lastFocus;
function showDialog(dialog){lastFocus=document.activeElement;dialog.showModal();document.body.style.overflow='hidden';}
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus();});});
const photoDialog=document.querySelector('#photo-dialog');
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{photoDialog.querySelector('img').src=button.dataset.photo;photoDialog.querySelector('img').alt=button.querySelector('img').alt;photoDialog.querySelector('p').textContent=button.dataset.caption;showDialog(photoDialog);}));
const bookingDialog=document.querySelector('#booking-dialog');const form=document.querySelector('#booking-form');const result=document.querySelector('#booking-result');
function openBooking(session){form.hidden=false;result.hidden=true;if(session)form.elements.session.value=session;showDialog(bookingDialog);}
document.querySelector('#booking-open').addEventListener('click',()=>openBooking());
document.querySelectorAll('[data-session]').forEach(button=>button.addEventListener('click',()=>openBooking(button.dataset.session)));
let brief='';form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);brief=`ТИХЕ СВІТЛО — БРИФ НА ЗЙОМКУ\n\nІм’я: ${data.get('name').trim()}\nФормат: ${data.get('session')}\nПобажання: ${data.get('mood').trim()||'Обговоримо разом'}\n\nЧернетка для обговорення. Не є підтвердженням бронювання.`;if(document.documentElement.lang==='en')brief=`QUIET LIGHT — SESSION BRIEF\n\nName: ${data.get('name').trim()}\nSession: ${data.get('session')}\nIdeas: ${data.get('mood').trim()||'Let’s discuss together'}\n\nA draft for discussion. This is not a booking confirmation.`;document.querySelector('#brief-preview').textContent=brief;form.hidden=true;result.hidden=false;document.querySelector('#download-brief').focus();});
document.querySelector('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+brief],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='tykhe-svitlo-brief.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
document.querySelector('#edit-brief').addEventListener('click',()=>{form.hidden=false;result.hidden=true;form.elements.name.focus();});
// Reveal each section title once as it enters the viewport. Content stays visible without JS.
const sectionTitles = [...document.querySelectorAll('#work-title, #sessions-title, .footer-logo')];
let titleObserver;
function setupTitleReveals() {
  titleObserver?.disconnect();
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    sectionTitles.forEach(title => title.classList.remove('title-reveal-pending', 'title-reveal-visible'));
    return;
  }
  titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('title-reveal-pending');
      entry.target.classList.add('title-reveal-visible');
      titleObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  sectionTitles.forEach(title => {
    if (title.classList.contains('title-reveal-visible')) return;
    // Observe visible geometry: clipping this element prevents intersection.
    title.classList.remove('title-reveal-pending');
    titleObserver.observe(title);
  });
}
setupTitleReveals();
reducedMotion.addEventListener('change', setupTitleReveals);
