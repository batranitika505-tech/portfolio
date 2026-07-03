'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';


export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Mouse tilt effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(-((y - centerY) / 20));
    setRotateY((x - centerX) / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const textLines = [
    "I am a passionate software engineer",
    "dedicated to crafting immersive web experiences.",
    "My focus is on the intersection of design",
    "and high-performance engineering."
  ];

  return (
    <section id="about" ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-10 perspective-1000">
      <motion.div
        style={{ y, opacity }}
        className="w-full max-w-6xl"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full rounded-3xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.1)] p-8 md:p-12 flex flex-col md:flex-row gap-10"
        >
          {/* Image Side */}
          <div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative rounded-2xl overflow-hidden bg-black/20 border border-white/5 shadow-inner">
            <img
              src="/profile.png"
              alt="Nitika"
              className="w-full h-full object-cover rounded-2xl filter brightness-90 contrast-105 hover:scale-105 transition-transform duration-700"
            />
            {/* Futuristic overlay lines */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-neon-cyan/20 rounded-2xl pointer-events-none" />
            {/* Glowing decorative scanner line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              About Me
            </h2>

            <div className="space-y-4 text-lg md:text-xl text-white/80 font-light">
              {textLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {line}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              <button className="px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors relative overflow-hidden group">
                <span className="relative z-10">Discover More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
