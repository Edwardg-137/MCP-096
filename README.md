# Bufete

Registro local de expedientes para un bufete jurídico. Los datos de la persona son ficticios. Esta ficha fija el problema, los datos y las reglas del recorrido.

## Arranque

```bash
cd bufete
npm install
npm run dev
```

Los expedientes se guardan en `localStorage` del mismo navegador, con la clave `bufete.expedientes`. Siguen disponibles al recargar o al volver a abrir la aplicación. Si el navegador no permite guardar, los cambios de esa visita permanecen en memoria y la pantalla lo indica.

## Problema, usuario y prioridades

**Problema.** El bufete necesita un registro recuperable de asuntos: quién los pidió (con un alias), de qué tratan, quién los atiende, qué se hizo y en qué estado están. Sin ese registro, la apertura, las actividades y el cierre no quedan en un historial consultable.

**Usuario.** Personal del bufete que abre, consulta y actualiza expedientes en un navegador. No es el cliente del despacho ni un visitante público. Trabaja con alias, sin cuenta de acceso y sin documentos de identificación.

**Prioridades**

1. Abrir un expediente válido, con identificador, fecha y estado generados, y volver a verlo después de recargar.
2. Listarlo, abrirlo con su historial y buscarlo por identificador o alias.
3. Anotar actividades mientras esté abierto o en seguimiento.
4. Pasar a seguimiento, cerrarlo solo cuando se cumplan las condiciones y reabrirlo con motivo si llega información después del cierre.
5. Confirmar cada acción y explicar con claridad qué dato o condición hay que corregir.

## Datos, reglas y supuestos

### Expediente

| Dato | Origen | Obligatorio |
| --- | --- | --- |
| Identificador único | Aplicación | Sí |
| Fecha y hora de apertura | Aplicación | Sí |
| Estado | Aplicación; inicio en Abierto | Sí |
| Alias de la persona solicitante | Usuario | Sí |
| Descripción breve del asunto | Usuario | Sí |
| Nombre del responsable | Usuario | Sí |
| Categoría: Civil, Familiar o Laboral | Usuario | No |
| Fecha, hora y motivo de cada cierre | Usuario el motivo; la aplicación la fecha | Solo al cerrar |
| Actividades | Usuario | No al abrir; al menos una para cerrar |

### Actividad

Cada actividad es una entrada propia: descripción obligatoria, fecha y hora automáticas, tipo opcional. No hay archivos adjuntos.

### Historial

La apertura y cada cambio de estado se guardan solos. El historial muestra una secuencia cronológica, de la más antigua a la más reciente, y distingue las actividades de los cambios de estado.

```
Abierto --acción explícita--> En seguimiento --al menos una actividad y motivo--> Cerrado
Cerrado --motivo de reapertura--> En seguimiento
```

Un expediente cerrado se consulta y no admite actividades nuevas. Puede reabrirse a En seguimiento con un motivo válido. La reapertura conserva el identificador, los datos, las actividades y los cierres anteriores. Un nuevo cierre se agrega; no sustituye al anterior. No se reabre un expediente Abierto o En seguimiento. No se editan ni se eliminan expedientes o actividades.

### Validación y mensajes

Un campo obligatorio vacío, o formado solo por espacios, se rechaza. El mensaje indica qué corregir. La búsqueda sin coincidencias también se informa. Al abrir, anotar, pasar a seguimiento, cerrar o reabrir, la interfaz confirma el resultado.

La búsqueda compara identificador o alias. El filtro por estado es opcional.

### Calendario

La vista Calendario muestra el mes real, con la semana desde el lunes y el día de hoy marcado. Cada expediente aparece en la fecha del hecho que lo dejó en su estado actual: la apertura si está Abierto, el último paso a seguimiento o la última reapertura si está En seguimiento, y el último cierre si está Cerrado.

Las etiquetas son Abierto, En seguimiento y Cerrado. Se pueden activar o desactivar. Una fecha, elegida en el control o en un día, deja solo ese día. Al cambiar de mes, la hoja se voltea. Elegir un expediente abre su detalle. El calendario no modifica los datos.

### Supuestos

- Un navegador y una persona a la vez. No hay inicio de sesión ni varios perfiles.
- No se piden datos personales reales ni documentos.
- La conservación es `localStorage`. Un servidor o una base externa no forman parte de esta solución.
- El identificador y las fechas se generan en el cliente. La hora que se muestra es la local.
- La categoría solo puede ser Civil, Familiar o Laboral, y puede omitirse.
- El tipo de actividad es un texto breve opcional. No hay un catálogo cerrado.
- La búsqueda no distingue mayúsculas y ignora espacios al inicio y al final. El alias coincide si contiene el texto.
- Si se usa el filtro de estado, se aplica junto con la búsqueda.

## Responsabilidades e integración

Cada área tiene una persona responsable. Los nombres se anotan aquí cuando el equipo los asigne. Una misma persona puede cubrir más de un área; las reglas de integración no cambian.

| Área | Responsabilidad | Dónde aporta |
| --- | --- | --- |
| Apertura | Formulario, campos obligatorios, identificador, fecha y estado Abierto | `src/domain`, `src/components/expedientes` |
| Consulta | Listado, detalle, búsqueda y filtro por estado | `src/pages`, `src/components/expedientes` |
| Actividades | Alta, historial cronológico y distinción frente a los cambios de estado | `src/domain`, `src/components/actividades` |
| Estados y cierre | Paso a seguimiento, cierre, reapertura y conservación de los cierres | `src/domain` |
| Conservación y mensajes | `localStorage`, confirmaciones y errores del recorrido | `src/services`, `src/components/layout` |

Los aportes se integran así:

1. La forma del expediente, de la actividad y del historial se acuerda en `src/domain` antes de modificar pantallas.
2. Solo `src/services` lee y escribe el almacenamiento.
3. Las pantallas llaman a esas funciones y no repiten las reglas de validación ni de estado.
4. Un aporte se acepta si respeta esta ficha y si el recorrido afectado sigue siendo completable: abrir, encontrar, anotar, cambiar de estado y, si corresponde, ver los datos tras recargar.

## Decisiones

1. **Página única y `localStorage`.** El recorrido cabe en una pantalla y los datos viven en el navegador. Impacto: no hay servidor ni rutas. La asistencia de IA aplicó esa opción por ser la más simple. Solución: una página de React y la clave `bufete.expedientes`.

2. **Reglas fuera de la interfaz.** La validación y los estados tienen un solo lugar. Impacto: la pantalla no puede saltarse una condición. La asistencia de IA dejó las reglas en funciones puras. Solución: `src/domain/expediente.js`; la interfaz solo muestra el resultado.

3. **Reapertura sin sustituir el cierre.** Cambio: un expediente Cerrado puede pasar a En seguimiento con la acción Reabrir expediente. Impacto: se puede retomar el seguimiento y cerrar de nuevo; el cierre anterior, las actividades y el identificador permanecen. La asistencia de IA implementó la regla en el dominio y el formulario, y comprobó el recorrido en el navegador. Solución: el motivo no puede ir vacío; la lista de cierres solo agrega; el historial recibe fecha, hora, motivo y la transición de Cerrado a En seguimiento. Abierto y En seguimiento se rechazan en la operación, no solo en la pantalla. Mientras sigue cerrado, no admite actividades.

## Registro de resultados

| Recorrido | Comprobación esperada | Resultado observado | Resultado |
| --- | --- | --- | --- |
| 1. Apertura y consulta | Rechazar campos vacíos. Abrir un expediente válido. Buscarlo por alias y avisar si no hay coincidencias. | El alta vacía señaló alias, descripción y responsable. Nora Vega quedó Abierto. «nadie» no tuvo coincidencias. «nora» mostró solo ese expediente. El filtro Abierto avisó que no hay expedientes en ese estado. | Cumple |
| 2. Actividades y cierre | Rechazar una actividad vacía. Registrar una actividad. Pasar a seguimiento y cerrar con motivo. Impedir actividades mientras está cerrado. | La actividad vacía se rechazó. Se registró «Revision del escrito.» Pasó a seguimiento y se cerró con «Primer acuerdo». En Cerrado no apareció el formulario de actividad. | Cumple |
| 3. Conservación | Tras recargar, el expediente, sus actividades y su cierre siguen visibles. | Al recargar permanecieron Nora Vega y Ana Ruiz, con historial y cierres. | Cumple |
| 4. Reapertura y trazabilidad | Rechazar motivos vacíos y reaperturas en estados incorrectos. Reabrir válidamente, agregar una actividad y cerrar de nuevo. Conservar actividades y ambos cierres con sus fechas y motivos, incluso después de recargar la aplicación. | El motivo vacío y el de solo espacios se rechazaron; el expediente siguió Cerrado. En Abierto y En seguimiento no se ofrece la acción, y el dominio también la rechaza. La reapertura válida pasó a En seguimiento, conservó «Primer acuerdo» y agregó el evento con fecha, hora, motivo y transición. Se añadió otra actividad y el cierre «Segundo acuerdo». Tras recargar siguen ambas actividades y ambos cierres. | Cumple |
