import React, { useState } from 'react';
import {
  GameTime,
  MoodType,
  NeedsState,
  WeatherType,
} from '../types/game';
import { VirtualJoystick } from './VirtualJoystick';
import { sound } from '../services/soundSynth';
import {
  Smartphone,
  Hammer,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Play,
  Pause,
  FastForward,
  Sun,
  Sunset,
  CloudRain,
  Moon,
  ChevronUp,
  ChevronDown,
  Utensils,
  Zap,
  Droplets,
  Smile,
  Users,
  Heart,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';

interface GameHUDProps {
  gameTime: GameTime;
  weather: WeatherType;
  wallet: number;
  mood: MoodType;
  needs: NeedsState;
  isMuted: boolean;
  onToggleMute: () => void;
  onSetSpeed: (speed: 0 | 1 | 2 | 3) => void;
  onOpenPhone: (defaultApp?: string) => void;
  onToggleBuildMode: () => void;
  isBuildMode: boolean;
  onJoystickMove: (vector: { x: number; y: number }) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateCamLeft: () => void;
  onRotateCamRight: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameTime,
  weather,
  wallet,
  mood,
  needs,
  isMuted,
  onToggleMute,
  onSetSpeed,
  onOpenPhone,
  onToggleBuildMode,
  isBuildMode,
  onJoystickMove,
  onZoomIn,
  onZoomOut,
  onRotateCamLeft,
  onRotateCamRight,
}) => {
  const [showNeedsDrawer, setShowNeedsDrawer] = useState(false);

  // Format 24h clock to AM/PM
  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    const m = minute < 10 ? `0${minute}` : minute;
    return `${h}:${m} ${period}`;
  };

  // Weather Icon
  const renderWeatherIcon = () => {
    switch (weather) {
      case 'sunset':
        return <Sunset className="w-4 h-4 text-orange-400" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-sky-400 animate-bounce" />;
      case 'clear_night':
        return <Moon className="w-4 h-4 text-indigo-300" />;
      default:
        return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  // Mood color helper
  const getMoodColor = (m: MoodType) => {
    switch (m) {
      case 'Ecstatic':
      case 'Happy':
      case 'Inspired':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/15';
      case 'Flirty':
        return 'text-pink-400 border-pink-500/40 bg-pink-500/15';
      case 'Energetic':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/15';
      case 'Tired':
      case 'Hungry':
      case 'Lonely':
        return 'text-rose-400 border-rose-500/40 bg-rose-500/15';
      default:
        return 'text-sky-300 border-sky-500/40 bg-sky-500/15';
    }
  };

  // Need bar color helper
  const getNeedBarColor = (val: number) => {
    if (val >= 65) return 'bg-emerald-500';
    if (val >= 35) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const needsList = [
    { label: 'Hunger', val: needs.hunger, icon: Utensils },
    { label: 'Energy', val: needs.energy, icon: Zap },
    { label: 'Hygiene', val: needs.hygiene, icon: Droplets },
    { label: 'Bladder', val: needs.bladder, icon: CheckCircle2 },
    { label: 'Fun', val: needs.fun, icon: Smile },
    { label: 'Social', val: needs.social, icon: Users },
    { label: 'Romance', val: needs.romance, icon: Heart },
    { label: 'Fitness', val: needs.fitness, icon: Dumbbell },
  ];

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* TOP BAR CLUSTER */}
      <div className="flex items-start justify-between w-full max-w-6xl mx-auto gap-2">
        {/* Left: Time, Day, Weather & Speed */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-lg shadow-black/20 text-white">
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              Day {gameTime.day}
            </span>
            <span className="text-slate-600 font-bold">·</span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
              {formatTime(gameTime.hour, gameTime.minute)}
            </span>
            <div className="pl-1 border-l border-white/10 flex items-center">
              {renderWeatherIcon()}
            </div>
          </div>

          {/* Simulation Speed Toggles */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-sm self-start">
            <button
              onClick={() => {
                sound.playClick(440);
                onSetSpeed(gameTime.speed === 0 ? 1 : 0);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                gameTime.speed === 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Pause"
            >
              {gameTime.speed === 0 ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                sound.playClick(500);
                onSetSpeed(1);
              }}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                gameTime.speed === 1 ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => {
                sound.playClick(560);
                onSetSpeed(2);
              }}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                gameTime.speed === 2 ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => {
                sound.playClick(620);
                onSetSpeed(3);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                gameTime.speed === 3 ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Ultra Fast"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Cash, Mood Badge & Audio Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mood Badge */}
          <div className={`px-3 py-1.5 rounded-2xl border backdrop-blur-md flex items-center gap-2 shadow-md ${getMoodColor(mood)}`}>
            {/* Mini Plumbob */}
            <svg className="w-3.5 h-5 drop-shadow-[0_0_8px_currentColor]" viewBox="0 0 40 60" fill="none">
              <polygon points="20,2 38,30 20,58 2,30" fill="currentColor" />
            </svg>
            <span className="text-xs font-bold">{mood}</span>
          </div>

          {/* Cash Wallet */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-lg shadow-black/20 text-emerald-400 font-mono font-bold text-sm sm:text-base tabular-nums">
            <span className="text-xs text-emerald-500 font-semibold">$</span>
            <span>{wallet.toLocaleString()}</span>
          </div>

          {/* Sound Mute */}
          <button
            onClick={() => {
              sound.playClick(500);
              onToggleMute();
            }}
            className="flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-900/85 border border-white/15 backdrop-blur-md text-slate-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* CENTER TOP: COLLAPSIBLE NEEDS PANEL */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto pointer-events-auto my-auto mt-2">
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              sound.playClick(460);
              setShowNeedsDrawer(!showNeedsDrawer);
            }}
            className="px-3.5 py-1 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-md text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 hover:text-white shadow-md cursor-pointer transition-all"
          >
            <span>Needs & Mood</span>
            {showNeedsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showNeedsDrawer && (
            <div className="w-full mt-2 p-3 rounded-2xl bg-slate-950/90 border border-white/15 backdrop-blur-md shadow-2xl grid grid-cols-2 gap-2 text-white animate-in fade-in slide-in-from-top-2 duration-200">
              {needsList.map(({ label, val, icon: Icon }) => (
                <div key={label} className="flex flex-col gap-1 p-1.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                    <span className="flex items-center gap-1">
                      <Icon className="w-3 h-3 text-slate-400" />
                      {label}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums">{Math.round(val)}%</span>
                  </div>
                  {/* Gauge Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${getNeedBarColor(val)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ACTION CLUSTER */}
      <div className="flex items-end justify-between w-full max-w-6xl mx-auto gap-4 mt-auto">
        {/* Lower-Left: Virtual Touch Joystick for iPhone Thumb Zone */}
        <div className="pointer-events-auto">
          <VirtualJoystick onMove={onJoystickMove} />
        </div>

        {/* Lower-Right: Smartphone, Build Mode, and Camera Orbit Controls */}
        <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
          {/* Camera View Orbit & Zoom Cluster */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/15 backdrop-blur-md shadow-lg shadow-black/20">
            <button
              onClick={() => {
                sound.playClick(440);
                onRotateCamLeft();
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white active:bg-slate-800 transition-colors"
              title="Rotate Camera Left"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick(440);
                onRotateCamRight();
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white active:bg-slate-800 transition-colors"
              title="Rotate Camera Right"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={() => {
                sound.playClick(480);
                onZoomIn();
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white active:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick(480);
                onZoomOut();
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white active:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action Buttons: Build Mode & Smartphone */}
          <div className="flex items-center gap-2.5">
            {/* Build Mode Toggle */}
            <button
              onClick={() => {
                sound.playClick(540);
                onToggleBuildMode();
              }}
              className={`h-13 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border shadow-xl transition-all cursor-pointer ${
                isBuildMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/25 scale-105'
                  : 'bg-slate-900/90 text-white border-white/20 hover:bg-slate-800'
              }`}
            >
              <Hammer className="w-5 h-5 text-amber-400" />
              <span>{isBuildMode ? 'Exit Build' : 'Build Mode'}</span>
            </button>

            {/* In-Game Smartphone */}
            <button
              onClick={() => {
                sound.playClick(600);
                onOpenPhone();
              }}
              className="relative h-13 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              <span>SimPhone</span>
              {/* Notification Dot */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
