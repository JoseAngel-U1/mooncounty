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

## Por concretar antes de implementarlo
- Diseño visual y distribución exacta del mapa.
- Contenido preciso del código de 4 dígitos: fijo, generado por partida o asignado por ingeniero.
- Orden de las comprobaciones al interactuar con la nave y cuándo se consume combustible.
- Texto definitivo de cada modal y objetivos en pantalla.
- Detalles de la segunda misión; no inventarla.

## Política
Agregar decisiones nuevas con ID y fecha, indicando si fueron aprobadas por el equipo. No reescribir decisiones confirmadas sin autorización.
