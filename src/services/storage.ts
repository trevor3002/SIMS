import { PlayerSaveData } from '../types/game';
import { INITIAL_STARTER_FURNITURE, SEED_NPCS } from './careersData';

const SAVE_KEY = 'simlife_3d_save_v1';

export const DEFAULT_PLAYER_SAVE: PlayerSaveData = {
  name: 'Alex Rivera',
  appearance: {
    gender: 'female',
    skinTone: '#E0AC69',
    hairStyle: 'long_wavy',
    hairColor: '#3B2219',
    eyeColor: '#2563EB',
    topStyle: 'casual_tee',
    topColor: '#0EA5E9',
    bottomStyle: 'jeans',
    bottomColor: '#1E293B',
    shoesColor: '#FFFFFF',
    accessories: 'sunglasses',
    bodyScale: 1.0
  },
  traits: ['Ambitious', 'Romantic', 'Creative'],
  aspiration: 'Soulmate Searcher',
  wallet: 5000,
  needs: {
    hunger: 85,
    energy: 90,
    hygiene: 90,
    bladder: 95,
    fun: 80,
    social: 75,
    romance: 50,
    fitness: 70
  },
  career: {
    careerId: 'office',
    level: 1,
    performance: 50,
    atWork: false,
    daysWorked: 0
  },
  relationships: {
    npc_maya: {
      npcId: 'npc_maya',
      friendship: 25,
      romance: 10,
      status: 'Acquaintance',
      lastInteractionTime: 0,
      interactionsCount: 1
    },
    npc_marcus: {
      npcId: 'npc_marcus',
      friendship: 15,
      romance: 0,
      status: 'Acquaintance',
      lastInteractionTime: 0,
      interactionsCount: 0
    },
    npc_chloe: {
      npcId: 'npc_chloe',
      friendship: 10,
      romance: 0,
      status: 'Acquaintance',
      lastInteractionTime: 0,
      interactionsCount: 0
    },
    npc_leo: {
      npcId: 'npc_leo',
      friendship: 20,
      romance: 5,
      status: 'Acquaintance',
      lastInteractionTime: 0,
      interactionsCount: 1
    }
  },
  inventory: [
    {
      id: 'phone_standard',
      name: 'SimPhone 15 Pro',
      category: 'gadget',
      icon: 'Smartphone',
      count: 1,
      value: 999,
      description: 'Your portable connection to jobs, banking, and social life.'
    },
    {
      id: 'house_keys',
      name: 'Studio Apartment Keys',
      category: 'gadget',
      icon: 'Key',
      count: 1,
      value: 50,
      description: 'Keys to your starter seaside studio at 104 Ocean Promenade.'
    }
  ],
  ownedVehicles: ['bicycle'],
  currentVehicle: 'none',
  placedFurniture: INITIAL_STARTER_FURNITURE,
  currentLocationName: 'Seaside Studio Apartment',
  playerPosition: [0, 0, 0],
  playerRotation: 0,
  gameTime: {
    day: 1,
    hour: 10,
    minute: 0,
    speed: 1
  },
  hasSeenIntro: false
};

export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function loadGame(): PlayerSaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...DEFAULT_PLAYER_SAVE };
    const parsed = JSON.parse(raw) as Partial<PlayerSaveData>;
    return {
      ...DEFAULT_PLAYER_SAVE,
      ...parsed,
      needs: { ...DEFAULT_PLAYER_SAVE.needs, ...(parsed.needs || {}) },
      career: { ...DEFAULT_PLAYER_SAVE.career, ...(parsed.career || {}) },
      relationships: { ...DEFAULT_PLAYER_SAVE.relationships, ...(parsed.relationships || {}) },
      gameTime: { ...DEFAULT_PLAYER_SAVE.gameTime, ...(parsed.gameTime || {}) }
    };
  } catch {
    return { ...DEFAULT_PLAYER_SAVE };
  }
}

export function saveGame(data: PlayerSaveData): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save game state to localStorage', err);
    return false;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
