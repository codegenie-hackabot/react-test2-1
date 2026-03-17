import React, { useRef, useState } from 'react';

const segments = [
  { label: '1', color: '#FF5733' },
  { label: '2', color: '#33FF57' },
  { label: '3', color: '#3357FF' },
  { label: '4', color: '#F333FF' },
  { label: '5', color: '#FF33A6' },
  { label: '6', color: '#33FFF5' },
];

export default function Roulette() {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const drawWheel = (ctx, rotation = 0) => {
    const size = 300;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 10;
    const angleStep = (2 * Math.PI) / segments.length;
    ctx.clearRect(0, 0, size, size);
    segments.forEach((seg, i) => {
      const start = i * angleStep + rotation;
      const end = start + angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + angleStep / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(seg.label, radius - 10, 5);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
  };

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const totalSpins = Math.random() * 4 + 4;
    const targetIndex = Math.floor(Math.random() * segments.length);
    const targetAngle = (2 * Math.PI * totalSpins) + (segments.length - targetIndex) * ((2 * Math.PI) / segments.length) + Math.PI / 2;
    const start = performance.now();
    const duration = 3000;
    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const rotation = targetAngle * ease;
      drawWheel(ctx, rotation);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setResult(segments[targetIndex].label);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={300} height={300} style={{ border: '2px solid #333' }} />
      <br />
      <button onClick={spin} disabled={spinning} style={{ marginTop: '10px' }}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
      {result && <p>Result: {result}</p>}
    </div>
  );
}
