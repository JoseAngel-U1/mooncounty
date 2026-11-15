# Decisiones confirmadas — MoonCounty

| ID | Decisión | Estado |
|---|---|---|
| D-01 | Juego web 2D con cámara superior y Phaser 3 | Confirmada |
| D-02 | React + TypeScript + Vite para interfaz | Confirmada |
| D-03 | Un solo astronauta controlable | Confirmada |
| D-04 | Movimiento arriba, abajo, izquierda y derecha | Confirmada |
| D-05 | Inventario visible en parte inferior | Confirmada |
| D-06 | Al acercarse a un objeto interactivo aparece «Presiona E» | Confirmada |
| D-07 | Al pulsar E sobre un objeto recogible se añade al inventario sin ventana extra | Confirmada |
| D-08 | Misión 1 transcurre en la Tierra; buscar coordenadas X e Y, entregarlas al ingeniero y obtener código de cuatro dígitos | Confirmada |
| D-09 | Conseguir combustible y preparar la nave | Confirmada |
| D-10 | Se permite intentar despegar sin combustible; ese intento causa fracaso | Confirmada |
| D-11 | Tres códigos incorrectos bloquean el sistema y causan fracaso | Confirmada |
| D-12 | Fallo = modal centrado semitransparente con causa, checklist y botón Reiniciar misión | Confirmada |
| D-13 | Reinicio desde cero: posición, inventario, objetos, código e intentos restablecidos | Confirmada |
| D-14 | Éxito = modal centrado de misión completada con opción Continuar | Confirmada |
| D-15 | Sin animaciones de despegue, explosión o fallo | Confirmada |
| D-16 | Un mapa pequeño para la primera misión; evitar complejidad innecesaria | Confirmada |
| D-17 | No backend ni BD en el MVP inicial | Propuesta técnica aceptada como base de implementación; revisable |
| D-18 | Portada React a ventana completa con estética espacial pixel art, superficie lunar, astronauta, módulo, cohete y botón INICIAR; se desmonta al entrar al juego existente, sin cargas artificiales ni avance a Fase 2 | Aprobada por el usuario el 2026-11-14 |
| D-19 | INICIAR abre un selector reutilizable antes del juego. Tierra disponible reutiliza ExplorationScene; Luna es solo una tarjeta bloqueada sin escena/misión. Registro tipado extensible y navegación de regreso juego → menú → inicio, sin persistencia ni desbloqueos automáticos. Amplía el flujo de D-18 | Aprobada por el usuario el 2026-11-14 |
| D-20 | Refactorización con React Router, páginas y componentes en carpetas propias con CSS, MainLayout con Outlet y rutas centralizadas. Registro de niveles en game/levels, escenas en game/scenes y motor separado de React. Validar levelId antes de iniciar Phaser y conservar apariencia y controles | Aprobada por el usuario el 2026-11-14 |

## Clasificación de componentes — ampliación de D-20
- **D-21 (2026-11-14, aprobada por el usuario):** separar los componentes existentes en `ui/` (interfaz específica de MoonCounty) y `shared/` (genéricos o compartidos entre páginas y funcionalidades), cada uno con carpeta y TSX/CSS propios. Mantener las responsabilidades de páginas, layouts, router y motor, sin cambios visuales o funcionales ni avance de fase.
- **D-22 (2026-11-14, aprobada por el usuario):** añadir en `src/game/levels/levels.ts` una tercera tarjeta reutilizando `LevelCard` para el nivel 2 «Viaje a la Luna» (enfrentamiento contra los AVE), conservando `Tierra` y `Luna` (bloqueada) e imagen `/assets/moon.svg` provisional. El enlace apunta a la ruta propia `/moon-journey` en `AppRouter.tsx` con `MoonJourneyPage` en `src/pages/MoonJourneyPage/` para que el usuario implemente allí ese nivel.
- **D-23 (2026-11-14, aprobada por el usuario; retirada por D-24 y restablecida por D-25):** crear la escena `ShipInteriorScene` (`ship-interior`) en `src/game/scenes/ShipInteriorScene.ts` como primer escenario dentro de la nave para el nivel 2, replicando las mecánicas de movimiento, límites, cámara y foco de `ExplorationScene` y montándola en `MoonJourneyPage` mediante el componente compartido `PhaserGame`.
- **D-24 (2026-11-14, aprobada por el usuario; ampliada por D-25):** integrar la escena `ExteriorScene` (`exterior-scene`) desarrollada por el usuario en `src/game/scenes/`, registrada en `sceneRegistry.ts`, retirando la ruta suelta `/nivel-2` y la escena provisional `ShipInteriorScene`; el acceso sigue siendo la tarjeta «Viaje a la Luna» hacia `/moon-journey`. Las escenas Phaser no se colocan en `src/pages/`.
- **D-25 (2026-11-14, aprobada por el usuario; revisada por D-26):** separar el interior de la nave en la escena `ShipInteriorScene` (`ship-interior`, entrada del nivel 2 vía `/moon-journey`), conservando cápsula inicial, ventana, zona de traje EVA con F y esclusa. `ExteriorScene` (`exterior-scene`) queda solo para la vista espacial y recibe `{ tethered }` al cruzar la esclusa, de modo que `ShipInteriorScene` añade la escena exterior sin arrancar y la inicia con `scene.start` al salir con traje.
- **D-26 (2026-11-15, aprobada por el usuario):** la vista interior del nivel 2 usa `Mission_2_Exterior_900x500.png` (copiado a `public/assets/mission-2-interior-bg.png`) como fondo a escala 1:1. El mundo interior pasa a 900 × 500, la cámara ajusta su zoom para cubrir la pantalla sin deformar la imagen y el movimiento conserva WASD/flechas con velocidad normalizada. Se retiran por ahora las zonas de ventana, traje EVA y esclusa; `ExteriorScene` sigue registrada pero sin acceso hasta definir esas interacciones sobre el arte final.
- **D-27 (2026-11-15, aprobada por el usuario; revisada por D-29 en los asientos):** las colisiones del interior se definen en `src/game/levels/moonJourneyCollision.ts`, transcripción tipada del export `physics-body (4).json` (29 polígonos y 2 círculos en coordenadas del mapa 900 × 500), como fuente única de verdad. Se mantiene Arcade y se descomponen los polígonos inclinados en franjas horizontales de 4 px calculadas sobre los bordes reales del polígono (error máximo ~2 px), con rectángulos exactos para las cajas alineadas y `setCircle` para los círculos. El cuerpo del jugador se reduce a 22 × 28 para cruzar la puerta de 44 px entre la sala lunar y la sala de mando, y el astronauta aparece en (330, 250). El overlay de depuración queda desactivado tras la constante `DEBUG_COLLISIONS`.
- **D-28 (2026-11-15, aprobada por el usuario):** el export `physics-body (4).json` no se versiona en el repositorio; sus datos viven ya en `src/game/levels/moonJourneyCollision.ts`, que es la única fuente de verdad. La reconexión de la esclusa con `ExteriorScene` sigue pendiente hasta definir las zonas interactivas sobre el arte final, conforme a D-26.
- **D-29 (2026-11-15, aprobada por el usuario):** en `src/game/levels/moonJourneyCollision.ts` se eliminan las tres franjas horizontales inferiores de los asientos y se recorta cada respaldo a su mitad superior (hasta y = 180, 250 y 320 px para los asientos alto, medio y bajo). Cada asiento conserva una sola pieza recta, sin forma de L, de modo que el cuerpo de 22 × 28 puede caminar sobre los cojines, entrar en el hueco detrás del asiento medio desde arriba y llegar a la puerta de salida inferior izquierda junto al círculo. Los respaldos siguen bloqueando su zona alta y el resto del mapa de colisión no cambia.

## Por concretar antes de implementarlo
- Diseño visual y distribución exacta del mapa.
- Contenido preciso del código de 4 dígitos: fijo, generado por partida o asignado por ingeniero.
- Orden de las comprobaciones al interactuar con la nave y cuándo se consume combustible.
- Texto definitivo de cada modal y objetivos en pantalla.
- Detalles de la segunda misión; no inventarla.

## Política
Agregar decisiones nuevas con ID y fecha, indicando si fueron aprobadas por el equipo. No reescribir decisiones confirmadas sin autorización.
