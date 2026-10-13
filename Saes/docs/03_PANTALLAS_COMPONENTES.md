# Inventario de pantallas y componentes

## 1. Menú principal de alumnos

Ruta: `/alumnos/default.aspx`

### Contenido observado

- Breadcrumb `Inicio » Alumnos`.
- Título `MENÚ PRINCIPAL DE ALUMNOS`.
- Saludo personalizado al alumno autenticado.
- Logotipo grande del portal.
- Aviso sobre materias desfasadas y seguimiento con Gestión Escolar.
- Imagen institucional tipo aviso.
- Banner gráfico informativo de DAE.
- Menú lateral completo.
- Accesos rápidos.
- Pie institucional.

### Comportamiento especial

Existe un enlace que abre una imagen de denuncia mediante JavaScript:

```js
window.open('../Images/sliderDenuncia.jpg', '', '...width=1200,height=400...')
```

La extensión debería sustituir ese popup por un modal accesible o una tarjeta expandible, sin bloquear el enlace original.

### Mejora visual

- Convertir avisos en tarjetas con prioridad.
- Separar alerta académica de aviso institucional.
- Mostrar acciones rápidas: Kárdex, horario, calificaciones y trámites.
- Usar un banner con controles accesibles.
- Mantener mensajes originales como texto fuente.

## 2. Datos personales

Ruta: `/Alumnos/info_alumnos/Datos_Alumno.aspx`

### Componentes

- Breadcrumb con varios niveles.
- Encabezado institucional repetido dentro del contenido.
- Fotografía del alumno.
- Pestañas:
  - Generales.
  - Nacimiento.
  - Dirección.
  - Escolaridad.
  - Padre / Tutor.
- Datos de identificación y escolares.
- Botón `Imprimir Datos`.
- Botón `Modificar`.
- Caja lateral de accesos rápidos.

### Sensibilidad

Esta pantalla puede mostrar fotografía, identificadores escolares, CURP, RFC, sexo, domicilio y datos familiares. La extensión no debe enviar esos valores a ningún servicio externo ni persistirlos sin consentimiento explícito.

### Mejora visual

- Convertir pestañas en tarjetas semánticas.
- Etiquetas y valores alineados en dos columnas.
- Botón de impresión separado de acciones de modificación.
- Ocultar o revelar datos sensibles con control local.
- Añadir aviso de privacidad visible.

## 3. Expediente digital

Ruta: `/Alumnos/info_alumnos/Expediente_Digital.aspx`

### Componentes

Tabla con columnas:

1. Documento.
2. Fecha.
3. Acción.

La pantalla observada mostró un documento y botón `Ver Documento`.

### Mejora visual

- Icono y descripción de tipo de archivo.
- Fecha legible y ordenable.
- Botón grande con texto y no solo icono.
- Estado `sin documentos` cuando la tabla está vacía.

## 4. Pase digital

Ruta: `/Alumnos/Pase_Digital/Pase_Digital.aspx`

### Estado observado

La pantalla indicó que no existe un Pase Digital vigente.

También mostró:

- Breadcrumb.
- Panel con borde negro.
- Botón `<<< Regresar`.
- Pie institucional dentro del panel.

### Mejora visual

- Estado vacío con icono y explicación.
- Botón de regreso con etiqueta clara.
- Cuando exista pase, mostrar tarjeta con vigencia, QR o código, sin alterar el mecanismo original.

## 5. Kárdex

Ruta: `/Alumnos/boleta/kardex.aspx`

### Encabezado

- Identificador escolar.
- Nombre del alumno.
- Carrera.
- Plan de estudios.
- Promedio.
- Aviso de que el documento es informativo y no tiene validez oficial.

### Tablas por semestre

Cada semestre aparece como un bloque separado con encabezado rojo oscuro. Las columnas observadas son:

- Clave.
- Materia.
- Fecha.
- Periodo.
- Forma de evaluación.
- Calificación.

### Comportamiento

- Existen múltiples bloques semestrales.
- El contenido puede tener scroll interno.
- Las filas son densas y el texto de materias largas se parte.
- Hay periodos y formas de evaluación abreviadas como `ORD`, `ETS`, `REC` y `EXT`.

### Mejora prioritaria

- Resumen superior con promedio, aprobadas, reprobadas y pendientes.
- Filtro por semestre.
- Filtro por estado.
- Búsqueda por materia o clave.
- Leyenda de formas de evaluación.
- Color semántico acompañado por texto, nunca solo color.
- Tabla responsive con tarjeta móvil.
- Exportación local opcional a PDF o CSV, sin subir datos.

## 6. Estado general

Ruta: `/Alumnos/boleta/Estado_Alumno.aspx`

### Secciones observadas

1. `MATERIAS REPROBADAS`
2. `MATERIAS NO CURSADAS`
3. `MATERIAS DESFASADAS`

### Columnas observadas

Para reprobadas:

- Semestre / nivel.
- Materia.
- Descripción.
- Periodo escolar.
- Veces cursada.

Para no cursadas:

- Número de periodo.
- Materia.
- Descripción.
- Periodo escolar.
- Veces.

Para desfasadas:

- Semestre / nivel.
- Materia.
- Descripción.
- Periodo escolar.

### Mejora visual

- Tres tarjetas de resumen con conteos.
- Tabla expandible por categoría.
- Explicación sencilla de cada estado.
- Prioridad visual para materias que afectan reinscripción.
- Enlace rápido a Kárdex y reinscripción.

## 7. Horario

Ruta: `/Alumnos/Informacion_semestral/Horario_Alumno.aspx`

### Tabla observada

- Grupo.
- Materia.
- Profesores.
- Lunes.
- Martes.
- Miércoles.
- Jueves.
- Viernes.

### Estado observado

La tabla apareció sin clases registradas y con una fila vacía. El panel tenía título `Horario` y botón `<<< Regresar`.

### Mejora visual

- Vista semanal tipo calendario.
- Vista lista para móvil.
- Colores por materia o grupo.
- Estado vacío explícito.
- Botón para imprimir.
- No modificar la fuente de datos ni los enlaces originales.

## 8. Calificaciones del semestre

Ruta: `/Alumnos/Informacion_semestral/calificaciones_sem.aspx`

### Estado observado

La pantalla mostró encabezado del alumno y un panel sin información visible del periodo actual.

### Mejora visual

- Estado `Aún no hay calificaciones publicadas`.
- Fecha de última actualización si existe en el DOM.
- Tarjetas de promedio y avance.
- Tabla de materias cuando haya datos.
- Diferenciar `sin datos`, `cargando` y `error`.

## 9. Inscripción actual

Ruta: `/Alumnos/Informacion_semestral/default.aspx`

### Componentes

- Título `INFORMACIÓN Y CALIFICACIONES DEL SEMESTRE EN CURSO`.
- Saludo.
- Logotipo.
- Enlace `» más`.

La pantalla funciona como índice o portada del módulo semestral. El enlace `más` debe preservarse y no reemplazarse por un botón que cambie la navegación original.

## 10. Reinscripciones

Ruta: `/Alumnos/Reinscripciones/default.aspx`

### Componentes

- Título `REINSCRIPCIONES`.
- Saludo.
- Imagen institucional.
- Enlace `» más`.
- Submenú con cita, reinscripción y comprobante.

### Mejora visual

- Mostrar una línea de proceso: cita, selección, confirmación y comprobante.
- Separar acciones informativas de acciones que envían datos.
- Mostrar periodos y fechas límite solo si están presentes en la página.

## 11. Solicitud de trámite

Ruta: `/Alumnos/Tramites/Solicitud_Tramite_Alumno.aspx`

### Componentes

- Título: `Elija el tipo de Trámite que desea solicitar`.
- Selector grande con valor inicial `[Seleccionar]`.
- Panel con borde vino.
- Imágenes decorativas de fondo.

### Riesgo de interacción

El selector puede iniciar cambios de contenido o postbacks. La extensión debe aplicar estilos sin seleccionar opciones ni enviar el formulario automáticamente.

## 12. Seguimiento de trámites

Ruta: `/Alumnos/Tramites/Seguimiento_Tramite_Alumno.aspx`

### Tabla observada

- Fecha de solicitud.
- Documento.
- Descripción del documento.
- Descargar ZIP.

### Componentes adicionales

- Iconos de ZIP.
- Paginación `Anterior`, número de página y `Siguiente`.
- Texto de cantidad de registros.
- Sección de trámites en revisión.
- Mensaje cuando no existen documentos pendientes.

### Mejora visual

- Botones de descarga con texto accesible.
- Tabla adaptable a tarjetas.
- Etiquetas de estado.
- Descripción completa visible bajo demanda.
- No iniciar descargas automáticamente.

## 13. Citas

Ruta: `/Alumnos/Citas/Default.aspx`

### Estado observado

Panel con borde vino y mensaje centrado: no existen citas vigentes.

### Mejora visual

- Estado vacío con icono de calendario.
- Explicación de dónde solicitar una cita.
- Enlace directo al módulo de trámites si la página lo permite.

## 14. Tutoría

Ruta: `/Alumnos/Tutores/Default.aspx`

### Componentes

- Título `TUTORIA DEL ALUMNO`.
- Saludo.
- Logotipo.
- Enlace `» más`.
- Submódulos de tutor actual, comentarios y evaluación.

## 15. Evaluación docente

Ruta: `/Alumnos/Evaluacion_Docente/Default.aspx`

### Componentes

- Título `EVALUACION DOCENTE`.
- Saludo.
- Logotipo.
- Enlace `» más`.
- Acceso a evaluación.

La extensión debe tratar la evaluación como una acción de alta sensibilidad funcional: puede representar una respuesta del alumno y no debe autocompletar, seleccionar ni enviar controles.

## 16. ETS

Ruta: `/Alumnos/ETS/default.aspx`

### Resultado observado

La página devolvió una pantalla de error de servidor ASP.NET en vez del contenido institucional.

El error indicaba una `System.Data.ConstraintException` relacionada con restricciones `NON-NULL`, `UNIQUE` o `FOREIGN-KEY`.

La página expuso seguimiento de pila y una ruta interna del servidor. Ver detalles en `05_PROBLEMAS_UX_ACCESIBILIDAD_SEGURIDAD.md`.
