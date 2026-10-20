import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  CharacterAppearance,
  GameTime,
  Gender,
  LifeAspiration,
  MoodType,
  NeedsState,
  NPCData,
  PersonalityTrait,
  PlacedFurniture,
  PlayerSaveData,
  WeatherType,
} from './types/game';
import { GameWorld } from './game3d/GameWorld';
import { TitleScreen } from './components/TitleScreen';
import { CharacterCreator } from './components/CharacterCreator';
import { GameHUD } from './components/GameHUD';
import { SmartphoneModal } from './components/SmartphoneModal';
import { InteractionRadial } from './components/InteractionRadial';
import { BuildModeUI } from './components/BuildModeUI';
import { sound } from './services/soundSynth';
import {
  clearSave,
  DEFAULT_PLAYER_SAVE,
  hasSavedGame,
  loadGame,
  saveGame,
} from './services/storage';
import { CatalogItem, SEED_NPCS } from './services/careersData';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<GameWorld | null>(null);

  // High-level App Screens
  const [screen, setScreen] = useState<'title' | 'cas' | 'playing'>('title');
  const [hasSave, setHasSave] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Player Game Data State
  const [playerData, setPlayerData] = useState<PlayerSaveData>(() => loadGame());

  // Interactive Overlays
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [isBuildMode, setIsBuildMode] = useState<boolean>(false);
  const [activeGhostItem, setActiveGhostItem] = useState<CatalogItem | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<PlacedFurniture | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPCData | null>(null);
  const [activeWeather, setActiveWeather] = useState<WeatherType>('sunny');

  // Check saved game presence on mount
  useEffect(() => {
    setHasSave(hasSavedGame());
  }, []);

  // Compute Active Mood from Needs
  const computeMood = useCallback((needs: NeedsState): MoodType => {
    if (needs.energy < 20) return 'Tired';
    if (needs.hunger < 20) return 'Hungry';
    if (needs.hygiene < 20 || needs.bladder < 20) return 'Uncomfortable';
    if (needs.social < 20) return 'Lonely';
    if (needs.romance >= 75) return 'Flirty';
    if (needs.fun >= 85 && needs.energy >= 70) return 'Ecstatic';
    if (needs.hunger >= 65 && needs.energy >= 60 && needs.hygiene >= 60) return 'Happy';
    return 'Fine';
  }, []);

  const currentMood = computeMood(playerData.needs);

  // Initialize Three.js Game World when entering 'playing' screen
  useEffect(() => {
    if (screen !== 'playing') {
      if (worldRef.current) {
        worldRef.current.dispose();
        worldRef.current = null;
      }
      return;
    }

    if (!mountRef.current) return;

    const world = new GameWorld(mountRef.current, {
      onSelectObject: (furn) => {
        if (isBuildMode) return;
        sound.playClick(480);
        setSelectedFurniture(furn);
        setSelectedNPC(null);
      },
      onSelectNPC: (npc) => {
        if (isBuildMode) return;
        sound.playSimlish('happy');
        setSelectedNPC(npc);
        setSelectedFurniture(null);
      },
      onFootstep: () => {
        sound.playFootstep();
      },
      onTapGround: () => {
        // Close modals on ground tap
        setSelectedFurniture(null);
        setSelectedNPC(null);
      },
    });

    world.setPlayer(playerData.appearance, playerData.playerPosition);
    world.updateFurniture(playerData.placedFurniture);
    world.setNPCs(SEED_NPCS);
    world.updateTimeAndWeather(playerData.gameTime, activeWeather);
    worldRef.current = world;

    // Start background music
    sound.startAmbientMusic();

    return () => {
      world.dispose();
      worldRef.current = null;
    };
  }, [screen]);

  // Sync Mood to Plumbob Diamond Color
  useEffect(() => {
    if (!worldRef.current) return;
    let plumbobColor = 0x10B981; // Green
    if (currentMood === 'Flirty') plumbobColor = 0xF43F5E; // Pink
    else if (currentMood === 'Ecstatic') plumbobColor = 0x06B6D4; // Cyan
    else if (currentMood === 'Tired' || currentMood === 'Hungry') plumbobColor = 0xF59E0B; // Amber
    else if (currentMood === 'Uncomfortable') plumbobColor = 0xEF4444; // Red
    worldRef.current.setPlumbobMood(plumbobColor);
  }, [currentMood]);

  // Simulation Clock & Needs Decay Tick Loop
  useEffect(() => {
    if (screen !== 'playing') return;
    const speed = playerData.gameTime.speed;
    if (speed === 0) return; // Paused

    const intervalMs = speed === 3 ? 350 : speed === 2 ? 700 : 1200;

    const timer = setInterval(() => {
      setPlayerData((prev) => {
        let newMin = prev.gameTime.minute + 5;
        let newHour = prev.gameTime.hour;
        let newDay = prev.gameTime.day;

        if (newMin >= 60) {
          newMin = 0;
          newHour += 1;
        }
        if (newHour >= 24) {
          newHour = 0;
          newDay += 1;
        }

        // Weather check based on hour
        let nextWeather: WeatherType = 'sunny';
        if (newHour >= 18 && newHour < 21) nextWeather = 'sunset';
        else if (newHour >= 21 || newHour < 6) nextWeather = 'clear_night';
        else if (newHour === 14 && newDay % 3 === 0) nextWeather = 'rainy'; // occasional rain showers

        setActiveWeather(nextWeather);

        // Needs gentle decay over time
        const newNeeds: NeedsState = {
          hunger: Math.max(0, prev.needs.hunger - 0.45),
          energy: Math.max(0, prev.needs.energy - 0.35),
          hygiene: Math.max(0, prev.needs.hygiene - 0.3),
          bladder: Math.max(0, prev.needs.bladder - 0.5),
          fun: Math.max(0, prev.needs.fun - 0.4),
          social: Math.max(0, prev.needs.social - 0.3),
          romance: Math.max(0, prev.needs.romance - 0.2),
          fitness: Math.max(0, prev.needs.fitness - 0.2),
        };

        const updated = {
          ...prev,
          gameTime: {
            ...prev.gameTime,
            day: newDay,
            hour: newHour,
            minute: newMin,
          },
          needs: newNeeds,
        };

        // Update 3D World sky/sun
        if (worldRef.current) {
          worldRef.current.updateTimeAndWeather(updated.gameTime, nextWeather);
        }

        return updated;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [screen, playerData.gameTime.speed]);

  // Persistent Auto-Save every 12 seconds
  useEffect(() => {
    if (screen !== 'playing') return;
    const saveTimer = setInterval(() => {
      saveGame(playerData);
    }, 12000);
    return () => clearInterval(saveTimer);
  }, [screen, playerData]);

  // Virtual Joystick Movement Handler
  const handleJoystickMove = useCallback((vec: { x: number; y: number }) => {
    if (worldRef.current) {
      worldRef.current.joystickVector = vec;
    }
  }, []);

  // Audio Toggle
  const handleToggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  }, [isMuted]);

  // Build Mode Select Catalog Item
  const handleSelectCatalogItem = (item: CatalogItem) => {
    setActiveGhostItem(item);
    const mockPlaced: PlacedFurniture = {
      id: `custom_${Date.now()}`,
      catalogId: item.id,
      name: item.name,
      category: item.category,
      position: [0, 0, 0],
      rotationY: 0,
      price: item.price,
      needRestores: item.needRestores,
    };
    if (worldRef.current) {
      worldRef.current.setBuildMode(true, mockPlaced);
    }
  };

  // Build Mode Confirm Placement
  const handleConfirmPlacement = () => {
    if (!activeGhostItem || !worldRef.current) return;
    const transform = worldRef.current.getBuildGhostTransform();
    if (!transform) return;

    if (playerData.wallet < activeGhostItem.price) return;

    const newPlaced: PlacedFurniture = {
      id: `furniture_${Date.now()}`,
      catalogId: activeGhostItem.id,
      name: activeGhostItem.name,
      category: activeGhostItem.category,
      position: transform.position,
      rotationY: transform.rotationY,
      price: activeGhostItem.price,
      needRestores: activeGhostItem.needRestores,
    };

    const nextFurnitureList = [...playerData.placedFurniture, newPlaced];
    const nextWallet = playerData.wallet - activeGhostItem.price;

    setPlayerData((prev) => ({
      ...prev,
      wallet: nextWallet,
      placedFurniture: nextFurnitureList,
    }));

    worldRef.current.updateFurniture(nextFurnitureList);
    setActiveGhostItem(null);
    worldRef.current.setBuildMode(true); // remain in build mode
  };

  // Build Mode Rotate Item
  const handleRotateBuildGhost = () => {
    if (worldRef.current) {
      worldRef.current.rotateBuildGhost();
    }
  };

  // Build Mode Cancel Placement
  const handleCancelPlacement = () => {
    setActiveGhostItem(null);
    if (worldRef.current) {
      worldRef.current.setBuildMode(true);
    }
  };

  // Build Mode Toggle
  const handleToggleBuildMode = () => {
    const next = !isBuildMode;
    setIsBuildMode(next);
    setActiveGhostItem(null);
    if (worldRef.current) {
      worldRef.current.setBuildMode(next);
    }
  };

  // Furniture Action Execution (e.g. Snack, Shower, Nap)
  const handlePerformAction = (
    actionName: string,
    needDeltas: Record<string, number>,
    cashDelta: number = 0
  ) => {
    setPlayerData((prev) => {
      const nextNeeds: NeedsState = { ...prev.needs };
      (Object.keys(needDeltas) as (keyof NeedsState)[]).forEach((k) => {
        if (nextNeeds[k] !== undefined) {
          nextNeeds[k] = Math.min(100, Math.max(0, nextNeeds[k] + needDeltas[k]!));
        }
      });

      return {
        ...prev,
        wallet: Math.max(0, prev.wallet + cashDelta),
        needs: nextNeeds,
      };
    });
    setSelectedFurniture(null);
  };

  // Social Action Execution on NPC
  const handlePerformSocialAction = (
    actionType: 'chat' | 'joke' | 'flirt' | 'kiss' | 'date' | 'propose' | 'move_in'
  ) => {
    if (!selectedNPC) return;
    const npcId = selectedNPC.id;

    setPlayerData((prev) => {
      const rel = prev.relationships[npcId] || {
        npcId,
        friendship: 10,
        romance: 0,
        status: 'Acquaintance' as const,
        lastInteractionTime: Date.now(),
        interactionsCount: 0,
      };

      let friendshipDelta = 0;
      let romanceDelta = 0;
      let newStatus = rel.status;

      switch (actionType) {
        case 'chat':
          friendshipDelta = 12;
          break;
        case 'joke':
          friendshipDelta = 18;
          break;
        case 'flirt':
          romanceDelta = 18;
          if (rel.romance > 40 && newStatus === 'Acquaintance') newStatus = 'Crush';
          break;
        case 'kiss':
          romanceDelta = 25;
          newStatus = 'Dating';
          break;
        case 'date':
          romanceDelta = 20;
          friendshipDelta = 15;
          break;
        case 'propose':
          romanceDelta = 35;
          newStatus = 'Spouse';
          break;
      }

      const updatedRel = {
        ...rel,
        friendship: Math.min(100, rel.friendship + friendshipDelta),
        romance: Math.min(100, rel.romance + romanceDelta),
        status: newStatus,
        interactionsCount: rel.interactionsCount + 1,
      };

      return {
        ...prev,
        relationships: {
          ...prev.relationships,
          [npcId]: updatedRel,
        },
        needs: {
          ...prev.needs,
          social: Math.min(100, prev.needs.social + 20),
          fun: Math.min(100, prev.needs.fun + 15),
          romance: Math.min(100, prev.needs.romance + (romanceDelta > 0 ? 25 : 0)),
        },
      };
    });

    setSelectedNPC(null);
  };

  // Quick Travel via Map
  const handleTravelTo = (locationName: string, coords: [number, number, number]) => {
    if (worldRef.current) {
      worldRef.current.teleportPlayer(coords);
    }
    setPlayerData((prev) => ({
      ...prev,
      currentLocationName: locationName,
      playerPosition: coords,
    }));
    setShowPhone(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* 3D WebGL Canvas Viewport Container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 z-0" />

      {/* 1. TITLE SCREEN */}
      {screen === 'title' && (
        <TitleScreen
          onStartNewGame={() => {
            clearSave();
            setPlayerData(DEFAULT_PLAYER_SAVE);
            setScreen('cas');
          }}
          onContinueGame={() => {
            setScreen('playing');
          }}
          hasSave={hasSave}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenCAS={() => setScreen('cas')}
        />
      )}

      {/* 2. CHARACTER CREATOR (CAS) */}
      {screen === 'cas' && (
        <CharacterCreator
          initialAppearance={playerData.appearance}
          initialName={playerData.name}
          initialTraits={playerData.traits}
          initialAspiration={playerData.aspiration}
          onFinish={(name, appearance, traits, aspiration) => {
            const updated: PlayerSaveData = {
              ...DEFAULT_PLAYER_SAVE,
              name,
              appearance,
              traits,
              aspiration,
            };
            setPlayerData(updated);
            saveGame(updated);
            setHasSave(true);
            setScreen('playing');
          }}
          onCancel={hasSave ? () => setScreen('title') : undefined}
        />
      )}

      {/* 3. ACTIVE GAME HUD (when playing) */}
      {screen === 'playing' && !isBuildMode && (
        <GameHUD
          gameTime={playerData.gameTime}
          weather={activeWeather}
          wallet={playerData.wallet}
          mood={currentMood}
          needs={playerData.needs}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onSetSpeed={(speed) => {
            setPlayerData((prev) => ({
              ...prev,
              gameTime: { ...prev.gameTime, speed },
            }));
          }}
          onOpenPhone={() => setShowPhone(true)}
          onToggleBuildMode={handleToggleBuildMode}
          isBuildMode={isBuildMode}
          onJoystickMove={handleJoystickMove}
          onZoomIn={() => worldRef.current?.adjustZoom(-0.15)}
          onZoomOut={() => worldRef.current?.adjustZoom(0.15)}
          onRotateCamLeft={() => worldRef.current?.rotateCamera(0.25)}
          onRotateCamRight={() => worldRef.current?.rotateCamera(-0.25)}
        />
      )}

      {/* 4. SIMS BUILD MODE UI */}
      {screen === 'playing' && isBuildMode && (
        <BuildModeUI
          wallet={playerData.wallet}
          placedFurniture={playerData.placedFurniture}
          onSelectCatalogItem={handleSelectCatalogItem}
          onRotateItem={handleRotateBuildGhost}
          onConfirmPlacement={handleConfirmPlacement}
          onCancelPlacement={handleCancelPlacement}
          onSellFurniture={(id, refund) => {
            const nextList = playerData.placedFurniture.filter((f) => f.id !== id);
            setPlayerData((prev) => ({
              ...prev,
              wallet: prev.wallet + refund,
              placedFurniture: nextList,
            }));
            worldRef.current?.updateFurniture(nextList);
          }}
          onExitBuildMode={handleToggleBuildMode}
          activeGhostItem={activeGhostItem}
        />
      )}

      {/* 5. IN-GAME SMARTPHONE MODAL */}
      {showPhone && (
        <SmartphoneModal
          playerData={playerData}
          onClose={() => setShowPhone(false)}
          onApplyCareer={(careerId) => {
            setPlayerData((prev) => ({
              ...prev,
              career: {
                careerId,
                level: 1,
                performance: 50,
                atWork: false,
                daysWorked: 0,
              },
            }));
          }}
          onPromoteCareer={() => {
            setPlayerData((prev) => ({
              ...prev,
              career: {
                ...prev.career,
                level: Math.min(5, prev.career.level + 1),
                performance: 40,
              },
            }));
          }}
          onGoToWork={() => {
            // Payout salary & slight energy decay
            const track = playerData.career.careerId;
            const salary = 250 * playerData.career.level;
            setPlayerData((prev) => ({
              ...prev,
              wallet: prev.wallet + salary,
              needs: {
                ...prev.needs,
                energy: Math.max(0, prev.needs.energy - 20),
                hunger: Math.max(0, prev.needs.hunger - 15),
              },
              career: {
                ...prev.career,
                performance: Math.min(100, prev.career.performance + 15),
                daysWorked: prev.career.daysWorked + 1,
              },
            }));
          }}
          onPayBills={() => {
            setPlayerData((prev) => ({
              ...prev,
              wallet: Math.max(0, prev.wallet - 200),
            }));
          }}
          onInvest={(amount) => {
            setPlayerData((prev) => ({
              ...prev,
              wallet: Math.max(0, prev.wallet - amount),
            }));
          }}
          onBuyVehicle={(vehicle, price) => {
            setPlayerData((prev) => ({
              ...prev,
              wallet: Math.max(0, prev.wallet - price),
              ownedVehicles: [...prev.ownedVehicles, vehicle],
            }));
          }}
          onCallNPC={(npcId) => {
            sound.playSimlish('happy');
            setPlayerData((prev) => ({
              ...prev,
              needs: {
                ...prev.needs,
                social: Math.min(100, prev.needs.social + 25),
              },
            }));
          }}
          onInviteNPC={(npcId) => {
            sound.playSimlish('flirty');
            const targetNPC = SEED_NPCS.find((n) => n.id === npcId);
            if (targetNPC) {
              setSelectedNPC(targetNPC);
              setShowPhone(false);
            }
          }}
          onTravelTo={handleTravelTo}
        />
      )}

      {/* 6. CONTEXTUAL RADIAL / INTERACTION MODAL (When tapping an object or NPC) */}
      {(selectedFurniture || selectedNPC) && (
        <InteractionRadial
          furniture={selectedFurniture}
          npc={selectedNPC}
          onClose={() => {
            setSelectedFurniture(null);
            setSelectedNPC(null);
          }}
          onPerformAction={handlePerformAction}
          onPerformSocialAction={handlePerformSocialAction}
        />
      )}
    </div>
  );
}
