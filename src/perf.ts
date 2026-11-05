// Lite mode is decided once, before first paint, by the script in index.html:
// touch screens, narrow viewports, low core counts, low memory or data saver.
// It keeps every design's look but swaps the expensive internals (live blurs,
// full-rate WebGL, paint-heavy animations) for cheaper ones. See styles/lite.css.
export const isLite = () => document.documentElement.classList.contains('lite');
