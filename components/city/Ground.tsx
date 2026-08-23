import { useMemo } from 'react';
import * as THREE from 'three';

export function Ground({ size }: { size: number }) {
  const gridTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(0, 180, 220, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(size / 20, size / 20);
    return tex;
  }, [size]);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[size * 2, size * 2]} />
      <meshStandardMaterial map={gridTex} color="#0a0e13" />
    </mesh>
  );
}
