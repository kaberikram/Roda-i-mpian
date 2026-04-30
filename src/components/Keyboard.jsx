import { VOWELS } from '../constants/game.js';
import { fmt } from '../utils/format.js';

export default function Keyboard({
  guessed,
  onGuess,
  onSpinAgain,
  vowelCost,
  canAffordVowel,
  phase,
  vowelOnly = false,
  showEndRoundDeadEnd = false,
  onEndRoundDeadEnd,
}) {
  const rows = vowelOnly
    ? [['A', 'E', 'I', 'O', 'U']]
    : [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', width: '100%', maxWidth: 420, margin: '0 auto' }}>
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
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: vowelOnly ? 0 : ri === 1 ? '0 16px' : ri === 2 ? '0 32px' : 0 }}>
          {row.map((letter) => {
            const isVowel = VOWELS.has(letter);
            const used = guessed.has(letter);
            const disabled = used || phase !== 'guess' || (vowelOnly && !isVowel);
            const cantAfford = isVowel && !canAffordVowel && !used;
            return (
              <button
                key={letter}
                className={`letter-key ${isVowel ? 'vowel' : 'consonant'}`}
                disabled={disabled || cantAfford}
                onClick={() => onGuess(letter)}
                style={{ opacity: used ? 0.25 : cantAfford ? 0.4 : 1 }}
              >
                {letter}
                {isVowel && !used && !vowelOnly ? (
                  <div
                    style={{
                      fontSize: 7,
                      lineHeight: 1,
                      marginTop: -1,
                      color: 'inherit',
                      opacity: 0.7,
                    }}
                  >
                    {fmt(vowelCost)}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
      {phase === 'guess' && !vowelOnly && showEndRoundDeadEnd && typeof onEndRoundDeadEnd === 'function' ? (
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 420,
            alignSelf: 'center',
          }}
        >
          <button
            type="button"
            className="kbd-end-round-bust"
            onClick={onEndRoundDeadEnd}
            style={{
              padding: '10px 18px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: '0.02em',
              borderRadius: 21,
              border: 'none',
              cursor: 'pointer',
              color: '#791F1F',
              background: '#FCEBEB',
              boxShadow: '0 3px 0 #dcb8b8',
              boxSizing: 'border-box',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            End round
          </button>
        </div>
      ) : null}
      {phase === 'guess' && vowelOnly && typeof onSpinAgain === 'function' ? (
        <button
          type="button"
          className="btn btn-spin"
          onClick={onSpinAgain}
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
          SPIN AGAIN
        </button>
      ) : null}
    </div>
  );
}
