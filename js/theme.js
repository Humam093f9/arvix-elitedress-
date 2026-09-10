/* ELITEDRESS — js/theme.js
   تبديل الوضع الفاتح/الغامق. الثيم الافتراضي هو الفاتح. القيمة المحفوظة
   بـlocalStorage بتُطبَّق فورًا بسكربت صغير جوا <head> بكل صفحة (قبل ما
   يترسم أي شي، فما في "وميض" لوني عند فتح الصفحة) — هذا الملف بس بيضيف
   زر التبديل نفسه وبيحدّث القيمة المحفوظة. */

const THEME_STORAGE_KEY = 'elitedress_theme';

function getStoredTheme(){
  try{
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  }catch(e){
    return 'light';
  }
}

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-pressed', theme === 'dark');
  });
}

function toggleTheme(){
  const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
  try{ localStorage.setItem(THEME_STORAGE_KEY, next); }catch(e){ /* وضع خاص — بتضل شغالة بالجلسة الحالية بس */ }
  applyTheme(next);
}

function initThemeToggle(){
  applyTheme(getStoredTheme());
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);
