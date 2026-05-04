import { useState } from 'react';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { fmt, fmtTime } from '../utils/format.js';
import { HAPTIC, haptic } from '../utils/haptics.js';

const HOME_TAGLINES = [
  'Hi! Pusing roda — pocket the smarts.',
  "Today's lucky spin — let's go?",
  'Three rounds. Real money ideas.',
];

// Pulled from src/data/wheelSegments.json so the home screen reads as the same game.
const SEG_COLORS = ['#FF6B6B', '#185FA5', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4'];

export default function HomeScreen({ highScore, bestTime, onStart }) {
  const [tagline] = useState(() => HOME_TAGLINES[Math.floor(Math.random() * HOME_TAGLINES.length)]);
  const [hostMissing, setHostMissing] = useState(false);

  function handleStart() {
    // Fire haptic synchronously inside the user gesture — iOS loses the
    // gesture context after any await/microtask, which kills the fallback.
    haptic(HAPTIC.PRIMARY);
    void FinSpinAudio.resume().then(() => FinSpinAudio.playUiStart());
    onStart();
  }

  return (
    <div className="screen home-stage">
      <div className="home-spotlight" aria-hidden />
      <div className="home-wheel-bg" aria-hidden>
        <img src="/fortune-wheel.svg" alt="" />
      </div>

      <div className="home-sparkles" aria-hidden>
        {SEG_COLORS.map((c, i) => (
          <span key={c} className={`home-spark home-spark-${i}`} style={{ background: c, color: c }} />
        ))}
      </div>

      <div className="home-title-wrap home-hero-in">
        <div className="home-eyebrow">
          <span className="home-eyebrow-dot" /> LIVE GAME SHOW
        </div>
        <div className="home-title">FinSpin</div>
        <div className="home-subtitle">Roda Impian</div>
      </div>

      <div className="home-stage-floor">
        <div className="home-host-wrap">
          <div className="home-bubble home-hero-in">
            {tagline}
            <span className="home-bubble-tail" aria-hidden />
          </div>

          {hostMissing ? (
            <div className="home-host-fallback" aria-hidden>
              <div className="home-host-fallback-emoji">🎤</div>
              <div className="home-host-fallback-text">
                Drop host photo at<br />
                <code>public/host.png</code>
              </div>
            </div>
          ) : (
            <img
              src="/host.png"
              alt="Your FinSpin host, smiling and waving"
              className="home-host"
              onError={() => setHostMissing(true)}
            />
          )}
        </div>
      </div>

      <div className="home-foot">
        {highScore > 0 && (
          <div className="home-best home-hero-in">
            <span className="home-best-label">★ BEST</span>
            <span className="home-best-score">{fmt(highScore)}</span>
            {bestTime && <span className="home-best-time">⏱ {fmtTime(bestTime)}</span>}
          </div>
        )}

        <button
          className="btn btn-green home-start"
          onClick={handleStart}
          type="button"
        >
          Spin to play 🎡
        </button>
      </div>
    </div>
  );
}
