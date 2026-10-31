# Arquitectura

## Arquitectura actual

Aplicación de una sola página. Vite sirve el HTML y transforma los módulos de React durante el desarrollo. En producción, `vite build` genera archivos estáticos en `dist/`.

No hay capas de negocio activas. `App` conserva en memoria un contador con `useState`. Ese estado desaparece al recargar.

## Flujo de datos

1. El navegador solicita `index.html`.
2. El módulo `src/main.jsx` crea la raíz de React sobre el elemento `#root`.
3. `App` renderiza la pantalla de la plantilla y actualiza el contador en memoria al pulsar el botón.

No hay props compartidas entre pantallas, almacén global ni lectura o escritura fuera del componente.

## Comunicación entre módulos

`main.jsx` importa `App` y los estilos globales. `App.jsx` importa sus estilos y las imágenes de `assets/`. Las carpetas `components`, `pages`, `domain`, `services` y `utils` no participan en ese flujo.

## Patrones

Componente raíz único, generado por la plantilla. No hay patrón de páginas, repositorio ni máquina de estados.

## Servicios

No hay servicios internos ni externos. No hay API, base de datos, autenticación, sincronización ni procesamiento remoto.

## Almacenamiento

Ninguno. El navegador no guarda expedientes ni el contador de la plantilla. La persistencia en `localStorage` está planificada y todavía no existe.

## Procesamiento

Todo el código de interfaz se ejecuta en el navegador del usuario.
