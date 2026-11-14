import { ExplorationScene } from './ExplorationScene';

// Registrar aquí únicamente escenas implementadas. Cada entrada crea una
// instancia nueva al entrar al juego; no se reutilizan escenas destruidas.
export const sceneRegistry = {
  exploration: ExplorationScene,
};

export type SceneKey = keyof typeof sceneRegistry;
