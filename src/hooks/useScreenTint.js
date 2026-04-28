import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { spinTintScreenBackground } from '../utils/color.js';

const TINT_TRANSITION = 'opacity 0.75s cubic-bezier(0.45, 0, 0.2, 1)';

/**
 * Two-layer cross-fade tint over the root element. Pass the landed wheel
 * accent (`{ color }`) to fade in a soft tint, or `null` to fade out.
 * Returns JSX layer descriptors to spread into the rendered tree.
 */
export function useScreenTint(spinWheelAccent, baseColor) {
  const [tintLayerGrad, setTintLayerGrad] = useState(['', '']);
  const [tintLayerOpacity, setTintLayerOpacity] = useState([0, 0]);
  const tintActiveRef = useRef(0);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    root.style.transition = 'background-color 0.65s cubic-bezier(0.45, 0, 0.2, 1)';
    root.style.backgroundColor = baseColor;
    return () => {
      root.style.backgroundColor = '';
      root.style.transition = '';
    };
  }, [baseColor]);

  useLayoutEffect(() => {
    if (!spinWheelAccent) {
      setTintLayerOpacity([0, 0]);
      return;
    }
    const nextGrad = spinTintScreenBackground(baseColor, spinWheelAccent.color, 'default');
    const active = tintActiveRef.current;
    const inactive = 1 - active;
    setTintLayerGrad((prev) => {
      const n = prev.slice();
      n[inactive] = nextGrad;
      return n;
    });
    const raf = requestAnimationFrame(() => {
      setTintLayerOpacity(() => {
        const o = [0, 0];
        o[inactive] = 1;
        return o;
      });
      tintActiveRef.current = inactive;
    });
    return () => cancelAnimationFrame(raf);
  }, [spinWheelAccent, baseColor]);

  return [
    { background: tintLayerGrad[0] || 'transparent', opacity: tintLayerOpacity[0], transition: TINT_TRANSITION },
    { background: tintLayerGrad[1] || 'transparent', opacity: tintLayerOpacity[1], transition: TINT_TRANSITION },
  ];
}
