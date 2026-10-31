# Changelog

## 2026-10-31 — Calendario de expedientes

Se añadió una vista del mes en curso. Cada expediente aparece con la etiqueta de su estado, en la fecha de ese estado. Se filtra por etiqueta y por fecha. Al cambiar de mes, la hoja se voltea.

Documentos actualizados:

- `bufete/src/domain/calendario.js`
- `bufete/src/components/calendario/CalendarioExpedientes.jsx`
- `bufete/src/pages/PaginaExpedientes.jsx`
- `bufete/src/index.css`
- `README.md`
- `PRODUCT.md`
- `docs/implementations/2026-10-calendario.md`
- `docs/status/general.md`
- `docs/status/structure.md`
- `docs/status/architecture.md`
- `docs/status/decisions.md`

Impacto: el registro se puede consultar por mes sin cambiar las reglas de apertura, actividad, cierre ni reapertura.

## 2026-10-31 — Reapertura de expedientes

Un expediente Cerrado puede pasar a En seguimiento con motivo. Se conservan las actividades y cada cierre anterior. La decisión y el resultado de la comprobación quedaron en `README.md`.

Documentos actualizados:

- `bufete/src/domain/expediente.js`
- `bufete/src/pages/PaginaExpedientes.jsx`
- `bufete/src/components/expedientes/DetalleExpediente.jsx`
- `README.md`
- `PRODUCT.md`
- `docs/status/general.md`
- `docs/status/architecture.md`
- `docs/status/decisions.md`

Impacto: el cierre deja de ser terminal. Las demás reglas del recorrido siguen vigentes.

## 2026-10-31 — Recorrido de expedientes

Se implementó la apertura, la consulta, las actividades, los cambios de estado y la conservación en `localStorage`. La pantalla de la plantilla de Vite quedó reemplazada por el registro del bufete.

Documentos actualizados:

- `bufete/src/`
- `README.md`
- `PRODUCT.md`
- `docs/implementations/2026-10-recorrido-expedientes.md`
- `docs/status/general.md`
- `docs/status/structure.md`
- `docs/status/architecture.md`
- `docs/status/decisions.md`

Impacto: la aplicación ya completa el recorrido mínimo y conserva los expedientes en el navegador.

## 2026-10-31 — Propuesta del recorrido de expedientes

Se escribió la propuesta para abrir, consultar, anotar, cambiar de estado y conservar expedientes. Elige las opciones más simples y fija una interfaz clara, con iconos, animación en CSS y paleta pastel verde y azul. No se modificó la aplicación.

Documentos actualizados:

- `docs/implementations/2026-10-recorrido-expedientes.md`
- `PRODUCT.md`
- `docs/status/general.md`
- `docs/status/structure.md`

Impacto: el equipo puede implementar el recorrido sin elegir de nuevo navegación, almacenamiento ni dirección visual. La pantalla visible sigue siendo la plantilla de Vite.

## 2026-10-31 — Ficha funcional en el README

Se sustituyó el texto de la plantilla de Vite por una ficha con el problema, el usuario, las prioridades, los datos, las reglas, los supuestos y la forma de integrar los aportes. No se implementó el recorrido de expedientes.

Documentos actualizados:

- `bufete/README.md`
- `docs/status/general.md`
- `docs/status/decisions.md`

Impacto: el equipo tiene una referencia común antes de programar. La aplicación visible no cambia.

## 2026-10-31 — Creación del proyecto React

Se creó la aplicación `bufete` con Vite y React, y se reservaron las carpetas de interfaz, pantallas, reglas y persistencia. El recorrido de expedientes no está implementado.

Documentos actualizados:

- `docs/implementations/2026-10-creacion-proyecto-react.md`
- `docs/status/general.md`
- `docs/status/structure.md`
- `docs/status/architecture.md`
- `docs/status/decisions.md`

Impacto: el repositorio pasa a contener un cliente web compilable. La pantalla visible es la plantilla de Vite. No hay datos de expedientes ni persistencia.
