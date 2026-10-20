import React, { useRef, useState, useCallback, useEffect } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45; // max joystick radius in px

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setActive(true);
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updatePosition(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setActive(false);
        setKnobPos({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
        break;
      }
    }
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const kx = Math.cos(angle) * clampedDist;
    const ky = Math.sin(angle) * clampedDist;

    setKnobPos({ x: kx, y: ky });
    // Output normalized vector (-1 to 1)
    onMove({
      x: kx / maxRadius,
      y: ky / maxRadius,
    });
  };

  // Keyboard WASD / Arrow Keys Support for Desktop
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const updateFromKeys = () => {
      let x = 0;
      let y = 0;
      if (keysPressed['KeyW'] || keysPressed['ArrowUp']) y -= 1;
      if (keysPressed['KeyS'] || keysPressed['ArrowDown']) y += 1;
      if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) x -= 1;
      if (keysPressed['KeyD'] || keysPressed['ArrowRight']) x += 1;

      if (x !== 0 || y !== 0) {
        const len = Math.hypot(x, y);
        onMove({ x: x / len, y: y / len });
        setKnobPos({ x: (x / len) * maxRadius, y: (y / len) * maxRadius });
        setActive(true);
      } else {
        onMove({ x: 0, y: 0 });
        setKnobPos({ x: 0, y: 0 });
        setActive(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        keysPressed[e.code] = true;
        updateFromKeys();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keysPressed[e.code]) {
        keysPressed[e.code] = false;
        updateFromKeys();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onMove]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-28 h-28 rounded-full bg-slate-900/60 border-2 border-white/20 backdrop-blur-md flex items-center justify-center touch-none pointer-events-auto select-none shadow-xl shadow-black/30"
    >
      {/* Outer Directional Crosshair Markings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-full h-0.5 bg-white/40" />
        <div className="h-full w-0.5 bg-white/40 absolute" />
      </div>

      {/* Center Floating Thumb Knob */}
      <div
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: active ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-grab active:cursor-grabbing ${
          active
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/40 scale-105'
            : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-white/20'
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-white/50" />
      </div>
    </div>
  );
};
