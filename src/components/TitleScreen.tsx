import React from 'react';
import { Play, Sparkles, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sound } from '../services/soundSynth';

interface TitleScreenProps {
  onStartNewGame: () => void;
  onContinueGame: () => void;
  hasSave: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCAS: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartNewGame,
  onContinueGame,
  hasSave,
  isMuted,
  onToggleMute,
  onOpenCAS,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 pointer-events-auto bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Animated Plumbob SVG Icon */}
          <svg className="w-9 h-9 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" viewBox="0 0 40 60" fill="none">
            <polygon points="20,2 38,30 20,58 2,30" fill="#10B981" stroke="#059669" strokeWidth="2" />
            <polygon points="20,2 20,58 38,30" fill="#34D399" opacity="0.75" />
          </svg>
          <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400">
            Open World Simulation
          </span>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            sound.playClick(520);
            onToggleMute();
          }}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-900/80 border border-white/15 text-slate-300 hover:text-white transition-colors"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </div>

      {/* Hero Title Lockup */}
      <div className="w-full max-w-md mx-auto my-auto text-center flex flex-col items-center">
        <div className="relative mb-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            SimLife <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">3D</span>
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-200/90 font-medium max-w-sm mb-8 leading-relaxed drop-shadow">
          Build your home, pursue dream careers, fall in love, and live freely in a vibrant coastal neighborhood.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col w-full max-w-xs gap-3.5">
          {hasSave && (
            <button
              onClick={() => {
                sound.playClick(600);
                onContinueGame();
              }}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Continue Virtual Life</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick(500);
              onOpenCAS();
            }}
            className="w-full h-13 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>{hasSave ? 'Create New Character' : 'Start Virtual Life'}</span>
          </button>

          {hasSave && (
            <button
              onClick={() => {
                sound.playClick(400);
                if (window.confirm('Reset progress and start a brand new life?')) {
                  onStartNewGame();
                }
              }}
              className="w-full h-10 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Start Fresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Hint Footer */}
      <div className="w-full text-center">
        <p className="text-xs text-slate-400/90 font-medium tracking-wide">
          Tap ground / thumb joystick to walk · Drag to rotate camera · Pinch to zoom
        </p>
      </div>
    </div>
  );
};
