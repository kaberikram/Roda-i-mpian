import { useState } from 'react';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { fmt, fmtTime } from '../utils/format.js';
import { HAPTIC, haptic } from '../utils/haptics.js';

const HOME_WELCOME =
  'Welcome! Spin the wheel, guess letters, and solve money-themed puzzles across three rounds. Fun first, with useful ideas along the way.';

// Pulled from src/data/wheelSegments.json so the home screen reads as the same game.
const SEG_COLORS = ['#FF6B6B', '#185FA5', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4'];

export default function HomeScreen({ highScore, bestTime, onStart }) {
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
        <div className="home-title">Roda i-mpian</div>
        {highScore > 0 && (
          <div className="home-best home-best--header home-hero-in">
            <span className="home-best-label">★ BEST</span>
            <span className="home-best-score">{fmt(highScore)}</span>
            {bestTime && <span className="home-best-time">⏱ {fmtTime(bestTime)}</span>}
          </div>
        )}
      </div>

      <div className="home-stage-floor">
        <div className="home-host-wrap">
          {hostMissing ? (
            <div className="home-host-fallback" aria-hidden>
              <div className="home-host-fallback-emoji">🎤</div>
              <div className="home-host-fallback-text">
                Drop host photo at<br />
                <code>public/host.webp</code>
              </div>
            </div>
          ) : (
            <img
              src="/host.webp"
              alt="Your Roda i-mpian host, smiling and waving"
              className="home-host"
              onError={() => setHostMissing(true)}
            />
          )}
        </div>
      </div>

      <div className="home-dialog home-hero-in" role="status" aria-live="polite">
        <div className="home-dialog-name">HOST</div>
        <div className="home-dialog-body">
          <p className="home-dialog-text">{HOME_WELCOME}</p>
        </div>
      </div>

      <div className="home-foot">
        <button
          className="btn btn-green home-start"
          onClick={handleStart}
          type="button"
        >
          Start playing
        </button>
      </div>
    </div>
  );
}
