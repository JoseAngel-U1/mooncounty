import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { sceneRegistry } from '../game/sceneRegistry';
import type { SceneKey } from '../game/sceneRegistry';

type PhaserGameProps = {
  sceneKey: SceneKey;
};

export default function PhaserGame({ sceneKey }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    // StrictMode cancela el primer montaje antes de crear un juego duplicado.
    const frame = requestAnimationFrame(() => {
      const Scene = sceneRegistry[sceneKey];
      gameRef.current = new Phaser.Game({
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
      parent.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(frame);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [sceneKey]);

  return (
    <div
      ref={containerRef}
      className="game-canvas"
      tabIndex={0}
      role="region"
      aria-label="MoonCounty. Haz clic o usa Tab para enfocar el escenario. Muévete con WASD o las flechas."
      onPointerDown={() => containerRef.current?.focus()}
      onBlur={() => {
        gameRef.current?.scene.getScenes(true).forEach((scene) => scene.input.keyboard?.resetKeys());
      }}
      onKeyDown={(event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
          event.preventDefault();
        }
      }}
    />
  );
}
