/**
 * ELITEDRESS — js/site.js
 * Shared helpers used by every page. Loaded after js/data.js.
 */

/** BUG FIX — لما تتصفّحي أي صفحة غير الأولى، رابط ?s=xxx كان عم يضيع
    من الروابط الداخلية (القائمة، بطاقات المنتجات، الفوتر...) لأنها
    كلها href="collection.html" جامدة بدون الباراميتر. النتيجة: أول
    صفحة تفتحيها فيها بيانات حقيقية، وأي صفحة تنتقلي لها بعدها ترجع
    تلقائياً للبيانات التجريبية لأنه getSubdomain() ما عاد لاقي s.
    هاد بيلحق كل <a> بتشاور على صفحة .html من نفس الموقع، ويضيف/يحدّث
    باراميتر s فيها ليطابق الحالي — قبل ما المستخدم يقدر يضغط أي رابط. */
/** RESILIENCE — بعض الشبكات/المتصفحات بتفشل تحمّل صورة معيّنة أول
    مرة (انقطاع مؤقت، وسيط ضغط صور بشبكة الزائر...) رغم إنه الملف
    والرابط سليمين 100% من طرفنا. هاي الدالة بتحطّ على كل <img> إلها
    صورة منتج محاولة تلقائية تانية (برابط جديد يتجاوز أي نسخة مخزّنة
    عالطريق)، وإذا فشلت المحاولة الثانية كمان بتستبدل الصورة بخلفية
    أنيقة بدل أيقونة "الصورة معطوبة" يلي بيعرضها المتصفح افتراضيًا. */
function armImageFallback(img){
  if(!img || img.dataset.armed) return;
  img.dataset.armed = '1';
  img.addEventListener('error', function onErr(){
    var tries = parseInt(img.dataset.retryCount || '0', 10);
    var original = img.dataset.origSrc || img.src;
    img.dataset.origSrc = original;
    if(tries < 1){
      img.dataset.retryCount = String(tries + 1);
      var sep = original.indexOf('?') > -1 ? '&' : '?';
      setTimeout(function(){
        img.src = original + sep + '_retry=' + Date.now();
      }, 600);
    }else{
      img.removeEventListener('error', onErr);
      img.classList.add('img-fallback');
      img.removeAttribute('src');
      img.alt = ''; // فارغة قصداً، مش img.alt || '' — هاي كانت ما بتصفّر
                     // القيمة القديمة (اسم المنتج) أبداً، فكان اسم المنتج
                     // يضل ظاهر فوق الخلفية الذهبية كنص "صورة معطوبة" من
                     // المتصفح، بدل ما تبين خلفية نظيفة فاضية زي المقصود.
    }
  });
}
function armImageFallbacksIn(root){
  (root || document).querySelectorAll('img').forEach(armImageFallback);
}
document.addEventListener('DOMContentLoaded', function(){ armImageFallbacksIn(document); });

/** "معرض حيّ" — عناصر عليها كلاس reveal-on-scroll بتظهر بحركة ناعمة (تعتيم +
    انزلاق للأعلى) أول ما توصل لمنطقة الشاشة الظاهرة، بدل ما تطلع كلها دفعة
    وحدة. بتشتغل مرة وحدة بس لكل عنصر (ما بترجع تختفي لو رجع المستخدم للفوق).
    إذا المتصفح ما بيدعم IntersectionObserver، أو المستخدم مفعّل خيار "تقليل
    الحركة" بجهازه، العناصر بتظهر عادي فورًا بدون أي تأخير أو حركة — الحركة
    زخرفة بس، ما لازم تمنع حدا من شوف المحتوى. */
function armScrollReveal(root){
  var els = Array.prototype.filter.call(
    (root || document).querySelectorAll('.reveal-on-scroll'),
    function(el){ return !el.dataset.revealArmed; }
  );
  if(!els.length) return;
  els.forEach(function(el){ el.dataset.revealArmed = '1'; });

  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in-view'); });
    return;
  }
  els.forEach(function(el, i){ el.style.transitionDelay = (i % 8) * 55 + 'ms'; });
  var io = new IntersectionObserver(function(entries, observer){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el){ io.observe(el); });
}
document.addEventListener('DOMContentLoaded', function(){ armScrollReveal(document); });

function preserveSiteParam(){
  var s = new URLSearchParams(window.location.search).get('s');
  if(!s) return;
  document.querySelectorAll('a[href]').forEach(function(a){
    var href = a.getAttribute('href');
    if(!href || /^(https?:|mailto:|tel:|whatsapp:|#)/i.test(href)) return;
    if(!/\.html(\?|#|$)/i.test(href)) return;
    try{
      var url = new URL(href, window.location.href);
      url.searchParams.set('s', s);
      a.setAttribute('href', url.pathname + url.search + url.hash);
    }catch(e){ /* رابط غير صالح — تجاهليه */ }
  });
}
document.addEventListener('DOMContentLoaded', preserveSiteParam);

/** BUG FIX — نفس مشكلة preserveSiteParam فوق، بس لروابط بتتولّد بـ JS
    بعد DOMContentLoaded (بطاقات المنتجات بصفحة المجموعة، روابط "تصفّحي
    المجموعة" بحالة "غير موجود" بصفحة المنتج...). preserveSiteParam ما
    بتشوفها أصلاً لأنها لسا مو موجودة بالـ DOM وقت ما اشتغلت. هاي الدالة
    بتضيف ?s=xxx مباشرة وقت بناء الرابط نفسه، بدل ما تعتمد على مسح
    الصفحة بعدين. تُستخدم بكل مكان بيتبنى فيه href ديناميكيًا بـ JS. */
function withSiteParam(path){
  var s = getSubdomain();
  if(!s) return path;
  try{
    var url = new URL(path, window.location.href);
    url.searchParams.set('s', s);
    return url.pathname + url.search + url.hash;
  }catch(e){ return path; }
}

/** على الموبايل، زر واتساب وقائمة اللغة بيصيروا عناصر ثابتة على الشاشة
    (position:fixed) — زر واتساب أسفل يمين، واللغة أعلى يسار، خارج
    الهيدر تمامًا. لازم ننقلهم فعليًا يصيروا أولاد مباشرين لـ<body>،
    لأنه الهيدر نفسه فيه backdrop-filter، وهاي خاصية معروفة بالمتصفحات:
    أي عنصر position:fixed جوا سلف عنده filter/backdrop-filter بيتموضع
    بالنسبة لهداك السلف مش لكامل الشاشة. على الديسكتوب منرجعهم بالضبط
    لمكانهم الأصلي جوا الهيدر — الشكل هناك يضل زي ما هو تمامًا. */
function relocateHeaderFixedItems(){
  var whatsapp = document.getElementById('headerWhatsapp');
  var langToggle = document.querySelector('.lang-toggle');
  if(!whatsapp && !langToggle) return;

  var whatsappHome = whatsapp ? whatsapp.parentNode : null;
  var whatsappNext = whatsapp ? whatsapp.nextSibling : null;
  var langHome = langToggle ? langToggle.parentNode : null;
  var langNext = langToggle ? langToggle.nextSibling : null;

  function apply(){
    var isMobile = window.matchMedia('(max-width:860px)').matches;
    if(isMobile){
      if(whatsapp && whatsapp.parentNode !== document.body) document.body.appendChild(whatsapp);
      if(langToggle && langToggle.parentNode !== document.body) document.body.appendChild(langToggle);
    }else{
      if(whatsapp && whatsappHome && whatsapp.parentNode !== whatsappHome){
        whatsappHome.insertBefore(whatsapp, whatsappNext);
      }
      if(langToggle && langHome && langToggle.parentNode !== langHome){
        langHome.insertBefore(langToggle, langNext);
      }
    }
  }
  apply();
  window.addEventListener('resize', apply);
}

/** صندوق بحث علوي بسيط، متاح من أي صفحة (زر 🔍 بالهيدر) — بيبعت
    الكلمة لصفحة المجموعة وهي يلي بتعمل الفلترة الفعلية بأسماء المنتجات
    (عربي وإنجليزي معًا). العنصر بيتحقن مرة وحدة بالـ<body> ومشترك بكل
    الصفحات، نفس مبدأ درج السلة/المفضّلة. */
function injectSearchBar(){
  if(document.getElementById('searchBar')) return;
  const wrap = document.createElement('div');
  wrap.innerHTML =
    '<div id="searchBar" class="search-bar">' +
      '<form id="searchForm">' +
        '<input type="search" id="searchInput" placeholder="' + t('search.placeholder') + '" autocomplete="off">' +
        '<button type="submit" aria-label="' + t('search.aria_submit') + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
        '</button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(wrap);

  document.getElementById('searchForm').addEventListener('submit', function(e){
    e.preventDefault();
    var q = document.getElementById('searchInput').value.trim();
    if(!q) return;
    window.location.href = withSiteParam('collection.html?search=' + encodeURIComponent(q));
  });

  document.querySelectorAll('#searchToggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var bar = document.getElementById('searchBar');
      bar.classList.toggle('open');
      if(bar.classList.contains('open')) document.getElementById('searchInput').focus();
    });
  });
}

function initNav(){
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  relocateHeaderFixedItems();
  injectSearchBar();
  if(!navToggle || !mainNav) return;
  navToggle.addEventListener('click', function(){
    var isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

/** BUG FIX (السبب الحقيقي وراء "صور المنتجات ما عم تظهر") — الصور
    الحقيقية يلي بترفعها التاجرة عبر محرر آرفيكس ما كانت تظهر أبداً
    بالموقع، رغم إنه نفس الرابط يشتغل 100% لو انفتح مباشرة (زي ما
    تأكّد سابقاً بأداة خارجية). السبب الفعلي ماله علاقة بالشبكة أو
    Supabase أو نيتفلاي: كانت موجودة دالة toWebp(path) بتبني رابط
    ملف ".webp" افتراضي بس بتبدّل امتداد الاسم (مثلاً "xxx.jpg" ->
    "xxx.webp")، وبتحطه بوسم <source type="image/webp"> جوا <picture>
    (بصفحتي المجموعة والمنتج). المشكلة: هاد الملف .webp ما إله وجود
    فعلي بالتخزين أبداً — Supabase Storage بترفع بالضبط نفس الملف يلي
    التاجرة اختارته من جهازها (jpg أو png)، ما بتولّد نسخة .webp
    موازية تلقائياً. أي متصفح حديث (كلهم تقريباً) بيدعم webp، فكان
    دايماً يختار هاد المصدر المكسور ويطلبه، ياخد 404، وهاد الفشل كان
    يوصل لـ armImageFallback فوق فيعتبرها "صورة فشلت نهائياً" ويستبدلها
    بالخلفية الذهبية — بينما الصورة الأصلية (jpg/png) شغالة تمام. هيك
    تفسير ليش اختبار الرابط لحاله (خارج الموقع) كان دايماً ناجح 100%:
    الموقع نفسه عمره ما كان بيطلب هداك الرابط — كان دايماً بيطلب نسخة
    .webp وهمية غير موجودة، لأي منتج حقيقي مرفوع.
    الحل: حذف toWebp() و<picture>/<source webp> نهائياً من صور
    المنتجات الديناميكية (بطاقة المجموعة + صورة صفحة المنتج)،
    والاكتفاء بـ <img src> مباشر على نفس الرابط الحقيقي المخزّن
    بقاعدة البيانات — تماماً متل ما هو مطبّق أصلاً وبنجاح على صور
    شرائح الأقمشة وصور المعرض المصغّرة بنفس الملف (ما بتستخدم
    <picture> أبداً). التحويل التلقائي لـwebp ما عاد مستخدم بأي مكان
    بالكود — بطاقات الصفحة الرئيسية (index.html) عندها زوج jpg+webp
    حقيقي مرفوع يدوياً مسبقاً، ومكتوبين صراحة بالـHTML بدون الاعتماد
    على أي دالة. لأي رفع مستقبلي لصور حقيقية، لازم يتولّد ملف .webp
    فعلي ويترفع فعلياً جنب الأصلي (تحويل من طرف الخادم أو أداة رفع
    مخصصة) قبل التفكير باستخدام هاد النمط من جديد — وإلا نفس المشكلة
    بالضبط رح ترجع. */

function buildWhatsAppLink(phone, message){
  var cleanPhone = String(phone || '').replace(/[^\d]/g, '');
  return 'https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(message);
}

function formatMoney(amount, currency){
  var rounded = Math.round(amount * 100) / 100;
  return rounded.toLocaleString('ar') + ' ' + currency;
}

/** Returns the discount info for a product if one is currently active. */
function getActiveDiscount(product){
  if(!product.discount_type || !product.discount_value || !product.discount_ends_at) return null;
  var endsAt = new Date(product.discount_ends_at).getTime();
  if(isNaN(endsAt) || endsAt <= Date.now()) return null;
  if(product.price === null || product.price === undefined || product.price === '') return null;

  var newPrice = product.discount_type === 'percent'
    ? product.price - (product.price * product.discount_value / 100)
    : product.price - product.discount_value;
  if(newPrice < 0) newPrice = 0;

  return { newPrice: newPrice, endsAt: product.discount_ends_at };
}

/** Renders the price block HTML for a product card or detail page. */
/**
 * localizedField(obj, field) — بترجع obj[field+'_en'] لو الموقع
 * بوضع الإنجليزي وهاد الحقل مترجم فعلاً (تعبّى تلقائيًا من آرفيكس
 * وقت الحفظ، أو يدويًا)، وإلا بترجع obj[field] الأصلي (عربي دايمًا).
 * هيك أي منتج/قسم لسا ما انترجم يضل يبين بالعربي حتى بوضع الإنجليزي،
 * بدل ما يبين فاضي.
 */
function localizedField(obj, field){
  if(!obj) return '';
  var lang = (typeof getLang === 'function') ? getLang() : 'ar';
  if(lang === 'en' && obj[field + '_en']) return obj[field + '_en'];
  return obj[field] || '';
}

function renderPriceHTML(product, currency){
  var noPrice = product.price === null || product.price === undefined || product.price === '';
  if(noPrice){
    return '<p class="price-on-request">' + t('price.on_request') + '</p>';
  }

  var discount = getActiveDiscount(product);
  if(discount){
    return (
      '<div class="price-row">' +
        '<span class="price-current">' + formatMoney(discount.newPrice, currency) + '</span>' +
        '<span class="price-original">' + formatMoney(product.price, currency) + '</span>' +
      '</div>' +
      '<div class="discount-countdown" data-ends="' + discount.endsAt + '">' +
        '⏳ <span class="countdown-text">--:--:--</span>' +
      '</div>'
    );
  }

  return '<div class="price-row"><span class="price-current">' + formatMoney(product.price, currency) + '</span></div>';
}

/** Starts live countdowns for every .discount-countdown element under root.
    When one expires, it removes the strikethrough price and countdown,
    leaving the original price shown as the normal current price. */
function initCountdowns(root){
  root = root || document;
  root.querySelectorAll('.discount-countdown').forEach(function(el){
    var endsAt = new Date(el.dataset.ends).getTime();
    var textEl = el.querySelector('.countdown-text');

    function tick(){
      var diff = endsAt - Date.now();
      if(diff <= 0){
        clearInterval(timer);
        var wrap = el.previousElementSibling; // .price-row
        if(wrap && wrap.classList.contains('price-row')){
          var originalEl = wrap.querySelector('.price-original');
          var currentEl = wrap.querySelector('.price-current');
          if(originalEl && currentEl){
            currentEl.textContent = originalEl.textContent;
            originalEl.remove();
          }
        }
        el.remove();
        return;
      }
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var pad = function(n){ return String(n).padStart(2, '0'); };
      textEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    }
    tick();
    var timer = setInterval(tick, 1000);
  });
}

/** Simple line-style SVG glyphs for the contact page — generic
    representations, not brand logo reproductions. */
var SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.5 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3.5 20.5l1.4-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.2 2.1 3.8 4.3 4.1"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2h3.3l-.5 3H11.5v6.5"/><circle cx="12" cy="12" r="9"/></svg>',
  snapchat: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3.5c2.2 0 4 1.9 4 4.3v2.1c0 .5.4 1.1 1.4 1.6.6.3.4 1.1-.1 1.3-.6.2-1 .4-1 .8 0 .5.9 1 2 1.3.4.1.4.7 0 .9-.6.3-1.3.4-1.7.6-.3.1-.3.4-.5.8-.3.6-1 .8-2 .6-.7-.1-1.3-.3-2.1-.3s-1.4.2-2.1.3c-1 .2-1.7 0-2-.6-.2-.4-.2-.7-.5-.8-.4-.2-1.1-.3-1.7-.6-.4-.2-.4-.8 0-.9 1.1-.3 2-.8 2-1.3 0-.4-.4-.6-1-.8-.5-.2-.7-1 -.1-1.3 1-.5 1.4-1.1 1.4-1.6V7.8c0-2.4 1.8-4.3 4-4.3z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 4 3 11.5l6 2.2M21 4 15.5 20l-6.5-6.3M21 4l-11.5 9.9"/></svg>',
  location: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>'
};

// ملاحظة: أسماء المنصات (انستغرام، واتساب...) صارت بقاموس i18n.js
// (مفاتيح social.*) عشان تترجم مع باقي الموقع، مش هون. الدالة تحت
// ضلّت موجودة كـfallback بس لو t() مش محمّل لأي سبب (ترتيب تحميل خاطئ
// بصفحة قديمة مثلاً).
var SOCIAL_LABELS = {
  instagram: 'انستغرام',
  whatsapp: 'واتساب',
  tiktok: 'تيك توك',
  facebook: 'فيسبوك',
  snapchat: 'سناب شات',
  telegram: 'تيليجرام',
  location: 'الموقع الجغرافي'
};
function socialLabel(platform){
  if(typeof t === 'function'){
    var key = 'social.' + platform;
    var val = t(key);
    if(val !== key) return val;
  }
  return SOCIAL_LABELS[platform] || platform;
}

/** Same glyph set used for the footer's contact rows (email/phone/location). */
var CONTACT_ICONS = {
  email: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6.5 9 6.5 9-6.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></svg>',
  location: SOCIAL_ICONS.location
};

/**
 * renderFooterContact(settings)
 * ------------------------------
 * Builds the footer's contact rows (email / phone / location), each with
 * its own icon. Every row is optional and independent — a missing field
 * simply means that row doesn't render, same "hide if empty" rule used
 * throughout the site (category filters, product gallery, sizes...).
 * Shared by every page's footer so the markup/behavior never drifts.
 */
function renderFooterContact(settings){
  var rows = '';
  if(settings.contact_email){
    rows += '<div class="footer-row"><span class="footer-icon">' + CONTACT_ICONS.email + '</span>' +
      '<a href="mailto:' + settings.contact_email + '" class="selectable">' + settings.contact_email + '</a></div>';
  }
  if(settings.contact_phone){
    rows += '<div class="footer-row"><span class="footer-icon">' + CONTACT_ICONS.phone + '</span>' +
      '<span class="selectable">' + settings.contact_phone + '</span></div>';
  }
  var locationLink = (settings.social_links || []).find(function(s){ return s && s.platform === 'location' && s.url; });
  if(locationLink){
    rows += '<div class="footer-row"><span class="footer-icon">' + CONTACT_ICONS.location + '</span>' +
      '<a href="' + locationLink.url + '" target="_blank" rel="noopener">' + socialLabel('location') + '</a></div>';
  }
  return rows;
}

/**
 * buildProductOrderMessage(product, currency, selectedColorName, selectedSize)
 * ------------------------------------------------------------------------------
 * Builds the structured WhatsApp order message for the product detail page.
 * Each line is optional and only appears when the underlying data exists —
 * a product with no `colors` won't show "اللون المختار", one with no
 * `fabrics` won't show "الأقمشة", and an unselected size won't show
 * "المقاس". The customer can still edit the text in WhatsApp before sending.
 */
function buildProductOrderMessage(product, currency, selectedColorName, selectedSize){
  var lines = [];
  lines.push(t('order.msg_title') + ': ' + localizedField(product, 'name'));

  var noPrice = product.price === null || product.price === undefined || product.price === '';
  var priceText;
  if(noPrice){
    priceText = t('order.price_on_request');
  }else{
    var discount = getActiveDiscount(product);
    priceText = formatMoney(discount ? discount.newPrice : product.price, currency);
  }
  lines.push(t('order.price_label') + ': ' + priceText);

  if(selectedColorName){
    lines.push(t('order.color_label') + ': ' + selectedColorName);
  }

  var fabrics = Array.isArray(product.fabrics) ? product.fabrics.filter(function(f){ return f && f.name; }) : [];
  if(fabrics.length){
    lines.push(t('order.fabrics_label') + ': ' + fabrics.map(function(f){ return localizedField(f, 'name'); }).join(t('list.separator')));
  }

  if(selectedSize){
    lines.push(t('order.size_label') + ': ' + selectedSize);
  }

  lines.push('---');
  return lines.join('\n');
}

/** Converts a #rrggbb (or #rgb) hex color to an rgba() string at the given
    alpha — used to build the badge's translucent "glass" background from a
    fabric's own ribbon_from/ribbon_to, since CSS custom properties can't
    do that alpha blending on their own without newer color-mix() support. */
function hexToRgba(hex, alpha){
  var fallback = 'rgba(184,134,11,' + alpha + ')';
  if(!hex) return fallback;
  var h = hex.replace('#', '');
  if(h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
  var num = parseInt(h, 16);
  if(isNaN(num)) return fallback;
  var r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

/** Mixes two #rrggbb hex colors at ratio t (0=hex1, 1=hex2), then lightens
    the result toward white by `lighten` (0-1) — used to build the
    brighter mid-stop of the fabric badge's 3-color gradient so it reads
    as a polished, lit surface instead of a flat 2-color fade. */
function hexMixLighten(hex1, hex2, t, lighten){
  function toRgb(hex){
    var h = (hex || '').replace('#', '');
    if(h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
    var num = parseInt(h, 16);
    if(isNaN(num)) num = 0xB8860B;
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  var c1 = toRgb(hex1), c2 = toRgb(hex2);
  var mixed = c1.map(function(v, i){ return v + (c2[i] - v) * t; });
  var lit = mixed.map(function(v){ return v + (255 - v) * lighten; });
  return '#' + lit.map(function(v){
    return Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  }).join('');
}

/** Resolves the show_on_card fabric list for a product into the shape each
    card's fabric badge needs (name, strip_color fallback, image_url,
    ribbon_from/ribbon_to as near-opaque, saturated rgba() for a vivid
    glossy background)
    — image_url/ribbon colors come from the map returned by
    getFabricDetails(). One badge is rendered per fabric in this list
    (stacked, not rotated) — see cardTemplate() in collection.html. */
function getCardFabrics(product, fabricDetails){
  if(!Array.isArray(product.fabrics)) return [];
  return product.fabrics
    .filter(function(f){ return f && f.show_on_card && f.name; })
    .map(function(f){
      var details = (fabricDetails && fabricDetails[f.fabric_id]) || {};
      var ribbonFrom = details.ribbon_from || f.strip_color || '#B8860B';
      var ribbonTo = details.ribbon_to || f.strip_color || '#5A3D1B';
      var ribbonMid = hexMixLighten(ribbonFrom, ribbonTo, 0.5, 0.28);
      return {
        name: f.name,
        name_en: f.name_en,
        strip_color: f.strip_color,
        image_url: details.image_url || '',
        ribbon_from_a: hexToRgba(ribbonFrom, 0.94),
        ribbon_to_a: hexToRgba(ribbonTo, 0.94),
        ribbon_mid_a: hexToRgba(ribbonMid, 0.94)
      };
    });
}
