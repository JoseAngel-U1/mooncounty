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

### Fase 2 — Mapa y colisiones
- [ ] Definir mapa pequeño con áreas funcionales.
- [ ] Añadir paredes/obstáculos y colisiones.
- [ ] Ubicar documentos, ingeniero, combustible y nave con marcadores provisionales.
**Criterio:** el jugador recorre mapa y no atraviesa obstáculos.

### Fase 3 — Interacción e inventario
- [ ] Detección de proximidad y texto «Presiona E».
- [ ] Recoger coordenadas X, Y y combustible.
- [ ] Inventario inferior sincronizado con Phaser.
- [ ] Interacción con ingeniero, requisitos y entrega del código.
**Criterio:** completar secuencia de búsqueda e ingeniero.

### Fase 4 — Nave, validaciones y consecuencias
- [ ] Panel de nave para introducir código y solicitar despegue.
- [ ] Contador de 3 errores y bloqueo definitivo.
- [ ] Fallo por intento sin combustible.
- [ ] Modal de fallo con checklist y reinicio completo.
- [ ] Modal de éxito con «Continuar» provisional.
**Criterio:** todos los casos de `MISSION_01.md` pasan.

### Fase 5 — Calidad y entrega
- [ ] Ajustar estética y legibilidad en escritorio.
- [ ] Revisar controles, errores y textos educativos.
- [ ] `npm run build` y prueba manual de todos los caminos.
- [ ] README con captura, explicación y demo desplegada si hay tiempo.
**Criterio:** demo estable y fácil de presentar.

## Fuera del alcance inicial
Multijugador, login, BD, API, mapas grandes, animaciones de despegue/explosión, misiones futuras sin diseño aprobado.
