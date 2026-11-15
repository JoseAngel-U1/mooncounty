import type Phaser from 'phaser';

export const EARTH_NPC_IDLE_FRAME_RANGE = [32, 39] as const;
export const EARTH_NPC_IDLE_FRAME_RATE = 8;

type NpcKind = 'engineer' | 'coordinator';

type NpcVariant = {
  kind: NpcKind;
  textureKey: string;
  folder: string;
  prefix: string;
};

const VARIANTS: readonly NpcVariant[] = [
  {
    kind: 'engineer',
    textureKey: 'earth-npc-engineer',
    folder: 'ingeniero',
    prefix: 'NPC_Staff_v1',
  },
  {
    kind: 'coordinator',
    textureKey: 'earth-npc-coordinator',
    folder: 'npc_staff',
    prefix: 'NPC_Staff_v2',
  },
];

export type EarthNpcAnimationKeys = Record<NpcKind, string>;

function getVariant(kind: NpcKind): NpcVariant {
  return VARIANTS.find((variant) => variant.kind === kind) ?? VARIANTS[0];
}

function frameTextureKey(variant: NpcVariant, frame: number): string {
  return `${variant.textureKey}-${frame}`;
}

export function getEarthNpcTextureKey(kind: NpcKind): string {
  return frameTextureKey(getVariant(kind), EARTH_NPC_IDLE_FRAME_RANGE[0]);
}

export function getEarthNpcAnimationKeys(): EarthNpcAnimationKeys {
  return {
    engineer: `${getVariant('engineer').textureKey}-idle`,
    coordinator: `${getVariant('coordinator').textureKey}-idle`,
  };
}

export function loadEarthNpcTextures(scene: Phaser.Scene): void {
  const [start, end] = EARTH_NPC_IDLE_FRAME_RANGE;
  for (const variant of VARIANTS) {
    for (let frame = start; frame <= end; frame++) {
      const textureKey = frameTextureKey(variant, frame);
      if (scene.textures.exists(textureKey)) continue;

      const path = `/assets/characters/${variant.folder}/${variant.prefix}_32x${frame}.png`;
      scene.load.image(textureKey, encodeURI(path));
    }
  }
}

export function createEarthNpcIdleAnimations(scene: Phaser.Scene): EarthNpcAnimationKeys {
  const keys = getEarthNpcAnimationKeys();
  const [start, end] = EARTH_NPC_IDLE_FRAME_RANGE;
  const frames = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  for (const variant of VARIANTS) {
    const key = keys[variant.kind];
    if (scene.anims.exists(key)) continue;

    scene.anims.create({
      key,
      frames: frames.map((frame) => ({ key: frameTextureKey(variant, frame) })),
      frameRate: EARTH_NPC_IDLE_FRAME_RATE,
      repeat: -1,
    });
  }

  return keys;
}
