import type Phaser from 'phaser';
import {
  createEarthCrewAnimations,
  EARTH_CREW_SCALE,
  getEarthCrewTextureKey,
} from './earthCrewSprites';
import type { EarthCrewAnimationKeys } from './earthCrewSprites';

export type EarthCrewPoint = { x: number; y: number };

// Distancias de cola medidas sobre el recorrido real, no en línea recta.
export const EARTH_CREW_DISTANCES = [65, 130] as const;
export const EARTH_CREW_TRAIL_MAX_LENGTH = 200;

const TRAIL_MIN_STEP = 0.5;
const ANIMATION_MOVE_THRESHOLD = 0.05;
// Evita alternar de eje por redondeo al muestrear segmentos a 45 grados.
const DIRECTION_AXIS_EPSILON = 0.000001;
// El spawn está junto al muro oeste: la fila inicial asciende hacia el noreste
// por la zona libre entre el edificio suroeste y el obstáculo nuevo-3.
const SEED_ANGLE_DEGREES = 39;

type CrewMember = {
  sprite: Phaser.GameObjects.Sprite;
  distance: number;
  facingLeft: boolean;
};

// Semilla recta de 130 px para que los tres aparezcan en fila desde el inicio.
export function createEarthCrewSeed(origin: EarthCrewPoint): EarthCrewPoint[] {
  const angle = (SEED_ANGLE_DEGREES * Math.PI) / 180;
  const total = EARTH_CREW_DISTANCES[EARTH_CREW_DISTANCES.length - 1];

  return [
    {
      x: origin.x + Math.cos(angle) * total,
      y: origin.y - Math.sin(angle) * total,
    },
    { x: origin.x, y: origin.y },
  ];
}

// Muestrea el punto situado a `distance` px del extremo más reciente, avanzando
// por los segmentos del recorrido para conservar giros y esquinas.
export function sampleEarthCrewTrail(
  trail: readonly EarthCrewPoint[],
  distance: number,
): EarthCrewPoint | undefined {
  if (trail.length === 0) return undefined;

  let remaining = Math.max(0, distance);
  let newer = trail[trail.length - 1];

  for (let index = trail.length - 2; index >= 0; index -= 1) {
    const older = trail[index];
    const segment = Math.hypot(newer.x - older.x, newer.y - older.y);
    if (segment <= 0) continue;

    if (remaining <= segment) {
      const ratio = remaining / segment;
      return {
        x: newer.x + (older.x - newer.x) * ratio,
        y: newer.y + (older.y - newer.y) * ratio,
      };
    }

    remaining -= segment;
    newer = older;
  }

  return { x: trail[0].x, y: trail[0].y };
}

export class EarthCrew {
  private readonly leader: Phaser.GameObjects.Sprite;
  private readonly trail: EarthCrewPoint[];
  private readonly members: CrewMember[];
  private readonly animations?: EarthCrewAnimationKeys;
  private trailLength = 0;

  constructor(
    scene: Phaser.Scene,
    leader: Phaser.GameObjects.Sprite,
  ) {
    this.leader = leader;
    this.trail = createEarthCrewSeed({ x: leader.x, y: leader.y });
    this.trailLength = EARTH_CREW_DISTANCES[EARTH_CREW_DISTANCES.length - 1];

    const crewTextureKey = getEarthCrewTextureKey();
    const hasCrewTextures = scene.textures.exists(crewTextureKey);
    this.animations = hasCrewTextures ? createEarthCrewAnimations(scene) : undefined;
    const textureKey = hasCrewTextures ? crewTextureKey : '__MISSING';

    this.members = EARTH_CREW_DISTANCES.map((distance) => {
      const initial = sampleEarthCrewTrail(this.trail, distance)
        ?? { x: leader.x, y: leader.y };
      const sprite = scene.add.sprite(initial.x, initial.y, textureKey)
        .setScale(EARTH_CREW_SCALE)
        .setDepth(0);
      if (this.animations) sprite.play(this.animations.idle);

      return { sprite, distance, facingLeft: false };
    });
  }

  update(enabled: boolean): void {
    if (!enabled) {
      for (const member of this.members) this.updateMemberAnimation(member, 0, 0);
      return;
    }

    this.recordLeaderPosition();
    for (const member of this.members) this.followMember(member);
  }

  private recordLeaderPosition(): void {
    const head = this.trail[this.trail.length - 1];
    const distance = Math.hypot(this.leader.x - head.x, this.leader.y - head.y);
    if (distance < TRAIL_MIN_STEP) return;

    this.trail.push({ x: this.leader.x, y: this.leader.y });
    this.trailLength += distance;

    while (this.trailLength > EARTH_CREW_TRAIL_MAX_LENGTH && this.trail.length > 1) {
      const oldest = this.trail[0];
      const next = this.trail[1];
      const segment = Math.hypot(next.x - oldest.x, next.y - oldest.y);
      const excess = this.trailLength - EARTH_CREW_TRAIL_MAX_LENGTH;
      if (segment <= excess) {
        this.trailLength -= segment;
        this.trail.shift();
      } else {
        const ratio = excess / segment;
        this.trail[0] = {
          x: oldest.x + (next.x - oldest.x) * ratio,
          y: oldest.y + (next.y - oldest.y) * ratio,
        };
        this.trailLength = EARTH_CREW_TRAIL_MAX_LENGTH;
      }
    }
  }

  private followMember(member: CrewMember): void {
    const target = sampleEarthCrewTrail(this.trail, member.distance);
    if (!target) return;

    const dx = target.x - member.sprite.x;
    const dy = target.y - member.sprite.y;
    member.sprite.setPosition(target.x, target.y);
    this.updateMemberAnimation(member, dx, dy);
  }

  private updateMemberAnimation(member: CrewMember, dx: number, dy: number): void {
    const vertical = Math.abs(dy) > Math.abs(dx) + DIRECTION_AXIS_EPSILON;
    const moving = Math.abs(dx) > ANIMATION_MOVE_THRESHOLD || Math.abs(dy) > ANIMATION_MOVE_THRESHOLD;

    if (!moving) {
      member.sprite.setFlipX(member.facingLeft);
      if (this.animations) member.sprite.anims.play(this.animations.idle, true);
      return;
    }

    if (Math.abs(dx) > ANIMATION_MOVE_THRESHOLD) member.facingLeft = dx < 0;

    if (vertical) {
      member.sprite.setFlipX(false);
      if (this.animations) {
        member.sprite.anims.play(dy < 0 ? this.animations.walkUp : this.animations.walkDown, true);
      }
      return;
    }

    member.sprite.setFlipX(member.facingLeft);
    if (this.animations) member.sprite.anims.play(this.animations.walkSide, true);
  }
}
