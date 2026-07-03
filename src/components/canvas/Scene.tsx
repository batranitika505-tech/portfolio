'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Preload } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import Galaxy from './Galaxy';

import { useMemo, useEffect, useState } from 'react';

function SpaceEnvironment() {
  const starsRef = useRef<THREE.Group>(null);
  const dirLight1Ref = useRef<THREE.DirectionalLight>(null);
  const dirLight2Ref = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollRatio(window.scrollY / maxScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
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

    const r = scrollRatio;

    // Transition background clear color
    const bgCol = new THREE.Color();
    if (r < 0.5) {
      bgCol.lerpColors(colors.spaceBlack, colors.nebulaPurple, r * 2);
    } else {
      bgCol.lerpColors(colors.nebulaPurple, colors.nebulaPink, (r - 0.5) * 2);
    }
    state.gl.setClearColor(bgCol);

    // Transition Directional Light 1 color (cyan -> purple -> pink)
    if (dirLight1Ref.current) {
      const c = new THREE.Color();
      if (r < 0.5) {
        c.lerpColors(colors.cyan, colors.purple, r * 2);
      } else {
        c.lerpColors(colors.purple, colors.pink, (r - 0.5) * 2);
      }
      dirLight1Ref.current.color.copy(c);
    }

    // Transition Directional Light 2 color (purple -> cyan -> deep purple)
    if (dirLight2Ref.current) {
      const c = new THREE.Color();
      if (r < 0.5) {
        c.lerpColors(colors.purple, colors.cyan, r * 2);
      } else {
        c.lerpColors(colors.cyan, colors.deepPurple, (r - 0.5) * 2);
      }
      dirLight2Ref.current.color.copy(c);
    }

    // Transition Ambient Light color (deep space blue -> nebula purple -> deep pink)
    if (ambientLightRef.current) {
      const c = new THREE.Color();
      if (r < 0.5) {
        c.lerpColors(colors.deepBlue, colors.deepPurple, r * 2);
      } else {
        c.lerpColors(colors.deepPurple, colors.deepPink, (r - 0.5) * 2);
      }
      ambientLightRef.current.color.copy(c);
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
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <SpaceEnvironment />
        <Preload all />
      </Canvas>
    </div>
  );
}
