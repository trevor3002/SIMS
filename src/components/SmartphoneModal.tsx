import React, { useState } from 'react';
import {
  CareerId,
  NPCRelationship,
  NPCData,
  PlayerCareerState,
  PlayerSaveData,
} from '../types/game';
import { CAREER_TRACKS, SEED_NPCS } from '../services/careersData';
import { sound } from '../services/soundSynth';
import {
  X,
  Briefcase,
  Building2,
  ShoppingBag,
  Users,
  MapPin,
  TrendingUp,
  Car,
  Phone,
  MessageCircle,
  Heart,
  ChevronRight,
  DollarSign,
  Award,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SmartphoneModalProps {
  playerData: PlayerSaveData;
  onClose: () => void;
  onApplyCareer: (careerId: CareerId) => void;
  onPromoteCareer: () => void;
  onGoToWork: () => void;
  onPayBills: () => void;
  onInvest: (amount: number) => void;
  onBuyVehicle: (vehicle: string, price: number) => void;
  onCallNPC: (npcId: string) => void;
  onInviteNPC: (npcId: string) => void;
  onTravelTo: (locationName: string, coords: [number, number, number]) => void;
}

export const SmartphoneModal: React.FC<SmartphoneModalProps> = ({
  playerData,
  onClose,
  onApplyCareer,
  onPromoteCareer,
  onGoToWork,
  onPayBills,
  onInvest,
  onBuyVehicle,
  onCallNPC,
  onInviteNPC,
  onTravelTo,
}) => {
  const [activeApp, setActiveApp] = useState<'home' | 'career' | 'bank' | 'shop' | 'social' | 'map'>('home');

  const currentCareerTrack = CAREER_TRACKS.find((c) => c.id === playerData.career.careerId);
  const currentLevelData = currentCareerTrack?.levels[playerData.career.level - 1];

  const travelDestinations = [
    { name: 'Seaside Studio (Home)', coords: [0, 0, 0] as [number, number, number], desc: 'Your cozy starter studio apartment.' },
    { name: 'The Palm Café & Bistro', coords: [18, 0, 8] as [number, number, number], desc: 'Fresh espresso, smoothies, and lively chatter.' },
    { name: 'Iron & Steel Fitness Gym', coords: [-22, 0, 22] as [number, number, number], desc: 'Olympic weight benches, cardio, and yoga.' },
    { name: 'Pacific Tech & Business Tower', coords: [-24, 0, -5] as [number, number, number], desc: 'Corporate headquarters and tech workspace.' },
    { name: 'Sunset Beach Boardwalk', coords: [18, 0, -20] as [number, number, number], desc: 'Golden sands, rolling waves, and ocean breezes.' },
    { name: 'Town Plaza & Central Fountain', coords: [0, 0, 24] as [number, number, number], desc: 'Vibrant civic heart of the neighborhood.' },
  ];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md pointer-events-auto">
      {/* Smartphone Frame (iOS 15 Pro styled container) */}
      <div className="relative w-full max-w-sm h-[86vh] max-h-[720px] bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white shadow-black/60">
        {/* Dynamic Island / Top Notch */}
        <div className="w-full pt-3 pb-2 flex justify-center bg-slate-950">
          <div className="w-24 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
        </div>

        {/* Top App Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-900 bg-slate-950">
          <button
            onClick={() => {
              sound.playClick(440);
              if (activeApp === 'home') onClose();
              else setActiveApp('home');
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            {activeApp === 'home' ? 'Exit Phone' : '← Back'}
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {activeApp === 'home' ? 'SimPhone OS' : activeApp.toUpperCase()}
          </span>
          <button
            onClick={() => {
              sound.playClick(400);
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PHONE BODY */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
          {/* HOME SCREEN: APPS GRID */}
          {activeApp === 'home' && (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="text-center my-4">
                  <div className="text-3xl font-extrabold tracking-tight text-white">
                    {playerData.gameTime.hour < 10 ? `0${playerData.gameTime.hour}` : playerData.gameTime.hour}:
                    {playerData.gameTime.minute < 10 ? `0${playerData.gameTime.minute}` : playerData.gameTime.minute}
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-1">
                    Day {playerData.gameTime.day} · Pacific Bay
                  </div>
                </div>

                {/* App Grid Icons */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {/* Career App */}
                  <button
                    onClick={() => {
                      sound.playClick(520);
                      setActiveApp('career');
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Career</span>
                  </button>

                  {/* Banking App */}
                  <button
                    onClick={() => {
                      sound.playClick(520);
                      setActiveApp('bank');
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Banking</span>
                  </button>

                  {/* Shopping App */}
                  <button
                    onClick={() => {
                      sound.playClick(520);
                      setActiveApp('shop');
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Shop</span>
                  </button>

                  {/* Social App */}
                  <button
                    onClick={() => {
                      sound.playClick(520);
                      setActiveApp('social');
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Contacts</span>
                  </button>

                  {/* Town Map App */}
                  <button
                    onClick={() => {
                      sound.playClick(520);
                      setActiveApp('map');
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Town GPS</span>
                  </button>
                </div>
              </div>

              {/* Bottom Quick Info */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                <div className="flex justify-between font-medium text-slate-300 mb-1">
                  <span>Current Balance:</span>
                  <span className="font-mono text-emerald-400 font-bold">${playerData.wallet.toLocaleString()}</span>
                </div>
                <div>Job: {currentLevelData?.title || 'Job Seeker'}</div>
              </div>
            </div>
          )}

          {/* APP 1: CAREER & JOBS */}
          {activeApp === 'career' && (
            <div className="space-y-4">
              {/* Current Job Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Current Employment</span>
                  <span className="text-xs font-mono text-slate-400">Lvl {playerData.career.level}/5</span>
                </div>
                <h3 className="text-base font-bold text-white">{currentLevelData?.title || 'Unemployed'}</h3>
                <p className="text-xs text-slate-400 mb-3">{currentCareerTrack?.name || 'Looking for opportunities'}</p>

                {currentLevelData && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Daily Wage:</span>
                      <span className="font-mono text-emerald-400 font-bold">${currentLevelData.salary} / shift</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Shift Hours:</span>
                      <span className="font-mono">{currentLevelData.shiftStartHour}:00 - {currentLevelData.shiftEndHour}:00</span>
                    </div>
                    {/* Performance Meter */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Work Performance</span>
                        <span className="font-mono">{playerData.career.performance}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${playerData.career.performance}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-3">
                      <button
                        onClick={() => {
                          sound.playCashRegister();
                          onGoToWork();
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Complete Shift (+${currentLevelData.salary})
                      </button>

                      {playerData.career.performance >= 80 && playerData.career.level < 5 && (
                        <button
                          onClick={() => {
                            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
                            onPromoteCareer();
                          }}
                          className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Promote!</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Available Job Listings */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Neighborhood Job Openings
                </h4>
                <div className="space-y-2">
                  {CAREER_TRACKS.filter((c) => c.id !== playerData.career.careerId).map((track) => (
                    <div
                      key={track.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{track.name}</div>
                        <div className="text-[11px] text-slate-400">{track.levels[0].title} · ${track.levels[0].salary}/day</div>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick(540);
                          onApplyCareer(track.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* APP 2: BANKING & INVESTMENTS */}
          {activeApp === 'bank' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Pacific Bay Savings</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  ${playerData.wallet.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">Available liquid funds</p>
              </div>

              {/* Bills payment */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Apartment Rent & Utilities</div>
                  <div className="text-[11px] text-slate-400">Due weekly: $200</div>
                </div>
                <button
                  onClick={() => {
                    sound.playCashRegister();
                    onPayBills();
                  }}
                  disabled={playerData.wallet < 200}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold disabled:opacity-50"
                >
                  Pay $200
                </button>
              </div>

              {/* Startup Investment */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Seaside Angel Investment</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Invest $1,000 into local coastal tech ventures for daily passive returns.
                </p>
                <button
                  onClick={() => {
                    sound.playCashRegister();
                    onInvest(1000);
                  }}
                  disabled={playerData.wallet < 1000}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  Invest $1,000 (Earn +$80/day)
                </button>
              </div>
            </div>
          )}

          {/* APP 3: VEHICLES & COMMERCE */}
          {activeApp === 'shop' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dealership & Vehicles
              </h4>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Beach Cruiser Bicycle</span>
                    <span className="font-mono text-emerald-400 text-xs font-bold">$350</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Eco-friendly mobility with light fitness restoration.</p>
                  <button
                    onClick={() => {
                      sound.playCashRegister();
                      onBuyVehicle('bicycle', 350);
                    }}
                    disabled={playerData.wallet < 350 || playerData.ownedVehicles.includes('bicycle')}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs disabled:opacity-50"
                  >
                    {playerData.ownedVehicles.includes('bicycle') ? 'Owned ✓' : 'Purchase for $350'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Red Convertible Roadster</span>
                    <span className="font-mono text-emerald-400 text-xs font-bold">$12,000</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Luxury coastal sports car with roaring acceleration.</p>
                  <button
                    onClick={() => {
                      sound.playCashRegister();
                      onBuyVehicle('car', 12000);
                    }}
                    disabled={playerData.wallet < 12000 || playerData.ownedVehicles.includes('car')}
                    className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                  >
                    {playerData.ownedVehicles.includes('car') ? 'Owned ✓' : 'Purchase for $12,000'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APP 4: CONTACTS & ROMANCE */}
          {activeApp === 'social' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Known Neighborhood Sims
              </h4>
              {SEED_NPCS.map((npc) => {
                const rel = playerData.relationships[npc.id] || {
                  friendship: 10,
                  romance: 0,
                  status: 'Acquaintance',
                };

                return (
                  <div key={npc.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-white">{npc.name}</div>
                        <div className="text-[11px] text-slate-400">{npc.career}</div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 font-semibold">
                        {rel.status}
                      </span>
                    </div>

                    {/* Friendship Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Friendship</span>
                        <span className="font-mono">{rel.friendship}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div style={{ width: `${rel.friendship}%` }} className="h-full bg-emerald-400" />
                      </div>
                    </div>

                    {/* Romance Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Romance</span>
                        <span className="font-mono">{rel.romance}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div style={{ width: `${rel.romance}%` }} className="h-full bg-pink-500" />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          sound.playSimlish('happy');
                          onCallNPC(npc.id);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={() => {
                          sound.playSimlish('flirty');
                          onInviteNPC(npc.id);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Heart className="w-3 h-3 text-pink-400" />
                        <span>Hang Out</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* APP 5: TOWN GPS QUICK-TRAVEL */}
          {activeApp === 'map' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Travel Destinations
              </h4>
              <div className="space-y-2">
                {travelDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => {
                      sound.playClick(500);
                      onTravelTo(dest.name, dest.coords);
                    }}
                    className="w-full p-3 text-left rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {dest.name}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight">{dest.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
