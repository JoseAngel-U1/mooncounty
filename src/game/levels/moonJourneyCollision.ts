// Geometría de colisión del interior del nivel 2 («Viaje a la Luna»).
// Exportada desde el arte con el editor de cuerpos físicos (physics-body (4).json)
// y transcrita aquí como fuente única de verdad, en píxeles del mapa 900 × 500.

export type CollisionPoint = readonly [x: number, y: number];

export type CollisionPolygon = {
  readonly kind: 'polygon';
  readonly points: readonly CollisionPoint[];
};

export type CollisionCircle = {
  readonly kind: 'circle';
  readonly x: number;
  readonly y: number;
  readonly radius: number;
};

export type CollisionShape = CollisionPolygon | CollisionCircle;

export const SHIP_INTERIOR_WIDTH = 900;
export const SHIP_INTERIOR_HEIGHT = 500;

// Zona libre de la sala lunar (izquierda), lejos del mobiliario.
export const SHIP_INTERIOR_SPAWN_POINT = { x: 330, y: 250 } as const;

export const SHIP_INTERIOR_COLLISION: readonly CollisionShape[] = [
  // --- Sala lunar (izquierda): casco inclinado ---
  { kind: 'polygon', points: [[98, 448], [474, 270], [472, 459]] },
  { kind: 'polygon', points: [[110, 63], [471, 229], [469, 36]] },
  { kind: 'polygon', points: [[20, 31], [110, 31], [110, 451], [20, 451]] },

  // --- Mobiliario de la sala lunar ---
  { kind: 'circle', x: 143, y: 117, radius: 18 },
  { kind: 'circle', x: 143, y: 384, radius: 20 },
  { kind: 'polygon', points: [[124, 262], [124, 327], [131, 336], [144, 334], [150, 323], [148, 265], [143, 257]] },
  { kind: 'polygon', points: [[124, 174], [125, 235], [130, 241], [140, 241], [145, 237], [147, 177], [142, 167]] },
  { kind: 'polygon', points: [[163, 223], [170, 213], [206, 214], [211, 220], [210, 237], [206, 239], [170, 241], [162, 238]] },
  { kind: 'polygon', points: [[164, 158], [164, 196], [209, 198], [207, 157]] },
  { kind: 'polygon', points: [[164, 252], [163, 296], [210, 297], [211, 251]] },
  { kind: 'polygon', points: [[164, 306], [163, 353], [210, 351], [211, 307]] },
  // --- Asientos: una sola pieza por respaldo, recortada en horizontal ---
  // Sin franja inferior ni forma de L: la parte baja del asiento queda libre
  // para caminar sobre el cojín, entrar detrás del asiento medio y llegar a la salida.
  { kind: 'polygon', points: [[240, 320], [236, 290], [223, 293], [225, 320]] },
  { kind: 'polygon', points: [[247, 222], [252, 250], [269, 250], [261, 225]] },
  { kind: 'polygon', points: [[220, 148], [226, 180], [242, 180], [236, 148]] },

  // --- Sala de mando (derecha) ---
  { kind: 'polygon', points: [[542, 133], [542, 202], [551, 206], [562, 206], [570, 199], [570, 133], [562, 126]] },
  { kind: 'polygon', points: [[725, 243], [727, 329], [759, 328], [758, 242]] },
  { kind: 'polygon', points: [[543, 335], [716, 334], [713, 386], [541, 385]] },
  { kind: 'polygon', points: [[699, 53], [804, 56], [802, 143], [698, 144]] },

  // --- Muros del pasillo entre ambas salas (puerta en y 229–273) ---
  { kind: 'polygon', points: [[467, 35], [539, 35], [539, 229], [467, 229]] },
  { kind: 'polygon', points: [[474, 273], [538, 273], [538, 499], [474, 499]] },

  // --- Casco exterior de la sala de mando ---
  { kind: 'polygon', points: [[524, 0], [880, 0], [880, 55], [524, 55]] },
  { kind: 'polygon', points: [[793, 68], [894, 73], [894, 491], [797, 492]] },
  { kind: 'polygon', points: [[538, 448], [835, 448], [835, 497], [538, 497]] },
  { kind: 'polygon', points: [[531, 121], [616, 36], [530, 37]] },
  { kind: 'polygon', points: [[718, 40], [803, 124], [806, 41]] },
  { kind: 'polygon', points: [[733, 451], [803, 377], [806, 449]] },
  { kind: 'polygon', points: [[538, 389], [596, 446], [538, 448]] },
  { kind: 'polygon', points: [[666, 60], [697, 144], [697, 58]] },
];
