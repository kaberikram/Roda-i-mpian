/** Tile size for one row so all letters fit within maxWidthPx (no horizontal crop). */
export function fitTileRow(charCount, maxWidthPx) {
  if (charCount <= 0) return { gap: 6, boxW: 40, boxH: 48, fontPx: 18 };
  let gap = 6;
  const minTile = 16;
  const maxTile = 46;
  const inner = Math.max(60, maxWidthPx - 8);
  for (let pass = 0; pass < 5; pass++) {
    const gaps = Math.max(0, charCount - 1);
    let boxW = Math.floor((inner - gaps * gap) / charCount);
    if (boxW >= minTile || gap <= 2) {
      boxW = Math.min(maxTile, Math.max(minTile, boxW));
      const boxH = Math.round(boxW * 1.15);
      const fontPx = Math.max(10, Math.min(22, Math.floor(boxW * 0.5)));
      return { gap, boxW, boxH, fontPx };
    }
    gap = Math.max(2, gap - 2);
  }
  const gapF = 2;
  const gaps = Math.max(0, charCount - 1);
  const boxW = Math.max(14, Math.min(maxTile, Math.floor((inner - gaps * gapF) / Math.max(1, charCount))));
  return { gap: gapF, boxW, boxH: Math.round(boxW * 1.15), fontPx: Math.max(10, Math.floor(boxW * 0.48)) };
}

/** Wheel spins = unique letters still to solve + 2 — excludes starter/prefill letters (same unique-letter semantics as tiles). Clamped for very short / long puzzles. */
export function maxSpinsForUniqueCount(uniqueLettersLeftToReveal) {
  return Math.min(28, Math.max(4, uniqueLettersLeftToReveal + 2));
}
