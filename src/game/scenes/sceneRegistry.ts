import { EarthScene } from '../levels/earth/EarthScene';

// Registrar aquí únicamente escenas implementadas. Cada entrada crea una
// instancia nueva al entrar al juego; no se reutilizan escenas destruidas.
export const sceneRegistry = {
  earth: EarthScene,
};

export type SceneKey = keyof typeof sceneRegistry;
