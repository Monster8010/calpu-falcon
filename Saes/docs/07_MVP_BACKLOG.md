# Backlog del MVP

## Fase 0 — Preparación

### Tareas

- Crear manifest de WebExtension.
- Configurar coincidencia de host para `saes.upiicsa.ipn.mx`.
- Crear content script.
- Añadir tokens visuales.
- Crear modo debug desactivable.
- Confirmar selectores reales en DOM.

### Criterios de aceptación

- La extensión carga solo en SAES.
- No solicita permisos externos.
- No cambia la navegación original.
- Puede desactivarse sin romper la página.

## Fase 1 — Shell y navegación

### Tareas

- Rediseñar encabezado sin cambiar logos institucionales.
- Crear menú lateral colapsable.
- Agrupar visualmente enlaces.
- Mejorar breadcrumbs.
- Añadir estado activo con color, texto y ARIA.
- Crear responsive para móvil.

### Criterios de aceptación

- Todas las rutas originales siguen funcionando.
- El menú se puede usar con teclado.
- El contenido no queda oculto detrás del menú.
- La vista de escritorio conserva el contexto institucional.

## Fase 2 — Dashboard

### Tareas

- Convertir saludo en tarjeta de perfil mínima.
- Separar alertas académicas e institucionales.
- Crear accesos frecuentes.
- Mejorar banner y popup de denuncia.
- Añadir tarjeta de estado vacío cuando no haya avisos.

### Criterios de aceptación

- El alumno identifica sus acciones principales en menos de 5 segundos.
- Los avisos no desplazan innecesariamente el contenido.
- Las imágenes tienen texto alternativo.

## Fase 3 — Kárdex y Estado General

### Tareas

- Crear resumen académico.
- Añadir filtros por semestre y estado.
- Mejorar tablas.
- Añadir vista móvil.
- Añadir leyenda de formas de evaluación.
- Respetar aviso de documento informativo.

### Criterios de aceptación

- No se alteran calificaciones ni materias.
- Los filtros solo afectan la vista local.
- La tabla sigue siendo legible con zoom.
- Se conserva la tabla original como fuente.

## Fase 4 — Horario, calificaciones y estados vacíos

### Tareas

- Crear vista de horario tipo calendario.
- Crear estado vacío estándar.
- Mejorar panel de calificaciones.
- Mejorar pase digital sin vigencia.
- Mejorar citas sin vigencia.

### Criterios de aceptación

- Se distingue `sin datos` de `error`.
- No se generan datos ficticios.
- Los botones de regreso funcionan igual.

## Fase 5 — Trámites y documentos

### Tareas

- Mejorar selector de solicitud.
- Convertir seguimiento en tabla responsive.
- Etiquetar descargas ZIP.
- Mejorar expediente digital.
- Mantener descargas bajo clic explícito.

### Criterios de aceptación

- La extensión no selecciona trámites automáticamente.
- No envía formularios.
- Los documentos siguen abriendo con el mecanismo original.

## Fase 6 — Error de servidor y robustez

### Tareas

- Detectar error ASP.NET.
- Reemplazar pantalla técnica por error amigable.
- Añadir recarga manual.
- Añadir modo fallback para cambios de estructura.
- Medir costo del `MutationObserver`.

### Criterios de aceptación

- La pantalla ETS no expone stack trace en la capa visible.
- El usuario puede recargar.
- La extensión no entra en ciclos de renderizado.

## Fase 7 — Accesibilidad y QA

### Tareas

- Probar teclado.
- Probar lector de pantalla.
- Probar zoom 200%.
- Probar móvil y escritorio.
- Probar tema claro y alto contraste.
- Revisar logs y permisos.

### Criterios de aceptación

- Foco visible en controles.
- Contraste suficiente.
- Tablas con encabezados semánticos.
- Sin datos personales en logs.
- Sin acciones automáticas de riesgo.

## Matriz mínima de pruebas

| Pantalla | Carga | Responsive | Teclado | Estado vacío | No muta datos |
|---|---:|---:|---:|---:|---:|
| Inicio | Sí | Sí | Sí | Sí | Sí |
| Datos personales | Sí | Sí | Sí | No aplica | Sí |
| Kárdex | Sí | Sí | Sí | No aplica | Sí |
| Estado general | Sí | Sí | Sí | Sí | Sí |
| Horario | Sí | Sí | Sí | Sí | Sí |
| Calificaciones | Sí | Sí | Sí | Sí | Sí |
| Seguimiento | Sí | Sí | Sí | Sí | Sí |
| ETS con error | Sí | Sí | Sí | Sí | Sí |

## Primer entregable recomendado

El primer incremento debe incluir únicamente:

1. Manifest.
2. Shell responsive.
3. Menú lateral colapsable.
4. Mejoras de dashboard.
5. Manejo visual del error ETS.

Después se agregan Kárdex, Estado General y Horario.
