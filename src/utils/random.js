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

/** At least two distinct puzzle letters revealed when possible (else all unique letters for very short grids).
 *  Never leave only vowels hidden while consonants still exist — player starts at RM0 and needs a consonant to earn or must afford RM250 to buy a vowel. */
export function starterLettersForTerm(termStr) {
  const uniq = [...new Set(termStr.replace(/\s/g, '').split(''))];
  if (uniq.length <= 2) return uniq;
  const consonantsInWord = new Set(uniq.filter((l) => !VOWELS.has(l)));
  if (consonantsInWord.size === 0) return shuffle(uniq).slice(0, 2);

  function remainingHasConsonantToEarn(picks) {
    const rem = uniq.filter((l) => !picks.includes(l));
    if (rem.length === 0) return true;
    return rem.some((l) => consonantsInWord.has(l));
  }

  for (let attempt = 0; attempt < 48; attempt++) {
    const picks = shuffle(uniq).slice(0, 2);
    if (remainingHasConsonantToEarn(picks)) return picks;
  }
  for (let i = 0; i < uniq.length; i++) {
    for (let j = i + 1; j < uniq.length; j++) {
      const picks = [uniq[i], uniq[j]];
      if (remainingHasConsonantToEarn(picks)) return shuffle(picks);
    }
  }
  return uniq.slice(0, 2);
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
