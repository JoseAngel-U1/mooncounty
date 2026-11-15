import type { InteractiveObject } from '../../interactions/interactiveObject';
import type { EarthMissionState } from './earthMissionState';

// Coordenadas y radio en píxeles del mapa original, sin aplicar el zoom.
// AJUSTAR: posición provisional del coordinador; reemplazar por la definitiva.
export const EARTH_COORDINATOR_POSITION = { x: 930, y: 850 } as const;

export function createEarthInteractions(missionState: EarthMissionState): readonly InteractiveObject[] {
  return [
    {
      id: 'trajes-espaciales',
      x: 470,
      y: 945,
      radius: 100,
      prompt: 'Presiona E para recoger traje',
      action: ({ showMessage }) => {
        if (missionState.hasSpacesuit) {
          showMessage('Ya tienes un traje espacial');
          return;
        }

        missionState.hasSpacesuit = true;
        showMessage('Traje espacial equipado');
      },
    },
    {
      id: 'coordinador',
      x: EARTH_COORDINATOR_POSITION.x,
      y: EARTH_COORDINATOR_POSITION.y,
      radius: 90,
      prompt: 'Presiona E para hablar',
      action: ({ showMessage }) => {
        if (!missionState.hasSpacesuit) {
          showMessage('Coordinador: Primero debes recoger un traje espacial');
          return;
        }

        if (!missionState.coordinatesRequested) {
          missionState.coordinatesRequested = true;
          showMessage('Coordinador: Necesitamos las coordenadas de lanzamiento. Encuéntralas y regresa conmigo');
          return;
        }

        showMessage('Coordinador: Aún faltan las coordenadas de lanzamiento.');
      },
    },
  ];
}
