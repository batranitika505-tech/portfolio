'use client';

import { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  {
    title: 'ONLINE COURSE PLATFORM',
    description: 'A modern educational website showcasing a clean and responsive interface for discovering online courses.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    align: 'left',
    gitUrl: 'https://github.com/batranitika505-tech/online-course-platform',
    demoUrl: 'https://online-course-platform-psi.vercel.app/',
    image: '/first.png'
  },
  {
    title: 'Architectural Design - Rennovation-Based Firm',
    description: 'MCON BUILDRZ is a premium digital showcase for a high-end renovation-based firm. The application features a sophisticated architectural design language, specializing in custom builds and structural transformations that evoke inspiration and luxury.',
    tech: ['React', 'Tailwind', 'Framer Motion', 'GSAP'],
    align: 'right',
    gitUrl: 'https://github.com/batranitika505-tech/mcon',
    demoUrl: 'https://mcon-5pvg.vercel.app/',
    image: '/second.png'
  },
];

function BrowserMockup({ imageUrl, onClick }: { imageUrl: string; onClick?: () => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useTexture(imageUrl);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle mouse interaction
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;

      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} onClick={onClick}>
        {/* Browser Frame */}
        <RoundedBox args={[3.2, 2.2, 0.1]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Screen/Content Area */}
        <RoundedBox args={[3.1, 1.9, 0.11]} position={[0, -0.05, 0]} radius={0.05}>
          <meshBasicMaterial map={texture} />
        </RoundedBox>
        {/* Top Bar Dots */}
        <mesh position={[-1.4, 0.95, 0.06]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#ff5f56" />
        </mesh>
        <mesh position={[-1.3, 0.95, 0.06]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#ffbd2e" />
        </mesh>
        <mesh position={[-1.2, 0.95, 0.06]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#27c93f" />
        </mesh>
      </group>
    </Float>
  );
}

function ProjectCard({ project, index }: { project: typeof PROJECTS[0], index: number }) {
  const isLeft = project.align === 'left';

  return (
    <div className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20 w-full min-h-[80vh] py-20`}>
      {/* 3D Mockup Container */}
      <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative rounded-3xl overflow-hidden bg-black/20 border border-white/5 backdrop-blur-sm shadow-2xl interactive-3d cursor-none">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 5, 2]} intensity={2} color="#00f0ff" />
          <directionalLight position={[-2, -5, -2]} intensity={1} color="#b52aff" />
          <Suspense fallback={null}>
            <BrowserMockup 
              imageUrl={project.image} 
              onClick={() => window.open(project.demoUrl, '_blank')}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {project.title}
          </h3>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {project.tech.map(t => (
              <span key={t} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/90">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform inline-flex items-center justify-center cursor-none"
            >
              Live Demo
            </a>
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center cursor-none"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="work" ref={containerRef} className="relative w-full py-32 px-4 sm:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-32">
        <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
          Featured Work
        </h2>
      </div>

      <div className="relative">
        {/* Animated Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block">
          <motion.div
            className="w-full bg-gradient-to-b from-neon-blue via-neon-purple to-neon-cyan"
            style={{ height: lineHeight, filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.5))' }}
          />
        </div>

        <div className="flex flex-col gap-20">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
