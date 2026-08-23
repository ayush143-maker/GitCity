'use client';
import { LoadStage } from '@/hooks/useGitHubData';

interface LandingProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  onExplore: () => void;
  stage: LoadStage;
  error: string | null;
}

const stageMessages: Record<LoadStage, string> = {
  idle: '',
  connecting: 'CONNECTING TO GITHUB',
  fetching: 'FETCHING REPOSITORIES',
  analyzing: 'ANALYZING ACTIVITY',
  generating: 'GENERATING CITY',
  ready: '',
  error: '',
};

export default function Landing({
  inputValue,
  setInputValue,
  onExplore,
  stage,
  error,
}: LandingProps) {
  const isLoading = stage !== 'idle' && stage !== 'error';

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-cyber-white">
            YOUR GITHUB.
            <br />
            <span className="text-cyber-cyan">BUILT AS A CITY.</span>
          </h1>
          <p className="text-cyber-white/60 text-sm md:text-base">
            Turn your GitHub activity into a living 3D world.
          </p>
        </div>

        {stage === 'idle' || stage === 'error' ? (
          <div className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onExplore()}
              placeholder="github username"
              className="w-full px-4 py-3 bg-cyber-dark border border-cyber-cyan/30 rounded-lg text-cyber-white placeholder-cyber-white/40 focus:outline-none focus:border-cyber-cyan transition-colors"
              disabled={isLoading}
            />

            <button
              onClick={onExplore}
              disabled={!inputValue.trim()}
              className="w-full px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan rounded-lg font-semibold hover:bg-cyber-cyan/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              EXPLORE CITY →
            </button>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 py-8">
            <div className="text-cyber-cyan font-mono text-sm animate-pulse">
              {stageMessages[stage]}
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
