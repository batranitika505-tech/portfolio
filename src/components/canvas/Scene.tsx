'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Preload } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import Galaxy from './Galaxy';

import { useMemo, useEffect } from 'react';

function SpaceEnvironment() {
  const starsRef = useRef<THREE.Group>(null);
  const dirLight1Ref = useRef<THREE.DirectionalLight>(null);
  const dirLight2Ref = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  const scrollRatioRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollRatioRef.current = window.scrollY / maxScroll;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const colors = useMemo(() => ({
    cyan: new THREE.Color('#00f0ff'),
    purple: new THREE.Color('#b52aff'),
    pink: new THREE.Color('#ff00aa'),
    deepBlue: new THREE.Color('#002244'),
    deepPurple: new THREE.Color('#220044'),
    deepPink: new THREE.Color('#440033'),
    spaceBlack: new THREE.Color('#020205'),
    nebulaPurple: new THREE.Color('#080214'),
    nebulaPink: new THREE.Color('#14021a')
  }), []);

  const scratchColors = useMemo(() => ({
    bg: new THREE.Color(),
    light1: new THREE.Color(),
    light2: new THREE.Color(),
    ambient: new THREE.Color(),
  }), []);

  useFrame((state, delta) => {
    if (starsRef.current) {
      // Slow rotation for parallax effect
      starsRef.current.rotation.x -= delta * 0.02;
      starsRef.current.rotation.y -= delta * 0.03;
      
      // Slight camera movement based on mouse
      state.camera.position.x += (state.pointer.x * 2 - state.camera.position.x) * 0.05;
      state.camera.position.y += (state.pointer.y * 2 - state.camera.position.y) * 0.05;
      state.camera.lookAt(0, 0, 0);
    }

    const r = scrollRatioRef.current;

    // Transition background clear color
    if (r < 0.5) {
      scratchColors.bg.lerpColors(colors.spaceBlack, colors.nebulaPurple, r * 2);
    } else {
      scratchColors.bg.lerpColors(colors.nebulaPurple, colors.nebulaPink, (r - 0.5) * 2);
    }
    state.gl.setClearColor(scratchColors.bg);

    // Transition Directional Light 1 color (cyan -> purple -> pink)
    if (dirLight1Ref.current) {
      if (r < 0.5) {
        scratchColors.light1.lerpColors(colors.cyan, colors.purple, r * 2);
      } else {
        scratchColors.light1.lerpColors(colors.purple, colors.pink, (r - 0.5) * 2);
      }
      dirLight1Ref.current.color.copy(scratchColors.light1);
    }

    // Transition Directional Light 2 color (purple -> cyan -> deep purple)
    if (dirLight2Ref.current) {
      if (r < 0.5) {
        scratchColors.light2.lerpColors(colors.purple, colors.cyan, r * 2);
      } else {
        scratchColors.light2.lerpColors(colors.cyan, colors.deepPurple, (r - 0.5) * 2);
      }
      dirLight2Ref.current.color.copy(scratchColors.light2);
    }

    // Transition Ambient Light color (deep space blue -> nebula purple -> deep pink)
    if (ambientLightRef.current) {
      if (r < 0.5) {
        scratchColors.ambient.lerpColors(colors.deepBlue, colors.deepPurple, r * 2);
      } else {
        scratchColors.ambient.lerpColors(colors.deepPurple, colors.deepPink, (r - 0.5) * 2);
      }
      ambientLightRef.current.color.copy(scratchColors.ambient);
    }
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={50} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      <Galaxy />
      <ambientLight ref={ambientLightRef} intensity={0.5} />
      <directionalLight ref={dirLight1Ref} position={[10, 10, 10]} intensity={1} />
      <directionalLight ref={dirLight2Ref} position={[-10, -10, -10]} intensity={0.5} />
    </group>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <SpaceEnvironment />
        <Preload all />
      </Canvas>
    </div>
  );
}
