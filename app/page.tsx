'use client';
import { useState } from 'react';
import Landing from '@/components/Landing';
import CityScene from '@/components/CityScene';
import { useGitHubData } from '@/hooks/useGitHubData';
import { useBuildingSelection } from '@/hooks/useBuildingSelection';

export default function Home() {
  const { username, city, stage, error, load, reset } = useGitHubData();
  const selection = useBuildingSelection();
  const [inputValue, setInputValue] = useState('');

  if (stage !== 'ready' || !city) {
    return (
      <Landing
        inputValue={inputValue}
        setInputValue={setInputValue}
        onExplore={() => load(inputValue)}
        stage={stage}
        error={error}
      />
    );
  }

  return (
    <CityScene
      city={city}
      username={username}
      selected={selection.selected}
      hovered={selection.hovered}
      cameraTarget={selection.cameraTarget}
      onSelect={selection.select}
      onHover={selection.setHovered}
      onFlyTo={selection.flyTo}
      clearTarget={selection.clearTarget}
      onExit={reset}
    />
  );
}
