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

## Por concretar antes de implementarlo
- Diseño visual y distribución exacta del mapa.
- Contenido preciso del código de 4 dígitos: fijo, generado por partida o asignado por ingeniero.
- Orden de las comprobaciones al interactuar con la nave y cuándo se consume combustible.
- Texto definitivo de cada modal y objetivos en pantalla.
- Detalles de la segunda misión; no inventarla.

## Política
Agregar decisiones nuevas con ID y fecha, indicando si fueron aprobadas por el equipo. No reescribir decisiones confirmadas sin autorización.
