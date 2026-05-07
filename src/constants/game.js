export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const CONSONANTS = ALPHABET.filter((l) => !VOWELS.has(l));

/** Full-phrase Solve stays locked until this many wheel spins this round (keeps spin-first play). */
export const MIN_SPINS_BEFORE_SOLVE = 2;
export const MAX_ROUNDS = 3;
export const SPEED_BONUS_BASE = 1500;
export const SPEED_BONUS_DECAY = 30;

export const STORAGE_KEYS = {
  highScore: 'fs3_hs',
  bestTime: 'fs3_ht',
};
