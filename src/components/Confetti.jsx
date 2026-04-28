export default function Confetti({ active, count = 18 }) {
  if (!active) return null;
  const nConf = Math.max(8, Math.min(28, Math.floor(count)));
  const pieces = Array.from({ length: nConf }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 1.5 + Math.random() * 1,
    color: ['#185FA5', '#58CC02', '#FF6B6B', '#F59E0B', '#8B5CF6', '#06B6D4'][i % 6],
    size: 6 + Math.random() * 8,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animation: `confetti-fall ${p.dur}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
