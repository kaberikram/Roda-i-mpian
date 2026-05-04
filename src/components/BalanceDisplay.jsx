import { useEffect, useRef, useState } from 'react';

// BUST: centered overlay (scale-up), not in-flow under puzzle
export default function BalanceDisplay({ spinValue }) {
  const [phase, setPhase] = useState(() => (spinValue === 'BUST' ? 'in' : 'gone'));
  const prevWasBustRef = useRef(spinValue === 'BUST');

  useEffect(() => {
    const bustNow = spinValue === 'BUST';
    if (bustNow) {
      prevWasBustRef.current = true;
      setPhase('in');
      return;
    }
    if (prevWasBustRef.current) {
      prevWasBustRef.current = false;
      // Dismiss immediately — a second full-screen fade-out read as the puzzle
      // "disappearing" on mobile after returnToWheelPhase clears spinValue.
      setPhase('gone');
    }
  }, [spinValue]);

  if (phase === 'gone') return null;
  const backdropAnim = 'bustOverlayFadeIn 0.25s ease forwards';
  const pillAnim = phase === 'in' ? 'bustPillScaleIn 0.48s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.42)',
          animation: backdropAnim,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, animation: pillAnim }}>
        <div
          style={{
            background: '#FCEBEB',
            borderRadius: 24,
            padding: '16px 28px',
            fontWeight: 900,
            fontSize: 22,
            color: '#791F1F',
            boxShadow: '0 24px 48px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(185, 28, 28, 0.12)',
          }}
        >
          💥 BUST
        </div>
      </div>
    </div>
  );
}
