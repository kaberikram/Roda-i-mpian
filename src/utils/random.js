import POOL from '../data/terms.json';
import { VOWELS } from '../constants/game.js';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * No free starter letters — the board starts blank; letters come from spins / guesses / solve.
 * @param {string} [_termStr] kept for call-site compatibility
 */
export function starterLettersForTerm(_termStr) {
  return [];
}

export function openerStatusFromPicks(picks) {
  if (picks.length === 0) return { msg: 'Spin the wheel to start!', type: 'info' };
  if (picks.length === 1) return { msg: `🎁 "${picks[0]}" is on the board — spin the wheel!`, type: 'info' };
  return { msg: `🎁 ${picks.join(' · ')} on the board — spin to play!`, type: 'info' };
}

export function pickTerms() {
  const easy = shuffle(POOL.filter((t) => t.diff === 1))[0];
  const med = shuffle(POOL.filter((t) => t.diff === 2))[0];
  const hard = shuffle(POOL.filter((t) => t.diff === 3))[0];
  return [easy, med, hard];
}
