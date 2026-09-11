/* ELITEDRESS — js/favorites.js
   قائمة "المفضّلة" (Wishlist) — تخزين محلي بالمتصفح (localStorage)، منفصل
   تمامًا عن السلة (js/cart.js): هاي بس لحفظ فساتين تحبها الزائرة ترجع
   تتصفحها بسهولة بعدين، بدون أي نية شراء فورية. محمّل بكل الصفحات، بعد
   site.js وcart.js. */

const FAVORITES_STORAGE_KEY = 'elitedress_favorites_v1';

function getFavorites(){
  try{
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  }catch(e){
    return [];
  }
}

function saveFavorites(items){
  try{
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  }catch(e){
    // خزنة المتصفح ممتلئة أو غير متاحة — بتضل شغالة بالجلسة الحالية بس.
  }
  renderFavoritesBadge();
  paintFavoriteHearts();
}

function isFavorite(productId){
  return getFavorites().some(f => f.productId === productId);
}

/** item: {productId, name, image, price (رقم أو null)}. */
function toggleFavorite(item){
  const items = getFavorites();
  const idx = items.findIndex(f => f.productId === item.productId);
  if(idx > -1){
    items.splice(idx, 1);
  }else{
    items.push(item);
  }
  saveFavorites(items);
}

function removeFavorite(productId){
  saveFavorites(getFavorites().filter(f => f.productId !== productId));
  renderFavoritesPage();
}

function renderFavoritesBadge(){
  const count = getFavorites().length;
  const badge = document.getElementById('wishlistBadge');
  if(!badge) return;
  badge.textContent = count > 99 ? '99+' : String(count);
  badge.hidden = count === 0;
}

/** بتحدّث كل قلوب المفضّلة الظاهرة حاليًا بالصفحة (كروت المجموعة، أو
    زر المنتج بصفحته) عشان تعكس القائمة المحفوظة فعليًا — تُستدعى بعد كل
    عملية إضافة/حذف، وكمان لازم تُستدعى من كل صفحة بعد ما ترسم كروتها. */
function paintFavoriteHearts(){
  document.querySelectorAll('.fav-heart').forEach(btn => {
    btn.classList.toggle('active', isFavorite(btn.dataset.productId));
  });
}

function favoriteRowTemplate(item){
  const href = withSiteParam('product.html?id=' + encodeURIComponent(item.productId));
  return `
    <div class="cart-item">
      <a href="${href}" class="cart-item-img">${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy">` : ''}</a>
      <div class="cart-item-info">
        <a href="${href}"><h4>${item.name}</h4></a>
        <p class="cart-item-price">
          ${item.price === null || item.price === undefined ? t('order.price_on_request') : formatMoney(item.price, _cartCurrency)}
        </p>
        <a href="${href}" class="wishlist-view-link">${t('wishlist.view_product')} ←</a>
      </div>
      <button type="button" class="cart-item-remove" data-product-id="${item.productId}" aria-label="${t('cart.remove')}">✕</button>
    </div>`;
}

function renderFavoritesPage(){
  const body = document.getElementById('wishlistDrawerBody');
  if(!body) return;
  const items = getFavorites();
  if(items.length === 0){
    body.innerHTML = `<p class="cart-empty">${t('wishlist.empty')}</p>`;
    return;
  }
  body.innerHTML = items.map(favoriteRowTemplate).join('');
  body.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFavorite(btn.dataset.productId));
  });
}

function initFavoritesUI(){
  renderFavoritesBadge();
  paintFavoriteHearts();
}

document.addEventListener('DOMContentLoaded', initFavoritesUI);
document.addEventListener('langchange', renderFavoritesPage);
