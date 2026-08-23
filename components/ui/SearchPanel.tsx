'use client';
import { useState } from 'react';
import { CityData, RepositoryBuilding } from '@/types';

interface SearchPanelProps {
  city: CityData;
  onFlyTo: (building: RepositoryBuilding) => void;
}

export function SearchPanel({ city, onFlyTo }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = query.trim()
    ? city.buildings.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="SEARCH REPOSITORIES"
          className="w-64 px-4 py-2 bg-cyber-dark/90 border border-cyber-cyan/50 rounded-lg text-cyber-white placeholder-cyber-white/40 text-sm backdrop-blur-sm focus:outline-none focus:border-cyber-cyan"
        />

        {isOpen && results.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-cyber-dark/95 border border-cyber-cyan/50 rounded-lg backdrop-blur-sm max-h-64 overflow-y-auto">
            {results.map((b) => (
              <button
                key={b.id}
                onClick={() => onFlyTo(b)}
                className="w-full px-4 py-3 text-left hover:bg-cyber-cyan/10 border-b border-cyber-cyan/20 last:border-b-0 transition-colors"
              >
                <div className="text-cyber-cyan font-semibold text-sm">
                  {b.name}
                </div>
                <div className="text-cyber-white/60 text-xs">
                  {b.commits} COMMITS
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
