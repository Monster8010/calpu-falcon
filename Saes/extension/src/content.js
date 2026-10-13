(function applySaesPreset() {
  'use strict';

  var root = document.documentElement;
  if (!root) return;

  var tokens = {
    '--saes-color-background': '#f8fafc',
    '--saes-color-surface': '#ffffff',
    '--saes-color-text': '#1f2937',
    '--saes-color-muted': '#64748b',
    '--saes-color-border': '#e2e8f0',
    '--saes-color-accent': '#2563eb',
    '--saes-color-accent-contrast': '#ffffff',
    '--saes-color-focus': '#1d4ed8',
    '--saes-color-menu': '#ffffff',
    '--saes-color-menu-hover': '#f1f5f9',
    '--saes-color-menu-active': '#eff6ff',
    '--saes-background-image': 'none',
    '--saes-background-position': 'center',
    '--saes-background-size': 'cover',
    '--saes-button-radius': '0.5rem',
    '--saes-button-border-width': '1px',
    '--saes-button-border-style': 'solid',
    '--saes-button-padding-y': '0.625rem',
    '--saes-button-padding-x': '0.875rem',
    '--saes-menu-width': '15rem',
    '--saes-shadow-sm': '0 1px 2px rgb(15 23 42 / 0.06)',
    '--saes-font-family': 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    '--saes-font-size-base': '1rem',
    '--saes-line-height': '1.5',
    '--saes-transition-fast': '140ms ease',
  };

  Object.keys(tokens).forEach(function setToken(name) {
    root.style.setProperty(name, tokens[name]);
  });

  var styleId = 'saes-minimalist-style';
  var style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    (document.head || root).appendChild(style);
  }

  style.textContent = [
    'html.saes-minimalist {',
    '  color-scheme: light;',
    '  background: var(--saes-color-background);',
    '}',
    'html.saes-minimalist body {',
    '  margin: 0;',
    '  background-color: var(--saes-color-background);',
    '  color: var(--saes-color-text);',
    '  font-family: var(--saes-font-family);',
    '  font-size: var(--saes-font-size-base);',
    '  line-height: var(--saes-line-height);',
    '}',
    'html.saes-minimalist body::before {',
    '  background-image: var(--saes-background-image);',
    '  background-position: var(--saes-background-position);',
    '  background-size: var(--saes-background-size);',
    '  content: "";',
    '  inset: 0;',
    '  opacity: 0.18;',
    '  pointer-events: none;',
    '  position: fixed;',
    '  z-index: -1;',
    '}',
    'html.saes-minimalist :where(h1, h2, h3, h4, h5, h6) {',
    '  color: var(--saes-color-text);',
    '  line-height: 1.2;',
    '}',
    'html.saes-minimalist a {',
    '  color: var(--saes-color-accent);',
    '  text-underline-offset: 0.15em;',
    '}',
    'html.saes-minimalist a:hover {',
    '  color: var(--saes-color-focus);',
    '}',
    'html.saes-minimalist :where(button, input[type="button"], input[type="submit"], input[type="reset"]) {',
    '  border: var(--saes-button-border-width) var(--saes-button-border-style) var(--saes-color-accent);',
    '  border-radius: var(--saes-button-radius);',
    '  background: var(--saes-color-surface);',
    '  box-shadow: var(--saes-shadow-sm);',
    '  color: var(--saes-color-accent);',
    '  cursor: pointer;',
    '  padding: var(--saes-button-padding-y) var(--saes-button-padding-x);',
    '  transition: background-color var(--saes-transition-fast), color var(--saes-transition-fast);',
    '}',
    'html.saes-minimalist :where(button, input[type="button"], input[type="submit"], input[type="reset"]):hover {',
    '  background: var(--saes-color-accent);',
    '  color: var(--saes-color-accent-contrast);',
    '}',
    'html.saes-minimalist :where(table, th, td) {',
    '  border-color: var(--saes-color-border);',
    '}',
    'html.saes-minimalist :where(th) {',
    '  background: var(--saes-color-menu-hover);',
    '  color: var(--saes-color-text);',
    '}',
    'html.saes-minimalist :where(a, button, input, select, textarea):focus-visible {',
    '  outline: 3px solid var(--saes-color-focus);',
    '  outline-offset: 2px;',
    '}',
    '@media (max-width: 700px) {',
    '  html.saes-minimalist body {',
    '    overflow-x: auto;',
    '  }',
    '}',
  ].join('\n');

  style.textContent += [
    '.saes-responsive-menu-toggle, .saes-responsive-menu-backdrop {',
    '  display: none;',
    '}',
    '.saes-responsive-menu {',
    '  box-sizing: border-box;',
    '}',
    'html.saes-minimalist :where(img, svg, video, canvas) {',
    '  height: auto;',
    '  max-width: 100%;',
    '}',
    'html.saes-minimalist :where(button, input, select, textarea) {',
    '  box-sizing: border-box;',
    '  max-width: 100%;',
    '}',
    'html.saes-minimalist {',
    '  overflow-x: hidden;',
    '}',
    'html.saes-minimalist body {',
    '  max-width: 100vw;',
    '  overflow-x: auto;',
    '}',
    '@media (max-width: 700px) {',
    '  html.saes-minimalist .saes-responsive-menu {',
    '    background: var(--saes-color-menu);',
    '    bottom: 0;',
    '    box-shadow: 0 0 1.5rem rgb(15 23 42 / 0.2);',
    '    left: 0;',
    '    max-height: 100vh;',
    '    max-width: 85vw;',
    '    overflow-x: hidden;',
    '    overflow-y: auto;',
    '    position: fixed !important;',
    '    top: 0;',
    '    transform: translateX(-105%);',
    '    transition: transform var(--saes-transition-fast), visibility var(--saes-transition-fast);',
    '    visibility: hidden;',
    '    width: min(var(--saes-menu-width), 85vw);',
    '    z-index: 1001;',
    '    -webkit-overflow-scrolling: touch;',
    '  }',
    '  html.saes-minimalist.saes-menu-open .saes-responsive-menu {',
    '    transform: translateX(0);',
    '    visibility: visible;',
    '  }',
    '  html.saes-minimalist .saes-responsive-menu-toggle {',
    '    background: var(--saes-color-surface);',
    '    border: 1px solid var(--saes-color-accent);',
    '    border-radius: var(--saes-button-radius);',
    '    box-shadow: var(--saes-shadow-sm);',
    '    color: var(--saes-color-accent);',
    '    display: block;',
    '    left: 0.75rem;',
    '    padding: 0.55rem 0.75rem;',
    '    position: fixed;',
    '    top: 0.75rem;',
    '    z-index: 1002;',
    '  }',
    '  html.saes-minimalist .saes-responsive-menu-backdrop {',
    '    background: rgb(15 23 42 / 0.45);',
    '    bottom: 0;',
    '    display: block;',
    '    left: 0;',
    '    opacity: 0;',
    '    pointer-events: none;',
    '    position: fixed;',
    '    right: 0;',
    '    top: 0;',
    '    transition: opacity var(--saes-transition-fast), visibility var(--saes-transition-fast);',
    '    visibility: hidden;',
    '    z-index: 1000;',
    '  }',
    '  html.saes-minimalist.saes-menu-open .saes-responsive-menu-backdrop {',
    '    opacity: 1;',
    '    pointer-events: auto;',
    '    visibility: visible;',
    '  }',
    '}',
  ].join('\n');

  root.classList.add('saes-minimalist');
  root.setAttribute('data-saes-preset', 'minimalista');

  function findMenu() {
    var selectors = [
      '#leftColumn',
      '#ctl00_leftColumn',
      '[id$="_leftColumn"]',
      '[id*="leftColumn"]',
      '[class*="leftColumn"]',
    ];

    for (var i = 0; i < selectors.length; i += 1) {
      var menu = document.querySelector(selectors[i]);
      if (menu) return menu;
    }

    var skipLink = document.querySelector('a[href*="subMenu_SkipLink"]');
    if (!skipLink) return null;

    var node = skipLink;
    while (node && node !== document.body) {
      if (node.querySelectorAll && node.querySelectorAll('a[href]').length >= 10) {
        return node;
      }
      node = node.parentElement;
    }

    return skipLink.parentElement;
  }

  function createElement(tagName, className) {
    var element = document.createElement(tagName);
    element.className = className;
    return element;
  }

  function initializeResponsiveMenu() {
    var menu = findMenu();
    var body = document.body;
    if (!menu || !body) return;

    if (!menu.id) menu.id = 'saes-responsive-menu';

    var toggle = document.querySelector('[data-saes-responsive-toggle]');
    if (!toggle) {
      toggle = createElement('button', 'saes-responsive-menu-toggle');
      toggle.type = 'button';
      toggle.textContent = 'Menú';
      toggle.setAttribute('data-saes-responsive-toggle', 'true');
      body.appendChild(toggle);
    }

    var backdrop = document.querySelector('[data-saes-responsive-backdrop]');
    if (!backdrop) {
      backdrop = createElement('div', 'saes-responsive-menu-backdrop');
      backdrop.setAttribute('data-saes-responsive-backdrop', 'true');
      body.appendChild(backdrop);
    }

    menu.classList.add('saes-responsive-menu');
    toggle.setAttribute('aria-controls', menu.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú lateral');
    backdrop.setAttribute('aria-hidden', 'true');

    function closeMenu() {
      root.classList.remove('saes-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú lateral');
      backdrop.setAttribute('aria-hidden', 'true');
    }

    function openMenu() {
      root.classList.add('saes-menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú lateral');
      backdrop.setAttribute('aria-hidden', 'false');
    }

    if (!toggle.hasAttribute('data-saes-responsive-bound')) {
      toggle.addEventListener('click', function toggleMenu() {
        if (root.classList.contains('saes-menu-open')) closeMenu();
        else openMenu();
      });
      toggle.setAttribute('data-saes-responsive-bound', 'true');
    }

    if (!backdrop.hasAttribute('data-saes-responsive-bound')) {
      backdrop.addEventListener('click', closeMenu);
      backdrop.setAttribute('data-saes-responsive-bound', 'true');
    }

    if (!menu.hasAttribute('data-saes-responsive-bound')) {
      menu.addEventListener('click', function closeAfterMenuLink(event) {
        var target = event.target;
        if (target && target.closest && target.closest('a')) closeMenu();
      });
      menu.setAttribute('data-saes-responsive-bound', 'true');
    }

    if (!root.hasAttribute('data-saes-keydown-bound')) {
      document.addEventListener('keydown', function closeOnEscape(event) {
        if (event.key === 'Escape') closeMenu();
      });
      root.setAttribute('data-saes-keydown-bound', 'true');
    }
  }

  if (document.body) initializeResponsiveMenu();
  else document.addEventListener('DOMContentLoaded', initializeResponsiveMenu, { once: true });
})();
