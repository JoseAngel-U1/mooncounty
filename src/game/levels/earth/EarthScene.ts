import Phaser from 'phaser';
import { ExplorationScene } from '../../scenes/ExplorationScene';
import type { WorldSize } from '../../scenes/ExplorationScene';

const MAP_KEY = 'earth-map';
const MAP_PATH = '/assets/levels/earth/map.png';

// Escena específica de Tierra: usa el mapa pixel art si existe o la cuadrícula provisional.
export class EarthScene extends ExplorationScene {
  private mapImage?: Phaser.GameObjects.Image;

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
