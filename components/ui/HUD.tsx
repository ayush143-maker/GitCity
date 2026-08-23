import { CityData } from '@/types';

interface HUDProps {
  city: CityData;
  username: string;
  onExit: () => void;
}

export function HUD({ city, username, onExit }: HUDProps) {
  return (
    <>
      <div className="fixed top-4 left-4 z-40 space-y-1">
        <div className="text-cyber-cyan font-bold text-sm">GITHUB CITY</div>
        <div className="text-cyber-white/80 text-xs">@{username}</div>
      </div>

      <div className="fixed top-4 right-4 z-40 space-y-1 text-right">
        <div className="text-cyber-white/80 text-xs">
          REPOS <span className="text-cyber-cyan font-bold">{city.stats.totalRepos}</span>
        </div>
        <div className="text-cyber-white/80 text-xs">
          COMMITS <span className="text-cyber-cyan font-bold">{city.stats.totalCommits.toLocaleString()}</span>
        </div>
        <div className="text-cyber-white/80 text-xs">
          STARS <span className="text-cyber-cyan font-bold">{city.stats.totalStars.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onExit}
        className="fixed bottom-4 left-4 px-4 py-2 bg-cyber-dark/80 border border-cyber-cyan/50 rounded-lg text-cyber-cyan text-xs backdrop-blur-sm hover:bg-cyber-cyan/10 transition-colors z-40"
      >
        ← EXIT
      </button>
    </>
  );
}
