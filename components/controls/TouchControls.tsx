'use client';

import { useEffect, useRef, useState } from 'react';
import type { ControlState } from './CameraRig';

export function TouchControls({
  controls,
}: {
  controls: React.MutableRefObject<ControlState>;
}) {
  const [touchMode, setTouchMode] = useState(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const joyRef = useRef<HTMLDivElement>(null);
  const joyPointer = useRef<number | null>(null);
  const lookPointer = useRef<number | null>(null);
  const lastLook = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setTouchMode(
      typeof window !== 'undefined' &&
        (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)
    );
  }, []);

  const updateJoy = (clientX: number, clientY: number) => {
    const rect = joyRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = clientX - cx;
    let dy = clientY - cy;

    const max = rect.width / 2;
    const len = Math.hypot(dx, dy) || 1;
    const limit = Math.min(len, max);

    dx = (dx / len) * limit;
    dy = (dy / len) * limit;

    setKnob({ x: dx, y: dy });

    controls.current.moveX = dx / max;
    controls.current.moveY = -dy / max;
  };

  const resetJoy = () => {
    joyPointer.current = null;
    setKnob({ x: 0, y: 0 });
    controls.current.moveX = 0;
    controls.current.moveY = 0;
  };

  return (
    <>
      {/* Look area */}
      <div
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          e.preventDefault();
          lookPointer.current = e.pointerId;
          lastLook.current = { x: e.clientX, y: e.clientY };

          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerMove={(e) => {
          if (lookPointer.current !== e.pointerId) return;

          controls.current.lookX += e.clientX - lastLook.current.x;
          controls.current.lookY += e.clientY - lastLook.current.y;

          lastLook.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (lookPointer.current === e.pointerId) lookPointer.current = null;
        }}
        onPointerCancel={(e) => {
          if (lookPointer.current === e.pointerId) lookPointer.current = null;
        }}
      />

      {/* Mobile joystick */}
      {touchMode && (
        <div
          ref={joyRef}
          className="absolute bottom-6 left-5 z-30 h-28 w-28 rounded-full border border-cyan-300/30 bg-[#040810]/70 backdrop-blur-sm"
          style={{ touchAction: 'none' }}
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            e.preventDefault();
            joyPointer.current = e.pointerId;

            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {}

            updateJoy(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (joyPointer.current !== e.pointerId) return;
            updateJoy(e.clientX, e.clientY);
          }}
          onPointerUp={resetJoy}
          onPointerCancel={resetJoy}
        >
          <div
            className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full border border-cyan-200/50 bg-cyan-300/20"
            style={{
              transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
            }}
          />
        </div>
      )}

      {/* Altitude buttons */}
      {touchMode && (
        <div className="absolute bottom-8 right-5 z-30 flex flex-col gap-3">
          <button
            className="hud-panel h-14 w-14 rounded-xl text-xl text-cyan-200"
            style={{ touchAction: 'none' }}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              e.preventDefault();
              controls.current.altitude = 1;
            }}
            onPointerUp={() => {
              controls.current.altitude = 0;
            }}
            onPointerLeave={() => {
              controls.current.altitude = 0;
            }}
            onPointerCancel={() => {
              controls.current.altitude = 0;
            }}
          >
            ▲
          </button>

          <button
            className="hud-panel h-14 w-14 rounded-xl text-xl text-cyan-200"
            style={{ touchAction: 'none' }}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              e.preventDefault();
              controls.current.altitude = -1;
            }}
            onPointerUp={() => {
              controls.current.altitude = 0;
            }}
            onPointerLeave={() => {
              controls.current.altitude = 0;
            }}
            onPointerCancel={() => {
              controls.current.altitude = 0;
            }}
          >
            ▼
          </button>
        </div>
      )}
    </>
  );
}
