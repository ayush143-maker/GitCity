import { CityData } from '@/types';

export function Roads({ city }: { city: CityData }) {
  const { gridSize, blockSpacing, roadWidth } = city;
  const totalSize = gridSize * blockSpacing;
  const roads: JSX.Element[] = [];

  for (let i = 0; i <= gridSize; i++) {
    const pos = -totalSize / 2 + i * blockSpacing;
    roads.push(
      <mesh
        key={`h-${i}`}
        position={[0, 0.01, pos]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[totalSize, roadWidth]} />
        <meshStandardMaterial color="#0a0e13" emissive="#00e5ff" emissiveIntensity={0.1} />
      </mesh>
    );
    roads.push(
      <mesh
        key={`v-${i}`}
        position={[pos, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <planeGeometry args={[totalSize, roadWidth]} />
        <meshStandardMaterial color="#0a0e13" emissive="#00e5ff" emissiveIntensity={0.1} />
      </mesh>
    );
  }

  return <group>{roads}</group>;
}
