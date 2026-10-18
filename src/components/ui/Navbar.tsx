'use client';

import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Terminal } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Education', id: 'education' },
  { label: 'GitHub', id: 'github' },
  { label: 'Contact', id: 'contact' },
];

function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
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
      className="relative px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors group whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-neon-cyan/50"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Don't auto-hide navbar while mobile menu is open
    if (!mobileMenuOpen) {
      setHidden(latest > prev && latest > 150);
    }
    setScrolled(latest > 50);
  });

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: '-100%', opacity: 0 } }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] max-w-[95vw] pointer-events-none"
      >
        {/* Desktop Navbar (hidden below md: 768px) */}
        <motion.div
          animate={{
            scale: scrolled ? 0.95 : 1,
            paddingLeft: scrolled ? '14px' : '8px',
            paddingRight: scrolled ? '14px' : '8px',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="hidden md:flex relative items-center gap-1 py-2 rounded-full pointer-events-auto"
          style={{
            backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
            background: scrolled ? 'rgba(5,5,20,0.85)' : 'rgba(5,5,20,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.08)' : 'none',
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
            <div
              className="absolute bottom-0 left-4 right-4 h-[1px] opacity-30 pointer-events-none"
              style={{ background: 'linear-gradient(to right, transparent, #00f0ff, #b52aff, transparent)' }}
            />
          )}

          <MagneticButton onClick={() => handleScrollTo('home')}>Home</MagneticButton>
          {NAV_ITEMS.map((item) => (
            <MagneticButton key={item.id} onClick={() => handleScrollTo(item.id)}>
              {item.label}
            </MagneticButton>
          ))}
        </motion.div>

        {/* Mobile Header Capsule (visible below md: 768px) */}
        <div
          className="flex md:hidden items-center justify-between gap-3 px-4 py-2 rounded-full pointer-events-auto shadow-2xl"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(5,5,20,0.88)',
            border: '1px solid rgba(0,240,255,0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 15px rgba(0,240,255,0.08)',
          }}
        >
          {/* Brand mark */}
          <button
            onClick={() => handleScrollTo('home')}
            className="flex items-center gap-2 text-white font-bold tracking-tight text-sm focus:outline-none"
            aria-label="Scroll to home"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="tracking-widest font-mono text-xs text-white/90">NITIKA</span>
          </button>

          <div className="flex items-center gap-1">
            {/* Quick Terminal trigger button */}
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: '~' });
                window.dispatchEvent(event);
              }}
              className="p-2 rounded-full text-white/70 hover:text-neon-cyan focus:outline-none transition-colors"
              aria-label="Open space terminal"
              title="Open Terminal (~)"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Hamburger / Close toggle with min 44x44 touch target */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-full text-white hover:text-neon-cyan focus:outline-none transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-neon-cyan" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] md:hidden"
            />

            {/* Slide-down Glass Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-18 left-4 right-4 z-[98] md:hidden p-5 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                background: 'rgba(8,8,25,0.94)',
                border: '1px solid rgba(0,240,255,0.2)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,240,255,0.05)',
              }}
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleScrollTo('home')}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-left text-base font-medium text-white/90 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[48px]"
                >
                  <span>Home</span>
                  <span className="text-xs font-mono text-neon-cyan">01</span>
                </button>

                {NAV_ITEMS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleScrollTo(item.id)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-left text-base font-medium text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[48px]"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs font-mono text-white/40">0{idx + 2}</span>
                  </button>
                ))}

                <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href="/resume.pdf"
                    download="Nitika_Batra_Resume.pdf"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 border border-white/10 hover:bg-white/15 min-h-[44px]"
                  >
                    Resume <ArrowUpRight className="w-3.5 h-3.5 text-neon-cyan" />
                  </a>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      const event = new KeyboardEvent('keydown', { key: '~' });
                      window.dispatchEvent(event);
                    }}
                    className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-semibold text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 hover:bg-neon-cyan/20 min-h-[44px]"
                  >
                    <Terminal className="w-3.5 h-3.5" /> Terminal
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
