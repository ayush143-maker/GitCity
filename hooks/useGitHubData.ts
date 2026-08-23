'use client';
import { useState } from 'react';
import { fetchUserProfile, fetchUserRepos } from '@/lib/github';
import { buildCity } from '@/lib/city';
import { CityData } from '@/types';

export type LoadStage =
  | 'idle'
  | 'connecting'
  | 'fetching'
  | 'analyzing'
  | 'generating'
  | 'ready'
  | 'error';

export function useGitHubData() {
  const [username, setUsername] = useState('');
  const [city, setCity] = useState<CityData | null>(null);
  const [stage, setStage] = useState<LoadStage>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = async (name: string) => {
    const clean = name.replace(/^@/, '').trim();
    if (!clean) return;
    setError(null);
    setUsername(clean);

    try {
      setStage('connecting');
      const user = await fetchUserProfile(clean);

      setStage('fetching');
      const repos = await fetchUserRepos(clean);

      setStage('analyzing');
      await new Promise((r) => setTimeout(r, 450));

      setStage('generating');
      const data = buildCity(user, repos);
      await new Promise((r) => setTimeout(r, 450));

      setCity(data);
      setStage('ready');
    } catch (e: any) {
      setStage('error');
      if (e.status === 404)
        setError('PROFILE NOT FOUND — check the GitHub username and try again.');
      else if (e.status === 403) setError('GitHub rate limit reached. Try again shortly.');
      else setError('Could not reach GitHub. Check your connection.');
    }
  };

  const reset = () => {
    setCity(null);
    setStage('idle');
    setError(null);
    setUsername('');
  };

  return { username, city, stage, error, load, reset };
}
