export const EARTH_LAUNCH_CODE = '4826';
export const EARTH_LAUNCH_CODE_LENGTH = EARTH_LAUNCH_CODE.length;

export function isEarthLaunchCode(value: string): boolean {
  return value === EARTH_LAUNCH_CODE;
}
