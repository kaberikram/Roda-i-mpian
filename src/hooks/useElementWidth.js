import { useLayoutEffect, useState } from 'react';

/** Tracks the rounded width (px) of a referenced element via ResizeObserver. */
export function useElementWidth(ref, deps = []) {
  const [width, setWidth] = useState(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    function measure() {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setWidth(Math.round(w * 100) / 100);
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return width;
}
