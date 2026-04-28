export default function WheelSpinButton({ spinning, disabled, onSpin, spinButtonRef }) {
  return (
    <button
      ref={spinButtonRef}
      className="btn btn-spin"
      onClick={onSpin}
      disabled={spinning || disabled}
      style={{ fontSize: 12, padding: '10px 28px', borderRadius: 50, letterSpacing: '0.5px' }}
    >
      {spinning ? 'Spinning…' : 'SPIN'}
    </button>
  );
}
