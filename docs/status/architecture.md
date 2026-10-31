# Arquitectura

## Arquitectura actual

Aplicación de una sola página en el navegador. Vite sirve el desarrollo y genera los archivos estáticos de producción. No hay servidor de datos ni autenticación.

La página conserva la lista de expedientes en el estado de React. Al montar la lee del navegador. Después de esa lectura, cada cambio de la lista se escribe de nuevo. Un indicador evita guardar una lista vacía antes de terminar la lectura.

## Flujo de datos

1. `src/services/expedientes.js` lee la clave `bufete.expedientes`.
2. `PaginaExpedientes` ordena la lista y elige el expediente más reciente, o muestra el formulario si no hay ninguno.
3. Los formularios entregan los textos a las funciones de `src/domain/expediente.js`.
4. Esas funciones devuelven el expediente nuevo o los errores, sin modificar el anterior.
5. La página sustituye el expediente en la lista y muestra la confirmación o el error.
6. El efecto de guardado escribe la lista completa.

La búsqueda y el filtro no cambian lo guardado: solo reducen lo que se ve.

El calendario lee la misma lista. Calcula la fecha de cada estado en el dominio y no escribe el almacenamiento. Elegir un expediente vuelve al detalle.

## Comunicación entre módulos

`App` monta la página. La página es la única que llama al servicio. Los componentes reciben datos y devuelven acciones. `domain` no importa React. `services` no decide transiciones.

## Patrones

Funciones puras para las reglas. Un solo arreglo `historial` por expediente: la apertura, cada actividad y cada cambio de estado son entradas de ese arreglo. La interfaz no repite las condiciones de cierre.

## Servicios

Servicio interno de lectura y escritura en `localStorage`. No hay servicios externos ni API.

## Almacenamiento

`localStorage`, una clave, un arreglo JSON. Cada expediente guarda identificador, fechas en ISO, estado, alias, descripción, responsable, categoría, la lista de cierres y el historial. La hora visible se formatea en `es-MX` al mostrarla. Un cierre nuevo se agrega a la lista. La reapertura no la borra.

Si la lectura o la escritura fallan, la página lo explica. Una lectura fallida no se sobrescribe con una lista vacía.

## Procesamiento

Todo ocurre en el navegador del usuario.
