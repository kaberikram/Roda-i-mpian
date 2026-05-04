import { useEffect } from 'react';
import Confetti from '../components/Confetti.jsx';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { fmt } from '../utils/format.js';
import { HAPTIC, haptic } from '../utils/haptics.js';

export default function ResultScreen({ term, roundScore, totalEarnings, roundNum, totalRounds, onNext }) {
  function handleNext() {
    haptic(HAPTIC.PRIMARY);
    FinSpinAudio.resume();
    FinSpinAudio.playKeyTap();
    onNext();
  }

  useEffect(() => {
    let alive = true;
    void (async () => {
      await FinSpinAudio.resume();
      if (!alive) return;
      FinSpinAudio.playRoundTaDa();
    })();
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div className="screen screen-result-shell vt-screen">
      <div className="result-bg-layer" aria-hidden />
      <div
        className="screen-compact-phone"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          paddingTop: 'max(4px, env(safe-area-inset-top, 0px))',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          <Confetti active={true} count={14} />
        </div>
        <div className="screen-result-body">
          <div className="screen-result-body__center">
            <div className="result-hero-anim" style={{ textAlign: 'center', padding: '18px 0 12px', position: 'relative' }}>
              <div className="result-stagger-anim" style={{ fontSize: 52, '--rs': 0 }}>
                🎉
              </div>
              <div className="result-stagger-anim" style={{ fontWeight: 900, fontSize: 26, color: '#185FA5', marginTop: 10, lineHeight: 1.2, '--rs': 2 }}>
                Round {roundNum} Complete!
              </div>
            </div>

            <div
              className="result-card-anim"
              style={{
                '--ci': 0,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 12,
                padding: '16px 18px',
                background: 'rgba(255,255,255,0.94)',
                borderRadius: 18,
                border: '1px solid rgba(15,23,42,0.08)',
                boxShadow: '0 10px 28px rgba(15,23,42,0.08)',
              }}
            >
              <div style={{ minWidth: 0, flex: '1 1 0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#185FA5', opacity: 0.85, marginBottom: 4, letterSpacing: '0.02em' }}>This round</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#185FA5', lineHeight: 1.1 }}>{fmt(roundScore)}</div>
              </div>
              <div style={{ minWidth: 0, flex: '1 1 0', textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#27500A', opacity: 0.85, marginBottom: 4, letterSpacing: '0.02em' }}>Total</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#27500A', lineHeight: 1.1 }}>{fmt(totalEarnings)}</div>
              </div>
            </div>

            <div
              className="result-term-card-anim"
              style={{
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 22,
                padding: '20px',
                marginBottom: 0,
                border: '1px solid rgba(15,23,42,0.06)',
                boxShadow: '0 14px 40px rgba(15,23,42,0.07)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg,#185FA5,#2478C8)',
                    color: 'white',
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontWeight: 800,
                    fontSize: 12,
                    boxShadow: '0 6px 16px rgba(24,95,165,0.25)',
                  }}
                >
                  {term.cat}
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: 21, color: '#1E293B', marginBottom: 9, lineHeight: 1.2 }}>{term.term}</div>
              <div className="result-term-def" style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, marginBottom: 14 }}>{term.def}</div>
              <div
                className="result-tip-box"
                style={{
                  background: 'linear-gradient(180deg,#eaf6ec 0%,#e4f5e9 100%)',
                  borderRadius: 14,
                  padding: '13px 15px',
                  border: '1px solid rgba(46,139,87,0.15)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 11, color: '#166534', marginBottom: 5, letterSpacing: '0.04em' }}>ACTION TIP</div>
                <div className="result-tip-text" style={{ fontSize: 13, color: '#1b4332', lineHeight: 1.55 }}>{term.tip}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="result-actions-anim"
          style={{
            flexShrink: 0,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 14,
            paddingBottom: 'max(16px, calc(12px + env(safe-area-inset-bottom, 0px)))',
            position: 'relative',
            zIndex: 4,
            background: 'transparent',
          }}
        >
          {roundNum < totalRounds ? (
            <button type="button" className="btn btn-green" onClick={handleNext}>
              Next Round →
            </button>
          ) : (
            <button type="button" className="btn btn-green" onClick={handleNext}>
              See Final Score
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
