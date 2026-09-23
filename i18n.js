(function () {
  'use strict';

  var languages = {
    en: { flag: '🇬🇧', short: 'EN', name: 'English' },
    es: { flag: '🇪🇸', short: 'ES', name: 'Español' },
    ru: { flag: '🇷🇺', short: 'RU', name: 'Русский' },
    bg: { flag: '🇧🇬', short: 'BG', name: 'Български' }
  };

  var labels = {
    en: { choose: 'Choose language', menu: 'Menu', checked: 'Last checked', review: 'Manual review needed' },
    es: { choose: 'Elegir idioma', menu: 'Menú', checked: 'Última comprobación', review: 'Se necesita una revisión manual' },
    ru: { choose: 'Выбрать язык', menu: 'Меню', checked: 'Последняя проверка', review: 'Требуется ручная проверка' },
    bg: { choose: 'Избор на език', menu: 'Меню', checked: 'Последна проверка', review: 'Необходима е ръчна проверка' }
  };

  function normalise(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function selectedLanguage() {
    var requested = new URLSearchParams(window.location.search).get('lang');
    if (requested && languages[requested]) return requested;
    try {
      var saved = window.localStorage.getItem('site-language');
      if (saved && languages[saved]) return saved;
    } catch (error) {
      // The site still works when storage is unavailable.
    }
    return 'en';
  }

  var currentLanguage = selectedLanguage();

  function translationFor(value) {
    if (currentLanguage === 'en') return null;
    var catalogue = window.SITE_TRANSLATIONS && window.SITE_TRANSLATIONS[currentLanguage];
    return catalogue ? catalogue[normalise(value)] || null : null;
  }

  function translateTextNode(node) {
    var original = node.nodeValue;
    var clean = normalise(original);
    if (!clean) return;
    var translated = translationFor(clean);
    if (!translated) return;
    var leading = original.match(/^\s*/)[0];
    var trailing = original.match(/\s*$/)[0];
    node.nodeValue = leading + translated + trailing;
  }

  function applyTo(root) {
    if (currentLanguage === 'en' || !root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || parent.closest('script, style, [data-no-i18n]')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
    if (root.querySelectorAll) {
      root.querySelectorAll('[alt], [title], [placeholder]').forEach(function (element) {
        ['alt', 'title', 'placeholder'].forEach(function (attribute) {
          if (!element.hasAttribute(attribute)) return;
          var original = element.getAttribute(attribute);
          var translated = translationFor(original);
          if (translated) element.setAttribute(attribute, translated);
        });
      });
    }
  }

  function preserveLanguageInLinks() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      var raw = link.getAttribute('href');
      if (!raw || raw.charAt(0) === '#' || raw.indexOf('mailto:') === 0 || raw.indexOf('tel:') === 0) return;
      var url;
      try { url = new URL(raw, window.location.href); } catch (error) { return; }
      if (url.origin !== window.location.origin) return;
      if (currentLanguage === 'en') url.searchParams.delete('lang');
      else url.searchParams.set('lang', currentLanguage);
      link.href = url.href;
    });
  }

  function chooseLanguage(code) {
    try { window.localStorage.setItem('site-language', code); } catch (error) {}
    var url = new URL(window.location.href);
    if (code === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', code);
    window.location.href = url.href;
  }

  function createSwitcher() {
    var nav = document.querySelector('.nav-inner');
    var toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'language-switcher';
    wrapper.setAttribute('data-no-i18n', '');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'language-button';
    button.setAttribute('aria-label', labels[currentLanguage].choose);
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span class="language-flag">' + languages[currentLanguage].flag + '</span><span>' + languages[currentLanguage].short + '</span><span class="language-chevron">⌄</span>';

    var menu = document.createElement('div');
    menu.className = 'language-menu';
    menu.setAttribute('role', 'menu');

    Object.keys(languages).forEach(function (code) {
      var option = document.createElement('button');
      option.type = 'button';
      option.className = 'language-option' + (code === currentLanguage ? ' active' : '');
      option.setAttribute('role', 'menuitem');
      option.innerHTML = '<span class="language-flag">' + languages[code].flag + '</span><span>' + languages[code].name + '</span>';
      option.addEventListener('click', function () { chooseLanguage(code); });
      menu.appendChild(option);
    });

    button.addEventListener('click', function () {
      var open = wrapper.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (event) {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(menu);
    nav.appendChild(wrapper);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.lang = currentLanguage;
    var navToggle = document.querySelector('.nav-toggle');
    if (navToggle) navToggle.setAttribute('aria-label', labels[currentLanguage].menu);
    var translatedTitle = translationFor(document.title);
    if (translatedTitle) document.title = translatedTitle;
    applyTo(document.body);
    preserveLanguageInLinks();
    createSwitcher();
  });

  window.SiteI18n = {
    applyTo: applyTo,
    currentLanguage: function () { return currentLanguage; },
    translate: function (text) { return translationFor(text) || text; },
    label: function (name) { return labels[currentLanguage][name] || labels.en[name] || name; }
  };
}());
