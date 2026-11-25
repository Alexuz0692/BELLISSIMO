/* =============================================
   BELLISIMO – app.js
   ============================================= */

/* ───────────────────────────────────────────
   1. DATOS DE SABORES
─────────────────────────────────────────────*/
const FLAVORS = [
  { id: 1, emoji: "🍓", name: "Fresa Natural",    desc: "Fresas frescas de temporada con un toque de vainilla.",     price: 3200, tag: "frutal",    color: "#ff6b9d" },
  { id: 2, emoji: "🍋", name: "Limón Menta",      desc: "Refrescante y ácido, perfecto para los días calurosos.",    price: 3200, tag: "frutal",    color: "#6bcb77" },
  { id: 3, emoji: "🥭", name: "Maracuyá",         desc: "Tropical e intenso. El favorito de la casa.",              price: 3500, tag: "frutal",    color: "#ffd166" },
  { id: 4, emoji: "🍇", name: "Mora Silvestre",   desc: "Moras recogidas a mano con un balance dulce‑ácido.",       price: 3200, tag: "frutal",    color: "#845ef7" },
  { id: 5, emoji: "🍌", name: "Banano Cream",     desc: "Cremoso, suave y naturalmente dulce.",                     price: 3000, tag: "cremoso",   color: "#fcc419" },
  { id: 6, emoji: "🌴", name: "Coco Tostado",     desc: "Coco rallado tostado en base de crema espesa.",            price: 3800, tag: "cremoso",   color: "#74c0fc" },
  { id: 7, emoji: "☕", name: "Café Espresso",    desc: "Para los amantes del café: intenso y aterciopelado.",      price: 3800, tag: "cremoso",   color: "#6d4c41" },
  { id: 8, emoji: "🍦", name: "Vainilla Francesa",desc: "Clásica, pura y sin iguales. Vainilla de Madagascar.",     price: 3000, tag: "cremoso",   color: "#ffe8cc" },
  { id: 9, emoji: "🍫", name: "Chocolate Belga",  desc: "Chocolate 70% de cacao con un acabado sedoso.",            price: 4000, tag: "chocolate", color: "#6d4c41" },
  { id:10, emoji: "🌶️", name: "Choco Picante",    desc: "Chocolate oscuro con un toque de cayena. ¡Atrevido!",      price: 4200, tag: "chocolate", color: "#e55353" },
  { id:11, emoji: "🥜", name: "Choco Maní",       desc: "Chocolate con crema de maní crujiente. Irresistible.",     price: 4000, tag: "chocolate", color: "#a05c34" },
  { id:12, emoji: "🌸", name: "Lavanda & Miel",   desc: "Floral, delicado y con un toque de miel artesanal.",       price: 4500, tag: "especial",  color: "#cc5de8" },
  { id:13, emoji: "🍵", name: "Matcha Ceremonial",desc: "Té matcha japonés de primer grado en base de leche.",      price: 4800, tag: "especial",  color: "#6bcb77" },
  { id:14, emoji: "🫐", name: "Arándano Cheesecake",desc:"Arándanos sobre base de queso crema suavísima.",          price: 4500, tag: "especial",  color: "#748ffc" },
];

/* ───────────────────────────────────────────
   2. NAVBAR – scroll & hamburger
─────────────────────────────────────────────*/
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  document.getElementById("scrollTop").classList.toggle("visible", window.scrollY > 400);
});

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.textContent = "☰";
  })
);

/* ───────────────────────────────────────────
   3. SCROLL TO TOP
─────────────────────────────────────────────*/
document.getElementById("scrollTop").addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ───────────────────────────────────────────
   4. CONTADOR ANIMADO (Intersection Observer)
─────────────────────────────────────────────*/
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".stat-num").forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector(".stats");
if (statsSection) statsObserver.observe(statsSection);

/* ───────────────────────────────────────────
   5. RENDER FLAVOR CARDS
─────────────────────────────────────────────*/
const flavorGrid = document.getElementById("flavorGrid");

function renderFlavors(filter = "all") {
  flavorGrid.innerHTML = "";
  FLAVORS
    .filter(f => filter === "all" || f.tag === filter)
    .forEach(f => {
      const card = document.createElement("div");
      card.className = "flavor-card show";
      card.dataset.tag = f.tag;
      card.innerHTML = `
        <div class="flavor-emoji">${f.emoji}</div>
        <span class="flavor-tag tag-${f.tag}">${capitalize(f.tag)}</span>
        <div class="flavor-name">${f.name}</div>
        <div class="flavor-desc">${f.desc}</div>
        <div class="flavor-price">$${f.price.toLocaleString("es-CO")}</div>
        <button class="add-to-cart" data-id="${f.id}">+ Agregar 🛒</button>
      `;
      flavorGrid.appendChild(card);
    });

  // delegated click for add-to-cart buttons
  flavorGrid.querySelectorAll(".add-to-cart").forEach(btn =>
    btn.addEventListener("click", () => addToCart(+btn.dataset.id))
  );
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
renderFlavors();

/* ───────────────────────────────────────────
   6. FILTROS
─────────────────────────────────────────────*/
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderFlavors(btn.dataset.filter);
  });
});

/* ───────────────────────────────────────────
   7. CARRITO
─────────────────────────────────────────────*/
let cart = [];

function addToCart(id) {
  const flavor = FLAVORS.find(f => f.id === id);
  if (!flavor) return;
  if (cart.length >= 5) {
    showToast("¡Máximo 5 sabores por copa! 🍦");
    return;
  }
  cart.push({ ...flavor });
  renderCart();
  renderCupPreview();
  showToast(`${flavor.emoji} ${flavor.name} agregado`);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
  renderCupPreview();
}

function renderCart() {
  const list  = document.getElementById("cartList");
  const total = document.getElementById("cartTotal");

  if (cart.length === 0) {
    list.innerHTML = '<li class="empty-cart">Tu copa está vacía…</li>';
    total.textContent = "$0";
    return;
  }

  list.innerHTML = cart.map((item, i) => `
    <li>
      <span>${item.emoji} ${item.name}</span>
      <span>
        $${item.price.toLocaleString("es-CO")}
        <button class="remove-item" data-idx="${i}" title="Quitar">✕</button>
      </span>
    </li>
  `).join("");

  list.querySelectorAll(".remove-item").forEach(btn =>
    btn.addEventListener("click", () => removeFromCart(+btn.dataset.idx))
  );

  const sum = cart.reduce((acc, item) => acc + item.price, 0);
  total.textContent = "$" + sum.toLocaleString("es-CO");
}

function renderCupPreview() {
  const scoopsDiv = document.getElementById("cupScoops");
  if (cart.length === 0) {
    scoopsDiv.innerHTML = '<p class="cup-empty">Agrega sabores para ver tu copa 🍦</p>';
    return;
  }
  scoopsDiv.innerHTML = cart.map(item => `
    <div class="cup-scoop" style="background:${item.color};">
      ${item.emoji}
    </div>
  `).join("");
}

document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  renderCart();
  renderCupPreview();
  showToast("Copa vaciada 🫙");
});

document.getElementById("orderBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("¡Agrega sabores a tu copa primero! 🍦");
    return;
  }
  const names = cart.map(i => i.emoji + " " + i.name).join(", ");
  const total = cart.reduce((a, i) => a + i.price, 0);
  showModal(
    "🎉 ¡Pedido recibido!",
    `Tu copa con: ${names}.<br><br><strong>Total: $${total.toLocaleString("es-CO")}</strong><br><br>En breve nos comunicamos contigo. ¡Gracias por elegir BELLISIMO! 🍦`
  );
  cart = [];
  renderCart();
  renderCupPreview();
});

/* ───────────────────────────────────────────
   8. TOAST NOTIFICATION
─────────────────────────────────────────────*/
function showToast(msg) {
  let toast = document.getElementById("toastMsg");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastMsg";
    toast.style.cssText = `
      position:fixed; bottom:5rem; left:50%; transform:translateX(-50%) translateY(20px);
      background:linear-gradient(135deg,#ff6b9d,#845ef7); color:white;
      padding:.7rem 1.5rem; border-radius:50px; font-weight:600;
      box-shadow:0 4px 20px rgba(0,0,0,.2); z-index:9999;
      opacity:0; transition:all .3s ease; white-space:nowrap; font-size:.9rem;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2500);
}

/* ───────────────────────────────────────────
   9. MODAL
─────────────────────────────────────────────*/
function showModal(title, body) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.55);
    display:flex; align-items:center; justify-content:center; z-index:9999;
    backdrop-filter:blur(4px); animation:fadeIn .3s ease;
  `;
  overlay.innerHTML = `
    <div style="background:white; border-radius:24px; padding:2.5rem; max-width:400px;
                width:90%; text-align:center; animation:popIn .35s ease;
                box-shadow:0 20px 60px rgba(0,0,0,.2);">
      <div style="font-size:2.5rem; margin-bottom:1rem;">🍦</div>
      <h2 style="font-family:'Pacifico',cursive; color:#845ef7; margin-bottom:1rem;">${title}</h2>
      <p style="color:#6b7280; line-height:1.7;">${body}</p>
      <button onclick="this.closest('[data-modal]').remove()"
        style="margin-top:1.5rem; padding:.7rem 2rem; border-radius:50px;
               background:linear-gradient(135deg,#ff6b9d,#845ef7);
               color:white; border:none; font-weight:700; font-size:1rem; cursor:pointer;">
        ¡Genial! 🎉
      </button>
    </div>
  `;
  overlay.dataset.modal = "1";
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  // fix close button selector
  overlay.querySelector("button").addEventListener("click", () => overlay.remove());
  document.body.appendChild(overlay);
}

/* ───────────────────────────────────────────
   10. SLIDER DE TESTIMONIOS
─────────────────────────────────────────────*/
const testimonios = document.querySelectorAll(".testimonio");
const dotsContainer = document.getElementById("sliderDots");
let currentSlide = 0;
let sliderTimer;

testimonios.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Testimonio ${i + 1}`);
  dot.addEventListener("click", () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(idx) {
  testimonios[currentSlide].classList.remove("active");
  dotsContainer.children[currentSlide].classList.remove("active");
  currentSlide = idx;
  testimonios[currentSlide].classList.add("active");
  dotsContainer.children[currentSlide].classList.add("active");
  resetTimer();
}

function nextSlide() { goToSlide((currentSlide + 1) % testimonios.length); }

function resetTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 4500);
}
resetTimer();

/* ───────────────────────────────────────────
   11. FORMULARIO DE CONTACTO
─────────────────────────────────────────────*/
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: "nombre",  errId: "errorNombre",  min: 2,  msg: "Ingresa tu nombre (mín. 2 caracteres)." },
    { id: "email",   errId: "errorEmail",   email: true, msg: "Ingresa un email válido." },
    { id: "mensaje", errId: "errorMensaje", min: 10, msg: "El mensaje debe tener al menos 10 caracteres." },
  ];

  fields.forEach(({ id, errId, min, email, msg }) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    let ok = true;

    if (email) {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    } else if (min) {
      ok = el.value.trim().length >= min;
    }

    err.textContent = ok ? "" : msg;
    el.style.borderColor = ok ? "" : "#e74c3c";
    if (!ok) valid = false;
  });

  if (valid) {
    document.getElementById("formSuccess").style.display = "block";
    this.reset();
    setTimeout(() => {
      document.getElementById("formSuccess").style.display = "none";
    }, 5000);
  }
});

// Live validation reset on input
["nombre", "email", "mensaje"].forEach(id => {
  document.getElementById(id).addEventListener("input", function () {
    this.style.borderColor = "";
    document.getElementById("error" + capitalize(id)).textContent = "";
  });
});

/* ───────────────────────────────────────────
   12. FADE-IN ON SCROLL (secciones)
─────────────────────────────────────────────*/
const fadeStyle = document.createElement("style");
fadeStyle.textContent = `
  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity .6s ease, transform .6s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(fadeStyle);

document.querySelectorAll("section").forEach(sec => sec.classList.add("fade-in"));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));

/* ───────────────────────────────────────────
   KEYFRAME injection for modal
─────────────────────────────────────────────*/
const kfStyle = document.createElement("style");
kfStyle.textContent = `
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes popIn  { from { opacity:0; transform:scale(.85); } to { opacity:1; transform:scale(1); } }
`;
document.head.appendChild(kfStyle);
