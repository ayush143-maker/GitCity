'use client';
import { Canvas } from '@react-three/fiber';
import { CityData, RepositoryBuilding, CameraTarget } from '@/types';
import { Ground } from './city/Ground';
import { Roads } from './city/Roads';
import { Building } from './city/Building';
import { Landmark } from './city/Landmark';
import { CameraController } from './controls/CameraController';
import { MobileControls } from './controls/MobileControls';
import { HUD } from './ui/HUD';
import { BuildingPanel } from './ui/BuildingPanel';
import { SearchPanel } from './ui/SearchPanel';
import { Minimap } from './ui/Minimap';

interface CitySceneProps {
  city: CityData;
  username: string;
  selected: RepositoryBuilding | null;
  hovered: number | null;
  cameraTarget: CameraTarget;
  onSelect: (b: RepositoryBuilding | null) => void;
  onHover: (id: number | null) => void;
  onFlyTo: (b: RepositoryBuilding) => void;
  clearTarget: () => void;
  onExit: () => void;
}

export default function CityScene({
  city,
  username,
  selected,
  hovered,
  cameraTarget,
  onSelect,
  onHover,
  onFlyTo,
  clearTarget,
  onExit,
}: CitySceneProps) {
  const totalSize = city.gridSize * city.blockSpacing;

  return (
    <div className="w-full h-screen relative bg-cyber-black">
      <Canvas
        camera={{ position: [30, 30, 50], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#05070a']} />
        <fog attach="fog" args={['#05070a', 50, 200]} />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[50, 50, 50]} intensity={0.5} />
        <pointLight position={[0, 50, 0]} intensity={0.8} color="#00e5ff" />

        <Ground size={totalSize} />
        <Roads city={city} />
        <Landmark city={city} />

        {city.buildings.map((building) => (
          <Building
            key={building.id}
            building={building}
            isSelected={selected?.id === building.id}
            isHovered={hovered === building.id}
            blockSpacing={city.blockSpacing}
            onSelect={() => onSelect(building)}
            onHover={(h) => onHover(h ? building.id : null)}
          />
        ))}

        <CameraController target={cameraTarget} clearTarget={clearTarget} />
      </Canvas>

      <HUD city={city} username={username} onExit={onExit} />
      <Minimap city={city} selected={selected} />
      
      {selected && (
        <BuildingPanel building={selected} onClose={() => onSelect(null)} />
      )}

      <SearchPanel city={city} onFlyTo={onFlyTo} />
      <MobileControls />
    </div>
  );
}
