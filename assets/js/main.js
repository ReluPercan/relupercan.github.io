/**
 * ReluPercan - Script Global (Comutare Temă Dark/Light, Bilingv RO/EN, Butoane Copy)
 */
(function() {
  'use strict';

  // --- 1. Gestionare Temă (Dark / Light) ---
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = (theme === 'light') ? '🌙' : '☀️';
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('relupercan_theme') || localStorage.getItem('fossilsolo_theme');
    let theme = 'dark';
    if (savedTheme) {
      theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  }

  initTheme();

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = (current === 'dark') ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('relupercan_theme', next);
      localStorage.setItem('fossilsolo_theme', next);
      updateThemeIcon(next);
    });
  }

  // --- 2. Gestionare Limbă (RO / EN) ---
  const btnRo = document.getElementById('btn-lang-ro');
  const btnEn = document.getElementById('btn-lang-en');
  const secRo = document.getElementById('lang-section-ro');
  const secEn = document.getElementById('lang-section-en');

  window.setLanguage = function(lang) {
    if (lang === 'en') {
      if (secRo) secRo.classList.remove('active');
      if (secEn) secEn.classList.add('active');
      if (btnRo) btnRo.classList.remove('active');
      if (btnEn) btnEn.classList.add('active');
      document.documentElement.setAttribute('lang', 'en');
      
      const enTitle = document.documentElement.getAttribute('data-title-en');
      if (enTitle) document.title = enTitle;
    } else {
      if (secEn) secEn.classList.remove('active');
      if (secRo) secRo.classList.add('active');
      if (btnEn) btnEn.classList.remove('active');
      if (btnRo) btnRo.classList.add('active');
      document.documentElement.setAttribute('lang', 'ro');
      
      const roTitle = document.documentElement.getAttribute('data-title-ro');
      if (roTitle) document.title = roTitle;
    }
    // Actualizare elemente i18n dinamice (texte, link-uri, titluri)
    document.querySelectorAll('[data-i18n-ro][data-i18n-en]').forEach(el => {
      el.textContent = (lang === 'en') ? el.getAttribute('data-i18n-en') : el.getAttribute('data-i18n-ro');
    });

    document.querySelectorAll('[data-href-ro][data-href-en]').forEach(el => {
      el.setAttribute('href', (lang === 'en') ? el.getAttribute('data-href-en') : el.getAttribute('data-href-ro'));
    });

    document.querySelectorAll('[data-title-ro][data-title-en]').forEach(el => {
      const title = (lang === 'en') ? el.getAttribute('data-title-en') : el.getAttribute('data-title-ro');
      el.setAttribute('title', title);
      if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', title);
      }
    });

    localStorage.setItem('relupercan_lang', lang);
    localStorage.setItem('fossilsolo_manual_lang', lang);
  };

  if (btnRo) btnRo.addEventListener('click', () => setLanguage('ro'));
  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));

  const savedLang = localStorage.getItem('relupercan_lang') || localStorage.getItem('fossilsolo_manual_lang');
  if (savedLang) {
    setLanguage(savedLang);
  } else {
    const userLang = navigator.language || navigator.userLanguage || '';
    if (userLang.toLowerCase().startsWith('ro')) {
      setLanguage('ro');
    } else {
      setLanguage('en');
    }
  }

  // --- 3. Funcționalitate Butoane Copy ---
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;

    const codeBox = btn.closest('.code-box');
    let textToCopy = '';
    if (btn.hasAttribute('data-copy')) {
      textToCopy = btn.getAttribute('data-copy');
    } else if (codeBox) {
      const codeElem = codeBox.querySelector('code');
      if (codeElem) textToCopy = codeElem.textContent.trim();
    }

    if (textToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(function() {
        const originalText = btn.textContent;
        const isRo = document.documentElement.getAttribute('lang') === 'ro';
        btn.textContent = isRo ? 'Copiat!' : 'Copied!';
        btn.style.borderColor = 'var(--alert-tip-border)';
        setTimeout(function() {
          btn.textContent = originalText;
          btn.style.borderColor = '';
        }, 1800);
      });
    }
  });

})();
