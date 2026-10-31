# Decisiones

## 2026-10-31 — Proyecto React con Vite en la carpeta bufete

**Contexto.** El repositorio no tenía aplicación. El alcance de este cambio era crear el proyecto y dejar definida su organización, sin construir el recorrido de expedientes.

**Problema.** Hacía falta un entorno React ejecutable y un nombre de carpeta estable para el cliente.

**Decisión.** Crear la aplicación con `npm create vite@latest bufete -- --template react`, en JavaScript.

**Justificación.** Vite es el generador actual de la plantilla oficial de React y produce scripts de desarrollo y de producción sin dependencias de más. JavaScript evita una capa de tipos antes de existir reglas de negocio. La carpeta se llama `bufete`, igual que el campo `name` de `package.json`.

**Consecuencias.** El código vive en `bufete/` y no en la raíz del repositorio, así que queda separado de `docs/`. La pantalla inicial es la de la plantilla hasta que se sustituya. No se añadió TypeScript, enrutador ni biblioteca de interfaz.

## 2026-10-31 — Separar interfaz, reglas y persistencia en carpetas vacías

**Contexto.** El recorrido previsto mezcla formularios, reglas de estado y conservación de datos en el navegador.

**Problema.** Colocar todo en `App.jsx` mezclaría la interfaz con las reglas y con el almacenamiento.

**Decisión.** Reservar `src/components`, `src/pages`, `src/domain`, `src/services` y `src/utils`. Dejarlas vacías en este cambio.

**Justificación.** La separación deja un sitio concreto para cada responsabilidad antes de escribir la funcionalidad. Crear las carpetas no añade dependencias ni comportamiento.

**Consecuencias.** La estructura ya puede documentarse. Esas carpetas no aportan funciones hasta que un cambio posterior agregue módulos. La persistencia prevista sigue siendo local al navegador; no se decidió ningún backend.

## 2026-10-31 — La ficha del README fija las reglas antes de implementar

**Contexto.** El proyecto ya tiene la estructura de carpetas, pero no el recorrido de expedientes. El equipo pidió dejar por escrito el problema, los datos y la forma de integrar aportes antes de programar.

**Problema.** Sin una referencia común, cada aporte podría inventar campos, transiciones o un modo distinto de guardar los datos.

**Decisión.** Registrar esa referencia en `bufete/README.md`, no en un documento aparte. Las reglas reproducen el alcance mínimo pedido: datos obligatorios, estados, historial, búsqueda y conservación en el navegador.

**Justificación.** El README es el lugar que la propia conservación de datos deberá seguir. Mantener ahí la ficha evita una segunda especificación. Las responsabilidades se asignan por área de la aplicación porque el repositorio no tiene nombres de integrantes.

**Consecuencias.** La implementación posterior debe seguir esa ficha. El README describe el comportamiento previsto; `docs/status/general.md` sigue distinguiendo lo que ya funciona de lo que está pendiente.

## 2026-10-31 — Recorrido en una página, con reglas puras y localStorage

**Contexto.** La propuesta `docs/implementations/2026-10-recorrido-expedientes.md` fue aceptada. Había que construir el recorrido sin añadir piezas que la ficha no pide.

**Problema.** El registro necesita validar, conservar un historial y sobrevivir a la recarga sin un servidor.

**Decisión.** Una sola página de React. Las reglas quedan en funciones puras. El historial es un solo arreglo. La persistencia es `localStorage` con la clave `bufete.expedientes`. No se agregaron dependencias. La interfaz usa la paleta pastel verde y azul, iconos propios y una animación CSS en la entrada nueva del historial.

**Justificación.** Cada alternativa más grande —enrutador, almacén global, dos arreglos de historial, librería de iconos— cumplía lo mismo con más piezas.

**Consecuencias.** Los datos viven en un navegador. La pantalla de Vite ya no forma parte del recorrido. Un cambio de forma del expediente debe empezar en `src/domain/expediente.js`.
