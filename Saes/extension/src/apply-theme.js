function applyTheme(tokens) {
  if (typeof document === 'undefined') {
    throw new Error('applyTheme requires a browser document');
  }

  Object.entries(tokens).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
}

export { applyTheme };
export default applyTheme;
