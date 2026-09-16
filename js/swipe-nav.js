/**
 * ELITEDRESS — js/swipe-nav.js
 * ==========================================================
 * سحب (Swipe) يمين/شمال بأي مكان بالصفحة على الموبايل للتنقّل بين صفحات
 * القائمة الرئيسية (نفس ترتيب nav#mainNav المكرر بكل صفحة):
 *   الرئيسية → المجموعة → من نحن → تواصل معنا → فصّلي فستانك → المفضّلة → السلة
 *
 * الاتجاه يعتمد على لغة الموقع الحالية (نفس منطق dir=rtl/ltr بـi18n.js):
 *   - بالإنجليزي (LTR): سحب لليسار = الصفحة التالية، سحب لليمين = السابقة.
 *   - بالعربي (RTL): بينعكس تلقائيًا — سحب لليمين = التالية، لليسار = السابقة.
 *   هيك اتجاه التنقل بيطابق اتجاه القراءة/التصفح الطبيعي لكل لغة، وبينعكس
 *   فورًا مع تبديل اللغة لأنه بيتحقق من document.documentElement[dir]
 *   بلحظة السحب نفسها (مش قيمة محفوظة مسبقًا).
 *
 * لتفادي أي تعارض مع مناطق عندها سحب أفقي خاص فيها أصلاً (صف روابط
 * الهيدر بالموبايل، معرض الصور المصغّر جوا كروت المجموعة، شريط صور
 * صفحة المنتج المصغّرة...)، أي لمسة تبدأ جوا عنصر قادر يتمرّر أفقيًا
 * فعليًا (أو جوا حقل إدخال/قائمة بحث) بتتجاهَل بالكامل — القائمة
 * الأصلية بتشتغل عادي زي ما هي بدون أي تدخل.
 */
(function(){
  var PAGE_ORDER = [
    'index.html',
    'collection.html',
    'about.html',
    'contact.html',
    'custom-order.html',
    'wishlist.html',
    'cart.html'
  ];

  var MIN_DISTANCE = 65;        // أقل مسافة أفقية (px) تُعتبر سحب مقصود
  var MAX_DURATION = 650;       // أقصى مدة (ms) — أبطأ من هيك = تمرير عادي مش نية تنقّل
  var MAX_VERTICAL_RATIO = 0.55; // الحركة العمودية لازم تضل أصغر بوضوح من الأفقية

  function currentPageName(){
    var path = window.location.pathname;
    var last = path.substring(path.lastIndexOf('/') + 1);
    return last || 'index.html';
  }

  /** بيتأكد إذا كانت اللمسة بدأت جوا عنصر (أو أي سلف إله) قادر يتمرّر
      أفقيًا فعليًا حاليًا — عشان نسيبه يشتغل بمنطقه الطبيعي (سحب صور،
      قائمة هيدر الموبايل...) بدون ما نخطف اللمسة منه. */
  function hasHorizontalScrollAncestor(el){
    while(el && el !== document.body && el !== document.documentElement){
      if(el.scrollWidth > el.clientWidth + 2){
        var overflowX = window.getComputedStyle(el).overflowX;
        if(overflowX === 'auto' || overflowX === 'scroll') return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  function isExcludedTarget(el){
    if(!el || !el.closest) return false;
    return !!el.closest(
      'input, textarea, select, [contenteditable="true"], ' +
      '.search-bar, #mainNav, .card-carousel, .gallery-thumbs, [data-no-swipe-nav]'
    );
  }

  var startX = 0, startY = 0, startTime = 0, tracking = false, ignoreGesture = false;

  document.addEventListener('touchstart', function(e){
    if(e.touches.length !== 1){ ignoreGesture = true; tracking = false; return; }
    var target = e.touches[0].target;
    if(isExcludedTarget(target) || hasHorizontalScrollAncestor(target)){
      ignoreGesture = true;
      tracking = false;
      return;
    }
    ignoreGesture = false;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', function(e){
    if(!tracking || ignoreGesture){ tracking = false; return; }
    tracking = false;

    var touch = e.changedTouches && e.changedTouches[0];
    if(!touch) return;

    var deltaX = touch.clientX - startX;
    var deltaY = touch.clientY - startY;
    var elapsed = Date.now() - startTime;
    var absX = Math.abs(deltaX);
    var absY = Math.abs(deltaY);

    if(elapsed > MAX_DURATION) return;
    if(absX < MIN_DISTANCE) return;
    if(absY > absX * MAX_VERTICAL_RATIO) return;

    // اتجاه اللغة الحالي — يُقرأ بلحظة السحب نفسها، فبينعكس فورًا مع تبديل اللغة
    var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    var swipedLeft = deltaX < 0;
    // بالـLTR سحب لليسار = تالي. بالـRTL بينعكس: سحب لليمين = تالي.
    var goNext = isRTL ? !swipedLeft : swipedLeft;

    navigate(goNext ? 1 : -1, swipedLeft ? 'left' : 'right');
  }, { passive: true });

  document.addEventListener('touchcancel', function(){
    tracking = false;
    ignoreGesture = false;
  }, { passive: true });

  function navigate(direction, physicalSide){
    var current = currentPageName();
    var idx = PAGE_ORDER.indexOf(current);
    if(idx === -1) return; // صفحة برّا القائمة (مثلاً product.html) — لا تنقّل تلقائي

    var nextIdx = idx + direction;
    if(nextIdx < 0 || nextIdx >= PAGE_ORDER.length) return; // بحافة القائمة، لا شي يصير

    var target = PAGE_ORDER[nextIdx];
    var href = (typeof withSiteParam === 'function') ? withSiteParam(target) : target;

    document.body.classList.add('swipe-nav-leave-' + physicalSide);
    setTimeout(function(){ window.location.href = href; }, 140);
  }
})();
