# CHANGELOG

## 2026-11-15 — Recogida única de traje espacial en Tierra
- Sustituida la acción de prueba por recogida funcional: aviso «Presiona E para recoger traje», primera recogida «Traje espacial equipado» y repeticiones «Ya tienes un traje espacial».
- Estado único `EarthScene.missionState.hasSpacesuit`, inicialmente false y restablecido al crear la escena. `earthMissionState.ts` define su tipo y fábrica; `earthInteractions.ts` conserva coordenadas y radio y recibe la referencia al estado de la sesión.
- Añadido `prompt` opcional al contrato reutilizable, conservando el texto predeterminado para los demás objetos. Sprite, F3, colisiones y movimiento conservados.
- Ampliación del traje documentada en MISSION_01 y D-25; inventario completo y demás etapas pendientes. Pruebas en memoria correctas para inicio, primera recogida, repetición y nueva sesión. Prueba visual pendiente; sin build ni tsc.

## 2026-11-15 — Interacción por proximidad y tecla E en Tierra
- Añadidos contrato de objetos interactivos y selector del más próximo en `src/game/interactions/`, con sistema Phaser reutilizable instanciado únicamente por EarthScene.
- Configuración de Tierra en `earthInteractions.ts`: ID, posición original X/Y, radio y acción. Prueba en los cuatro trajes `(470, 945)`, radio 100, con mensaje «Interacción detectada» durante 1,5 segundos.
- Indicador de proximidad «Presiona E para interactuar» y una acción por pulsación. Interacciones suspendidas sin foco o mientras F3 está activo; retirada de la tecla y textos al cerrar la escena.
- Pruebas en memoria del selector correctas para proximidad, borde del radio, salida, empate y lista vacía. Prueba visual pendiente. Sin build ni comandos equivalentes; sin inventario, NPC, diálogos ni progresión.

## 2026-11-15 — Pendiente de exclusión del editor F3 en producción
- Registradas en WORK_STATUS la tarea de deshabilitar o excluir completamente el editor F3 de producción y la comprobación previa a la entrega de que F3 y sus controles no están disponibles.
- Añadida la regla de herramientas de depuración exclusivas de desarrollo en AGENTS.md y registrada la decisión D-23.
- Cambio únicamente documental: el editor sigue disponible durante el desarrollo. No se modificó la lógica del juego ni se ejecutaron comandos de compilación.

## 2026-11-15 — Spawn configurable por nivel
- Añadido `getPlayerSpawn()` sobrescribible en ExplorationScene, con el centro del mundo como valor por defecto.
- Tierra usa `EARTH_PLAYER_SPAWN` en EarthScene.ts: X=725.5, Y=542 en píxeles originales del mapa, independientes del zoom y la cámara.
- El spawn solo se consulta al crear al astronauta; se conserva el ajuste existente a los límites al redimensionar. Revisión de código realizada; prueba visual y build pendientes, sin ejecutar compilación.

## 2026-11-14 — Overlay de depuración de colisiones con F3
- Añadido un overlay de depuración exclusivo de Tierra que F3 activa y desactiva en ejecución; empieza desactivado.
- Dibuja los cuerpos reales de Arcade en coordenadas del mundo: relleno rojo semitransparente y borde rojo para cada obstáculo estático, y relleno/borde verde para el cuerpo dinámico del astronauta.
- Las figuras siguen el desplazamiento y el zoom de la cámara y se actualizan con el movimiento del astronauta. Etiquetas con el identificador de cada obstáculo, desactivables con `SHOW_DEBUG_LABELS`.
- No cambia colisiones, velocidades ni controles. `DEBUG_COLLISIONS` queda como estado inicial del overlay.
- Verificación con capturas headless a 1280 × 720 y 1920 × 1080: bordes rojos visibles y rectángulo verde del cuerpo escalado con el zoom; sin overlay con el estado inicial desactivado. No se ejecutó build ni `tsc`.

## 2026-11-14 — Colisiones del escenario de Tierra
- Añadido `src/game/levels/earth/earthCollisions.ts` con los rectángulos de colisión en coordenadas del mundo y etiqueta por estructura: muros perimetrales, hangar y edificios, módulos, torres, contenedores de combustible y estructuras del sur.
- EarthScene crea una zona estática invisible por rectángulo y un collider con el astronauta. El punto inicial y la rejilla de suelo de 52 × 52 px permanecen transitables; no se bloquean pasillos ni accesos.
- Añadida la constante `DEBUG_COLLISIONS` (desactivada) como estado inicial del overlay de depuración.
- ExplorationScene expone `player` como `protected` para permitir el collider sin duplicar la creación del personaje. Sin cambios de movimiento, cámara, mapa ni otros niveles.
- Sin NPC, objetos interactivos, misiones ni inventario. Verificación estática y HTTP 200 de los módulos en el servidor existente; no se ejecutó build ni equivalente. Ajuste fino de coordenadas y prueba interactiva pendientes.

## 2026-11-14 — Corrección de franjas vacías en Tierra
- Diagnóstico: con el viewport más ancho que el mapa (1451 px), Phaser mantenía `scrollX = 0` y el resto del canvas mostraba el fondo del juego.
- ExplorationScene expone `getCameraZoom` (1 por defecto); EarthScene lo sobrescribe con `max(1, viewport/anchoMapa, altoMapa)` para cubrir el viewport con escala uniforme, sin deformar el PNG.
- Se conservan mundo, límites, movimiento WASD/flechas, navegación y respaldo con cuadrícula.
- Verificación mediante capturas headless a 1920×1080, 1600×900 y 1280×720 sin franjas de fondo. No se ejecutó build ni equivalente.

## 2026-11-14 — Mapa pixel art de Tierra
- EarthScene carga `/assets/levels/earth/map.png` en preload y lo muestra a escala 1:1 con origen en (0,0), sin estiramientos.
- El mundo físico y los límites de cámara usan las dimensiones reales del PNG (1451 × 1084); la cámara sigue al astronauta y WASD/flechas se conservan.
- ExplorationScene expone `getWorldSize` y `renderBackground` para que cada nivel ajuste mundo y fondo sin duplicar lógica. El respaldo con cuadrícula y mundo del tamaño del canvas se mantiene si el PNG falta o no carga.
- Sin colisiones, NPC, misiones, inventario ni cambios en otros niveles.
- Verificación por revisión de código y HTTP 200 del PNG y módulos en el servidor existente. No se ejecutó build ni equivalente; prueba visual pendiente.

## 2026-11-14 — Escena independiente de Tierra
- Creada `src/game/levels/earth/EarthScene.ts`, que extiende ExplorationScene y usa la clave `earth`.
- ExplorationScene se mantiene como escena base reutilizable en `src/game/scenes/` y ahora recibe su clave por constructor, sin duplicar movimiento, cámara ni límites.
- Renombrado `src/game/levels/levels.ts` a `src/game/levels/registry.ts` y actualizadas las importaciones de GamePage, LevelSelectScreen y LevelCard. sceneRegistry asocia `earth` con EarthScene.
- Actualizados AGENTS.md y D-20 con la convención general: escenas base en `game/scenes/`, lógica por nivel en `game/levels/{levelId}/` y registro en `game/levels/registry.ts`.
- Sin NPC, misiones, objetos, colisiones, mapa definitivo, cambios visuales ni modificaciones a otros niveles.
- Verificación por revisión de imports y HTTP 200 en el servidor de desarrollo existente. No se ejecutó build ni equivalente; validación visual e interactiva pendiente.

## 2026-11-14 — Declaraciones Vite para importaciones CSS
- Movido vite-env.d.ts de la raíz a src/vite-env.d.ts: tsconfig.app.json incluye únicamente src y dejaba fuera la declaración anterior.
- Conservada la referencia a vite/client, que incluye declaraciones para '*.css'. Importaciones CSS normales y opciones estrictas de TypeScript sin cambios.
- No se encontraron comentarios @ts-ignore ni @ts-expect-error que retirar. Sin cambios visuales o funcionales.
- Verificación por revisión de configuración y declaraciones instaladas; no se ejecutó build ni equivalente.

## 2026-11-14 — Organización de componentes ui/shared
- Migrados StartScreen, LevelSelectScreen y LevelCard a `src/components/ui/`; PhaserGame y NavigationButton a `src/components/shared/`.
- Conservados TSX y CSS juntos en la carpeta de cada componente. Actualizadas importaciones de páginas y componentes, sin alterar estilos, lógica, rutas ni ciclo de vida Phaser.
- Actualizados AGENTS.md, WORK_STATUS.md y README de componentes/motor. Convención obligatoria para futuros cambios, sin crear funcionalidades ni carpetas futuras y sin avance de fase.
- No se ejecutó build ni equivalente; verificación de compilación pendiente de autorización explícita.
- Verificados imports sin referencias antiguas en src y respuestas HTTP 200 de componentes, CSS y páginas consumidoras en el servidor de desarrollo existente. Validación visual/interactiva pendiente.

## 2026-11-14 — Refactorización arquitectónica frontend
- Instalado react-router-dom 7.18.5 y sustituido el estado manual de navegación por BrowserRouter, rutas centralizadas y MainLayout con Outlet.
- Creadas HomePage, LevelSelectPage, GamePage y NotFoundPage, cada una con carpeta y CSS propios.
- Migrados StartScreen, LevelSelectScreen, LevelCard y PhaserGame a carpetas individuales conservando sus estilos. Extraído NavigationButton reutilizable a partir de los botones existentes.
- Movidos niveles a `src/game/levels/`, escenas y registro de escenas a `src/game/scenes/`. Configuración del motor extraída a createGame; ExplorationScene conserva su lógica.
- GamePage valida levelId antes de montar Phaser: bloqueados redirigen al menú, inexistentes muestran 404. Se mantiene cancelación de montaje pendiente y destrucción del juego al salir o cambiar de nivel.
- Estilos específicos trasladados desde global.css a componentes/páginas. Corregidas rutas de imágenes para acceso directo y URLs anidadas.
- Actualizados AGENTS.md y documentación para establecer esta organización como obligatoria. Refactorización sin avance de fase ni cambios de misiones.
- Verificación por revisión de código, servidor de desarrollo y comprobación del registro real en memoria. Pruebas visuales, historial y ciclo de vida en navegador pendientes. No se ejecutó compilación; requiere autorización explícita.

## 2026-11-14 — Selección reutilizable de niveles
- Añadidos registro centralizado de niveles y registro tipado de escenas reales. Tierra enlaza a ExplorationScene; Luna permanece bloqueada sin escena ficticia.
- Añadidos LevelSelectScreen y LevelCard con estilos propios, imágenes SVG pixel art locales, estados disponible/bloqueado y renderizado dinámico desde el registro.
- App gestiona navegación tipada portada → menú → juego; botones para volver al menú y al inicio. PhaserGame acepta una clave de escena y conserva su limpieza al desmontar.
- Menú responsive con foco de entrada y botones accesibles; scroll interno en pantallas pequeñas. Sin nuevas dependencias.
- ExplorationScene, movimiento, cámara y límites conservados. Sin persistencia, desbloqueos, inventario, misiones ni avance de fase.
- Revisado código y comprobados HTTP 200 de módulos/recursos en el servidor de desarrollo existente. Comprobación del registro en memoria: IDs únicos, estados y claves correctos, imágenes accesibles. Prueba visual/interactiva pendiente; no se ejecutó compilación, pendiente de autorización explícita.

## 2026-11-14 — Pantalla de inicio
- Añadidos StartScreen.tsx y StartScreen.css: portada espacial retro responsive, título, estrellas, superficie lunar y figuras pixel art SVG, sin recursos externos ni emojis.
- Botón INICIAR nativo con estados de hover/foco/pulsación; App desmonta la portada y monta el juego existente, sin simulaciones de carga.
- El contenedor Phaser recibe foco al montarse para usar WASD/flechas directamente. Cámara, límites, mapa y lógica de movimiento conservados.
- Documentada aprobación de la portada en DECISIONS.md. Sin avance a Fase 2.
- Verificación mediante revisión de código y HTTP 200 en el servidor de desarrollo existente para la aplicación y módulos modificados. Prueba visual pendiente; build no ejecutado, pendiente de autorización explícita.

## 2026-11-14 — Límites sincronizados con el canvas
- Sustituido el mundo fijo por las dimensiones actuales de Phaser Scale Manager, al crear la escena y en cada RESIZE.
- Sincronizados límites físicos, límites de cámara, viewport completo y zoom 1; fondo, cuadrícula y bordes se redibujan con el nuevo tamaño.
- Cuerpo físico del tamaño de la textura y recolocación inmediata del astronauta al reducir la ventana; listener retirado al cerrar la escena.
- PhaserGame.tsx revisado: conserva Phaser.Scale.RESIZE. Controles WASD/flechas conservados.
- `npm run build` correcto con aviso no bloqueante de tamaño del bundle. Pruebas visuales de maximizar, restaurar y redimensionar pendientes por falta de herramientas de navegador.

## 2026-11-14 — Juego a ventana completa
- Eliminados encabezados y contenedor limitado de App; el componente Phaser ocupa toda la ventana.
- Phaser.Scale.RESIZE y dimensiones iniciales tomadas del contenedor para adaptar el canvas a cambios de resolución.
- CSS al 100% de ancho y alto, sin márgenes ni barras de desplazamiento; instrucciones de teclado conservadas en la etiqueta accesible.
- Cámara, mapa, límites y movimiento sin cambios. Sin avance de fase.
- `npm run build` correcto; aviso de tamaño del bundle no bloqueante. Verificación visual de redimensionado pendiente.

## 2026-11-14 — Corrección de flechas (Fase 1)
- Códigos de flechas explícitos en ExplorationScene; WASD conserva su asignación y lógica.
- Listener de teclado de Phaser dirigido al contenedor enfocable para recibir eventos antes del preventDefault delegado de React, que provocaba el descarte de las flechas en window.
- Prueba de regresión en memoria con KeyboardManager real: keydown/keyup de las ocho teclas recibidos antes de cancelar el evento; reproducido el descarte de eventos cancelados previamente.
- `npm run build` correcto; persiste el aviso de tamaño del bundle. Prueba visual en navegador pendiente. Sin avance de fase.

## 2026-11-14 — Integración Phaser (Fase 1)
- Cierre técnico de Fase 0: dependencias instaladas, arranque local confirmado por el usuario y build inicial correcto.
- Componente React reutilizable para Phaser 3.90.0, con creación cancelable en StrictMode y destrucción al desmontar.
- Escena cenital provisional de formas simples, astronauta pixelado y movimiento WASD/flechas con velocidad diagonal normalizada.
- Límites físicos de mundo, cámara de seguimiento delimitada y canvas adaptable al contenedor.
- Foco accesible mediante clic/Tab y reinicio de teclas al perder el foco.
- Actualizada pantalla principal, estilos y documentación de módulos.
- Build final correcto. Aviso no bloqueante por bundle JS mayor de 500 kB; prueba visual y ciclo de desmontaje/remontaje pendientes.
- Fase 2 pendiente de autorización; repositorio remoto y primer commit siguen pendientes administrativos.

## 2026-11-14 — Preparación inicial
- Se creó estructura del proyecto Vite/React/TypeScript.
- Se declaró Phaser como dependencia para integración posterior.
- Se documentaron requisitos, decisiones, fases, reglas de OpenCode y pruebas.
- No se ha implementado todavía el juego ni verificado la instalación de dependencias.
