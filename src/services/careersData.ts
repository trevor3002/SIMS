import { CareerTrack, NPCData, PlacedFurniture } from '../types/game';

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'office',
    name: 'Corporate & Tech',
    description: 'Climb from junior clerk to Chief Executive Officer of Pacific Bay Corp.',
    icon: 'Briefcase',
    levels: [
      { title: 'Data Entry Clerk', salary: 140, shiftStartHour: 9, shiftEndHour: 17, requiredSkill: 'Charisma', requiredSkillLevel: 1 },
      { title: 'Operations Analyst', salary: 260, shiftStartHour: 9, shiftEndHour: 17, requiredSkill: 'Logic', requiredSkillLevel: 2 },
      { title: 'Project Lead', salary: 420, shiftStartHour: 8, shiftEndHour: 16, requiredSkill: 'Charisma', requiredSkillLevel: 4 },
      { title: 'Vice President', salary: 780, shiftStartHour: 10, shiftEndHour: 18, requiredSkill: 'Leadership', requiredSkillLevel: 6 },
      { title: 'Chief Executive Officer', salary: 1500, shiftStartHour: 10, shiftEndHour: 16, requiredSkill: 'Business', requiredSkillLevel: 8 },
    ]
  },
  {
    id: 'chef',
    name: 'Culinary Arts',
    description: 'Sizzle your way from dishwasher to Michelin 3-Star Executive Chef.',
    icon: 'Utensils',
    levels: [
      { title: 'Kitchen Porter', salary: 120, shiftStartHour: 16, shiftEndHour: 23, requiredSkill: 'Cooking', requiredSkillLevel: 1 },
      { title: 'Line Cook', salary: 220, shiftStartHour: 15, shiftEndHour: 23, requiredSkill: 'Cooking', requiredSkillLevel: 3 },
      { title: 'Sous Chef', salary: 380, shiftStartHour: 14, shiftEndHour: 22, requiredSkill: 'Cooking', requiredSkillLevel: 5 },
      { title: 'Head Chef', salary: 650, shiftStartHour: 14, shiftEndHour: 22, requiredSkill: 'Gourmet', requiredSkillLevel: 7 },
      { title: 'Celebrity Restaurateur', salary: 1350, shiftStartHour: 18, shiftEndHour: 23, requiredSkill: 'Gourmet', requiredSkillLevel: 9 },
    ]
  },
  {
    id: 'dj',
    name: 'Music & Nightlife DJ',
    description: 'Drop infectious beats and headline the Sunset Beach Festival.',
    icon: 'Music',
    levels: [
      { title: 'Pub DJ', salary: 150, shiftStartHour: 20, shiftEndHour: 2, requiredSkill: 'Creativity', requiredSkillLevel: 1 },
      { title: 'Club Resident', salary: 300, shiftStartHour: 22, shiftEndHour: 4, requiredSkill: 'Mixology', requiredSkillLevel: 3 },
      { title: 'Studio Producer', salary: 520, shiftStartHour: 14, shiftEndHour: 21, requiredSkill: 'Creativity', requiredSkillLevel: 5 },
      { title: 'Festival Headliner', salary: 950, shiftStartHour: 21, shiftEndHour: 3, requiredSkill: 'Performance', requiredSkillLevel: 7 },
      { title: 'International Music Icon', salary: 1800, shiftStartHour: 22, shiftEndHour: 2, requiredSkill: 'Superstar', requiredSkillLevel: 9 },
    ]
  },
  {
    id: 'trainer',
    name: 'Fitness & Athletics',
    description: 'Inspire clients to hit their peak physique and open your own gym chain.',
    icon: 'Dumbbell',
    levels: [
      { title: 'Gym Floor Attendant', salary: 130, shiftStartHour: 6, shiftEndHour: 14, requiredSkill: 'Fitness', requiredSkillLevel: 1 },
      { title: 'Personal Trainer', salary: 280, shiftStartHour: 7, shiftEndHour: 15, requiredSkill: 'Fitness', requiredSkillLevel: 3 },
      { title: 'Group Bootcamp Coach', salary: 450, shiftStartHour: 8, shiftEndHour: 16, requiredSkill: 'Charisma', requiredSkillLevel: 5 },
      { title: 'Elite Athlete Trainer', salary: 720, shiftStartHour: 9, shiftEndHour: 15, requiredSkill: 'Fitness', requiredSkillLevel: 7 },
      { title: 'Fitness Mogul', salary: 1400, shiftStartHour: 10, shiftEndHour: 14, requiredSkill: 'Empire', requiredSkillLevel: 8 },
    ]
  },
  {
    id: 'creator',
    name: 'Content Creator & Streamer',
    description: 'Grow your subscriber army from bedroom vlogging to global media fame.',
    icon: 'Video',
    levels: [
      { title: 'Micro Influencer', salary: 110, shiftStartHour: 12, shiftEndHour: 18, requiredSkill: 'Charisma', requiredSkillLevel: 1 },
      { title: 'Sponsored Streamer', salary: 250, shiftStartHour: 14, shiftEndHour: 20, requiredSkill: 'Gaming', requiredSkillLevel: 3 },
      { title: 'Viral Trendsetter', salary: 480, shiftStartHour: 13, shiftEndHour: 19, requiredSkill: 'Charisma', requiredSkillLevel: 5 },
      { title: 'Channel Network Owner', salary: 850, shiftStartHour: 12, shiftEndHour: 17, requiredSkill: 'Media', requiredSkillLevel: 7 },
      { title: 'Global Pop-Culture Icon', salary: 1750, shiftStartHour: 13, shiftEndHour: 16, requiredSkill: 'Fame', requiredSkillLevel: 9 },
    ]
  },
  {
    id: 'logistics',
    name: 'Freight & Supply Chain',
    description: 'Coordinate harbor shipping, global air fleets, and transport logistics.',
    icon: 'Truck',
    levels: [
      { title: 'Dock Warehouse Worker', salary: 160, shiftStartHour: 7, shiftEndHour: 15, requiredSkill: 'Strength', requiredSkillLevel: 1 },
      { title: 'Fleet Route Dispatcher', salary: 270, shiftStartHour: 8, shiftEndHour: 16, requiredSkill: 'Logic', requiredSkillLevel: 3 },
      { title: 'Harbor Operations Manager', salary: 460, shiftStartHour: 8, shiftEndHour: 16, requiredSkill: 'Management', requiredSkillLevel: 5 },
      { title: 'Regional Supply Director', salary: 760, shiftStartHour: 9, shiftEndHour: 17, requiredSkill: 'Logistics', requiredSkillLevel: 7 },
      { title: 'Global Shipping Baron', salary: 1450, shiftStartHour: 10, shiftEndHour: 15, requiredSkill: 'Trade', requiredSkillLevel: 8 },
    ]
  },
  {
    id: 'mechanic',
    name: 'Automotive Engineering',
    description: 'Tune classic roadsters, repair coastal supercars, and build race prototypes.',
    icon: 'Wrench',
    levels: [
      { title: 'Lube Tech & Apprentice', salary: 150, shiftStartHour: 8, shiftEndHour: 16, requiredSkill: 'Handiness', requiredSkillLevel: 1 },
      { title: 'Certified Mechanic', salary: 290, shiftStartHour: 8, shiftEndHour: 16, requiredSkill: 'Handiness', requiredSkillLevel: 3 },
      { title: 'Master Tuner & Specialist', salary: 500, shiftStartHour: 9, shiftEndHour: 17, requiredSkill: 'Mechanical', requiredSkillLevel: 5 },
      { title: 'Race Pit Crew Chief', salary: 820, shiftStartHour: 10, shiftEndHour: 18, requiredSkill: 'Engineering', requiredSkillLevel: 7 },
      { title: 'Hypercar Atelier Founder', salary: 1600, shiftStartHour: 11, shiftEndHour: 16, requiredSkill: 'Design', requiredSkillLevel: 9 },
    ]
  },
  {
    id: 'entrepreneur',
    name: 'Startup Founder & Venture',
    description: 'Disrupt markets, pitch venture capital, and build high-growth companies.',
    icon: 'TrendingUp',
    levels: [
      { title: 'Bootstrapped Hacker', salary: 100, shiftStartHour: 10, shiftEndHour: 19, requiredSkill: 'Logic', requiredSkillLevel: 1 },
      { title: 'Seed-Stage Founder', salary: 240, shiftStartHour: 10, shiftEndHour: 19, requiredSkill: 'Charisma', requiredSkillLevel: 3 },
      { title: 'Series A Venture CEO', salary: 550, shiftStartHour: 10, shiftEndHour: 18, requiredSkill: 'Business', requiredSkillLevel: 5 },
      { title: 'Unicorn Tech Founder', salary: 1100, shiftStartHour: 11, shiftEndHour: 17, requiredSkill: 'Strategy', requiredSkillLevel: 7 },
      { title: 'Venture Capital Chairman', salary: 2100, shiftStartHour: 12, shiftEndHour: 16, requiredSkill: 'Empire', requiredSkillLevel: 9 },
    ]
  }
];

// Furniture Catalog available in Build Mode
export interface CatalogItem {
  id: string;
  name: string;
  category: 'comfort' | 'surfaces' | 'appliances' | 'plumbing' | 'electronics' | 'decor';
  price: number;
  description: string;
  needRestores: {
    energy?: number;
    hunger?: number;
    hygiene?: number;
    bladder?: number;
    fun?: number;
    social?: number;
    fitness?: number;
  };
  dimensions: [number, number, number]; // width, height, depth in grid units
  icon: string;
}

export const FURNITURE_CATALOG: CatalogItem[] = [
  // Comfort
  {
    id: 'modern_bed',
    name: 'Laguna Queen Bed',
    category: 'comfort',
    price: 850,
    description: 'Luxurious plush memory foam mattress with oak timber frame.',
    needRestores: { energy: 75 },
    dimensions: [2, 1, 2.4],
    icon: 'Bed'
  },
  {
    id: 'velvet_sofa',
    name: 'Riviera 3-Seat Sofa',
    category: 'comfort',
    price: 620,
    description: 'Emerald green velvet sofa with rounded arms and brushed brass legs.',
    needRestores: { energy: 25, fun: 20 },
    dimensions: [2.6, 0.9, 1.2],
    icon: 'Armchair'
  },
  {
    id: 'lounge_chair',
    name: 'Acapulco Accent Chair',
    category: 'comfort',
    price: 320,
    description: 'Sleek woven design perfect for reading or relaxing with seaside views.',
    needRestores: { energy: 15, fun: 15 },
    dimensions: [1.2, 0.9, 1.2],
    icon: 'Sun'
  },
  // Surfaces
  {
    id: 'dining_table',
    name: 'Nordic Oak Dining Table',
    category: 'surfaces',
    price: 480,
    description: 'Solid white-oak tabletop with matte black steel hairpin legs.',
    needRestores: { hunger: 10 },
    dimensions: [2, 0.8, 1.2],
    icon: 'Table'
  },
  {
    id: 'work_desk',
    name: 'Minimalist Studio Desk',
    category: 'surfaces',
    price: 390,
    description: 'Clean workspace equipped with wire channels and warm wooden finish.',
    needRestores: { fun: 10 },
    dimensions: [1.8, 0.8, 1],
    icon: 'Laptop'
  },
  // Appliances & Kitchen
  {
    id: 'retro_fridge',
    name: 'Smeg-Style Coastal Fridge',
    category: 'appliances',
    price: 950,
    description: 'Chic seafoam refrigerator stocked with organic snacks and fresh drinks.',
    needRestores: { hunger: 80 },
    dimensions: [1, 1.9, 1],
    icon: 'Refrigerator'
  },
  {
    id: 'chef_stove',
    name: 'Professional Gas Stove',
    category: 'appliances',
    price: 780,
    description: 'Four high-power cast iron burners and an electric convection oven.',
    needRestores: { hunger: 60, fun: 15 },
    dimensions: [1.2, 1, 1],
    icon: 'Flame'
  },
  {
    id: 'espresso_machine',
    name: 'Italian Barista Machine',
    category: 'appliances',
    price: 350,
    description: 'Brew double-shot velvety espressos for an immediate energy boost.',
    needRestores: { energy: 45, fun: 20 },
    dimensions: [0.8, 0.6, 0.8],
    icon: 'Coffee'
  },
  // Plumbing
  {
    id: 'rainfall_shower',
    name: 'Glass Rainfall Shower',
    category: 'plumbing',
    price: 920,
    description: 'Frameless glass enclosure with warm, cascading overhead rainfall.',
    needRestores: { hygiene: 90, energy: 15 },
    dimensions: [1.4, 2.2, 1.4],
    icon: 'Droplets'
  },
  {
    id: 'porcelain_toilet',
    name: 'Smart Ceramic Toilet',
    category: 'plumbing',
    price: 380,
    description: 'Dual-flush hygienic toilet with heated seat and silent close.',
    needRestores: { bladder: 100 },
    dimensions: [0.8, 0.9, 1],
    icon: 'Check'
  },
  // Electronics
  {
    id: 'oled_tv',
    name: '65" Ultra OLED Smart TV',
    category: 'electronics',
    price: 1100,
    description: 'Stunning 4K display for watching comedies, movies, or gaming.',
    needRestores: { fun: 80 },
    dimensions: [2, 1.2, 0.4],
    icon: 'Tv'
  },
  {
    id: 'gaming_rig',
    name: 'High-End Gaming PC',
    category: 'electronics',
    price: 1450,
    description: 'Water-cooled gaming setup with RGB illumination and dual monitors.',
    needRestores: { fun: 90, social: 20 },
    dimensions: [1.6, 1.1, 1],
    icon: 'Monitor'
  },
  // Decor & Fitness
  {
    id: 'gym_weights',
    name: 'Olympic Weight Bench',
    category: 'decor',
    price: 520,
    description: 'Heavy-duty steel bench with barbell and calibrated plates.',
    needRestores: { fitness: 75, energy: -20, hygiene: -25 },
    dimensions: [1.4, 1.2, 1.8],
    icon: 'Dumbbell'
  },
  {
    id: 'ficus_plant',
    name: 'Potted Ficus Lyrata',
    category: 'decor',
    price: 120,
    description: 'Lush architectural indoor plant in a clean terracotta pot.',
    needRestores: { fun: 15 },
    dimensions: [0.8, 1.6, 0.8],
    icon: 'Flower2'
  },
  {
    id: 'arc_floor_lamp',
    name: 'Brushed Brass Arc Lamp',
    category: 'decor',
    price: 240,
    description: 'Sweeping contemporary floor lamp providing warm ambient glow.',
    needRestores: { fun: 10 },
    dimensions: [0.8, 2.1, 1.2],
    icon: 'Lamp'
  }
];

// Initial Starter Apartment Furniture Setup
export const INITIAL_STARTER_FURNITURE: PlacedFurniture[] = [
  {
    id: 'starter_bed_1',
    catalogId: 'modern_bed',
    name: 'Laguna Queen Bed',
    category: 'comfort',
    position: [-3.5, 0, -2.5],
    rotationY: 0,
    price: 850,
    needRestores: { energy: 75 }
  },
  {
    id: 'starter_sofa_1',
    catalogId: 'velvet_sofa',
    name: 'Riviera 3-Seat Sofa',
    category: 'comfort',
    position: [2.5, 0, -2.5],
    rotationY: 0,
    price: 620,
    needRestores: { energy: 25, fun: 20 }
  },
  {
    id: 'starter_tv_1',
    catalogId: 'oled_tv',
    name: '65" Ultra OLED Smart TV',
    category: 'electronics',
    position: [2.5, 0, -5],
    rotationY: Math.PI,
    price: 1100,
    needRestores: { fun: 80 }
  },
  {
    id: 'starter_fridge_1',
    catalogId: 'retro_fridge',
    name: 'Smeg-Style Coastal Fridge',
    category: 'appliances',
    position: [-4.2, 0, 3],
    rotationY: Math.PI * 0.5,
    price: 950,
    needRestores: { hunger: 80 }
  },
  {
    id: 'starter_stove_1',
    catalogId: 'chef_stove',
    name: 'Professional Gas Stove',
    category: 'appliances',
    position: [-2.5, 0, 4.2],
    rotationY: Math.PI,
    price: 780,
    needRestores: { hunger: 60, fun: 15 }
  },
  {
    id: 'starter_shower_1',
    catalogId: 'rainfall_shower',
    name: 'Glass Rainfall Shower',
    category: 'plumbing',
    position: [4, 0, 3.5],
    rotationY: 0,
    price: 920,
    needRestores: { hygiene: 90, energy: 15 }
  },
  {
    id: 'starter_toilet_1',
    catalogId: 'porcelain_toilet',
    name: 'Smart Ceramic Toilet',
    category: 'plumbing',
    position: [2.2, 0, 4.2],
    rotationY: Math.PI,
    price: 380,
    needRestores: { bladder: 100 }
  },
  {
    id: 'starter_plant_1',
    catalogId: 'ficus_plant',
    name: 'Potted Ficus Lyrata',
    category: 'decor',
    position: [-1, 0, -4.5],
    rotationY: 0,
    price: 120,
    needRestores: { fun: 15 }
  }
];

// Autonomous Neighborhood NPCs
export const SEED_NPCS: NPCData[] = [
  {
    id: 'npc_maya',
    name: 'Maya Lin',
    gender: 'female',
    ageGroup: 'Young Adult',
    appearance: {
      gender: 'female',
      skinTone: '#E0AC69',
      hairStyle: 'long_wavy',
      hairColor: '#1C1917',
      eyeColor: '#451A03',
      topStyle: 'casual_tee',
      topColor: '#EC4899',
      bottomStyle: 'jeans',
      bottomColor: '#1E3A8A',
      shoesColor: '#FFFFFF',
      accessories: 'sunglasses',
      bodyScale: 0.98
    },
    traits: ['Creative', 'Romantic', 'Outgoing'],
    career: 'Music & DJ Producer',
    homeLocation: 'Sunset Beach Lofts',
    favoriteSpot: 'beach',
    routine: [
      { hour: 9, location: [18, 0, -12], actionName: 'Sunbathing on Beach' },
      { hour: 13, location: [12, 0, 8], actionName: 'Sipping Latte at Palm Café' },
      { hour: 18, location: [24, 0, 16], actionName: 'DJ Rehearsal at Club' },
      { hour: 22, location: [0, 0, 0], actionName: 'Sleeping at Home' }
    ],
    dialoguePreferences: {
      likesFlirting: true,
      likesHumor: true,
      likesFitness: false,
      likesIntellect: false
    }
  },
  {
    id: 'npc_marcus',
    name: 'Marcus Vance',
    gender: 'male',
    ageGroup: 'Young Adult',
    appearance: {
      gender: 'male',
      skinTone: '#8D5524',
      hairStyle: 'buzz',
      hairColor: '#0A0A0A',
      eyeColor: '#262626',
      topStyle: 'tank',
      topColor: '#0284C7',
      bottomStyle: 'shorts',
      bottomColor: '#18181B',
      shoesColor: '#3B82F6',
      accessories: 'none',
      bodyScale: 1.08
    },
    traits: ['Fit', 'Ambitious', 'Charismatic'],
    career: 'Head Trainer at Pacific Gym',
    homeLocation: 'Marina View Apartments',
    favoriteSpot: 'gym',
    routine: [
      { hour: 7, location: [-18, 0, 14], actionName: 'Lifting Weights at Gym' },
      { hour: 12, location: [12, 0, 8], actionName: 'Protein Shake at Café' },
      { hour: 16, location: [20, 0, -8], actionName: 'Jogging along Coastal Boardwalk' },
      { hour: 21, location: [0, 0, 0], actionName: 'Resting at Home' }
    ],
    dialoguePreferences: {
      likesFlirting: true,
      likesHumor: true,
      likesFitness: true,
      likesIntellect: false
    }
  },
  {
    id: 'npc_chloe',
    name: 'Dr. Chloe Rivera',
    gender: 'female',
    ageGroup: 'Young Adult',
    appearance: {
      gender: 'female',
      skinTone: '#FCD7B8',
      hairStyle: 'bob',
      hairColor: '#B45309',
      eyeColor: '#065F46',
      topStyle: 'blazer',
      topColor: '#475569',
      bottomStyle: 'slacks',
      bottomColor: '#0F172A',
      shoesColor: '#020617',
      accessories: 'glasses',
      bodyScale: 1.0
    },
    traits: ['Genius', 'Ambitious', 'Foodie'],
    career: 'Senior Tech Architect',
    homeLocation: 'Palisades Modernist Villa',
    favoriteSpot: 'cafe',
    routine: [
      { hour: 8, location: [-14, 0, -18], actionName: 'Working at Tech Tower' },
      { hour: 13, location: [12, 0, 8], actionName: 'Lunch Meeting at Café' },
      { hour: 17, location: [0, 0, 20], actionName: 'Reading in Town Plaza' },
      { hour: 21, location: [0, 0, 0], actionName: 'Reading Research Papers' }
    ],
    dialoguePreferences: {
      likesFlirting: false,
      likesHumor: true,
      likesFitness: false,
      likesIntellect: true
    }
  },
  {
    id: 'npc_leo',
    name: 'Leo Thorne',
    gender: 'male',
    ageGroup: 'Young Adult',
    appearance: {
      gender: 'male',
      skinTone: '#E8BEAC',
      hairStyle: 'short_crop',
      hairColor: '#78350F',
      eyeColor: '#1E40AF',
      topStyle: 'casual_tee',
      topColor: '#10B981',
      bottomStyle: 'jeans',
      bottomColor: '#334155',
      shoesColor: '#FFFFFF',
      accessories: 'cap',
      bodyScale: 1.02
    },
    traits: ['Outgoing', 'Lazy', 'Creative'],
    career: 'Indie Game Streamer',
    homeLocation: 'Boardwalk Studios',
    favoriteSpot: 'park',
    routine: [
      { hour: 11, location: [12, 0, 8], actionName: 'Late Breakfast at Café' },
      { hour: 15, location: [0, 0, 18], actionName: 'Skateboarding in Plaza' },
      { hour: 19, location: [22, 0, -14], actionName: 'Chilling on Beach with Guitar' },
      { hour: 23, location: [0, 0, 0], actionName: 'Streaming Video Games' }
    ],
    dialoguePreferences: {
      likesFlirting: true,
      likesHumor: true,
      likesFitness: false,
      likesIntellect: false
    }
  }
];
