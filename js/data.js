/**
 * ELITEDRESS — js/data.js
 * ========================
 * هاد الملف إلزامي حسب مواصفات دمج أرفيكس، ولازم يتحمّل قبل أي JS
 * تفاعلي بالموقع. لا تغيّري أسماء الدوال ولا المتغيرات تحت — هاي
 * بالضبط زي ما وصلت بملف قواعد الدمج.
 *
 * قبل هالسطر لازم يكون محمّل:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.1"></script>
 */

var SUPA = supabase.createClient(
  "https://ksqscfvmptfxxjnstxeh.supabase.co",
  "sb_publishable_RxYXx9v8OxSCBIA01H02ew_of8aCPm7"
);

/**
 * اسم bucket تخزين الصور المرفقة بطلبات "فصّلي فستانك" (صفحة التفصيل
 * المخصص). هاد اسم مبدئي/placeholder — لازم يتأكد ويتحدّث فعلياً حسب
 * bucket الحقيقي المتفق عليه مع أرفيكس قبل تفعيل الرفع الفعلي بالإنتاج.
 */
var CUSTOM_ORDER_IMAGE_BUCKET = "custom-order-references";

function getSubdomain(){
  var params = new URLSearchParams(window.location.search);
  return params.get('s');
}

async function loadSiteData(){
  var subdomain = getSubdomain();
  var res = await SUPA.rpc('get_public_site', { p_subdomain: subdomain });
  if(res.error || !res.data || !res.data.length) { /* اعرض حالة "غير متاح" */ return null; }
  var site = res.data[0];
  if(site.status !== 'active' || site.enabled === false) { /* اعرض حالة "موقوف مؤقتًا" */ return null; }
  return site.settings;
}


/**
 * === ما تحت هذا السطر مو جزء من مواصفات أرفيكس الرسمية ===
 * إضافات مساعدة بس، لتشغيل نفس الصفحات محلياً وقت المعاينة (بدون
 * رابط ?s= حقيقي أو اتصال بقاعدة بيانات فعلية)، وضمان إن الموقع ما
 * ينكسر لو loadSiteData() رجعت null. لما يصير فيه subdomain حقيقي
 * ومتصل، getSettings() رح ترجع بيانات Supabase الحقيقية تلقائياً
 * ومارح تستخدم القيم التجريبية تحت نهائياً.
 */
var PLACEHOLDER_SETTINGS = {
  currency: "د.إ",
  buy_phone: "9665XXXXXXXX",
  contact_phone: "+966 5X XXX XXXX",
  contact_email: "info@elitedress.example",
  social_links: [
    { platform: "instagram", url: "https://instagram.com/elitedress" },
    { platform: "whatsapp",  url: "https://wa.me/9665XXXXXXXX" },
    { platform: "tiktok",    url: "https://tiktok.com/@elitedress" },
    { platform: "facebook",  url: "https://facebook.com/elitedress" },
    { platform: "snapchat",  url: "https://snapchat.com/add/elitedress" },
    { platform: "telegram",  url: "https://t.me/elitedress" },
    { platform: "location",  url: "https://maps.google.com/?q=Riyadh+Saudi+Arabia" }
  ],
  categories: [
    { id: "evening",     label: "فساتين سهرة" },
    { id: "wedding",     label: "فساتين أعراس" },
    { id: "engagement",  label: "فساتين خطوبة" },
    { id: "royal",       label: "فساتين ملكية" }
  ],
  /* مكتبة الأقمشة على مستوى الموقع كامل — تُستخدم بصفحة "فصّلي فستانك"
     لتوليد قائمة الاختيار المتعدد، بشكل مستقل عن أقمشة أي منتج معيّن.
     نفس معرّفات id هنا هي يلي بترتبط فيها fabric_id بأقمشة كل منتج تحت،
     وهيي المفتاح المستخدم للاستعلام عن صورة القماش من جدول fabrics. */
  fabrics_library: [
    { id: "silk",    name: "حرير طبيعي",     strip_color: "#C9A15A" },
    { id: "chiffon", name: "شيفون",          strip_color: "#8FA6B2" },
    { id: "lace",    name: "دانتيل فرنسي",   strip_color: "#D4AF87" },
    { id: "satin",   name: "ساتان",          strip_color: "#B0324B" },
    { id: "tulle",   name: "تول مطرز",       strip_color: "#6B5B95" },
    { id: "velvet",  name: "مخمل",           strip_color: "#4B2E58" }
  ],
  products_v2: [
    { id: "evening-01", category_id: "evening", name: "فستان سهرة — ليالي حريرية", image_url: "img/card-evening.jpg",
      gallery_urls: ["img/card-royal.jpg", "img/card-engagement.jpg"],
      colors: [
        { name: "ذهبي", hex: "#C9A15A", images: ["img/card-evening.jpg", "img/card-royal.jpg"] },
        { name: "أسود", hex: "#1B1B1F", images: ["img/card-royal.jpg", "img/card-evening.jpg"] }
      ],
      fabrics: [
        { fabric_id: "silk",  name: "حرير طبيعي", strip_color: "#C9A15A", show_on_card: true },
        { fabric_id: "tulle", name: "تول مطرز",   strip_color: "#6B5B95", show_on_card: true }
      ],
      blurb: "لمسة من الفخامة",
      full_desc: "فستان سهرة بقصّة أنيقة تحتضن الجسم بانسيابية، مصمم للحظات التي تستحق أن تُروى. تفاصيل مطرزة بخيوط ذهبية تضيف بريقاً خافتاً تحت الإضاءة.",
      price: 1250, discount_type: "percent", discount_value: 15,
      discount_ends_at: "2026-12-31T20:00:00.000Z",
      sizes: ["S", "M", "L", "XL"] },
    { id: "wedding-01", category_id: "wedding", name: "فستان عروس — لحظة العمر", image_url: "img/card-wedding.jpg",
      gallery_urls: ["img/card-engagement.jpg"],
      fabrics: [
        { fabric_id: "lace", name: "دانتيل فرنسي طويل جداً بالاسم لتجربة الحركة الأفقية", strip_color: "#D4AF87", show_on_card: true }
      ],
      blurb: "لحظتك الأجمل",
      full_desc: "فستان زفاف كلاسيكي بذيل طويل وتطريز يدوي دقيق على الحواف، صُمم ليكون شاهداً على أجمل لحظة في حياتك.",
      price: null, discount_type: null, discount_value: null, discount_ends_at: null,
      sizes: ["S", "M", "L", "XL", "XXL"] },
    { id: "engagement-01", category_id: "engagement", name: "فستان خطوبة — بداية ساحرة", image_url: "img/card-engagement.jpg",
      gallery_urls: [],
      fabrics: [],
      blurb: "بدايات ساحرة",
      full_desc: "فستان أنيق بلون فاتح يجمع بين البساطة والفخامة، مثالي لحفل الخطوبة والاحتفال بأولى خطوات القصة.",
      price: 890, discount_type: null, discount_value: null, discount_ends_at: null,
      sizes: [] },
    { id: "royal-01", category_id: "royal", name: "فستان ملكي — تاج الفخامة", image_url: "img/card-royal.jpg",
      gallery_urls: ["img/card-evening.jpg", "img/card-wedding.jpg"],
      colors: [
        { name: "ذهبي ملكي", hex: "#D4AF37", images: ["img/card-royal.jpg", "img/card-evening.jpg", "img/card-wedding.jpg"] }
      ],
      fabrics: [
        { fabric_id: "velvet", name: "مخمل",       strip_color: "#4B2E58", show_on_card: true },
        { fabric_id: "silk",   name: "حرير طبيعي", strip_color: "#C9A15A", show_on_card: false }
      ],
      blurb: "فخامة بلا حدود",
      full_desc: "تصميم مهيب مستوحى من الأزياء الملكية الكلاسيكية، بتطريز ذهبي كثيف وقصّة تمنح إطلالة استثنائية.",
      price: 2100, discount_type: "fixed", discount_value: 200,
      discount_ends_at: "2026-12-31T20:00:00.000Z",
      sizes: ["M", "L", "XL", "XXL"] }
  ]
};

var _settingsCache = null;

/**
 * getSettings()
 * -------------
 * نقطة الدخول الوحيدة يلي تستخدمها كل الصفحات. بتحاول تجيب بيانات
 * حقيقية من Supabase عبر loadSiteData()، ولو رجعت null (ما فيه ?s=،
 * أو الموقع موقوف، أو معاينة محلية بدون اتصال) بترجع بيانات تجريبية
 * واضح إنها مؤقتة، عشان الصفحة تضل قابلة للمعاينة دايماً.
 */
async function getSettings(){
  if(_settingsCache) return _settingsCache;
  var live = null;
  try{
    live = await loadSiteData();
  }catch(e){
    live = null; // فشل الاتصال (مثلاً محلياً بدون إنترنت) — استخدم البيانات التجريبية
  }
  _settingsCache = live || PLACEHOLDER_SETTINGS;
  _settingsCache.__isPlaceholder = !live;
  return _settingsCache;
}

/* بيانات تجريبية لمعاينة شريط الأقمشة محلياً بدون اتصال حقيقي بجدول
   fabrics — تشمل صورة القماش + لوني التدرج الخاصين فيه (ribbon_from/
   ribbon_to)، نفس الحقول يلي التاجر رح يعبّيها فعلياً بجدول fabrics.
   هاي مجرد قيم مؤقتة؛ لما الجدول الحقيقي يصير معبّى، getFabricDetails()
   تحت بترجع قيمه الحقيقية أولاً وما بتلمس هاي القيم نهائياً. */
var PLACEHOLDER_FABRIC_DETAILS = {
  silk:    { image_url: "img/card-evening.jpg",     ribbon_from: "#C9A15A", ribbon_to: "#FCEABB" },
  chiffon: { image_url: "img/card-engagement.jpg",  ribbon_from: "#8FA6B2", ribbon_to: "#E8F1F2" },
  lace:    { image_url: "img/card-wedding.jpg",      ribbon_from: "#D4AF87", ribbon_to: "#FFF6E5" },
  satin:   { image_url: "img/card-royal.jpg",        ribbon_from: "#B0324B", ribbon_to: "#F7C6D9" },
  tulle:   { image_url: "img/card-evening.jpg",      ribbon_from: "#6B5B95", ribbon_to: "#D9CBEF" },
  velvet:  { image_url: "img/card-royal.jpg",        ribbon_from: "#4B2E58", ribbon_to: "#B79FCB" }
};

/**
 * getFabricDetails(fabricIds)
 * -----------------------------
 * بتجيب تفاصيل الأقمشة المطلوبة (الصورة + لوني تدرّج الشريط الخاصين
 * بكل قماش) من جدول Arvix الحقيقي `fabrics` (زي ما موثّق بملف قواعد
 * الدمج). لو الاستعلام فشل (مثلاً معاينة محلية بدون الجدول، أو مشكلة
 * اتصال)، بترجع بيانات تجريبية بدل ما يخرب شريط القماش أو يظهر بتدرّج
 * فاضي — نفس مبدأ المرونة المستخدم بـgetSettings().
 * بترجع Object: { fabric_id: { image_url, ribbon_from, ribbon_to } }.
 */
async function getFabricDetails(fabricIds){
  var ids = Array.from(new Set((fabricIds || []).filter(Boolean)));
  var map = {};
  if(!ids.length) return map;

  try{
    var res = await SUPA.from('fabrics').select('id, image_url, ribbon_from, ribbon_to').in('id', ids);
    if(!res.error && res.data){
      res.data.forEach(function(row){
        if(row && row.id){
          map[row.id] = {
            image_url: row.image_url || '',
            ribbon_from: row.ribbon_from || '',
            ribbon_to: row.ribbon_to || ''
          };
        }
      });
    }
  }catch(e){
    // جدول fabrics مو متاح بهالبيئة (معاينة محلية) — رح نكمل بالقيم التجريبية تحت
  }

  ids.forEach(function(id){
    if(!map[id] && PLACEHOLDER_FABRIC_DETAILS[id]){
      map[id] = PLACEHOLDER_FABRIC_DETAILS[id];
    }
  });

  return map;
}

/**
 * getFabricsLibrary()
 * --------------------
 * BUG FIX — صفحة "فصّلي فستانك" (custom-order.html) كانت تبني قائمة
 * الأقمشة من settings.fabrics_library، وهو حقل ما فيه أي واجهة إدارة
 * فعلية بلوحة التاجر (ما في مكان يعبّيه التاجر منه)، فكان دايماً فاضي
 * على أي موقع حقيقي متصل — تظهر فيه خانة "أخرى" بس بدون أي قماش. هاي
 * الدالة بتجيب القائمة الحقيقية مباشرة من جدول fabrics العام (نفس
 * المكتبة المستخدمة بصفحة المنتج ولوحة التاجر)، يلي هو دايماً معبّى
 * ومتاح للقراءة العامة. لو الاتصال فشل (معاينة محلية)، بترجع نفس قائمة
 * fabrics_library التجريبية تحت كحل احتياطي، بدل ما ترجع فاضية.
 */
async function getFabricsLibrary(){
  try{
    var res = await SUPA.from('fabrics').select('id,name,name_en,ribbon_from,image_url').order('sort_order', {ascending:true});
    if(!res.error && res.data && res.data.length){
      return res.data.map(function(f){
        return { id: f.id, name: f.name, name_en: f.name_en || '', strip_color: f.ribbon_from || 'var(--gold-2)', image_url: f.image_url || '' };
      });
    }
  }catch(e){
    // جدول fabrics مو متاح بهالبيئة (معاينة محلية) — رح نكمل بالقيمة الاحتياطية تحت
  }
  return PLACEHOLDER_SETTINGS.fabrics_library;
}

/**
 * SIZE_CONVERSION_TABLE
 * ----------------------
 * سوريا (متل باقي بلاد الشام) ما إلها معيار مقاسات رسمي خاص فيها — المقاس
 * المتعارف عليه محليًا بالجاهز والمفصّل هو نفس المقاس الأوروبي/الفرنسي
 * الرقمي (36, 38, 40...). فعليه: من هلق، أي مقاس يضاف من آرفيكس لازم
 * يكتب بهاد الرقم (يعني "40" مش "M")، وهاي الجدول بيترجمه تلقائيًا لبقية
 * الأنظمة عشان تقدر الزبونة تشوف مقاسها المعتاد بأي نظام إذا مو متعودة
 * عالأوروبي، بدون ما التاجر يحتاج يدخل نفس المقاس بكل بلد لحاله. مصدر
 * التحويل: الفرق التقريبي المعتمد عالميًا بين الأنظمة (US = EU − 32,
 * UK = US + 4, IT = EU + 4)، ونفس مجالات الحرف القياسية (S = US 4–6...).
 * مقاس قديم مكتوب بحرف (M/XL) أو بشكل مش موجود بالجدول بيضل يُعرض متل
 * ما هو بدون أي تحويل — مفيش قطيعة مع بيانات قديمة.
 */
var SIZE_CONVERSION_TABLE = [
  { eu: '32', us: '00', uk: '4',  it: '36', letter: 'XXS' },
  { eu: '34', us: '0',  uk: '6',  it: '38', letter: 'XS'  },
  { eu: '36', us: '2',  uk: '8',  it: '40', letter: 'XS'  },
  { eu: '38', us: '4',  uk: '10', it: '42', letter: 'S'   },
  { eu: '40', us: '6',  uk: '10', it: '44', letter: 'S'   },
  { eu: '42', us: '8',  uk: '12', it: '46', letter: 'M'   },
  { eu: '44', us: '10', uk: '14', it: '48', letter: 'M'   },
  { eu: '46', us: '12', uk: '16', it: '50', letter: 'L'   },
  { eu: '48', us: '14', uk: '18', it: '52', letter: 'L'   },
  { eu: '50', us: '16', uk: '20', it: '54', letter: 'XL'  },
  { eu: '52', us: '18', uk: '22', it: '56', letter: 'XL'  },
  { eu: '54', us: '20', uk: '24', it: '58', letter: 'XXL' },
  { eu: '56', us: '22', uk: '26', it: '60', letter: 'XXL' }
];

/** بترجع صف الجدول المطابق للمقاس السوري/الأوروبي المخزّن، أو null لو
    المقاس مو رقم أوروبي معروف (مقاس قديم بحرف مثلاً — بيضل يُعرض عادي
    بدون تحويل). */
function getSizeConversion(sizeValue){
  var clean = String(sizeValue).trim();
  return SIZE_CONVERSION_TABLE.find(function(row){ return row.eu === clean; }) || null;
}
