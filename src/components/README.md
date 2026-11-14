# Componentes React
Cada componente vive dentro de `ui/` o `shared/`, en su propia carpeta con archivos `Nombre.tsx` y `Nombre.css` juntos, según AGENTS.md. No crear carpetas vacías ni componentes futuros.

## ui/ — Interfaz específica de MoonCounty
- `ui/StartScreen/`: portada pixel art.
- `ui/LevelSelectScreen/`: presentación del menú generado desde el registro de niveles.
- `ui/LevelCard/`: tarjeta reutilizable de nivel disponible/bloqueado.

## shared/ — Componentes genéricos o compartidos entre funcionalidades
- `shared/NavigationButton/`: botón de navegación con useNavigate y estilos propios.
- `shared/PhaserGame/`: contenedor, foco y ciclo de vida Phaser, incluida limpieza en StrictMode; la creación del motor reside en `src/game/createGame.ts`.

Las páginas que componen estos componentes están en `src/pages/`; las rutas, en `src/router/AppRouter.tsx`.

Pendiente para Fase 3 y 4: inventario, panel de nave y modales de consecuencias.
