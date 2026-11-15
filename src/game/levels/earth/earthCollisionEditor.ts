import Phaser from 'phaser';
import { DEBUG_COLLISIONS, EARTH_COLLISION_RECTS } from './earthCollisions';

const DEPTH = 1_000_000;
const HANDLE_SCREEN_SIZE = 10;
const HANDLE_HIT_SCREEN_SIZE = 14;
const MIN_RECT_SIZE = 8;
const NEW_RECT_SIZE = 100;

type EditorItem = {
  zone: Phaser.GameObjects.Zone;
  label: Phaser.GameObjects.Text;
};

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

type DragState = {
  mode: 'move' | 'resize';
  item: EditorItem;
  handle?: ResizeHandle;
  startWorldX: number;
  startWorldY: number;
  startX: number;
  startY: number;
  width: number;
  height: number;
};

type PanelDragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
};

export class EarthCollisionEditor {
  private readonly scene: Phaser.Scene;
  private readonly player: Phaser.Physics.Arcade.Sprite;
  private readonly collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly items: EditorItem[] = [];
  private readonly lastPointerWorld = new Phaser.Math.Vector2();
  private collider?: Phaser.Physics.Arcade.Collider;
  private selectedItem: EditorItem | null = null;
  private dragState: DragState | null = null;
  private enabled = false;
  private pointerInsideCanvas = false;
  private debugKey?: Phaser.Input.Keyboard.Key;
  private newKey?: Phaser.Input.Keyboard.Key;
  private deleteKey?: Phaser.Input.Keyboard.Key;
  private renameKey?: Phaser.Input.Keyboard.Key;
  private panel?: HTMLDivElement;
  private panelDrag?: PanelDragState;
  private nameEl?: HTMLElement;
  private coordsEl?: HTMLElement;
  private statusEl?: HTMLElement;
  private deleteButton?: HTMLButtonElement;
  private renameButton?: HTMLButtonElement;

  private readonly handleWindowPointerUp = () => {
    if (!this.enabled || !this.dragState) return;
    this.finishDrag();
    this.setCursor('');
  };

  private readonly handlePanelDragStart = (event: PointerEvent) => {
    if (!this.enabled || event.button !== 0 || !this.panel) return;
    const header = event.currentTarget;
    if (!(header instanceof HTMLElement)) return;

    const container = this.getPanelContainer();
    if (!container) return;

    const panelRect = this.panel.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    this.panel.style.left = `${panelRect.left - containerRect.left}px`;
    this.panel.style.top = `${panelRect.top - containerRect.top}px`;
    this.panel.style.right = 'auto';
    this.panelDrag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - panelRect.left,
      offsetY: event.clientY - panelRect.top,
    };

    header.setPointerCapture(event.pointerId);
    header.style.cursor = 'grabbing';
    window.addEventListener('pointermove', this.handlePanelDragMove);
    window.addEventListener('pointerup', this.handlePanelDragEnd);
    window.addEventListener('pointercancel', this.handlePanelDragEnd);
    event.preventDefault();
    event.stopPropagation();
  };

  private readonly handlePanelDragMove = (event: PointerEvent) => {
    if (!this.panelDrag || event.pointerId !== this.panelDrag.pointerId || !this.panel) return;
    const container = this.getPanelContainer();
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    this.setPanelPosition(
      event.clientX - this.panelDrag.offsetX - containerRect.left,
      event.clientY - this.panelDrag.offsetY - containerRect.top,
    );
  };

  private readonly handlePanelDragEnd = (event: PointerEvent) => {
    if (!this.panelDrag || event.pointerId !== this.panelDrag.pointerId) return;
    this.finishPanelDrag();
  };

  private readonly handleWindowResize = () => {
    this.clampPanelToContainer();
  };

  private readonly handlePanelClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest('button[data-action]');
    if (!(button instanceof HTMLButtonElement) || button.disabled) return;

    switch (button.dataset.action) {
      case 'add':
        this.createNewCollision(false);
        break;
      case 'delete':
        this.deleteSelectedCollision();
        break;
      case 'rename':
        this.renameSelectedCollision();
        break;
      case 'copy':
        void this.copyCollisions();
        break;
      default:
        break;
    }

    this.scene.game.canvas.parentElement?.focus({ preventScroll: true });
  };

  constructor(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Sprite) {
    this.scene = scene;
    this.player = player;
    this.collisionGroup = scene.physics.add.staticGroup();
    this.graphics = scene.add.graphics().setDepth(DEPTH).setVisible(false);
  }

  create() {
    for (const rect of EARTH_COLLISION_RECTS) {
      this.createItem(rect.x, rect.y, rect.width, rect.height, rect.label);
    }

    this.collider = this.scene.physics.add.collider(this.player, this.collisionGroup);
    this.createPanel();
    this.bindInput();

    const camera = this.scene.cameras.main;
    this.lastPointerWorld.set(camera.worldView.centerX, camera.worldView.centerY);
    this.setEnabled(DEBUG_COLLISIONS);
  }

  isEditing(): boolean {
    return this.enabled;
  }

  update() {
    if (this.debugKey && Phaser.Input.Keyboard.JustDown(this.debugKey)) {
      this.setEnabled(!this.enabled);
    }

    if (!this.enabled) return;

    if (this.newKey && Phaser.Input.Keyboard.JustDown(this.newKey)) {
      this.createNewCollision(true);
    }
    if (this.deleteKey && Phaser.Input.Keyboard.JustDown(this.deleteKey)) {
      this.deleteSelectedCollision();
    }
    if (this.renameKey && Phaser.Input.Keyboard.JustDown(this.renameKey)) {
      this.renameSelectedCollision();
    }

    this.draw();
  }

  private createItem(x: number, y: number, width: number, height: number, label: string): EditorItem {
    const zone = this.scene.add
      .zone(x + width / 2, y + height / 2, width, height)
      .setName(label);

    this.collisionGroup.add(zone);
    if (!zone.body) this.scene.physics.add.existing(zone, true);

    const text = this.scene.add
      .text(0, 0, label, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffdede',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setDepth(DEPTH + 1)
      .setVisible(false);

    const item = { zone, label: text };
    this.items.push(item);
    return item;
  }

  private bindInput() {
    const keyboard = this.scene.input.keyboard;
    if (keyboard) {
      this.debugKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F3);
      this.newKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N, false);
      this.deleteKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE, false);
      this.renameKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R, false);
    }

    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointerupoutside', this.handlePointerUp, this);
    this.scene.input.on('gameout', this.handleGameOut, this);
    window.addEventListener('pointerup', this.handleWindowPointerUp);

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.input.off('pointerdown', this.handlePointerDown, this);
      this.scene.input.off('pointermove', this.handlePointerMove, this);
      this.scene.input.off('pointerup', this.handlePointerUp, this);
      this.scene.input.off('pointerupoutside', this.handlePointerUp, this);
      this.scene.input.off('gameout', this.handleGameOut, this);
      window.removeEventListener('pointerup', this.handleWindowPointerUp);
      window.removeEventListener('resize', this.handleWindowResize);
      this.finishPanelDrag();
      this.panel?.remove();
      this.panel = undefined;
      this.scene.input.keyboard?.removeCapture(Phaser.Input.Keyboard.KeyCodes.F3);
      this.scene.game.canvas.style.cursor = '';
    });
  }

  private createPanel() {
    const parent = this.scene.game.canvas.parentElement;
    if (!parent) return;

    parent.querySelector('[data-earth-collision-editor]')?.remove();

    const panel = document.createElement('div');
    panel.setAttribute('data-earth-collision-editor', '');
    panel.style.display = 'none';
    panel.innerHTML = `
      <div class="ee-title" title="Arrastrar para mover el panel">Editor de colisiones <span>F3</span></div>
      <div class="ee-row"><span class="ee-label">Nombre</span><span data-field="name">Sin selección</span></div>
      <pre data-field="coords" class="ee-coords">x: —  y: —\nwidth: —  height: —</pre>
      <div class="ee-actions">
        <button type="button" data-action="add">Nuevo</button>
        <button type="button" data-action="delete">Eliminar</button>
        <button type="button" data-action="rename">Renombrar</button>
        <button type="button" data-action="copy">Copiar colisiones</button>
      </div>
      <div class="ee-status" data-field="status">Listo.</div>
      <div class="ee-help">Clic: seleccionar · Arrastrar: mover<br>Esquinas y bordes: redimensionar<br>N: nuevo · Supr: eliminar · R: renombrar</div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      [data-earth-collision-editor] {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
        width: min(290px, calc(100% - 24px));
        box-sizing: border-box;
        padding: 10px 12px;
        border: 1px solid rgba(255, 90, 90, 0.75);
        border-radius: 8px;
        background: rgba(7, 18, 26, 0.93);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        color: #f4f7f8;
        font: 12px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
        pointer-events: auto;
        user-select: none;
      }
      [data-earth-collision-editor] .ee-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        font-weight: 700;
        letter-spacing: 0.02em;
        cursor: grab;
        touch-action: none;
      }
      [data-earth-collision-editor] .ee-title span {
        color: #ffd166;
        font-weight: 600;
      }
      [data-earth-collision-editor] .ee-row {
        display: flex;
        gap: 8px;
        min-height: 1.4em;
        overflow-wrap: anywhere;
      }
      [data-earth-collision-editor] .ee-label {
        flex: 0 0 auto;
        color: #9fb3b0;
      }
      [data-earth-collision-editor] .ee-coords {
        margin: 6px 0 8px;
        padding: 6px 8px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.06);
        color: #ffd7d7;
        font: inherit;
        white-space: pre-wrap;
      }
      [data-earth-collision-editor] .ee-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      [data-earth-collision-editor] button {
        padding: 5px 8px;
        border: 1px solid #4f8b7f;
        border-radius: 5px;
        background: #1f3b3a;
        color: #e8fff5;
        font: inherit;
        cursor: pointer;
      }
      [data-earth-collision-editor] button:hover:not(:disabled) {
        background: #2b504d;
      }
      [data-earth-collision-editor] button:focus-visible {
        outline: 2px solid #ffd166;
        outline-offset: 1px;
      }
      [data-earth-collision-editor] button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      [data-earth-collision-editor] .ee-status {
        min-height: 1.45em;
        margin-top: 8px;
        color: #9be7b0;
        overflow-wrap: anywhere;
      }
      [data-earth-collision-editor] .ee-help {
        margin-top: 6px;
        color: #93aaa5;
        font-size: 11px;
        line-height: 1.5;
      }
    `;
    panel.appendChild(style);
    parent.appendChild(panel);

    this.panel = panel;
    this.nameEl = panel.querySelector<HTMLElement>('[data-field="name"]') ?? undefined;
    this.coordsEl = panel.querySelector<HTMLElement>('[data-field="coords"]') ?? undefined;
    this.statusEl = panel.querySelector<HTMLElement>('[data-field="status"]') ?? undefined;
    this.deleteButton = panel.querySelector<HTMLButtonElement>('button[data-action="delete"]') ?? undefined;
    this.renameButton = panel.querySelector<HTMLButtonElement>('button[data-action="rename"]') ?? undefined;

    panel.addEventListener('click', this.handlePanelClick);
    panel.querySelector<HTMLElement>('.ee-title')?.addEventListener('pointerdown', this.handlePanelDragStart);
    window.addEventListener('resize', this.handleWindowResize);
    this.updatePanel();
  }

  private getPanelContainer(): HTMLElement | null {
    const panel = this.panel;
    if (!panel) return null;
    if (panel.offsetParent instanceof HTMLElement) return panel.offsetParent;
    return panel.parentElement;
  }

  private setPanelPosition(left: number, top: number) {
    const panel = this.panel;
    const container = this.getPanelContainer();
    if (!panel || !container) return;

    const maxLeft = Math.max(0, container.clientWidth - panel.offsetWidth);
    const maxTop = Math.max(0, container.clientHeight - panel.offsetHeight);
    panel.style.left = `${Phaser.Math.Clamp(left, 0, maxLeft)}px`;
    panel.style.top = `${Phaser.Math.Clamp(top, 0, maxTop)}px`;
  }

  private clampPanelToContainer() {
    const panel = this.panel;
    if (!panel || panel.style.display === 'none') return;

    const left = Number.parseFloat(panel.style.left);
    const top = Number.parseFloat(panel.style.top);
    if (!Number.isFinite(left) || !Number.isFinite(top)) return;
    this.setPanelPosition(left, top);
  }

  private finishPanelDrag() {
    const header = this.panel?.querySelector<HTMLElement>('.ee-title') ?? null;
    const pointerId = this.panelDrag?.pointerId;
    if (header && pointerId !== undefined) {
      try {
        if (header.hasPointerCapture(pointerId)) header.releasePointerCapture(pointerId);
      } catch {
        // El puntero ya no está activo.
      }
      header.style.cursor = '';
    }

    this.panelDrag = undefined;
    window.removeEventListener('pointermove', this.handlePanelDragMove);
    window.removeEventListener('pointerup', this.handlePanelDragEnd);
    window.removeEventListener('pointercancel', this.handlePanelDragEnd);
    this.scene.game.canvas.parentElement?.focus({ preventScroll: true });
  }

  private setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.graphics.setVisible(enabled);
    for (const item of this.items) item.label.setVisible(enabled);
    if (this.panel) this.panel.style.display = enabled ? 'block' : 'none';
    if (this.collider) this.collider.active = !enabled;

    if (!enabled) {
      this.selectedItem = null;
      this.dragState = null;
      this.finishPanelDrag();
      this.setCursor('');
    } else {
      this.player.setVelocity(0, 0);
      this.clampPanelToContainer();
      this.draw();
    }

    this.updatePanel();
  }

  private updatePanel() {
    if (!this.panel) return;

    const item = this.selectedItem;
    const body = item ? this.getBody(item) : null;

    if (this.nameEl) this.nameEl.textContent = item ? item.zone.name : 'Sin selección';
    if (this.coordsEl) {
      this.coordsEl.textContent = body
        ? `x: ${Math.round(body.x)}  y: ${Math.round(body.y)}\nwidth: ${Math.round(body.width)}  height: ${Math.round(body.height)}`
        : 'x: —  y: —\nwidth: —  height: —';
    }
    if (this.deleteButton) this.deleteButton.disabled = !item;
    if (this.renameButton) this.renameButton.disabled = !item;
  }

  private getBody(item: EditorItem): Phaser.Physics.Arcade.StaticBody | null {
    return item.zone.body as Phaser.Physics.Arcade.StaticBody | null;
  }

  private draw() {
    const graphics = this.graphics;
    const zoom = this.scene.cameras.main.zoom || 1;
    const handleSize = HANDLE_SCREEN_SIZE / zoom;

    graphics.clear();

    for (const item of this.items) {
      const body = this.getBody(item);
      if (!body) continue;

      const selected = item === this.selectedItem;
      graphics.fillStyle(0xff2d2d, selected ? 0.32 : 0.22);
      graphics.lineStyle(selected ? 3 : 2, selected ? 0xffe066 : 0xff2d2d, 1);
      graphics.fillRect(body.x, body.y, body.width, body.height);
      graphics.strokeRect(body.x, body.y, body.width, body.height);
      item.label.setPosition(body.x + 3, body.y + 2);
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body | null;
    if (playerBody) {
      graphics.fillStyle(0x32ff7a, 0.25);
      graphics.lineStyle(2, 0x32ff7a, 1);
      graphics.fillRect(playerBody.x, playerBody.y, playerBody.width, playerBody.height);
      graphics.strokeRect(playerBody.x, playerBody.y, playerBody.width, playerBody.height);
    }

    const selectedBody = this.selectedItem ? this.getBody(this.selectedItem) : null;
    if (selectedBody) {
      graphics.fillStyle(0xffffff, 1);
      graphics.lineStyle(2, 0xff2d2d, 1);
      for (const handle of this.getHandles(selectedBody)) {
        graphics.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        graphics.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
      }
    }
  }

  private getHandles(body: Phaser.Physics.Arcade.StaticBody): Array<{ handle: ResizeHandle; x: number; y: number }> {
    const left = body.x;
    const top = body.y;
    const right = body.x + body.width;
    const bottom = body.y + body.height;
    const midX = (left + right) / 2;
    const midY = (top + bottom) / 2;

    return [
      { handle: 'nw', x: left, y: top },
      { handle: 'n', x: midX, y: top },
      { handle: 'ne', x: right, y: top },
      { handle: 'e', x: right, y: midY },
      { handle: 'se', x: right, y: bottom },
      { handle: 's', x: midX, y: bottom },
      { handle: 'sw', x: left, y: bottom },
      { handle: 'w', x: left, y: midY },
    ];
  }

  private getHandleAt(item: EditorItem, worldX: number, worldY: number): ResizeHandle | null {
    const body = this.getBody(item);
    if (!body) return null;

    const zoom = this.scene.cameras.main.zoom || 1;
    const halfHitSize = HANDLE_HIT_SCREEN_SIZE / zoom / 2;

    for (const handle of this.getHandles(body)) {
      if (Math.abs(worldX - handle.x) <= halfHitSize && Math.abs(worldY - handle.y) <= halfHitSize) {
        return handle.handle;
      }
    }

    return null;
  }

  private findItemAt(worldX: number, worldY: number): EditorItem | null {
    for (let index = this.items.length - 1; index >= 0; index -= 1) {
      const item = this.items[index];
      const body = this.getBody(item);
      if (!body) continue;

      if (
        worldX >= body.x
        && worldX <= body.x + body.width
        && worldY >= body.y
        && worldY <= body.y + body.height
      ) {
        return item;
      }
    }

    return null;
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (!this.enabled || !pointer.leftButtonDown()) return;

    const worldX = pointer.worldX;
    const worldY = pointer.worldY;

    if (this.selectedItem) {
      const handle = this.getHandleAt(this.selectedItem, worldX, worldY);
      if (handle) {
        this.startDrag(this.selectedItem, 'resize', handle, worldX, worldY);
        return;
      }
    }

    const item = this.findItemAt(worldX, worldY);
    if (!item) {
      this.selectItem(null);
      this.updateHoverCursor(worldX, worldY);
      return;
    }

    this.selectItem(item);
    this.startDrag(item, 'move', undefined, worldX, worldY);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    this.lastPointerWorld.set(pointer.worldX, pointer.worldY);
    this.pointerInsideCanvas = true;

    if (!this.enabled) return;

    if (this.dragState) {
      this.updateDrag(this.dragState, pointer.worldX, pointer.worldY);
      return;
    }

    this.updateHoverCursor(pointer.worldX, pointer.worldY);
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer) {
    if (!this.enabled || !this.dragState) return;
    this.finishDrag();
    this.updateHoverCursor(pointer.worldX, pointer.worldY);
  }

  private handleGameOut() {
    this.pointerInsideCanvas = false;
    if (!this.dragState) this.setCursor('');
  }

  private startDrag(
    item: EditorItem,
    mode: 'move' | 'resize',
    handle: ResizeHandle | undefined,
    worldX: number,
    worldY: number,
  ) {
    const body = this.getBody(item);
    if (!body) return;

    this.dragState = {
      mode,
      item,
      handle,
      startWorldX: worldX,
      startWorldY: worldY,
      startX: body.x,
      startY: body.y,
      width: body.width,
      height: body.height,
    };

    this.setCursor(mode === 'move' ? 'grabbing' : handle ? HANDLE_CURSORS[handle] : 'default');
    this.updatePanel();
  }

  private updateDrag(drag: DragState, worldX: number, worldY: number) {
    const bounds = this.scene.physics.world.bounds;
    let x = drag.startX;
    let y = drag.startY;
    let width = drag.width;
    let height = drag.height;

    if (drag.mode === 'move') {
      const maxX = Math.max(0, bounds.width - width);
      const maxY = Math.max(0, bounds.height - height);
      x = Phaser.Math.Clamp(drag.startX + worldX - drag.startWorldX, 0, maxX);
      y = Phaser.Math.Clamp(drag.startY + worldY - drag.startWorldY, 0, maxY);
    } else if (drag.handle) {
      const handle = drag.handle;
      let left = drag.startX;
      let right = drag.startX + drag.width;
      let top = drag.startY;
      let bottom = drag.startY + drag.height;

      if (handle.includes('w')) left = Phaser.Math.Clamp(worldX, 0, right - MIN_RECT_SIZE);
      if (handle.includes('e')) right = Phaser.Math.Clamp(worldX, left + MIN_RECT_SIZE, bounds.width);
      if (handle.includes('n')) top = Phaser.Math.Clamp(worldY, 0, bottom - MIN_RECT_SIZE);
      if (handle.includes('s')) bottom = Phaser.Math.Clamp(worldY, top + MIN_RECT_SIZE, bounds.height);

      x = left;
      y = top;
      width = right - left;
      height = bottom - top;
    }

    this.applyRect(drag.item, x, y, width, height);
    this.updatePanel();
  }

  private finishDrag() {
    if (!this.dragState) return;
    this.dragState = null;
    this.setCursor('');
    this.updatePanel();
  }

  private applyRect(item: EditorItem, x: number, y: number, width: number, height: number) {
    const zone = item.zone;
    zone.setPosition(x + width / 2, y + height / 2);
    zone.setSize(width, height);

    const body = this.getBody(item);
    if (body) body.updateFromGameObject();
  }

  private updateHoverCursor(worldX: number, worldY: number) {
    if (this.selectedItem) {
      const handle = this.getHandleAt(this.selectedItem, worldX, worldY);
      if (handle) {
        this.setCursor(HANDLE_CURSORS[handle]);
        return;
      }
    }

    const item = this.findItemAt(worldX, worldY);
    this.setCursor(item ? 'move' : '');
  }

  private setCursor(cursor: string) {
    this.scene.game.canvas.style.cursor = cursor;
  }

  private selectItem(item: EditorItem | null) {
    this.selectedItem = item;
    this.updatePanel();
    this.draw();
  }

  private createNewCollision(atPointer: boolean) {
    const bounds = this.scene.physics.world.bounds;
    const view = this.scene.cameras.main.worldView;
    const size = Math.min(NEW_RECT_SIZE, bounds.width, bounds.height);

    let centerX = view.x + 24 + size / 2;
    let centerY = view.bottom - 24 - size / 2;

    if (atPointer && this.pointerInsideCanvas) {
      centerX = this.lastPointerWorld.x;
      centerY = this.lastPointerWorld.y;
    }

    const x = Phaser.Math.Clamp(centerX - size / 2, 0, Math.max(0, bounds.width - size));
    const y = Phaser.Math.Clamp(centerY - size / 2, 0, Math.max(0, bounds.height - size));
    const name = this.nextNewName();
    const item = this.createItem(x, y, size, size, name);

    this.selectedItem = item;
    this.updatePanel();
    this.draw();
    this.setStatus(`Creado ${name}. Arrástralo para colocarlo.`);
  }

  private nextNewName(): string {
    const names = new Set(this.items.map((item) => item.zone.name));
    let index = 1;
    while (names.has(`nuevo-${index}`)) index += 1;
    return `nuevo-${index}`;
  }

  private deleteSelectedCollision() {
    const item = this.selectedItem;
    if (!item) {
      this.setStatus('Selecciona un rectángulo para eliminarlo.');
      return;
    }

    const name = item.zone.name;
    this.selectedItem = null;
    this.dragState = null;
    this.collisionGroup.remove(item.zone, true, true);
    item.label.destroy();

    const index = this.items.indexOf(item);
    if (index >= 0) this.items.splice(index, 1);

    this.setCursor('');
    this.updatePanel();
    this.draw();
    this.setStatus(`Eliminado ${name}.`);
  }

  private renameSelectedCollision() {
    const item = this.selectedItem;
    if (!item) {
      this.setStatus('Selecciona un rectángulo para renombrarlo.');
      return;
    }

    const value = window.prompt('Nombre del obstáculo', item.zone.name);
    if (value === null) return;

    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized) return;

    const name = this.uniqueName(normalized, item);
    item.zone.setName(name);
    item.label.setText(name);
    this.updatePanel();
    this.setStatus(name === normalized ? 'Nombre actualizado.' : `Nombre ajustado a ${name} para evitar duplicados.`);
  }

  private uniqueName(base: string, item: EditorItem): string {
    const names = new Set(
      this.items
        .filter((candidate) => candidate !== item)
        .map((candidate) => candidate.zone.name),
    );

    let name = base;
    let suffix = 2;
    while (names.has(name)) {
      name = `${base}-${suffix}`;
      suffix += 1;
    }

    return name;
  }

  private async copyCollisions() {
    const text = this.buildCollisionsSnippet();
    const clipboard = navigator.clipboard as Clipboard | undefined;
    let copied = false;

    if (clipboard) {
      try {
        await clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) copied = this.copyWithTextarea(text);

    this.setStatus(
      copied
        ? 'Colisiones copiadas. Pégalas en earthCollisions.ts.'
        : 'No se pudo copiar. Revisa los permisos del portapapeles.',
    );
  }

  private copyWithTextarea(text: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    let copied = false;
    try {
      textarea.focus();
      textarea.select();
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    } finally {
      textarea.remove();
    }

    return copied;
  }

  private buildCollisionsSnippet(): string {
    const rows = this.items.flatMap((item) => {
      const body = this.getBody(item);
      if (!body) return [];

      const x = Math.round(body.x);
      const y = Math.round(body.y);
      const width = Math.round(body.width);
      const height = Math.round(body.height);
      const label = item.zone.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

      return [`  { x: ${x}, y: ${y}, width: ${width}, height: ${height}, label: '${label}' },`];
    });

    return `export const EARTH_COLLISION_RECTS: readonly CollisionRect[] = [\n${rows.join('\n')}\n];\n`;
  }

  private setStatus(message: string) {
    if (this.statusEl) this.statusEl.textContent = message;
  }
}
