export default function WheelSpinButton({
  spinning,
  disabled,
  onSpin,
  spinButtonRef,
  extraButtonClass = '',
  ariaDescribedBy,
}) {
  const cls = ['btn', 'btn-spin', extraButtonClass].filter(Boolean).join(' ');
  return (
    <button
      ref={spinButtonRef}
      className={cls}
      type="button"
      aria-describedby={ariaDescribedBy || undefined}
      onClick={onSpin}
      disabled={spinning || disabled}
      style={{ fontSize: 12, padding: '10px 28px', borderRadius: 50, letterSpacing: '0.5px' }}
    >
      {spinning ? 'Spinning…' : 'SPIN'}
    </button>
  );
}
