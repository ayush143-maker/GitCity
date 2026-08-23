import { RepositoryBuilding } from '@/types';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingProps {
  building: RepositoryBuilding;
  isSelected: boolean;
  isHovered: boolean;
  blockSpacing: number;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

export function Building({
  building,
  isSelected,
  isHovered,
  blockSpacing,
  onSelect,
  onHover,
}: BuildingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [animatedHeight, setAnimatedHeight] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      const target = building.height;
      const current = animatedHeight;
      const newHeight = THREE.MathUtils.lerp(current, target, 0.05);
      setAnimatedHeight(newHeight);
      meshRef.current.scale.y = newHeight;
      meshRef.current.position.y = newHeight / 2;
    }
  });

  const x = building.gridX * blockSpacing;
  const z = building.gridZ * blockSpacing;
  const emissiveIntensity = isSelected ? 0.8 : isHovered ? 0.5 : 0.2;

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[building.width, 1, building.depth]} />
        <meshStandardMaterial
          color="#1a1f26"
          emissive={building.accentColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {isSelected && (
        <mesh position={[0, animatedHeight / 2, 0]}>
          <boxGeometry args={[building.width + 0.2, animatedHeight + 0.2, building.depth + 0.2]} />
          <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
