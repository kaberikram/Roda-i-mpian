import { useEffect, useRef } from 'react';
import SEGMENTS from '../../data/wheelSegments.json';
import FinSpinAudio from '../../audio/finSpinAudio.js';
import { HAPTIC, haptic } from '../../utils/haptics.js';

export default function WheelArc({ onResult, wheelSize = 384, spinRef, onSpinChange }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const rotRef = useRef(0);
  const spinningRef = useRef(false);

  // Clamp by both viewport height (so it fits above HUD) and width (so it isn't cropped on the sides)
  const maxSzByHeight = Math.floor((window.innerHeight * 0.55 - 70) / 0.58);
  const maxSzByWidth = window.innerWidth - 24;
  const maxSz = Math.min(maxSzByHeight, maxSzByWidth);
  const sz = Math.min(wheelSize, Math.max(140, maxSz));
  const visibleH = sz * 0.62;

  function drawWheel(rotation) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R = cx - 16;
    const n = SEGMENTS.length;
    const arc = (2 * Math.PI) / n;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();
    SEGMENTS.forEach((seg, i) => {
      const start = rotation + i * arc - Math.PI / 2;
      const end = start + arc;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      const grad = ctx.createRadialGradient(cx, cy, R * 0.25, cx, cy, R);
      grad.addColorStop(0, 'rgba(255,255,255,0.22)');
      grad.addColorStop(1, 'rgba(0,0,0,0.1)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.text;
      const fs = sz > 260 ? (seg.label === 'BUST' ? 13 : 15) : seg.label === 'BUST' ? 10 : 12;
      ctx.font = `900 ${fs}px Nunito`;
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 4;
      const labelInset = sz > 260 ? 48 : 36;
      ctx.fillText(seg.label, R - labelInset, 5);
      ctx.restore();
    });
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.fill();
    ctx.strokeStyle = '#E0E7EF';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#185FA5';
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(cx, cy - R - 2);
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(-13, -5);
    ctx.lineTo(13, -5);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  useEffect(() => {
    drawWheel(rotRef.current);
    if (spinRef) spinRef.current = doSpin;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sz]);

  function doSpin() {
    if (spinningRef.current) return;
    spinningRef.current = true;
    onSpinChange && onSpinChange(true);

    // Fire haptic synchronously inside the user gesture — iOS drops the
    // gesture context after the first await, killing the input-switch fallback.
    haptic(HAPTIC.PRIMARY);

    async function run() {
      await FinSpinAudio.resume();
      FinSpinAudio.playSpinStart();
      haptic(HAPTIC.PRIMARY);
      const nSeg = SEGMENTS.length;
      const segArc = (2 * Math.PI) / nSeg;
      const twoPi = 2 * Math.PI;
      function normAngle(a) {
        return ((a % twoPi) + twoPi) % twoPi;
      }
      const targetSeg = Math.floor(Math.random() * SEGMENTS.length);
      /** Resting rotation (mod 2π) so segment `targetSeg` sits under the top pointer — same as first-spin formula from 0. */
      const targetRot = normAngle(twoPi - (targetSeg * segArc + segArc / 2));
      const startAngle = normAngle(rotRef.current);
      const extra = twoPi * (6 + Math.floor(Math.random() * 6));
      /** Full spins + shortest forward delta from current orientation to target (not from 0 — fixes drift after spin 2+). */
      const delta = normAngle(targetRot - startAngle);
      const finalAngle = extra + delta;
      /** Cumulative rotation this spin — ticks fire on each segArc boundary crossed (matches easing slowdown). */
      let lastBoundaryCount = 0;
      const duration = 3800;
      const startTime = performance.now();
      function animate(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        const current = startAngle + finalAngle * ease;
        rotRef.current = normAngle(current);
        drawWheel(current);
        if (t < 1) {
          const deltaTheta = current - startAngle;
          const boundaryCount = Math.floor(deltaTheta / segArc);
          let crossed = boundaryCount - lastBoundaryCount;
          if (crossed > 0) {
            lastBoundaryCount = boundaryCount;
            // Tab backgrounding can skip many frames; cap so we don't stack dozens of clicks at once
            const cap = 40;
            for (let i = 0; i < Math.min(crossed, cap); i++) FinSpinAudio.playTick();
            // One haptic pulse per peg-cross — rAF spacing follows the easing,
            // so the slowdown gets felt as well as heard.
            haptic(HAPTIC.WHEEL_TICK);
          }
          animRef.current = requestAnimationFrame(animate);
        } else {
          drawWheel(rotRef.current);
          spinningRef.current = false;
          onSpinChange && onSpinChange(false);
          onResult(SEGMENTS[targetSeg]);
        }
      }
      animRef.current = requestAnimationFrame(animate);
    }
    void run();
  }

  useEffect(() => {
    if (spinRef) spinRef.current = doSpin;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: visibleH, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={sz}
        height={sz}
        style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: sz, height: sz, maxWidth: 'none' }}
      />
    </div>
  );
}
