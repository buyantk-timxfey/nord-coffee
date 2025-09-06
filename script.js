// Бургер меню
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', nav.classList.contains('is-open'));
});

// Закрытие меню при клике по ссылке (мобилка)
document.querySelectorAll('.nav a').forEach(link=>{
  link.addEventListener('click',()=> nav.classList.remove('is-open'));
});
(function(){
  const form = document.getElementById('profit-calc');
  if(!form) return;

  const els = {
    price: form.querySelector('input[name="price"]'),
    cups:  form.querySelector('input[name="cups"]'),
    ingredients: form.querySelector('input[name="ingredients"]'),
    rent:  form.querySelector('input[name="rent"]'),
    acq:   form.querySelector('input[name="acq"]'),
    tax:   form.querySelector('input[name="tax"]'),
    rev:   document.getElementById('rev'),
    costs: document.getElementById('costs'),
    net:   document.getElementById('net'),
  };

  const fmt = n => n.toLocaleString('ru-RU', {maximumFractionDigits: 0}) + ' ₽';

  function recalc(){
    const price = +els.price.value || 0;
    const cups  = +els.cups.value  || 0;
    const days = 31;

    const revenue = price * cups * days;

    const pIngr = (+els.ingredients.value || 0) / 100;
    const pRent = (+els.rent.value || 0) / 100;
    const pAcq  = (+els.acq.value  || 0) / 100;
    const pTax  = (+els.tax.value  || 0) / 100;

    const totalPct = pIngr + pRent + pAcq + pTax;
    const costs = revenue * totalPct;
    const net   = revenue - costs;

    els.rev.textContent   = revenue ? fmt(revenue) : '—';
    els.costs.textContent = revenue ? fmt(Math.round(costs)) : '—';
    els.net.textContent   = revenue ? fmt(Math.round(net)) : '—';
  }

  form.addEventListener('input', recalc);
  recalc();
})();

// обработка формы заявки (без бэкенда, имитация отправки)
(function(){
  const form = document.getElementById('lead-form');
  if(!form) return;

  const toast = document.getElementById('lead-toast');

  function showToast(msg){
    if(toast){ toast.textContent = msg; toast.classList.add('is-show'); setTimeout(()=>toast.classList.remove('is-show'), 2400); }
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    // простая валидация
    const name = form.elements['name'].value.trim();
    const phone = form.elements['phone'].value.trim();
    const agree = form.querySelector('input[type="checkbox"]').checked;

    if(!name || !phone || !agree){
      showToast('Заполните имя, телефон и согласие.');
      return;
    }

    // тут подключишь свой бэкенд/телеграм-бот/формспри — пока просто имитация
    form.reset();
    showToast('Заявка отправлена. Свяжемся в ближайшее время.');
  });
})();
// 3D-tilt для кофе-пойнта (desktop), автоподсветка на hover
(function(){
  const wrap = document.querySelector('.hero__img');
  if(!wrap) return;
  const img = wrap.querySelector('img');
  let raf = null;

  // пропускаем на тач-устройствах
  const isTouch = window.matchMedia('(hover:none), (pointer:coarse)').matches;
  if(isTouch) return;

  const maxTilt = 8; // градусов
  function onMove(e){
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / (rect.width/2);
    const dy = (e.clientY - cy) / (rect.height/2);
    // ограничим
    const ry = Math.max(-1, Math.min(1, dx)) * maxTilt;   // вращение по Y
    const rx = Math.max(-1, Math.min(1, -dy)) * maxTilt;  // вращение по X
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      wrap.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      wrap.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    });
  }

  function enter(){
    wrap.classList.add('is-tilting','is-hover');
    document.addEventListener('mousemove', onMove);
  }
  function leave(){
    document.removeEventListener('mousemove', onMove);
    wrap.classList.remove('is-tilting','is-hover');
    wrap.style.removeProperty('--ry');
    wrap.style.removeProperty('--rx');
  }

  wrap.addEventListener('mouseenter', enter);
  wrap.addEventListener('mouseleave', leave);
})();
