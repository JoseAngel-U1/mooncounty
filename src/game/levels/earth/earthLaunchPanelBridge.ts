export type EarthLaunchPanelRequest = {
  completed: boolean;
  onCompleted: () => void;
  onClose: () => void;
};

type EarthLaunchPanelListener = (request: EarthLaunchPanelRequest) => void;

let listener: EarthLaunchPanelListener | null = null;

export function setEarthLaunchPanelListener(next: EarthLaunchPanelListener | null): void {
  listener = next;
}

export function requestEarthLaunchPanel(request: EarthLaunchPanelRequest): boolean {
  if (!listener) return false;

  listener(request);
  return true;
}
