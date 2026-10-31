# Calendario de expedientes

Fecha: 2026-10-31

Estado: implementada el 2026-10-31.

## Objetivo

Añadir un calendario real del mes en curso. Cada expediente aparece con una etiqueta distinta según su estado. Se puede filtrar por esas etiquetas y por una fecha. Al cambiar de mes, la hoja se voltea.

## Problema identificado

El registro lista expedientes, pero no muestra en qué día quedó cada estado. La coordinación no puede ver el mes actual ni aislar un día.

## Solución propuesta

Una vista Calendario en la misma página. No se agrega ninguna dependencia. El mes, los días y la fecha de hoy salen del reloj del navegador. La semana empieza en lunes.

Cada expediente se coloca en la fecha del hecho que lo dejó en su estado actual:

- Abierto: fecha de apertura.
- En seguimiento: fecha del último paso a seguimiento o de la última reapertura.
- Cerrado: fecha del último cierre.

Las etiquetas son Abierto, En seguimiento y Cerrado. El texto distingue el estado; el color lo refuerza con la paleta ya usada. Las tres pueden activarse o desactivarse. Una fecha, elegida en el control o en un día, deja solo los expedientes de ese día y mueve el mes. Sin fecha, se ve el mes visible.

Elegir un expediente vuelve al detalle existente. El calendario no guarda datos ni cambia estados.

La animación propia es el paso de hoja: la cuadrícula del mes anterior gira sobre el lomo y descubre el mes nuevo. Dura menos de un segundo. Si el sistema pide menos movimiento, el mes cambia sin giro.

## Componentes afectados

- `bufete/src/domain/calendario.js`
- `bufete/src/components/calendario/CalendarioExpedientes.jsx`
- `bufete/src/pages/PaginaExpedientes.jsx`
- `bufete/src/components/layout/Icono.jsx`
- `bufete/src/index.css`

## Flujo esperado

1. La vista abre en el mes y el día de hoy.
2. Los expedientes del mes se ven en su día, con su etiqueta.
3. Desactivar una etiqueta la oculta. Una fecha vacía de resultados lo indica.
4. El mes anterior y el siguiente voltean la hoja.
5. Un expediente del calendario abre su detalle.

## Riesgos

Una fecha guardada en UTC puede caer en otro día si se lee fuera de la zona local. La clave del día se calcula con la hora local del navegador.

## Ventajas

Reutiliza los expedientes ya guardados y las etiquetas de estado. No cambia el recorrido de apertura, actividad, cierre ni reapertura.

## Compatibilidad

La vista Expedientes permanece. El almacenamiento sigue siendo `bufete.expedientes`.

## Plan de implementación

1. Calcular citas, rejilla y filtros en el dominio.
2. Dibujar el mes, las etiquetas, la fecha y la agenda.
3. Animar el cambio de mes y comprobarlo en el navegador.
4. Actualizar el estado, las decisiones y el changelog.

## Resultado

Octubre de 2026 abre con el día 31 marcado como hoy. Un expediente Abierto queda en su apertura, uno En seguimiento en el paso a seguimiento y uno Cerrado en el último cierre. Desactivar Abierto lo oculta. Una fecha sin expedientes lo indica. Noviembre de 2026 tiene 30 días y avisa si el mes está vacío. El cambio de mes usa la animación `voltear-adelante`. Elegir un expediente abre su detalle. En una pantalla de 390 px el título no se superpone a los controles.
