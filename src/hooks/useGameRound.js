import { useEffect, useMemo, useRef, useState } from 'react';
import FinSpinAudio from '../audio/finSpinAudio.js';
import { VOWELS, SPEED_BONUS_BASE, SPEED_BONUS_DECAY, MIN_SPINS_BEFORE_SOLVE } from '../constants/game.js';
import { HAPTIC, haptic } from '../utils/haptics.js';
import { maxSpinsForUniqueCount } from '../utils/layout.js';
import { openerStatusFromPicks, starterLettersForTerm } from '../utils/random.js';

/**
 * Owns one round's state machine: spin → guess → solved. Returns the slice
 * needed by GameScreen (state) and the action handlers it wires into UI.
 */
export function useGameRound({ term, onRoundEnd }) {
  const starter = useMemo(() => {
    const picks = starterLettersForTerm(term.term);
    return {
      picks,
      revealed: new Set(picks),
      guessed: new Set(picks),
    };
  }, [term.term]);

  const [phase, setPhase] = useState('spin'); // 'spin' | 'guess' | 'solved'
  const [spinValue, setSpinValue] = useState(null);
  /** Landed wheel segment look — matches keyboard pill + ambient screen tint. */
  const [spinWheelAccent, setSpinWheelAccent] = useState(null);
  const [revealed, setRevealed] = useState(starter.revealed);
  const [guessed, setGuessed] = useState(starter.guessed);
  const [roundBalance, setRoundBalance] = useState(0);
  const [status, setStatus] = useState(() => openerStatusFromPicks(starter.picks));
  const [shake, setShake] = useState(false);
  const [justCorrect, setJustCorrect] = useState(null);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [spinsUsed, setSpinsUsed] = useState(0);
  /** Floats above the "This round" pill on each balance change. id keeps repeats remounting. */
  const [lastDelta, setLastDelta] = useState(null);
  const deltaIdRef = useRef(0);
  function emitDelta(amount) {
    if (!amount) return;
    deltaIdRef.current += 1;
    setLastDelta({ id: deltaIdRef.current, amount });
  }

  const startTimeRef = useRef(Date.now());
  const spinsUsedRef = useRef(0);

  const letters = term.term.replace(/\s/g, '').split('');
  const uniqueLetters = new Set(letters);
  const uniqueLettersNotPrefilled = [...uniqueLetters].filter((l) => !starter.revealed.has(l)).length;
  const maxSpins = maxSpinsForUniqueCount(uniqueLettersNotPrefilled);

  // Rare: starter letters already cover every unique letter in the puzzle
  useEffect(() => {
    const uniq = new Set(term.term.replace(/\s/g, '').split(''));
    if (![...uniq].every((l) => starter.revealed.has(l))) return;
    const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const speedBonus = Math.max(0, SPEED_BONUS_BASE - secs * SPEED_BONUS_DECAY);
    const roundTotal = speedBonus;
    setPhase('solved');
    setStatus({ msg: '🎉 Puzzle complete — what a start!', type: 'correct' });
    FinSpinAudio.playRoundSolve();
    haptic(HAPTIC.SOLVE);
    setTimeout(() => onRoundEnd(roundTotal, speedBonus, secs), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function failRound(reasonMsg) {
    const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setSpinWheelAccent(null);
    setSpinValue(null);
    setPhase('solved');
    setStatus({ msg: reasonMsg, type: 'miss' });
    FinSpinAudio.playFailBuzz();
    haptic(HAPTIC.FAIL);
    setTimeout(() => onRoundEnd(0, 0, secs), 1500);
  }

  function returnToWheelPhase() {
    setSpinValue(null);
    setSpinWheelAccent(null);

    const canSpin = spinsUsedRef.current < maxSpins;

    if (!canSpin) {
      failRound('No spins left. Round over.');
      return;
    }
    setPhase('spin');
  }

  function handleSpin(seg) {
    FinSpinAudio.resume();
    if (typeof seg.value === 'number') {
      FinSpinAudio.playLandMoney();
      haptic(HAPTIC.WHEEL_LAND);
    } else {
      FinSpinAudio.playLandBust();
      haptic(HAPTIC.WHEEL_BUST);
    }

    spinsUsedRef.current += 1;
    setSpinsUsed(spinsUsedRef.current);

    setSpinWheelAccent({ color: seg.color, text: seg.text });
    setSpinValue(seg.value);
    if (seg.value === 'BUST') {
      if (roundBalance > 0) emitDelta(-roundBalance);
      setRoundBalance(0);
      setStatus({ msg: '💥 BUST! You lost your round points!', type: 'bust' });
      setTimeout(() => {
        setStatus({ msg: spinsUsedRef.current >= maxSpins ? 'No spins left.' : 'Bad luck! Spin again.', type: 'info' });
        returnToWheelPhase();
      }, 2200);
    } else {
      setStatus({ msg: 'Pick a letter', type: 'spin' });
      // Pause to let the player register the value before keyboard slides in
      setTimeout(() => setPhase('guess'), 900);
    }
  }

  function normalizePhrase(s) {
    return String(s).toUpperCase().replace(/\s+/g, ' ').trim();
  }

  function trySolve(phraseRaw) {
    if (phase !== 'guess') return;
    if (spinsUsedRef.current < MIN_SPINS_BEFORE_SOLVE) return;
    haptic(HAPTIC.PRESS);
    FinSpinAudio.resume();
    FinSpinAudio.playKeyTap();
    const answer = normalizePhrase(term.term);
    const guess = normalizePhrase(phraseRaw);
    if (!guess) return;
    if (guess === answer) {
      const newRevealed = new Set(uniqueLetters);
      setRevealed(newRevealed);
      setGuessed(new Set(uniqueLetters));
      setJustCorrect(null);
      checkSolved(newRevealed, roundBalance);
      return;
    }
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setStatus({ msg: 'That’s not the phrase — back to the wheel.', type: 'miss' });
    FinSpinAudio.playLetterBad();
    returnToWheelPhase();
  }

  function checkSolved(newRevealed, balance) {
    const allRevealed = [...uniqueLetters].every((l) => newRevealed.has(l));
    if (allRevealed) {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const speedBonus = Math.max(0, SPEED_BONUS_BASE - secs * SPEED_BONUS_DECAY);
      const roundTotal = balance + speedBonus;
      setSpinWheelAccent(null);
      setSpinValue(null);
      setPhase('solved');
      setStatus({ msg: '🎉 Brilliant! Word solved!', type: 'correct' });
      FinSpinAudio.playRoundSolve();
      haptic(HAPTIC.SOLVE);
      setTimeout(() => onRoundEnd(roundTotal, speedBonus, secs), 1200);
    } else {
      returnToWheelPhase();
    }
  }

  function handleGuess(letter) {
    haptic(HAPTIC.TAP);
    FinSpinAudio.resume();
    FinSpinAudio.playKeyTap();

    const newGuessed = new Set([...guessed, letter]);
    setGuessed(newGuessed);

    const count = letters.filter((l) => l === letter).length;
    if (count > 0) {
      const earn = (typeof spinValue === 'number' ? spinValue : 0) * count;
      const newBalance = roundBalance + earn;
      const newRevealed = new Set([...revealed, letter]);
      setRevealed(newRevealed);
      setJustCorrect(new Set([letter]));
      setTimeout(() => setJustCorrect(null), 600);
      setRoundBalance(newBalance);
      emitDelta(earn);
      setStatus({ msg: `✅ "${letter}" ×${count}`, type: 'correct' });
      if (VOWELS.has(letter)) FinSpinAudio.playLetterVowel();
      else FinSpinAudio.playLetterGood();
      checkSolved(newRevealed, newBalance);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setStatus({ msg: `❌ No "${letter}" in this word.`, type: 'miss' });
      FinSpinAudio.playLetterBad();
      returnToWheelPhase();
    }
  }

  const canSolvePhrase = phase === 'guess' && spinsUsed >= MIN_SPINS_BEFORE_SOLVE;
  const spinsUntilSolve = MIN_SPINS_BEFORE_SOLVE - spinsUsed;
  const solvePhraseLockedHint =
    phase === 'guess' && spinsUntilSolve > 0
      ? spinsUntilSolve === 1
        ? 'Spin the wheel one more time to unlock Solve.'
        : `Spin the wheel ${spinsUntilSolve} more times to unlock Solve.`
      : null;

  return {
    // state
    phase,
    spinValue,
    spinWheelAccent,
    revealed,
    guessed,
    justCorrect,
    shake,
    roundBalance,
    status,
    spinsUsed,
    maxSpins,
    wheelSpinning,
    canSolvePhrase,
    solvePhraseLockedHint,
    lastDelta,
    // actions
    setWheelSpinning,
    handleSpin,
    handleGuess,
    trySolve,
  };
}
