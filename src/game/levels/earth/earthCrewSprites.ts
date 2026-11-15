import type Phaser from 'phaser';

export const EARTH_CREW_SCALE = 2;
const TEXTURE_PREFIX = 'earth-crew';

export type EarthCrewAnimationKeys = {
  idle: string;
  walkSide: string;
  walkUp: string;
  walkDown: string;
};

// Numeración de archivos: 32 corresponde al frame lógico 1.
// Sitting (archivos 48–55) no se carga ni se utiliza.
const FRAME_RANGES = {
  idle: [32, 47],
  walkSide: [56, 63],
  walkUp: [64, 69],
  walkDown: [70, 75],
} as const satisfies Record<keyof EarthCrewAnimationKeys, readonly [number, number]>;

function framesInRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function frameTextureKey(frame: number): string {
  return `${TEXTURE_PREFIX}-${frame}`;
}

export function getEarthCrewTextureKey(): string {
  return frameTextureKey(FRAME_RANGES.idle[0]);
}

export function loadEarthCrewTextures(scene: Phaser.Scene): void {
  for (const [start, end] of Object.values(FRAME_RANGES)) {
    for (const frame of framesInRange(start, end)) {
      const key = frameTextureKey(frame);
      if (scene.textures.exists(key)) continue;
      scene.load.image(key, `/assets/characters/tripulante/NPC_v3_32x${frame}.png`);
    }
  }
}

export function createEarthCrewAnimations(scene: Phaser.Scene): EarthCrewAnimationKeys {
  const keys: EarthCrewAnimationKeys = {
    idle: `${TEXTURE_PREFIX}-idle`,
    walkSide: `${TEXTURE_PREFIX}-walk-side`,
    walkUp: `${TEXTURE_PREFIX}-walk-up`,
    walkDown: `${TEXTURE_PREFIX}-walk-down`,
  };

  for (const action of Object.keys(FRAME_RANGES) as Array<keyof EarthCrewAnimationKeys>) {
    if (scene.anims.exists(keys[action])) continue;
    const [start, end] = FRAME_RANGES[action];
    scene.anims.create({
      key: keys[action],
      frames: framesInRange(start, end).map((frame) => ({ key: frameTextureKey(frame) })),
      frameRate: action === 'idle' ? 8 : 10,
      repeat: -1,
    });
  }
  return keys;
}
