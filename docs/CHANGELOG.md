# CHANGELOG

## 2026-11-15 — Estabilidad de dirección diagonal de tripulación
- Diagnóstico: el historial con `Math.hypot` y el muestreo mantienen las posiciones y distancias; la comparación estricta `abs(dy) > abs(dx)` alternaba la dirección visual por redondeo en diagonales a 45°. Reproducción: 208 cambios de animación innecesarios en cuatro recorridos diagonales, sin bloqueo de posición reproducido.
- Ajuste localizado en `earthCrew.ts`: tolerancia de 0,000001 px para comparar componentes al elegir eje visual; empate conserva preferencia lateral. No cambia los recursos ni definiciones de animación, movimiento, historial, posiciones, distancias, colisiones o elevador.
- Verificación con Node directo: ocho direcciones, separaciones 65/130, cambios rápidos, detención/reanudación y muestreo de esquina correctos; cero cambios innecesarios de animación. En Edge: cuatro diagonales por teclado simultáneo con velocidad 220 px/s, movimiento ortogonal, subida/salida del elevador, F3/modal y 31 zonas conservadas; sin excepciones. Confirmación visual del problema reportado pendiente. Sin build ni compilaciones.

## 2026-11-15 — Recursos propios de los acompañantes (D-37)
- Ambos acompañantes usan `public/assets/characters/tripulante/`, con la misma apariencia. Nuevo `earthCrewSprites.ts` independiente de la configuración del astronauta principal.
- Idle: archivos 32–47; lateral: 56–63 con flipX; arriba: 64–69; abajo: 70–75. Sitting 48–55 excluido; escala 2×, pixel art y velocidades de animación conservados.
- Precarga desde EarthScene y selección de recursos en EarthCrew; sin cambios en seguimiento, distancias, posiciones, elevador ni jugador.
- Verificación directa con Node: 36 texturas y cuatro animaciones con rangos exactos y registro idempotente. Sin build ni compilaciones; revisión visual pendiente.

## 2026-11-15 — Tripulación automática de Tierra (D-36)
- Nuevo `earthCrew.ts`: dos acompañantes con casco, escala 2×, seguimiento del recorrido real a 65/130 px y animaciones reutilizadas. Historial acotado a 200 px con recorte parcial para evitar saltos iniciales.
- Integración en `EarthScene`: creación por sesión, seguimiento durante el elevador y pausa en Idle con F3/modal; el modal abierto durante una interacción bloquea también el resto de ese mismo update.
- Verificación: 32 comprobaciones con dobles de Phaser más regresión del recorte inicial; Edge headless verifica spawn, movimiento con giro, Idle, ausencia de cuerpos, F3, subida y salida del elevador, pausa con modal y 31 zonas conservadas, sin excepciones de ejecución.
- La prueba inicial usó un bundle temporal de esbuild; la repetición final ejecutó TypeScript mediante Node sin generar artefactos. No se ejecutó build de producción ni tsc. Tipos/build y revisión visual pendientes.

## 2026-11-15 — Interacción final con la nave y panel de lanzamiento (D-35)
- Añadida la interacción `nave` en `earthInteractions.ts` sobre la zona `(1274, 39, 70, 137)`, centro `(1309, 107.5)` y radio circunscrito ≈ 76,9 px del sistema de proximidad; sin nueva colisión. Aviso «Presiona E para acceder al panel de lanzamiento»; sin `launchCode` muestra autorización pendiente y no abre nada.
- Nuevo puente sin Phaser `earthLaunchPanelBridge.ts` y componente `LaunchPanel` en `src/components/ui/` con overlay semitransparente, campo de exactamente 4 dígitos, botón «Autorizar lanzamiento», errores y reintentos, cierre por botón/×/Escape y mensaje «¡Misión Tierra completada!» sin animación.
- `earthMissionState.ts` añade `missionCompleted`; `earthMissionConfig.ts` expone `EARTH_LAUNCH_CODE_LENGTH` e `isEarthLaunchCode()` para no duplicar `4826`. `EarthScene` bloquea movimiento e interacciones mientras el modal está abierto y restaura control, teclas y foco al cerrar; F3 sigue independiente.
- Sin cambios en mapa, colisiones (31 intactas), NPC, elevador, animaciones ni resto del flujo. El límite de intentos, el combustible, los modales de fallo y el «Continuar» definitivo siguen pendientes.
- Verificación con Edge headless + CDP: aviso y autorización sin código, apertura con código, foco/trampa de teclado, bloqueo y restauración del movimiento, validación de longitud/dígitos, error y reintento, cierre sin pérdida de progreso, mensaje final y reapertura, F3 intacto y sin errores de consola. Comprobación de tipos y build pendientes de autorización.

## 2026-11-15 — Panel del editor F3 arrastrable (D-34)
- El panel flotante del editor de colisiones de Tierra se arrastra desde `.ee-title` con captura de puntero; al soltar, `left`/`top` quedan fijados y la posición se conserva al cerrar y reabrir F3 dentro de la escena.
- La posición se acota al contenedor del juego y se recalcula al redimensionar la ventana o reabrir el editor, sin cambios en el diseño del panel.
- Sin cambios en coordenadas, colisiones, interacciones, movimiento ni misiones; sigue siendo exclusivo de desarrollo.
- Verificación con Edge headless + CDP: movimiento, límites, persistencia, arrastre desde el cuerpo inerte, 31 colisiones iguales al módulo y sin errores de consola. Comprobación de tipos y build pendientes de autorización.

## 2026-11-15 — Sprites propios de ingeniero y coordinador (D-33)
- Añadido `src/game/levels/earth/earthNpcSprites.ts`: carga `NPC_Staff_v1` (ingeniero) y `NPC_Staff_v2` (coordinador), frames 32–39, y registra un Idle a 8 fps en bucle con texturas individuales.
- `EarthScene` usa estos sprites, elimina los tintes provisionales `0x6699ff` y `0xffcf66`, y conserva posiciones `(164, 108)`/`(930, 850)`, escala 2×, etiquetas y el respaldo al sprite del jugador si faltan texturas.
- Sin cambios en diálogos, interacciones, estados de misión, colisiones, elevador ni sprites/animaciones del jugador; sin recursos nuevos.
- Verificación: análisis de frames (parpadeo 36–38, siluetas v1/v2 idénticas) y prueba Node de carga, claves, 8 frames por NPC, bucle e idempotencia; 16 PNG accesibles por HTTP y Vite transforma los módulos. En ejecución (Edge headless + CDP) ambos NPC muestran su textura, sin tinte, escala 2×, posiciones y etiquetas intactas, Idle 32–39 en bucle y jugador sin cambios; sin errores de consola. Comprobación de tipos y build pendientes de autorización.

## 2026-11-15 — Elevador vertical exclusivo en Tierra (sustituye D-31)
- Reescrito `src/game/levels/earth/earthElevator.ts` para traslado solo vertical: X constante y extremos confirmados Y=415 (superior) e Y=690 (inferior).
- Zonas de activación confirmadas: `(1247, 395, 148, 40)` y `(1247, 675, 148, 40)`. Activación automática sin E al estar en la zona y dentro de la columna de 22 px centrada en X=1321 (1310–1332); no se ajusta X automáticamente, por lo que entrar en la zona fuera de la columna no activa.
- Subida con `walkUp` y bajada con `walkDown`; `body.moves=false` y bloqueo de movimiento/E durante el tween (`Sine.easeInOut`, ~275 px en ~2 s), restaurados al terminar. Solo se ignora la colisión `elebador` al comprobar el recorrido; no se modifica ni elimina.
- Anti-bucle más estricto: la zona de llegada queda bloqueada hasta abandonarla por completo. F3 interrumpe y restaura. EarthScene no necesitó cambios (misma interfaz y animaciones existentes).
- Pruebas Node de geometría, activación, X constante, física, animaciones e interrupción correctas. Sin build ni tsc; prueba visual pendiente. Documentada D-32 y actualizado el estado de D-31.

## 2026-11-15 — Elevador automático bidireccional en Tierra (sustituido por el elevador vertical)
- Añadido `src/game/levels/earth/earthElevator.ts`: traslado automático entre A `(1247, 395, 148, 40)` y B `(1399, 394, 9, 40)` sin pulsar E. Entrar en A lleva a B; tocar el borde oeste de B lleva a A.
- Llegadas calculadas con el cuerpo completo 22×31: A `(1321, 415)` y B `(1388, 414)`. B queda justo fuera de la colisión `entrada-superior`; ambas libres y unidas por un recorrido barrido sin obstáculos.
- Interpolación suave con Phaser (`Sine.easeInOut`) y animación lateral existente. Movimiento e interacciones bloqueados durante el traslado y restaurados al terminar; anti-bucle hasta alejarse de la zona de llegada.
- Integrado únicamente en EarthScene; colisiones, sprites, apariencia, NPC, misión, radios y otros niveles intactos. F3 interrumpe el traslado. Pruebas Node de geometría, activación y dobles de Phaser correctas; prueba visual y tsc pendientes. Decisión D-31 registrada.

## 2026-11-15 — Escala visual 2× de astronautas en Tierra
- Constante `EARTH_ASTRONAUT_SCALE` en `earthPlayerSprites.ts`: jugador, coordinador e ingeniero a 64×64, sin modificar PNG ni suavizado.
- Compensación de tamaño/offset del cuerpo para conservar 22×31 y posición mundial, también al equipar el traje. Ajuste de posiciones al resize conservado mediante extensión de la escena base.
- Etiquetas a 42 px y avisos E a 46 px del centro; margen adicional de textos configurable con valor por defecto cero en el sistema compartido. Radios y lógica de interacción intactos.
- Prueba con Arcade Body real correcta para dimensiones y posición tras escala, reconfiguración y flipX. Prueba visual pendiente; sin build ni tsc. Decisión D-30 registrada.

## 2026-11-15 — Recogida de coordenadas de lanzamiento
- Punto interactivo sobre rectángulo `(221, 431, 45, 41)`, centro calculado `(243.5, 451.5)`, radio 60 y aviso «Presiona E para obtener coordenadas».
- Requiere traje y solicitud del coordinador; primera E establece `hasCoordinates` y muestra el mensaje de entrega al ingeniero. Repeticiones informan que ya las tiene o ya las entregó, sin nuevas recogidas.
- Retirados avisos de ubicación pendiente de los NPC; el flujo hasta `4826` usa ya la recogida real. Sin nuevas colisiones, cambios de posición ni interacción con la nave.
- Pruebas en memoria correctas del flujo completo, requisitos, repetición, reinicio y acceso geométrico al centro. Ingeniero/E confirmados visualmente por el usuario. Recogida visual pendiente; sin build ni tsc. Actualizados MISSION_01, WORK_STATUS, ROADMAP y decisión D-29.

## 2026-11-15 — Ingeniero y flujo definitivo de Tierra
- Ingeniero en `(164, 108)` con tinte azul, etiqueta y reposo existente del astronauta sin casco, sin recursos nuevos. Radio E de 90; posición y colisiones conservadas.
- Se mantiene `coordinatesRequested`; se añaden `hasCoordinates`, `hasTrajectoryData` y `launchCode`. Ingeniero recibe coordenadas y entrega datos; coordinador solicita coordenadas y posteriormente entrega código fijo `4826` desde `earthMissionConfig.ts`. Diálogos fuera de orden y de repetición.
- Recogida de coordenadas pendiente de ubicación confirmada; no se crea objeto ni se desbloquea automáticamente. Nave pendiente. Flujo y requisitos documentados en MISSION_01, D-28 y ROADMAP.
- Pruebas en memoria correctas para progresión, repetición y reinicio; ruta transitable hasta `(164, 180)` comprobada geométricamente con cuerpo y colisiones reales. Prueba visual pendiente; sin build ni tsc.

## 2026-11-15 — Sprites reales del jugador y animaciones por dirección
- Verificación final en memoria correcta: rangos de ambas variantes, registro sin duplicados y callback del traje único. La repetición de HTTP quedó bloqueada por `ECONNREFUSED` en localhost:5173; prueba visual pendiente.
- Añadido `src/game/levels/earth/earthPlayerSprites.ts` para cargar los PNG individuales de `public/assets/characters/` y registrar animaciones: reposo 1–16, caminar lateral 25–32 con `flipX`, caminar arriba 33–38 y caminar abajo 39–44. Los frames 17–24 (sentado) no se cargan ni se usan; no se implementa carrera.
- El jugador inicia con `astronauta_sin_casco` y cambia a `astronauta_con _casco` al recoger el traje mediante `onSpacesuitEquipped`; movimiento, posición, cámara y colisiones se conservan. El coordinador reutiliza el frame con casco con tinte y etiqueta.
- `ExplorationScene` expone puntos de extensión para textura, cuerpo físico y animación del jugador, conservando el placeholder como respaldo si faltan assets. Tierra ajusta el cuerpo a 22×31 con offset (5, 1) y reproduce la animación según la dirección de movimiento.
- Registrada la decisión D-27 y actualizada la documentación de misión y estado. Verificados 72 PNG necesarios, HTTP 200 de recursos/módulos y transformación de Vite; sin build ni tsc, prueba visual pendiente.

## 2026-11-15 — NPC coordinador y solicitud de coordenadas
- Añadido coordinador visible en Tierra como sprite independiente, reutilizando `astronaut-placeholder` con tinte y etiqueta «Coordinador»; sin generar imágenes nuevas.
- Posición provisional centralizada en `EARTH_COORDINATOR_POSITION` (`X=930`, `Y=850`) de `earthInteractions.ts`, ajustable sin tocar la lógica. Radio de interacción 90 y aviso «Presiona E para hablar».
- Diálogos: sin traje, «Coordinador: Primero debes recoger un traje espacial»; con traje y sin solicitud previa, encargo de coordenadas y `coordinatesRequested = true`; repeticiones, recordatorio breve.
- Estado ampliado en `earthMissionState.ts` y reiniciado al crear la escena. Sin objeto de coordenadas, documentos, ingeniero, código de lanzamiento ni otros niveles. Traje, movimiento, colisiones, cámara y F3 conservados.
- Pruebas en memoria correctas para proximidad, estados y mensajes. Prueba visual pendiente; sin build ni tsc.

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
