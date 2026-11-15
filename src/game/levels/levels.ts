import type { SceneKey } from '../scenes/sceneRegistry';

type LevelDetails = {
  readonly title: string;
  readonly description: string;
  readonly image: string;
};

type LevelDefinition = LevelDetails & (
  | { readonly status: 'available'; readonly kind: 'phaser'; readonly sceneKey: SceneKey }
  | { readonly status: 'available'; readonly kind: 'page'; readonly path: string }
  | { readonly status: 'locked'; readonly sceneKey: null }
);

export type Level = LevelDefinition & { readonly id: string };
export type AvailableLevel = Extract<Level, { status: 'available' }>;

// Las claves de este registro son los identificadores únicos. Un nivel
// bloqueado no necesita una escena ficticia para aparecer en el menú.
const levelRegistry: Readonly<Record<string, LevelDefinition>> = {
  earth: {
    title: 'Tierra',
    description: 'Tu punto de partida. Explora el escenario provisional y familiarízate con los controles.',
    image: '/assets/earth.svg',
    status: 'available',
    kind: 'phaser',
    sceneKey: 'exploration',
  },
  'moon-journey': {
    title: 'Viaje a la Luna',
    description: 'Segundo nivel. Enfréntate a los AVE durante el trayecto hacia la Luna.',
    image: '/assets/moon.svg',
    status: 'available',
    kind: 'page',
    path: '/moon-journey',
  },
  moon: {
    title: 'Luna',
    description: 'Un destino por descubrir. Este nivel todavía no está disponible.',
    image: '/assets/moon.svg',
    status: 'locked',
    sceneKey: null,
  },
};

export const levels: readonly Level[] = Object.entries(levelRegistry).map(
  ([id, definition]) => ({ id, ...definition }),
);

export function getLevelById(id: string | undefined): Level | undefined {
  return levels.find((level) => level.id === id);
}
