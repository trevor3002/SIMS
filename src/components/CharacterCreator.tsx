import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CharacterAppearance,
  Gender,
  LifeAspiration,
  PersonalityTrait,
} from '../types/game';
import { createCharacterMesh } from '../game3d/proceduralModels';
import { sound } from '../services/soundSynth';
import { Check, User, Sparkles, Smile, ArrowRight, Dna } from 'lucide-react';

interface CharacterCreatorProps {
  initialAppearance?: CharacterAppearance;
  initialName?: string;
  initialTraits?: PersonalityTrait[];
  initialAspiration?: LifeAspiration;
  onFinish: (
    name: string,
    appearance: CharacterAppearance,
    traits: PersonalityTrait[],
    aspiration: LifeAspiration
  ) => void;
  onCancel?: () => void;
}

const SKIN_TONES = [
  '#FFDFC4', '#FCD7B8', '#F1C27D', '#E0AC69',
  '#C68642', '#8D5524', '#5C3818', '#382315'
];

const HAIR_COLORS = [
  '#1C1917', '#3B2219', '#78350F', '#B45309',
  '#F59E0B', '#DC2626', '#E2E8F0', '#9333EA'
];

const EYE_COLORS = [
  '#2563EB', '#059669', '#78350F', '#18181B', '#0284C7', '#7C3AED'
];

const CLOTHING_COLORS = [
  '#0EA5E9', '#10B981', '#EC4899', '#8B5CF6',
  '#F97316', '#EF4444', '#1E293B', '#F8FAFC'
];

const ALL_TRAITS: PersonalityTrait[] = [
  'Ambitious', 'Romantic', 'Outgoing', 'Creative',
  'Fit', 'Lazy', 'Genius', 'Foodie', 'Charismatic'
];

const ALL_ASPIRATIONS: { id: LifeAspiration; desc: string }[] = [
  { id: 'Tech Mogul', desc: 'Build an influential technology company and accumulate vast wealth.' },
  { id: 'Master Chef', desc: 'Master all gourmet recipes and own a world-renowned restaurant.' },
  { id: 'Social Star', desc: 'Become the most popular, charismatic personality on the coast.' },
  { id: 'Fitness Champion', desc: 'Reach absolute peak physical condition and inspire others.' },
  { id: 'Soulmate Searcher', desc: 'Find true lasting love, get married, and build a warm family.' },
  { id: 'Architect Prodigy', desc: 'Design and furnish the most stunning architectural homes.' },
];

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialAppearance,
  initialName = 'Alex Rivera',
  initialTraits = ['Ambitious', 'Romantic', 'Creative'],
  initialAspiration = 'Soulmate Searcher',
  onFinish,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);
  const [activeTab, setActiveTab] = useState<'body' | 'style' | 'personality'>('body');
  const [appearance, setAppearance] = useState<CharacterAppearance>(
    initialAppearance || {
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
      bodyScale: 1.0,
    }
  );

  const [selectedTraits, setSelectedTraits] = useState<PersonalityTrait[]>(initialTraits);
  const [aspiration, setAspiration] = useState<LifeAspiration>(initialAspiration);

  // 3D Preview Mounting
  const previewMountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const charMeshRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!previewMountRef.current) return;
    const container = previewMountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(0, 1.35, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 0.6);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Circular Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.3, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 })
    );
    pedestal.position.y = -0.1;
    scene.add(pedestal);

    // Render loop
    let reqId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      if (charMeshRef.current) {
        charMeshRef.current.rotation.y += 0.5 * dt;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update 3D Character mesh whenever appearance changes
  useEffect(() => {
    if (!sceneRef.current) return;
    if (charMeshRef.current) {
      sceneRef.current.remove(charMeshRef.current);
    }
    const newMesh = createCharacterMesh(appearance, true);
    newMesh.position.y = 0;
    sceneRef.current.add(newMesh);
    charMeshRef.current = newMesh;
  }, [appearance]);

  const toggleTrait = (trait: PersonalityTrait) => {
    sound.playClick(440);
    if (selectedTraits.includes(trait)) {
      if (selectedTraits.length > 1) {
        setSelectedTraits(selectedTraits.filter((t) => t !== trait));
      }
    } else {
      if (selectedTraits.length < 3) {
        setSelectedTraits([...selectedTraits, trait]);
      }
    }
  };

  const handleFinish = () => {
    sound.playCashRegister();
    onFinish(name.trim() || 'Alex Rivera', appearance, selectedTraits, aspiration);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col md:flex-row bg-slate-950 text-white pointer-events-auto overflow-hidden">
      {/* Left Column: 3D Character Interactive Preview */}
      <div className="relative w-full md:w-5/12 h-[38vh] md:h-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-800">
        <div ref={previewMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-sm">
          <Dna className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">CAS 3D Viewport</span>
        </div>
        <p className="absolute bottom-3 text-[11px] text-slate-400 font-medium">
          Drag to inspect character styling
        </p>
      </div>

      {/* Right Column: Customization Controls Panel */}
      <div className="w-full md:w-7/12 flex-1 flex flex-col justify-between overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
        <div>
          {/* Header & Name Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Create Your Sim</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Starter $5,000
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Design your identity, fashion style, and personality traits.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                className="w-44 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 rounded-2xl mb-6 border border-slate-800">
            <button
              onClick={() => {
                sound.playClick(480);
                setActiveTab('body');
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'body'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Face & Hair</span>
            </button>
            <button
              onClick={() => {
                sound.playClick(480);
                setActiveTab('style');
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'style'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Outfits</span>
            </button>
            <button
              onClick={() => {
                sound.playClick(480);
                setActiveTab('personality');
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'personality'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Traits & Goal</span>
            </button>
          </div>

          {/* TAB 1: BODY & FACE */}
          {activeTab === 'body' && (
            <div className="space-y-5">
              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Body Frame
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['female', 'male', 'nonbinary'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        sound.playClick(500);
                        setAppearance({ ...appearance, gender: g });
                      }}
                      className={`h-11 rounded-xl text-xs sm:text-sm font-semibold capitalize border transition-all ${
                        appearance.gender === g
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Skin Tone
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {SKIN_TONES.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        sound.playClick(520);
                        setAppearance({ ...appearance, skinTone: color });
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        appearance.skinTone === color ? 'border-emerald-400 scale-110 shadow-md' : 'border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Hairstyle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Hairstyle
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {(['short_crop', 'buzz', 'bob', 'long_wavy', 'afro'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        sound.playClick(500);
                        setAppearance({ ...appearance, hairStyle: style });
                      }}
                      className={`h-10 rounded-xl text-xs font-medium capitalize border transition-all ${
                        appearance.hairStyle === style
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {style.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Hair Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {HAIR_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        sound.playClick(520);
                        setAppearance({ ...appearance, hairColor: color });
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        appearance.hairColor === color ? 'border-emerald-400 scale-110 shadow-md' : 'border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Eye Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {EYE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        sound.playClick(520);
                        setAppearance({ ...appearance, eyeColor: color });
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        appearance.eyeColor === color ? 'border-emerald-400 scale-110 shadow-md' : 'border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STYLE & OUTFITS */}
          {activeTab === 'style' && (
            <div className="space-y-5">
              {/* Top Clothing Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Top Apparel Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {CLOTHING_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        sound.playClick(500);
                        setAppearance({ ...appearance, topColor: color });
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        appearance.topColor === color ? 'border-emerald-400 scale-110 shadow-md' : 'border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Clothing Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Bottom Pants / Jeans Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {CLOTHING_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        sound.playClick(500);
                        setAppearance({ ...appearance, bottomColor: color });
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        appearance.bottomColor === color ? 'border-emerald-400 scale-110 shadow-md' : 'border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Eyewear & Accessories
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'sunglasses', 'glasses'] as const).map((acc) => (
                    <button
                      key={acc}
                      onClick={() => {
                        sound.playClick(500);
                        setAppearance({ ...appearance, accessories: acc });
                      }}
                      className={`h-11 rounded-xl text-xs font-medium capitalize border transition-all ${
                        appearance.accessories === acc
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERSONALITY & ASPIRATION */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              {/* Traits (Choose up to 3) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Personality Traits (Select up to 3)
                  </label>
                  <span className="text-xs font-mono text-emerald-400">{selectedTraits.length}/3 Selected</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_TRAITS.map((trait) => {
                    const isSelected = selectedTraits.includes(trait);
                    return (
                      <button
                        key={trait}
                        onClick={() => toggleTrait(trait)}
                        className={`h-11 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{trait}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Life Aspiration */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Life Aspiration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_ASPIRATIONS.map((asp) => (
                    <button
                      key={asp.id}
                      onClick={() => {
                        sound.playClick(520);
                        setAspiration(asp.id);
                      }}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        aspiration === asp.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-xs sm:text-sm text-emerald-300 mb-1">{asp.id}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{asp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Bar */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-3">
          {onCancel && (
            <button
              onClick={() => {
                sound.playClick(400);
                onCancel();
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleFinish}
            className="flex-1 max-w-xs ml-auto h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Live This Life</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
