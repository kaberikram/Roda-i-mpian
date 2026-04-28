import { useEffect, useRef, useState } from 'react';
import { fitTileRow } from '../utils/layout.js';

// Multi-word phrases: one row per word (e.g. COMPOUND / INTEREST). Each row's tile size
// is computed from ResizeObserver width so nothing is cropped on narrow screens.
export default function LetterBoard({ term, revealed, shake, justCorrect }) {
  const wrapRef = useRef(null);
  const [boardW, setBoardW] = useState(() =>
    typeof window !== 'undefined' ? Math.min(400, Math.max(280, window.innerWidth - 32)) : 360,
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? el.getBoundingClientRect().width;
      if (w > 0) setBoardW(w);
    });
    ro.observe(el);
    setBoardW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const words = term.split(/\s+/).filter(Boolean);

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        role="group"
        aria-label="Word puzzle"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: words.length > 1 ? 12 : 0,
          width: '100%',
        }}
      >
        {words.map((word, wi) => {
          const dims = fitTileRow(word.length, boardW);
          const letters = word.split('');
          return (
            <div
              key={wi}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: dims.gap,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
              }}
            >
              {letters.map((letter, li) => {
                const isRevealed = revealed.has(letter);
                const isNew = justCorrect && justCorrect.has(letter) && isRevealed;
                return (
                  <div
                    key={`${wi}-${li}`}
                    style={{
                      flex: `0 0 ${dims.boxW}px`,
                      width: dims.boxW,
                      height: dims.boxH,
                      borderRadius: Math.min(10, Math.floor(dims.boxW / 4)),
                      background: isRevealed ? '#185FA5' : shake ? '#FFD9D9' : '#E8EDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: dims.fontPx,
                      color: isRevealed ? '#fff' : 'transparent',
                      boxShadow: isRevealed ? '0 4px 0 #0d3d6e' : shake ? '0 3px 0 #E07474' : '0 3px 0 #c8d0dc',
                      animation: isNew ? 'tile-reveal 0.4s ease' : shake ? 'shake 0.4s ease' : 'none',
                      transition: 'background 0.25s, color 0.2s, box-shadow 0.25s',
                      borderBottom: isRevealed ? 'none' : shake ? '2.5px solid #E07474' : '2.5px solid #C0CAD8',
                      boxSizing: 'border-box',
                    }}
                  >
                    {isRevealed ? letter : ''}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
