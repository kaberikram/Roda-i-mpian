import { useState } from 'react';
import { VOWELS } from '../constants/game.js';
import { fmt } from '../utils/format.js';

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

  const solveDisabled = !canSolvePhrase;
  const solveTitle = solveDisabled ? 'Spin at least once this round, then you can solve' : 'Type the full phrase';

  return (
    <div
      className={pulseKeyboard ? 'keyboard-nudge-pulse' : undefined}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch', width: '100%', maxWidth: 420, margin: '0 auto' }}
    >
      {vowelOnly ? (
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

      {phase === 'guess' && typeof onTrySolve === 'function' ? (
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

      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: vowelOnly ? 0 : ri === 1 ? '0 16px' : ri === 2 ? '0 32px' : 0 }}>
          {row.map((letter) => {
            const isVowel = VOWELS.has(letter);
            const used = guessed.has(letter);
            const vowelLockedInConsonantTurn = !vowelOnly && isVowel;
            const disabled = used || phase !== 'guess' || (vowelOnly && !isVowel) || vowelLockedInConsonantTurn;
            return (
              <button
                key={letter}
                className={`letter-key ${isVowel ? 'vowel' : 'consonant'}`}
                disabled={disabled}
                onClick={() => onGuess(letter)}
                style={{ opacity: used ? 0.25 : vowelLockedInConsonantTurn ? 0.32 : 1 }}
                title={vowelLockedInConsonantTurn ? 'Use Buy Vowel above' : undefined}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
      {phase === 'guess' && vowelOnly && typeof onVowelBack === 'function' ? (
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

      {solveOpen ? (
        <div
          className="kbd-solve-modal-root"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kbd-solve-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'rgba(15, 23, 42, 0.45)',
            boxSizing: 'border-box',
          }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) closeSolveModal();
          }}
        >
          <div
            className="kbd-solve-modal-card"
            style={{
              width: '100%',
              maxWidth: 360,
              borderRadius: 20,
              padding: '18px 18px 16px',
              background: 'white',
              boxShadow: '0 24px 48px rgba(15,23,42,0.2)',
              border: '1px solid rgba(15,23,42,0.08)',
              boxSizing: 'border-box',
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div id="kbd-solve-title" style={{ fontWeight: 900, fontSize: 17, color: '#1E293B', marginBottom: 6 }}>
              Solve the puzzle
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12, lineHeight: 1.4 }}>
              Type the full phrase (spaces OK). Wrong guess ends this turn.
            </div>
            <input
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={solveDraft}
              onChange={(e) => setSolveDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitSolve();
                if (e.key === 'Escape') closeSolveModal();
              }}
              placeholder="Your answer…"
              style={{
                width: '100%',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                padding: '12px 14px',
                borderRadius: 12,
                border: '2px solid #CBD5E1',
                marginBottom: 14,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={closeSolveModal} style={{ width: 'auto', padding: '10px 18px', fontSize: 14 }}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={submitSolve} style={{ width: 'auto', padding: '10px 20px', fontSize: 14 }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
