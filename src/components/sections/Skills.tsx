'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = [
  { name: 'React', exp: '3 Years', desc: 'The core of my frontend development.' },
  { name: 'Next.js', exp: '2 Years', desc: 'Used for full-stack React applications.' },
  { name: 'TypeScript', exp: '3 Years', desc: 'Essential for type-safe codebases.' },
  { name: 'Three.js', exp: '1 Year', desc: 'Creating immersive 3D web experiences.' },
  { name: 'Tailwind', exp: '3 Years', desc: 'Rapid UI styling and design systems.' },
  { name: 'Node.js', exp: '2 Years', desc: 'Backend services and APIs.' },
  { name: 'Python', exp: '2 Years', desc: 'Data scripts and AI integrations.' },
  { name: 'AWS', exp: '1 Year', desc: 'Cloud infrastructure and deployments.' },
];

function KeyCap({ 
  position, 
  skill, 
  onHover 
}: { 
  position: [number, number, number], 
  skill: typeof SKILLS[0],
  onHover: (skill: typeof SKILLS[0] | null) => void 
}) {
  const [hovered, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const targetY = pressed ? position[1] - 0.2 : hovered ? position[1] + 0.2 : position[1];

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 10);
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
        onPointerDown={() => { setPressed(true); }}
        onPointerUp={() => setPressed(false)}
      >
        <meshStandardMaterial 
          color={hovered ? "#333" : "#111"} 
          roughness={0.2}
          metalness={0.8}
          emissive={hovered ? "#00f0ff" : "#000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        <Text
          position={[0, 0.41, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color={hovered ? "#00f0ff" : "#fff"}
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </RoundedBox>
    </group>
  );
}

function Keyboard({ onKeyHover }: { onKeyHover: (skill: typeof SKILLS[0] | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
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
        return <KeyCap key={skill.name} position={[x, 0, z]} skill={skill} onHover={onKeyHover} />;
      })}
    </group>
  );
}

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<typeof SKILLS[0] | null>(null);

  return (
    <section id="skills" className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#00f0ff" />
          <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#b52aff" />
          <Keyboard onKeyHover={setSelectedSkill} />
        </Canvas>
      </div>

      {/* Floating Info Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 50, rotateY: 90 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute right-10 top-1/3 z-10 w-80 backdrop-blur-xl bg-black/40 border border-white/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.2)] pointer-events-none"
            style={{ perspective: 1000 }}
          >
            <h3 className="text-3xl font-bold text-neon-cyan mb-2">{selectedSkill.name}</h3>
            <div className="w-full h-px bg-gradient-to-r from-neon-cyan to-transparent mb-4" />
            <p className="text-white/80 mb-2"><span className="font-semibold text-neon-purple">Experience:</span> {selectedSkill.exp}</p>
            <p className="text-white/60 text-sm leading-relaxed">{selectedSkill.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Title */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 text-center">
          Tech Stack
        </h2>
        <p className="text-white/50 text-center mt-2">Type on the keyboard to explore</p>
      </div>
    </section>
  );
}
