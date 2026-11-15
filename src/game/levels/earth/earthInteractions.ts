import type { InteractiveObject } from '../../interactions/interactiveObject';
import type { EarthMissionState } from './earthMissionState';

// Coordenadas y radio en píxeles del mapa original, sin aplicar el zoom.
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
  ];
}
