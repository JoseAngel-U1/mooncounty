export type EarthMissionState = {
  hasSpacesuit: boolean;
};

export function createEarthMissionState(): EarthMissionState {
  return { hasSpacesuit: false };
}
