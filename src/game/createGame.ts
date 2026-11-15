import Phaser from 'phaser';
import { sceneRegistry } from './scenes/sceneRegistry';
import type { SceneKey } from './scenes/sceneRegistry';

export function createGame(parent: HTMLElement, sceneKey: SceneKey): Phaser.Game {
  // 1. Obtenemos la clase de la escena que REALMENTE quieres abrir
  const TargetScene = sceneRegistry[sceneKey];
  
  // 2. Sacamos todas las demás escenas del registro
  const allScenes = Object.values(sceneRegistry);

  // 3. Ordenamos el arreglo para que la escena solicitada sea la PRIMERA 
  // (así Phaser la registra y la arranca de inmediato sin tocar la de exploración)
  const orderedScenes = [
    TargetScene,
    ...allScenes.filter((s) => s !== TargetScene)
  ];

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
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
    // Pasamos el arreglo ordenado para que arranque en la que pediste
    scene: orderedScenes,
  });
}