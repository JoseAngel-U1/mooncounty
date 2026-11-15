# ROADMAP — MVP MoonCounty

## Meta
Entregar una demostración web funcional de la primera misión durante el hackatón de 24 horas. Cada fase debe ser jugable o verificable de forma independiente.

### Fase 0 — Preparación
- [x] Documentación y estructura inicial.
- [x] Base Vite + React + TS y dependencia Phaser declaradas.
- [x] Instalar dependencias (`npm install`) y verificar `npm run dev` (dependencias verificadas y arranque confirmado por el usuario).
- [ ] Crear repositorio remoto y primer commit.
**Criterio:** aplicación arranca localmente y build correcto.
**Estado:** criterio técnico cumplido; repositorio remoto y primer commit pendientes administrativos.

### Fase 1 — Integración Phaser
- [x] Montar canvas Phaser dentro de React.
- [x] Crear escena principal, fondo provisional y astronauta representado por forma simple.
- [x] Movimiento con WASD/flechas, cámara y límites.
**Criterio:** jugador se mueve dentro del mapa sin errores.
**Estado:** integración inicial con build verificado; cambios posteriores de interfaz y navegación pendientes de autorización de build y validación visual manual. Fase 2 requiere autorización expresa.

#### Ampliación de interfaz autorizada — Inicio y selección de niveles
- [x] Portada pixel art con botón INICIAR.
- [x] Registro centralizado y tipado de niveles, con IDs únicos y claves de escenas reales.
- [x] LevelSelectScreen y LevelCard reutilizables, generados desde el registro.
- [x] Tierra disponible reutilizando ExplorationScene y Luna bloqueada sin escena ni misión implementada.
- [x] Navegación portada → menú → juego y regreso, separada de la lógica Phaser, con destrucción del juego al salir.
- [ ] Validar manualmente navegación con ratón/teclado, responsive y entradas/salidas repetidas sin canvas duplicados.
- [ ] Verificar build de los cambios actuales únicamente con autorización explícita del usuario.
**Alcance:** interfaz y navegación de Fase 1, sin persistencia, desbloqueos automáticos, inventario ni misiones. No constituye inicio de Fase 2.

#### Refactorización arquitectónica autorizada — React Router
- [x] Instalar react-router-dom y sustituir navegación manual por rutas `/`, `/levels`, `/game/:levelId` y `*`.
- [x] Organizar HomePage, LevelSelectPage, GamePage y NotFoundPage con carpeta y CSS propios; MainLayout usa Outlet.
- [x] Migrar componentes a carpetas individuales y extraer estilos específicos de global.css sin rediseñar la interfaz.
- [x] Mover niveles a `src/game/levels/`, escenas a `src/game/scenes/` y creación del motor a `src/game/createGame.ts`.
- [x] Resolver IDs desde URL antes de montar Phaser; bloquear entrada lunar y mostrar 404 para IDs inexistentes.
- [x] Establecer organización obligatoria en AGENTS.md.
- [ ] Verificar visualmente rutas directas, recargas, Atrás/Adelante y desmontaje repetido en navegador.
**Estado:** refactorización de Fase 1, sin nuevas misiones ni avance de fase. Build pendiente de autorización explícita.

### Fase 2 — Mapa y colisiones
- [ ] Definir mapa pequeño con áreas funcionales.
- [ ] Añadir paredes/obstáculos y colisiones.
- [x] Elevador automático exclusivamente vertical con X=1321 entre Y=690 y Y=415; zonas `(1247, 395, 148, 40)` y `(1247, 675, 148, 40)`; activación solo dentro de la columna de la cabina; `walkUp`/`walkDown`, anti-bucle y bloqueo temporal. Solo se ignora `elebador` durante el recorrido, sin modificar colisiones. Pruebas en memoria correctas, prueba visual pendiente.
- [ ] Completar ubicación de combustible y nave. Ingeniero en `(164, 108)` y punto de coordenadas centrado en `(243.5, 451.5)` por autorización; no inventar ubicaciones pendientes.
**Criterio:** el jugador recorre mapa y no atraviesa obstáculos.

### Fase 3 — Interacción e inventario
- [ ] Detección de proximidad y texto «Presiona E».
- [x] Implementar recogida de coordenadas con traje y solicitud previa en `(243.5, 451.5)`; pruebas en memoria correctas, prueba visual pendiente.
- [ ] Implementar recogida de combustible.
- [ ] Inventario inferior sincronizado con Phaser.
- [ ] Validar en navegador el flujo completo: solicitud del coordinador → coordenadas → ingeniero entrega datos de trayectoria → coordinador entrega código `4826`. Recogida y lógica de NPC implementadas; pruebas en memoria correctas. Ingeniero validado visualmente por el usuario.
**Criterio:** completar secuencia de búsqueda e ingeniero.

### Fase 4 — Nave, validaciones y consecuencias
- [x] Interacción final con la nave y panel de lanzamiento (D-35): zona `(1274, 39, 70, 137)` sin nueva colisión, aviso E, autorización pendiente sin código, modal React de 4 dígitos validado con `isEarthLaunchCode()`, reintentos, cierre sin pérdida de progreso y «¡Misión Tierra completada!» sin animación. Prueba visual pendiente.
- [ ] Contador de 3 errores y bloqueo definitivo.
- [ ] Fallo por intento sin combustible.
- [ ] Modal de fallo con checklist y reinicio completo.
- [ ] Modal de éxito definitivo con «Continuar» provisional.
**Criterio:** todos los casos de `MISSION_01.md` pasan.

### Fase 5 — Calidad y entrega
- [ ] Ajustar estética y legibilidad en escritorio.
- [ ] Revisar controles, errores y textos educativos.
- [ ] `npm run build` y prueba manual de todos los caminos.
- [ ] README con captura, explicación y demo desplegada si hay tiempo.
**Criterio:** demo estable y fácil de presentar.

## Fuera del alcance inicial
Multijugador, login, BD, API, mapas grandes, animaciones de despegue/explosión, misiones futuras sin diseño aprobado.
