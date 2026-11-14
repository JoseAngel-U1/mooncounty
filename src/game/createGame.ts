import Phaser from 'phaser';
import { sceneRegistry } from './scenes/sceneRegistry';
import type { SceneKey } from './scenes/sceneRegistry';

export function createGame(parent: HTMLElement, sceneKey: SceneKey): Phaser.Game {
  const Scene = sceneRegistry[sceneKey];

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    // Recibir las teclas antes del preventDefault delegado de React.
    input: { keyboard: { target: parent } },
    width: parent.clientWidth,
    height: parent.clientHeight,
    backgroundColor: '#183c38',
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scene: [new Scene()],
  });
}
