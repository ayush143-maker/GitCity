import { RepositoryBuilding } from '@/types';

interface BuildingPanelProps {
  building: RepositoryBuilding;
  onClose: () => void;
}

export function BuildingPanel({ building, onClose }: BuildingPanelProps) {
  const timeAgo = () => {
    const diff = Date.now() - new Date(building.updatedAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-cyber-dark/95 border border-cyber-cyan/50 rounded-lg p-5 backdrop-blur-sm z-40">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-cyber-white/60 hover:text-cyber-white text-xl"
      >
        ×
      </button>

      <div className="space-y-3">
        <div>
          <h2 className="text-cyber-cyan font-bold text-lg">{building.name}</h2>
          {building.description && (
            <p className="text-cyber-white/70 text-xs mt-1 line-clamp-2">
              {building.description}
            </p>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <div className="text-cyber-white/80">
            {building.commits.toLocaleString()} commits
          </div>
          <div className="text-cyber-white/80">
            ★ {building.stars.toLocaleString()} stars
          </div>
          <div className="text-cyber-white/80">
            {building.forks.toLocaleString()} forks
          </div>
        </div>

        <div className="pt-2 border-t border-cyber-cyan/20 space-y-1 text-xs">
          {building.language && (
            <div className="text-cyber-blue">{building.language}</div>
          )}
          <div className="text-cyber-white/60">Last updated {timeAgo()}</div>
        </div>

        <a
          href={building.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan text-center rounded-lg hover:bg-cyber-cyan/30 transition-colors text-sm font-semibold"
        >
          VIEW REPOSITORY →
        </a>
      </div>
    </div>
  );
}
