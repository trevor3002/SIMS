/**
 * Types & Data Definitions for SimLife 3D: Open World Simulator
 */

export type Gender = 'female' | 'male' | 'nonbinary';

export interface CharacterAppearance {
  gender: Gender;
  skinTone: string;
  hairStyle: 'short_crop' | 'buzz' | 'bob' | 'long_wavy' | 'ponytail' | 'afro' | 'dreads';
  hairColor: string;
  eyeColor: string;
  topStyle: 'casual_tee' | 'hoodie' | 'blazer' | 'tank' | 'swimsuit';
  topColor: string;
  bottomStyle: 'jeans' | 'shorts' | 'slacks' | 'skirt' | 'sweatpants';
  bottomColor: string;
  shoesColor: string;
  accessories: 'none' | 'glasses' | 'sunglasses' | 'headband' | 'cap';
  bodyScale: number; // 0.85 to 1.15
}

export type PersonalityTrait = 
  | 'Ambitious'
  | 'Romantic'
  | 'Outgoing'
  | 'Creative'
  | 'Fit'
  | 'Lazy'
  | 'Genius'
  | 'Foodie'
  | 'Charismatic';

export type LifeAspiration = 
  | 'Tech Mogul'
  | 'Master Chef'
  | 'Social Star'
  | 'Fitness Champion'
  | 'Soulmate Searcher'
  | 'Architect Prodigy';

export interface NeedsState {
  hunger: number;     // 0 - 100
  energy: number;     // 0 - 100
  hygiene: number;    // 0 - 100
  bladder: number;    // 0 - 100
  fun: number;        // 0 - 100
  social: number;     // 0 - 100
  romance: number;    // 0 - 100
  fitness: number;    // 0 - 100
}

export type MoodType = 
  | 'Ecstatic'
  | 'Happy'
  | 'Inspired'
  | 'Flirty'
  | 'Energetic'
  | 'Fine'
  | 'Tired'
  | 'Hungry'
  | 'Uncomfortable'
  | 'Lonely'
  | 'Stressed';

export type CareerId = 
  | 'unemployed'
  | 'office'
  | 'logistics'
  | 'mechanic'
  | 'dj'
  | 'chef'
  | 'trainer'
  | 'entrepreneur'
  | 'creator';

export interface CareerLevel {
  title: string;
  salary: number; // daily salary
  shiftStartHour: number;
  shiftEndHour: number;
  requiredSkill: string;
  requiredSkillLevel: number;
}

export interface CareerTrack {
  id: CareerId;
  name: string;
  description: string;
  icon: string;
  levels: CareerLevel[];
}

export interface PlayerCareerState {
  careerId: CareerId;
  level: number; // 1-based index into levels
  performance: number; // 0 - 100
  atWork: boolean;
  daysWorked: number;
}

export type RelationshipStatus = 
  | 'Stranger'
  | 'Acquaintance'
  | 'Friend'
  | 'Good Friend'
  | 'Best Friend'
  | 'Crush'
  | 'Dating'
  | 'Engaged'
  | 'Spouse';

export interface NPCRelationship {
  npcId: string;
  friendship: number; // 0 - 100
  romance: number;    // 0 - 100
  status: RelationshipStatus;
  lastInteractionTime: number;
  interactionsCount: number;
}

export interface NPCData {
  id: string;
  name: string;
  gender: Gender;
  ageGroup: 'Young Adult' | 'Adult';
  appearance: CharacterAppearance;
  traits: PersonalityTrait[];
  career: string;
  homeLocation: string;
  favoriteSpot: 'beach' | 'cafe' | 'gym' | 'park' | 'club';
  routine: Array<{
    hour: number;
    location: [number, number, number];
    actionName: string;
  }>;
  dialoguePreferences: {
    likesFlirting: boolean;
    likesHumor: boolean;
    likesFitness: boolean;
    likesIntellect: boolean;
  };
}

export interface PlacedFurniture {
  id: string;
  catalogId: string;
  name: string;
  category: 'comfort' | 'surfaces' | 'appliances' | 'plumbing' | 'electronics' | 'decor';
  position: [number, number, number];
  rotationY: number;
  color?: string;
  price: number;
  needRestores?: Partial<NeedsState>;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'food' | 'gadget' | 'clothing' | 'vehicle' | 'book';
  icon: string;
  count: number;
  value: number;
  description: string;
}

export type WeatherType = 'sunny' | 'sunset' | 'rainy' | 'clear_night';

export interface GameTime {
  day: number;
  hour: number;
  minute: number;
  speed: 0 | 1 | 2 | 3; // 0: paused, 1: normal, 2: fast, 3: ultra
}

export interface PlayerSaveData {
  name: string;
  appearance: CharacterAppearance;
  traits: PersonalityTrait[];
  aspiration: LifeAspiration;
  wallet: number;
  needs: NeedsState;
  career: PlayerCareerState;
  relationships: Record<string, NPCRelationship>;
  inventory: InventoryItem[];
  ownedVehicles: string[];
  currentVehicle: 'none' | 'bicycle' | 'car';
  placedFurniture: PlacedFurniture[];
  currentLocationName: string;
  playerPosition: [number, number, number];
  playerRotation: number;
  gameTime: GameTime;
  hasSeenIntro: boolean;
}
