export type InteractionContext = {
  showMessage: (message: string) => void;
};

export type InteractiveObject = {
  id: string;
  x: number;
  y: number;
  radius: number;
  prompt?: string;
  action: (context: InteractionContext) => void;
};

export function findNearestInteractiveObject(
  objects: readonly InteractiveObject[],
  position: { x: number; y: number },
): InteractiveObject | undefined {
  let nearest: InteractiveObject | undefined;
  let nearestDistance = Infinity;

  for (const object of objects) {
    const distance = Math.hypot(object.x - position.x, object.y - position.y);
    if (distance <= object.radius && distance < nearestDistance) {
      nearest = object;
      nearestDistance = distance;
    }
  }

  return nearest;
}
