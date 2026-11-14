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
La Fase 1 está implementada: escenario provisional, astronauta controlable con WASD/flechas, límites físicos y cámara de seguimiento. Haz clic en el escenario o selecciónalo con Tab para mover al personaje. Build verificado; validación visual manual pendiente. El mapa con obstáculos y la lógica de misión se desarrollarán en fases posteriores con autorización.

## Documentación
- `AGENTS.md`: instrucciones para agente de código.
- `docs/ROADMAP.md`: plan por fases.
- `docs/DECISIONS.md`: decisiones aprobadas y pendientes.
- `docs/MISSION_01.md`: especificación completa de misión 1.
- `docs/WORK_STATUS.md`: estado y siguiente tarea.
- `docs/CHANGELOG.md`: cambios.

## Reglas esenciales de la misión 1
- WASD/flechas para moverse, E para interactuar; objetos al inventario inferior.
- Coordenadas X e Y → ingeniero → código de 4 dígitos.
- Conseguir combustible; intentar despegue en nave.
- Intentar despegar sin combustible = misión fallida.
- Tres códigos erróneos = misión fallida.
- Consecuencias en modal semitransparente, sin animaciones de despegue ni explosiones.
- Reiniciar significa empezar la misión desde cero.

## Cómo colaborar con OpenCode
Abre OpenCode desde la raíz del repositorio y pídele leer `AGENTS.md` y `docs/WORK_STATUS.md` antes de modificar archivos. Trabaja una fase por solicitud.
