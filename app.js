/* ==========================================================================
   ÖZDEMİR TİCARET - Application Logic & State Management
   ========================================================================== */

// Products Dataset
const PRODUCTS = [
  {
    id: 1,
    category: 'damacana',
    title: '19L Polikarbon Damacana Su',
    desc: 'Bolu Abant dağlarından gelen 7.9 pH alkali doğal kaynak suyu. Hijyenik polikarbon ambalaj.',
    price: 95.00,
    unit: 'Adet / Boş Damacana Değişimli',
    image: 'images/damacana_19l.png',
    badge: 'Çok Satan',
    badgeType: 'badge-orange',
    ph: '7.9 pH',
    mineral: 'Düşük Sodyum'
  },
  {
    id: 2,
    category: 'cam-damacana',
    title: '19L Cam Damacana Su',
    desc: '%100 Doğal ve sağlıklı cam ambalaj. Suyun en saf ve lezzetli halini ailenizle buluşturun.',
    price: 140.00,
    unit: 'Adet / Cam Şişe',
    image: 'images/cam_damacana_19l.png',
    badge: 'Premium Cam',
    badgeType: 'badge-cyan',
    ph: '7.9 pH',
    mineral: 'Cam Koruma'
  },
  {
    id: 3,
    category: 'pet',
    title: '0.5L Pet Şişe Su (24\'lü Koli)',
    desc: 'Çantada ve arabada pratik kullanım. 24 adet 0.5 Litre el değmeden paketlenmiş su kolisidir.',
    price: 110.00,
    unit: 'Koli (24 Adet)',
    image: 'images/pet_bottles.png',
    badge: 'Ekonomik Koli',
    badgeType: 'badge-green',
    ph: '7.9 pH',
    mineral: 'Pratik Boy'
  },
  {
    id: 4,
    category: 'pet',
    title: '1.5L Pet Şişe Su (12\'li Koli)',
    desc: 'Yemek masalarında ve günlük aile kullanımında en ideal boyuttaki doğal kaynak suyu.',
    price: 105.00,
    unit: 'Koli (12 Adet)',
    image: 'images/pet_bottles.png',
    badge: 'İdeal Aile Boyu',
    badgeType: 'badge-cyan',
    ph: '7.9 pH',
    mineral: 'Dengeli Mineral'
  },
  {
    id: 5,
    category: 'pet',
    title: '5L Pet Şişe Su (4\'lü Koli)',
    desc: 'Mutfakta çay, yemek ve günlük kullanım için büyük boy saf kaynak suyu.',
    price: 125.00,
    unit: 'Koli (4 Adet)',
    image: 'images/pet_bottles.png',
    badge: 'Avantaj Paketi',
    badgeType: 'badge-green',
    ph: '7.9 pH',
    mineral: 'Mutfak Dostu'
  },
  {
    id: 6,
    category: 'aksesuar',
    title: 'Şarjlı Otomatik Su Pompası',
    desc: 'USB Type-C şarjlı, tek tıkla su akıtan akıllı damacana pompası. Paslanmaz çelik borulu.',
    price: 220.00,
    unit: 'Adet / Garantili',
    image: 'images/pump.png',
    badge: 'Konforlu Aksesuar',
    badgeType: 'badge-orange',
    ph: 'LED Işıklı',
    mineral: 'Sessiz Motor'
  }
];

// App State
let cart = [];

// DOM Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  setupEventListeners();
  calculateWater();
});

// Render Product Cards
function renderProducts(filterCategory) {
  const container = document.getElementById('products-container');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filterCategory);

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-badge-top">
        <span class="badge ${p.badgeType}">${p.badge}</span>
      </div>
      <div class="product-img-wrapper">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-details">
        <span class="product-category">${p.category.toUpperCase()}</span>
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.desc}</p>
        
        <div class="product-specs">
          <span><i class="fa-solid fa-flask"></i> ${p.ph}</span>
          <span><i class="fa-solid fa-shield-halved"></i> ${p.mineral}</span>
        </div>

        <div class="product-footer">
          <div class="product-price">
            <span class="price-num">₺${p.price.toFixed(2)}</span>
            <span class="price-unit">${p.unit}</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart(${p.id})">
            <i class="fa-solid fa-cart-plus"></i> Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
  // Category Filter Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderProducts(cat);
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });
  }

  // Cart Drawer Trigger
  const cartTrigger = document.getElementById('cart-trigger');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  if (cartTrigger) {
    cartTrigger.addEventListener('click', () => openCartDrawer());
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => closeCartDrawer());
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => closeCartDrawer());
  }

  // Calculator Controls
  const weightInput = document.getElementById('calc-weight');
  const activitySelect = document.getElementById('calc-activity');
  if (weightInput) weightInput.addEventListener('input', calculateWater);
  if (activitySelect) activitySelect.addEventListener('change', calculateWater);

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      parent.classList.toggle('active');
    });
  });
}

// Cart Logic
function addToCart(productId) {
  const item = PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const existing = cart.find(ci => ci.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  openCartDrawer();
}

function updateCartQty(productId, change) {
  const existing = cart.find(ci => ci.id === productId);
  if (!existing) return;

  existing.qty += change;
  if (existing.qty <= 0) {
    cart = cart.filter(ci => ci.id !== productId);
  }
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.innerText = totalCount;

  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.4;"></i>
        <p>Sepetiniz henüz boş.</p>
        <p style="font-size:0.85rem; margin-top:5px;">Sipariş vermek için ürün ekleyin.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = '₺0.00';
    if (totalEl) totalEl.innerText = '₺0.00';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal >= 100 ? 0 : 20;
  const total = subtotal + deliveryFee;

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        <span class="cart-item-price">₺${(item.price * item.qty).toFixed(2)}</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.innerText = `₺${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `₺${total.toFixed(2)}`;
}

function openCartDrawer() {
  document.getElementById('drawer-overlay')?.classList.add('active');
  document.getElementById('cart-drawer')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('drawer-overlay')?.classList.remove('active');
  document.getElementById('cart-drawer')?.classList.remove('active');
}

// Water Consumption Calculator Logic
function calculateWater() {
  const weight = parseFloat(document.getElementById('calc-weight')?.value || 70);
  const activity = document.getElementById('calc-activity')?.value || '1.0';
  
  const factor = parseFloat(activity);
  const totalLiters = (weight * 0.035 * factor).toFixed(1);
  const totalGlasses = Math.round(totalLiters * 5);

  const numEl = document.getElementById('calc-result-liters');
  const subEl = document.getElementById('calc-result-glasses');

  if (numEl) numEl.innerText = `${totalLiters} Litre`;
  if (subEl) subEl.innerText = `(Yaklaşık ${totalGlasses} Bardak Su / Gün)`;
}

// Checkout Modal Logic
function openCheckoutModal() {
  if (cart.length === 0) {
    alert('Lütfen önce sepetinize ürün ekleyin.');
    return;
  }
  closeCartDrawer();
  document.getElementById('order-modal-overlay')?.classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('order-modal-overlay')?.classList.remove('active');
}

// Order Submission & WhatsApp Message Build
function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById('order-name').value;
  const phone = document.getElementById('order-phone').value;
  const district = document.getElementById('order-district').value;
  const address = document.getElementById('order-address').value;
  const note = document.getElementById('order-note').value;
  const payment = document.getElementById('order-payment').value;

  const orderLines = cart.map(i => `• ${i.qty}x ${i.title} (₺${(i.price * i.qty).toFixed(2)})`).join('%0A');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal >= 100 ? subtotal : subtotal + 20;

  const msg = `*ÖZDEMİR TİCARET ONLINE SİPARİŞ*%0A` +
    `--------------------------------%0A` +
    `*Müşteri:* ${name}%0A` +
    `*Telefon:* ${phone}%0A` +
    `*İlçe / Mahalle:* ${district}%0A` +
    `*Adres:* ${address}%0A` +
    `*Ödeme Tipi:* ${payment}%0A` +
    (note ? `*Sipariş Notu:* ${note}%0A` : '') +
    `--------------------------------%0A` +
    `*SİPARİŞ İÇERİĞİ:*%0A${orderLines}%0A` +
    `--------------------------------%0A` +
    `*TOPLAM TUTAR:* ₺${total.toFixed(2)}`;

  // Redirect to WhatsApp
  const waNumber = '905551234567';
  const waUrl = `https://wa.me/${waNumber}?text=${msg}`;

  alert('Siparişiniz başarıyla oluşturuldu! WhatsApp temsilcimize yönlendiriliyorsunuz...');
  window.open(waUrl, '_blank');

  // Clear cart and close modal
  cart = [];
  updateCartUI();
  closeCheckoutModal();
}

// District Service Time Checker
function checkDistrictDelivery() {
  const val = document.getElementById('district-search')?.value.toLowerCase();
  const pills = document.querySelectorAll('.district-pill');
  
  pills.forEach(p => {
    const text = p.innerText.toLowerCase();
    if (!val || text.includes(val)) {
      p.style.display = 'flex';
    } else {
      p.style.display = 'none';
    }
  });
}
