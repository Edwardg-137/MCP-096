# Recorrido de expedientes

Fecha: 2026-10-31

Estado: implementada el 2026-10-31. La reapertura posterior permite volver de Cerrado a En seguimiento. El detalle está en `README.md`, decisión 3. En esta propuesta, la prohibición total de cambiar el estado de un expediente cerrado quedó superada.

## Objetivo

Sustituir la pantalla de la plantilla de Vite por el recorrido mínimo del bufete: abrir, consultar, anotar, cambiar de estado y conservar los datos en el navegador. La interfaz sigue la ficha de `README.md` y la restricción visual ya pedida: limpia, minimalista, con iconos, animaciones de interacción y paleta pastel centrada en verde y azul.

## Problema identificado

`bufete` arranca en la demostración de Vite. Las carpetas de dominio, servicios y pantallas están vacías. Sin esta propuesta, cada área podría elegir un enrutador, un modelo de datos o una forma distinta de guardar el historial.

## Decisiones simples

Cuando había dos caminos, se tomó el más corto que cumple la ficha.

| Tema | Opción elegida | Se descartó |
| --- | --- | --- |
| Navegación | Un estado `seleccionadoId` en la página. `null` muestra el formulario de apertura. | `react-router` u otra ruta. |
| Estado de React | La página guarda la lista, el aviso, la selección y los filtros. | Redux, Zustand o un contexto. |
| Reglas | Funciones puras en `src/domain`, sin React. | Validar dentro de cada formulario. |
| Historial | Un solo arreglo. La actividad es una entrada de ese arreglo. | Un arreglo de actividades y otro de cambios de estado. |
| Persistencia | `localStorage`, clave `bufete.expedientes`. | Backend, IndexedDB o varias claves. |
| Dependencias | Ninguna nueva. Iconos en SVG propio. Animación en CSS. | Librería de iconos o de movimiento. |
| Estilos | Un solo `src/index.css` con variables. | CSS Modules, Tailwind o una librería de componentes. |
| Tipografía | Pila del sistema (`Segoe UI` en Windows). | Una fuente descargada. |
| Identificador | `exp-` más tiempo y un tramo aleatorio, generado en el cliente. | Un contador que haya que reparar si se borra un expediente. |
| Fechas | ISO al guardar. Texto local `es-MX` al mostrar. | Guardar la fecha ya formateada. |
| Categoría | Lista cerrada: vacío, Civil, Familiar o Laboral. | Texto libre. |
| Tipo de actividad | Texto breve opcional. | Un catálogo que la ficha no pide. |
| Construcción visual | Directo en código. Esta pantalla es una herramienta, no una pieza de presentación. | Una imagen de referencia previa al código. Esta preferencia vale solo para esta propuesta y no queda guardada como ajuste del proyecto. |

## Solución propuesta

La página carga los expedientes al montar y los vuelve a escribir cuando la lista cambia. Un indicador interno evita guardar la lista vacía antes de leer el almacenamiento.

Cada expediente:

```text
id, abiertoEn, estado, alias, descripcion, responsable,
categoria, cerradoEn, motivoCierre, historial[]
```

Cada entrada del historial:

```text
id, tipo (apertura | estado | actividad), en, texto
```

La actividad añade, además, `descripcion` y `tipoActividad`. El tipo de actividad puede ir vacío. `texto` es la frase que se lee en la secuencia.

Orden del historial: por fecha, de la más antigua a la más reciente. La apertura es la primera entrada.

### Reglas

- Obligatorio vacío o solo espacios: se rechaza y el mensaje nombra el campo.
- Alta válida: identificador, fecha y estado Abierto. Entrada de apertura en el historial.
- Abierto puede pasar a En seguimiento solo con un botón explícito. Eso agrega una entrada de estado.
- En seguimiento puede cerrarse si existe al menos una entrada de tipo actividad y el motivo, ya recortado, no está vacío. Se guardan fecha, hora y motivo, y una entrada de estado.
- Cerrado: se consulta y no muestra formulario de actividad ni acciones de estado.
- No hay acciones de editar ni de eliminar.
- La búsqueda recorta el texto, no distingue mayúsculas y acepta coincidencia parcial en identificador o alias. El filtro de estado, si no está en Todos, se suma a esa búsqueda.
- Sin coincidencias: un mensaje lo dice. Lista vacía porque aún no hay expedientes: otro mensaje, distinto.

### Mensajes

- Confirmación: expediente abierto (con su identificador), actividad registrada, paso a seguimiento, expediente cerrado.
- Error de campo: alias, descripción del asunto, responsable, descripción de la actividad o motivo de cierre.
- Error de regla: falta una actividad para cerrar; el expediente cerrado no acepta cambios.
- Si `localStorage` falla, se conserva la lista en memoria durante la visita y se explica que no se pudo guardar en el navegador.

## Arquitectura propuesta

Sigue siendo una sola página en el navegador. No hay API ni autenticación.

```text
Página
  → domain (validar, crear, buscar, transicionar)
  → services (leer y escribir la lista)
  → utils (fecha y texto en blanco)
```

La página es la única que llama al servicio. Los componentes reciben datos y notifican acciones; no leen `localStorage` ni repiten las transiciones.

## Interfaz

Modo de uso: la persona llega a hacer una tarea. La pantalla debe reconocerse como un registro de expedientes antes de notarse la paleta. Los controles son los de la web: campo, lista desplegable, botón y botón de volver.

Escena: escritorio de día, luz clara. Fondo claro, no oscuro.

### Dirección

Tesis: un registro tranquilo cuyo centro es el hilo del historial. Se rechaza el panel de administración con tarjetas, sombras fuertes y un acento único sobre gris.

Mundo visual, solo en cuatro rasgos:

- Tipo: pila del sistema, tamaños pocos y jerarquía clara. El alias del expediente es el texto principal del detalle.
- Paleta pastel, con el color haciendo un trabajo:
  - fondo `#f3f7f4`
  - superficie `#ffffff`
  - tinta `#1e3a3a`
  - tinta secundaria `#4d6b6b`
  - verde `#7dbea8` y verde suave `#e5f4ee` para la acción principal y el estado Abierto
  - azul `#7ea6c8` y azul suave `#e7f0f7` para En seguimiento, el hilo y los enlaces de volver
  - línea `#d5e3df`
  - Cerrado: fondo `#e8eef2` y texto `#3e5563`
  - Error, única salida del verde y el azul: fondo `#f8ece8` y texto `#8a4b3c`
- Densidad: cómoda. Una medida de lectura para el formulario y el detalle. Filas de lista compactas, sin tarjetas anidadas.
- Gesto propio: el hilo del historial. Una línea vertical azul une las entradas. El nodo de una actividad es verde; el de una apertura o un cambio de estado es azul. El texto dice el tipo. La entrada recién agregada entra con un leve ascenso y desvanecimiento. Las anteriores permanecen quietas.

El verde y el azul pastel se usan en fondos y pastillas. El texto va en la tinta oscura, también sobre los botones, para que el pastel no quede ilegible.

Iconos de trazo, en un solo componente, a 20 px y con `currentColor`: buscar, agregar, persona, expediente, reloj, flecha de volver, alerta y confirmación. No decoran títulos que ya se entienden.

### Composición

Escritorio, desde unos 900 px:

- Encabezado: «Bufete» y la línea «Expedientes».
- Barra: búsqueda, filtro de estado (Todos, Abierto, En seguimiento, Cerrado) y botón Nuevo.
- Columna izquierda: listado. Cada fila muestra identificador, alias, responsable y pastilla de estado.
- Columna derecha: formulario de apertura si no hay selección; detalle si la hay.

Pantalla estrecha: se ve una zona a la vez. Desde el detalle o el formulario, Volver regresa al listado.

Primera vista con datos: el listado y, a la derecha, el detalle del primer expediente visible, con su hilo. Primera visita sin datos: el formulario de apertura en la zona principal y, en el listado, «Todavía no hay expedientes».

### Movimiento

Solo CSS, de 160 a 200 ms:

- el fondo de botones y filas cambia al pasar el puntero o al enfocar;
- el panel de detalle o de apertura aparece con opacidad y 8 px de desplazamiento;
- la entrada nueva del historial hace el mismo gesto;
- el botón se hunde levemente al pulsarse.

Con `prefers-reduced-motion: reduce`, esas transiciones quedan en cero. Nada depende del movimiento para entenderse.

### Estados de pantalla

- Sin expedientes.
- Lista con resultados.
- Búsqueda o filtro sin resultados.
- Formulario con error de campo, asociado al campo.
- Aviso de confirmación visible hasta la siguiente acción.
- Detalle Abierto, con actividad y paso a seguimiento.
- Detalle En seguimiento, con actividad y cierre.
- Detalle Cerrado, solo lectura, con fecha y motivo.
- Almacenamiento no disponible.

Textos largos y alias largos pasan a la línea siguiente. No se recortan con puntos suspensivos en el detalle.

## Componentes afectados

Nuevos, en las carpetas ya reservadas:

| Archivo | Responsabilidad |
| --- | --- |
| `src/domain/expediente.js` | Crear, validar, buscar y transicionar. |
| `src/services/expedientes.js` | Leer y escribir `localStorage`. |
| `src/utils/texto.js` | Detectar texto vacío. |
| `src/utils/fecha.js` | ISO y formato local. |
| `src/components/layout/Icono.jsx` | Iconos SVG. |
| `src/components/layout/Aviso.jsx` | Confirmación o error general. |
| `src/components/expedientes/FormularioApertura.jsx` | Alta. |
| `src/components/expedientes/ListaExpedientes.jsx` | Filas y vacío. |
| `src/components/expedientes/DetalleExpediente.jsx` | Ficha y acciones de estado. |
| `src/components/actividades/FormularioActividad.jsx` | Alta de actividad. |
| `src/components/actividades/Historial.jsx` | Hilo cronológico. |
| `src/pages/PaginaExpedientes.jsx` | Composición, filtros y persistencia. |

Cambian `src/App.jsx` y `src/index.css`. Salen del recorrido `src/App.css` y las imágenes de la plantilla en `src/assets`. `main.jsx` sigue montando `App`.

## Flujo esperado

1. Al abrir la aplicación se leen los expedientes guardados.
2. La persona completa alias, descripción y responsable. La categoría puede omitirse.
3. Si falta un obligatorio, el formulario nombra el campo y no crea el expediente.
4. Si los datos valen, aparece en el listado como Abierto y queda seleccionado. El aviso confirma el identificador.
5. Recargar muestra el mismo expediente.
6. La búsqueda por identificador o alias, con o sin filtro de estado, reduce el listado o informa que no hay resultados.
7. En Abierto o En seguimiento se puede registrar una actividad. Entra al hilo con su fecha.
8. El botón Pasar a seguimiento cambia el estado y agrega la entrada correspondiente.
9. Cerrar exige una actividad previa y un motivo. Después se ven la fecha y el motivo, y desaparecen las acciones.
10. Un expediente cerrado sigue en el listado y en la búsqueda.

## Riesgos

- Escribir la lista antes de terminar la lectura borraría lo guardado. El plan lo evita con el indicador de carga.
- Usar el pastel como color de texto lo haría ilegible. El texto permanece oscuro.
- Dos arreglos, uno de actividades y otro de historial, pueden desincronizarse. Por eso hay un solo arreglo.
- El movimiento puede estorbar. Se apaga si el sistema lo pide.
- En una ventana privada el almacenamiento puede fallar. La visita sigue en memoria y el aviso lo explica.

## Ventajas

- No añade dependencias.
- Las reglas se leen sin abrir React.
- El listado, el detalle y el historial usan el mismo expediente.
- La paleta y el hilo distinguen estados y tipos de entrada sin apartarse de una pantalla de trabajo.

## Compatibilidad con el sistema actual

La propuesta ocupa las carpetas ya creadas y reemplaza la pantalla de demostración. No cambia `docs/general_instructions.md` ni las reglas de `README.md`.

## Resultado

El recorrido quedó implementado como se describe arriba. Durante la construcción se precisaron tres detalles:

- El error de un campo desaparece cuando la persona corrige ese campo.
- El formulario de cierre se renueva cuando el historial crece, para no dejar visible el aviso de que falta una actividad después de registrarla.
- La nota de cierre separa la fecha, el motivo y la restricción, porque el formato de hora ya termina en punto.

## Plan de implementación

1. Escribir `domain` y comprobar con ejemplos las altas inválidas, la búsqueda, el cierre sin actividad y el bloqueo de un expediente cerrado.
2. Escribir el servicio y el guardado posterior a la carga.
3. Sustituir la pantalla de Vite por la página, los tokens y el listado vacío.
4. Agregar apertura, listado, búsqueda y filtro.
5. Agregar detalle, hilo, actividad y transiciones.
6. Agregar avisos, foco visible y la consulta de `prefers-reduced-motion`.
7. Recorrer en el navegador el flujo completo, en ancho de escritorio y en ancho estrecho, incluida una recarga.
8. Actualizar `README.md` para decir que los datos ya se conservan en `localStorage`, y sincronizar `docs/status` con el código resultante.
