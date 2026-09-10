/* ELITEDRESS — js/cart.js
   سلة مشتريات حقيقية (مش تفضيلات بس): بتجمع أكتر من منتج (بألوانه/مقاسه/
   أقمشته المختارة)، وبترسل طلب واحد لواتساب فيه كل المنتجات مع تفاصيلها،
   بدل ما الزبونة تبعت رسالة منفصلة لكل منتج. التخزين محلي (localStorage)
   بالمتصفح — نفس مبدأ الموقع كله (بدون حساب مستخدم أو باك-إند طلبات).
   محمّل بكل الصفحات، بعد site.js مباشرة (محتاج t/formatMoney/localizedField
   /buildWhatsAppLink منه). بيبني واجهة الدرج (الـdrawer) لحاله بالجافاسكربت
   — مش لازم تكرار الـHTML يدويًا بكل صفحة، بس المطلوب بكل صفحة هو زر
   السلة نفسه بالهيدر (#cartToggle) وتضمين هذا الملف. */

const CART_STORAGE_KEY = 'elitedress_cart_v1';
let _cartCurrency = '';
let _cartBuyPhone = '';

function getCart(){
  try{
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  }catch(e){
    return [];
  }
}

function saveCart(items){
  try{
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }catch(e){
    // خزنة المتصفح ممتلئة أو غير متاحة (وضع خاص) — السلة بتضل شغالة
    // بالجلسة الحالية بس، بدون ما توقف الموقع عن الشغل.
  }
  renderCartBadge();
}

function getCartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/** item: {productId, name, price (رقم أو null لو "السعر عند الطلب"),
    colorName, fabricsText, size, image}. عناصر بنفس المنتج + نفس اللون +
    نفس المقاس بتتجمع بزيادة الكمية بدل تكرار سطر منفصل. */
function addToCart(item){
  const items = getCart();
  const existing = items.find(i =>
    i.productId === item.productId && i.colorName === item.colorName && i.size === item.size
  );
  if(existing){
    existing.qty += 1;
  }else{
    items.push(Object.assign({ qty: 1 }, item));
  }
  saveCart(items);
}

function removeFromCart(index){
  const items = getCart();
  items.splice(index, 1);
  saveCart(items);
  renderCartDrawer();
}

function updateCartQty(index, delta){
  const items = getCart();
  if(!items[index]) return;
  items[index].qty += delta;
  if(items[index].qty < 1){
    items.splice(index, 1);
  }
  saveCart(items);
  renderCartDrawer();
}

function clearCart(){
  saveCart([]);
  renderCartDrawer();
}

function renderCartBadge(){
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.hidden = count === 0;
  });
}

function buildCartWhatsAppMessage(){
  const items = getCart();
  const lines = [t('cart.msg_intro'), ''];
  let total = 0;
  let hasPriceOnRequest = false;

  items.forEach((item, i) => {
    lines.push((i + 1) + '. ' + item.name);
    if(item.price === null || item.price === undefined){
      lines.push('   ' + t('order.price_label') + ': ' + t('order.price_on_request'));
      hasPriceOnRequest = true;
    }else{
      lines.push('   ' + t('order.price_label') + ': ' + formatMoney(item.price, _cartCurrency));
      total += item.price * item.qty;
    }
    if(item.colorName) lines.push('   ' + t('order.color_label') + ': ' + item.colorName);
    if(item.fabricsText) lines.push('   ' + t('order.fabrics_label') + ': ' + item.fabricsText);
    if(item.size) lines.push('   ' + t('order.size_label') + ': ' + item.size);
    lines.push('   ' + t('cart.qty_label') + ': ' + item.qty);
    lines.push('');
  });

  lines.push('---');
  if(total > 0){
    lines.push(t('cart.total_label') + ': ' + formatMoney(total, _cartCurrency) + (hasPriceOnRequest ? ' (+ ' + t('order.price_on_request') + ')' : ''));
  }
  return lines.join('\n');
}

function cartItemRowTemplate(item, index){
  return `
    <div class="cart-item">
      <div class="cart-item-img">${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy">` : ''}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-item-meta">
          ${[item.colorName, item.fabricsText, item.size].filter(Boolean).join(' · ')}
        </p>
        <p class="cart-item-price">
          ${item.price === null || item.price === undefined ? t('order.price_on_request') : formatMoney(item.price, _cartCurrency)}
        </p>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" data-action="dec" data-index="${index}" aria-label="-">−</button>
          <span>${item.qty}</span>
          <button type="button" class="qty-btn" data-action="inc" data-index="${index}" aria-label="+">+</button>
        </div>
      </div>
      <button type="button" class="cart-item-remove" data-index="${index}" aria-label="${t('cart.remove')}">✕</button>
    </div>`;
}

function renderCartDrawer(){
  const body = document.getElementById('cartDrawerBody');
  const footer = document.getElementById('cartDrawerFooter');
  if(!body) return;

  const items = getCart();

  if(items.length === 0){
    body.innerHTML = `<p class="cart-empty">${t('cart.empty')}</p>`;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = items.map((item, i) => cartItemRowTemplate(item, i)).join('');

  let total = 0;
  let hasPriceOnRequest = false;
  items.forEach(item => {
    if(item.price === null || item.price === undefined){ hasPriceOnRequest = true; }
    else{ total += item.price * item.qty; }
  });

  const totalLine = total > 0
    ? `<div class="cart-total">${t('cart.total_label')}: <strong>${formatMoney(total, _cartCurrency)}</strong>${hasPriceOnRequest ? ' <span>(+ ' + t('order.price_on_request') + ')</span>' : ''}</div>`
    : `<div class="cart-total">${t('order.price_on_request')}</div>`;

  footer.innerHTML = `
    ${totalLine}
    <a href="#" id="cartCheckoutBtn" class="whatsapp-cta" style="width:100%;justify-content:center;">
      ${t('cart.checkout')}
    </a>
    <button type="button" id="cartClearBtn" class="cart-clear-btn">${t('cart.clear')}</button>`;

  document.getElementById('cartCheckoutBtn').href = buildWhatsAppLink(_cartBuyPhone, buildCartWhatsAppMessage());
  document.getElementById('cartClearBtn').addEventListener('click', clearCart);

  body.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      updateCartQty(idx, btn.dataset.action === 'inc' ? 1 : -1);
    });
  });
  body.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.index, 10)));
  });
}

function openCartDrawer(){
  renderCartDrawer();
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer(){
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

/** كل صفحة، بعد ما تجيب getSettings()، بتنادي هالدالة مرة وحدة عشان
    السلة تعرف العملة ورقم واتساب التاجر (مش معروفين قبل هيك). */
function setCartContext(currency, buyPhone){
  _cartCurrency = currency;
  _cartBuyPhone = buyPhone;
}

function injectCartDrawerMarkup(){
  if(document.getElementById('cartDrawer')) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="cartOverlay" class="cart-overlay"></div>
    <aside id="cartDrawer" class="cart-drawer" role="dialog" aria-label="${t('cart.title')}">
      <div class="cart-drawer-head">
        <h3>${t('cart.title')}</h3>
        <button type="button" id="cartCloseBtn" aria-label="${t('cart.close_aria')}">✕</button>
      </div>
      <div id="cartDrawerBody" class="cart-drawer-body"></div>
      <div id="cartDrawerFooter" class="cart-drawer-footer"></div>
    </aside>`;
  document.body.appendChild(wrap);

  document.getElementById('cartCloseBtn').addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);
}

function initCartUI(){
  injectCartDrawerMarkup();
  renderCartBadge();
  document.querySelectorAll('#cartToggle').forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });
}

document.addEventListener('DOMContentLoaded', initCartUI);
