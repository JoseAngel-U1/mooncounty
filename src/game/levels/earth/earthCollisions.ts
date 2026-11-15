export type CollisionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

export const DEBUG_COLLISIONS = false;

export const EARTH_COLLISION_RECTS: readonly CollisionRect[] = [
  { x: 34, y: 3, width: 1406, height: 22, label: 'muro-norte' },
  { x: 30, y: 31, width: 21, height: 924, label: 'muro-oeste' },
  { x: 1417, y: 0, width: 24, height: 1084, label: 'muro-este' },
  { x: 51, y: 24, width: 675, height: 126, label: 'hangar-norte' },
  { x: 1108, y: 310, width: 20, height: 285, label: 'anexo-norte' },
  { x: 1108, y: 570, width: 117, height: 30, label: 'anexo-norte-2' },
  { x: 1247, y: 34, width: 150, height: 72, label: 'modulo-noreste' },
  { x: 1347, y: 61, width: 56, height: 137, label: 'torre-noreste' },
  { x: 710, y: 24, width: 48, height: 240, label: 'modulo-oeste' },
  { x: 758, y: 25, width: 370, height: 300, label: 'modulo-central' },
  { x: 830, y: 311, width: 288, height: 52, label: 'modulo-este' },
  { x: 180, y: 260, width: 400, height: 170, label: 'edificio-oeste' },
  { x: 65, y: 214, width: 102, height: 274, label: 'almacen-oeste' },
  { x: 62, y: 499, width: 225, height: 285, label: 'edificio-suroeste' },
  { x: 771, y: 433, width: 224, height: 286, label: 'edificio-centro' },
  { x: 1246, y: 440, width: 162, height: 229, label: 'elebador' },
  { x: 1006, y: 719, width: 403, height: 310, label: 'hangar-sureste' },
  { x: 359, y: 860, width: 220, height: 106, label: 'muro-sur' },
  { x: 654, y: 858, width: 108, height: 173, label: 'pilar-sur' },
  { x: 774, y: 976, width: 222, height: 52, label: 'edificio-sur' },
  { x: 301, y: 538, width: 226, height: 112, label: 'nuevo-1' },
  { x: 531, y: 559, width: 52, height: 91, label: 'nuevo-2' },
  { x: 182, y: 856, width: 100, height: 168, label: 'nuevo-3' },
  { x: 284, y: 1028, width: 367, height: 25, label: 'nuevo-4' },
  { x: 42, y: 969, width: 131, height: 31, label: 'nuevo-5' },
  { x: 295, y: 642, width: 111, height: 47, label: 'nuevo-6' },
  { x: 1243, y: 321, width: 100, height: 43, label: 'nuevo-7' },
  { x: 1243, y: 369, width: 171, height: 22, label: 'nuevo-8' },
  { x: 1401, y: 669, width: 8, height: 54, label: 'nuevo-10' },
  { x: 1247, y: 713, width: 158, height: 8, label: 'nuevo-9' },
  { x: 1399, y: 394, width: 9, height: 40, label: 'entrada-superior' },
];
