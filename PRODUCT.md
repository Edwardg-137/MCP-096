# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Personal del bufete que abre, consulta y actualiza expedientes en un navegador, en la oficina y de día. No es el cliente del despacho ni un visitante público. Trabaja con alias, sin cuenta y sin documentos de identificación.

## Product Purpose

Registro recuperable de asuntos ficticios: quién los pidió, de qué tratan, quién los atiende, qué se hizo y en qué estado están. El éxito es completar el recorrido —abrir, encontrar, anotar, pasar a seguimiento y cerrar— y volver a ver los mismos datos después de recargar.

## Positioning

El historial conserva, en una sola secuencia, la apertura, cada actividad y cada cambio de estado. Un expediente cerrado sigue visible. No admite actividades hasta que se reabra con motivo.

## Operating Context

Una persona y un navegador a la vez. Los datos viven en ese navegador. No hay servidor, inicio de sesión ni varios perfiles. La ficha funcional está en `README.md`.

## Capabilities and Constraints

Confirmado en la ficha e implementado en `bufete`:

- Apertura con alias, descripción y responsable obligatorios. Categoría Civil, Familiar o Laboral opcional.
- Identificador, fecha y hora de apertura y estado inicial Abierto generados por la aplicación.
- Listado con identificador, persona, responsable y estado. Detalle e historial. Búsqueda por identificador o alias. Filtro por estado opcional. Aviso cuando no hay resultados.
- Actividad con descripción obligatoria y fecha automática. Tipo de actividad opcional. Sin archivos adjuntos.
- Transiciones: Abierto a En seguimiento por acción explícita; En seguimiento a Cerrado si hay al menos una actividad y un motivo no vacío; Cerrado a En seguimiento con motivo de reapertura.
- El expediente cerrado se consulta y no admite actividades. Cada cierre se conserva. Un cierre nuevo no sustituye al anterior.
- No se editan ni se eliminan expedientes o actividades.
- Los campos obligatorios vacíos o hechos solo de espacios se rechazan, indicando qué corregir.
- Cada acción confirmada o rechazada con un mensaje comprensible.
- Conservación en `localStorage`, según el README.
- Calendario del mes en curso, con etiquetas por estado y filtro por etiqueta y fecha.

Sin decidir: los nombres de las personas que cubren cada área. La ficha ya asigna las áreas.

## Brand Commitments

Nombre: Bufete. Textos de la interfaz en español.

Restricción visual pedida para la aplicación: interfaz limpia y minimalista, con iconos, animaciones de interacción y paleta pastel centrada en verde y azul.

## Evidence on Hand

La ficha de `README.md` es la referencia funcional. No hay expedientes reales, clientes, logotipos ni fotografías del bufete. El trabajo futuro no debe inventar personas, asuntos ni documentos de identificación presentados como reales.

## Product Principles

- Los datos de la persona son ficticios.
- Cada regla de validación y de estado tiene un solo lugar.
- Un expediente cerrado se puede leer. Mientras permanece cerrado no admite actividades. Puede reabrirse con motivo.
- Toda acción confirma el resultado o nombra lo que hay que corregir.
- Entre dos opciones que cumplen la regla, se usa la más simple.

## Accessibility & Inclusion

La interfaz está en español. El estado del expediente y el tipo de entrada del historial se entienden por el texto, no solo por el color.
