# WORK_STATUS — MoonCounty

**Última actualización:** 2026-11-14
**Estado:** refactorización arquitectónica de Fase 1 con React Router y componentes organizados en ui/shared. Validación visual pendiente y build de los cambios actuales pendiente de autorización explícita.
**Fase activa:** Fase 1 — Integración Phaser. No avanzar a Fase 2 sin autorización.

## Completado
- Añadida 3.ª tarjeta en `src/game/levels/levels.ts` (`moon-journey`: «Viaje a la Luna») reutilizando `LevelCard` y `LevelSelectScreen`, con imagen `/assets/moon.svg` y navegación hacia la nueva ruta `/moon-journey` (`src/pages/MoonJourneyPage/MoonJourneyPage.tsx` + `MoonJourneyPage.css`). Actualizados `LevelSelectPage`, `GamePage` (redirección a `/moon-journey` si se accede por `/game/moon-journey`) y `AppRouter`. Conservadas `Tierra` y `Luna` (bloqueada) sin cambios.
- Componentes existentes separados en `src/components/ui/` (StartScreen, LevelSelectScreen, LevelCard) y `src/components/shared/` (PhaserGame, NavigationButton). Cada componente conserva TSX y CSS propios juntos, sin cambios de estilos o lógica. Actualizadas las importaciones de las cuatro páginas y entre componentes; responsabilidades de páginas, layouts, router y motor conservadas.
- Pantalla de inicio React a ventana completa: título MoonCounty, estrellas CSS, superficie lunar e ilustraciones SVG pixel art de astronauta, módulo y cohete. Botón INICIAR accesible por teclado; estilos separados en StartScreen.css.
- Navegación con React Router 7.18.5: `/` → `/levels` → `/game/:levelId`, con regreso al menú/inicio y ruta `*`. Eliminado el estado manual de navegación de App.
- HomePage, LevelSelectPage, GamePage y NotFoundPage en carpetas propias con CSS; MainLayout usa Outlet. Componentes reutilizables migrados a carpetas individuales sin duplicar código. NavigationButton centraliza los botones de retorno ya existentes y usa useNavigate.
- LevelSelectScreen genera las tarjetas LevelCard desde `src/game/levels/levels.ts`. Tierra disponible con clave `exploration`; Luna bloqueada con `sceneKey: null`, sin implementación lunar. Imágenes SVG con rutas absolutas para funcionar en URLs anidadas.
- GamePage resuelve levelId desde la URL: Tierra monta Phaser, Luna redirige a `/levels` con replace e IDs desconocidos muestran NotFoundPage. Los dos últimos casos no crean Phaser.
- `src/game/scenes/sceneRegistry.ts` relaciona claves con constructores reales; `src/game/createGame.ts` conserva la configuración del motor. PhaserGame solo gestiona contenedor, foco y ciclo de vida. ExplorationScene fue trasladada sin cambios de lógica.
- Estilos originales de portada, menú y tarjetas conservados. Estilos de canvas y botones extraídos de global.css a sus componentes; estilos del contenedor del juego en GamePage.css. Global.css contiene únicamente reset y estilos globales.
- El contenedor del juego recibe foco automáticamente. El menú enfoca su encabezado al entrar y admite navegación por teclado; las tarjetas bloqueadas tienen botón deshabilitado.
- Requisitos acordados de la misión 1 documentados.
- Reglas para OpenCode, decisiones, roadmap y checklist de pruebas.
- Scaffold React + TypeScript + Vite con dependencia Phaser.
- Dependencias instaladas y arranque local confirmado por el usuario.
- Componente Phaser reutilizable con creación diferida cancelable para StrictMode y destrucción al desmontar.
- Escena provisional del mismo tamaño que el canvas, astronauta de formas simples, WASD/flechas, velocidad diagonal normalizada y colisiones con los límites. El tamaño fijo anterior de 1600 × 1200 se sustituyó para evitar franjas vacías.
- Vista a ventana completa con Phaser.Scale.RESIZE, cámara de seguimiento y estética pixelada provisional. Canvas al 100% del ancho y alto disponible, sin encabezados, márgenes ni scroll.
- Control por foco: clic o Tab para activar el escenario; limpieza de teclas al perder el foco.
- Al redimensionar: actualización de límites físicos y de cámara, viewport completo, zoom 1, redibujado del fondo/cuadrícula/borde y recolocación del astronauta dentro del área. Cuerpo físico del tamaño completo de la textura y limpieza del listener RESIZE al cerrar la escena.

## Pendiente inmediato
0. En el servidor de desarrollo existente (`http://localhost:5173`), probar portada → INICIAR → menú → EXPLORAR Tierra → VOLVER A MAPAS → VOLVER AL INICIO. Repetir con Tab + Enter/Espacio y entrar/salir varias veces: un único canvas en juego, ninguno en el menú, Luna siempre deshabilitada. Revisar tarjetas en escritorio, móvil y horizontal; el menú permite scroll interno en pantallas pequeñas para no recortar contenido.
   - Abrir y recargar `/levels` y `/game/earth` directamente. Probar Atrás/Adelante del navegador.
   - Abrir `/game/moon`: debe volver a `/levels` sin canvas. Abrir `/game/desconocido` y `/ruta-inexistente`: debe aparecer 404 sin canvas; comprobar el retorno al menú.
1. Validar manualmente Fase 1 con `npm run dev`: foco con clic/Tab, WASD/flechas y cuatro bordes. Maximizar, restaurar y redimensionar, también con el astronauta junto al borde inferior/derecho: comprobar ausencia de franjas y personaje completamente visible. La cámara conserva el seguimiento, pero no necesita desplazarse cuando mundo y viewport coinciden.
2. Comprobar que al cambiar de foco no queda movimiento atascado y que StrictMode muestra un único canvas.
3. Comprobar desmontaje/remontaje: desaparece el canvas anterior y se crea una única instancia nueva.
4. Crear repositorio remoto y primer commit (pendiente administrativo de Fase 0; no ejecutado).
5. Esperar autorización expresa antes de iniciar Fase 2.

## Próxima instrucción para OpenCode
Validar la Fase 1 implementada. La Fase 2 requiere autorización del usuario; no implementar aún mapa con obstáculos ni objetos de misión.

## Extensión del registro de niveles
- Agregar metadatos en `src/game/levels/levels.ts`; la clave del registro se convierte en ID único y React genera la tarjeta automáticamente. GamePage usa getLevelById para resolver la URL.
- Para un nivel disponible, crear su clase real en `src/game/scenes/` y registrarla en `src/game/scenes/sceneRegistry.ts` usando su clave Phaser y referenciarla con `sceneKey`. El tipo SceneKey deriva de ese registro.
- Para un destino no implementado, usar `status: 'locked'` y `sceneKey: null`. No crear escenas ficticias.
- No es necesario modificar LevelSelectScreen, LevelCard ni las rutas para agregar entradas. La creación de nuevos niveles/escenas sigue requiriendo aprobación.

## Riesgos
- Tiempo limitado de hackatón: priorizar placeholders antes de pixel art final.
- Evitar que Phaser y React mantengan estados de misión divergentes.
- La misión 2 no está definida; no inventar su contenido.

## Registro de verificación
- Tarjeta y ruta «Viaje a la Luna» (2026-11-14): revisadas importaciones, tipos estrictos de `levels.ts` (`kind: 'phaser' | 'page'`) y redirección en `GamePage.tsx`. No se ejecutó compilación ni `tsc`; verificación de build pendiente de autorización explícita. Prueba visual y de navegación en navegador pendiente.
- Importaciones CSS (2026-11-14): movido vite-env.d.ts desde la raíz a src/vite-env.d.ts, conservando la referencia a vite/client. tsconfig.app.json ya incluye src; el archivo anterior quedaba fuera de su alcance. Verificado que vite/client declara el módulo '*.css' y que las importaciones siguen siendo normales. No se encontraron @ts-ignore ni @ts-expect-error en el código propio revisado. Sin cambios de configuración TypeScript ni componentes. Verificación por inspección; no se ejecutó compilación ni comprobación con tsc, pendiente de autorización.
- Separación ui/shared (2026-11-14): revisadas importaciones y ausencia de referencias antiguas en src. El servidor de desarrollo existente devuelve HTTP 200 para los cinco componentes migrados, sus cinco CSS y las cuatro páginas consumidoras. No se ejecutó compilación; build pendiente de autorización. Prueba visual/interactiva pendiente en navegador.
- Refactorización arquitectónica (2026-11-14): react-router-dom 7.18.5 instalado; npm informó cero vulnerabilidades. Revisión de imports, eliminación del estado manual, guardas de GamePage y limpieza de Phaser. HTTP 200 en el servidor existente para las rutas directas, módulos migrados y recursos. Comprobación en memoria del registro servido por Vite: Tierra disponible, Luna bloqueada sin escena, IDs desconocidos/ausentes rechazados e imágenes accesibles desde URLs anidadas. Esto no sustituye la prueba visual ni la navegación interactiva. No se ejecutó build, tsc ni equivalente; build pendiente de autorización.
- Selección de niveles (2026-11-14): revisión del flujo, desmontaje y tipos; HTTP 200 del servidor existente para App, menú, tarjeta, estilos, PhaserGame, registro de niveles/escenas e imágenes. Ejecutada comprobación en memoria del registro real servido por Vite: dos IDs únicos, Tierra disponible con clave exploration, Luna bloqueada sin escena y ambas imágenes SVG accesibles. Navegación visual, responsive y ciclos de entrada/salida pendientes en navegador. No se ejecutó build ni comando equivalente; pendiente de autorización explícita.
- Pantalla de inicio (2026-11-14): revisados montaje condicional, estilos acotados, botón nativo y transferencia de foco. Servidor de desarrollo existente en localhost:5173: HTTP 200 para `/`, App.tsx, StartScreen.tsx, StartScreen.css y PhaserGame.tsx. No se ejecutó build ni equivalente; compilación de producción pendiente de autorización. Validación visual/interactiva en navegador pendiente.
- Corrección de límites adaptables (2026-11-14): `npm run build` correcto, con el aviso habitual de tamaño del bundle. Revisado PhaserGame.tsx: RESIZE y dimensiones iniciales del contenedor ya correctos; corrección localizada en ExplorationScene.ts.
- Maximizar/restaurar/redimensionar: comprobación visual pendiente. No hay Playwright/Puppeteer instalados en este entorno; no se afirma una prueba de navegador realizada.
- Interfaz a ventana completa: `npm run build` correcto (2026-11-14); persiste el aviso no bloqueante de tamaño del bundle. Comprobación visual al redimensionar y de controles pendiente en navegador. Escena, mapa y límites sin cambios.
- Corrección de flechas: Phaser escucha en el contenedor enfocable antes de la cancelación de React. Verificados keydown/keyup de flechas y WASD con KeyboardManager real en prueba en memoria; no sustituye la prueba visual con foco en navegador, que sigue pendiente.
- `npm run build` tras corregir flechas: correcto (2026-11-14); mismo aviso no bloqueante de tamaño del bundle.
- Dependencias instaladas, verificadas con `npm ls --depth=0` (Phaser 3.90.0).
- Arranque local: confirmado por el usuario.
- `npm run build`: correcto antes de iniciar Fase 1 (2026-11-14).
- Criterio técnico de Fase 0 cumplido. Repositorio remoto y primer commit pendientes administrativos.
- `npm run build` después de Fase 1: correcto (2026-11-14), tras corregir el acceso al reinicio de teclas mediante el plugin de teclado de cada escena.
- Aviso no bloqueante de Vite: bundle JS de 1436,70 kB (403,86 kB gzip), superior a 500 kB al integrar Phaser.
- Prueba visual del juego y desmontaje/remontaje: pendiente; no se dispone de navegador automatizado en esta sesión. La confirmación del usuario corresponde al arranque previo, no a esta escena nueva.
