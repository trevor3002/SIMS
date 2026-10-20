import * as THREE from 'three';
import { CharacterAppearance, Gender, PlacedFurniture } from '../types/game';
import {
  getRoadTexture,
  getSandTexture,
  getSidewalkTexture,
  getTileTexture,
  getWoodParquetTexture,
  Materials,
} from './materials';

/**
 * Creates a composite procedural 3D character mesh rig (Group of 8-12 parts)
 */
export function createCharacterMesh(appearance: CharacterAppearance, isPlayer: boolean = false): THREE.Group {
  const group = new THREE.Group();
  group.name = isPlayer ? 'PlayerCharacter' : 'NPCCharacter';

  const skinColor = new THREE.Color(appearance.skinTone || '#E0AC69');
  const hairColor = new THREE.Color(appearance.hairColor || '#3B2219');
  const eyeColor = new THREE.Color(appearance.eyeColor || '#2563EB');
  const topColor = new THREE.Color(appearance.topColor || '#0EA5E9');
  const bottomColor = new THREE.Color(appearance.bottomColor || '#1E293B');
  const shoeColor = new THREE.Color(appearance.shoesColor || '#FFFFFF');

  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7, metalness: 0.05 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8, metalness: 0.1 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: eyeColor });
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const topMat = new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.8, metalness: 0.05 });
  const bottomMat = new THREE.MeshStandardMaterial({ color: bottomColor, roughness: 0.85, metalness: 0.02 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.6, metalness: 0.1 });

  const scale = appearance.bodyScale || 1.0;
  const isMale = appearance.gender === 'male';

  // 1. Torso (0.55 width x 0.7 height x 0.35 depth)
  const torsoWidth = isMale ? 0.44 : 0.38;
  const torsoGeo = new THREE.BoxGeometry(torsoWidth, 0.6, 0.28);
  const torso = new THREE.Mesh(torsoGeo, topMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  group.add(torso);

  // 2. Neck & Head
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = 1.48;
  group.add(neck);

  const headGeo = new THREE.SphereGeometry(0.2, 16, 16);
  headGeo.scale(1, 1.15, 1);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.68;
  head.castShadow = true;
  group.add(head);

  // Eyes (whites + irises)
  for (const side of [-1, 1]) {
    const eyeWhiteGeo = new THREE.SphereGeometry(0.038, 8, 8);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, whiteMat);
    eyeWhite.position.set(side * 0.07, 1.72, 0.17);
    group.add(eyeWhite);

    const pupilGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const pupil = new THREE.Mesh(pupilGeo, eyeMat);
    pupil.position.set(side * 0.07, 1.72, 0.195);
    group.add(pupil);
  }

  // Smile / mouth line
  const mouthGeo = new THREE.BoxGeometry(0.08, 0.015, 0.01);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x881337 });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.position.set(0, 1.62, 0.19);
  group.add(mouth);

  // 3. Hairstyle
  const hairGroup = new THREE.Group();
  if (appearance.hairStyle === 'buzz') {
    const hairGeo = new THREE.SphereGeometry(0.21, 14, 14);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.72, -0.02);
    hairGroup.add(hair);
  } else if (appearance.hairStyle === 'afro') {
    const hairGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.76, -0.02);
    hairGroup.add(hair);
  } else if (appearance.hairStyle === 'long_wavy') {
    const topHairGeo = new THREE.SphereGeometry(0.23, 14, 14);
    const topHair = new THREE.Mesh(topHairGeo, hairMat);
    topHair.position.set(0, 1.75, -0.02);
    hairGroup.add(topHair);

    // Left and right cascading locks
    for (const side of [-1, 1]) {
      const lockGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.45, 8);
      const lock = new THREE.Mesh(lockGeo, hairMat);
      lock.position.set(side * 0.17, 1.5, -0.05);
      lock.rotation.z = side * -0.15;
      hairGroup.add(lock);
    }
  } else if (appearance.hairStyle === 'bob') {
    const topHairGeo = new THREE.SphereGeometry(0.24, 14, 14);
    const topHair = new THREE.Mesh(topHairGeo, hairMat);
    topHair.position.set(0, 1.74, -0.03);
    hairGroup.add(topHair);

    const backHairGeo = new THREE.BoxGeometry(0.42, 0.28, 0.25);
    const backHair = new THREE.Mesh(backHairGeo, hairMat);
    backHair.position.set(0, 1.58, -0.12);
    hairGroup.add(backHair);
  } else {
    // short_crop default
    const hairGeo = new THREE.BoxGeometry(0.38, 0.15, 0.38);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.82, -0.02);
    hairGroup.add(hair);
  }
  group.add(hairGroup);

  // 4. Arms & Hands (Left & Right)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'LeftArm';
  leftArmGroup.position.set(-torsoWidth / 2 - 0.07, 1.35, 0);

  const armGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.42, 10);
  const leftArm = new THREE.Mesh(armGeo, topMat);
  leftArm.position.y = -0.21;
  leftArmGroup.add(leftArm);

  const handGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.y = -0.45;
  leftArmGroup.add(leftHand);
  group.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.name = 'RightArm';
  rightArmGroup.position.set(torsoWidth / 2 + 0.07, 1.35, 0);

  const rightArm = new THREE.Mesh(armGeo, topMat);
  rightArm.position.y = -0.21;
  rightArmGroup.add(rightArm);

  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.y = -0.45;
  rightArmGroup.add(rightHand);
  group.add(rightArmGroup);

  // 5. Legs & Shoes (Left & Right)
  const leftLegGroup = new THREE.Group();
  leftLegGroup.name = 'LeftLeg';
  leftLegGroup.position.set(-0.11, 0.85, 0);

  const legGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.72, 10);
  const leftLeg = new THREE.Mesh(legGeo, bottomMat);
  leftLeg.position.y = -0.36;
  leftLeg.castShadow = true;
  leftLegGroup.add(leftLeg);

  const shoeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.22);
  const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
  leftShoe.position.set(0, -0.74, 0.04);
  leftLegGroup.add(leftShoe);
  group.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.name = 'RightLeg';
  rightLegGroup.position.set(0.11, 0.85, 0);

  const rightLeg = new THREE.Mesh(legGeo, bottomMat);
  rightLeg.position.y = -0.36;
  rightLeg.castShadow = true;
  rightLegGroup.add(rightLeg);

  const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
  rightShoe.position.set(0, -0.74, 0.04);
  rightLegGroup.add(rightShoe);
  group.add(rightLegGroup);

  // 6. Plumbob Diamond over head (for player character!)
  if (isPlayer) {
    const plumbobGeo = new THREE.OctahedronGeometry(0.12, 0);
    plumbobGeo.scale(0.8, 1.8, 0.8);
    const plumbob = new THREE.Mesh(plumbobGeo, Materials.plumbobGreen.clone());
    plumbob.name = 'Plumbob';
    plumbob.position.y = 2.25;
    group.add(plumbob);
  }

  // Accessories (Glasses / Sunglasses)
  if (appearance.accessories === 'glasses' || appearance.accessories === 'sunglasses') {
    const frameMat = new THREE.MeshBasicMaterial({
      color: appearance.accessories === 'sunglasses' ? 0x09090B : 0xD97706,
    });
    const lensMat = new THREE.MeshBasicMaterial({
      color: appearance.accessories === 'sunglasses' ? 0x18181B : 0x93C5FD,
      transparent: true,
      opacity: 0.75,
    });
    for (const side of [-1, 1]) {
      const rim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.01), frameMat);
      rim.position.set(side * 0.07, 1.73, 0.2);
      group.add(rim);

      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.04, 0.01), lensMat);
      lens.position.set(side * 0.07, 1.73, 0.205);
      group.add(lens);
    }
    // Bridge
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.01), frameMat);
    bridge.position.set(0, 1.73, 0.2);
    group.add(bridge);
  }

  group.scale.set(scale, scale, scale);
  return group;
}

/**
 * Creates 3D Furniture model based on catalog ID
 */
export function createFurnitureMesh(furniture: PlacedFurniture): THREE.Group {
  const group = new THREE.Group();
  group.name = `Furniture_${furniture.id}`;
  group.userData = { furnitureData: furniture };

  switch (furniture.catalogId) {
    case 'modern_bed': {
      // Laguna Queen Bed (Frame, Headboard, Mattress, Pillows, Duvet)
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.25, 2.3),
        Materials.woodLight
      );
      frame.position.y = 0.125;
      frame.castShadow = true;
      group.add(frame);

      const headboard = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 1.0, 0.15),
        Materials.woodLight
      );
      headboard.position.set(0, 0.6, -1.1);
      group.add(headboard);

      const mattress = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.35, 2.05),
        new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.9 })
      );
      mattress.position.set(0, 0.35, 0.05);
      group.add(mattress);

      // Duvet (Cozy seafoam / teal comforter)
      const duvet = new THREE.Mesh(
        new THREE.BoxGeometry(1.92, 0.15, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x0D9488, roughness: 0.85 })
      );
      duvet.position.set(0, 0.48, 0.38);
      group.add(duvet);

      // 2 Pillows
      for (const side of [-0.55, 0.55]) {
        const pillow = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.12, 0.45),
          new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 })
        );
        pillow.position.set(side, 0.52, -0.7);
        pillow.rotation.x = 0.1;
        group.add(pillow);
      }
      break;
    }

    case 'velvet_sofa': {
      // Riviera 3-Seat Sofa
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.25, 1.1),
        Materials.woodDark
      );
      base.position.y = 0.22;
      group.add(base);

      // 4 Brass legs
      for (const lx of [-1.15, 1.15]) {
        for (const lz of [-0.45, 0.45]) {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.025, 0.22, 8),
            Materials.gold
          );
          leg.position.set(lx, 0.11, lz);
          group.add(leg);
        }
      }

      // Seat cushions
      const cushion = new THREE.Mesh(
        new THREE.BoxGeometry(2.45, 0.22, 0.95),
        Materials.fabricEmerald
      );
      cushion.position.set(0, 0.42, 0.05);
      group.add(cushion);

      // Backrest
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.65, 0.25),
        Materials.fabricEmerald
      );
      back.position.set(0, 0.72, -0.42);
      group.add(back);

      // Armrests
      for (const side of [-1.22, 1.22]) {
        const arm = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.45, 1.05),
          Materials.fabricEmerald
        );
        arm.position.set(side, 0.55, 0.05);
        group.add(arm);
      }
      break;
    }

    case 'retro_fridge': {
      // Smeg-Style Coastal Refrigerator
      const fridgeBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.9, 0.85),
        new THREE.MeshStandardMaterial({ color: 0x99F6E4, roughness: 0.35, metalness: 0.2 })
      );
      fridgeBody.position.y = 0.95;
      fridgeBody.castShadow = true;
      group.add(fridgeBody);

      // Chrome handle
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
        Materials.chrome
      );
      handle.position.set(0.35, 1.05, 0.45);
      group.add(handle);
      break;
    }

    case 'chef_stove': {
      // Kitchen Counter & Gas Stove
      const counterBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.9, 0.9),
        Materials.wallWhite
      );
      counterBase.position.y = 0.45;
      group.add(counterBase);

      const cooktop = new THREE.Mesh(
        new THREE.BoxGeometry(1.22, 0.06, 0.92),
        new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3, metalness: 0.8 })
      );
      cooktop.position.y = 0.93;
      group.add(cooktop);

      // 4 Cast-Iron Burners
      for (const bx of [-0.3, 0.3]) {
        for (const bz of [-0.2, 0.2]) {
          const burner = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.02, 12),
            new THREE.MeshStandardMaterial({ color: 0x09090B, roughness: 0.9 })
          );
          burner.position.set(bx, 0.97, bz);
          group.add(burner);
        }
      }

      // Oven Glass Door
      const ovenDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.55, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.2 })
      );
      ovenDoor.position.set(0, 0.45, 0.46);
      group.add(ovenDoor);
      break;
    }

    case 'rainfall_shower': {
      // Glass Rainfall Shower
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.08, 1.3),
        new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.4 })
      );
      tray.position.y = 0.04;
      group.add(tray);

      // Glass screens
      const glassWall1 = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 2.1, 0.04),
        Materials.glass
      );
      glassWall1.position.set(0, 1.08, -0.63);
      group.add(glassWall1);

      const glassWall2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 2.1, 1.3),
        Materials.glass
      );
      glassWall2.position.set(-0.63, 1.08, 0);
      group.add(glassWall2);

      // Chrome vertical pipe & shower head
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8),
        Materials.chrome
      );
      pipe.position.set(0.5, 1.1, -0.55);
      group.add(pipe);

      const head = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.03, 12),
        Materials.chrome
      );
      head.position.set(0.35, 2.05, -0.35);
      group.add(head);
      break;
    }

    case 'porcelain_toilet': {
      // Smart Porcelain Toilet
      const bowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.18, 0.45, 16),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
      );
      bowl.position.set(0, 0.225, 0.15);
      group.add(bowl);

      const tank = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.25),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
      );
      tank.position.set(0, 0.55, -0.15);
      group.add(tank);

      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.05, 0.48),
        new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.3 })
      );
      seat.position.set(0, 0.46, 0.15);
      group.add(seat);
      break;
    }

    case 'oled_tv': {
      // 65" OLED TV & Media Console
      const credenza = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.45, 0.5),
        Materials.woodDark
      );
      credenza.position.y = 0.225;
      group.add(credenza);

      const tvStand = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.15, 0.25),
        Materials.chrome
      );
      tvStand.position.set(0, 0.525, 0);
      group.add(tvStand);

      const tvScreen = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 1.15, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x09090B, roughness: 0.1, metalness: 0.9 })
      );
      tvScreen.position.set(0, 1.15, 0);
      group.add(tvScreen);

      // TV Display Glow (Sims Channel)
      const tvGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.92, 1.07),
        new THREE.MeshBasicMaterial({ color: 0x38BDF8 })
      );
      tvGlow.position.set(0, 1.15, 0.03);
      group.add(tvGlow);
      break;
    }

    case 'ficus_plant': {
      // Potted Ficus in Terracotta Pot
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.18, 0.4, 14),
        new THREE.MeshStandardMaterial({ color: 0xC2410C, roughness: 0.8 })
      );
      pot.position.y = 0.2;
      group.add(pot);

      // Stems and broad leaves
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.7 })
        );
        leaf.scale.set(1.4, 0.25, 0.8);
        leaf.position.set(Math.cos(angle) * 0.25, 0.55 + i * 0.12, Math.sin(angle) * 0.25);
        leaf.rotation.set(0.3, angle, 0.2);
        group.add(leaf);
      }
      break;
    }

    default: {
      // Fallback furniture box
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.5 })
      );
      box.position.y = 0.5;
      group.add(box);
      break;
    }
  }

  group.position.set(...furniture.position);
  group.rotation.y = furniture.rotationY;
  return group;
}

/**
 * Creates the Player's Starter Apartment Structure (Floor, Cutaway Open Walls for Sims view)
 */
export function createApartmentMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'StarterApartment';

  // 1. Apartment Floor (11m x 10m) with Wood Parquet Texture
  const floorGeo = new THREE.PlaneGeometry(11, 10);
  const floorMat = new THREE.MeshStandardMaterial({
    map: getWoodParquetTexture(),
    roughness: 0.5,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.01, 0); // slightly above ground to prevent z-fighting
  floor.receiveShadow = true;
  group.add(floor);

  // Bathroom Tile Floor Section (Right Side)
  const bathFloorGeo = new THREE.PlaneGeometry(3.5, 4.5);
  const bathFloorMat = new THREE.MeshStandardMaterial({
    map: getTileTexture(),
    roughness: 0.3,
    metalness: 0.1,
  });
  const bathFloor = new THREE.Mesh(bathFloorGeo, bathFloorMat);
  bathFloor.rotation.x = -Math.PI / 2;
  bathFloor.position.set(3.7, 0.015, 2.7);
  group.add(bathFloor);

  // 2. Sims Cutaway Perimeter Walls (Back wall & side walls tall, front cutaway low for camera)
  const wallMat = Materials.wallWhite;
  const wallAccent = Materials.wallAccent;

  // Back Wall (Z = -5)
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(11.2, 2.8, 0.3),
    wallMat
  );
  backWall.position.set(0, 1.4, -5.1);
  backWall.castShadow = true;
  group.add(backWall);

  // Accent Feature Wall in living room
  const featureWall = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 2.7, 0.05),
    wallAccent
  );
  featureWall.position.set(2.5, 1.4, -4.9);
  group.add(featureWall);

  // Left Wall (X = -5.5)
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 2.8, 10.2),
    wallMat
  );
  leftWall.position.set(-5.6, 1.4, 0);
  leftWall.castShadow = true;
  group.add(leftWall);

  // Right Wall (X = 5.5)
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 2.8, 10.2),
    wallMat
  );
  rightWall.position.set(5.6, 1.4, 0);
  rightWall.castShadow = true;
  group.add(rightWall);

  // Bathroom Divider Wall
  const bathDivider = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 2.8, 0.2),
    wallMat
  );
  bathDivider.position.set(3.7, 1.4, 0.5);
  group.add(bathDivider);

  // Low Front Cutaway Threshold (Z = 5) - allows unobstructed Sims isometric view
  const frontThreshold = new THREE.Mesh(
    new THREE.BoxGeometry(11.2, 0.3, 0.3),
    wallMat
  );
  frontThreshold.position.set(0, 0.15, 5.1);
  group.add(frontThreshold);

  // Front Porch Doorway & Steps
  const steps = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.15, 1.2),
    new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.6 })
  );
  steps.position.set(0, 0.08, 5.8);
  group.add(steps);

  return group;
}

/**
 * Creates coastal palm tree (trunk segments + leafy fronds)
 */
export function createPalmTree(): THREE.Group {
  const tree = new THREE.Group();
  tree.name = 'PalmTree';

  // Curved Trunk
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.9 });
  const trunkSegments = 5;
  for (let i = 0; i < trunkSegments; i++) {
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18 - i * 0.02, 0.22 - i * 0.02, 0.8, 8),
      trunkMat
    );
    seg.position.set(i * 0.08, 0.4 + i * 0.75, 0);
    seg.rotation.z = -0.08;
    seg.castShadow = true;
    tree.add(seg);
  }

  // 6 Palm Fronds
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x16A34A, roughness: 0.6, side: THREE.DoubleSide });
  for (let f = 0; f < 6; f++) {
    const angle = (f / 6) * Math.PI * 2;
    const frond = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 2.2),
      leafMat
    );
    frond.position.set(0.4 + Math.cos(angle) * 0.8, 4.0, Math.sin(angle) * 0.8);
    frond.rotation.set(0.6, angle, 0.4);
    frond.castShadow = true;
    tree.add(frond);
  }

  return tree;
}

/**
 * Creates a modern town vehicle (Sports Car or Bicycle)
 */
export function createVehicleMesh(type: 'car' | 'bicycle', color: number = 0xEF4444): THREE.Group {
  const group = new THREE.Group();
  group.name = type === 'car' ? 'SportsCar' : 'Bicycle';

  if (type === 'car') {
    // Aerodynamic Chassis Body
    const carMat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.7 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 3.8), carMat);
    body.position.y = 0.45;
    body.castShadow = true;
    group.add(body);

    // Cabin / Roof
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 1.8), Materials.glass);
    cabin.position.set(0, 0.9, -0.2);
    group.add(cabin);

    // 4 Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181B, roughness: 0.8 });
    for (const wx of [-0.95, 0.95]) {
      for (const wz of [-1.1, 1.1]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.32, wz);
        group.add(wheel);
      }
    }

    // Headlights
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A });
    for (const hx of [-0.6, 0.6]) {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), lightMat);
      hl.position.set(hx, 0.5, 1.9);
      group.add(hl);
    }
  } else {
    // Bicycle
    const frameMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.8 });
    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8), frameMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(0, 0.6, 0);
    group.add(crossbar);

    // 2 Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x27272A, roughness: 0.9 });
    for (const wz of [-0.65, 0.65]) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 16), tireMat);
      rim.rotation.y = Math.PI / 2;
      rim.position.set(0, 0.35, wz);
      group.add(rim);
    }
  }

  return group;
}

/**
 * Creates town landmark buildings (Gym, Café, Tech Tower, Plaza Fountain)
 */
export function createTownEnvironment(): THREE.Group {
  const env = new THREE.Group();
  env.name = 'TownEnvironment';

  // 1. Ground Canvas (Terrain 160m x 160m)
  const terrainGeo = new THREE.PlaneGeometry(160, 160);
  const terrain = new THREE.Mesh(terrainGeo, Materials.lawn);
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.y = -0.02;
  terrain.receiveShadow = true;
  env.add(terrain);

  // 2. Coastal Beach & Ocean Water (Z <= -25)
  const beachGeo = new THREE.PlaneGeometry(160, 35);
  const beachMat = new THREE.MeshStandardMaterial({
    map: getSandTexture(),
    roughness: 0.95,
  });
  const beach = new THREE.Mesh(beachGeo, beachMat);
  beach.rotation.x = -Math.PI / 2;
  beach.position.set(0, 0.01, -38);
  beach.receiveShadow = true;
  env.add(beach);

  // Ocean Water Mesh
  const oceanGeo = new THREE.PlaneGeometry(160, 60);
  const ocean = new THREE.Mesh(oceanGeo, Materials.water);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, -0.05, -75);
  ocean.name = 'OceanWater';
  env.add(ocean);

  // Boardwalk Promenade along Beach
  const boardwalkGeo = new THREE.PlaneGeometry(160, 5);
  const boardwalkMat = new THREE.MeshStandardMaterial({
    map: getWoodParquetTexture(),
    roughness: 0.8,
  });
  const boardwalk = new THREE.Mesh(boardwalkGeo, boardwalkMat);
  boardwalk.rotation.x = -Math.PI / 2;
  boardwalk.position.set(0, 0.03, -21);
  env.add(boardwalk);

  // 3. Roads & Sidewalks
  // Main Coastal Boulevard (East-West at Z = -13)
  const mainRoadGeo = new THREE.PlaneGeometry(160, 8);
  const roadMat = new THREE.MeshStandardMaterial({
    map: getRoadTexture(),
    roughness: 0.8,
  });
  const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
  mainRoad.rotation.x = -Math.PI / 2;
  mainRoad.position.set(0, 0.02, -13);
  env.add(mainRoad);

  // Cross Street (North-South at X = 0)
  const crossRoadGeo = new THREE.PlaneGeometry(8, 100);
  const crossRoad = new THREE.Mesh(crossRoadGeo, roadMat);
  crossRoad.rotation.x = -Math.PI / 2;
  crossRoad.position.set(-8, 0.02, 30);
  env.add(crossRoad);

  // Sidewalks
  const sidewalkMat = new THREE.MeshStandardMaterial({
    map: getSidewalkTexture(),
    roughness: 0.7,
  });
  const swGeo = new THREE.PlaneGeometry(160, 2.5);
  const swNorth = new THREE.Mesh(swGeo, sidewalkMat);
  swNorth.rotation.x = -Math.PI / 2;
  swNorth.position.set(0, 0.04, -8);
  env.add(swNorth);

  const swSouth = new THREE.Mesh(swGeo, sidewalkMat);
  swSouth.rotation.x = -Math.PI / 2;
  swSouth.position.set(0, 0.04, -18);
  env.add(swSouth);

  // 4. Palm Trees along Promenade
  for (let x = -60; x <= 60; x += 18) {
    const palm = createPalmTree();
    palm.position.set(x, 0, -22);
    env.add(palm);
  }

  // 5. Town Landmark Buildings:
  // Landmark A: The Palm Café & Bistro (X = 18, Z = 8)
  const cafeGroup = new THREE.Group();
  cafeGroup.position.set(18, 0, 8);
  const cafeBody = new THREE.Mesh(
    new THREE.BoxGeometry(10, 4.5, 9),
    new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.6 })
  );
  cafeBody.position.y = 2.25;
  cafeBody.castShadow = true;
  cafeGroup.add(cafeBody);

  // Striped awning
  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.2, 2.5),
    new THREE.MeshStandardMaterial({ color: 0xF97316, roughness: 0.7 })
  );
  awning.position.set(0, 2.8, 5.2);
  awning.rotation.x = 0.2;
  cafeGroup.add(awning);
  env.add(cafeGroup);

  // Landmark B: Pacific Tech Tower (X = -24, Z = -5)
  const towerGroup = new THREE.Group();
  towerGroup.position.set(-24, 0, -5);
  const towerBody = new THREE.Mesh(
    new THREE.BoxGeometry(12, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.2, metalness: 0.85 })
  );
  towerBody.position.y = 8;
  towerBody.castShadow = true;
  towerGroup.add(towerBody);

  // Glass grid windows on tower
  const towerGlass = new THREE.Mesh(
    new THREE.BoxGeometry(12.1, 14, 11),
    Materials.glass
  );
  towerGlass.position.y = 8;
  towerGroup.add(towerGlass);
  env.add(towerGroup);

  // Landmark C: Iron & Steel Gym (X = -22, Z = 22)
  const gymGroup = new THREE.Group();
  gymGroup.position.set(-22, 0, 22);
  const gymBody = new THREE.Mesh(
    new THREE.BoxGeometry(12, 5.5, 12),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
  );
  gymBody.position.y = 2.75;
  gymGroup.add(gymBody);

  const gymAccent = new THREE.Mesh(
    new THREE.BoxGeometry(12.2, 0.8, 12.2),
    new THREE.MeshStandardMaterial({ color: 0xEF4444 })
  );
  gymAccent.position.y = 5.0;
  gymGroup.add(gymAccent);
  env.add(gymGroup);

  // Landmark D: Town Plaza Central Fountain (X = 0, Z = 24)
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, 0, 24);

  const fountainRim = new THREE.Mesh(
    new THREE.CylinderGeometry(4.2, 4.5, 0.6, 24),
    new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.5 })
  );
  fountainRim.position.y = 0.3;
  fountainGroup.add(fountainRim);

  const fountainWater = new THREE.Mesh(
    new THREE.CylinderGeometry(4.0, 4.0, 0.45, 24),
    Materials.water
  );
  fountainWater.position.y = 0.35;
  fountainGroup.add(fountainWater);

  const fountainCenter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.8, 1.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.4 })
  );
  fountainCenter.position.y = 1.0;
  fountainGroup.add(fountainCenter);

  env.add(fountainGroup);

  // 6. Street Lamps along the Roadways
  for (const lx of [-45, -20, 15, 45]) {
    const lamp = new THREE.Group();
    lamp.position.set(lx, 0, -8.5);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 4.5, 8),
      Materials.chrome
    );
    pole.position.y = 2.25;
    lamp.add(pole);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xFEF08A })
    );
    head.position.y = 4.4;
    lamp.add(head);

    // Warm street lamp light
    const pointLight = new THREE.PointLight(0xFEF08A, 0.8, 16);
    pointLight.position.y = 4.3;
    lamp.add(pointLight);

    env.add(lamp);
  }

  return env;
}
