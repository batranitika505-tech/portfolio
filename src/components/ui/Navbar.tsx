'use client';

import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const LINKS = ['About', 'Skills', 'Work', 'Contact'];

function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.3);
    y.set((clientY - (top + height / 2)) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className="relative px-5 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-colors group"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-full scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"
        style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.15)' }}
      />
    </motion.button>
  );
}

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [shinePos, setShinePos] = useState(-100);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 150);
    setScrolled(latest > 50);
  });

  // Animate shine across the pill border every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShinePos(-100);
      setTimeout(() => setShinePos(100), 50);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: '-100%', opacity: 0 } }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
    >
      <motion.div
        animate={{
          scale: scrolled ? 0.95 : 1,
          paddingLeft: scrolled ? '16px' : '8px',
          paddingRight: scrolled ? '16px' : '8px',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="relative flex items-center gap-1 py-2 rounded-full pointer-events-auto overflow-hidden"
        style={{
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          background: scrolled ? 'rgba(5,5,20,0.6)' : 'transparent',
          border: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.05)' : 'none',
        }}
      >
        {/* Moving shine reflection on the border */}
        {scrolled && (
          <motion.div
            className="absolute top-0 bottom-0 w-16 pointer-events-none"
            animate={{ left: ['-20%', '120%'] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)',
              borderRadius: '9999px',
              transform: 'skewX(-15deg)',
            }}
          />
        )}

        {/* Neon active line along the bottom */}
        {scrolled && (
          <div className="absolute bottom-0 left-4 right-4 h-[1px] opacity-30"
            style={{ background: 'linear-gradient(to right, transparent, #00f0ff, #b52aff, transparent)' }}
          />
        )}

        <MagneticButton onClick={() => handleScrollTo('home')}>Home</MagneticButton>
        {LINKS.map(link => (
          <MagneticButton key={link} onClick={() => handleScrollTo(link)}>
            {link}
          </MagneticButton>
        ))}
      </motion.div>
    </motion.nav>
  );
}
