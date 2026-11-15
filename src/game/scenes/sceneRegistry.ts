import { ExplorationScene } from './ExplorationScene';
import { ExteriorScene } from './ExteriorScene';
import { ShipInteriorScene } from './ShipInteriorScene';

// Registrar aquí únicamente escenas implementadas. Cada entrada crea una
// instancia nueva al entrar al juego; no se reutilizan escenas destruidas.
export const sceneRegistry = {
  exploration: ExplorationScene,
  'ship-interior': ShipInteriorScene,
  'exterior-scene': ExteriorScene,
};

export 
type SceneKey = keyof typeof sceneRegistry;
