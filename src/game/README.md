# Módulo Phaser
- `scenes/ExplorationScene.ts`: escena provisional de Fase 1 con mundo delimitado, astronauta, WASD/flechas y cámara. Sin cambios de lógica durante la refactorización arquitectónica.
- `scenes/sceneRegistry.ts`: claves y constructores de escenas implementadas.
- `levels/levels.ts`: registro tipado de niveles y resolución de identificadores; los bloqueados no tienen escena ficticia.
- `createGame.ts`: configuración y creación del motor Phaser, sin dependencia de React.

`src/components/shared/PhaserGame/PhaserGame.tsx` integra el motor en React y limpia el juego al desmontarse. `src/pages/GamePage/GamePage.tsx` valida el nivel de la URL antes de montar el componente. La navegación pertenece exclusivamente a React Router.
