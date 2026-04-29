import { useState } from 'react';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { fmt, fmtTime } from '../utils/format.js';
import { HAPTIC, haptic } from '../utils/haptics.js';

const HOME_TAGLINES = [
  'Spin the wheel — pocket the knowledge.',
  'Guess the term. Grow your money smarts.',
  'Three rounds. Real finance ideas.',
];

const FEATURE_PILLS = [
  { icon: '🎯', label: '3 Rounds', hint: 'Easy → Hard' },
  { icon: '💰', label: 'Earn Bank', hint: 'Per letter' },
  { icon: '🧠', label: 'Learn Terms', hint: 'Real tips' },
];

export default function HomeScreen({ highScore, bestTime, onStart }) {
  const [tagline] = useState(() => HOME_TAGLINES[Math.floor(Math.random() * HOME_TAGLINES.length)]);

  async function handleStart() {
    await FinSpinAudio.resume();
    FinSpinAudio.playUiStart();
    haptic(HAPTIC.PRIMARY);
    onStart();
  }

  return (
    <div
      className="screen"
      style={{
        background: 'linear-gradient(160deg,#0f2d57 0%,#185FA5 55%,#2478C8 100%)',
        justifyContent: 'space-between',
        padding: '0 28px 36px',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div className="home-hero-in" style={{ marginBottom: 4, animationDelay: '0s' }}>
          <div className="home-wheel" style={{ fontSize: 72, lineHeight: 1 }} aria-hidden>
            🎡
          </div>
        </div>
        <div className="home-hero-in" style={{ textAlign: 'center', animationDelay: '0.06s' }}>
          <div style={{ fontWeight: 900, fontSize: 38, color: 'white', letterSpacing: -1, lineHeight: 1, textShadow: '0 2px 24px rgba(0,0,0,0.2)' }}>
            FinSpin
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.78)', marginTop: 6 }}>Roda Impian</div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, maxWidth: 280, lineHeight: 1.35 }}>{tagline}</div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {FEATURE_PILLS.map((b, i) => (
            <div
              key={b.label}
              title={b.hint}
              className="home-pill home-hero-in"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '10px 14px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                cursor: 'default',
                animationDelay: `${0.22 + i * 0.05}s`,
              }}
            >
              <div style={{ fontSize: 20 }}>{b.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginTop: 3 }}>{b.label}</div>
            </div>
          ))}
        </div>

        {highScore > 0 && (
          <div
            className="home-hero-in"
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '12px 24px',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(252, 211, 77, 0.35)',
              animationDelay: '0.45s',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em' }}>PERSONAL BEST</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#FCD34D', marginTop: 4 }}>{fmt(highScore)}</div>
            {bestTime && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>⏱ {fmtTime(bestTime)}</div>}
          </div>
        )}
      </div>

      <button className="btn btn-green home-start" onClick={handleStart} style={{ fontSize: 20, padding: '20px' }} type="button">
        Let’s play — Start
      </button>
    </div>
  );
}
