// Wraps `web-haptics` so non-React code (rAF loops, plain handlers in
// hooks) can fire haptics without holding a hook reference. App.jsx
// registers the trigger on mount; consumers just import `haptic` and
// the named patterns.

let triggerFn = null;

let mutedMotion =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// `isSupported` from web-haptics reflects ONLY navigator.vibrate. iOS Safari
// has no Vibration API yet still gets haptics via the library's private
// <input switch> fallback — which only runs when isSupported is false.
// So we deliberately don't gate on it; let the library decide.
export function setHapticsTrigger(trigger /* , _isSupported */) {
  triggerFn = trigger;
}

export function setHapticsMuted(muted) {
  mutedMotion = !!muted;
}

export function haptic(pattern) {
  if (mutedMotion || !triggerFn) return;
  try {
    void triggerFn(pattern);
  } catch {
    /* swallow — haptics are best-effort */
  }
}

// ── Patterns ──────────────────────────────────────────────────────────────────
export const HAPTIC = {
  /** Letter-key tap on the keyboard. */
  TAP: 'selection',
  /** Generic UI press (Buy Vowel, Spin Again, End Round). */
  PRESS: 'light',
  /** Primary CTA (Start, Next Round, Play Again, Spin). */
  PRIMARY: 'medium',
  /** Single peg crossing as the wheel ticks past a segment boundary. */
  WHEEL_TICK: [{ duration: 6, intensity: 0.35 }],
  /** Wheel comes to rest on a money segment. */
  WHEEL_LAND: 'medium',
  /** Wheel comes to rest on BUST — sharper double-pulse. */
  WHEEL_BUST: [
    { duration: 90, intensity: 1.0 },
    { delay: 60, duration: 60, intensity: 0.5 },
  ],
  /** Round solved — celebratory triple-pulse. */
  SOLVE: [
    { duration: 40, intensity: 0.8 },
    { delay: 60, duration: 40, intensity: 0.8 },
    { delay: 60, duration: 80, intensity: 1.0 },
  ],
  /** Round failed (dead end / no spins left). */
  FAIL: [
    { duration: 120, intensity: 0.9 },
    { delay: 80, duration: 120, intensity: 0.6 },
  ],
};
