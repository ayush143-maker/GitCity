'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { CITY, generateDemoCity } from '@/lib/demoCity';
import { DemoCity } from '@/components/city/DemoCity';
import { CameraRig, type ControlState } from '@/components/controls/CameraRig';
import { TouchControls } from '@/components/controls/TouchControls';
import { Hud } from '@/components/ui/Hud';
import { Minimap } from '@/components/ui/Minimap';

export default function CityScene() {
  const data = useMemo(() => generateDemoCity(1000), []);

  const controls = useRef<ControlState>({
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
    altitude: 0,
    camX: 0,
    camY: 0,
    camZ: 0,
  });

  const [showHint, setShowHint] = useState(true);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const hintTimer = setTimeout(() => setShowHint(false), 7000);
    const bootTimer = setTimeout(() => setBooting(false), 900);

    return () => {
      clearTimeout(hintTimer);
      clearTimeout(bootTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#020409] no-select">
      <Canvas
        dpr={[1, 1.6]}
        shadows={false}
        camera={{
          fov: 58,
          near: 0.5,
          far: 1000,
          position: [0, 92, 190],
        }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <color attach="background" args={['#020409']} />
        <fog attach="fog" args={['#020409', 95, 560]} />

        <hemisphereLight args={['#2f5573', '#02040a', 0.9]} />
        <directionalLight
          position={[90, 160, 70]}
          intensity={0.9}
          color="#cfeeff"
        />
        <pointLight
          position={[0, 80, 0]}
          intensity={1.4}
          distance={320}
          color="#00e5ff"
        />

        <DemoCity buildings={data.buildings} />
        <CameraRig controls={controls} />
      </Canvas>

      <TouchControls controls={controls} />
      <Hud data={data} showHint={showHint} />
      <Minimap buildings={data.buildings} controls={controls} />

      {booting && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#020409]/80 backdrop-blur-sm">
          <div className="space-y-3 text-center">
            <div className="font-display text-sm text-cyan-300 animate-pulse">
              GENERATING 1000 TOWERS
            </div>
            <div className="mx-auto h-1 w-56 overflow-hidden rounded bg-cyan-950">
              <div className="h-full w-1/2 animate-pulse bg-cyan-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
