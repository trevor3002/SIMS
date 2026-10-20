# Life Simulator: Open World (3D Life Simulation Game)

A high-fidelity, fully playable 3D life simulation game inspired by The Sims, designed mobile-first for iPhone 13 touchscreens with seamless desktop browser support, featuring complete character creation, a vibrant modern coastal suburban neighborhood, deep needs and career economies, Sims-style home building, romantic and social relationships with autonomous NPCs, and persistent offline browser saving.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design decisions have been confirmed via Phase 1 clarification:
> - **Visual Aesthetic & Setting**: Modern vibrant suburban neighborhood with coastal promenade, styled with clean architectural geometry, lush palm and cypress trees, sandy shorelines, and warm atmospheric sunlight.
> - **Mobile Movement Controls**: Hybrid control scheme — intuitive tap-to-move with animated ground beacon rings alongside an ergonomic, floating virtual thumb joystick for direct locomotion.
> - **Starting Scenario**: Independent starter — the player begins in a cozy, furnished seaside studio apartment with $5,000 in starting funds, ready to seek careers, socialize, and expand their wealth.

---

## 1. Overview & Core Concept

- **What It Does**: The player creates and customizes their own 3D character (appearance, outfits, personality traits, and aspirations) and steps into a living open-world seaside town. Players manage real-time daily needs (Hunger, Energy, Hygiene, Bladder, Fun, Social, Romance, Fitness), explore streets, shops, beach promenades, restaurants, gyms, and offices, pursue 8 career paths, build relationships and romance with autonomous NPCs, purchase and customize homes in a Sims-style 3D Build Mode, and drive vehicles.
- **Target Audience / Persona**: Fans of life simulation games (The Sims, Animal Crossing, BitLife), casual and mid-core mobile gamers on iPhone 13, and desktop web players seeking a deep, sandbox virtual life.
- **Key Value**: A true, fully interactive 3D web simulation running smoothly at 60 FPS directly in the browser with zero external 404 asset dependencies, zero clunky popups, and full touchscreen ergonomics.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Title Screen & World Entry**:
   - Live 3D cinematic camera pan showcasing the coastal neighborhood with rolling waves, moving vehicles, and ambient daytime lighting.
   - Clean game shell with bespoke SVG title mark, "New Life" / "Continue Life" buttons, audio toggle, and quick control guide.
2. **Character Creation (CAS)**:
   - Full 3D interactive character preview updating in real-time.
   - Customization controls: Gender/body proportions, skin tone slider, hairstyles and hair color palette, eye colors, outfit styles (casual, formal, athletic, beachwear), shoes, and accessories.
   - Personality traits selection (e.g., Ambitious, Romantic, Outgoing, Creative, Fit, Lazy) and life aspirations (Tech Mogul, Master Chef, Social Star, Renowned Artist).
3. **Open-World Exploration & Daily Life**:
   - Overhead Sims-style isometric camera with smooth zoom (close 3rd-person to broad tactical view) and one-finger drag rotation (or right-click drag).
   - Tap-to-move with pulse rings or thumb joystick on bottom-left for fluid movement.
   - Contextual interaction bubbles on world objects (Fridge → "Eat Snack", Bed → "Sleep", Shower → "Take Shower", Desk → "Apply for Jobs", Mirror → "Practice Charisma", NPCs → "Chat / Flirt / Hang Out").
4. **Needs & Mood HUD**:
   - Ergonomic, low-occlusion perimeter HUD with collapsible bottom dock.
   - 8 needs meters color-coded from Green (100-70%) to Yellow (69-30%) to Red (<30%), driving the character's emotional mood (Happy, Energetic, Inspired, Flirty, Stressed, Exhausted).
5. **Careers, Economy & Progression**:
   - In-game smartphone interface: Career portal, bank account, shopping catalog, relationship tracker, and town map.
   - 8 full career ladders with shifts, daily earnings, performance requirements, and promotion milestones.
6. **Sims-Style 3D Build & Decorate Mode**:
   - Real-time 3D grid placement system.
   - Catalog of walls, flooring, doors, windows, beds, counters, electronics, seating, lighting, and decor.
   - Rotate, move, sell, and color-customize items with touch drag-and-drop.
7. **Social & Romantic Dynamics**:
   - Autonomous NPCs with daily schedules (work, beach strolls, dining, gym workouts).
   - Relationship meter (Acquaintance → Friend → Best Friend → Crush → Partner → Spouse).
   - Dialogue tree with humor, charisma checks, romantic advances, gift giving, dates, and marriage.

### Visual Identity & Theme

- **Aesthetic Direction**: Modern stylized suburban seaside town. Crisp architectural geometry, warm golden-hour lighting, oceanic azure gradients, terracotta and whitewashed villa walls, and vibrant greenery.
- **Color Palette**:
  - Dominant Canvas: Clean sky blues (`#38BDF8` to `#0284C7`), warm sunlit limestone (`#F8FAFC`, `#F1F5F9`), deep coastal navy (`#0F172A`).
  - Structural Surfaces: Translucent obsidian HUD panels (`rgba(15, 23, 42, 0.85)` with hairline borders `rgba(255, 255, 255, 0.12)`).
  - Accents: Sims-inspired Plumbob emerald green (`#10B981`), romantic rose (`#F43F5E`), energy amber (`#F59E0B`), and tech cyan (`#06B6D4`).
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` (clean geometric weight, friendly modern game feel).
  - Body & Dialogue: `DM Sans` / `Plus Jakarta Sans` (effortless mobile readability).
  - Telemetry & Currencies: `tabular-nums font-mono` (`$5,000`, `14:30 Day 3`).
- **Touchscreen Ergonomics (iPhone 13)**:
  - All touch targets $\ge 44 \times 44$px with generous padding.
  - Floating virtual joystick anchored in the lower-left thumb zone (with automatic touch repositioning).
  - Bottom action bar and collapsible smartphone drawer within natural thumb reach (bottom 35% of screen).
  - Zero browser gesture conflicts (viewport touch-action: none on 3D canvas, preventing elastic bouncing).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural 3D Asset System (Zero 404s)**:
  - *Chosen Approach*: Construct all character models, houses, furniture, vehicles, and neighborhood environments procedurally using Three.js composite geometry groups (3-12 parts per object), canvas-generated PBR textures, and `MeshStandardMaterial`.
  - *Why*: Eliminates broken external GLTF downloads, prevents network lag, ensures instant boot on mobile, and guarantees 100% reliable offline gameplay.
- **Decision 2: Hybrid Movement Controls**:
  - *Chosen Approach*: Dual input: player can tap anywhere on the ground to pathfind via waypoint marker, OR drag the virtual joystick on the lower-left screen, OR use WASD/Arrows on desktop.
  - *Why*: Matches the user's explicit preference while providing the most fluid experience on both mobile and desktop.
- **Decision 3: Isolated WebGL Canvas Architecture**:
  - *Chosen Approach*: Keep Three.js render loop inside a dedicated container with `useRef` and event listeners, decoupled from React component re-renders. Use a reactive Zustand/event-bus state bridge for HUD updates.
  - *Why*: Ensures a rock-solid 60 FPS game loop without React reconciliation overhead or frame stutters.
- **Decision 4: Robust Client-Side Persistent Saving**:
  - *Chosen Approach*: Automatic and manual save states stored in `localStorage` / `IndexedDB`, capturing character DNA, inventory, wallet, career stage, placed furniture, NPC relationship metrics, and game world time.
  - *Why*: Allows players to close Safari on iPhone or refresh the browser and immediately pick up right where they left off.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            LIFE SIMULATOR APP                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Game Flow Manager (Title Screen -> CAS -> World / Build -> Pause)          │
├──────────────────────────────────────┬──────────────────────────────────────┤
│          3D WebGL Engine             │             2D Game HUD              │
│  (Three.js Scene, Camera, Renderer)  │        (Mobile-Optimized DOM)        │
│                                      │                                      │
│  ┌────────────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │ Procedural World & Town Scene  │  │  │ Top Bar: Time, Weather, Cash   │  │
│  │ - Coastal Promenade & Beach    │  │  ├────────────────────────────────┤  │
│  │ - Starter Studio & Interiors   │  │  │ Needs Ring Gauges (8 Metrics)  │  │
│  │ - Town Plaza, Gym, Cafe, Shops │  │  ├────────────────────────────────┤  │
│  │ - Roadways, Cars & Pedestrians │  │  │ Bottom Action Dock:            │  │
│  └────────────────────────────────┘  │  │ - Virtual Thumb Joystick       │  │
│  ┌────────────────────────────────┐  │  │ - In-Game Smartphone (Apps)    │  │
│  │ Actors & Entities Engine       │  │  │ - Build Mode Toggle            │  │
│  │ - Player Rig & Procedural Mesh │  │  │ - Camera Angle / Zoom Controls │  │
│  │ - Autonomous NPC State Machine │  │  └────────────────────────────────┘  │
│  │ - Interactive Object Raycaster │  │  ┌────────────────────────────────┐  │
│  └────────────────────────────────┘  │  │ Contextual Interaction Radial  │  │
│  ┌────────────────────────────────┐  │  │ Dialog & Social Choice Modal   │  │
│  │ Build Mode Engine              │  │  └────────────────────────────────┘  │
│  │ - Grid Snapping & Preview Box  │                                         │
│  │ - Furniture Catalog Placement  │                                         │
│  └────────────────────────────────┘                                         │
├──────────────────────────────────────┴──────────────────────────────────────┤
│  Simulation Core & State (Needs, Career, Relationships, Audio Synth, Save)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Data Model

- **Player State**:
  - `appearance`: `{ gender, skinTone, hairStyle, hairColor, eyeColor, topColor, bottomColor, shoesColor, accessories }`
  - `traits`: `string[]` (e.g. `['Ambitious', 'Romantic', 'Outgoing']`)
  - `needs`: `{ hunger: 0-100, energy: 0-100, hygiene: 0-100, bladder: 0-100, fun: 0-100, social: 0-100, romance: 0-100, fitness: 0-100 }`
  - `wallet`: number (`$5,000` starting)
  - `career`: `{ jobTitle, company, level, salary, shiftStart, shiftEnd, performance }`
  - `inventory`: `Item[]` (groceries, clothes, gadgets, vehicles)
  - `ownedProperties`: `Property[]` (starter studio, luxury beachfront villa)
- **NPC State**:
  - `id, name, personality, mood, currentActivity, position, relationshipScore (0-100), romanticInterest`
- **World & Build State**:
  - `placedObjects`: `Array<{ id, catalogId, position: [x,y,z], rotation: number }>`
  - `timeOfDay`: hours & minutes (24h cycle affecting sun angle, sky color, street lamps)
  - `weather`: `'sunny' | 'rainy' | 'cloudy' | 'sunset'`
- **Audio Synthesizer**:
  - Web Audio API procedural sound engine: Footsteps, UI taps, money chimes, mood jingles, Sims-style guitar/piano lofi background melodies, and ambient seaside ocean waves.

---

## 5. Phased Implementation Roadmap

1. **Stage 1 (Foundation & 3D World)**:
   - Install `three` and `@types/three`.
   - Set up WebGL canvas with `RoomEnvironment`, PBR materials, dynamic day/night sun light, soft shadows, and horizon fog.
   - Build procedural seaside neighborhood: Promenade, beach with water shader, starter studio apartment with interior, roads, trees, lamps, and city buildings.
   - Implement hybrid controls: Virtual thumb joystick, tap-to-move beacon rings, keyboard/mouse input, and smooth camera damping.
2. **Stage 2 (Character Creator & Needs Engine)**:
   - CAS (Create-a-Sim) interface with 3D live preview, male/female meshes, hairstyle/color options, clothing palettes, traits, and goals.
   - Implement real-time 8-factor Needs system with decay and interactive furniture restoration (fridge, bed, shower, toilet, TV, sofa, weights).
3. **Stage 3 (Autonomous NPCs & Romance/Social System)**:
   - Generate populated neighborhood NPCs with distinct appearances, routines, and personalities.
   - Radial contextual interaction menu (Talk, Joke, Flirt, Compliment, Hug, Kiss, Date, Propose).
   - Dynamic relationship progress bar and dialogue responses.
4. **Stage 4 (Careers, Economy, Shopping & Vehicles)**:
   - In-game smartphone with Career app (8 jobs), Banking app, Shopping catalog, and Vehicles (bicycles, sports cars).
   - Work shifts, salary payouts, career promotions, and bills.
5. **Stage 5 (Sims-Style 3D Build Mode)**:
   - Grid-based placement, object rotation, purchase, move, and sell mechanics for interior and exterior furniture.
6. **Stage 6 (Persistent Save System, Procedural Audio & PWA Polish)**:
   - IndexedDB / LocalStorage auto-save and manual save.
   - Web Audio sound effects and cozy lofi music.
   - iPhone PWA viewport meta, touch prevention, responsive layout checks.
7. **Stage 7 (Compilation & Verification)**:
   - Full build test with `compile_applet` and verification of all game loops.
