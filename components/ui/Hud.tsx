'use client';

import { DemoCityData } from '@/lib/demoCity';

export function Hud({
  data,
  showHint,
}: {
  data: DemoCityData;
  showHint: boolean;
}) {
  return (
    <>
      <div className="pointer-events-none fixed left-3 top-3 z-40">
        <div className="hud-panel rounded-lg px-3 py-2">
          <div className="font-display text-[13px] text-cyan-300 md:text-sm">
            GITHUB CYBER CITY
          </div>
          <div className="text-[11px] text-cyan-100/70 md:text-xs">
            100 DEVELOPER TOWERS — GRID
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed right-3 top-3 z-40 text-right">
        <div className="hud-panel space-y-1 rounded-lg px-3 py-2 text-[11px] md:text-xs">
          <div>
            BUILDINGS{' '}
            <span className="font-semibold text-cyan-300">
              {data.meta.count}
            </span>
          </div>

          <div>
            COMMITS{' '}
            <span className="font-semibold text-cyan-300">
              {data.meta.totalCommits.toLocaleString()}
            </span>
          </div>

          <div>
            STARS{' '}
            <span className="font-semibold text-cyan-300">
              {data.meta.totalStars.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {showHint && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 md:bottom-6">
          <div className="hud-panel rounded-lg px-4 py-2 text-center text-[11px] text-cyan-100/80 md:text-xs">
            <div className="md:hidden">
              LEFT JOYSTICK: MOVE | RIGHT SIDE DRAG: LOOK | ▲▼: ALTITUDE
            </div>
            <div className="hidden md:block">
              WASD MOVE | MOUSE DRAG LOOK | SPACE UP | SHIFT DOWN
            </div>
          </div>
        </div>
      )}
    </>
  );
}
