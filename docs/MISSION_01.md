# Misión 01 — Preparación del despegue (Tierra)

## Propósito
Completar preparativos de una nave mediante exploración, recolección, interacción con un ingeniero y decisiones que producen éxito o fracaso.

## Mundo y controles
- Un mapa 2D pequeño de vista superior, con astronauta, dos documentos, ingeniero, combustible y nave.
- WASD o flechas: movimiento en cuatro direcciones.
- Cerca de elementos interactivos aparece «Presiona E»; E activa la interacción.
- Los objetos recogibles pasan directamente al inventario inferior.
- Paredes y obstáculos sólidos no se atraviesan (fase de mapa).

## Flujo de misión
1. Buscar y recoger documento «Coordenada X».
2. Buscar y recoger documento «Coordenada Y».
3. Acercarse al ingeniero y pulsar E para entregar ambos documentos y recibir un código de cuatro dígitos.
4. Buscar y recoger combustible (puede encontrarse antes de hablar con el ingeniero).
5. Acercarse a la nave, pulsar E y utilizar la interfaz para ingresar el código e intentar despegar.
6. Si se cumplen las condiciones, mostrar modal «Misión completada»; si ocurre fallo crítico, mostrar modal «Misión fallida».

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
**Fallo:** título «Misión fallida», motivo específico, checklist de lo que faltó o salió mal, breve explicación educativa, botón «Reiniciar misión».
**Éxito:** título «Misión completada», resumen breve, botón «Continuar». Hasta que exista misión 2, «Continuar» debe mostrar un estado provisional explícito, no navegar a contenido inexistente.

## Reinicio
Regresar a posición inicial, restaurar documentos y combustible al mapa, limpiar inventario, reiniciar estado del ingeniero/código e intentos, cerrar paneles y modales.

## Casos de prueba mínimos
- Recoger X y Y individualmente con E, sin duplicados.
- Intentar hablar con ingeniero sin ambos documentos: no entregar código.
- Entregar ambos: obtener código.
- Recoger combustible: aparece en inventario.
- Intentar despegar sin combustible: fallo inmediato y modal.
- Código incorrecto 1 y 2: aviso y contador correcto.
- Código incorrecto 3: fallo y bloqueo.
- Código correcto + combustible: éxito.
- Reiniciar tras fallo: restaurar completamente la misión.
- Confirmar que no hay animaciones de despegue ni explosiones.
