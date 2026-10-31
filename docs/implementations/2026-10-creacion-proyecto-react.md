# Creación del proyecto React

Fecha: 2026-10-31

## Objetivo

Dejar creada la aplicación web en React, con una estructura de carpetas comprensible, sin implementar todavía el recorrido de expedientes.

## Problema identificado

El repositorio solo contenía `docs/general_instructions.md`. No existía aplicación, dependencias ni organización de código sobre la que construir la apertura, consulta, actividades y cierre de expedientes.

## Alcance de este cambio

Incluye:

- sugerir y crear la estructura de carpetas del cliente;
- generar el proyecto React en la carpeta `bufete`.

Queda fuera, y se tratará en cambios posteriores:

- apertura de expedientes;
- consulta, búsqueda y detalle;
- registro de actividades;
- cambios de estado y cierre;
- persistencia en el navegador;
- mensajes de confirmación y de error del recorrido funcional.

## Solución propuesta

Crear el proyecto con Vite y la plantilla oficial de React en JavaScript, en la carpeta `bufete`. Vite entrega un entorno de desarrollo y un build de producción sin configuración adicional.

Después del scaffolding, añadir carpetas vacías que separan interfaz, pantallas, reglas del expediente y persistencia. Esas carpetas no contienen lógica de negocio.

## Arquitectura propuesta

Aplicación de una sola página que se ejecuta en el navegador. En este cambio no hay almacenamiento, API ni reglas de estado. Esas piezas quedan reservadas en carpetas para los cambios siguientes.

## Componentes afectados

- `bufete/`: proyecto nuevo.
- `docs/status/`: documentación del estado real tras el scaffolding.
- `docs/changelog.md`: registro del cambio.

## Estructura de carpetas

```
bufete/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── assets/
    ├── components/
    │   ├── layout/
    │   ├── expedientes/
    │   └── actividades/
    ├── pages/
    ├── domain/
    ├── services/
    └── utils/
```

Responsabilidad prevista de cada carpeta:

| Carpeta | Responsabilidad |
| --- | --- |
| `src/components/layout` | Piezas de interfaz compartidas, como encabezado o avisos. |
| `src/components/expedientes` | Formularios y listados del expediente. |
| `src/components/actividades` | Formulario e historial de actividades. |
| `src/pages` | Pantallas del recorrido: alta, listado y detalle. |
| `src/domain` | Identificador, validación, estados y reglas de cierre. |
| `src/services` | Lectura y escritura en el navegador. |
| `src/utils` | Formato de fecha y hora y helpers sin reglas de negocio. |

## Flujo esperado

1. Instalar dependencias en `bufete`.
2. Arrancar el servidor de desarrollo de Vite.
3. Ver la pantalla inicial de la plantilla. Esa pantalla no gestiona expedientes.

## Riesgos

- Tratar las carpetas vacías como si el recorrido ya existiera. La documentación de estado debe decir que la funcionalidad está pendiente.
- Añadir ahora un enrutador, una biblioteca de componentes o un backend. No hacen falta para crear el proyecto.

## Ventajas

- El código de interfaz, reglas y persistencia puede crecer en sitios distintos.
- La plantilla de Vite se puede comprobar con su script de build.

## Compatibilidad con el sistema actual

No había aplicación previa. `docs/general_instructions.md` se mantiene sin cambios.

## Plan de implementación

1. Generar `bufete` con `npm create vite@latest bufete -- --template react`.
2. Instalar dependencias.
3. Crear las carpetas de `src` descritas arriba.
4. Comprobar que el proyecto compila.
5. Documentar solo lo que quedó creado.

## Resultado

El plan se ejecutó sin cambios de alcance. Vite 8.3.5 generó la plantilla React 19 en JavaScript, con `App.jsx` como pantalla de demostración. Las carpetas de `src` quedaron creadas y vacías. `npm run build` terminó correctamente. No se implementó ninguna función de expedientes.
