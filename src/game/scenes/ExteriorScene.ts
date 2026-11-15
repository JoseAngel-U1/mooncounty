import Phaser from 'phaser';

const SPEED = 220;

const SPACE_WIDTH = 3000;
const SPACE_HEIGHT = 3000;

type MovementKeys = Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;

type ExteriorSceneData = {
  readonly tethered?: boolean;
};

export class ExteriorScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys?: MovementKeys;
  private backgroundGraphics!: Phaser.GameObjects.Graphics;
  private cableGraphics!: Phaser.GameObjects.Graphics;

  // Estados de la EVA
  private isTethered = false;
  private isStranded = false;

  // Anclaje de la nave en el mapa exterior
  private anchorPoint = { x: 1500, y: 1500 };
  private maxCableLength = 220;

  private promptText!: Phaser.GameObjects.Text;

  constructor() {
    super('exterior-scene');
  }

  init(data: ExteriorSceneData = {}) {
    this.isTethered = data.tethered ?? false;
    this.isStranded = !this.isTethered;
  }

  create() {
    this.backgroundGraphics = this.add.graphics();
    this.cableGraphics = this.add.graphics();
    this.cableGraphics.setDepth(20);

    this.drawSpaceLayout();

    if (!this.textures.exists('astronaut-placeholder')) {
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
    }

    this.player = this.physics.add.sprite(
      this.anchorPoint.x,
      this.anchorPoint.y - 50,
      'astronaut-placeholder',
    );
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(this.player.width, this.player.height);
    this.player.body?.setOffset(0, 0);

    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: 'W', a: 'A', s: 'S', d: 'D',
    }, false) as MovementKeys | undefined;

    this.promptText = this.add.text(this.scale.width / 2, 50, '', {
      font: '16px monospace',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(30);

    const camera = this.cameras.main;
    camera.setBackgroundColor('#05050a');
    camera.startFollow(this.player, true, 0.09, 0.09);
    camera.setZoom(0.8);
    camera.setRoundPixels(true);

    this.physics.world.setBounds(0, 0, SPACE_WIDTH, SPACE_HEIGHT);
    camera.setBounds(0, 0, SPACE_WIDTH, SPACE_HEIGHT);

    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    });
  }

  // Espacio exterior con la nave anclada y estrellas decorativas.
  private drawSpaceLayout() {
    this.backgroundGraphics.clear();

    this.backgroundGraphics.fillStyle(0x05050a);
    this.backgroundGraphics.fillRect(0, 0, SPACE_WIDTH, SPACE_HEIGHT);

    this.backgroundGraphics.fillStyle(0x2a3b4c);
    this.backgroundGraphics.fillRect(this.anchorPoint.x - 100, this.anchorPoint.y - 100, 200, 200);
    this.backgroundGraphics.lineStyle(3, 0x89d4ad);
    this.backgroundGraphics.strokeRect(this.anchorPoint.x - 100, this.anchorPoint.y - 100, 200, 200);

    this.backgroundGraphics.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 150; i++) {
      const sx = (i * 37) % SPACE_WIDTH;
      const sy = (i * 73) % SPACE_HEIGHT;
      this.backgroundGraphics.fillRect(sx, sy, 2, 2);
    }
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    const { width, height } = gameSize;
    if (width <= 0 || height <= 0) return;
    this.cameras.main.setViewport(0, 0, width, height);
    this.promptText.setPosition(width / 2, 50);
  }

  update() {
    this.promptText.setText('');
    const focused = this.game.canvas.parentElement?.contains(document.activeElement);
    if (!this.keys || !focused) return;

    // Si se quedó varado por olvidar el cable
    if (this.isStranded) {
      this.player.setVelocity(0, 0);
      this.player.angle += 2;
      this.player.x += 1;
      this.promptText.setText('¡Derivando en el espacio sin cable! Misión fallida.');
      return;
    }

    this.player.setVelocity(0, 0);
    const horizontal = Number(this.keys.right.isDown || this.keys.d.isDown)
      - Number(this.keys.left.isDown || this.keys.a.isDown);
    const vertical = Number(this.keys.down.isDown || this.keys.s.isDown)
      - Number(this.keys.up.isDown || this.keys.w.isDown);
    const direction = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(SPEED);
    this.player.setVelocity(direction.x, direction.y);

    this.promptText.setText('EVA Activa: Sujeto al cable de seguridad.');

    this.cableGraphics.clear();
    this.cableGraphics.lineStyle(3, 0x89d4ad);
    this.cableGraphics.lineBetween(this.anchorPoint.x, this.anchorPoint.y, this.player.x, this.player.y);

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.anchorPoint.x,
      this.anchorPoint.y,
    );
    if (distance > this.maxCableLength) {
      const angle = Phaser.Math.Angle.Between(
        this.anchorPoint.x,
        this.anchorPoint.y,
        this.player.x,
        this.player.y,
      );
      this.player.x = this.anchorPoint.x + Math.cos(angle) * this.maxCableLength;
      this.player.y = this.anchorPoint.y + Math.sin(angle) * this.maxCableLength;
    }
  }
}
