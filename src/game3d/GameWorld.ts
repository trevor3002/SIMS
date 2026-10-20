import * as THREE from 'three';
import {
  CharacterAppearance,
  GameTime,
  NPCData,
  PlacedFurniture,
  WeatherType,
} from '../types/game';
import {
  createApartmentMesh,
  createCharacterMesh,
  createFurnitureMesh,
  createTownEnvironment,
} from './proceduralModels';

export interface WorldCallbacks {
  onSelectObject: (furniture: PlacedFurniture) => void;
  onSelectNPC: (npc: NPCData) => void;
  onFootstep: () => void;
  onTapGround: (point: [number, number, number]) => void;
}

export class GameWorld {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private animFrameId: number | null = null;
  private callbacks: WorldCallbacks;

  // Environment elements
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private oceanMesh: THREE.Mesh | null = null;
  private rainParticles: THREE.Points | null = null;
  private waypointRing: THREE.Mesh | null = null;

  // Actors & Objects
  private playerGroup: THREE.Group | null = null;
  private plumbobMesh: THREE.Mesh | null = null;
  private furnitureGroup: THREE.Group;
  private npcsMap: Map<string, { group: THREE.Group; data: NPCData; targetPos: THREE.Vector3 }> = new Map();

  // Navigation & Locomotion
  private playerPos = new THREE.Vector3(0, 0, 0);
  private playerTargetPos: THREE.Vector3 | null = null;
  private playerRotation = 0;
  private walkCycleTime = 0;
  private isMoving = false;
  private moveSpeed = 5.0; // units per sec
  private footstepTimer = 0;

  // Joystick Input Vector
  public joystickVector = { x: 0, y: 0 };

  // Camera Orbit & Damping
  private cameraOffset = new THREE.Vector3(0, 14, 16);
  private cameraZoom = 1.0; // 0.6 (close) to 2.2 (wide)
  private cameraAngle = 0; // horizontal rotation in radians
  private isDraggingCamera = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private pinchStartDist = 0;

  // Raycaster & Interaction
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // Build Mode State
  private buildModeActive = false;
  private buildGhostMesh: THREE.Group | null = null;
  private buildGridHelper: THREE.GridHelper | null = null;
  private buildRotation = 0;

  constructor(container: HTMLElement, callbacks: WorldCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38BDF8);
    this.scene.fog = new THREE.FogExp2(0xBAE6FD, 0.012);

    const aspect = container.clientWidth / container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 400);

    // 2. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);
    this.clock = new THREE.Clock();

    // 3. Lighting Rig (Directional Sun + Hemisphere fill)
    this.hemiLight = new THREE.HemisphereLight(0xBAE6FD, 0x48BB78, 0.7);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xFFFBEB, 1.4);
    this.sunLight.position.set(30, 45, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 120;
    const d = 35;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // 4. World Environment & Structures
    const town = createTownEnvironment();
    this.scene.add(town);
    this.oceanMesh = this.scene.getObjectByName('OceanWater') as THREE.Mesh;

    const apartment = createApartmentMesh();
    this.scene.add(apartment);

    // Furniture Container
    this.furnitureGroup = new THREE.Group();
    this.furnitureGroup.name = 'AllFurniture';
    this.scene.add(this.furnitureGroup);

    // 5. Waypoint Beacon Ring (for Tap-to-move)
    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.waypointRing = new THREE.Mesh(ringGeo, ringMat);
    this.waypointRing.rotation.x = -Math.PI / 2;
    this.waypointRing.position.y = 0.05;
    this.scene.add(this.waypointRing);

    // 6. Rain Particle System (latent)
    this.createRainSystem();

    // 7. Event Listeners for Interaction & Camera
    this.setupEventListeners();

    // 8. Start Game Loop
    this.animate();
  }

  private createRainSystem() {
    const rainCount = 1200;
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = Math.random() * 40;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93C5FD,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
    });
    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  public setPlayer(appearance: CharacterAppearance, initialPos: [number, number, number]) {
    if (this.playerGroup) {
      this.scene.remove(this.playerGroup);
    }
    this.playerGroup = createCharacterMesh(appearance, true);
    this.playerPos.set(...initialPos);
    this.playerGroup.position.copy(this.playerPos);
    this.plumbobMesh = this.playerGroup.getObjectByName('Plumbob') as THREE.Mesh;
    this.scene.add(this.playerGroup);
  }

  public updateFurniture(furnitureList: PlacedFurniture[]) {
    // Clear existing
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }
    // Rebuild
    furnitureList.forEach((item) => {
      const mesh = createFurnitureMesh(item);
      this.furnitureGroup.add(mesh);
    });
  }

  public setNPCs(npcs: NPCData[]) {
    // Recreate NPCs
    this.npcsMap.forEach(({ group }) => this.scene.remove(group));
    this.npcsMap.clear();

    npcs.forEach((npc) => {
      const group = createCharacterMesh(npc.appearance, false);
      group.name = `NPC_${npc.id}`;
      group.userData = { npcData: npc };
      const startPos = new THREE.Vector3(...(npc.routine[0]?.location || [10, 0, 5]));
      group.position.copy(startPos);
      this.scene.add(group);
      this.npcsMap.set(npc.id, {
        group,
        data: npc,
        targetPos: startPos.clone(),
      });
    });
  }

  public updateTimeAndWeather(time: GameTime, weather: WeatherType) {
    // 24-hour cycle: hour 0-24 maps to sun position and sky colors
    const hourFraction = (time.hour + time.minute / 60) / 24;
    const sunAngle = (hourFraction - 0.25) * Math.PI * 2; // Sunrise ~6am, noon ~12, sunset ~18

    // Sun height & coordinates
    const sunDist = 55;
    const sunY = Math.sin(sunAngle) * sunDist;
    const sunX = Math.cos(sunAngle) * sunDist;
    this.sunLight.position.set(sunX, Math.max(sunY, -10), 20);

    const isNight = time.hour < 6 || time.hour >= 20;
    const isSunset = (time.hour >= 17 && time.hour < 20) || weather === 'sunset';
    const isRainy = weather === 'rainy';

    if (this.rainParticles) {
      this.rainParticles.visible = isRainy;
    }

    if (isNight) {
      this.scene.background = new THREE.Color(0x0A0F1D);
      this.scene.fog?.color.set(0x0F172A);
      this.sunLight.intensity = 0.15;
      this.sunLight.color.set(0x38BDF8);
      this.hemiLight.intensity = 0.3;
      this.hemiLight.color.set(0x1E293B);
    } else if (isSunset) {
      this.scene.background = new THREE.Color(0xFB923C);
      this.scene.fog?.color.set(0xFDBA74);
      this.sunLight.intensity = 1.3;
      this.sunLight.color.set(0xF97316);
      this.hemiLight.intensity = 0.65;
      this.hemiLight.color.set(0xFED7AA);
    } else if (isRainy) {
      this.scene.background = new THREE.Color(0x64748B);
      this.scene.fog?.color.set(0x94A3B8);
      this.sunLight.intensity = 0.6;
      this.sunLight.color.set(0xE2E8F0);
      this.hemiLight.intensity = 0.5;
    } else {
      // Crisp sunny day
      this.scene.background = new THREE.Color(0x38BDF8);
      this.scene.fog?.color.set(0xBAE6FD);
      this.sunLight.intensity = 1.4;
      this.sunLight.color.set(0xFFFBEB);
      this.hemiLight.intensity = 0.75;
      this.hemiLight.color.set(0xBAE6FD);
    }

    // Update NPC Routine locations based on current hour
    this.npcsMap.forEach(({ data, targetPos }) => {
      const activeStep = data.routine.reduce((prev, curr) => {
        return curr.hour <= time.hour ? curr : prev;
      }, data.routine[0]);
      if (activeStep) {
        targetPos.set(...activeStep.location);
      }
    });
  }

  public setPlumbobMood(moodColor: number) {
    if (this.plumbobMesh) {
      const mat = this.plumbobMesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(moodColor);
      mat.emissive.setHex(moodColor);
    }
  }

  // Set Build Mode Active / Inactive
  public setBuildMode(active: boolean, ghostItem?: PlacedFurniture) {
    this.buildModeActive = active;
    if (active) {
      if (!this.buildGridHelper) {
        this.buildGridHelper = new THREE.GridHelper(30, 30, 0x0284C7, 0x64748B);
        this.buildGridHelper.position.y = 0.02;
        this.scene.add(this.buildGridHelper);
      }
      this.buildGridHelper.visible = true;
    } else {
      if (this.buildGridHelper) this.buildGridHelper.visible = false;
      if (this.buildGhostMesh) {
        this.scene.remove(this.buildGhostMesh);
        this.buildGhostMesh = null;
      }
    }

    if (ghostItem) {
      if (this.buildGhostMesh) this.scene.remove(this.buildGhostMesh);
      this.buildGhostMesh = createFurnitureMesh(ghostItem);
      this.scene.add(this.buildGhostMesh);
    }
  }

  public rotateBuildGhost() {
    this.buildRotation = (this.buildRotation + Math.PI / 2) % (Math.PI * 2);
    if (this.buildGhostMesh) {
      this.buildGhostMesh.rotation.y = this.buildRotation;
    }
  }

  public getBuildGhostTransform(): { position: [number, number, number]; rotationY: number } | null {
    if (!this.buildGhostMesh) return null;
    return {
      position: [this.buildGhostMesh.position.x, this.buildGhostMesh.position.y, this.buildGhostMesh.position.z],
      rotationY: this.buildRotation,
    };
  }

  // Camera Zoom adjustment (from UI buttons or pinch gesture)
  public adjustZoom(delta: number) {
    this.cameraZoom = THREE.MathUtils.clamp(this.cameraZoom + delta, 0.55, 2.3);
  }

  // Camera Orbit Rotation (from UI buttons or drag gesture)
  public rotateCamera(radians: number) {
    this.cameraAngle += radians;
  }

  // Teleport player (e.g. via Map Quick Travel)
  public teleportPlayer(target: [number, number, number]) {
    this.playerPos.set(...target);
    this.playerTargetPos = null;
    if (this.playerGroup) {
      this.playerGroup.position.copy(this.playerPos);
    }
  }

  // Touch & Pointer event handling
  private setupEventListeners() {
    const el = this.renderer.domElement;

    // Pointer Down
    el.addEventListener('pointerdown', (e) => {
      this.isDraggingCamera = false;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    // Pointer Move
    el.addEventListener('pointermove', (e) => {
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      if (Math.hypot(dx, dy) > 8 && e.buttons > 0) {
        this.isDraggingCamera = true;
        // Rotate camera if dragging horizontally
        this.cameraAngle -= dx * 0.006;
        // Pitch / zoom slightly if dragging vertically
        this.adjustZoom(dy * 0.003);
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;
      }

      // In build mode, update ghost mesh position snapped to 0.5m grid
      if (this.buildModeActive && this.buildGhostMesh) {
        const rect = el.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersectPoint = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.groundPlane, intersectPoint)) {
          const snapX = Math.round(intersectPoint.x * 2) / 2;
          const snapZ = Math.round(intersectPoint.z * 2) / 2;
          this.buildGhostMesh.position.set(snapX, 0, snapZ);
        }
      }
    });

    // Pointer Up: Tap / Click Action
    el.addEventListener('pointerup', (e) => {
      if (this.isDraggingCamera) {
        this.isDraggingCamera = false;
        return;
      }

      // Resolve tap raycast
      const rect = el.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      // Check Furniture clicks first
      const furnitureIntersects = this.raycaster.intersectObjects(this.furnitureGroup.children, true);
      if (furnitureIntersects.length > 0) {
        let parent: THREE.Object3D | null = furnitureIntersects[0].object;
        while (parent && !parent.userData?.furnitureData) {
          parent = parent.parent;
        }
        if (parent?.userData?.furnitureData) {
          this.callbacks.onSelectObject(parent.userData.furnitureData);
          return;
        }
      }

      // Check NPC clicks
      for (const [, { group, data }] of this.npcsMap) {
        const npcIntersects = this.raycaster.intersectObjects(group.children, true);
        if (npcIntersects.length > 0) {
          this.callbacks.onSelectNPC(data);
          return;
        }
      }

      // Tap on Ground: Move Player here
      const groundHit = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.groundPlane, groundHit)) {
        this.playerTargetPos = groundHit.clone();
        this.playerTargetPos.y = 0;

        // Show waypoint beacon
        if (this.waypointRing) {
          this.waypointRing.position.set(groundHit.x, 0.05, groundHit.z);
          const mat = this.waypointRing.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.9;
        }

        this.callbacks.onTapGround([groundHit.x, groundHit.y, groundHit.z]);
      }
    });

    // Touch Pinch-to-Zoom
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.pinchStartDist = Math.hypot(dx, dy);
      }
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (this.pinchStartDist > 0) {
          const delta = (this.pinchStartDist - dist) * 0.005;
          this.adjustZoom(delta);
        }
        this.pinchStartDist = dist;
      }
    }, { passive: true });

    // Desktop Mouse Wheel Zoom
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.adjustZoom(e.deltaY * 0.001);
    }, { passive: false });

    // Handle Window Resize
    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // Main Render Loop (60 FPS)
  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);

    // 1. Player Locomotion
    this.updatePlayerMovement(dt);

    // 2. Camera Positioning & Tracking
    this.updateCamera(dt);

    // 3. NPC Autonomous Movement
    this.updateNPCs(dt);

    // 4. Environmental Animations (Ocean water, rain, beacon, plumbob)
    this.updateAtmosphere(dt);

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  };

  private updatePlayerMovement(dt: number) {
    if (!this.playerGroup) return;

    let moveDir = new THREE.Vector3(0, 0, 0);

    // Virtual Joystick takes precedence if active
    if (Math.abs(this.joystickVector.x) > 0.05 || Math.abs(this.joystickVector.y) > 0.05) {
      this.playerTargetPos = null; // cancel waypoint
      // Transform joystick input by camera angle so "Up" moves away from screen
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraAngle);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraAngle);
      moveDir.addScaledVector(right, this.joystickVector.x);
      moveDir.addScaledVector(forward, -this.joystickVector.y);
      moveDir.normalize();
      this.isMoving = true;
    } else if (this.playerTargetPos) {
      // Tap-to-move pathfinding
      const dist = this.playerPos.distanceTo(this.playerTargetPos);
      if (dist > 0.25) {
        moveDir.subVectors(this.playerTargetPos, this.playerPos).normalize();
        this.isMoving = true;
      } else {
        this.playerTargetPos = null;
        this.isMoving = false;
      }
    } else {
      this.isMoving = false;
    }

    if (this.isMoving && moveDir.lengthSq() > 0.01) {
      // Move player position
      this.playerPos.addScaledVector(moveDir, this.moveSpeed * dt);
      this.playerGroup.position.copy(this.playerPos);

      // Rotate player smoothly toward movement heading
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      this.playerRotation = THREE.MathUtils.lerp(this.playerRotation, targetAngle, 12 * dt);
      this.playerGroup.rotation.y = this.playerRotation;

      // Limb Walk Animation
      this.walkCycleTime += dt * 10;
      const swing = Math.sin(this.walkCycleTime) * 0.45;

      const leftArm = this.playerGroup.getObjectByName('LeftArm');
      const rightArm = this.playerGroup.getObjectByName('RightArm');
      const leftLeg = this.playerGroup.getObjectByName('LeftLeg');
      const rightLeg = this.playerGroup.getObjectByName('RightLeg');

      if (leftArm) leftArm.rotation.x = -swing;
      if (rightArm) rightArm.rotation.x = swing;
      if (leftLeg) leftLeg.rotation.x = swing;
      if (rightLeg) rightLeg.rotation.x = -swing;

      // Footstep sound trigger
      this.footstepTimer += dt;
      if (this.footstepTimer > 0.32) {
        this.footstepTimer = 0;
        this.callbacks.onFootstep();
      }
    } else {
      // Idle pose reset
      const leftArm = this.playerGroup.getObjectByName('LeftArm');
      const rightArm = this.playerGroup.getObjectByName('RightArm');
      const leftLeg = this.playerGroup.getObjectByName('LeftLeg');
      const rightLeg = this.playerGroup.getObjectByName('RightLeg');
      if (leftArm) leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, 8 * dt);
      if (rightArm) rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 8 * dt);
      if (leftLeg) leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, 8 * dt);
      if (rightLeg) rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, 8 * dt);
    }
  }

  private updateCamera(dt: number) {
    // Overhead Sims-style camera following player position with smooth damping
    const radius = 18 * this.cameraZoom;
    const height = 14 * this.cameraZoom;

    const camX = this.playerPos.x + Math.sin(this.cameraAngle) * radius;
    const camZ = this.playerPos.z + Math.cos(this.cameraAngle) * radius;
    const camY = this.playerPos.y + height;

    const targetCamPos = new THREE.Vector3(camX, camY, camZ);
    this.camera.position.lerp(targetCamPos, 6 * dt);
    this.camera.lookAt(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
  }

  private updateNPCs(dt: number) {
    this.npcsMap.forEach(({ group, targetPos }) => {
      const pos = group.position;
      const dist = pos.distanceTo(targetPos);
      if (dist > 0.5) {
        const dir = new THREE.Vector3().subVectors(targetPos, pos).normalize();
        pos.addScaledVector(dir, 2.2 * dt);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, Math.atan2(dir.x, dir.z), 6 * dt);

        // Simple walking animation
        const swing = Math.sin(this.clock.getElapsedTime() * 6) * 0.35;
        const leftLeg = group.getObjectByName('LeftLeg');
        const rightLeg = group.getObjectByName('RightLeg');
        if (leftLeg) leftLeg.rotation.x = swing;
        if (rightLeg) rightLeg.rotation.x = -swing;
      }
    });
  }

  private updateAtmosphere(dt: number) {
    const elapsed = this.clock.getElapsedTime();

    // 1. Plumbob Diamond Rotation & Bobbing
    if (this.plumbobMesh) {
      this.plumbobMesh.rotation.y += 2.5 * dt;
      this.plumbobMesh.position.y = 2.25 + Math.sin(elapsed * 3) * 0.08;
    }

    // 2. Waypoint Ring Fadeout
    if (this.waypointRing) {
      const mat = this.waypointRing.material as THREE.MeshBasicMaterial;
      if (mat.opacity > 0) {
        mat.opacity = Math.max(0, mat.opacity - 1.8 * dt);
        this.waypointRing.scale.addScalar(0.4 * dt);
      }
    }

    // 3. Ocean Water Ripple
    if (this.oceanMesh) {
      this.oceanMesh.position.y = -0.05 + Math.sin(elapsed * 1.5) * 0.04;
    }

    // 4. Rain Particles Fall
    if (this.rainParticles && this.rainParticles.visible) {
      const posAttr = this.rainParticles.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] -= 22 * dt;
        if (arr[i] < 0) {
          arr[i] = 40;
        }
      }
      posAttr.needsUpdate = true;
    }
  }

  public getPlayerPosition(): [number, number, number] {
    return [this.playerPos.x, this.playerPos.y, this.playerPos.z];
  }

  public dispose() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
