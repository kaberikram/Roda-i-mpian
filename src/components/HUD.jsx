import { fmt } from '../utils/format.js';

export default function HUD({ round, totalEarnings, spinsUsed, maxSpins }) {
  const pips = [0, 1, 2].map((i) => {
    const col = i < round ? '#58CC02' : i === round ? '#185FA5' : '#CBD5E1';
    return (
      <div
        key={i}
        style={{ width: 10, height: 10, borderRadius: '50%', background: col, transition: 'background 0.3s, opacity 0.3s' }}
      />
    );
  });
  const leftSpins = Math.max(0, maxSpins - spinsUsed);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '14px 20px 10px',
        gap: 8,
      }}
    >
      <div style={{ justifySelf: 'start', minWidth: 0 }}>
        <div
          style={{
            background: '#FDF4E8',
            borderRadius: 20,
            padding: '5px 12px',
            fontWeight: 800,
            fontSize: 13,
            color: leftSpins <= 2 ? '#B45309' : '#9A3412',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <img src="fortune-wheel.svg" alt="" width={18} height={18} style={{ display: 'block', flexShrink: 0 }} aria-hidden />
          <span>
            {leftSpins}/{maxSpins}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center', justifySelf: 'center' }}>{pips}</div>
      <div style={{ justifySelf: 'end', minWidth: 0 }}>
        <div style={{ background: '#EAF3DE', borderRadius: 20, padding: '5px 12px', fontWeight: 800, fontSize: 12, color: '#27500A' }}>
          <span style={{ opacity: 0.75, fontWeight: 700 }}>Total </span>
          <span>{fmt(totalEarnings)}</span>
        </div>
      </div>
    </div>
  );
}
