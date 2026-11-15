import Phaser from 'phaser';
import { ExplorationScene } from '../../scenes/ExplorationScene';
import type { PlayerSpawn, WorldSize } from '../../scenes/ExplorationScene';
import { EarthCollisionEditor } from './earthCollisionEditor';
import { EARTH_COLLISION_RECTS } from './earthCollisions';
import { EarthElevator } from './earthElevator';
import { ProximityInteractionSystem } from '../../interactions/ProximityInteractionSystem';
import { createEarthInteractions, EARTH_COORDINATOR_POSITION, EARTH_ENGINEER_POSITION } from './earthInteractions';
import { createEarthMissionState } from './earthMissionState';
import {
  createEarthPlayerAnimations,
  EARTH_ASTRONAUT_SCALE,
  getEarthPlayerTextureKey,
  loadEarthPlayerTextures,
} from './earthPlayerSprites';
import type { EarthPlayerAnimationKeys } from './earthPlayerSprites';

const MAP_KEY = 'earth-map';
const MAP_PATH = '/assets/levels/earth/map.png';
const NPC_TINT = 0xffcf66;

// Spam del Astronauta
const EARTH_PLAYER_SPAWN: Readonly<PlayerSpawn> = {
  x: 97,
  y: 900,
};

// Escena específica de Tierra: usa el mapa pixel art si existe o la cuadrícula provisional.
export class EarthScene extends ExplorationScene {
  private mapImage?: Phaser.GameObjects.Image;
  private collisionEditor?: EarthCollisionEditor;
  private interactions?: ProximityInteractionSystem;
  private elevator?: EarthElevator;
  private missionState = createEarthMissionState();
  private playerAnimations?: EarthPlayerAnimationKeys;
  private facingLeft = false;

  constructor() {
    super('earth');
  }

  preload() {
    this.load.image(MAP_KEY, MAP_PATH);
    loadEarthPlayerTextures(this);
  }

  create() {
    this.missionState = createEarthMissionState();
    this.playerAnimations = undefined;
    this.facingLeft = false;

    if (this.textures.exists(MAP_KEY)) {
      this.mapImage = this.add.image(0, 0, MAP_KEY).setOrigin(0, 0).setScale(1);
    }
    super.create();
    this.setupPlayerAnimations(this.missionState.hasSpacesuit);
    this.createCoordinator();
    this.createEngineer();

    this.collisionEditor = new EarthCollisionEditor(this, this.player);
    this.collisionEditor.create();
    this.interactions = new ProximityInteractionSystem(
      this,
      this.player,
      createEarthInteractions(this.missionState, {
        onSpacesuitEquipped: () => this.equipSpacesuit(),
      }),
      16 * (EARTH_ASTRONAUT_SCALE - 1),
    );
    this.elevator = new EarthElevator(
      this,
      this.player,
      () => EARTH_COLLISION_RECTS,
      (horizontal, vertical) => this.updatePlayerAnimation(horizontal, vertical),
    );
  }

  override update() {
    this.collisionEditor?.update();
    const riding = this.elevator?.update(!this.collisionEditor?.isEditing()) ?? false;
    this.interactions?.update(!this.collisionEditor?.isEditing() && !riding);

    if (riding) return;

    if (this.collisionEditor?.isEditing()) {
      this.player.setVelocity(0, 0);
      this.updatePlayerAnimation(0, 0);
      return;
    }

    super.update();
  }

  private createCoordinator() {
    const helmetTextureKey = getEarthPlayerTextureKey(true);
    const textureKey = this.textures.exists(helmetTextureKey) ? helmetTextureKey : this.player.texture.key;

    this.add.sprite(EARTH_COORDINATOR_POSITION.x, EARTH_COORDINATOR_POSITION.y, textureKey)
      .setScale(EARTH_ASTRONAUT_SCALE)
      .setTint(NPC_TINT)
      .setDepth(1);
    this.add.text(EARTH_COORDINATOR_POSITION.x, EARTH_COORDINATOR_POSITION.y - (16 * EARTH_ASTRONAUT_SCALE + 10), 'Coordinador', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#142b35',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 1).setDepth(2);
  }

  private createEngineer() {
    const textureKey = getEarthPlayerTextureKey(false);
    const engineer = this.add.sprite(EARTH_ENGINEER_POSITION.x, EARTH_ENGINEER_POSITION.y, textureKey)
      .setScale(EARTH_ASTRONAUT_SCALE)
      .setTint(0x6699ff)
      .setDepth(1);
    const animations = createEarthPlayerAnimations(this, false);
    engineer.play(animations.idle);
    this.add.text(EARTH_ENGINEER_POSITION.x, EARTH_ENGINEER_POSITION.y - (16 * EARTH_ASTRONAUT_SCALE + 10), 'Ingeniero', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#142b35',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 1).setDepth(2);
  }

  private setupPlayerAnimations(hasSpacesuit: boolean) {
    const textureKey = getEarthPlayerTextureKey(hasSpacesuit);
    if (!this.textures.exists(textureKey)) return;

    this.playerAnimations = createEarthPlayerAnimations(this, hasSpacesuit);
    this.updatePlayerAnimation(0, 0);
  }

  private equipSpacesuit() {
    const textureKey = getEarthPlayerTextureKey(true);
    if (!this.textures.exists(textureKey)) return;

    this.setPlayerTexture(textureKey);
    this.setupPlayerAnimations(true);
  }

  protected override getPlayerTextureKey(): string {
    const textureKey = getEarthPlayerTextureKey(this.missionState.hasSpacesuit);
    return this.textures.exists(textureKey) ? textureKey : super.getPlayerTextureKey();
  }

  protected override configurePlayerBody() {
    this.player.setScale(EARTH_ASTRONAUT_SCALE);
    const body = this.player.body as Phaser.Physics.Arcade.Body | null;
    if (!body) return;

    body.updateBounds();
    body.setSize(22 / EARTH_ASTRONAUT_SCALE, 31 / EARTH_ASTRONAUT_SCALE, false);
    body.setOffset(
      this.player.displayOriginX + (5 - this.player.displayOriginX) / EARTH_ASTRONAUT_SCALE,
      this.player.displayOriginY + (1 - this.player.displayOriginY) / EARTH_ASTRONAUT_SCALE,
    );
    body.updateFromGameObject();
  }

  protected override getPlayerBoundsSize(): WorldSize {
    return { width: this.player.width, height: this.player.height };
  }

  protected override updatePlayerAnimation(horizontal: number, vertical: number) {
    const animations = this.playerAnimations;
    if (!animations) return;

    if (horizontal === 0 && vertical === 0) {
      this.player.setFlipX(this.facingLeft);
      this.player.anims.play(animations.idle, true);
      return;
    }

    if (horizontal !== 0) this.facingLeft = horizontal < 0;

    const useVertical = vertical !== 0 && Math.abs(vertical) >= Math.abs(horizontal);
    if (useVertical) {
      this.player.setFlipX(false);
      this.player.anims.play(vertical < 0 ? animations.walkUp : animations.walkDown, true);
      return;
    }

    this.player.setFlipX(horizontal < 0);
    this.player.anims.play(animations.walkSide, true);
  }

  protected override getPlayerSpawn(): PlayerSpawn {
    return { ...EARTH_PLAYER_SPAWN };
  }

  protected override getWorldSize(gameSize: Phaser.Structs.Size) {
    const source = this.mapImage ? this.textures.get(MAP_KEY).source[0] : undefined;
    if (!source || source.width <= 0 || source.height <= 0) {
      return super.getWorldSize(gameSize);
    }
    return { width: source.width, height: source.height };
  }

  protected override getCameraZoom(viewport: WorldSize, world: WorldSize) {
    // Escala uniforme: evita franjas vacías cuando el viewport supera el mapa.
    return Math.max(1, viewport.width / world.width, viewport.height / world.height);
  }

  protected override renderBackground(width: number, height: number) {
    if (!this.mapImage) super.renderBackground(width, height);
  }
}
