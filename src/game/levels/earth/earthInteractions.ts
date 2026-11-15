import type { InteractiveObject } from '../../interactions/interactiveObject';
import type { EarthMissionState } from './earthMissionState';
import { EARTH_LAUNCH_CODE } from './earthMissionConfig';

// Coordenadas y radio en píxeles del mapa original, sin aplicar el zoom.
// AJUSTAR: posición provisional del coordinador; reemplazar por la definitiva.
export const EARTH_COORDINATOR_POSITION = { x: 930, y: 850 } as const;
export const EARTH_ENGINEER_POSITION = { x: 164, y: 108 } as const;
export const EARTH_ENGINEER_INTERACTION_RADIUS = 90;
export const EARTH_COORDINATES_RECT = { x: 221, y: 431, width: 45, height: 41 } as const;
export const EARTH_COORDINATES_POSITION = {
  x: EARTH_COORDINATES_RECT.x + EARTH_COORDINATES_RECT.width / 2,
  y: EARTH_COORDINATES_RECT.y + EARTH_COORDINATES_RECT.height / 2,
} as const;

export type EarthInteractionHandlers = {
  onSpacesuitEquipped?: () => void;
};

export function createEarthInteractions(
  missionState: EarthMissionState,
  handlers: EarthInteractionHandlers = {},
): readonly InteractiveObject[] {
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
        handlers.onSpacesuitEquipped?.();
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
          showMessage('Coordinador: Necesitamos las coordenadas de lanzamiento. Consíguelas, entrégalas al ingeniero y regresa con los datos de trayectoria.');
          return;
        }

        if (missionState.launchCode !== null) {
          showMessage(`Coordinador: Tu código de lanzamiento es ${missionState.launchCode}. Dirígete a la nave.`);
          return;
        }

        if (missionState.hasTrajectoryData) {
          missionState.launchCode = EARTH_LAUNCH_CODE;
          showMessage(`Coordinador: Datos de trayectoria recibidos. Tu código de lanzamiento es ${missionState.launchCode}.`);
          return;
        }

        if (missionState.hasCoordinates) {
          showMessage('Coordinador: Entrega las coordenadas al ingeniero y regresa con los datos de trayectoria.');
          return;
        }

        showMessage('Coordinador: Consigue las coordenadas y entrégalas al ingeniero.');
      },
    },
    {
      id: 'ingeniero',
      x: EARTH_ENGINEER_POSITION.x,
      y: EARTH_ENGINEER_POSITION.y,
      radius: EARTH_ENGINEER_INTERACTION_RADIUS,
      prompt: 'Presiona E para hablar con el ingeniero',
      action: ({ showMessage }) => {
        if (!missionState.hasSpacesuit) {
          showMessage('Ingeniero: Primero debes recoger un traje espacial.');
          return;
        }

        if (!missionState.coordinatesRequested) {
          showMessage('Ingeniero: Necesito las coordenadas para poder proporcionarte los datos de trayectoria');
          return;
        }

        if (missionState.hasTrajectoryData) {
          showMessage(missionState.launchCode !== null
            ? 'Ingeniero: Ya tienes los datos y el código de lanzamiento. Dirígete a la nave;'
            : 'Ingeniero: Ya te entregué los datos de trayectoria. Regresa con el coordinador.');
          return;
        }

        if (!missionState.hasCoordinates) {
          showMessage('Ingeniero: Consigue las coordenadas y tráemelas para preparar los datos de trayectoria.');
          return;
        }

        missionState.hasCoordinates = false;
        missionState.hasTrajectoryData = true;
        showMessage('Ingeniero: Coordenadas recibidas. Aquí tienes los datos de trayectoria; entrégalos al coordinador.');
      },
    },
    {
      id: 'coordenadas-lanzamiento',
      x: EARTH_COORDINATES_POSITION.x,
      y: EARTH_COORDINATES_POSITION.y,
      radius: 60,
      prompt: 'Presiona E para obtener coordenadas',
      action: ({ showMessage }) => {
        if (!missionState.hasSpacesuit) {
          showMessage('Primero debes recoger un traje espacial.');
          return;
        }

        if (!missionState.coordinatesRequested) {
          showMessage('Que papeles tan curioses quisas los necesite en algun momento');
          return;
        }

        if (missionState.hasTrajectoryData || missionState.launchCode !== null) {
          showMessage('Ya obtuviste las coordenadas y las entregaste al ingeniero.');
          return;
        }

        if (missionState.hasCoordinates) {
          showMessage('Ya tienes las coordenadas de lanzamiento. Entrégalas al ingeniero.');
          return;
        }

        missionState.hasCoordinates = true;
        showMessage('Coordenadas de lanzamiento obtenidas. Entrégalas al ingeniero');
      },
    },
  ];
}
