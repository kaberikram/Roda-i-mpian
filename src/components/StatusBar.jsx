const STATUS_STYLES = {
  correct: { bg: '#EAF3DE', color: '#27500A', icon: '✅' },
  miss:    { bg: '#FCEBEB', color: '#791F1F', icon: '❌' },
  bust:    { bg: '#FCEBEB', color: '#791F1F', icon: '💥' },
  spin:    { bg: '#E6F1FB', color: '#185FA5', icon: '🎯' },
  info:    { bg: '#EEEDFE', color: '#3C3489', icon: 'ℹ️' },
};

export default function StatusBar({ msg, type }) {
  if (!msg) return <div style={{ height: 44 }} />;
  const s = STATUS_STYLES[type] || STATUS_STYLES.info;
  return (
    <div
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: 12,
        padding: '10px 16px',
        fontWeight: 700,
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        animation: 'slideUp 0.25s ease',
        minHeight: 44,
      }}
    >
      <span style={{ fontSize: 18 }}>{s.icon}</span>
      <span style={{ flex: 1 }}>{msg}</span>
    </div>
  );
}
