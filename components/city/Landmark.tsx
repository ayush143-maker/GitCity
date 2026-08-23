import { CityData } from '@/types';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Landmark({ city }: { city: CityData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const height = Math.min(40, Math.log2(city.stats.totalCommits + 1) * 3);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[3, 4, height, 8]} />
        <meshStandardMaterial
          color="#0a0e13"
          emissive="#00e5ff"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, height + 2, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}
