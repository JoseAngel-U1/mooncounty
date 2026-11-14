import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';
import { createGame } from '../../../game/createGame';
import type { SceneKey } from '../../../game/scenes/sceneRegistry';
import './PhaserGame.css';

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
      gameRef.current = createGame(parent, sceneKey);
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
