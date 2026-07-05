'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroObject from '@/components/canvas/HeroObject';


function ParticleScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">Scroll</span>
        <div className="relative w-[1px] h-16 bg-white/10 overflow-hidden">
          {/* Particle stream travelling down */}
          {[0, 0.33, 0.66].map((offset) => (
            <motion.div
              key={offset}
              className="absolute w-full"
              style={{
                height: '6px',
                background: 'linear-gradient(to bottom, transparent, #00f0ff, transparent)',
                top: '-6px',
              }}
              animate={{ top: ['−6px', '100%'] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'linear',
                delay: offset * 1.4
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Smooth mouse tracking for the 3D object
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(nx);
      rawY.set(ny);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [rawX, rawY]);

  useEffect(() => {
    const unsub1 = springX.on('change', (v) => setMouseX(v));
    const unsub2 = springY.on('change', (v) => setMouseY(v));
    return () => { unsub1(); unsub2(); };
  }, [springX, springY]);

  // Cinematic stagger sequence
  const sequence = {
    greeting:   { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1,   delay: 0.6, ease: 'easeOut' as const } },
    name:       { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, delay: 1.0, ease: 'easeOut' as const } },
    roles:      { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 1,  delay: 1.8, ease: 'easeOut' as const } },
    tagline:    { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.9, delay: 2.2, ease: 'easeOut' as const } },
    buttons:    { initial: { opacity: 0, y: 20 },  animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: 2.6, ease: 'easeOut' as const } },
    canvas:     { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.5, delay: 0.3, ease: 'easeOut' as const } },
  };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Left — Text Content */}
      <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ——— LEFT COLUMN ——— */}
          <div className="flex flex-col justify-center pointer-events-auto">

            {/* Greeting */}
            <motion.p
              {...sequence.greeting}
              className="text-base sm:text-lg font-mono text-white/40 tracking-[0.25em] uppercase mb-4"
            >
              Hello, World — I&apos;m
            </motion.p>

            {/* Name */}
            <motion.div {...sequence.name} className="mb-6 relative">
              <h1 className="name-sheen text-[13vw] sm:text-[10vw] md:text-[7.5vw] font-black leading-none tracking-tighter text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 40%, #ffffff 60%, #aaaaaa 100%)',
                  WebkitBackgroundClip: 'text',
                  textShadow: '0 0 80px rgba(0,240,255,0.15)',
                }}
              >
                NITIKA
              </h1>
              {/* Subtle glow pulse under name */}
              <motion.div
                className="absolute -bottom-4 left-0 w-3/4 h-[1px]"
                style={{ background: 'linear-gradient(to right, rgba(0,240,255,0.5), transparent)' }}
                animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Roles */}
            <motion.div {...sequence.roles} className="mb-4 space-y-1">
              {['Full Stack Developer', 'AI Enthusiast'].map((role, i) => (
                <div key={role} className="flex items-center gap-3">
                  <div className="w-6 h-[1px]" style={{ background: i === 0 ? '#00f0ff' : '#b52aff' }} />
                  <span
                    className="text-lg sm:text-xl font-light tracking-wide"
                    style={{ color: i === 0 ? 'rgba(0,240,255,0.9)' : 'rgba(181,42,255,0.9)' }}
                  >
                    {role}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p
              {...sequence.tagline}
              className="text-base text-white/50 font-light leading-relaxed max-w-sm mb-10"
            >
              Building beautiful digital experiences at the intersection of design and high-performance engineering.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...sequence.buttons} className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-7 py-3.5 rounded-full font-semibold text-sm overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(181,42,255,0.15))',
                  border: '1px solid rgba(0,240,255,0.3)',
                }}
              >
                <span className="relative z-10 text-white">Explore Projects</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.25), rgba(181,42,255,0.25))' }}
                />
              </button>
              <a
                href="/nitikanew.pdf"
                download="Nitika_Batra_Resume.pdf"
                className="group relative px-7 py-3.5 rounded-full font-semibold text-sm overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <span className="relative z-10 text-white/80 group-hover:text-white transition-colors duration-200">Download Resume</span>
              </a>
            </motion.div>

          </div>

          {/* ——— RIGHT COLUMN — 3D Canvas ——— */}
          <motion.div
            {...sequence.canvas}
            className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden pointer-events-auto"
          >
            {/* Glow frame */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none z-10"
              style={{ boxShadow: 'inset 0 0 60px rgba(0,240,255,0.05)' }}
            />
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.2} />
              <HeroObject mouseX={mouseX} mouseY={mouseY} />
            </Canvas>
            {/* Corner decorators */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6 pointer-events-none z-20`}>
                <div className="w-full h-[1px] bg-neon-cyan/30" />
                <div className="h-full w-[1px] bg-neon-cyan/30" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ParticleScrollIndicator />

      {/* Bottom gradient vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to top, rgba(2,2,5,0.8), transparent)' }}
      />
    </section>
  );
}
