import type Phaser from 'phaser';

export const EARTH_ASTRONAUT_SCALE = 2;

export const EARTH_PLAYER_NO_HELMET_KEY = 'earth-player-no-helmet';
export const EARTH_PLAYER_WITH_HELMET_KEY = 'earth-player-with-helmet';

export type EarthPlayerAnimationKeys = {
  idle: string;
  walkSide: string;
  walkUp: string;
  walkDown: string;
};

type EarthPlayerVariant = {
  textureKey: string;
  folder: string;
  prefix: string;
};

const VARIANTS: readonly EarthPlayerVariant[] = [
  {
    textureKey: EARTH_PLAYER_NO_HELMET_KEY,
    folder: 'astronauta_sin_casco',
    prefix: 'astronauta_sin_casco',
  },
  {
    textureKey: EARTH_PLAYER_WITH_HELMET_KEY,
    folder: 'astronauta_con _casco',
    prefix: 'astronauta_con casco',
  },
];

const FRAME_RANGES = {
  idle: [1, 16],
  walkSide: [25, 32],
  walkUp: [33, 38],
  walkDown: [39, 44],
} as const satisfies Record<keyof EarthPlayerAnimationKeys, readonly [number, number]>;

const FRAME_RATES: Record<keyof EarthPlayerAnimationKeys, number> = {
  idle: 8,
  walkSide: 10,
  walkUp: 10,
  walkDown: 10,
};

function frameTextureKey(variantKey: string, frame: number): string {
  return `${variantKey}-${frame}`;
}

function framesInRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getVariant(hasSpacesuit: boolean): EarthPlayerVariant {
  return hasSpacesuit ? VARIANTS[1] : VARIANTS[0];
}

export function getEarthPlayerTextureKey(hasSpacesuit: boolean): string {
  return frameTextureKey(getVariant(hasSpacesuit).textureKey, 1);
}

export function loadEarthPlayerTextures(scene: Phaser.Scene): void {
  for (const variant of VARIANTS) {
    const frames = new Set<number>();
    for (const [start, end] of Object.values(FRAME_RANGES)) {
      for (const frame of framesInRange(start, end)) frames.add(frame);
    }

    for (const frame of frames) {
      const textureKey = frameTextureKey(variant.textureKey, frame);
      if (scene.textures.exists(textureKey)) continue;

      const path = `/assets/characters/${variant.folder}/${variant.prefix}${frame}.png`;
      scene.load.image(textureKey, encodeURI(path));
    }
  }
}

export function createEarthPlayerAnimations(
  scene: Phaser.Scene,
  hasSpacesuit: boolean,
): EarthPlayerAnimationKeys {
  const variant = getVariant(hasSpacesuit);
  const keys: EarthPlayerAnimationKeys = {
    idle: `${variant.textureKey}-idle`,
    walkSide: `${variant.textureKey}-walk-side`,
    walkUp: `${variant.textureKey}-walk-up`,
    walkDown: `${variant.textureKey}-walk-down`,
  };

  for (const action of Object.keys(FRAME_RANGES) as Array<keyof EarthPlayerAnimationKeys>) {
    if (scene.anims.exists(keys[action])) continue;

    const [start, end] = FRAME_RANGES[action];
    scene.anims.create({
      key: keys[action],
      frames: framesInRange(start, end).map((frame) => ({
        key: frameTextureKey(variant.textureKey, frame),
      })),
      frameRate: FRAME_RATES[action],
      repeat: -1,
    });
  }

  return keys;
}
