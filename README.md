# MoonCounty

MVP educativo para un hackatón NASA: un astronauta explora un mapa 2D, reúne documentos y combustible, obtiene un código y toma decisiones para preparar el despegue desde la Tierra. Las decisiones erróneas tienen consecuencias y reinician la misión.

## Tecnologías
React + TypeScript + Vite + Phaser 3.90.0.

## Requisitos
Node.js LTS y npm, Git y opcionalmente OpenCode.

## Inicio rápido
```bash
npm install
npm run dev
```
Abrir la dirección local indicada por Vite.

## Comandos
```bash
npm run dev
npm run build
npm run preview
```

## Estado
Tierra implementa su mapa pixel art 2D a escala 1:1 (`1451×1084`) con cámara adaptativa y zoom de cobertura, 31 colisiones estáticas, elevador vertical automático entre Y=690 y Y=415 (D-32), editor de colisiones F3 arrastrable para desarrollo (D-34), personajes a escala visual 2× (jugador con cambio a casco al recoger traje, coordinador e ingeniero con sprites propios, y dos acompañantes automáticos de tripulación con seguimiento por historial y tolerancia diagonal, D-36 y D-37).

El flujo de misión implementado en memoria abarca: recogida de traje → encargo del coordinador → obtención de coordenadas en `(243.5, 451.5)` → entrega al ingeniero → recepción de datos de trayectoria → entrega de código `4826` por el coordinador → interacción con la nave e introducción de código en el panel modal provisional de 4 dígitos (`LaunchPanel`, D-35), que valida el código y confirma «¡Misión Tierra completada!» sin animación de despegue. Luna permanece bloqueada en el selector sin escena asociada.

Siguen pendientes de desarrollo y autorización: inventario inferior visible, combustible, límite de 3 códigos incorrectos con bloqueo (D-11), modales de fallo y «Continuar» definitivo, la exclusión del editor F3 para producción (D-23), validaciones visuales completas y la compilación de producción (sujeta a autorización explícita según `AGENTS.md`).

## Documentación
- `AGENTS.md`: reglas de trabajo, restricciones y orden de lectura.
- `docs/DECISIONS.md`: registro histórico de decisiones de diseño y notas de vigencia.
- `docs/ROADMAP.md`: fases, desglose de tareas y criterios de aceptación.
- `docs/WORK_STATUS.md`: estado actual detallado, registro de verificaciones y próximas tareas.
- `docs/MISSION_01.md`: especificación completa de la misión 1, flujo vigente y discrepancias identificadas.
- `docs/CHANGELOG.md`: historial cronológico de cambios del proyecto.
- `src/components/README.md`: estructura y clasificación de componentes React (`ui/` y `shared/`).
- `src/game/README.md`: arquitectura del motor Phaser, escenas, interacciones y módulos de nivel.

## Reglas de la misión 1
### Alcance implementado en Tierra
- Movimiento con WASD o flechas (velocidad normalizada 220 px/s) y tecla E para interactuar con elementos cercanos.
- Secuencia: traje espacial → coordinador → punto de coordenadas → ingeniero (datos de trayectoria) → coordinador (código `4826`) → nave.
- Panel de lanzamiento provisional (D-35): modal de 4 dígitos con reintentos ilimitados en esta etapa; código correcto marca la misión como completada sin animaciones.
- Editor F3 disponible exclusivamente para desarrollo (debe excluirse de producción).

### Requisitos futuros aprobados (pendientes de implementación)
- Los objetos recogibles pasarán directamente al inventario inferior visible.
- Recolección de combustible obligatoria para el despegue.
- Intentar despegar sin combustible = misión fallida inmediata.
- Tres códigos erróneos = bloqueo del panel y misión fallida (D-11).
- Modales de consecuencias: fallo con motivo educativo y checklist; éxito definitivo con botón «Continuar».
- Reiniciar desde modal = restablecimiento completo de la misión desde cero.

## Cómo colaborar con OpenCode
Abre OpenCode desde la raíz del repositorio y pídele leer `AGENTS.md` y `docs/WORK_STATUS.md` antes de modificar archivos. Trabaja una fase por solicitud.
