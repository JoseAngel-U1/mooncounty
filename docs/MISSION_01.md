# Misión 01 — Preparación del despegue (Tierra)

## Propósito
Completar preparativos de una nave mediante exploración, recolección, interacción con un ingeniero y decisiones que producen éxito o fracaso.

## Mundo y controles
- Un mapa 2D pequeño de vista superior, con astronauta, traje, coordinador, punto de coordenadas, ingeniero y nave. El punto de coordenadas ocupa el rectángulo `(221, 431, 45, 41)` del mapa original.
- WASD o flechas: movimiento en cuatro direcciones.
- Cerca de elementos interactivos aparece «Presiona E»; E activa la interacción.
- Los objetos recogibles pasan directamente al inventario inferior.
- Paredes y obstáculos sólidos no se atraviesan (fase de mapa).

## Tripulación (D-36)
- Actualización visual D-37: ambos acompañantes usan `tripulante/NPC_v3_32x{n}.png`, con configuración independiente del jugador. Idle 32–47 (8 fps), lateral 56–63 (flipX), arriba 64–69 y abajo 70–75 (caminar a 10 fps); Sitting 48–55 no se carga. Escala 2× y comportamiento de D-36 conservados.
- Desde el inicio hay tres astronautas: jugador en `(97,900)` y dos acompañantes con casco, a escala 2×, en fila diagonal dentro del espacio libre al noreste.
- Los acompañantes siguen el historial del jugador a 65/130 px de recorrido, no la distancia en línea recta: conservan las esquinas y reproducen Idle al detenerse. No bloquean al jugador ni activan E.
- Durante el elevador siguen el trayecto vertical y salen por el mismo recorrido al caminar en el destino; mientras mantienen la separación, pueden quedar dentro del hueco hasta que el jugador avance.
- F3 y el modal de lanzamiento suspenden el seguimiento y dejan a los acompañantes en reposo. El estado de misión sigue perteneciendo únicamente a EarthScene.

## Flujo de misión
### Ampliación autorizada: traje espacial (2026-11-15)
- Al comenzar una sesión de Tierra, `hasSpacesuit = false` y el jugador usa `astronauta_sin_casco`; al recoger el traje cambia a `astronauta_con _casco` (D-27).
- En la zona de los cuatro trajes aparece «Presiona E para recoger traje» al estar dentro del radio.
- La primera E establece `hasSpacesuit = true` y muestra «Traje espacial equipado». Las siguientes muestran «Ya tienes un traje espacial» sin otra recogida.
- En este paso el estado se mantiene únicamente en memoria de la escena; el inventario inferior descrito anteriormente queda pendiente de implementación. Al crear una nueva sesión se restablece a false.
- Esta ampliación no añade requisitos de traje a las comprobaciones de despegue ni implementa otras etapas.

### Coordinador e ingeniero — flujo definitivo (D-28)
- El coordinador conserva su posición `(930, 850)`, su sprite propio `npc_staff` y la etiqueta. Sin traje pide recogerlo; con traje solicita las coordenadas una sola vez (`coordinatesRequested = true`).
- Con coordenadas, el coordinador indica entregarlas al ingeniero. Solo con `hasTrajectoryData = true` entrega el código fijo `4826`, definido como string en `earthMissionConfig.ts`. Conversaciones posteriores recuerdan el mismo código.
- El ingeniero está en `(164, 108)`, con su sprite propio `ingeniero`, etiqueta «Ingeniero» y reposo 32–39 a 8 fps. Sin tintes ni recursos gráficos nuevos.
- El ingeniero exige traje, solicitud del coordinador y coordenadas. Los diálogos fuera de orden indican el siguiente paso requerido.
- Al entregar las coordenadas, `hasCoordinates` pasa a false y `hasTrajectoryData` a true. La entrega es única; las repeticiones remiten al coordinador o a la nave según el progreso.
- Los datos de trayectoria se conservan como registro de obtención tras recibir el código. `launchCode !== null` registra que el coordinador ya los recibió.
- Estado inicial por sesión: `hasSpacesuit = false`, `coordinatesRequested = false`, `hasCoordinates = false`, `hasTrajectoryData = false`, `launchCode = null`.
- El ingeniero está dentro de `hangar-norte`, que termina en Y=150. Se permite hablar desde el pasillo sur: `(164, 180)` está libre para el cuerpo 22×31 y a 72 px del NPC (radio 90). Posición y colisiones no se modifican.
- El usuario confirmó visualmente el funcionamiento del ingeniero y la interacción E. El flujo hasta obtener el código dispone ya de recogida real de coordenadas (D-29); la nave sigue pendiente.

### Sprites propios de los NPC (D-33)
- Ingeniero: `NPC_Staff_v1`; coordinador: `NPC_Staff_v2`. Siluetas idénticas entre variantes; solo cambia la paleta (el coordinador añade arnés naranja y visor azul).
- Idle confirmado: frames 32–39 a 8 fps en bucle, cargados por `earthNpcSprites.ts`. Posiciones, escala 2× y etiquetas conservadas; tintes provisionales eliminados.
- Sin cambios en diálogos, interacciones, estados de misión, colisiones, elevador ni sprites/animaciones del jugador.

### Punto de coordenadas (D-29)
- Rectángulo con esquina superior izquierda `(221, 431)`, ancho 45 y alto 41; centro calculado `(243.5, 451.5)`. Radio de proximidad 60 px, sin nueva colisión ni recurso gráfico.
- Aviso: «Presiona E para obtener coordenadas». Requiere traje y `coordinatesRequested = true`; en caso contrario indica qué paso falta.
- Primera recogida: `hasCoordinates = true` y «Coordenadas de lanzamiento obtenidas. Entrégalas al ingeniero».
- Repeticiones: indica que ya tiene las coordenadas. Tras entregarlas, `hasTrajectoryData` impide recogerlas de nuevo aunque `hasCoordinates` sea false; informa que ya se entregaron.
- El centro es transitable con el cuerpo actual 22×31. Se ha comprobado una ruta desde el spawn por el pasillo sur del edificio oeste sin alterar posiciones ni colisiones.

### Ampliación autorizada: sprites reales del jugador (2026-11-15)
- El jugador usa los PNG de `public/assets/characters/`: `astronauta_sin_casco` al inicio y `astronauta_con _casco` tras recoger el traje.
- Mapeo de frames: 1–16 reposo; 17–24 sentado, sin usar; 25–32 caminar lateral, con `flipX` para la izquierda; 33–38 caminar arriba; 39–44 caminar abajo.
- No se implementa carrera. Las animaciones se activan según la dirección de movimiento y el jugador vuelve a reposo al detenerse.
- El cuerpo físico se ajusta al sprite para evitar atravesar paredes. El coordinador usa su sprite propio con etiqueta para distinguirse (D-33).
- D-30: jugador y ambos NPC usan escala visual 2× (`EARTH_ASTRONAUT_SCALE` en `earthPlayerSprites.ts`), 64×64 en coordenadas del mundo antes del zoom de cámara. El cuerpo del jugador permanece en 22×31 con el mismo desplazamiento mundial: esquina `(x-11, y-15)`. La figura ampliada puede sobresalir del cuerpo físico; esta etapa solo modifica apariencia. Etiquetas a 42 px sobre el centro; aviso E a 46 px y mensajes a 86 px. Pixel art sin suavizado; PNG, radios, posiciones y animaciones conservados.

### Elevador vertical (D-32)
- Zona superior `(1247, 395, 148, 40)` e inferior `(1247, 675, 148, 40)`. La cabina ocupa 22 px centrados en X=1321 (X 1310–1332); la activación automática sin E exige estar en la zona y en la columna. Como las zonas son más anchas que la cabina, no se ajusta X: si el jugador entra en la zona fuera de la columna, no se activa hasta que camine a ella.
- Traslado exclusivamente vertical con X constante: subida Y=690→415 con `walkUp`; bajada Y=415→690 con `walkDown`. Se conserva la X de entrada (p. ej. 1315) durante todo el recorrido. Movimiento e interacciones bloqueados y física suspendida; al terminar se restauran control, física y reposo.
- Solo la colisión del hueco `elebador` `(1246, 440, 162, 229)` se ignora durante la comprobación del recorrido y del traslado; no se modifica ni elimina permanentemente. El piso superior solo es accesible mediante el elevador.
- La zona de llegada queda bloqueada hasta abandonarla por completo, lo que evita rebotes. F3 interrumpe el traslado sin bloquear al jugador.

### Flujo definitivo
1. Recoger traje espacial.
2. Hablar con el coordinador, quien solicita las coordenadas.
3. Obtener las coordenadas con E en el punto centrado en `(243.5, 451.5)`.
4. Entregar las coordenadas al ingeniero.
5. Recibir los datos de trayectoria del ingeniero.
6. Regresar con el coordinador.
7. Recibir el código de lanzamiento `4826`.
8. Ir a la nave e introducir el código (implementado en D-35).

Las reglas futuras de combustible, intentos y consecuencias permanecen documentadas a continuación; no se implementan en esta etapa.

### Interacción final con la nave (D-35)
- Zona de interacción de referencia `(1274, 39, 70, 137)`, centro `(1309, 107.5)` y radio circunscrito aproximado de 76,9 px sobre el sistema circular existente. No es una colisión: no se añade ni modifica ningún rectángulo sólido. La mitad superior coincide con `modulo-noreste`, así que el acceso real es la mitad inferior libre.
- Aviso «Presiona E para acceder al panel de lanzamiento». Sin código del coordinador (`launchCode === null`) E muestra que se necesita autorización y no abre el panel.
- Con código, E abre un modal React centrado y semitransparente sobre Phaser. Campo de exactamente 4 dígitos y botón «Autorizar lanzamiento»; acepta solo dígitos y limpia el error al editar. La comprobación usa `EARTH_LAUNCH_CODE`/`isEarthLaunchCode()` de `earthMissionConfig.ts`, sin duplicar `4826`.
- Código erróneo: mensaje de error y nuevos intentos. En esta etapa no se aplican el límite de tres intentos ni el fallo por falta de combustible; esas reglas siguen pendientes.
- Código correcto: `missionCompleted = true` y modal con «¡Misión Tierra completada!», sin animación de despegue. Cerrar el formulario no pierde código ni progreso; reabrir sin completar vuelve al formulario y, tras completar, muestra el mensaje final.
- Mientras el modal está abierto se bloquean movimiento e interacciones; al cerrarlo se restauran el control y el foco del juego. El editor F3 permanece independiente y las colisiones no cambian.

## Reglas y consecuencias
| Condición | Resultado |
|---|---|
| Código incorrecto, primer intento | Aviso; quedan 2 intentos |
| Código incorrecto, segundo intento | Aviso; queda 1 intento |
| Código incorrecto, tercer intento | Bloqueo; misión fallida |
| Intento de despegue sin combustible | Misión fallida, incluso si se intenta antes de reunir todo |
| Código correcto y combustible disponible | Misión completada |

**Importante:** no deshabilitar «Intentar despegar» solo porque falta combustible. La falta debe producir una consecuencia cuando el jugador lo intente. La secuencia exacta entre introducir código y confirmar despegue se definirá durante la implementación de la interfaz de nave, conservando estas reglas.

## Modales
**Panel de lanzamiento (D-35):** campo de 4 dígitos, botón «Autorizar lanzamiento», error ante código incorrecto y reintentos sin límite en esta etapa. Con el código correcto se muestra «¡Misión Tierra completada!» y una nota de que la segunda misión no está disponible; el cierre restaura el juego. Sin animación de despegue.
**Fallo:** título «Misión fallida», motivo específico, checklist de lo que faltó o salió mal, breve explicación educativa, botón «Reiniciar misión».
**Éxito:** título «Misión completada», resumen breve, botón «Continuar». Hasta que exista misión 2, «Continuar» debe mostrar un estado provisional explícito, no navegar a contenido inexistente. El título actual autorizado para esta etapa es «¡Misión Tierra completada!»; el botón «Continuar» definitivo sigue pendiente de definición.

## Reinicio
Al recrear Tierra se restablecen posición, traje, solicitud, coordenadas, datos de trayectoria, código y `missionCompleted`; el punto permite otra recogida tras cumplir los requisitos. La restauración futura de combustible, inventario, intentos y modales se implementará con esas funcionalidades.

## Casos de prueba mínimos
- Hablar con ambos NPC sin traje: no avanzar.
- Hablar con ingeniero antes de la solicitud: remitir al coordinador.
- Solicitar coordenadas al coordinador una sola vez.
- Sin coordenadas: ingeniero no entrega datos y coordinador no entrega código.
- Con coordenadas: ingeniero las recibe y entrega datos una sola vez.
- Con datos: coordinador entrega `4826`; las repeticiones conservan el código.
- Nueva sesión: todos los indicadores false, código null y `missionCompleted` false.
- Nave sin código: aviso de autorización y sin modal.
- Nave con código: modal centrado y semitransparente, foco en el campo, solo dígitos y máximo 4.
- Código de menos de 4 dígitos: «Introduce exactamente 4 dígitos.»; código erróneo de 4 dígitos: error y reintento; ninguno completa la misión.
- Cerrar el formulario o pulsar Escape: el código obtenido y el progreso se conservan; se puede reabrir.
- Código correcto: «¡Misión Tierra completada!», `missionCompleted = true`, sin animación.
- Con el modal abierto: movimiento e interacciones bloqueados; al cerrar se restauran el control y el foco del juego.
- Reabrir tras completar: muestra el mensaje final. F3 sigue abriendo/cerrando el editor y las 31 colisiones no cambian.
- Acercarse al ingeniero desde `(164, 180)` y pulsar E, sin entrar en la colisión del hangar.
- Recogida sin traje o sin solicitud: no obtener coordenadas; con ambos requisitos: obtenerlas y mostrar el mensaje exacto.
- Repetir antes y después de entregarlas al ingeniero y tras recibir el código: sin nueva recogida ni pérdida de progreso.
- Comprobar aviso, alcance de 60 px y suspensión con F3/sin foco en navegador.
- Recoger combustible: aparece en inventario.
- Intentar despegar sin combustible: fallo inmediato y modal.
- Código incorrecto 1 y 2: aviso y contador correcto.
- Código incorrecto 3: fallo y bloqueo.
- Código correcto + combustible: éxito.
- Reiniciar tras fallo: restaurar completamente la misión.
- Confirmar que no hay animaciones de despegue ni explosiones.
