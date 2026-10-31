# Bufete

Registro local de expedientes para un bufete jurídico. Los datos de la persona son ficticios. Esta ficha fija el problema, los datos y las reglas antes de implementar el recorrido.

## Arranque

```bash
cd bufete
npm install
npm run dev
```

Hoy la pantalla es la plantilla de Vite. Los expedientes todavía no se guardan. Cuando existan, quedarán en `localStorage` del mismo navegador y seguirán disponibles al recargar o al volver a abrir la aplicación.

## Problema, usuario y prioridades

**Problema.** El bufete necesita un registro recuperable de asuntos: quién los pidió (con un alias), de qué tratan, quién los atiende, qué se hizo y en qué estado están. Sin ese registro, la apertura, las actividades y el cierre no quedan en un historial consultable.

**Usuario.** Personal del bufete que abre, consulta y actualiza expedientes en un navegador. No es el cliente del despacho ni un visitante público. Trabaja con alias, sin cuenta de acceso y sin documentos de identificación.

**Prioridades**

1. Abrir un expediente válido, con identificador, fecha y estado generados, y volver a verlo después de recargar.
2. Listarlo, abrirlo con su historial y buscarlo por identificador o alias.
3. Anotar actividades mientras esté abierto o en seguimiento.
4. Pasar a seguimiento y cerrarlo solo cuando se cumplan las condiciones.
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
| Fecha, hora y motivo de cierre | Usuario el motivo; la aplicación la fecha | Solo al cerrar |
| Actividades | Usuario | No al abrir; al menos una para cerrar |

### Actividad

Cada actividad es una entrada propia: descripción obligatoria, fecha y hora automáticas, tipo opcional. No hay archivos adjuntos.

### Historial

La apertura y cada cambio de estado se guardan solos. El historial muestra una secuencia cronológica, de la más antigua a la más reciente, y distingue las actividades de los cambios de estado.

```
Abierto --acción explícita--> En seguimiento --al menos una actividad y motivo--> Cerrado
```

No hay otras transiciones ni vuelta atrás. Un expediente cerrado se puede consultar. No admite actividades nuevas ni cambios de estado. No se editan ni se eliminan expedientes o actividades.

### Validación y mensajes

Un campo obligatorio vacío, o formado solo por espacios, se rechaza. El mensaje indica qué corregir. La búsqueda sin coincidencias también se informa. Al abrir, anotar, pasar a seguimiento o cerrar, la interfaz confirma el resultado.

La búsqueda compara identificador o alias. El filtro por estado es opcional.

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
| Estados y cierre | Paso a seguimiento, motivo de cierre y bloqueo del expediente cerrado | `src/domain` |
| Conservación y mensajes | `localStorage`, confirmaciones y errores del recorrido | `src/services`, `src/components/layout` |

Los aportes se integran así:

1. La forma del expediente, de la actividad y del historial se acuerda en `src/domain` antes de modificar pantallas.
2. Solo `src/services` lee y escribe el almacenamiento.
3. Las pantallas llaman a esas funciones y no repiten las reglas de validación ni de estado.
4. Un aporte se acepta si respeta esta ficha y si el recorrido afectado sigue siendo completable: abrir, encontrar, anotar, cambiar de estado y, si corresponde, ver los datos tras recargar.
