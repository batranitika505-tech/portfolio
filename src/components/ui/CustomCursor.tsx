'use client';

import { useEffect, useRef } from 'react';

// ─── Physics ─────────────────────────────────────────────────────────────────
const TRAIL_LENGTH    = 36;   // number of spring-lagged positions stored
const STIFFNESS       = 0.10; // spring stiffness (lower = more lag)
const DAMPING         = 0.72; // velocity damping (lower = more oscillation)
const MIN_MOVE        = 0.3;  // minimum pixel delta to add a new trail point

// ─── Helpers ─────────────────────────────────────────────────────────────────
interface Pt { x: number; y: number }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/** Catmull-Rom interpolation between four control points */
function catmullRom(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t, t3 = t2 * t;
  return {
    x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
  };
}

/** Expand a sparse point list into a dense smooth spline */
function buildSpline(pts: Pt[], stepsPerSegment = 6): Pt[] {
  if (pts.length < 2) return pts;
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[Math.min(i + 1, pts.length - 1)];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    for (let s = 0; s < stepsPerSegment; s++) {
      out.push(catmullRom(p0, p1, p2, p3, s / stepsPerSegment));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Segment colour: purple tail → electric blue mid → cyan tip */
function segmentColor(t: number): [number, number, number] {
  if (t < 0.5) {
    return [
      Math.round(lerp(181, 30, t * 2)),
      Math.round(lerp(42,  80, t * 2)),
      255,
    ];
  }
  return [
    Math.round(lerp(30,  0,   (t - 0.5) * 2)),
    Math.round(lerp(80,  230, (t - 0.5) * 2)),
    255,
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs that live in the rAF loop (no re-renders needed)
  const mouse   = useRef<Pt>({ x: -400, y: -400 });
  const spring  = useRef<Pt>({ x: -400, y: -400 });
  const vel     = useRef<Pt>({ x: 0, y: 0 });
  const trail   = useRef<Pt[]>([]);
  const hovered = useRef<'none' | 'button' | 'link'>('none');
  const raf     = useRef<number>(0);

  // ── Mouse / hover listeners ──────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hovered.current = t.closest('button') ? 'button'
                      : t.closest('a') || t.closest('.interactive-3d') ? 'link'
                      : 'none';
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  // ── Canvas render loop ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      // ── Spring physics ───────────────────────────────────────────────
      const sp = spring.current;
      const m  = mouse.current;
      const v  = vel.current;

      v.x += (m.x - sp.x) * STIFFNESS;
      v.y += (m.y - sp.y) * STIFFNESS;
      v.x *= DAMPING;
      v.y *= DAMPING;
      sp.x += v.x;
      sp.y += v.y;

      // Speed-based extra inertia: fast movement lags more
      const speed = Math.sqrt(v.x * v.x + v.y * v.y);

      // ── Update trail ring ─────────────────────────────────────────────
      const tr = trail.current;
      const last = tr[tr.length - 1];
      if (!last || Math.hypot(sp.x - last.x, sp.y - last.y) > MIN_MOVE) {
        tr.push({ x: sp.x, y: sp.y });
      }
      if (tr.length > TRAIL_LENGTH) tr.shift();

      // ── Draw ─────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (tr.length < 3) { raf.current = requestAnimationFrame(tick); return; }

      const spline = buildSpline(tr, 5);
      const n      = spline.length;

      const h = hovered.current;
      const brightMul = h === 'button' ? 1.5 : h === 'link' ? 1.25 : 1.0;
      const thinMul   = h === 'link'   ? 0.6 : 1.0;

      // ── Pass 1: wide outer halo ──────────────────────────────────────
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i < n; i++) {
        const t  = i / n;
        const [r, g, b] = segmentColor(t);
        const a  = t * 0.055 * brightMul;
        const lw = lerp(0, 22, t) * thinMul;
        ctx.beginPath();
        ctx.moveTo(spline[i-1].x, spline[i-1].y);
        ctx.lineTo(spline[i  ].x, spline[i  ].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        ctx.lineWidth   = lw;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
      }

      // ── Pass 2: medium glow ──────────────────────────────────────────
      for (let i = 1; i < n; i++) {
        const t  = i / n;
        const [r, g, b] = segmentColor(t);
        const a  = t * 0.22 * brightMul;
        const lw = lerp(0, 8, t) * thinMul;
        ctx.beginPath();
        ctx.moveTo(spline[i-1].x, spline[i-1].y);
        ctx.lineTo(spline[i  ].x, spline[i  ].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        ctx.lineWidth   = lw;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
      }

      // ── Pass 3: bright core ──────────────────────────────────────────
      for (let i = 1; i < n; i++) {
        const t  = i / n;
        // Tip brightens to near-white
        const [r, g, b] = t > 0.85
          ? [Math.round(lerp(0, 220, (t - 0.85) / 0.15)), 240, 255]
          : segmentColor(t);
        const a  = Math.min(t * 0.95 * brightMul, 1);
        const lw = lerp(0, 2.2, t) * thinMul;
        ctx.beginPath();
        ctx.moveTo(spline[i-1].x, spline[i-1].y);
        ctx.lineTo(spline[i  ].x, spline[i  ].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        ctx.lineWidth   = lw;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
      }

      // ── Cursor tip glow ──────────────────────────────────────────────
      const tip = spline[n - 1];
      const tipRadius = h === 'button' ? 12 : h === 'link' ? 6 : 9;
      const tipGlow = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, tipRadius);
      tipGlow.addColorStop(0,   `rgba(220, 245, 255, ${0.95 * brightMul})`);
      tipGlow.addColorStop(0.35,`rgba(0, 230, 255,   ${0.45 * brightMul})`);
      tipGlow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = tipGlow;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, tipRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
      raf.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 99999 }}
    />
  );
}
