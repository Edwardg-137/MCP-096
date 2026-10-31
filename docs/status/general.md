# Estado general

## Objetivo

Aplicación web para un bufete jurídico. El recorrido previsto permite abrir expedientes con datos ficticios, consultarlos, registrar actividades y cerrarlos, conservando la información en el navegador.

## Funcionamiento actual

La carpeta `bufete` contiene un proyecto React creado con Vite. Al arrancarlo se muestra la pantalla de inicio de la plantilla: un contador de demostración y enlaces de la plantilla. No hay pantallas de expedientes.

`bufete/README.md` contiene la ficha funcional: problema, usuario, prioridades, datos, reglas, supuestos y responsabilidades del equipo. La conservación prevista es `localStorage` del mismo navegador. Esa persistencia todavía no está implementada.

## Funcionalidades existentes

- Servidor de desarrollo con recarga al guardar.
- Compilación de producción mediante `npm run build`.
- Pantalla inicial de la plantilla de Vite.

## Funcionalidades planificadas

Pendientes de implementación:

- apertura de expedientes con alias, descripción y responsable;
- identificador, fecha y hora de apertura y estado inicial generados por la aplicación;
- listado, detalle, historial y búsqueda;
- registro de actividades;
- paso a seguimiento y cierre con motivo;
- conservación de los datos en el navegador al recargar o volver a abrir la aplicación.

## Flujo general

Hoy el navegador carga `index.html`, que monta React en `#root` y renderiza `App`. No existe otro flujo.

## Tecnologías

- React 19
- Vite 8
- JavaScript con módulos ES

## Dependencias importantes

- `react` y `react-dom`
- `vite` y `@vitejs/plugin-react`, solo para desarrollo y compilación

No hay enrutador, biblioteca de componentes ni cliente de API.

## Limitaciones conocidas

- Los datos no se guardan: al recargar, solo vuelve el estado local del contador de la plantilla.
- No hay validación, expedientes, actividades ni estados.
- La interfaz y los textos de la plantilla están en inglés.
- El proyecto no está publicado; se ejecuta en local.

## Plataformas

Aplicación web de escritorio en el navegador. No hay versión móvil nativa, de escritorio empaquetada ni de servidor.
