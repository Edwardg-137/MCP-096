# Estructura

```
MCP-096/
├── docs/
│   ├── general_instructions.md
│   ├── changelog.md
│   ├── implementations/
│   └── status/
└── bufete/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
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

`node_modules/` y `dist/` se generan al instalar y al compilar. No forman parte de la organización del código.

## docs

Documentación oficial del proyecto: estado, decisiones, propuestas de implementación y changelog. No contiene código de la aplicación.

## bufete

Proyecto React. `package.json` declara el nombre `bufete`, los scripts `dev`, `build`, `lint` y `preview`, y las dependencias.

## bufete/public

Archivos estáticos servidos tal cual, entre ellos `favicon.svg`.

## bufete/src

Código de la interfaz.

| Ruta | Propósito | Contenido actual | Relación |
| --- | --- | --- | --- |
| `main.jsx` | Punto de entrada. Monta React en `#root`. | Implementado por la plantilla. | Importa `App`. |
| `App.jsx` | Vista raíz. | Pantalla de demostración de Vite. | Usará las páginas cuando existan. |
| `assets/` | Imágenes de la plantilla. | Logos e imagen de la plantilla. | Las usa `App.jsx`. |
| `components/layout/` | Piezas compartidas de interfaz. | Carpeta vacía. | Las consumirán las páginas. |
| `components/expedientes/` | Formularios y listados del expediente. | Carpeta vacía. | Dependerá de `domain` y `services`. |
| `components/actividades/` | Alta e historial de actividades. | Carpeta vacía. | Dependerá de `domain` y `services`. |
| `pages/` | Pantallas del recorrido. | Carpeta vacía. | Compondrán los componentes. |
| `domain/` | Reglas del expediente, estados y validación. | Carpeta vacía. | No debe depender de React. |
| `services/` | Persistencia en el navegador. | Carpeta vacía. | Usará `domain` y será llamada por la interfaz. |
| `utils/` | Helpers sin reglas de negocio, como el formato de fecha y hora. | Carpeta vacía. | Las pueden usar `domain` y la interfaz. |

Las carpetas vacías reservan el lugar de cada responsabilidad. No contienen módulos ni exportan nada.
