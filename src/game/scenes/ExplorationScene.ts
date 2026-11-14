import Phaser from 'phaser';

const SPEED = 220;

type MovementKeys = Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;

export class ExplorationScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys?: MovementKeys;
  private ground!: Phaser.GameObjects.Graphics;

  constructor() {
    super('exploration');
  }

  create() {
    this.ground = this.add.graphics();

    const astronaut = this.make.graphics({ x: 0, y: 0 });
    astronaut.fillStyle(0x7997a0);
    astronaut.fillRect(4, 12, 24, 18);
    astronaut.fillStyle(0xe5eee6);
    astronaut.fillRect(8, 4, 16, 14);
    astronaut.fillRect(9, 18, 14, 12);
    astronaut.fillRect(8, 30, 6, 6);
    astronaut.fillRect(18, 30, 6, 6);
    astronaut.fillStyle(0x163549);
    astronaut.fillRect(10, 7, 12, 7);
    astronaut.fillStyle(0x89d4ad);
    astronaut.fillRect(12, 8, 4, 2);
    astronaut.generateTexture('astronaut-placeholder', 32, 40);
    astronaut.destroy();

    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'astronaut-placeholder');
    this.player.setCollideWorldBounds(true);
    // El cuerpo cubre toda la textura para que ninguna parte salga del canvas.
    this.player.body?.setSize(this.player.width, this.player.height);
    this.player.body?.setOffset(0, 0);

    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: 'W', a: 'A', s: 'S', d: 'D',
    }, false) as MovementKeys | undefined;

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setRoundPixels(true);
    this.resizeWorld(this.scale.gameSize);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resizeWorld, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.resizeWorld, this);
    });
  }

  private resizeWorld(gameSize: Phaser.Structs.Size) {
    const { width, height } = gameSize;
    if (width <= 0 || height <= 0) return;

    this.physics.world.setBounds(0, 0, width, height);
    const camera = this.cameras.main;
    camera.setViewport(0, 0, width, height);
    camera.setZoom(1);
    camera.setBounds(0, 0, width, height);
    camera.setScroll(0, 0);

    this.ground.clear();
    this.ground.fillStyle(0x183c38);
    this.ground.fillRect(0, 0, width, height);
    this.ground.lineStyle(1, 0x214b43);
    for (let x = 0; x <= width; x += 64) {
      this.ground.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += 64) {
      this.ground.lineBetween(0, y, width, y);
    }
    this.ground.lineStyle(4, 0x89d4ad);
    this.ground.strokeRect(2, 2, Math.max(0, width - 4), Math.max(0, height - 4));

    const halfWidth = this.player.displayWidth / 2;
    const halfHeight = this.player.displayHeight / 2;
    const x = width >= this.player.displayWidth
      ? Phaser.Math.Clamp(this.player.x, halfWidth, width - halfWidth) : width / 2;
    const y = height >= this.player.displayHeight
      ? Phaser.Math.Clamp(this.player.y, halfHeight, height - halfHeight) : height / 2;
    // Sincroniza también el cuerpo físico antes del siguiente paso de simulación.
    this.player.body?.reset(x, y);
  }

  update() {
    this.player.setVelocity(0, 0);
    const focused = this.game.canvas.parentElement?.contains(document.activeElement);
    if (!this.keys || !focused) return;

    const horizontal = Number(this.keys.right.isDown || this.keys.d.isDown)
      - Number(this.keys.left.isDown || this.keys.a.isDown);
    const vertical = Number(this.keys.down.isDown || this.keys.s.isDown)
      - Number(this.keys.up.isDown || this.keys.w.isDown);
    const direction = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(SPEED);
    this.player.setVelocity(direction.x, direction.y);
  }
}
