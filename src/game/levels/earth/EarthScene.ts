import Phaser from 'phaser';
import { ExplorationScene } from '../../scenes/ExplorationScene';
import type { PlayerSpawn, WorldSize } from '../../scenes/ExplorationScene';
import { EarthCollisionEditor } from './earthCollisionEditor';
import { ProximityInteractionSystem } from '../../interactions/ProximityInteractionSystem';
import { createEarthInteractions } from './earthInteractions';
import { createEarthMissionState } from './earthMissionState';

const MAP_KEY = 'earth-map';
const MAP_PATH = '/assets/levels/earth/map.png';

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
  private missionState = createEarthMissionState();

  constructor() {
    super('earth');
  }

  preload() {
    this.load.image(MAP_KEY, MAP_PATH);
  }

  create() {
    if (this.textures.exists(MAP_KEY)) {
      this.mapImage = this.add.image(0, 0, MAP_KEY).setOrigin(0, 0).setScale(1);
    }
    super.create();

    this.collisionEditor = new EarthCollisionEditor(this, this.player);
    this.collisionEditor.create();
    this.missionState = createEarthMissionState();
    this.interactions = new ProximityInteractionSystem(this, this.player, createEarthInteractions(this.missionState));
  }

  override update() {
    this.collisionEditor?.update();
    this.interactions?.update(!this.collisionEditor?.isEditing());

    if (this.collisionEditor?.isEditing()) {
      this.player.setVelocity(0, 0);
      return;
    }

    super.update();
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
