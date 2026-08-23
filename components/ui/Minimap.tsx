'use client';

import { useEffect, useMemo, useRef } from 'react';

import { CITY, DemoBuilding } from '@/lib/demoCity';
import type { ControlState } from '@/components/controls/CameraRig';

const MAP_SIZE = 130;

function toMap(v: number) {
  return MAP_SIZE / 2 + (v / (CITY.radius + 20)) * (MAP_SIZE / 2);
}

export function Minimap({
  buildings,
  controls,
}: {
  buildings: DemoBuilding[];
  controls: React.MutableRefObject<ControlState>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const staticCanvas = useMemo(() => {
    if (typeof document === 'undefined') return null;

    const c = document.createElement('canvas');
    c.width = MAP_SIZE;
    c.height = MAP_SIZE;

    const ctx = c.getContext('2d')!;

    ctx.fillStyle = 'rgba(2, 5, 10, 0.9)';
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
    ctx.lineWidth = 1;

    for (let k = -CITY.grid / 2; k <= CITY.grid / 2; k += 2) {
      const p = toMap(k * CITY.pitch);

      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, MAP_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(MAP_SIZE, p);
      ctx.stroke();
    }

    buildings.forEach((b) => {
      const x = toMap(b.x);
      const y = toMap(b.z);
      const s = Math.max(1, b.w * 0.14);

      ctx.globalAlpha = 0.8;
      ctx.fillStyle = b.accent;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = '#eaffff';
    ctx.fillRect(MAP_SIZE / 2 - 2, MAP_SIZE / 2 - 2, 4, 4);

    return c;
  }, [buildings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || !staticCanvas) return;

    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
      ctx.drawImage(staticCanvas, 0, 0);

      const x = toMap(controls.current.camX);
      const y = toMap(controls.current.camZ);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(raf);
  }, [staticCanvas, controls]);

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-20 -translate-x-1/2 md:bottom-5">
      <canvas
        ref={canvasRef}
        width={MAP_SIZE}
        height={MAP_SIZE}
        className="rounded-lg border border-cyan-300/20 opacity-80"
      />
    </div>
  );
}
