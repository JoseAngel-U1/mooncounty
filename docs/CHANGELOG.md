# CHANGELOG

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
