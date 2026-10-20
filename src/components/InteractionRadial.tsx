import React from 'react';
import { NPCData, PlacedFurniture } from '../types/game';
import { sound } from '../services/soundSynth';
import {
  X,
  Sparkles,
  Heart,
  Smile,
  Utensils,
  Zap,
  Droplets,
  Dumbbell,
  Tv,
  MessageCircle,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractionRadialProps {
  furniture: PlacedFurniture | null;
  npc: NPCData | null;
  onClose: () => void;
  onPerformAction: (actionName: string, needDeltas: Record<string, number>, cashDelta?: number) => void;
  onPerformSocialAction: (actionType: 'chat' | 'joke' | 'flirt' | 'kiss' | 'date' | 'propose' | 'move_in') => void;
}

export const InteractionRadial: React.FC<InteractionRadialProps> = ({
  furniture,
  npc,
  onClose,
  onPerformAction,
  onPerformSocialAction,
}) => {
  if (!furniture && !npc) return null;

  const title = furniture ? furniture.name : npc ? npc.name : 'Interact';
  const subtitle = furniture
    ? 'Choose an activity with this item'
    : npc
    ? `${npc.career} · ${npc.traits.join(', ')}`
    : '';

  return (
    <div className="absolute inset-0 z-40 flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/15 p-5 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{title}</span>
            </h3>
            <p className="text-[11px] text-slate-400">{subtitle}</p>
          </div>
          <button
            onClick={() => {
              sound.playClick(400);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FURNITURE INTERACTIONS */}
        {furniture && (
          <div className="space-y-2">
            {furniture.catalogId === 'retro_fridge' && (
              <>
                <button
                  onClick={() => {
                    sound.playNeedRestored();
                    onPerformAction('Quick Snack', { hunger: 40 }, -15);
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Have Quick Snack</div>
                      <div className="text-[10px] text-slate-400">+40 Hunger</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-rose-400">-$15</span>
                </button>

                <button
                  onClick={() => {
                    sound.playNeedRestored();
                    onPerformAction('Gourmet Salmon Pasta', { hunger: 85, fun: 20 }, -45);
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Cook Gourmet Salmon Pasta</div>
                      <div className="text-[10px] text-slate-400">+85 Hunger · +20 Fun</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-rose-400">-$45</span>
                </button>
              </>
            )}

            {furniture.catalogId === 'modern_bed' && (
              <>
                <button
                  onClick={() => {
                    sound.playNeedRestored();
                    onPerformAction('Sleep for the Night', { energy: 100 });
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Sleep for the Night</div>
                    <div className="text-[10px] text-slate-400">Full 100% Energy Recovery (6 Hours)</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    sound.playNeedRestored();
                    onPerformAction('Power Nap', { energy: 35 });
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <div>
                    <div className="text-xs font-bold text-white">Take Power Nap</div>
                    <div className="text-[10px] text-slate-400">+35 Energy (1 Hour)</div>
                  </div>
                </button>
              </>
            )}

            {furniture.catalogId === 'rainfall_shower' && (
              <button
                onClick={() => {
                  sound.playNeedRestored();
                  onPerformAction('Sing in Rainfall Shower', { hygiene: 95, fun: 15 });
                }}
                className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <Droplets className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-xs font-bold text-white">Sing in Rainfall Shower</div>
                  <div className="text-[10px] text-slate-400">+95 Hygiene · +15 Fun</div>
                </div>
              </button>
            )}

            {furniture.catalogId === 'porcelain_toilet' && (
              <button
                onClick={() => {
                  sound.playNeedRestored();
                  onPerformAction('Use Ceramic Toilet', { bladder: 100 });
                }}
                className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <Droplets className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">Use Toilet</div>
                  <div className="text-[10px] text-slate-400">Relieve Bladder to 100%</div>
                </div>
              </button>
            )}

            {furniture.catalogId === 'oled_tv' && (
              <button
                onClick={() => {
                  sound.playNeedRestored();
                  onPerformAction('Watch Comedy Sitcom', { fun: 80 });
                }}
                className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <Tv className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-white">Watch Comedy Sitcom</div>
                  <div className="text-[10px] text-slate-400">+80 Fun</div>
                </div>
              </button>
            )}

            {furniture.catalogId === 'velvet_sofa' && (
              <button
                onClick={() => {
                  sound.playNeedRestored();
                  onPerformAction('Lounge on Velvet Sofa', { energy: 30, fun: 25 });
                }}
                className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <Smile className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">Lounge and Relax</div>
                  <div className="text-[10px] text-slate-400">+30 Energy · +25 Fun</div>
                </div>
              </button>
            )}

            {/* General item action fallback */}
            {furniture.catalogId !== 'retro_fridge' &&
              furniture.catalogId !== 'modern_bed' &&
              furniture.catalogId !== 'rainfall_shower' &&
              furniture.catalogId !== 'porcelain_toilet' &&
              furniture.catalogId !== 'oled_tv' &&
              furniture.catalogId !== 'velvet_sofa' && (
                <button
                  onClick={() => {
                    sound.playNeedRestored();
                    onPerformAction(`Use ${furniture.name}`, furniture.needRestores || { fun: 30 });
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Interact with {furniture.name}</div>
                    <div className="text-[10px] text-slate-400">Restore daily needs</div>
                  </div>
                </button>
              )}
          </div>
        )}

        {/* NPC SOCIAL INTERACTIONS */}
        {npc && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playSimlish('happy');
                onPerformSocialAction('chat');
              }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-blue-400 mb-1" />
              <div className="text-xs font-bold text-white">Friendly Chat</div>
              <div className="text-[10px] text-slate-400">+Friendship · +Social</div>
            </button>

            <button
              onClick={() => {
                sound.playSimlish('laugh');
                onPerformSocialAction('joke');
              }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <Smile className="w-4 h-4 text-amber-400 mb-1" />
              <div className="text-xs font-bold text-white">Tell Funny Joke</div>
              <div className="text-[10px] text-slate-400">+Friendship · +Fun</div>
            </button>

            <button
              onClick={() => {
                sound.playSimlish('flirty');
                onPerformSocialAction('flirt');
              }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 text-pink-400 mb-1" />
              <div className="text-xs font-bold text-white">Flirt & Compliment</div>
              <div className="text-[10px] text-slate-400">+Romance Points</div>
            </button>

            <button
              onClick={() => {
                sound.playRomanceChime();
                confetti({ particleCount: 50, spread: 60 });
                onPerformSocialAction('kiss');
              }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-current mb-1" />
              <div className="text-xs font-bold text-white">Passionate Kiss</div>
              <div className="text-[10px] text-slate-400">Deep Romantic Bond</div>
            </button>

            <button
              onClick={() => {
                sound.playRomanceChime();
                onPerformSocialAction('date');
              }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-400 mb-1" />
              <div className="text-xs font-bold text-white">Ask on Romantic Date</div>
              <div className="text-[10px] text-slate-400">Head to Café/Beach</div>
            </button>

            <button
              onClick={() => {
                sound.playCashRegister();
                confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
                onPerformSocialAction('propose');
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-rose-950 to-slate-900 border border-rose-500/40 text-left transition-colors cursor-pointer col-span-2"
            >
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Propose Marriage & Ring</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">Build a lasting marriage & family union!</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
