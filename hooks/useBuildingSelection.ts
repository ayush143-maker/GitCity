'use client';
import { useState, useCallback } from 'react';
import { RepositoryBuilding, CameraTarget } from '@/types';

export function useBuildingSelection() {
  const [selected, setSelected] = useState<RepositoryBuilding | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cameraTarget, setCameraTarget] = useState<CameraTarget>(null);

  const select = useCallback((b: RepositoryBuilding | null) => setSelected(b), []);
  const flyTo = useCallback((b: RepositoryBuilding) => {
    setCameraTarget({
      position: [b.gridX * 14, Math.max(8, b.height + 4), b.gridZ * 14 + 12],
      lookAt: [b.gridX * 14, b.height / 2, b.gridZ * 14],
    });
  }, []);

  return {
    selected,
    hovered,
    cameraTarget,
    select,
    setHovered,
    flyTo,
    clearTarget: () => setCameraTarget(null),
  };
}
