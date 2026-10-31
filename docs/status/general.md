# Estado general

## Objetivo

Aplicación web para un bufete jurídico. Permite abrir expedientes con datos ficticios, consultarlos, registrar actividades y cerrarlos, conservando la información en el navegador.

## Funcionamiento actual

Al arrancar `bufete` se abre el registro de expedientes. La persona puede crear un expediente, buscarlo, anotar actividades, cerrarlo y reabrirlo cuando llega información nueva. También puede verlos en un calendario del mes en curso.

Los datos quedan en `localStorage` del mismo navegador, con la clave `bufete.expedientes`. Siguen disponibles al recargar o al volver a abrir la aplicación.

`README.md`, en la raíz del repositorio, conserva la ficha funcional. `PRODUCT.md` resume el producto. La propuesta que se implementó está en `docs/implementations/2026-10-recorrido-expedientes.md`.

## Funcionalidades existentes

- Apertura con alias, descripción y responsable. La categoría Civil, Familiar o Laboral es opcional.
- Identificador, fecha y hora de apertura y estado inicial Abierto generados por la aplicación.
- Rechazo de obligatorios vacíos o formados solo por espacios, con el campo señalado.
- Listado con identificador, persona, responsable y estado.
- Detalle e historial cronológico, con la apertura, las actividades y los cambios de estado distinguibles.
- Búsqueda por identificador o alias, y filtro opcional por estado. Aviso cuando no hay resultados.
- Actividad con descripción obligatoria, fecha automática y tipo opcional.
- Paso de Abierto a En seguimiento, y cierre desde En seguimiento si hay al menos una actividad y un motivo.
- Reapertura de Cerrado a En seguimiento con motivo. Se conservan actividades y cierres anteriores.
- El expediente cerrado no admite nuevas actividades.
- Calendario real del mes en curso. Cada expediente lleva la etiqueta de su estado y se coloca en la fecha de ese estado. Se filtra por etiqueta y por fecha.
- Confirmaciones y errores del recorrido.
- Conservación en el navegador.

## Flujo general

El navegador carga `index.html` y monta `PaginaExpedientes`. Esa página lee la lista guardada, muestra el listado y el formulario o el detalle, y vuelve a guardar la lista cuando cambia. Las reglas viven en `src/domain/expediente.js`. Solo `src/services/expedientes.js` toca `localStorage`.

## Tecnologías

- React 19
- Vite 8
- JavaScript con módulos ES

## Dependencias importantes

- `react` y `react-dom`
- `vite` y `@vitejs/plugin-react`, solo para desarrollo y compilación

No hay enrutador, biblioteca de componentes ni cliente de API. Los iconos y las animaciones están en el propio proyecto.

## Limitaciones conocidas

- Los datos pertenecen a un navegador. No hay cuentas ni copia en un servidor.
- Si el navegador rechaza `localStorage`, los cambios de esa visita no se conservan y la pantalla lo indica.
- No se editan ni se eliminan expedientes o actividades.
- No hay archivos adjuntos.
- El proyecto se ejecuta en local; no está publicado.
- Los nombres de quienes cubren cada área siguen sin asignar.

## Plataformas

Aplicación web. En una pantalla ancha el listado y el detalle se ven juntos. En una pantalla estrecha se ve una zona a la vez, con un control para volver. No hay versión móvil nativa ni de escritorio empaquetada.
