'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroObjectProps {
  mouseX: number;
  mouseY: number;
}

function OrbitalRing({ radius, tiltX, tiltZ, speed, color }: {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function GlowCore({ mouseX, mouseY }: HeroObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetRotX = -mouseY * 0.4;
      const targetRotY = mouseX * 0.4;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3);
      groupRef.current.rotation.z += delta * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.3;
      innerRef.current.rotation.y += delta * 0.5;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.2;
      outerRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer glowing icosahedron wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.15}
          emissive="#00f0ff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Inner solid core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#050520"
          emissive="#4400ff"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Inner wireframe overlay */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.91, 1]} />
        <meshStandardMaterial
          color="#b52aff"
          wireframe
          transparent
          opacity={0.5}
          emissive="#b52aff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Orbital rings */}
      <OrbitalRing radius={2.2} tiltX={Math.PI / 5} tiltZ={0} speed={0.4} color="#00f0ff" />
      <OrbitalRing radius={2.5} tiltX={-Math.PI / 4} tiltZ={Math.PI / 6} speed={-0.25} color="#b52aff" />
      <OrbitalRing radius={2.8} tiltX={Math.PI / 2.5} tiltZ={-Math.PI / 5} speed={0.18} color="#ffffff" />

      {/* Point lights for atmospheric glow */}
      <pointLight color="#00f0ff" intensity={3} distance={6} decay={2} />
      <pointLight color="#b52aff" intensity={2} distance={5} decay={2} position={[2, 1, 1]} />
    </group>
  );
}

export default function HeroObject({ mouseX, mouseY }: HeroObjectProps) {
  return <GlowCore mouseX={mouseX} mouseY={mouseY} />;
}
