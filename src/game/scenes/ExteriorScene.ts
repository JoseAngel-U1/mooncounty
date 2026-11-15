
import Phaser from 'phaser';

const SPEED = 150;
const ACCELERATION = 400;

const SPACE_WIDTH = 3000;
const SPACE_HEIGHT = 3000;

const MAX_CABLE_LENGTH = 300;

const INTERACTION_DISTANCE = 5;

type MovementKeys = Record<
  'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd',
  Phaser.Input.Keyboard.Key
>;

type ExteriorSceneData = {
  hasHelmet?: boolean;
  hasTools?: boolean;
  hasTether?: boolean;
  tethered?: boolean;
};

export class ExteriorScene extends Phaser.Scene {

  private player!: Phaser.Physics.Arcade.Sprite;

  private keys?: MovementKeys;

  private interactKey?: Phaser.Input.Keyboard.Key;

  private backgroundGraphics!: Phaser.GameObjects.Graphics;

  private cableGraphics!: Phaser.GameObjects.Graphics;

  private promptText!: Phaser.GameObjects.Text;

  private inventoryText!: Phaser.GameObjects.Text;

  private repairMarker!: Phaser.GameObjects.Arc;

  // Inventario
  private hasHelmet = false;

  private hasTools = false;

  private hasTether = false;

  // Estado exterior
  private isTethered = false;

  private isStranded = false;

  private isRepaired = false;

  // Nave y posiciones
  private shipCenter = {
    x: 1500,
    y: 1500,
  };

  private anchorPoint = {
    x: 1545,
    y: 1530,
  };

  private repairPoint = {
    x: 1560,
    y: 1500,
  };

  private maxCableLength = MAX_CABLE_LENGTH;

  private feedbackUntil = 0;

  private feedbackMessage = '';

  constructor() {
    super('exterior-scene');
  }
 preload() {
  this.load.image(
    'mission-2-exterior-bg',
    '/assets/Mission_2_Interior_900x500.gif'
  );

  this.load.on('loaderror', (file: Phaser.Loader.File) => {
    console.error('Error cargando archivo:', file.key, file.src);
  });
}
  // ==================================================
  // RECIBIR INVENTARIO DEL INTERIOR
  // ==================================================

  init(data: ExteriorSceneData = {}) {

    this.hasHelmet = data.hasHelmet ?? false;

    this.hasTools = data.hasTools ?? false;

    this.hasTether =
      data.hasTether ?? data.tethered ?? false;

    this.isTethered = this.hasTether;

    this.isStranded = !this.hasTether;

    this.isRepaired = false;
  }

  // ==================================================
  // CREATE
  // ==================================================

  // ==================================================
  // CREATE LIMPIO Y ORDENADO
  // ==================================================

  create() {
    this.backgroundGraphics = this.add.graphics();
    this.cableGraphics = this.add.graphics();
    this.cableGraphics.setDepth(20);

    // 1. Dibuja únicamente el fondo negro y las estrellas (sin los rectángulos grises de la nave vieja)
    this.drawSpaceBackgroundOnly();

    // 2. Coloca tu imagen de la nave exterior en el centro exacto
    const shipImage = this.add.image(
  this.shipCenter.x,
  this.shipCenter.y,
  'mission-2-exterior-bg'
);

shipImage.setOrigin(0.5);
shipImage.setDepth(5);
shipImage.setDisplaySize(900, 500);

    // 3. Inicializa elementos del juego una sola vez
    this.createRepairMarker();
    this.createAstronaut();
    this.createControls();
    this.createInterface();
    this.setupCamera();

    this.physics.world.setBounds(
      0,
      0,
      SPACE_WIDTH,
      SPACE_HEIGHT,
    );

    this.scale.on(
      Phaser.Scale.Events.RESIZE,
      this.handleResize,
      this,
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.scale.off(
          Phaser.Scale.Events.RESIZE,
          this.handleResize,
          this,
        );
      },
    );

    if (this.isStranded) {
      this.player.setVelocity(-85, 15);

      this.showMessage(
        '¡ALERTA! SALISTE SIN CUERDA. ESTÁS A LA DERIVA.',
      );
    } else {
      this.showMessage(
        'EVA INICIADA. ESTÁS CONECTADO A LA NAVE.',
      );
    }

    this.updateInventory();
  }

  // ==================================================
  // CREAR ASTRONAUTA
  // ==================================================

  private createAstronaut() {

    if (!this.textures.exists('astronaut-placeholder')) {

      const astronaut = this.make.graphics({
        x: 0,
        y: 0,
      });

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

      astronaut.generateTexture(
        'astronaut-placeholder',
        32,
        40,
      );

      astronaut.destroy();
    }

    this.player = this.physics.add.sprite(
      this.anchorPoint.x + 45,
      this.anchorPoint.y,
      'astronaut-placeholder',
    );

    this.player.setDepth(10);

    this.player.setCollideWorldBounds(true);

    const body = this.player.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);

    body.setDamping(true);

    body.setDrag(0.985, 0.985);

    body.setMaxVelocity(SPEED, SPEED);

    body.setSize(22, 28, true);
  }

  // ==================================================
  // CONTROLES
  // ==================================================

  private createControls() {

    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,

      w: 'W',
      a: 'A',
      s: 'S',
      d: 'D',
    }, false) as MovementKeys | undefined;

    this.interactKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
    );
  }

  // ==================================================
  // INTERFAZ
  // ==================================================

  private createInterface() {

    this.promptText = this.add.text(
      this.scale.width / 2,
      this.scale.height - 55,
      '',
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000dd',
        padding: {
          x: 12,
          y: 8,
        },
        align: 'center',
        wordWrap: {
          width: 650,
        },
      },
    );

    this.promptText
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30);

    this.inventoryText = this.add.text(
      18,
      18,
      '',
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: '#101923dd',
        padding: {
          x: 10,
          y: 8,
        },
      },
    );

    this.inventoryText
      .setScrollFactor(0)
      .setDepth(30);
  }

  private updateInventory() {

    this.inventoryText.setText([
      'EQUIPO EVA',
      `Casco: ${this.hasHelmet ? '✓' : '✗'}`,
      `Herramientas: ${this.hasTools ? '✓' : '✗'}`,
      `Cuerda: ${this.hasTether ? '✓' : '✗'}`,
      `Nave: ${this.isRepaired ? 'REPARADA' : 'DAÑADA'}`,
    ]);
  }

  private showMessage(message: string) {

    this.feedbackMessage = message;

    this.feedbackUntil = this.time.now + 2500;

    this.promptText.setText(message);
  }

  // ==================================================
  // DIBUJAR ESPACIO EXTERIOR
  // ==================================================

  // ==================================================
  // SOLO ESTRELLAS Y FONDO NEGRO (SIN RECTÁNGULOS GRISES)
  // ==================================================

  private drawSpaceBackgroundOnly() {
    this.backgroundGraphics.clear();

    this.backgroundGraphics.fillStyle(0x05050a);
    this.backgroundGraphics.fillRect(
      0,
      0,
      SPACE_WIDTH,
      SPACE_HEIGHT,
    );

    // Estrellas
    this.backgroundGraphics.fillStyle(0xffffff, 0.8);

    for (let i = 0; i < 350; i++) {
      const sx = (i * 137) % SPACE_WIDTH;
      const sy = (i * 197) % SPACE_HEIGHT;
      const size = i % 5 === 0 ? 3 : 1;

      this.backgroundGraphics.fillRect(
        sx,
        sy,
        size,
        size,
      );
    }
  }

  // ==================================================
  // PUNTO DE REPARACIÓN
  // ==================================================

  private createRepairMarker() {

    this.repairMarker = this.add.circle(
      this.repairPoint.x,
      this.repairPoint.y,
      13,
      0xffb52e,
      0.85,
    );

    this.repairMarker.setDepth(8);

    this.repairMarker.setStrokeStyle(
      2,
      0xffffff,
    );

    this.tweens.add({
      targets: this.repairMarker,
      alpha: 0.3,
      scale: 1.35,
      duration: 750,
      yoyo: true,
      repeat: -1,
    });
  }

  // ==================================================
  // CÁMARA
  // ==================================================

  private setupCamera() {

    const camera = this.cameras.main;

    camera.setBackgroundColor('#05050a');

    camera.startFollow(
      this.player,
      true,
      0.09,
      0.09,
    );

    camera.setZoom(0.8);

    camera.setRoundPixels(true);

    camera.setBounds(
      0,
      0,
      SPACE_WIDTH,
      SPACE_HEIGHT,
    );
  }

  // ==================================================
  // MOVIMIENTO EN EL ESPACIO
  // ==================================================

  private updateMovement() {

    if (this.isStranded || !this.keys) return;

    const focused =
      this.game.canvas.parentElement?.contains(
        document.activeElement,
      );

    if (!focused) {

      const body = this.player.body as Phaser.Physics.Arcade.Body;

      body.setAcceleration(0, 0);

      return;
    }

    const horizontal =
      Number(
        this.keys.right.isDown || this.keys.d.isDown,
      ) -
      Number(
        this.keys.left.isDown || this.keys.a.isDown,
      );

    const vertical =
      Number(
        this.keys.down.isDown || this.keys.s.isDown,
      ) -
      Number(
        this.keys.up.isDown || this.keys.w.isDown,
      );

    const direction = new Phaser.Math.Vector2(
      horizontal,
      vertical,
    ).normalize();

    const body = this.player.body as Phaser.Physics.Arcade.Body;

    body.setAcceleration(
      direction.x * ACCELERATION,
      direction.y * ACCELERATION,
    );
  }

  // ==================================================
  // CABLE DE SEGURIDAD
  // ==================================================

  private updateCable() {

    this.cableGraphics.clear();

    if (!this.isTethered || this.isStranded) return;

    this.cableGraphics.lineStyle(
      3,
      0xffffff,
      1,
    );

    this.cableGraphics.lineBetween(
      this.anchorPoint.x,
      this.anchorPoint.y,
      this.player.x,
      this.player.y,
    );

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

      const newX =
        this.anchorPoint.x +
        Math.cos(angle) * this.maxCableLength;

      const newY =
        this.anchorPoint.y +
        Math.sin(angle) * this.maxCableLength;

      this.player.setPosition(newX, newY);

      const body = this.player.body as Phaser.Physics.Arcade.Body;

      const radialSpeed =
        body.velocity.x * Math.cos(angle) +
        body.velocity.y * Math.sin(angle);

      if (radialSpeed > 0) {
        body.velocity.x -= radialSpeed * Math.cos(angle);
        body.velocity.y -= radialSpeed * Math.sin(angle);
      }
    }
  }

  // ==================================================
  // COMPROBAR INTERACCIÓN
  // ==================================================

  private checkRepairDistance(): boolean {

    return Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.repairPoint.x,
      this.repairPoint.y,
    ) < INTERACTION_DISTANCE;
  }

  private updatePrompts() {

    if (this.time.now < this.feedbackUntil) {

      this.promptText.setText(
        this.feedbackMessage,
      );

      return;
    }

    if (this.isStranded) {

      this.promptText.setText(
        '¡ALERTA! ESTÁS A LA DERIVA. NO HAY CABLE DE SEGURIDAD.',
      );

      return;
    }

    if (this.isRepaired) {

      this.promptText.setText(
        '✓ NAVE REPARADA. MISIÓN COMPLETADA.',
      );

      return;
    }

    if (this.checkRepairDistance()) {

      if (!this.hasHelmet) {

        this.promptText.setText(
          '¡PELIGRO! NECESITAS EL CASCO PARA TRABAJAR.',
        );

      } else if (!this.hasTools) {

        this.promptText.setText(
          'NECESITAS HERRAMIENTAS PARA REPARAR LA NAVE.',
        );

      } else {

        this.promptText.setText(
          '[E] REPARAR COMPONENTE DE LA NAVE',
        );
      }

      return;
    }

    this.promptText.setText(
      'EVA ACTIVA | WASD / FLECHAS PARA MOVERTE',
    );
  }

  // ==================================================
  // REPARAR NAVE
  // ==================================================

  private repairShip() {

    if (this.isStranded) return;

    if (this.isRepaired) return;

    if (!this.checkRepairDistance()) return;

    if (!this.hasHelmet) {

      this.showMessage(
        '¡NO PUEDES TRABAJAR SIN CASCO!',
      );

      return;
    }

    if (!this.hasTools) {

      this.showMessage(
        'NO TIENES HERRAMIENTAS PARA REPARAR.',
      );

      return;
    }

    this.isRepaired = true;

    this.repairMarker.setFillStyle(
      0x39e58a,
    );

    this.repairMarker.setStrokeStyle(
      2,
      0xffffff,
    );

    this.updateInventory();

    this.showMessage(
      '✓ REPARACIÓN COMPLETADA. ¡BUEN TRABAJO!',
    );
  }

  // ==================================================
  // CAMBIO DE TAMAÑO
  // ==================================================

  private handleResize(
    gameSize: Phaser.Structs.Size,
  ) {

    const { width, height } = gameSize;

    if (width <= 0 || height <= 0) return;

    this.cameras.main.setViewport(
      0,
      0,
      width,
      height,
    );

    this.promptText.setPosition(
      width / 2,
      height - 55,
    );
  }

  // ==================================================
  // UPDATE
  // ==================================================

  update() {

    const focused =
      this.game.canvas.parentElement?.contains(
        document.activeElement,
      );

    if (this.isStranded) {

      // Deriva progresiva
      const body = this.player.body as Phaser.Physics.Arcade.Body;

      body.setAcceleration(0, 0);

      body.setVelocity(
        Math.min(body.velocity.x - 0.15, 110),
        body.velocity.y + Math.sin(this.time.now / 500) * 0.1,
      );

      this.player.angle += 0.7;

      this.cableGraphics.clear();

      this.updatePrompts();

      return;
    }

    this.updateMovement();

    this.updateCable();

    this.updatePrompts();

    if (
      focused &&
      this.interactKey &&
      Phaser.Input.Keyboard.JustDown(this.interactKey)
    ) {
      this.repairShip();
    }
  }
}

