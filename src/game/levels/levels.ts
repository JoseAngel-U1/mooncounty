import type { SceneKey } from '../scenes/sceneRegistry';

type LevelDetails = {
  readonly title: string;
  readonly description: string;
  readonly image: string;
};

type LevelDefinition = LevelDetails & (
  | { readonly status: 'available'; readonly sceneKey: SceneKey }
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
    sceneKey: 'exploration',
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
