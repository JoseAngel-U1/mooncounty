# ROADMAP — MVP MoonCounty

## Meta
Entregar una demostración web funcional de la primera misión durante el hackatón de 24 horas. Cada fase debe ser jugable o verificable de forma independiente.

## Lectura del estado
- Estado documental contrastado con el código de `dac3880`. Una casilla de implementación marcada indica código presente, no validación completa ni cierre de fase.
- Las verificaciones históricas corresponden a sus respectivas etapas; no certifican el build del código actual. Las compilaciones requieren autorización explícita según AGENTS.md.
- Tierra es el único nivel integrado con escena. Luna es una tarjeta bloqueada; el avance externo de otros integrantes no está determinado con la evidencia local disponible.

### Fase 0 — Preparación
- [x] Documentación y estructura inicial.
- [x] Base Vite + React + TS y dependencia Phaser declaradas.
- [x] Instalar dependencias (`npm install`) y verificar `npm run dev` (dependencias verificadas y arranque confirmado por el usuario).
- [x] Primer commit existente (`e15fb7c`) y remoto `origin` configurado. Accesibilidad remota y publicación de todos los commits no verificadas en la auditoría.
**Criterio:** aplicación arranca localmente y build correcto.
**Estado:** criterio técnico registrado como cumplido para la etapa inicial; primer commit y configuración de remoto ya constatados. No certifica la compilación ni la entrega de la versión actual.

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

#### Ampliación autorizada — Tripulación (D-36)
- [x] Dos acompañantes a escala 2× y seguimiento por historial a 65/130 px, integrados en Tierra (D-36).
- [x] Recursos propios compartidos desde `public/assets/characters/tripulante/`, con configuración independiente en `earthCrewSprites.ts` (D-37).
- [x] Corrección de alternancia visual en diagonales mediante tolerancia al comparar ejes. El usuario confirmó visualmente que esa corrección funciona; no implica haber probado todos los escenarios.
- [x] Verificación en memoria y Edge headless: formación, giro, Idle, pausa F3/modal y subida del elevador con recuperación de fila al caminar.
- [ ] Validación visual de giros cerrados, subida/bajada y pausa; comprobación de tipos/build pendiente de autorización.

### Fase 2 — Mapa y colisiones
- [x] Integrar el mapa de Tierra `public/assets/levels/earth/map.png` y las áreas utilizadas por el flujo actual.
- [ ] Validar el diseño y la distribución final del mapa; integrar un mapa no equivale a aprobar su diseño definitivo.
- [x] Añadir paredes/obstáculos: 31 rectángulos iniciales en `earthCollisions.ts` y collider del jugador creados mediante `EarthCollisionEditor`.
- [ ] Completar validación visual de obstáculos, pasillos y bordes.
- [x] Elevador automático exclusivamente vertical, columna centrada en X=1321 y X de entrada conservada, entre los destinos Y=690 y Y=415; zonas `(1247, 395, 148, 40)` y `(1247, 675, 148, 40)`; `walkUp`/`walkDown`, anti-bucle y bloqueo temporal. Solo se ignora `elebador` al comprobar el recorrido. Hay registros de pruebas en memoria y de subida/salida en navegador; validación visual completa y resultado de interrumpir dentro del hueco con F3 pendientes.
- [x] Ubicar la interacción de nave en `(1274, 39, 70, 137)` (D-35). Ingeniero en `(164, 108)` y punto de coordenadas centrado en `(243.5, 451.5)` por autorización.
- [ ] Definir y completar ubicación del combustible; no inventar su posición.
**Criterio:** el jugador recorre mapa y no atraviesa obstáculos.

### Fase 3 — Interacción e inventario
- [x] Detección de proximidad y texto «Presiona E», con selección del objeto más cercano, acción por pulsación y suspensión con F3/sin foco.
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
- [ ] Excluir o deshabilitar completamente el editor F3 en producción, preservando las colisiones jugables que actualmente crea `EarthCollisionEditor`. Ocultar el panel o dejar `DEBUG_COLLISIONS = false` no satisface este requisito.
- [ ] Con compilación expresamente autorizada, comprobar en producción que F3 no activa el editor y que no están disponibles panel, botones, atajos ni controles de edición; verificar que las colisiones jugables siguen funcionando.
- [ ] Ajustar estética y legibilidad en escritorio.
- [ ] Revisar controles, errores y textos educativos.
- [ ] `npm run build` únicamente con autorización explícita y prueba manual de todos los caminos.
- [ ] README con captura, explicación y demo desplegada si hay tiempo.
**Criterio:** demo estable y fácil de presentar.

## Fuera del alcance inicial
Multijugador, login, BD, API, mapas grandes, animaciones de despegue/explosión, misiones futuras sin diseño aprobado.
