import { useState } from 'react';
import { VOWELS } from '../constants/game.js';
import { fmt } from '../utils/format.js';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { HAPTIC, haptic } from '../utils/haptics.js';

const FULL_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const SOLVE_DRAFT_MAX = 120;

export default function Keyboard({
  guessed,
  onGuess,
  onVowelBack,
  onBuyVowel,
  canBuyVowel = false,
  canSolvePhrase = false,
  onTrySolve,
  vowelCost,
  phase,
  vowelOnly = false,
  buyVowelButtonRef,
  pulseBuyVowel = false,
  pulseKeyboard = false,
}) {
  const [solveOpen, setSolveOpen] = useState(false);
  const [solveDraft, setSolveDraft] = useState('');

  const rows = vowelOnly
    ? [['A', 'E', 'I', 'O', 'U']]
    : [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      ];

  function closeSolveModal() {
    setSolveOpen(false);
    setSolveDraft('');
  }

  function submitSolve() {
    const t = solveDraft.trim();
    if (!t || typeof onTrySolve !== 'function') return;
    onTrySolve(t);
    closeSolveModal();
  }

  function appendSolveLetter(letter) {
    FinSpinAudio.resume();
    FinSpinAudio.playKeyTap();
    haptic(HAPTIC.TAP);
    setSolveDraft((d) => (d.length >= SOLVE_DRAFT_MAX ? d : d + letter));
  }

  function appendSolveSpace() {
    FinSpinAudio.resume();
    FinSpinAudio.playKeyTap();
    haptic(HAPTIC.TAP);
    setSolveDraft((d) => {
      if (d.length >= SOLVE_DRAFT_MAX) return d;
      if (d.length === 0 || d.endsWith(' ')) return d;
      return `${d} `;
    });
  }

  function backspaceSolve() {
    FinSpinAudio.resume();
    FinSpinAudio.playKeyTap();
    haptic(HAPTIC.TAP);
    setSolveDraft((d) => d.slice(0, -1));
  }

  const solveDisabled = !canSolvePhrase;
  const solveTitle = solveDisabled ? 'Spin at least once this round, then you can solve' : 'Tap letters below';
  const letterRows = solveOpen ? FULL_ROWS : rows;
  const submitSolveDisabled = !solveDraft.trim();

  return (
    <div
      className={pulseKeyboard ? 'keyboard-nudge-pulse' : undefined}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch', width: '100%', maxWidth: 420, margin: '0 auto' }}
    >
      {vowelOnly && !solveOpen ? (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 13,
            color: '#3C3489',
            letterSpacing: '0.02em',
          }}
        >
          Pick a vowel · {fmt(vowelCost)}
        </div>
      ) : null}

      {phase === 'guess' && typeof onTrySolve === 'function' && !solveOpen && !vowelOnly ? (
        <div
          style={{
            display: 'flex',
            flexDirection: vowelOnly ? 'column' : 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginBottom: vowelOnly ? 2 : 4,
            marginTop: vowelOnly ? 6 : 0,
          }}
        >
          {!vowelOnly && typeof onBuyVowel === 'function' ? (
            <button
              ref={buyVowelButtonRef}
              type="button"
              className={`btn btn-spin-vowel btn-spin-vowel--sm${pulseBuyVowel ? ' cta-nudge' : ''}`}
              disabled={!canBuyVowel}
              onClick={onBuyVowel}
              style={{
                fontSize: 11,
                padding: '7px 18px',
                borderRadius: 40,
                letterSpacing: '0.4px',
                lineHeight: 1.15,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              BUY VOWEL
            </button>
          ) : null}
          <button
            type="button"
            className="btn kbd-solve-btn"
            disabled={solveDisabled}
            title={solveTitle}
            onClick={() => {
              if (solveDisabled) return;
              setSolveOpen(true);
            }}
            style={{
              fontSize: 11,
              padding: '7px 18px',
              borderRadius: 40,
              letterSpacing: '0.35px',
              lineHeight: 1.15,
              width: 'auto',
              minWidth: 112,
              marginTop: vowelOnly ? 0 : 8,
              marginBottom: vowelOnly ? 0 : 8,
            }}
          >
            SOLVE
          </button>
        </div>
      ) : null}

      {solveOpen ? (
        <div
          className="kbd-solve-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="kbd-solve-title"
        >
          <div id="kbd-solve-title" className="kbd-solve-panel__title">
            Solve the puzzle
          </div>
          <p className="kbd-solve-panel__hint">Use the keys below (spaces OK). Wrong guess ends this turn.</p>
          <div
            className="kbd-solve-panel__draft"
            aria-live="polite"
            aria-label="Your answer so far"
          >
            {solveDraft ? (
              <span className="kbd-solve-panel__draft-text">{solveDraft}</span>
            ) : (
              <span className="kbd-solve-panel__draft-placeholder">Tap letters…</span>
            )}
          </div>
          <div className="kbd-solve-panel__actions">
            <button type="button" className="btn btn-outline kbd-solve-panel__btn" onClick={closeSolveModal}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary kbd-solve-panel__btn"
              disabled={submitSolveDisabled}
              onClick={submitSolve}
            >
              Submit
            </button>
          </div>
        </div>
      ) : null}

      {letterRows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: 'flex',
            gap: 6,
            justifyContent: 'center',
            padding: solveOpen
              ? ri === 1
                ? '0 16px'
                : ri === 2
                  ? '0 32px'
                  : 0
              : vowelOnly
                ? 0
                : ri === 1
                  ? '0 16px'
                  : ri === 2
                    ? '0 32px'
                    : 0,
          }}
        >
          {row.map((letter) => {
            const isVowel = VOWELS.has(letter);
            const used = guessed.has(letter);
            const vowelLockedInConsonantTurn = !solveOpen && !vowelOnly && isVowel;
            const disabled =
              phase !== 'guess' ||
              (solveOpen
                ? false
                : used || (vowelOnly && !isVowel) || vowelLockedInConsonantTurn);
            return (
              <button
                key={letter}
                className={`letter-key ${isVowel ? 'vowel' : 'consonant'}`}
                disabled={disabled}
                onClick={() => (solveOpen ? appendSolveLetter(letter) : onGuess(letter))}
                style={{
                  opacity: solveOpen ? 1 : used ? 0.25 : vowelLockedInConsonantTurn ? 0.32 : 1,
                }}
                title={vowelLockedInConsonantTurn ? 'Use Buy Vowel above' : undefined}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
      {solveOpen ? (
        <div className="kbd-solve-space-row">
          <button type="button" className="btn kbd-solve-space" onClick={appendSolveSpace}>
            Space
          </button>
          <button type="button" className="btn kbd-solve-backspace" onClick={backspaceSolve} aria-label="Delete">
            ⌫
          </button>
        </div>
      ) : null}
      {phase === 'guess' && vowelOnly && !solveOpen && typeof onVowelBack === 'function' ? (
        <button
          type="button"
          className="btn btn-spin"
          onClick={onVowelBack}
          style={{
            marginTop: 12,
            width: '100%',
            maxWidth: 380,
            alignSelf: 'center',
            fontSize: 12,
            padding: '10px 28px',
            borderRadius: 50,
            letterSpacing: '0.5px',
          }}
        >
          ← BACK
        </button>
      ) : null}

    </div>
  );
}
