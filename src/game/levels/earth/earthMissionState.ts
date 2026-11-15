export type EarthMissionState = {
  hasSpacesuit: boolean;
  coordinatesRequested: boolean;
};

export function createEarthMissionState(): EarthMissionState {
  return {
    hasSpacesuit: false,
    coordinatesRequested: false,
  };
}
