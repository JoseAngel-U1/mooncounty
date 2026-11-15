# CHANGELOG

## 2026-11-14 — Tarjeta y plantilla base para Viaje a la Luna
- Ampliado `LevelDefinition` en `src/game/levels/levels.ts` con `kind: 'phaser'` y `kind: 'page'` para admitir enlaces a páginas React propias sin romper los niveles Phaser.
- Añadida la entrada `moon-journey` («Viaje a la Luna», `/assets/moon.svg`) reutilizando `LevelCard` y `LevelSelectScreen`, manteniendo `Tierra` y `Luna` (bloqueada).
- Creada `src/pages/MoonJourneyPage/MoonJourneyPage.tsx` y `MoonJourneyPage.css` como plantilla mínima con retorno a `/levels`, y registrada la ruta `/moon-journey` en `src/router/AppRouter.tsx`.
- Actualizados `LevelSelectPage.tsx` para navegar a `level.path` en niveles de tipo `page` y `GamePage.tsx` para redirigir `/game/moon-journey` hacia `/moon-journey` sin montar Phaser.
- Registrada decisión D-22 en `docs/DECISIONS.md` y actualizados `AGENTS.md`, `src/game/README.md` y `docs/WORK_STATUS.md`. Build no ejecutado (pendiente de autorización explícita); validación visual en navegador pendiente.

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
