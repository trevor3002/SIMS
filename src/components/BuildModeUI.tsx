import React, { useState } from 'react';
import { CatalogItem, FURNITURE_CATALOG } from '../services/careersData';
import { PlacedFurniture } from '../types/game';
import { sound } from '../services/soundSynth';
import {
  RotateCw,
  Check,
  X,
  Trash2,
  Armchair,
  Table,
  Refrigerator,
  Droplets,
  Tv,
  Flower2,
  DollarSign,
} from 'lucide-react';

interface BuildModeUIProps {
  wallet: number;
  placedFurniture: PlacedFurniture[];
  onSelectCatalogItem: (item: CatalogItem) => void;
  onRotateItem: () => void;
  onConfirmPlacement: () => void;
  onCancelPlacement: () => void;
  onSellFurniture: (id: string, refundPrice: number) => void;
  onExitBuildMode: () => void;
  activeGhostItem: CatalogItem | null;
}

export const BuildModeUI: React.FC<BuildModeUIProps> = ({
  wallet,
  placedFurniture,
  onSelectCatalogItem,
  onRotateItem,
  onConfirmPlacement,
  onCancelPlacement,
  onSellFurniture,
  onExitBuildMode,
  activeGhostItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<CatalogItem['category']>('comfort');
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);

  const categories: { id: CatalogItem['category']; label: string; icon: React.ElementType }[] = [
    { id: 'comfort', label: 'Comfort', icon: Armchair },
    { id: 'surfaces', label: 'Surfaces', icon: Table },
    { id: 'appliances', label: 'Appliances', icon: Refrigerator },
    { id: 'plumbing', label: 'Plumbing', icon: Droplets },
    { id: 'electronics', label: 'Electronics', icon: Tv },
    { id: 'decor', label: 'Decor & Gym', icon: Flower2 },
  ];

  const filteredCatalog = FURNITURE_CATALOG.filter((item) => item.category === activeCategory);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* Top Build Mode Header */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto pointer-events-auto">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-xl">
          <span className="text-xs sm:text-sm uppercase tracking-wider">Sims Build Mode</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-950/20 font-mono">Grid 0.5m</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet */}
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-white/20 text-emerald-400 font-mono font-bold text-sm">
            ${wallet.toLocaleString()}
          </div>

          <button
            onClick={() => {
              sound.playClick(440);
              onExitBuildMode();
            }}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-bold text-xs sm:text-sm shadow-xl transition-colors cursor-pointer"
          >
            Exit Build
          </button>
        </div>
      </div>

      {/* Floating Ghost Placement Controls (when placing an item) */}
      {activeGhostItem && (
        <div className="w-full max-w-xs mx-auto my-auto pointer-events-auto flex items-center justify-center gap-3 p-2 rounded-3xl bg-slate-950/90 border border-amber-400/50 backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-150">
          {/* Rotate Button */}
          <button
            onClick={() => {
              sound.playClick(500);
              onRotateItem();
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            <RotateCw className="w-4 h-4 text-amber-400" />
            <span>Rotate 90°</span>
          </button>

          {/* Confirm Button */}
          <button
            onClick={() => {
              sound.playCashRegister();
              onConfirmPlacement();
            }}
            disabled={wallet < activeGhostItem.price}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Place (${activeGhostItem.price})</span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => {
              sound.playClick(400);
              onCancelPlacement();
            }}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Furniture Catalog Drawer */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto rounded-3xl bg-slate-950/95 border border-white/15 backdrop-blur-md shadow-2xl p-3 sm:p-4 text-white">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                sound.playClick(480);
                setActiveCategory(id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                activeCategory === id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Catalog Items Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 max-h-48 overflow-y-auto">
          {filteredCatalog.map((item) => {
            const canAfford = wallet >= item.price;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick(520);
                  onSelectCatalogItem(item);
                }}
                disabled={!canAfford}
                className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  canAfford
                    ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-amber-400/50'
                    : 'bg-slate-950 border-slate-900 opacity-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{item.description}</div>
                </div>
                <div className="flex items-center justify-between mt-2 font-mono text-xs font-bold text-emerald-400">
                  <span>${item.price}</span>
                  <span className="text-[10px] text-amber-300 font-sans font-semibold">Select →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
