(function () {
  'use strict';

  const STORAGE_KEY = 'saes-theme';
  const DARK = 'dark';
  const LIGHT = 'light';
  const root = document.documentElement;

  function normalize(mode) {
    return mode === LIGHT ? LIGHT : DARK;
  }

  function readStoredMode() {
    try {
      return normalize(window.localStorage.getItem(STORAGE_KEY));
    } catch (_error) {
      return DARK;
    }
  }

  function persist(mode) {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (_error) {
      // Sigue funcionando aunque el almacenamiento esté bloqueado.
    }
  }

  function setMode(mode, options) {
    const nextMode = normalize(mode);
    const shouldPersist = !options || options.persist !== false;

    root.dataset.saesTheme = nextMode;
    root.classList.toggle('saes-dark', nextMode === DARK);
    root.style.colorScheme = nextMode;

    if (shouldPersist) persist(nextMode);
    return nextMode;
  }

  function getMode() {
    return root.dataset.saesTheme || DARK;
  }

  function toggle() {
    return setMode(getMode() === DARK ? LIGHT : DARK);
  }

  setMode(readStoredMode(), { persist: false });

  window.SaesDarkMode = Object.freeze({
    get: getMode,
    set: setMode,
    toggle: toggle
  });
}());
