// Бургер-меню
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
if (burger && nav) {
  burger.addEventListener("click", () => {
    const opened = nav.style.display === "flex";
    nav.style.display = opened ? "none" : "flex";
    burger.setAttribute("aria-expanded", (!opened).toString());
  });
  // Закрываем при клике по ссылке на мобиле
  nav.querySelectorAll("a").forEach(a=>{
    a.addEventListener("click", ()=>{
      if (window.innerWidth < 960){
        nav.style.display = "none";
        burger.setAttribute("aria-expanded","false");
      }
    });
  });
}

// Плавная прокрутка (fallback на случай, если CSS отключит)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (el){
      e.preventDefault();
      el.scrollIntoView({behavior:"smooth", block:"start"});
    }
  });
});

// Reveal-анимации
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el=>el.classList.add("is-visible"));
}

// Валидация формы + модалка успеха
const form = document.getElementById("lead-form");
if (form){
  const phoneInput = form.querySelector('input[name="phone"]');
  // автоформат под +7
  phoneInput.addEventListener("input", ()=>{
    let v = phoneInput.value.replace(/[^\d]/g, "");
    if (v.startsWith("8")) v = "7" + v.slice(1);
    if (!v.startsWith("7")) v = "7" + v;
    const parts = [v[0], v.slice(1,4), v.slice(4,7), v.slice(7,9), v.slice(9,11)]
      .filter(Boolean);
    phoneInput.value = "+" + [parts[0], parts[1], parts[2] && parts[2], parts[3] && parts[3], parts[4] && parts[4]]
      .filter(Boolean)
      .map((p,i)=> i===0? p : (i===1? p : (i===2? p : p)))
      .join(" ");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/[^\d]/g, "");
    if (!name){ showToast("Заполните имя, пожалуйста."); return; }
    if (phone.length < 11){ showToast("Проверьте номер телефона."); return; }

    // TODO: отправка в ваш backend/Telegram/CRM
    openModal("#success-modal");
    form.reset();
  });
}

// мини-тост
function showToast(text){
  let t = document.querySelector(".toast");
  if(!t){
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = text;
  t.classList.add("is-show");
  setTimeout(()=> t.classList.remove("is-show"), 2200);
}

// Калькулятор прибыли
(function(){
  const form = document.getElementById("profit-calc");
  if (!form) return;

  const priceEl = form.querySelector('input[name="price"]');
  const cupsEl  = form.querySelector('input[name="cups"]');
  const daysEl  = form.querySelector('input[name="days"]');
  const ingrEl  = form.querySelector('input[name="ingredients"]');
  const rentEl  = form.querySelector('input[name="rent"]');
  const acqEl   = form.querySelector('input[name="acq"]');
  const taxEl   = form.querySelector('input[name="tax"]');

  const revOut  = document.getElementById("rev");
  const costsOut= document.getElementById("costs");
  const netOut  = document.getElementById("net");

  const rub = new Intl.NumberFormat('ru-RU', { style:'currency', currency:'RUB', maximumFractionDigits:0 });

  function clamp(val, min, max){
    return Math.max(min, Math.min(max, val));
  }

  function num(el, def){
    const v = parseFloat(el.value.replace(',', '.'));
    return isNaN(v) ? def : v;
  }

  function recalc(){
    const price = clamp(num(priceEl,160), 0, 100000);
    const cups  = clamp(num(cupsEl,11), 0, 100000);
    const days  = clamp(num(daysEl,30), 1, 31);

    const ingredients = clamp(num(ingrEl,30), 0, 100)/100;
    const rent        = clamp(num(rentEl,5), 0, 100)/100;
    const acq         = clamp(num(acqEl,2), 0, 100)/100;
    const tax         = clamp(num(taxEl,4), 0, 100)/100;

    const revenue = price * cups * days;
    const totalRate = ingredients + rent + acq + tax;
    const costs = revenue * totalRate;
    const net = revenue - costs;

    revOut.textContent   = rub.format(revenue);
    costsOut.textContent = rub.format(costs);
    netOut.textContent   = rub.format(net);
  }

  // Пересчёт на ввод
  [priceEl, cupsEl, daysEl, ingrEl, rentEl, acqEl, taxEl].forEach(el=>{
    el.addEventListener('input', recalc);
    el.addEventListener('change', recalc);
  });

  recalc(); // стартовый пересчёт
})();
// Скрытие sticky CTA при скролле к контактам
(function(){
  const cta = document.querySelector(".sticky-cta");
  const contacts = document.getElementById("contacts");
  if (!cta || !contacts) return;
  const io = new IntersectionObserver(([entry])=>{
    cta.style.display = entry.isIntersecting ? "none" : "flex";
  }, {threshold:0.2});
  io.observe(contacts);
})();
// Modal helpers
function openModal(sel){
  const m = document.querySelector(sel);
  if (!m) return;
  m.classList.add("is-open");
  m.setAttribute("aria-hidden","false");
}
document.addEventListener("click", (e)=>{
  if (e.target.matches("[data-close]") || e.target.closest("[data-close]")){
    const m = e.target.closest(".modal");
    if (m){
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden","true");
    }
  }
});
document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape"){
    document.querySelectorAll(".modal.is-open").forEach(m=>{
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden","true");
    });
  }
});
