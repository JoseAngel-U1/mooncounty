# Componentes React
Cada componente vive dentro de `ui/` o `shared/`, en su propia carpeta con archivos `Nombre.tsx` y `Nombre.css` juntos, según AGENTS.md. No crear carpetas vacías ni componentes futuros.

## ui/ — Interfaz específica de MoonCounty
- `ui/StartScreen/`: portada pixel art.
- `ui/LevelSelectScreen/`: presentación del menú generado desde el registro de niveles.
- `ui/LevelCard/`: tarjeta reutilizable de nivel disponible/bloqueado.
- `ui/LaunchPanel/`: panel modal semitransparente de 4 dígitos para autorizar el lanzamiento en Tierra (D-35), comunicado mediante `earthLaunchPanelBridge.ts`.

## shared/ — Componentes genéricos o compartidos entre funcionalidades
- `shared/NavigationButton/`: botón de navegación con useNavigate y estilos propios.
- `shared/PhaserGame/`: contenedor, foco y ciclo de vida Phaser, incluida limpieza en StrictMode; la creación del motor reside en `src/game/createGame.ts`.

Las páginas que componen estos componentes están en `src/pages/`; las rutas, en `src/router/AppRouter.tsx`.

Pendiente para Fase 3 y 4: inventario inferior visible, modales de consecuencias definitivas (fallo con checklist y éxito definitivo con «Continuar») y reglas de combustible / límite de 3 errores.
