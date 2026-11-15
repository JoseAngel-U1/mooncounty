
import Phaser from 'phaser';

import {
  SHIP_INTERIOR_COLLISION,
  SHIP_INTERIOR_HEIGHT,
  SHIP_INTERIOR_SPAWN_POINT,
  SHIP_INTERIOR_WIDTH,
  type CollisionPoint,
} from '../levels/moonJourneyCollision';

// ======================================================
// CONFIGURACIÓN GENERAL
// ======================================================

const BACKGROUND_KEY = 'mission-2-interior-bg';

const SPEED = 80;
const ACCELERATION = 450;
const SPACE_DRAG = 0.985;

const PLAYER_BODY_WIDTH = 22;
const PLAYER_BODY_HEIGHT = 28;

const INTERACTION_DISTANCE = 55;

const STRIP_HEIGHT = 4;
const MAX_STRIPS = 64;

const DEBUG_COLLISIONS = false;

// ======================================================
// POSICIONES DE LOS OBJETOS (MAPA 900 x 500)
// ======================================================

// ROSA: CASCO
const HELMET_POSITION = {
  x: 185,
  y: 225,
};

// ROJO: CUERDA
const TETHER_POSITION = {
  x: 144,
  y: 385,
};

// AZUL: SALIDA
const EXIT_POSITION = {
  x: 221,
  y: 386,
};

// NARANJA: HERRAMIENTAS
const TOOLS_POSITION = {
  x: 743,
  y: 240,
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const EXTERIOR_SCENE_KEY = 'exterior-scene';

// ======================================================
// TIPOS
// ======================================================

type MovementKeys = Record<
  'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd',
  Phaser.Input.Keyboard.Key
>;

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Interaction =
  | 'helmet'
  | 'tools'
  | 'tether'
  | 'exit'
  | null;

// ======================================================
// UTILIDADES DE COLISIONES
// ======================================================

function isAxisAlignedRect(points: readonly CollisionPoint[]) {
  if (points.length !== 4) return false;

  return points.every(([x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];

    return x === nextX || y === nextY;
  });
}

function horizontalSpan(
  points: readonly CollisionPoint[],
  y: number,
) {
  const crossings: number[] = [];

  for (
    let i = 0, j = points.length - 1;
    i < points.length;
    j = i++
  ) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];

    if ((yi > y) !== (yj > y)) {
      crossings.push(
        xi + ((y - yi) * (xj - xi)) / (yj - yi),
      );
    }
  }

  if (crossings.length < 2) return undefined;

  return {
    start: Math.min(...crossings),
    end: Math.max(...crossings),
  };
}

function polygonToRects(
  points: readonly CollisionPoint[],
): Rect[] {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  if (isAxisAlignedRect(points)) {
    return [{
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }];
  }

  const height = maxY - minY;

  const strips = Math.min(
    MAX_STRIPS,
    Math.max(1, Math.round(height / STRIP_HEIGHT)),
  );

  const stripHeight = height / strips;
  const rects: Rect[] = [];

  for (let i = 0; i < strips; i++) {
    const top = minY + i * stripHeight;

    const span = horizontalSpan(
      points,
      top + stripHeight / 2,
    );

    if (!span) continue;

    const width = span.end - span.start;

    if (width <= 0) continue;

    const previous = rects[rects.length - 1];

    if (
      previous &&
      Math.abs(previous.x - span.start) < 1.5 &&
      Math.abs(previous.width - width) < 1.5
    ) {
      previous.height =
        top + stripHeight + 0.5 - previous.y;

      continue;
    }

    rects.push({
      x: span.start,
      y: top,
      width,
      height: stripHeight + 0.5,
    });
  }

  return rects;
}

// ======================================================
// ESCENA PRINCIPAL
// ======================================================

export class ShipInteriorScene extends Phaser.Scene {

  // ----------------------------------------------------
  // JUGADOR
  // ----------------------------------------------------

  private player!: Phaser.Physics.Arcade.Sprite;

  private keys?: MovementKeys;

  private interactKey?: Phaser.Input.Keyboard.Key;

  // ----------------------------------------------------
  // INVENTARIO
  // ----------------------------------------------------

  private hasHelmet = false;

  private hasTools = false;

  private hasTether = false;

  // ----------------------------------------------------
  // OBJETOS INTERACTIVOS
  // ----------------------------------------------------

  private helmetMarker!: Phaser.GameObjects.Container;

  private toolsMarker!: Phaser.GameObjects.Container;

  private tetherMarker!: Phaser.GameObjects.Container;

  private exitMarker!: Phaser.GameObjects.Container;

  private activeInteraction: Interaction = null;

  private isCollecting = false;

  private isExiting = false;

  // ----------------------------------------------------
  // INTERFAZ
  // ----------------------------------------------------

  private interactionHint!: Phaser.GameObjects.Text;

  private hintBackground!: Phaser.GameObjects.Rectangle;

  private inventoryText!: Phaser.GameObjects.Text;

  private feedbackUntil = 0;

  private feedbackMessage = '';

  // ----------------------------------------------------
  // ANIMACIONES
  // ----------------------------------------------------

  private ambientStars: Phaser.GameObjects.Arc[] = [];

  private consoleLights: Phaser.GameObjects.Arc[] = [];

  // ====================================================
  // CONSTRUCTOR
  // ====================================================

  constructor() {
    super('ship-interior');
  }

  // ====================================================
  // PRELOAD
  // ====================================================

  preload() {
    this.load.image(
      BACKGROUND_KEY,
      '/assets/mission-2-interior-bg.png',
    );
  }

  // ====================================================
  // CREATE
  // ====================================================

  create() {

    // FONDO
    this.add.image(0, 0, BACKGROUND_KEY)
      .setOrigin(0, 0)
      .setDepth(0);

    // ESTRELLAS Y LUCES
    this.createAmbientEffects();

    // CASCO, CUERDA, HERRAMIENTAS Y SALIDA
    this.createInteractionObjects();

    // --------------------------------------------------
    // CREAR ASTRONAUTA
    // --------------------------------------------------

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
      SHIP_INTERIOR_SPAWN_POINT.x,
      SHIP_INTERIOR_SPAWN_POINT.y,
      'astronaut-placeholder',
    );

    this.player.setDepth(10);

    this.player.setCollideWorldBounds(true);

    this.player.body?.setSize(
      PLAYER_BODY_WIDTH,
      PLAYER_BODY_HEIGHT,
      true,
    );

    // --------------------------------------------------
    // GRAVEDAD CERO
    // --------------------------------------------------

    const body = this.player.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);

    body.setDamping(true);

    body.setDrag(SPACE_DRAG, SPACE_DRAG);

    body.setMaxVelocity(SPEED, SPEED);

    // --------------------------------------------------
    // COLISIONES
    // --------------------------------------------------

    this.physics.add.collider(
      this.player,
      this.createObstacles() as unknown as
        Phaser.Types.Physics.Arcade.ArcadeColliderType,
    );

    // --------------------------------------------------
    // CONTROLES
    // --------------------------------------------------

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

    // --------------------------------------------------
    // CÁMARA
    // --------------------------------------------------

    const camera = this.cameras.main;

    camera.setBackgroundColor('#0b101d');

    camera.startFollow(
      this.player,
      true,
      0.09,
      0.09,
    );

    camera.setRoundPixels(true);

    this.physics.world.setBounds(
      0,
      0,
      SHIP_INTERIOR_WIDTH,
      SHIP_INTERIOR_HEIGHT,
    );

    camera.setBounds(
      0,
      0,
      SHIP_INTERIOR_WIDTH,
      SHIP_INTERIOR_HEIGHT,
    );

    // INTERFAZ
    this.createInterface();

    // ESCALADO
    this.resizeWorld(this.scale.gameSize);

    this.scale.on(
      Phaser.Scale.Events.RESIZE,
      this.resizeWorld,
      this,
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.scale.off(
          Phaser.Scale.Events.RESIZE,
          this.resizeWorld,
          this,
        );
      },
    );
  }

  // ====================================================
  // INTERFAZ
  // ====================================================

  private createInterface() {

    this.inventoryText = this.add.text(
      18,
      18,
      '',
      {
        fontFamily: 'monospace',
        fontSize: '13px',
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
      .setDepth(100);

    this.hintBackground = this.add.rectangle(
      0,
      0,
      460,
      48,
      0x101923,
      0.95,
    );

    this.hintBackground
      .setScrollFactor(0)
      .setDepth(100)
      .setStrokeStyle(1, 0x6dd5ed)
      .setVisible(false);

    this.interactionHint = this.add.text(
      0,
      0,
      '',
      {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#ffffff',
        align: 'center',
        padding: {
          x: 8,
          y: 8,
        },
        wordWrap: {
          width: 430,
        },
      },
    );

    this.interactionHint
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101)
      .setVisible(false);

    this.updateInterfacePosition();

    this.updateInventoryUI();
  }

  private updateInterfacePosition() {

    const width = this.scale.width;
    const height = this.scale.height;

    this.hintBackground.setPosition(
      width / 2,
      height - 42,
    );

    this.interactionHint.setPosition(
      width / 2,
      height - 42,
    );
  }

  private updateInventoryUI() {

    this.inventoryText.setText([
      'INVENTARIO DE MISIÓN',
      `Casco: ${this.hasHelmet ? '✓' : '✗'}`,
      `Cuerda: ${this.hasTether ? '✓' : '✗'}`,
      `Herramientas: ${this.hasTools ? '✓' : '✗'}`,
    ]);
  }

  private showMessage(message: string) {

    this.feedbackMessage = message;

    this.feedbackUntil = this.time.now + 1800;

    this.interactionHint.setText(message);

    this.interactionHint.setVisible(true);

    this.hintBackground.setVisible(true);
  }

  private showHint(message: string) {

    this.interactionHint.setText(message);

    this.interactionHint.setVisible(true);

    this.hintBackground.setVisible(true);
  }

  // ====================================================
  // CREAR OBJETOS INTERACTIVOS
  // ====================================================

  private createInteractionObjects() {

    // ROSA: CASCO
    this.helmetMarker = this.createPickupMarker(
      HELMET_POSITION.x,
      HELMET_POSITION.y,
      'CASCO',
      0xff4b9b,
    );

    // NARANJA: HERRAMIENTAS
    this.toolsMarker = this.createPickupMarker(
      TOOLS_POSITION.x,
      TOOLS_POSITION.y,
      'HERRAMIENTAS',
      0xffc94a,
    );

    // ROJO: CUERDA
    this.tetherMarker = this.createPickupMarker(
      TETHER_POSITION.x,
      TETHER_POSITION.y,
      'CUERDA',
      0xff5555,
    );

    // AZUL: SALIDA
    this.exitMarker = this.createPickupMarker(
      EXIT_POSITION.x,
      EXIT_POSITION.y,
      'SALIDA',
      0x55aaff,
    );
  }

  private createPickupMarker(
    x: number,
    y: number,
    label: string,
    color: number,
  ): Phaser.GameObjects.Container {

    const container = this.add.container(x, y);

    const ring = this.add.circle(
      0,
      0,
      20,
      color,
      0.12,
    );

    ring.setStrokeStyle(
      2,
      color,
      0.9,
    );

    const center = this.add.circle(
      0,
      0,
      5,
      color,
      1,
    );

    const labelText = this.add.text(
      0,
      28,
      label,
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#ffffff',
        backgroundColor: '#101923dd',
        padding: {
          x: 4,
          y: 3,
        },
      },
    ).setOrigin(0.5);

    container.add([
      ring,
      center,
      labelText,
    ]);

    container.setDepth(8);

    this.tweens.add({
      targets: ring,
      scale: 1.35,
      alpha: 0.25,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    return container;
  }

  // ====================================================
  // RECOGER OBJETOS
  // ====================================================

  private collectObject(
    marker: Phaser.GameObjects.Container,
    callback: () => void,
  ) {

    if (!marker.visible || this.isCollecting) return;

    this.isCollecting = true;

    this.activeInteraction = null;

    this.interactionHint.setVisible(false);

    this.hintBackground.setVisible(false);

    this.tweens.add({
      targets: marker,
      scale: 1.5,
      alpha: 0,
      duration: 300,
      ease: 'Back.easeIn',

      onComplete: () => {

        marker.setVisible(false);

        marker.setScale(1);

        marker.setAlpha(1);

        this.isCollecting = false;

        callback();
      },
    });
  }

  // ====================================================
  // COMPROBAR DISTANCIAS
  // ====================================================

  private checkInteractions() {

    if (this.isCollecting || this.isExiting) return;

    if (this.time.now < this.feedbackUntil) {

      this.interactionHint.setText(
        this.feedbackMessage,
      );

      this.interactionHint.setVisible(true);

      this.hintBackground.setVisible(true);

      return;
    }

    const px = this.player.x;
    const py = this.player.y;

    const distanceToHelmet = Phaser.Math.Distance.Between(
      px,
      py,
      HELMET_POSITION.x,
      HELMET_POSITION.y,
    );

    const distanceToTools = Phaser.Math.Distance.Between(
      px,
      py,
      TOOLS_POSITION.x,
      TOOLS_POSITION.y,
    );

    const distanceToTether = Phaser.Math.Distance.Between(
      px,
      py,
      TETHER_POSITION.x,
      TETHER_POSITION.y,
    );

    const distanceToExit = Phaser.Math.Distance.Between(
      px,
      py,
      EXIT_POSITION.x,
      EXIT_POSITION.y,
    );

    this.activeInteraction = null;

    // CASCO
    if (
      !this.hasHelmet &&
      this.helmetMarker.visible &&
      distanceToHelmet < INTERACTION_DISTANCE
    ) {
      this.activeInteraction = 'helmet';
    }

    // HERRAMIENTAS
    else if (
      !this.hasTools &&
      this.toolsMarker.visible &&
      distanceToTools < INTERACTION_DISTANCE
    ) {
      this.activeInteraction = 'tools';
    }

    // CUERDA
    else if (
      !this.hasTether &&
      this.tetherMarker.visible &&
      distanceToTether < INTERACTION_DISTANCE
    ) {
      this.activeInteraction = 'tether';
    }

    // SALIDA
    else if (
      distanceToExit < INTERACTION_DISTANCE
    ) {
      this.activeInteraction = 'exit';
    }

    // NOTIFICACIONES
    switch (this.activeInteraction) {

      case 'helmet':
        this.showHint('[E] RECOGER CASCO');
        break;

      case 'tools':
        this.showHint('[E] RECOGER HERRAMIENTAS');
        break;

      case 'tether':
        this.showHint('[E] RECOGER CUERDA');
        break;

      case 'exit':
        this.showHint('[E] ABRIR COMPUERTA Y SALIR');
        break;

      default:
        this.interactionHint.setVisible(false);
        this.hintBackground.setVisible(false);
        break;
    }
  }

  // ====================================================
  // EJECUTAR INTERACCIONES
  // ====================================================

  private interact() {

    if (this.isCollecting || this.isExiting) return;

    switch (this.activeInteraction) {

      case 'helmet':

        this.collectObject(
          this.helmetMarker,
          () => {

            this.hasHelmet = true;

            this.updateInventoryUI();

            this.showMessage('✓ CASCO RECOGIDO');
          },
        );

        break;

      case 'tools':

        this.collectObject(
          this.toolsMarker,
          () => {

            this.hasTools = true;

            this.updateInventoryUI();

            this.showMessage('✓ HERRAMIENTAS RECOGIDAS');
          },
        );

        break;

      case 'tether':

        this.collectObject(
          this.tetherMarker,
          () => {

            this.hasTether = true;

            this.updateInventoryUI();

            this.showMessage('✓ CUERDA DE SEGURIDAD RECOGIDA');
          },
        );

        break;

      case 'exit':

        this.isExiting = true;

        this.activeInteraction = null;

        this.showMessage('ABRIENDO COMPUERTA...');

        this.time.delayedCall(700, () => {
          this.exitShip();
        });

        break;
    }
  }

  // ====================================================
  // TRANSICIÓN AL EXTERIOR
  // ====================================================

  private exitShip() {

  this.scene.start('exterior-scene', {
    hasHelmet: this.hasHelmet,
    hasTools: this.hasTools,
    hasTether: this.hasTether,
  });

}
  // ====================================================
  // ANIMACIÓN DEL ESPACIO
  // ESTRELLAS: DERECHA -> IZQUIERDA
  // ====================================================

  private createAmbientEffects() {

    // Solo se dibujan en las zonas exteriores negras.
    const zones = [
      // Lateral izquierdo
      {
        x: 5,
        y: 15,
        width: 75,
        height: 465,
      },

      // Lateral derecho
      {
        x: 820,
        y: 15,
        width: 75,
        height: 465,
      },

      // Zona inferior izquierda
      {
        x: 100,
        y: 420,
        width: 400,
        height: 75,
      },

      // Zona inferior derecha
      {
        x: 540,
        y: 420,
        width: 260,
        height: 75,
      },
    ];

    for (let i = 0; i < 55; i++) {

      const zone = Phaser.Utils.Array.GetRandom(zones);

      const y = Phaser.Math.Between(
        zone.y,
        zone.y + zone.height,
      );

      const size = Phaser.Math.FloatBetween(
        0.7,
        1.8,
      );

      // Todas comienzan a la derecha de su zona.
      const star = this.add.circle(
        zone.x + zone.width,
        y,
        size,
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 0.9),
      );

      star.setDepth(2);

      this.ambientStars.push(star);

      // MOVIMIENTO DE DERECHA A IZQUIERDA
      this.tweens.add({
        targets: star,

        x: zone.x,

        duration: Phaser.Math.Between(
          4000,
          10000,
        ),

        repeat: -1,

        ease: 'Linear',

        onRepeat: () => {

          // Reiniciar al extremo derecho.
          star.x = zone.x + zone.width;

          // Variar la altura en cada recorrido.
          star.y = Phaser.Math.Between(
            zone.y,
            zone.y + zone.height,
          );
        },
      });

      // PARPADEO
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(
          900,
          2500,
        ),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    this.createConsoleAnimation();
  }

  // ====================================================
  // LUCES DE LA CONSOLA
  // ====================================================

  private createConsoleAnimation() {

    const positions = [
      { x: 362, y: 197, color: 0xff5656 },
      { x: 372, y: 197, color: 0xffd447 },
      { x: 382, y: 197, color: 0x65f59c },
      { x: 362, y: 210, color: 0xffffff },
      { x: 372, y: 210, color: 0xffffff },
      { x: 382, y: 210, color: 0x55d9ff },
    ];

    for (const position of positions) {

      const light = this.add.circle(
        position.x,
        position.y,
        2,
        position.color,
      );

      light.setDepth(4);

      this.consoleLights.push(light);

      this.tweens.add({
        targets: light,
        alpha: 0.2,
        duration: Phaser.Math.Between(
          300,
          1000,
        ),
        yoyo: true,
        repeat: -1,
      });
    }
  }

  // ====================================================
  // CREAR COLISIONES
  // ====================================================

  private createObstacles() {

    const bodies: Phaser.Physics.Arcade.StaticBody[] = [];

    const debug = DEBUG_COLLISIONS
      ? this.add.graphics().setDepth(50)
      : undefined;

    debug?.lineStyle(1, 0x00ffcc, 0.9);

    debug?.fillStyle(0x00ffcc, 0.2);

    for (const shape of SHIP_INTERIOR_COLLISION) {

      if (shape.kind === 'circle') {

        const body = this.physics.add.staticBody(
          shape.x - shape.radius,
          shape.y - shape.radius,
        );

        body.setCircle(shape.radius);

        bodies.push(body);

        debug?.fillCircle(
          shape.x,
          shape.y,
          shape.radius,
        );

        debug?.strokeCircle(
          shape.x,
          shape.y,
          shape.radius,
        );

        continue;
      }

      for (const rect of polygonToRects(shape.points)) {

        bodies.push(
          this.physics.add.staticBody(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
          ),
        );

        debug?.fillRect(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
        );

        debug?.strokeRect(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
        );
      }
    }

    return bodies;
  }

  // ====================================================
  // MOVIMIENTO EN GRAVEDAD CERO
  // ====================================================

  private updateMovement() {

    const body = this.player.body as Phaser.Physics.Arcade.Body;

    const focused =
      this.game.canvas.parentElement?.contains(
        document.activeElement,
      );

    if (!this.keys || !focused) {

      body.setAcceleration(0, 0);

      return;
    }

    const horizontal =
      Number(
        this.keys.right.isDown ||
        this.keys.d.isDown,
      ) -
      Number(
        this.keys.left.isDown ||
        this.keys.a.isDown,
      );

    const vertical =
      Number(
        this.keys.down.isDown ||
        this.keys.s.isDown,
      ) -
      Number(
        this.keys.up.isDown ||
        this.keys.w.isDown,
      );

    const direction = new Phaser.Math.Vector2(
      horizontal,
      vertical,
    ).normalize();

    // Aceleración gradual.
    // Al soltar las teclas se conserva la inercia.

    body.setAcceleration(
      direction.x * ACCELERATION,
      direction.y * ACCELERATION,
    );
  }

  // ====================================================
  // REDIMENSIONAR CÁMARA
  // ====================================================

  private resizeWorld(gameSize: Phaser.Structs.Size) {

    const { width, height } = gameSize;

    if (width <= 0 || height <= 0) return;

    const camera = this.cameras.main;

    camera.setViewport(
      0,
      0,
      width,
      height,
    );

    camera.setZoom(
      Math.max(
        width / SHIP_INTERIOR_WIDTH,
        height / SHIP_INTERIOR_HEIGHT,
      ),
    );

    if (this.inventoryText) {
      this.updateInterfacePosition();
    }
  }

  // ====================================================
  // UPDATE PRINCIPAL
  // ====================================================

  update() {

    // Movimiento del astronauta
    this.updateMovement();

    // Detectar objetos cercanos
    this.checkInteractions();

    // Detectar tecla E
    const focused =
      this.game.canvas.parentElement?.contains(
        document.activeElement,
      );

    if (
      focused &&
      this.interactKey &&
      Phaser.Input.Keyboard.JustDown(
        this.interactKey,
      )
    ) {
      this.interact();
    }
  }
}
