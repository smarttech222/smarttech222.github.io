'use strict';
const navbar=document.getElementById('navbar');
const onScroll=()=>navbar.classList.toggle('scrolled',window.scrollY>20);
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();
const menuToggle=document.getElementById('menuToggle');
const menuClose=document.getElementById('menuClose');
const mobileMenu=document.getElementById('mobileMenu');
const openMenu=()=>{mobileMenu.classList.add('open');mobileMenu.setAttribute('aria-hidden','false');menuToggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';};
const closeMenu=()=>{mobileMenu.classList.remove('open');mobileMenu.setAttribute('aria-hidden','true');menuToggle.setAttribute('aria-expanded','false');document.body.style.overflow='';};
menuToggle.addEventListener('click',openMenu);
menuClose.addEventListener('click',closeMenu);
mobileMenu.querySelectorAll('.menu-link').forEach(l=>l.addEventListener('click',closeMenu));
const searchToggle=document.getElementById('searchToggle');
const searchOverlay=document.getElementById('searchOverlay');
const searchClose=document.getElementById('searchClose');
const searchInput=document.getElementById('searchInput');
const openSearch=()=>{searchOverlay.classList.add('open');searchOverlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>searchInput.focus(),60);};
const closeSearch=()=>{searchOverlay.classList.remove('open');searchOverlay.setAttribute('aria-hidden','true');document.body.style.overflow='';searchInput.value='';};
searchToggle.addEventListener('click',openSearch);
searchClose.addEventListener('click',closeSearch);
searchOverlay.addEventListener('click',function(e){if(e.target===searchOverlay)closeSearch();});
document.addEventListener('keydown',function(e){
if(e.key==='Escape'){
if(searchOverlay.classList.contains('open'))closeSearch();
if(mobileMenu.classList.contains('open'))closeMenu();
if(document.querySelector('.panel-view[style*="block"]'))closePanelView();
}
});
const SLIDE_DUR=2800;
const slides=Array.from(document.querySelectorAll('.slide'));
const dots=Array.from(document.querySelectorAll('.dot'));
const prevBtn=document.getElementById('prevSlide');
const nextBtn=document.getElementById('nextSlide');
let current=0,timer=null,busy=false;
function resetDotFills(){
dots.forEach(function(d){
var f=d.querySelector('.dot-fill');
f.style.animation='none';
void f.offsetWidth;
});
var af=dots[current].querySelector('.dot-fill');
af.style.animation='dot-progress '+SLIDE_DUR+'ms linear forwards';
}
function goTo(idx){
if(busy)return;
var n=((idx%slides.length)+slides.length)%slides.length;
if(n===current)return;
busy=true;
var prev=current;
slides[prev].classList.remove('active');
slides[prev].classList.add('prev');
dots[prev].classList.remove('active');
dots[prev].setAttribute('aria-selected','false');
current=n;
slides[current].classList.add('active');
dots[current].classList.add('active');
dots[current].setAttribute('aria-selected','true');
setTimeout(function(){slides[prev].classList.remove('prev');busy=false;},1100);
resetDotFills();
}
var goNext=function(){goTo(current+1);};
var goPrev=function(){goTo(current-1);};
var startTimer=function(){clearInterval(timer);timer=setInterval(goNext,SLIDE_DUR);};
dots.forEach(function(d,i){d.addEventListener('click',function(){goTo(i);startTimer();});});
nextBtn.addEventListener('click',function(){goNext();startTimer();});
prevBtn.addEventListener('click',function(){goPrev();startTimer();});
var hero=document.getElementById('hero');
hero.addEventListener('mouseenter',function(){clearInterval(timer);});
hero.addEventListener('mouseleave',startTimer);
var tx=null;
hero.addEventListener('touchstart',function(e){tx=e.changedTouches[0].clientX;},{passive:true});
hero.addEventListener('touchend',function(e){
if(tx===null)return;
var dx=e.changedTouches[0].clientX-tx;
if(Math.abs(dx)>48){if(dx<0){goNext();}else{goPrev();}startTimer();}
tx=null;
},{passive:true});
resetDotFills();
startTimer();
var spacer=document.getElementById('statsSpacer');
function updateSpacer(){
spacer.style.display=window.innerWidth>=768?'block':'none';
}
window.addEventListener('resize',updateSpacer,{passive:true});
updateSpacer();
document.querySelectorAll('.lang-switcher').forEach(function(sw){
sw.querySelectorAll('.lang-btn').forEach(function(btn){
btn.addEventListener('click',function(){
sw.querySelectorAll('.lang-btn').forEach(function(b){
b.classList.remove('active');
b.setAttribute('aria-pressed','false');
});
btn.classList.add('active');
btn.setAttribute('aria-pressed','true');
});
});
});
(function(){
var els=document.querySelectorAll('.reveal');
if(!('IntersectionObserver'in window)){
els.forEach(function(el){el.classList.add('visible');});
return;
}
var io=new IntersectionObserver(function(entries){
entries.forEach(function(e){
if(e.isIntersecting){
e.target.classList.add('visible');
io.unobserve(e.target);
}
});
},{threshold:0.1,rootMargin:'0px 0px -32px 0px'});
els.forEach(function(el){io.observe(el);});
})();
(function(){
var trigger=document.getElementById('floatTrigger');
var options=document.getElementById('floatOptions');
var wrap=document.getElementById('floatAssist');
if(!trigger)return;
var open=false;
function openIt(){
open=true;
trigger.classList.add('open');
options.classList.add('open');
wrap.classList.add('is-open');
trigger.setAttribute('aria-expanded','true');
options.setAttribute('aria-hidden','false');
}
function closeIt(){
open=false;
trigger.classList.remove('open');
options.classList.remove('open');
wrap.classList.remove('is-open');
trigger.setAttribute('aria-expanded','false');
options.setAttribute('aria-hidden','true');
}
trigger.addEventListener('click',function(e){e.stopPropagation();if(open){closeIt();}else{openIt();}});
document.addEventListener('click',function(e){if(open&&!wrap.contains(e.target))closeIt();});
wrap.setAttribute('dir','ltr');
wrap.style.setProperty('position','fixed','important');
wrap.style.setProperty('bottom','50px','important');
wrap.style.setProperty('top','auto','important');
wrap.style.setProperty('left','28px','important');
wrap.style.setProperty('right','auto','important');
})();
var currentPanel=null;
var lastCatScrollY=0;
function openPanel(panelId){
var viewId='view-'+panelId;
var view=document.getElementById(viewId);
if(!view)return;
lastCatScrollY=window.scrollY;
currentPanel=panelId;
document.getElementById('view-home').style.display='none';
view.style.display='block';
view.classList.add('is-open');
window.scrollTo({top:0,behavior:'instant'});
document.body.style.overflow='';
try{
history.pushState({panel:panelId},'');
}catch(e){}
setTimeout(function(){
view.querySelectorAll('.pcard').forEach(function(c,i){
c.style.opacity='0';
c.style.transform='translateY(20px)';
c.style.transition='none';
setTimeout(function(){
c.style.transition='opacity 0.4s ease, transform 0.4s ease';
c.style.opacity='1';
c.style.transform='translateY(0)';
},40+i*60);
});
},80);
}
function closePanelView(){
document.querySelectorAll('.panel-view').forEach(function(v){
v.style.display='none';
v.classList.remove('is-open');
});
currentPanel=null;
document.getElementById('view-home').style.display='';
setTimeout(function(){
if(lastCatScrollY>0){
window.scrollTo({top:lastCatScrollY,behavior:'instant'});
}else{
var cats=document.getElementById('categories');
if(cats)cats.scrollIntoView({behavior:'smooth',block:'start'});
}
},60);
}
window.addEventListener('popstate',function(e){
var suggestOverlay=document.getElementById('suggestOverlay');
if(suggestOverlay&&suggestOverlay.classList.contains('open')){
closeSuggestModalDirect();
return;
}
var sidebar=document.getElementById('cartSidebar');
if(sidebar&&sidebar.classList.contains('open')){
closeCart();
return;
}
if(currentPanel){
closePanelView();
}
});
var cart=[];
var lastScrollY=0;
function parsePrice(str){
return parseInt(String(str).replace(/,/g,''),10)||0;
}
function formatPrice(n){
return n.toLocaleString('en-US');
}
function changeQty(btn,delta){
var ctrl=btn.closest('.pcard-qty-ctrl');
var val=ctrl.querySelector('.qty-val');
var n=Math.max(1,parseInt(val.textContent)+delta);
val.textContent=n;
}
function addToCart(btn){
var name=btn.dataset.name;
var price=btn.dataset.price;
var qtyEl=btn.closest('.pcard').querySelector('.qty-val');
var qty=parseInt(qtyEl?qtyEl.textContent:1);
var existing=cart.find(function(i){return i.name===name;});
if(existing){
existing.qty+=qty;
}else{
cart.push({name:name,price:price,qty:qty});
}
if(qtyEl)qtyEl.textContent='1';
btn.innerHTML='<i class="fa-solid fa-check" aria-hidden="true"></i> أُضيف!';
btn.style.background='#22c55e';
setTimeout(function(){
btn.innerHTML='<i class="fa-solid fa-cart-plus" aria-hidden="true"></i> اطلب الآن';
btn.style.background='';
},1200);
updateCartUI();
openCart();
}
function updateCartUI(){
var itemsEl=document.getElementById('cartItems');
var emptyEl=document.getElementById('cartEmpty');
var footerEl=document.getElementById('cartFooter');
var totalEl=document.getElementById('cartTotalAmt');
var fabEl=document.getElementById('cartFab');
var fabCount=document.getElementById('cartFabCount');
if(cart.length===0){
emptyEl.style.display='';
footerEl.style.display='none';
fabEl.style.display='none';
itemsEl.querySelectorAll('.cart-item').forEach(function(el){el.remove();});
return;
}
emptyEl.style.display='none';
footerEl.style.display='';
fabEl.style.display='flex';
itemsEl.querySelectorAll('.cart-item').forEach(function(el){el.remove();});
var total=0;
cart.forEach(function(item,idx){
var unitPrice=parsePrice(item.price);
var subtotal=unitPrice*item.qty;
total+=subtotal;
var div=document.createElement('div');
div.className='cart-item';
div.innerHTML=
'<div class="cart-item-info">'+
'<div class="cart-item-name">'+item.name+'</div>'+
'<div class="cart-item-price">'+item.price+' ج.س</div>'+
'<div class="cart-item-qty-row">'+
'<button class="cart-item-qty-btn" onclick="updateCartQty('+idx+',-1)" aria-label="تقليل"><i class="fa-solid fa-minus"></i></button>'+
'<span class="cart-item-qty-val">'+item.qty+'</span>'+
'<button class="cart-item-qty-btn" onclick="updateCartQty('+idx+',1)" aria-label="زيادة"><i class="fa-solid fa-plus"></i></button>'+
'</div>'+
'<div class="cart-item-subtotal">المجموع: '+formatPrice(subtotal)+' ج.س</div>'+
'</div>'+
'<button class="cart-item-remove" onclick="removeFromCart('+idx+')" aria-label="حذف المنتج"><i class="fa-solid fa-trash-can"></i></button>';
itemsEl.appendChild(div);
});
totalEl.textContent=formatPrice(total);
fabCount.textContent=cart.reduce(function(s,i){return s+i.qty;},0);
}
function updateCartQty(idx,delta){
cart[idx].qty=Math.max(1,cart[idx].qty+delta);
updateCartUI();
}
function removeFromCart(idx){
cart.splice(idx,1);
updateCartUI();
}
function openCart(){
lastScrollY=window.scrollY;
var sidebar=document.getElementById('cartSidebar');
var overlay=document.getElementById('cartOverlay');
sidebar.classList.add('open');
overlay.classList.add('open');
sidebar.setAttribute('aria-hidden','false');
document.body.style.overflow='hidden';
try{
history.pushState({cart:true},'');
}catch(e){}
}
function closeCart(){
var sidebar=document.getElementById('cartSidebar');
var overlay=document.getElementById('cartOverlay');
sidebar.classList.remove('open');
overlay.classList.remove('open');
sidebar.setAttribute('aria-hidden','true');
document.body.style.overflow='';
setTimeout(function(){
window.scrollTo({top:lastScrollY,behavior:'instant'});
},30);
}
function orderViaWhatsApp(){
if(cart.length===0)return;
var lines=cart.map(function(item){
var sub=parsePrice(item.price)*item.qty;
return'• '+item.qty+' عدد  '+item.name+'\n= '+formatPrice(sub)+' ج.س';
});
var total=cart.reduce(function(s,i){return s+parsePrice(i.price)*i.qty;},0);
var msg='السلام عليكم، أريد طلب المنتجات التالية:\n\n'+
lines.join('\n')+
'\n\n💰 الإجمالي: '+formatPrice(total)+' ج.س'+
'\n\nأرجو تأكيد توفر الطلب مع ذكر زمن تفاصيل التوصيل\nشكراً.';
var url='https://wa.me/201150714569?text='+encodeURIComponent(msg);
window.open(url,'_blank','noopener,noreferrer');
}
function openSuggestModal(){
var overlay=document.getElementById('suggestOverlay');
overlay.classList.add('open');
overlay.setAttribute('aria-hidden','false');
document.body.style.overflow='hidden';
try{history.pushState({suggest:true},'');}catch(e){}
setTimeout(function(){
var ta=document.getElementById('suggestText');
if(ta)ta.focus();
},300);
}
function closeSuggestModal(e){
if(e&&e.target!==document.getElementById('suggestOverlay'))return;
var overlay=document.getElementById('suggestOverlay');
overlay.classList.remove('open');
overlay.setAttribute('aria-hidden','true');
document.body.style.overflow='';
}
function closeSuggestModalDirect(){
var overlay=document.getElementById('suggestOverlay');
overlay.classList.remove('open');
overlay.setAttribute('aria-hidden','true');
document.body.style.overflow='';
}
function sendSuggestion(){
var text=(document.getElementById('suggestText').value||'').trim();
if(!text){
document.getElementById('suggestText').focus();
return;
}
var msg='السلام عليكم، لدي اقتراح خاص:\n\n'+text+'\n\nشكراً.';
var url='https://wa.me/201150714569?text='+encodeURIComponent(msg);
window.open(url,'_blank','noopener,noreferrer');
document.getElementById('suggestText').value='';
closeSuggestModalDirect();
}
var fy=document.getElementById('footerYear');
if(fy)fy.textContent=new Date().getFullYear();
(function(){
var svcSlides=Array.from(document.querySelectorAll('#svcSlider .svc-slide'));
var svcDots=Array.from(document.querySelectorAll('#svcSlider .svc-dot'));
var svcCur=0;
var svcBusy=false;
var svcTimer=null;
window.svcGoTo=function(idx){
if(svcBusy||idx===svcCur)return;
svcBusy=true;
svcSlides[svcCur].classList.remove('active');
svcSlides[svcCur].classList.add('prev');
svcDots[svcCur].classList.remove('active');
var prev=svcCur;
svcCur=idx;
svcSlides[svcCur].classList.add('active');
svcDots[svcCur].classList.add('active');
setTimeout(function(){
svcSlides[prev].classList.remove('prev');
svcBusy=false;
},1000);
};
function svcNext(){
svcGoTo((svcCur+1)%svcSlides.length);
}
svcTimer=setInterval(svcNext,3500);
var slider=document.getElementById('svcSlider');
if(slider){
slider.addEventListener('mouseenter',function(){clearInterval(svcTimer);});
slider.addEventListener('mouseleave',function(){svcTimer=setInterval(svcNext,3500);});
var stx=null;
slider.addEventListener('touchstart',function(e){stx=e.changedTouches[0].clientX;},{passive:true});
slider.addEventListener('touchend',function(e){
if(stx===null)return;
var dx=e.changedTouches[0].clientX-stx;
if(Math.abs(dx)>40){svcGoTo(dx<0?(svcCur+1)%svcSlides.length:(svcCur-1+svcSlides.length)%svcSlides.length);}
stx=null;
},{passive:true});
}
})();