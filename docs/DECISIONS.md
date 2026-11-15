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
| D-08 | Misión 1 transcurre en Tierra; flujo original de documentos y código entregado por ingeniero | Sustituido por D-28 por autorización del usuario |
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
| D-20 | Refactorización con React Router, páginas y componentes en carpetas propias con CSS, MainLayout con Outlet y rutas centralizadas. `src/game/scenes/` para escenas base o compartidas entre niveles, `src/game/levels/{levelId}/` para escenas, configuraciones y lógica específicas de cada nivel, y `src/game/levels/registry.ts` como registro centralizado. Motor separado de React. Validar levelId antes de iniciar Phaser y conservar apariencia y controles | Aprobada por el usuario el 2026-11-14; actualizada el 2026-11-14 para fijar la organización por nivel |

## Clasificación de componentes — ampliación de D-20
- **D-21 (2026-11-14, aprobada por el usuario):** separar los componentes existentes en `ui/` (interfaz específica de MoonCounty) y `shared/` (genéricos o compartidos entre páginas y funcionalidades), cada uno con carpeta y TSX/CSS propios. Mantener las responsabilidades de páginas, layouts, router y motor, sin cambios visuales o funcionales ni avance de fase.

## Spawn por nivel
- **D-22 (2026-11-15, aprobada por el usuario):** spawn independiente para Tierra mediante `getPlayerSpawn()` sobrescribible, en píxeles del mundo original. La implementación base conserva el centro del mundo para los demás niveles. Las coordenadas iniciales de Tierra mantienen la posición anterior hasta que el usuario las ajuste.

## Herramientas de desarrollo y producción
- **D-23 (2026-11-15, aprobada por el usuario):** las herramientas de depuración, especialmente el editor de colisiones F3 de Tierra, no deben estar disponibles en producción. Antes de entregar se comprobará que F3 no lo activa y que sus controles no están disponibles. Se mantiene el editor durante el desarrollo; su exclusión o deshabilitación para producción queda pendiente en WORK_STATUS, sin implementar cambios de lógica ni autorizar compilaciones en esta tarea.

## Interacción básica autorizada
- **D-24 (2026-11-15, aprobada por el usuario):** Tierra dispone de interacción por proximidad/E sobre el objeto más cercano, con ID, X/Y del mapa original, radio y acción configurables. Primer objeto de prueba en los cuatro trajes con mensaje temporal «Interacción detectada». Sistema reutilizable sin activar otros niveles ni interferir con F3. Inventario, NPC, diálogos y progresión de misión quedan fuera de este paso.

## Recogida de traje autorizada
- **D-25 (2026-11-15, aprobada por el usuario):** sustituir la prueba de D-24 por la recogida única de un traje en Tierra. Estado `hasSpacesuit` inicialmente false por sesión, true tras la primera E; mensajes «Traje espacial equipado» y «Ya tienes un traje espacial» en repeticiones. Aviso específico «Presiona E para recoger traje». Estado en memoria, sin inventario completo ni cambio de sprite y sin alterar las reglas de despegue. Ampliación registrada en MISSION_01.

## Coordinador de misión autorizado
- **D-26 (2026-11-15, aprobada por el usuario):** añadir un NPC coordinador visible en Tierra, adicional al ingeniero, reutilizando la textura del astronauta con tinte y etiqueta para no generar imágenes nuevas. Su posición provisional queda claramente configurable en `EARTH_COORDINATOR_POSITION` y puede ajustarse sin tocar la lógica. La interacción usa el sistema de proximidad/E existente: sin traje muestra «Coordinador: Primero debes recoger un traje espacial»; con traje y sin solicitud previa muestra el encargo de coordenadas y registra `coordinatesRequested = true`; las repeticiones muestran un recordatorio breve. Estado en memoria de la sesión. No implementa objeto de coordenadas, documentos, ingeniero, código de lanzamiento ni otros niveles.

## Sprites reales del jugador autorizados
- **D-27 (2026-11-15, aprobada por el usuario):** sustituir el diseño provisional del jugador por los PNG reales de `public/assets/characters/`, sin generar ni reemplazar sprites. El jugador inicia con `astronauta_sin_casco` y cambia a `astronauta_con _casco` al recoger el traje (`hasSpacesuit = true`), ampliando D-25. Mapeo confirmado por el usuario: frames 1–16 reposo, 17–24 sentado (no usar), 25–32 caminar lateral con `flipX` para izquierda, 33–38 caminar arriba y 39–44 caminar abajo. No implementar carrera. El cuerpo físico se ajusta al sprite para evitar atravesar paredes. El coordinador continúa distinguiéndose con tinte y etiqueta, reutilizando el sprite con casco.

## Flujo definitivo de Tierra e ingeniero
- **D-28 (2026-11-15, aprobada por el usuario):** flujo definitivo: traje → solicitud de coordenadas por coordinador → recogida de coordenadas → entrega al ingeniero → datos de trayectoria → coordinador → código fijo `4826` → nave (pendiente). Sustituye el flujo original de D-08 y amplía D-26. Se conserva `coordinatesRequested`; se añaden `hasCoordinates`, `hasTrajectoryData` y `launchCode`. El ingeniero reutiliza el astronauta sin casco con reposo existente, tinte azul y etiqueta en `(164, 108)`, radio 90; no moverlo ni modificar colisiones sin consultar. La entrega consume las coordenadas; los datos quedan como registro de obtención y el código registra su recepción por el coordinador. El punto de coordenadas queda pendiente de ubicación confirmada; no inventar su posición ni implementar nave.

## Recogida de coordenadas autorizada
- **D-29 (2026-11-15, aprobada por el usuario):** punto interactivo sobre el rectángulo del mapa `(221, 431, 45, 41)`, con X/Y como esquina superior izquierda y centro calculado `(243.5, 451.5)`. Recogida con E solo tras traje y solicitud del coordinador; registra `hasCoordinates`, evita duplicados y conserva D-28. Sin nueva colisión, cambios de posición ni nave. Resuelve la ubicación pendiente de D-28. El usuario confirma visualmente que el ingeniero funciona y puede hablar con él mediante E.

## Escala visual de astronautas en Tierra
- **D-30 (2026-11-15, aprobada por el usuario):** jugador, coordinador e ingeniero a escala visual 2× mediante `EARTH_ASTRONAUT_SCALE` en `earthPlayerSprites.ts`. Sprites originales 32×32 mostrados a 64×64 en el mundo, con pixel art y proporciones conservadas. PNG intactos; cuerpo del jugador conserva 22×31 y su posición relativa mediante compensación de escala. NPC sin nuevos cuerpos físicos. Etiquetas y avisos se desplazan sobre la figura ampliada. Colisiones, radios, posiciones, animaciones y cambio de casco conservados. Nave fuera de alcance; sin autorización de build.

## Elevador bidireccional de Tierra (sustituido por D-32)
- **D-31 (2026-11-15, aprobada por el usuario):** traslado automático bidireccional entre las zonas confirmadas A `(1247, 395, 148, 40)` y B `(1399, 394, 9, 40)`, sin pulsar E y sin modificar colisiones. Entrar en A desde fuera traslada a B; tocar el borde oeste de B traslada a A. B se activa por contacto y nunca coloca el cuerpo dentro de la colisión sólida `entrada-superior`. Llegadas calculadas con el cuerpo completo 22×31: A `(1321, 415)`; B `(1388, 414)`, con el borde derecho del cuerpo en X=1399 sin solapar el obstáculo. Los recorridos barridos entre ambas llegadas se verificaron libres. Durante el traslado se bloquean movimiento y E, el cuerpo no simula física y se interpola con Phaser (`Sine.easeInOut`, ~67 px en ~480 ms) usando la animación lateral existente; al terminar se restaura el control y el reposo. Anti-bucle: la zona de llegada queda bloqueada hasta que el jugador se aleje de ella. F3 interrumpe el traslado sin dejar el cuerpo bloqueado. Geometría real: ambas zonas están a la misma altura sobre el obstáculo `elebador` `(1246, 440, 162, 229)`, por lo que el recorrido transitable es horizontal y el extremo este de B es un fondo sin salida; no existe ruta vertical en ese punto. Sin cambios en sprites, apariencia, NPC, misión, radios ni otros niveles.

## Elevador vertical de Tierra
- **D-32 (2026-11-15, aprobada por el usuario):** sustituye el recorrido horizontal de D-31 por un traslado exclusivamente vertical con X constante en 1321. Extremos confirmados: superior Y=415 e inferior Y=690. Zonas de activación confirmadas: superior `(1247, 395, 148, 40)` e inferior `(1247, 675, 148, 40)`. Activación automática sin E al entrar en una zona **y** estar dentro de la columna de 22 px centrada en X=1321 (X 1310–1332); como las zonas son más anchas que la cabina, no se ajusta X automáticamente: si el cuerpo no está en la columna, no se activa. Durante el traslado X se conserva exactamente (aunque el jugador entre en 1315, la subida y bajada mantienen 1315); solo cambia Y. Subida usa `walkUp` (Y=690→415) y bajada usa `walkDown` (Y=415→690); se bloquean movimiento e interacciones y el cuerpo no simula física. Se ignora **solo** la colisión `elebador` `(1246, 440, 162, 229)` durante la comprobación del recorrido; ninguna colisión se modifica ni elimina y la física se restaura al terminar. Anti-bucle: la zona de llegada queda bloqueada hasta que el jugador la abandone por completo (no basta con salir de la columna). F3 interrumpe y restaura. El piso superior queda accesible únicamente mediante el elevador. Sin cambios en sprites, apariencia, NPC, misión, radios ni otros niveles.

## Pendientes de definición vigentes
- Diseño visual y distribución exacta del mapa.
- Orden de las comprobaciones al interactuar con la nave y cuándo se consume combustible.
- Texto definitivo de cada modal y objetivos en pantalla.
- Detalles de la segunda misión; no inventarla.

## Política
Agregar decisiones nuevas con ID y fecha, indicando si fueron aprobadas por el equipo. No reescribir decisiones confirmadas sin autorización.
