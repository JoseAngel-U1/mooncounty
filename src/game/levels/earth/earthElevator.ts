import type Phaser from 'phaser';

type Point = { x: number; y: number };
type Rect = Point & { width: number; height: number };
type Obstacle = Rect & { label?: string };
type Footprint = Rect;
type Side = 'upper' | 'lower';

export const EARTH_ELEVATOR_COLUMN_X = 1321;
export const EARTH_ELEVATOR_NODES = {
  upper: { y: 415 },
  lower: { y: 690 },
} as const;

export const EARTH_ELEVATOR_ZONES = {
  upper: { x: 1247, y: 395, width: 148, height: 40 },
  lower: { x: 1247, y: 675, width: 148, height: 40 },
} as const;

// Colisión del propio hueco del elevador: solo se ignora durante el traslado.
export const EARTH_ELEVATOR_SHAFT_LABEL = 'elebador';

function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x
    && a.y < b.y + b.height && a.y + a.height > b.y;
}

function isInside(position: Point, rect: Rect): boolean {
  return position.x >= rect.x && position.x <= rect.x + rect.width
    && position.y >= rect.y && position.y <= rect.y + rect.height;
}

// La cabina mide el ancho del cuerpo y está centrada en X=1321. Solo se activa
// si el cuerpo ya está dentro de esa columna: nunca se ajusta X automáticamente.
export function isElevatorColumnAligned(x: number, body: Footprint): boolean {
  return Math.abs(x - EARTH_ELEVATOR_COLUMN_X) <= body.width / 2;
}

export function getElevatorTargetY(side: Side): number {
  return EARTH_ELEVATOR_NODES[side].y;
}

export function getElevatorZoneContacts(position: Point): Record<Side, boolean> {
  return {
    upper: isInside(position, EARTH_ELEVATOR_ZONES.upper),
    lower: isInside(position, EARTH_ELEVATOR_ZONES.lower),
  };
}

export function getElevatorTriggers(position: Point, body: Footprint): Record<Side, boolean> {
  const aligned = isElevatorColumnAligned(position.x, body);
  const zones = getElevatorZoneContacts(position);
  return {
    upper: aligned && zones.upper,
    lower: aligned && zones.lower,
  };
}

// Recorrido exclusivamente vertical con el cuerpo real del jugador.
export function isElevatorPathClear(
  x: number,
  fromY: number,
  toY: number,
  body: Footprint,
  obstacles: readonly Obstacle[],
  bounds: Rect,
): boolean {
  const swept = {
    x: x + body.x,
    y: Math.min(fromY, toY) + body.y,
    width: body.width,
    height: body.height + Math.abs(toY - fromY),
  };
  return swept.x >= bounds.x && swept.y >= bounds.y
    && swept.x + swept.width <= bounds.x + bounds.width
    && swept.y + swept.height <= bounds.y + bounds.height
    && !obstacles.some((obstacle) => overlaps(swept, obstacle));
}

// Dispara solo al entrar en la columna dentro de una zona. Tras un traslado, la
// zona de llegada queda bloqueada hasta que el jugador la abandone por completo.
export class ElevatorActivation {
  private previous = { upper: false, lower: false };
  private locked: Side | null = null;

  arrive(destination: Side, triggers: Record<Side, boolean>) {
    this.locked = destination;
    this.previous = triggers;
  }

  sync(triggers: Record<Side, boolean>) {
    this.previous = triggers;
  }

  update(
    triggers: Record<Side, boolean>,
    zones: Record<Side, boolean>,
  ): Side | null {
    const previous = this.previous;
    this.previous = triggers;
    if (this.locked) {
      if (!zones[this.locked]) this.locked = null;
      return null;
    }
    if (triggers.lower && !previous.lower) return 'upper';
    if (triggers.upper && !previous.upper) return 'lower';
    return null;
  }
}

export class EarthElevator {
  private readonly activation = new ElevatorActivation();
  private tween?: Phaser.Tweens.Tween;
  private previousMoves = true;
  private destination: Side = 'upper';
  private startX = EARTH_ELEVATOR_COLUMN_X;
  private readonly footprint: Footprint;
  private readonly body: Phaser.Physics.Arcade.Body;
  private readonly scene: Phaser.Scene;
  private readonly player: Phaser.Physics.Arcade.Sprite;
  private readonly obstacles: () => readonly Obstacle[];
  private readonly animate: (horizontal: number, vertical: number) => void;

  constructor(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    obstacles: () => readonly Obstacle[],
    animate: (horizontal: number, vertical: number) => void,
  ) {
    this.scene = scene;
    this.player = player;
    this.obstacles = obstacles;
    this.animate = animate;
    this.body = player.body as Phaser.Physics.Arcade.Body;
    this.body.updateFromGameObject();
    this.footprint = {
      x: this.body.x - player.x,
      y: this.body.y - player.y,
      width: this.body.width,
      height: this.body.height,
    };
    this.activation.sync(getElevatorTriggers(player, this.footprint));
    scene.events.once('shutdown', () => {
      this.tween?.stop();
      this.tween = undefined;
    });
  }

  update(enabled: boolean): boolean {
    const triggers = getElevatorTriggers(this.player, this.footprint);
    if (!enabled) {
      if (this.tween) this.end(false);
      this.activation.sync(triggers);
      return false;
    }
    if (this.tween) return true;

    const destination = this.activation.update(triggers, getElevatorZoneContacts(this.player));
    if (!destination) return false;

    const targetY = getElevatorTargetY(destination);
    const obstacles = this.obstacles().filter((obstacle) => obstacle.label !== EARTH_ELEVATOR_SHAFT_LABEL);
    const clear = isElevatorPathClear(
      this.player.x,
      this.player.y,
      targetY,
      this.footprint,
      obstacles,
      this.scene.physics.world.bounds,
    );
    if (!clear) return false;

    this.destination = destination;
    this.previousMoves = this.body.moves;
    this.startX = this.player.x;
    this.player.setVelocity(0, 0);
    this.body.moves = false;
    const position = { y: this.player.y };
    const distance = Math.abs(targetY - position.y);
    this.animate(0, targetY < position.y ? -1 : 1);
    this.tween = this.scene.tweens.add({
      targets: position,
      y: targetY,
      duration: Math.max(400, distance / 140 * 1000),
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        this.player.setPosition(this.startX, position.y);
        this.syncBody();
      },
      onComplete: () => this.end(true),
    });
    return true;
  }

  private syncBody() {
    this.body.updateFromGameObject();
    this.body.prev.copy(this.body.position);
    this.body.prevFrame.copy(this.body.position);
  }

  private end(completed: boolean) {
    const tween = this.tween;
    this.tween = undefined;
    if (!tween) return;
    if (!completed) tween.stop();
    this.player.setVelocity(0, 0);
    this.syncBody();
    this.body.moves = this.previousMoves;
    this.animate(0, 0);

    const triggers = getElevatorTriggers(this.player, this.footprint);
    if (completed) {
      this.activation.arrive(this.destination, triggers);
    } else {
      this.activation.sync(triggers);
    }
  }
}
