export function hexToRgb(hex) {
  if (typeof hex !== 'string') return null;
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

/** Blend wheel color with white: `whiteRatio` e.g. 0.7 → 70% white, 30% color. */
export function mixSegmentWithWhite(segmentHex, whiteRatio) {
  const rgb = hexToRgb(segmentHex);
  if (!rgb) return null;
  const w = Math.min(1, Math.max(0, whiteRatio));
  const c = 1 - w;
  return {
    r: Math.round(rgb.r * c + 255 * w),
    g: Math.round(rgb.g * c + 255 * w),
    b: Math.round(rgb.b * c + 255 * w),
  };
}

export function lerpRgb(a, b, t) {
  const u = Math.min(1, Math.max(0, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * u),
    g: Math.round(a.g + (b.g - a.g) * u),
    b: Math.round(a.b + (b.b - a.b) * u),
  };
}

/** Soft gradient: ~70% white / 30% segment at top, easing into theme base. */
export function spinTintScreenBackground(baseHex, segmentColor, theme) {
  const soft = mixSegmentWithWhite(segmentColor, 0.7);
  const baseRgb = hexToRgb(baseHex);
  if (!soft || !baseRgb) return baseHex;

  const isDark = theme === 'dark';
  const top = soft;
  const upper = lerpRgb(top, baseRgb, isDark ? 0.22 : 0.18);
  const mid = lerpRgb(top, baseRgb, isDark ? 0.5 : 0.45);
  const lower = lerpRgb(top, baseRgb, isDark ? 0.82 : 0.78);

  return (
    `linear-gradient(168deg, ` +
    `rgb(${top.r},${top.g},${top.b}) 0%, ` +
    `rgb(${upper.r},${upper.g},${upper.b}) 28%, ` +
    `rgb(${mid.r},${mid.g},${mid.b}) 52%, ` +
    `rgb(${lower.r},${lower.g},${lower.b}) 78%, ` +
    `${baseHex} 100%)`
  );
}
