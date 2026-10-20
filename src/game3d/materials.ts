import * as THREE from 'three';

// Procedural texture cache to avoid redundant canvas rendering
const textureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * Procedural Wood Parquet Texture for Interior Flooring
 */
export function getWoodParquetTexture(): THREE.CanvasTexture {
  if (textureCache['wood_parquet']) return textureCache['wood_parquet'];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#C29B72';
  ctx.fillRect(0, 0, 512, 512);

  const plankHeight = 32;
  for (let y = 0; y < 512; y += plankHeight) {
    const isShifted = (y / plankHeight) % 2 === 0;
    const xOffset = isShifted ? 0 : 64;
    for (let x = -64 + xOffset; x < 576; x += 128) {
      const shade = 190 + Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.78)}, ${Math.floor(shade * 0.55)})`;
      ctx.fillRect(x + 1, y + 1, 126, plankHeight - 2);

      // Wood grain lines
      ctx.strokeStyle = 'rgba(90, 55, 30, 0.12)';
      ctx.lineWidth = 1;
      for (let g = 0; g < 4; g++) {
        const lineY = y + 4 + Math.random() * (plankHeight - 8);
        ctx.beginPath();
        ctx.moveTo(x + 2, lineY);
        ctx.lineTo(x + 124, lineY + (Math.random() - 0.5) * 4);
        ctx.stroke();
      }
    }
    // Grout line
    ctx.fillStyle = 'rgba(50, 30, 15, 0.4)';
    ctx.fillRect(0, y, 512, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(4, 4);
  textureCache['wood_parquet'] = texture;
  return texture;
}

/**
 * Procedural Tile Texture for Bathrooms & Kitchens
 */
export function getTileTexture(): THREE.CanvasTexture {
  if (textureCache['tile']) return textureCache['tile'];

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(0, 0, 256, 256);

  const tileSize = 64;
  for (let y = 0; y < 256; y += tileSize) {
    for (let x = 0; x < 256; x += tileSize) {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
      // Subtle gloss gradient
      const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(1, 'rgba(203, 213, 225, 0.3)');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(6, 6);
  textureCache['tile'] = texture;
  return texture;
}

/**
 * Procedural Road Asphalt Texture with Lane Lines
 */
export function getRoadTexture(): THREE.CanvasTexture {
  if (textureCache['road']) return textureCache['road'];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#262A33';
  ctx.fillRect(0, 0, 512, 512);

  // Road grit noise
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const val = 40 + Math.random() * 30;
    ctx.fillStyle = `rgb(${val}, ${val}, ${val + 5})`;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Center dashed yellow line
  ctx.fillStyle = '#FBBF24';
  for (let y = 16; y < 512; y += 64) {
    ctx.fillRect(252, y, 8, 36);
  }

  // White edge lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(16, 0, 6, 512);
  ctx.fillRect(490, 0, 6, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(1, 10);
  textureCache['road'] = texture;
  return texture;
}

/**
 * Procedural Cobblestone / Sidewalk Texture
 */
export function getSidewalkTexture(): THREE.CanvasTexture {
  if (textureCache['sidewalk']) return textureCache['sidewalk'];

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(0, 0, 256, 256);

  const slabSize = 64;
  for (let y = 0; y < 256; y += slabSize) {
    for (let x = 0; x < 256; x += slabSize) {
      const shade = 210 + Math.floor(Math.random() * 20);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade - 5})`;
      ctx.fillRect(x + 1, y + 1, slabSize - 2, slabSize - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(12, 12);
  textureCache['sidewalk'] = texture;
  return texture;
}

/**
 * Procedural Sandy Beach Texture
 */
export function getSandTexture(): THREE.CanvasTexture {
  if (textureCache['sand']) return textureCache['sand'];

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#EED9A3';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 3000; i++) {
    const rx = Math.random() * 256;
    const ry = Math.random() * 256;
    const s = Math.random() > 0.5 ? 245 : 220;
    ctx.fillStyle = `rgb(${s}, ${Math.floor(s * 0.88)}, ${Math.floor(s * 0.65)})`;
    ctx.fillRect(rx, ry, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(8, 8);
  textureCache['sand'] = texture;
  return texture;
}

/**
 * Shared PBR Materials
 */
export const Materials = {
  // Coastal Grass Lawn
  lawn: new THREE.MeshStandardMaterial({
    color: 0x48BB78,
    roughness: 0.85,
    metalness: 0.05,
  }),
  // Clean Modern House Walls
  wallWhite: new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.65,
    metalness: 0.05,
  }),
  wallAccent: new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    roughness: 0.6,
    metalness: 0.1,
  }),
  roofTile: new THREE.MeshStandardMaterial({
    color: 0xEA580C, // Terracotta coastal roof
    roughness: 0.7,
    metalness: 0.1,
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: 0x93C5FD,
    transmission: 0.85,
    opacity: 0.7,
    transparent: true,
    roughness: 0.1,
    ior: 1.5,
    depthWrite: false,
  }),
  chrome: new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    metalness: 0.95,
    roughness: 0.15,
  }),
  gold: new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    metalness: 0.85,
    roughness: 0.25,
  }),
  woodDark: new THREE.MeshStandardMaterial({
    color: 0x5C3A21,
    roughness: 0.75,
    metalness: 0.05,
  }),
  woodLight: new THREE.MeshStandardMaterial({
    color: 0xD4B996,
    roughness: 0.65,
    metalness: 0.05,
  }),
  fabricEmerald: new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.9,
    metalness: 0.02,
  }),
  plumbobGreen: new THREE.MeshStandardMaterial({
    color: 0x10B981,
    emissive: 0x059669,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.3,
  }),
  // Ocean Water with gentle translucency
  water: new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.82,
  }),
};
