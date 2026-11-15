# AGENTS.md — MoonCounty

## Objetivo
Construir un MVP web educativo para el hackatón NASA: videojuego 2D con vista superior, un astronauta, misiones y consecuencias de decisiones. Priorizar un prototipo funcional en 24 horas.

## Fuente de verdad y orden de lectura
1. `AGENTS.md` (reglas de trabajo)
2. `docs/DECISIONS.md` (decisiones confirmadas)
3. `docs/ROADMAP.md` (fases y criterios)
4. `docs/WORK_STATUS.md` (estado actual y próxima tarea)
5. `docs/MISSION_01.md` (requisitos de la primera misión)
Si hay conflicto, detenerse y preguntar antes de modificar una decisión confirmada.

## Stack
- Vite + React + TypeScript para interfaz, inventario y modales.
- React Router (`react-router-dom`) para rutas y navegación frontend.
- Phaser 3 para mapa, personaje, movimiento, colisiones e interacciones.
- CSS sin librerías visuales obligatorias.
- Estado en memoria; sin backend, autenticación ni base de datos para MVP.

## Organización frontend obligatoria
- Cada página debe vivir en `src/pages/NombrePage/NombrePage.tsx` con su propio `NombrePage.css` en la misma carpeta.
- Separar obligatoriamente `src/components/` en `ui/` y `shared/`: `ui/` contiene los componentes visuales específicos de MoonCounty (actualmente StartScreen, LevelSelectScreen y LevelCard); `shared/` contiene componentes genéricos o reutilizables entre páginas y funcionalidades (actualmente PhaserGame y NavigationButton).
- Cada componente debe vivir en `src/components/ui/NombreComponente/` o `src/components/shared/NombreComponente/`, con sus propios archivos `NombreComponente.tsx` y `NombreComponente.css` juntos. No agrupar estilos de componentes en una carpeta general.
- Migrar componentes existentes sin duplicar implementación y actualizar sus importaciones. No crear componentes ficticios ni carpetas vacías para funcionalidades futuras; inventarios o modales específicos pertenecerán a `ui/` únicamente cuando se autorice su implementación.
- Los layouts viven en `src/layouts/NombreLayout/` con archivos TSX y CSS propios. `MainLayout` debe componer las páginas mediante `Outlet` de React Router.
- Centralizar rutas en `src/router/AppRouter.tsx`: `/`, `/levels`, `/game/:levelId` y `*`. Usar `Link`, `useNavigate` o `Navigate` para navegar; no duplicar la ruta activa en estado manual de React.
- Organizar el motor Phaser por nivel: `src/game/scenes/` contiene escenas base o compartidas entre niveles; `src/game/levels/{levelId}/` contiene las escenas, configuraciones y lógica específicas de cada nivel; `src/game/levels/registry.ts` es el registro centralizado y tipado de niveles. Resolver y validar `levelId` desde la URL antes de montar Phaser: un nivel inexistente o bloqueado nunca inicia el motor.
- Mantener la configuración y lógica del motor en `src/game/`, separadas de React. El componente PhaserGame solo integra el contenedor, foco y ciclo de vida; debe cancelar creaciones pendientes y destruir el juego al salir o cambiar de nivel, sin instancias duplicadas en StrictMode.
- Reservar `src/styles/global.css` para reset, variables y estilos realmente globales. Los estilos específicos pertenecen al CSS de su página, componente o layout.
- Las refactorizaciones arquitectónicas deben conservar apariencia, controles y reglas del juego; no implican avance de fase ni autorización para compilar.

## Reglas de implementación
- Desarrollar una fase a la vez, en cambios pequeños y verificables.
- Antes de editar, explicar archivos afectados y criterio de aceptación.
- No añadir funcionalidades, escenas, animaciones, personajes o dependencias sin aprobación.
- Mantener lógica del juego separada de la presentación React.
- Evitar duplicar el estado de misión: usar una única fuente de verdad y eventos o callbacks explícitos.
- Usar nombres claros, TypeScript estricto y componentes pequeños.
- Validar entradas del código de 4 dígitos; impedir intentos adicionales después del tercero.
- No bloquear el intento de despegue por falta de combustible: el jugador debe poder intentar y fallar.
- No crear animaciones de despegue, explosión ni fallo: mostrar modal inmediato.
- No presentar como hechos científicos afirmaciones no verificadas; el contenido educativo debe ser prudente.
- Mantener interacción accesible por teclado: WASD/flechas, E para interactuar.
- Queda prohibido ejecutar `npm run build`, `vite build`, `tsc --build` o cualquier comando equivalente de compilación o generación de artefactos de producción sin autorización explícita del usuario.
- No ejecutar comandos de compilación automáticamente al terminar tareas o fases. Se permite trabajar con el servidor de desarrollo existente y revisar el código.
- Cuando el usuario autorice explícitamente una compilación, documentar sus resultados; en caso contrario, registrar la verificación como pendiente de autorización.
- Si se detecta un problema, comunicarlo y proponer corrección antes de grandes refactorizaciones.

## Flujo de trabajo de OpenCode
1. Leer documentación y estado actual.
2. Proponer el siguiente paso mínimo.
3. Implementar solo ese paso.
4. Verificar manualmente y revisar el código; ejecutar build únicamente con autorización explícita del usuario.
5. Actualizar `docs/WORK_STATUS.md` y `docs/CHANGELOG.md`.
6. Registrar nuevas decisiones aprobadas en `docs/DECISIONS.md`.

## No asumir
- Diseño final del mapa, sprites, posiciones exactas, cantidad de misiones futuras.
- Si la nave requiere código correcto antes de evaluar combustible: implementar según especificación documentada o preguntar si no está resuelto.
- Que los documentos o el combustible deban recogerse en un orden fijo.

## Definición de terminado
Una fase está terminada cuando cumple criterios del ROADMAP, no rompe fases previas, pasa build con autorización explícita del usuario y deja el estado de trabajo actualizado. Si falta esa autorización, dejar la verificación de build pendiente sin ejecutarla automáticamente.
