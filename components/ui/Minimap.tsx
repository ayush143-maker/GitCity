import { CityData, RepositoryBuilding } from '@/types';

interface MinimapProps {
  city: CityData;
  selected: RepositoryBuilding | null;
}

export function Minimap({ city, selected }: MinimapProps) {
  const mapSize = 150;
  const scale = mapSize / (city.gridSize * city.blockSpacing);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-cyber-dark/90 border border-cyber-cyan/50 rounded-lg backdrop-blur-sm z-40 p-2">
      <div className="relative w-full h-full">
        {city.buildings.map((b) => {
          const x = (b.gridX * city.blockSpacing) * scale + mapSize / 2;
          const z = (b.gridZ * city.blockSpacing) * scale + mapSize / 2;
          const size = Math.max(2, b.width * scale);

          return (
            <div
              key={b.id}
              className="absolute rounded-sm"
              style={{
                left: `${x - size / 2}px`,
                top: `${z - size / 2}px`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor:
                  selected?.id === b.id ? '#00e5ff' : b.accentColor,
                opacity: selected?.id === b.id ? 1 : 0.6,
              }}
            />
          );
        })}

        <div
          className="absolute w-2 h-2 bg-cyber-white rounded-full animate-pulse"
          style={{
            left: `${mapSize / 2 - 4}px`,
            top: `${mapSize / 2 - 4}px`,
          }}
        />
      </div>
    </div>
  );
}
