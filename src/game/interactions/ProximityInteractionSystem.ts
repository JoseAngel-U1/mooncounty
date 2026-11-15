import Phaser from 'phaser';
import { findNearestInteractiveObject } from './interactiveObject';
import type { InteractiveObject } from './interactiveObject';

export class ProximityInteractionSystem {
  private readonly scene: Phaser.Scene;
  private readonly player: Phaser.GameObjects.Components.Transform;
  private readonly objects: readonly InteractiveObject[];
  private readonly indicator: Phaser.GameObjects.Text;
  private readonly message: Phaser.GameObjects.Text;
  private readonly interactKey?: Phaser.Input.Keyboard.Key;
  private messageUntil = 0;
  private readonly textOffset: number;

  constructor(
    scene: Phaser.Scene,
    player: Phaser.GameObjects.Components.Transform,
    objects: readonly InteractiveObject[],
    textOffset = 0,
  ) {
    this.scene = scene;
    this.player = player;
    this.objects = objects;
    this.textOffset = textOffset;
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#142b35',
      padding: { x: 8, y: 5 },
    };
    this.indicator = scene.add.text(0, 0, 'Presiona E para interactuar', style)
      .setOrigin(0.5, 1).setDepth(10_000).setVisible(false);
    this.message = scene.add.text(0, 0, '', style)
      .setOrigin(0.5, 1).setDepth(10_001).setVisible(false);
    this.interactKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E, false, false);

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.interactKey) scene.input.keyboard?.removeKey(this.interactKey, true);
      this.indicator.destroy();
      this.message.destroy();
    });
  }

  update(enabled: boolean) {
    const pressed = this.interactKey ? Phaser.Input.Keyboard.JustDown(this.interactKey) : false;
    const focused = this.scene.game.canvas.parentElement?.contains(document.activeElement);
    if (!enabled || !focused) {
      this.indicator.setVisible(false);
      this.message.setVisible(false);
      this.messageUntil = 0;
      return;
    }

    const nearest = findNearestInteractiveObject(this.objects, this.player);
    this.indicator.setText(nearest?.prompt ?? 'Presiona E para interactuar');
    this.indicator.setVisible(Boolean(nearest));
    this.positionText(this.indicator, 30 + this.textOffset);

    if (pressed && nearest) {
      nearest.action({
        showMessage: (text) => {
          this.message.setText(text);
          this.messageUntil = this.scene.time.now + 1500;
        },
      });
    }

    this.message.setVisible(this.scene.time.now < this.messageUntil);
    this.positionText(this.message, 70 + this.textOffset);
  }

  private positionText(text: Phaser.GameObjects.Text, offset: number) {
    const camera = this.scene.cameras.main;
    const view = camera.worldView;
    const margin = 8 / camera.zoom;
    text.setScale(1 / camera.zoom);
    const halfWidth = text.displayWidth / 2;
    const x = Phaser.Math.Clamp(this.player.x, view.left + halfWidth + margin, view.right - halfWidth - margin);
    const y = Phaser.Math.Clamp(this.player.y - offset, view.top + text.displayHeight + margin, view.bottom - margin);
    text.setPosition(x, y);
  }
}
