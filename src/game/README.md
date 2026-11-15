# Módulo Phaser
- `scenes/ExplorationScene.ts`: escena base reutilizable de Fase 1 con mundo delimitado, astronauta, WASD/flechas y cámara. Recibe la clave de la escena desde el nivel que la extiende.
- `scenes/sceneRegistry.ts`: claves y constructores de escenas implementadas.
- `levels/registry.ts`: registro tipado de niveles y resolución de identificadores; los bloqueados no tienen escena ficticia.
- `levels/earth/EarthScene.ts`: escena específica de Tierra. Carga `public/assets/levels/earth/map.png` a escala 1:1, ajusta mundo/cámara a sus dimensiones y aplica un zoom uniforme de cobertura si el viewport supera el mapa; si la imagen no existe, usa la cuadrícula provisional de ExplorationScene.
- `createGame.ts`: configuración y creación del motor Phaser, sin dependencia de React.

`src/components/shared/PhaserGame/PhaserGame.tsx` integra el motor en React y limpia el juego al desmontarse. `src/pages/GamePage/GamePage.tsx` valida el nivel de la URL antes de montar el componente. La navegación pertenece exclusivamente a React Router.
