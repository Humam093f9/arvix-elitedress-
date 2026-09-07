/** نظام اللغة (عربي/إنجليزي) — الأساس التقني.
    ==========================================================
    هاد الملف هو "المحرك" + قاموس كل النصوص الثابتة بالموقع (مش محتوى
    المتجر). لازم يتحمّل بكل صفحة قبل site.js (لأنه site.js بيستخدم
    t() جوا renderPriceHTML وbuildProductOrderMessage). كل صفحات
    الموقع الستة موصولة فيه الآن (هيدر، فوتر، وكل نص ثابت بجسم كل صفحة).

    ملاحظة مهمة: أي محتوى المتجر نفسه (اسم منتج، وصف، اسم قماش، اسم
    قسم، رمز العملة...) ما إلو مكان بهاد القاموس — هاد محتوى ديناميكي
    جاي من قاعدة البيانات (آرفيكس)، وترجمته التلقائية موضوع منفصل
    تمامًا لازم يتعمل بمحرر آرفيكس نفسه، مش هون. لو ما في نسخة
    إنجليزية للمنتج، بيضل ظاهر بالعربي حتى بوضع اللغة الإنجليزية لحد
    ما ينحل هداك الجزء. */
var I18N_DICT = {
  ar: {
    // مشترك: هيدر + فوتر + واتساب
    'nav.home': 'الرئيسية',
    'nav.collection': 'المجموعة',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.custom': 'فصّلي فستانك',
    'nav.whatsapp_aria': 'تواصل عبر واتساب',
    'nav.menu_aria': 'فتح القائمة',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'price.on_request': 'السعر عند الطلب',
    'lang.switch_to': 'EN',
    'whatsapp.general_inquiry': 'استفسار عام',
    'whatsapp.general_inquiry_collection': 'استفسار عام عن المجموعة',
    'list.separator': '، ',
    'social.instagram': 'انستغرام',
    'social.whatsapp': 'واتساب',
    'social.tiktok': 'تيك توك',
    'social.facebook': 'فيسبوك',
    'social.snapchat': 'سناب شات',
    'social.telegram': 'تيليجرام',
    'social.location': 'الموقع الجغرافي',

    // رسالة واتساب طلب منتج (buildProductOrderMessage)
    'order.msg_title': 'طلب فستان',
    'order.price_label': 'السعر',
    'order.price_on_request': 'عند الطلب',
    'order.color_label': 'اللون المختار',
    'order.fabrics_label': 'الأقمشة',
    'order.size_label': 'المقاس',

    // صفحة المجموعة
    'collection.eyebrow': 'تشكيلتنا الكاملة',
    'collection.title': 'المجموعة',
    'collection.subtitle': 'تصفّحي كل فساتيننا في مكان واحد، أو فلتري حسب الفئة.',
    'collection.loading': 'جاري تحميل التشكيلة...',
    'collection.empty_filtered': 'لا توجد فساتين ضمن هذه الفئة حالياً.',
    'collection.empty_all': 'لا توجد فساتين متاحة حالياً.',
    'filters.all': 'الكل',

    // صفحة من نحن
    'about.eyebrow': 'قصتنا',
    'about.p1': 'وُلدت ELITEDRESS من شغف عميق بالتفاصيل التي تصنع الفرق بين فستان عادي وقطعة تُروى قصتها لسنوات. كل تصميم يمر بمراحل دقيقة من الاختيار والتفصيل، بدءاً من انتقاء الأقمشة الفاخرة وصولاً إلى آخر غرزة تطريز، لنمنح كل امرأة إطلالة تليق باللحظات التي تستحق أن تُخلّد.',
    'about.p2': 'نؤمن أن الفخامة الحقيقية لا تُقاس بالزخرفة الزائدة، بل بالتوازن بين البساطة الأنيقة والحرفية العالية. لهذا نحرص على أن يحمل كل فستان بصمة خاصة، مصمم ليعكس شخصية من ترتديه لا ليكررها.',
    'about.p3': 'من قلب هذا الشغف، نفتح أبوابنا لكل عروس ولكل مناسبة تستحق لمسة استثنائية — لأن أناقتك، ببساطة، لا تُنسى.',

    // صفحة تواصل معنا
    'contact.eyebrow': 'ابقي على تواصل',
    'contact.subtitle': 'تابعينا أو تواصلي معنا مباشرة عبر أي من المنصات التالية.',
    'contact.loading': 'جاري التحميل...',
    'contact.empty_links': 'لا توجد روابط تواصل مضافة حالياً.',

    // صفحة فصّلي فستانك
    'custom.eyebrow': 'تصميم بلمستك الخاصة',
    'custom.subtitle': 'اختاري القماش الذي يناسب ذوقك، وأرفقي صورة مرجعية إن أردت، وسنتولى الباقي.',
    'custom.section_fabric': 'اختيار القماش',
    'custom.fabric_hint': 'يمكنك اختيار أكثر من قماش، أو إضافة قماش غير مدرج بالأسفل.',
    'custom.add_fabric': '+ إضافة قماش آخر',
    'custom.other_fabric': 'أخرى',
    'custom.fabric_name_placeholder': 'اسم القماش',
    'custom.fabric_color_placeholder': 'اللون (اختياري)',
    'custom.remove_row': 'حذف هذا الصف',
    'custom.section_image': 'صورة مرجعية',
    'custom.optional': '(اختياري)',
    'custom.image_hint': 'إن كان لديك تصميم أو صورة تتمنين تفصيل فستانك على غرارها، أرفقيها هنا.',
    'custom.choose_image': 'اختيار صورة',
    'custom.image_alt': 'الصورة المرجعية المرفقة',
    'custom.section_notes': 'ملاحظات',
    'custom.notes_placeholder': 'أي تفاصيل إضافية تودّين ذكرها — اللون المفضل، المناسبة، الموعد المطلوب...',
    'custom.upload_warning': 'الرسالة جاهزة تلقائياً وفيها رابط الصورة التي رفعتِها — يرجى عدم حذف الرابط عند التعديل أو الإرسال.',
    'custom.submit': 'إرسال الطلب',
    'custom.uploading': 'جارِ رفع الصورة...',
    'custom.upload_success': 'تم رفع الصورة بنجاح.',
    'custom.upload_failed': 'تعذّر رفع الصورة حالياً، يمكنك إكمال الطلب بدونها.',
    'custom.error_no_fabric': 'الرجاء اختيار قماش واحد على الأقل قبل إرسال الطلب.',
    'custom.msg_title': 'طلب تفصيل مخصص',
    'custom.msg_fabrics': 'الأقمشة المطلوبة',
    'custom.msg_none': 'لم تُحدد',
    'custom.msg_notes': 'ملاحظات',
    'custom.msg_no_notes': 'لا يوجد',
    'custom.msg_image_link': 'رابط الصورة المرفقة (الرجاء عدم الحذف)',

    // الصفحة الرئيسية
    'home.eyebrow': 'فساتين تُصنع من أجلك',
    'home.hero_title': 'أناقة لا تُنسى',
    'home.hero_subtitle': 'تصاميم حصرية لِلياليك الخاصة، حيث تلتقي الفخامة بالتفاصيل.',
    'home.hero_cta': '✷ تصفحي المجموعة',
    'home.feat1_title': 'تصاميم حصرية',
    'home.feat1_text': 'كل قطعة بتصميم فريد',
    'home.feat2_title': 'أقمشة فاخرة',
    'home.feat2_text': 'جودة عالية وتفاصيل راقية',
    'home.feat3_title': 'تفصيل حسب الطلب',
    'home.feat3_text': 'مقاسات مثالية لك',
    'home.feat4_title': 'خدمة راقية',
    'home.feat4_text': 'تجربة تسوق استثنائية',
    'home.collection_title': 'تشكيلة مختارة بعناية',
    'home.collection_subtitle': 'نقدم مجموعة متنوعة تناسب جميع المناسبات والأذواق الراقية',
    'cat.evening': 'فساتين السهرة',
    'home.cat_evening_tag': 'لمسة من الفخامة',
    'cat.wedding': 'فساتين الأعراس',
    'home.cat_wedding_tag': 'لحظتك الأجمل',
    'cat.engagement': 'فساتين الخطوبة',
    'home.cat_engagement_tag': 'بدايات ساحرة',
    'cat.royal': 'فساتين ملكية',
    'home.cat_royal_tag': 'فخامة بلا حدود',
    'home.explore_more': '✷ استكشفي المزيد',

    // صفحة تفاصيل المنتج
    'product.breadcrumb_aria': 'مسار التصفح',
    'product.loading': 'جاري التحميل...',
    'product.page_title': 'تفاصيل الفستان — ELITEDRESS',
    'product.prev_image': 'الصورة السابقة',
    'product.next_image': 'الصورة التالية',
    'product.image_n': 'صورة {n}',
    'product.colors_available': 'الألوان المتوفرة',
    'product.fabrics': 'الأقمشة',
    'product.sizes_available': 'المقاسات المتوفرة',
    'product.custom_note': 'لطلب تفصيل بقماش أو لون معيّن غير المعروض، يرجى ذكر ذلك برسالة الطلب.',
    'product.custom_order_link': '✷ فصّلي فستانك بقماش أو لون من اختيارك',
    'product.order_whatsapp': 'اطلبيه عبر واتساب',
    'product.no_id': 'لم يتم تحديد فستان.',
    'product.unavailable': 'هذا الفستان غير متوفر حالياً.',
    'product.browse_collection': 'تصفّحي المجموعة',

    // عناوين تبويب المتصفح لباقي الصفحات
    'about.page_title': 'من نحن — ELITEDRESS',
    'contact.page_title': 'تواصل معنا — ELITEDRESS',
    'custom.page_title': 'فصّلي فستانك — ELITEDRESS',
    'collection.page_title': 'المجموعة — ELITEDRESS',
    'home.page_title': 'ELITEDRESS — أناقة لا تُنسى'
  },
  en: {
    'nav.home': 'Home',
    'nav.collection': 'Collection',
    'nav.about': 'About',
    'nav.contact': 'Contact Us',
    'nav.custom': 'Custom Order',
    'nav.whatsapp_aria': 'Contact us on WhatsApp',
    'nav.menu_aria': 'Open menu',
    'footer.rights': 'All rights reserved.',
    'price.on_request': 'Price upon request',
    'lang.switch_to': 'ع',
    'whatsapp.general_inquiry': 'General inquiry',
    'whatsapp.general_inquiry_collection': 'General inquiry about the collection',
    'list.separator': ', ',
    'social.instagram': 'Instagram',
    'social.whatsapp': 'WhatsApp',
    'social.tiktok': 'TikTok',
    'social.facebook': 'Facebook',
    'social.snapchat': 'Snapchat',
    'social.telegram': 'Telegram',
    'social.location': 'Location',

    'order.msg_title': 'Dress order',
    'order.price_label': 'Price',
    'order.price_on_request': 'Upon request',
    'order.color_label': 'Selected color',
    'order.fabrics_label': 'Fabrics',
    'order.size_label': 'Size',

    'collection.eyebrow': 'Our Full Range',
    'collection.title': 'Collection',
    'collection.subtitle': 'Browse all our dresses in one place, or filter by category.',
    'collection.loading': 'Loading the collection...',
    'collection.empty_filtered': 'No dresses available in this category right now.',
    'collection.empty_all': 'No dresses available right now.',
    'filters.all': 'All',

    'about.eyebrow': 'Our Story',
    'about.p1': "ELITEDRESS was born from a deep passion for the details that turn an ordinary dress into a piece whose story is told for years. Every design goes through careful stages of selection and tailoring — from choosing the finest fabrics to the final embroidery stitch — to give every woman a look worthy of moments meant to be remembered.",
    'about.p2': "We believe true luxury isn't measured by excess ornamentation, but by the balance between elegant simplicity and fine craftsmanship. That's why every dress carries its own signature, designed to reflect the personality of the woman wearing it — not repeat it.",
    'about.p3': "From the heart of this passion, our doors are open to every bride and every occasion that deserves an exceptional touch — because your elegance, quite simply, is unforgettable.",

    'contact.eyebrow': 'Stay in Touch',
    'contact.subtitle': 'Follow us or reach out directly on any of the platforms below.',
    'contact.loading': 'Loading...',
    'contact.empty_links': 'No contact links have been added yet.',

    'custom.eyebrow': 'Designed With Your Own Touch',
    'custom.subtitle': 'Choose the fabric that suits your taste, attach a reference photo if you like, and we\u2019ll take care of the rest.',
    'custom.section_fabric': 'Choose Your Fabric',
    'custom.fabric_hint': 'You can select more than one fabric, or add one that isn\u2019t listed below.',
    'custom.add_fabric': '+ Add another fabric',
    'custom.other_fabric': 'Other',
    'custom.fabric_name_placeholder': 'Fabric name',
    'custom.fabric_color_placeholder': 'Color (optional)',
    'custom.remove_row': 'Remove this row',
    'custom.section_image': 'Reference Image',
    'custom.optional': '(optional)',
    'custom.image_hint': 'If you have a design or photo you\u2019d like your dress styled after, attach it here.',
    'custom.choose_image': 'Choose an image',
    'custom.image_alt': 'Attached reference image',
    'custom.section_notes': 'Notes',
    'custom.notes_placeholder': 'Any extra details you\u2019d like to mention — preferred color, occasion, needed date...',
    'custom.upload_warning': 'Your message is pre-filled with a link to the image you uploaded — please don\u2019t remove that link when editing or sending.',
    'custom.submit': 'Submit Order',
    'custom.uploading': 'Uploading image...',
    'custom.upload_success': 'Image uploaded successfully.',
    'custom.upload_failed': 'Couldn\u2019t upload the image right now — you can still complete your order without it.',
    'custom.error_no_fabric': 'Please choose at least one fabric before submitting your order.',
    'custom.msg_title': 'Custom dress order',
    'custom.msg_fabrics': 'Requested fabrics',
    'custom.msg_none': 'Not specified',
    'custom.msg_notes': 'Notes',
    'custom.msg_no_notes': 'None',
    'custom.msg_image_link': 'Attached image link (please don\u2019t remove)',

    'home.eyebrow': 'Dresses Made For You',
    'home.hero_title': 'Unforgettable Elegance',
    'home.hero_subtitle': 'Exclusive designs for your special nights, where luxury meets detail.',
    'home.hero_cta': '✷ Browse the Collection',
    'home.feat1_title': 'Exclusive Designs',
    'home.feat1_text': 'Every piece is uniquely designed',
    'home.feat2_title': 'Luxurious Fabrics',
    'home.feat2_text': 'High quality, refined details',
    'home.feat3_title': 'Made to Order',
    'home.feat3_text': 'A perfect fit for you',
    'home.feat4_title': 'Refined Service',
    'home.feat4_text': 'An exceptional shopping experience',
    'home.collection_title': 'A Carefully Curated Collection',
    'home.collection_subtitle': 'A diverse range suited to every occasion and refined taste',
    'cat.evening': 'Evening Dresses',
    'home.cat_evening_tag': 'A touch of luxury',
    'cat.wedding': 'Wedding Dresses',
    'home.cat_wedding_tag': 'Your most beautiful moment',
    'cat.engagement': 'Engagement Dresses',
    'home.cat_engagement_tag': 'Enchanting beginnings',
    'cat.royal': 'Royal Dresses',
    'home.cat_royal_tag': 'Boundless luxury',
    'home.explore_more': '✷ Explore More',

    'product.breadcrumb_aria': 'Breadcrumb',
    'product.loading': 'Loading...',
    'product.page_title': 'Dress Details — ELITEDRESS',
    'product.prev_image': 'Previous image',
    'product.next_image': 'Next image',
    'product.image_n': 'Image {n}',
    'product.colors_available': 'Available Colors',
    'product.fabrics': 'Fabrics',
    'product.sizes_available': 'Available Sizes',
    'product.custom_note': 'To request a specific fabric or color not shown here, please mention it in your order message.',
    'product.custom_order_link': '✷ Custom-tailor your dress in a fabric or color of your choice',
    'product.order_whatsapp': 'Order via WhatsApp',
    'product.no_id': 'No dress was specified.',
    'product.unavailable': 'This dress is currently unavailable.',
    'product.browse_collection': 'Browse the Collection',

    'about.page_title': 'About Us — ELITEDRESS',
    'contact.page_title': 'Contact Us — ELITEDRESS',
    'custom.page_title': 'Custom Order — ELITEDRESS',
    'collection.page_title': 'Collection — ELITEDRESS',
    'home.page_title': 'ELITEDRESS — Unforgettable Elegance'
  }
};

function getLang(){
  var saved = null;
  try{ saved = localStorage.getItem('site_lang'); }catch(e){ /* خصوصية متصفح مقيّدة — تجاهل */ }
  return (saved === 'en') ? 'en' : 'ar';
}

// t(key): يرجّع النص المترجم باللغة الحالية، أو النسخة العربية لو المفتاح
// ناقص بالإنجليزي (بدل ما يطلع فاضي)، أو المفتاح نفسه كحل أخير للتصحيح.
function t(key){
  var dict = I18N_DICT[getLang()] || I18N_DICT.ar;
  if(key in dict) return dict[key];
  if(key in I18N_DICT.ar) return I18N_DICT.ar[key];
  return key;
}

function applyLang(lang){
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'ar');
  document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  document.body.classList.toggle('lang-en', lang === 'en');

  document.querySelectorAll('[data-i18n]').forEach(function(el){
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function(el){
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(function(el){
    el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
  });

  var toggle = document.getElementById('langToggle');
  if(toggle) toggle.textContent = t('lang.switch_to');

  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
}

function setLang(lang){
  try{ localStorage.setItem('site_lang', lang === 'en' ? 'en' : 'ar'); }catch(e){ /* تجاهل */ }
  applyLang(getLang());
}

document.addEventListener('DOMContentLoaded', function(){
  var toggle = document.getElementById('langToggle');
  if(toggle){
    toggle.addEventListener('click', function(){
      setLang(getLang() === 'en' ? 'ar' : 'en');
    });
  }
  applyLang(getLang());
});
