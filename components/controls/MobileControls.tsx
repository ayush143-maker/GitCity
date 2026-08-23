'use client';
import { useEffect, useRef, useState } from 'react';

export function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const leftJoystick = useRef<HTMLDivElement>(null);
  const rightTouch = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      <div
        ref={leftJoystick}
        className="fixed bottom-8 left-8 w-32 h-32 bg-cyber-dark/80 border-2 border-cyber-cyan/50 rounded-full backdrop-blur-sm z-50"
      >
        <div className="absolute inset-4 bg-cyber-cyan/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyber-cyan text-xs">
          MOVE
        </div>
      </div>

      <div
        ref={rightTouch}
        className="fixed bottom-8 right-8 w-32 h-32 bg-cyber-dark/80 border-2 border-cyber-cyan/50 rounded-full backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div className="text-cyber-cyan text-xs text-center">
          LOOK
          <br />
          <span className="text-[10px] opacity-60">DRAG TO ROTATE</span>
        </div>
      </div>

      <div className="fixed top-24 right-8 flex flex-col gap-2 z-50">
        <button className="w-12 h-12 bg-cyber-dark/80 border border-cyber-cyan/50 rounded-lg text-cyber-cyan backdrop-blur-sm">
          ↑
        </button>
        <button className="w-12 h-12 bg-cyber-dark/80 border border-cyber-cyan/50 rounded-lg text-cyber-cyan backdrop-blur-sm">
          ↓
        </button>
      </div>
    </>
  );
}
