# Estructura

```
MCP-096/
├── README.md
├── PRODUCT.md
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
        ├── index.css
        ├── components/
        │   ├── layout/
        │   ├── expedientes/
        │   ├── actividades/
        │   └── calendario/
        ├── pages/
        ├── domain/
        ├── services/
        └── utils/
```

`node_modules/` y `dist/` se generan al instalar y al compilar. No forman parte de la organización del código.

## README.md

Ficha funcional del recorrido: problema, datos, reglas y forma de integrar aportes. La aplicación la cumple.

## PRODUCT.md

Registro breve del producto usado al definir la interfaz. La dirección visual construida está en la aplicación y en la propuesta de implementación.

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
| `main.jsx` | Punto de entrada. Monta React en `#root`. | Monta `App`. | Importa `App` y `index.css`. |
| `App.jsx` | Vista raíz. | Renderiza la página de expedientes. | Importa `pages/PaginaExpedientes.jsx`. |
| `index.css` | Estilos de toda la pantalla. | Tokens de color, composición y las animaciones del historial y del calendario. | Lo cargan los componentes por clases. |
| `components/layout/` | Avisos e iconos. | `Aviso.jsx`, `Icono.jsx`. | Los usan la página y el detalle. |
| `components/expedientes/` | Alta, listado y detalle. | Formulario, lista, pastilla de estado y detalle. | Llaman a `domain` a través de la página. |
| `components/actividades/` | Alta e historial. | Formulario de actividad e hilo cronológico. | El detalle los compone. |
| `components/calendario/` | Vista mensual. | `CalendarioExpedientes.jsx`. | Lee la lista de la página y no escribe el almacenamiento. |
| `domain/calendario.js` | Citas, rejilla y filtros del mes. | Funciones puras. | Usa `cierresDe` del expediente. |
| `pages/PaginaExpedientes.jsx` | Pantalla del recorrido. | Filtros, selección y persistencia. | Une componentes, `domain` y `services`. |
| `domain/expediente.js` | Reglas del expediente. | Alta, búsqueda, actividad y transiciones. | No depende de React. |
| `services/expedientes.js` | Persistencia. | Lee y escribe `bufete.expedientes`. | Solo lo llama la página. |
| `utils/texto.js` | Texto vacío y recorte. | Dos funciones. | Las usa `domain`. |
| `utils/fecha.js` | Fecha ISO y formato local. | `ahoraIso` y `formatearFecha`. | Las usan `domain` y el detalle. |
