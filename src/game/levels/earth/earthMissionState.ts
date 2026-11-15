export type EarthMissionState = {
  hasSpacesuit: boolean;
  coordinatesRequested: boolean;
  hasCoordinates: boolean;
  hasTrajectoryData: boolean;
  launchCode: string | null;
  missionCompleted: boolean;
};

export function createEarthMissionState(): EarthMissionState {
  return {
    hasSpacesuit: false,
    coordinatesRequested: false,
    hasCoordinates: false,
    hasTrajectoryData: false,
    launchCode: null,
    missionCompleted: false,
  };
}
