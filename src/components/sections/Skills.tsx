'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = [
  { name: 'React', key: '1', shortcut: '1', exp: '3 Years', desc: 'The core of my frontend development.' },
  { name: 'Next.js', key: '2', shortcut: '2', exp: '2 Years', desc: 'Used for full-stack React applications.' },
  { name: 'TypeScript', key: '3', shortcut: '3', exp: '3 Years', desc: 'Essential for type-safe codebases.' },
  { name: 'Three.js', key: '4', shortcut: '4', exp: '1 Year', desc: 'Creating immersive 3D web experiences.' },
  { name: 'Tailwind', key: '5', shortcut: '5', exp: '3 Years', desc: 'Rapid UI styling and design systems.' },
  { name: 'Node.js', key: '6', shortcut: '6', exp: '2 Years', desc: 'Backend services and APIs.' },
  { name: 'Python', key: '7', shortcut: '7', exp: '2 Years', desc: 'Data scripts and AI integrations.' },
  { name: 'AWS', key: '8', shortcut: '8', exp: '1 Year', desc: 'Cloud infrastructure and deployments.' },
];

function KeyCap({ 
  position, 
  skill, 
  isActive,
  onHover,
  onClick,
}: { 
  position: [number, number, number];
  skill: typeof SKILLS[0];
  isActive: boolean;
  onHover: (skill: typeof SKILLS[0] | null) => void;
  onClick: (skill: typeof SKILLS[0]) => void;
}) {
  const [hovered, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const isDown = pressed || isActive;
  const targetY = isDown ? position[1] - 0.25 : hovered ? position[1] + 0.15 : position[1];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 12);
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <RoundedBox
        ref={meshRef}
        args={[1.8, 0.8, 1.8]}
        radius={0.1}
        smoothness={4}
        position={[0, position[1], 0]}
        onPointerOver={() => { setHover(true); onHover(skill); }}
        onPointerOut={() => { setHover(false); setPressed(false); onHover(null); }}
        onPointerDown={() => { setPressed(true); onClick(skill); }}
        onPointerUp={() => setPressed(false)}
      >
        <meshStandardMaterial 
          color={isDown ? "#222" : hovered ? "#333" : "#111"} 
          roughness={0.2}
          metalness={0.8}
          emissive={isDown || hovered ? "#00f0ff" : "#000"}
          emissiveIntensity={isDown ? 0.8 : hovered ? 0.5 : 0}
        />
        <Text
          position={[0, 0.41, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.26}
          color={isDown || hovered ? "#00f0ff" : "#fff"}
          anchorX="center"
          anchorY="middle"
        >
          {`[${skill.shortcut}] ${skill.name}`}
        </Text>
      </RoundedBox>
    </group>
  );
}

function Keyboard({ 
  selectedSkill,
  onKeyHover,
  onKeySelect,
}: { 
  selectedSkill: typeof SKILLS[0] | null;
  onKeyHover: (skill: typeof SKILLS[0] | null) => void;
  onKeySelect: (skill: typeof SKILLS[0]) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Ambient floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 0.5;
      groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // Arrange keys in a 4x2 grid
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {SKILLS.map((skill, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const x = (col - 1.5) * 2;
        const z = (row - 0.5) * 2;
        const isActive = selectedSkill?.name === skill.name;
        return (
          <KeyCap 
            key={skill.name} 
            position={[x, 0, z]} 
            skill={skill} 
            isActive={isActive}
            onHover={onKeyHover} 
            onClick={onKeySelect}
          />
        );
      })}
    </group>
  );
}

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<typeof SKILLS[0] | null>(null);

  // Physical keyboard typing interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
        return;
      }
      const pressedChar = e.key.toLowerCase();
      const match = SKILLS.find(
        (s) => s.shortcut === pressedChar || s.name.toLowerCase().startsWith(pressedChar)
      );
      if (match) {
        setSelectedSkill(match);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="skills" className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 overflow-hidden">
      {/* 3D Keyboard Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 5, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#00f0ff" />
          <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#b52aff" />
          <Keyboard 
            selectedSkill={selectedSkill}
            onKeyHover={setSelectedSkill} 
            onKeySelect={setSelectedSkill}
          />
        </Canvas>
      </div>

      {/* Title */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center px-4 w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 text-center">
          Tech Stack
        </h2>
        <p className="text-white/50 text-sm sm:text-base text-center mt-2">
          Press keys <span className="font-mono text-neon-cyan">[1-8]</span> or click keycaps to inspect
        </p>
      </div>

      {/* Floating Info Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 50, rotateY: 90 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute right-4 sm:right-10 top-1/4 sm:top-1/3 z-20 w-72 sm:w-80 backdrop-blur-xl bg-black/60 border border-white/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.25)] pointer-events-none"
            style={{ perspective: 1000 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-neon-cyan">{selectedSkill.name}</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">Key: {selectedSkill.shortcut}</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-neon-cyan to-transparent mb-4" />
            <p className="text-white/80 mb-2 text-sm sm:text-base"><span className="font-semibold text-neon-purple">Experience:</span> {selectedSkill.exp}</p>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">{selectedSkill.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Accessible Quick Badges */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl px-4 flex flex-wrap justify-center gap-2 pointer-events-auto">
        {SKILLS.map((skill) => {
          const isSelected = selectedSkill?.name === skill.name;
          return (
            <button
              key={skill.name}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 border ${
                isSelected 
                  ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-black/50 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
              }`}
            >
              <span className="text-neon-cyan mr-1">[{skill.shortcut}]</span> {skill.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
