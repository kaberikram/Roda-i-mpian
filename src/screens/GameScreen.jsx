import { useRef } from 'react';
import HUD from '../components/HUD.jsx';
import LetterBoard from '../components/LetterBoard.jsx';
import Keyboard from '../components/Keyboard.jsx';
import BalanceDisplay from '../components/BalanceDisplay.jsx';
import WheelArc from '../components/wheel/WheelArc.jsx';
import WheelSpinButton from '../components/wheel/WheelSpinButton.jsx';
import { useGameRound } from '../hooks/useGameRound.js';
import { useElementWidth } from '../hooks/useElementWidth.js';
import { useScreenTint } from '../hooks/useScreenTint.js';
import { fmt } from '../utils/format.js';

const BG_COLOR = '#F7F8FC';
const DOCK_BG = 'white';
const DOCK_BORDER = '#E8EDF5';
const DIFF_LABELS = ['', 'Easy', 'Medium', 'Hard'];
const DIFF_COLORS = ['', '#27500A', '#633806', '#791F1F'];
const DIFF_BGS = ['', '#EAF3DE', '#FEF3C7', '#FCEBEB'];

export default function GameScreen({ term, roundNum, totalScore, onRoundEnd }) {
  const round = useGameRound({ term, onRoundEnd });
  const wheelSpinRef = useRef(null);
  const spinButtonElRef = useRef(null);
  const spinButtonWidthPx = useElementWidth(spinButtonElRef, [round.phase, round.wheelSpinning]);
  const tintLayers = useScreenTint(round.spinWheelAccent, BG_COLOR);

  const isGuessPhase = round.phase === 'guess';

  return (
    <div
      className="screen"
      style={{
        background: BG_COLOR,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', ...tintLayers[0] }}
      />
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', ...tintLayers[1] }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HUD round={roundNum - 1} totalEarnings={totalScore} spinsUsed={round.spinsUsed} maxSpins={round.maxSpins} />
      </div>

      {/* Content area — IDENTICAL across phases so it doesn't jump when phase changes */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: `16px 16px 0`,
          paddingBottom: 280,
          gap: 18,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative' }}>
            {round.lastDelta && (
              <div
                key={round.lastDelta.id}
                style={{
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  fontWeight: 900,
                  fontSize: 22,
                  color: round.lastDelta.amount >= 0 ? '#1F8B3B' : '#B5341F',
                  textShadow: '0 2px 10px rgba(0,0,0,0.18)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  animation: 'delta-float 900ms ease-out forwards',
                  willChange: 'transform, opacity',
                }}
              >
                {round.lastDelta.amount >= 0 ? '+' : '−'}
                {fmt(Math.abs(round.lastDelta.amount))}
              </div>
            )}
            <div
              key={round.lastDelta ? `pill-${round.lastDelta.id}` : 'pill'}
              style={{
                background: 'transparent',
                border: '2.5px solid #185FA5',
                borderRadius: 24,
                padding: '10px 22px',
                fontWeight: 800,
                fontSize: 16,
                color: '#185FA5',
                animation: round.lastDelta ? 'pill-pulse 360ms ease-out' : undefined,
                willChange: 'transform',
              }}
            >
              <span style={{ fontWeight: 700, opacity: 0.9 }}>This round </span>
              <span>{fmt(round.roundBalance)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ background: '#EEEDFE', borderRadius: 20, padding: '4px 12px', fontWeight: 700, fontSize: 12, color: '#3C3489' }}>{term.cat}</div>
            <div
              style={{
                background: DIFF_BGS[term.diff],
                borderRadius: 20,
                padding: '4px 12px',
                fontWeight: 700,
                fontSize: 12,
                color: DIFF_COLORS[term.diff],
              }}
            >
              {DIFF_LABELS[term.diff]}
            </div>
          </div>
        </div>

        <div style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
          <LetterBoard term={term.term} revealed={round.revealed} shake={round.shake} justCorrect={round.justCorrect} />
        </div>

        <div style={{ fontWeight: 700, fontSize: 15, color: '#64748B', textAlign: 'center', padding: '0 8px' }}>
          {`💡 ${term.hint}`}
        </div>
      </div>

      {/* Bottom dock — wheel & keyboard stacked; cross-fade + slide (no abrupt swap) */}
      <div className="game-dock-stack" style={{ zIndex: 1 }}>
        <div
          className="game-dock-layer game-dock-layer--wheel"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: isGuessPhase ? 1 : 2,
            transform: isGuessPhase ? 'translateY(32px) scale(0.97)' : 'translateY(10dvh) scale(1)',
            opacity: isGuessPhase ? 0 : 1,
            pointerEvents: isGuessPhase ? 'none' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              paddingBottom: 12,
              width: '100%',
              maxWidth: 320,
              margin: '0 auto',
              paddingInline: 12,
            }}
          >
            <button
              type="button"
              className="btn btn-spin-vowel btn-spin-vowel--sm"
              disabled={!round.canBuyVowelTap}
              title={round.buyVowelHint || 'Buy vowel'}
              onClick={round.beginBuyVowel}
              style={{
                fontSize: 10,
                padding: '8px 22px',
                borderRadius: 40,
                letterSpacing: '0.4px',
                boxSizing: 'border-box',
                width: spinButtonWidthPx != null ? Math.round(spinButtonWidthPx * 0.8 * 100) / 100 : undefined,
                minWidth: spinButtonWidthPx == null ? 112 : undefined,
                alignSelf: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                lineHeight: 1.15,
              }}
            >
              BUY VOWEL
            </button>
            <WheelSpinButton
              spinButtonRef={spinButtonElRef}
              spinning={round.wheelSpinning}
              disabled={round.phase !== 'spin' || round.spinsUsed >= round.maxSpins}
              onSpin={() => wheelSpinRef.current && wheelSpinRef.current()}
            />
          </div>
          <WheelArc onResult={round.handleSpin} spinRef={wheelSpinRef} onSpinChange={round.setWheelSpinning} />
        </div>
        <div
          className="game-dock-layer"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: isGuessPhase ? 2 : 1,
            transform: isGuessPhase ? 'translateY(0)' : 'translateY(110%)',
            opacity: isGuessPhase ? 1 : 0,
            pointerEvents: isGuessPhase ? 'auto' : 'none',
            background: DOCK_BG,
            borderTop: `2px solid ${DOCK_BORDER}`,
            borderRadius: '24px 24px 0 0',
            padding: '22px 12px 28px',
            boxShadow: '0 -6px 24px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <Keyboard
            guessed={round.guessed}
            onGuess={round.handleGuess}
            onVowelBack={round.handleVowelBack}
            onBuyVowel={round.beginBuyVowel}
            canBuyVowel={round.canBuyVowelInGuess}
            vowelCost={round.vowelCost}
            phase={round.phase}
            vowelOnly={round.vowelBuyTurn}
            showEndRoundDeadEnd={round.showEndRoundDeadEnd}
            onEndRoundDeadEnd={round.endRoundWhenUnwinnable}
          />
        </div>
      </div>

      <BalanceDisplay spinValue={round.spinValue} />
    </div>
  );
}
