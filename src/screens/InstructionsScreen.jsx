import { useState } from 'react';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { HAPTIC, haptic } from '../utils/haptics.js';
import LetterBoard from '../components/LetterBoard.jsx';
import HUD from '../components/HUD.jsx';
import WheelSpinButton from '../components/wheel/WheelSpinButton.jsx';

const SEG_COLORS = ['#FF6B6B', '#185FA5', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4'];

const STEPS = [
  {
    image: '/hostInstruction1.webp',
    text: 'Spin the wheel to set your prize, then tap a consonant. Each match in the puzzle banks the prize per letter!',
    cta: 'Next',
  },
  {
    image: '/hostInstruction1.webp',
    text: "Vowels cost RM250 to buy — but no risk of BUST. Hit Solve when you've cracked the puzzle!",
    cta: 'Next',
  },
  {
    image: '/hostInstructionDone.webp',
    text: 'Three rounds, harder each time. Bigger your bank, bigger your high score!',
    cta: "Let's play 🎡",
  },
];

const noop = () => {};

export default function InstructionsScreen({ onStart }) {
  const [step, setStep] = useState(0);
  const [hostMissing, setHostMissing] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function advance() {
    haptic(HAPTIC.PRIMARY);
    if (isLast) {
      void FinSpinAudio.resume().then(() => FinSpinAudio.playUiStart());
      onStart();
    } else {
      setStep((s) => s + 1);
    }
  }

  function skip() {
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

      <div className="instr-header">
        {step === 0 ? (
          <button className="instr-skip" type="button" onClick={skip}>
            Skip
          </button>
        ) : (
          <span className="instr-skip-spacer" aria-hidden />
        )}
        <div className="instr-step-pill">
          {step + 1} / {STEPS.length}
        </div>
      </div>

      <div className="home-title-wrap home-hero-in">
        <div className="home-title instr-title">How to play</div>
      </div>

      <div className="instr-demo-card home-hero-in" key={`demo-${step}`}>
        {step === 0 && (
          <div className="instr-demo instr-demo-spin">
            <LetterBoard
              term="MONEY"
              revealed={new Set(['M', 'O', 'N'])}
              shake={false}
              justCorrect={null}
              onPuzzleInteract={null}
            />
            <WheelSpinButton spinning={false} disabled onSpin={noop} />
          </div>
        )}
        {step === 1 && (
          <div className="instr-demo instr-demo-vowels">
            <div className="instr-vowel-row">
              {['A', 'E', 'I', 'O', 'U'].map((v) => (
                <button
                  key={v}
                  type="button"
                  className="btn btn-spin-vowel btn-spin-vowel--sm"
                  disabled
                  aria-hidden
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="instr-vowel-badge">RM250 each</div>
          </div>
        )}
        {step === 2 && (
          <div className="instr-demo instr-demo-hud">
            <HUD round={1} totalEarnings={2500} spinsUsed={2} maxSpins={6} />
          </div>
        )}
      </div>

      <div className="home-stage-floor instr-floor">
        <div className="home-host-wrap">
          {hostMissing ? (
            <div className="home-host-fallback" aria-hidden>
              <div className="home-host-fallback-emoji">🎤</div>
              <div className="home-host-fallback-text">
                Host image missing<br />
                <code>{current.image}</code>
              </div>
            </div>
          ) : (
            <img
              key={current.image}
              src={current.image}
              alt="Roda i-mpian host"
              className="home-host instr-host"
              onError={() => setHostMissing(true)}
            />
          )}
        </div>
      </div>

      <div className="home-dialog home-hero-in" role="status" aria-live="polite" key={`dialog-${step}`}>
        <div className="home-dialog-name">HOST</div>
        <div className="home-dialog-body">
          <p className="home-dialog-text">{current.text}</p>
        </div>
      </div>

      <div className="home-foot">
        <button className="btn btn-green home-start" onClick={advance} type="button">
          {current.cta}
        </button>
      </div>
    </div>
  );
}
