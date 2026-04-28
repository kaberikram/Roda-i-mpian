import { useEffect } from 'react';
import Confetti from '../components/Confetti.jsx';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { fmt, fmtTime } from '../utils/format.js';

export default function EndScreen({ finalScore, totalTime, highScore, bestTime, onPlayAgain }) {
  const isNewHigh = finalScore >= highScore;
  useEffect(() => {
    let alive = true;
    void (async () => {
      await FinSpinAudio.resume();
      if (!alive) return;
      FinSpinAudio.playGameOverFanfare();
    })();
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div className="screen screen-end-shell vt-screen">
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 'max(8px, env(safe-area-inset-top, 0px))',
          paddingBottom: 'max(20px, calc(12px + env(safe-area-inset-bottom, 0px)))',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Confetti active={true} count={14} />
        <div className="end-hero-anim" style={{ textAlign: 'center', padding: '22px 0 18px' }}>
          <div className="end-stagger-anim" style={{ fontSize: 64, '--es': 0 }} aria-hidden>
            🏆
          </div>
          <div
            className="end-stagger-anim"
            style={{
              fontWeight: 900,
              fontSize: 29,
              color: 'white',
              marginTop: 10,
              lineHeight: 1.25,
              textShadow: '0 2px 28px rgba(0,0,0,0.2)',
              '--es': 2,
            }}
          >
            {isNewHigh ? 'New High Score!' : 'Great Game!'}
          </div>
          <div
            className="end-stagger-anim"
            style={{
              color: 'rgba(255,255,255,0.78)',
              fontWeight: 600,
              fontSize: 15,
              marginTop: 8,
              maxWidth: 300,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.35,
              '--es': 4,
            }}
          >
            You learned 3 finance terms!
          </div>
        </div>

        <div
          className="end-stagger-anim end-panel-glow"
          style={{
            background: 'rgba(255,255,255,0.14)',
            borderRadius: 26,
            padding: '22px 20px',
            marginBottom: 16,
            backdropFilter: 'blur(12px)',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
            '--es': 5,
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.74)', fontWeight: 700, fontSize: 13, marginBottom: 6, letterSpacing: '0.06em' }}>FINAL SCORE</div>
          <div
            className="score-number-anim"
            style={{ fontWeight: 900, fontSize: 54, color: '#fef3c7', letterSpacing: -1, textShadow: '0 4px 32px rgba(0,0,0,0.15)' }}
          >
            {fmt(finalScore)}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 14, marginTop: 8 }}>Time {fmtTime(totalTime)}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div
            className="end-stagger-anim"
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 18,
              padding: '16px 14px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.12)',
              '--es': 6,
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>ALL-TIME BEST</div>
            <div style={{ color: 'white', fontWeight: 900, fontSize: 22, marginTop: 6 }}>{fmt(highScore)}</div>
          </div>
          <div
            className="end-stagger-anim"
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 18,
              padding: '16px 14px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.12)',
              '--es': 7,
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>BEST TIME</div>
            <div style={{ color: 'white', fontWeight: 900, fontSize: 22, marginTop: 6 }}>{bestTime ? fmtTime(bestTime) : '—'}</div>
          </div>
        </div>

        <div className="end-stagger-anim" style={{ display: 'flex', flexDirection: 'column', gap: 10, '--es': 8 }}>
          <button type="button" className="btn btn-green" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
