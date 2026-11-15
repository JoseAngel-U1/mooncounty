# Módulo Phaser

## Escenas base y registro
- `scenes/ExplorationScene.ts`: escena base reutilizable de exploración con mundo delimitado, astronauta, WASD/flechas, seguimiento de cámara y puntos de extensión para niveles específicos.
- `scenes/sceneRegistry.ts`: mapeo centralizado entre claves de Phaser y constructores de escenas implementadas (`earth`).
- `levels/registry.ts`: registro centralizado y tipado de niveles (`earth` disponible, `moon` bloqueado sin escena ficticia); resuelve identificadores desde la URL.
- `createGame.ts`: configuración y creación del motor Phaser 3, desacoplado de React.

## Sistema de interacciones
- `interactions/interactiveObject.ts`: contrato tipado para objetos del mundo interactuables mediante proximidad y tecla E.
- `interactions/ProximityInteractionSystem.ts`: sistema Phaser reutilizable de proximidad; detecta el elemento más cercano, gestiona el aviso «Presiona E», garantiza una acción por pulsación y suspende avisos y acciones sin foco o con F3 activo.

## Nivel Tierra (`levels/earth/`)
- `EarthScene.ts`: escena principal de Tierra. Carga `public/assets/levels/earth/map.png` a escala 1:1, aplica zoom uniforme de cobertura cuando el viewport supera el mapa, integra las 31 colisiones estáticas, elevador vertical, dos acompañantes de tripulación, NPCs con sprites propios, interacciones del flujo de misión y puente de lanzamiento.
- `earthCollisions.ts`: 31 rectángulos de colisión sólida del escenario en coordenadas del mapa original y constante `DEBUG_COLLISIONS` (desactivada por defecto).
- `earthCollisionEditor.ts`: editor de colisiones F3 arrastrable (D-34) con overlay gráfico en coordenadas del mundo. Herramienta exclusiva de desarrollo; su exclusión o deshabilitación completa para producción es un requisito previo a la entrega (AGENTS.md, D-23).
- `earthElevator.ts`: elevador automático exclusivamente vertical entre Y=690 y Y=415 con columna de activación centrada en X=1321 y X de entrada conservada durante todo el traslado (D-32).
- `earthCrew.ts`: lógica de seguimiento para dos acompañantes a 65 y 130 px sobre el historial de recorrido, con tolerancia diagonal de 0,000001 px y pausa durante F3 o modales (D-36).
- `earthCrewSprites.ts`: carga y configuración independiente de texturas y animaciones de tripulación desde `public/assets/characters/tripulante/` a escala 2× (D-37).
- `earthPlayerSprites.ts`: escala visual 2× (`EARTH_ASTRONAUT_SCALE`), carga de texturas sin casco (`astronauta_sin_casco`) y con casco (`astronauta_con _casco`), y animaciones por dirección.
- `earthNpcSprites.ts`: carga de frames 32–39 y animación Idle a 8 fps en bucle para ingeniero (`NPC_Staff_v1`) y coordinador (`NPC_Staff_v2`) a escala 2× (D-33).
- `earthInteractions.ts`: definición de interactivos de Tierra (trajes espaciales, coordinador, punto de coordenadas, ingeniero y nave).
- `earthMissionConfig.ts`: configuración centralizada del código de lanzamiento (`4826`), longitud requerida (4 dígitos) y función de validación `isEarthLaunchCode()`.
- `earthMissionState.ts`: tipo y fábrica `createEarthMissionState()` para el estado de misión en memoria por sesión (`hasSpacesuit`, `coordinatesRequested`, `hasCoordinates`, `hasTrajectoryData`, `launchCode`, `missionCompleted`).
- `earthLaunchPanelBridge.ts`: puente de eventos desacoplado entre Phaser y el modal React `LaunchPanel` (D-35) para abrir/cerrar el panel y gestionar el bloqueo y restauración de movimiento, interacciones y foco.

## Integración con React
`src/components/shared/PhaserGame/PhaserGame.tsx` integra el ciclo de vida del canvas Phaser en React, garantiza la destrucción al desmontar y previene instancias duplicadas en StrictMode. `src/pages/GamePage/GamePage.tsx` resuelve y valida el nivel desde la URL antes de inicializar Phaser. La navegación entre vistas pertenece exclusivamente a React Router.
