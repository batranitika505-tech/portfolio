'use client';

import { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, useTexture } from '@react-three/drei';
import Image from 'next/image';
import * as THREE from 'three';

const PROJECTS = [
  {
    title: 'ONLINE COURSE PLATFORM',
    description: 'A modern educational website showcasing a clean and responsive interface for discovering online courses.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    align: 'left',
    gitUrl: 'https://github.com/batranitika505-tech/online-course-platform',
    demoUrl: 'https://online-course-platform-psi.vercel.app/',
    image: '/first.webp',
    fallbackPng: '/first.png'
  },
  {
    title: 'Architectural Design — Renovation Firm',
    description: 'MCON BUILDRZ is a premium digital showcase for a high-end renovation-based firm. The application features a sophisticated architectural design language, specializing in custom builds and structural transformations that evoke inspiration and luxury.',
    tech: ['React', 'Tailwind', 'Framer Motion'],
    align: 'right',
    gitUrl: 'https://github.com/batranitika505-tech/mcon',
    demoUrl: 'https://mcon-5pvg.vercel.app/',
    image: '/second.webp',
    fallbackPng: '/second.png'
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

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  const isLeft = project.align === 'left';
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: "200px 0px 200px 0px" });

  return (
    <div 
      ref={cardRef}
      className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20 w-full min-h-[80vh] py-16`}
    >
      {/* 3D Mockup Container with Viewport Management */}
      <div className="w-full md:w-1/2 h-[350px] sm:h-[450px] md:h-[550px] relative rounded-3xl overflow-hidden bg-black/30 border border-white/10 backdrop-blur-sm shadow-2xl interactive-3d">
        {isInView ? (
          <Canvas 
            camera={{ position: [0, 0, 4] }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          >
            <ambientLight intensity={1} />
            <directionalLight position={[2, 5, 2]} intensity={2} color="#00f0ff" />
            <directionalLight position={[-2, -5, -2]} intensity={1} color="#b52aff" />
            <Suspense fallback={null}>
              <BrowserMockup
                imageUrl={project.image}
                onClick={() => window.open(project.demoUrl, '_blank', 'noopener,noreferrer')}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center p-8 opacity-60">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain p-6 rounded-2xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {project.title}
          </h3>
          <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2.5 mb-8">
            {project.tech.map((t) => (
              <span key={t} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-white/90">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform inline-flex items-center justify-center text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Live Demo
            </a>
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center text-sm"
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
    <section id="projects" ref={containerRef} className="relative w-full py-32 px-4 sm:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
          Featured Work
        </h2>
        <p className="text-white/50 text-sm sm:text-base mt-3">Curated engineering projects with live interactive demos</p>
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
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
