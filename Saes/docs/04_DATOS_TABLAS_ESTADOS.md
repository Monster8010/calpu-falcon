# Datos, tablas, estados y sensibilidad

## 1. Principio de manejo

La extensión mejora la presentación de datos que ya están en el DOM. No necesita API propia ni base de datos externa para el MVP.

```text
SAES autenticado
    ↓
HTML existente
    ↓
Content script local
    ↓
Mejoras visuales y de accesibilidad
```

## 2. Tipos de datos visibles

### Identificación académica

- Identificador o número de boleta.
- Nombre del alumno.
- Plantel.
- Carrera.
- Plan de estudios.
- Promedio.

### Datos personales

- Fotografía.
- CURP.
- RFC.
- Sexo.
- Datos de nacimiento.
- Dirección.
- Escolaridad.
- Padre o tutor.

### Datos académicos

- Materias.
- Claves de materia.
- Semestres o niveles.
- Fechas de evaluación.
- Periodos escolares.
- Forma de evaluación.
- Calificaciones.
- Veces cursada.
- Materias reprobadas.
- Materias no cursadas.
- Materias desfasadas.

### Datos administrativos

- Trámites solicitados.
- Fechas de solicitud.
- Documentos.
- Descripciones.
- Estados de revisión.
- Archivos ZIP.
- Citas.
- Reinscripciones.
- Comprobantes.

## 3. Clasificación de sensibilidad

| Nivel | Ejemplos | Regla de extensión |
|---|---|---|
| Alto | CURP, RFC, foto, domicilio, contraseña | No almacenar, no transmitir, no registrar en logs. |
| Alto | Calificaciones, estado académico, trámites | Procesar solo localmente; no enviar a terceros. |
| Medio | Horario, materias, grupo, tutor | Usar solo para visualización local. |
| Bajo | Etiquetas, colores, estructura, rutas | Puede usarse para detección de pantallas. |

## 4. Tablas académicas

### Kárdex

```text
KardexRow {
  semesterLabel
  subjectCode
  subjectName
  evaluationDate
  schoolPeriod
  evaluationType
  grade
}
```

La extensión debe extraer estos campos solo para filtros y resúmenes locales. No debe asumir que todas las filas tienen los mismos nodos ni que todas las fechas tienen el mismo formato.

### Estado general

```text
AcademicStatusRow {
  category: failed | notTaken | delayed
  level
  subjectCode
  subjectName
  schoolPeriod
  attempts
}
```

Los nombres exactos de `class`, `id` y estructura de tabla deben confirmarse en el DOM real. El árbol de accesibilidad permitió confirmar texto y columnas, no los selectores CSS completos.

### Horario

```text
ScheduleRow {
  group
  subject
  professor
  monday
  tuesday
  wednesday
  thursday
  friday
}
```

## 5. Estados de interfaz necesarios

La extensión debe distinguir al menos estos estados:

1. `loading`: la página está cargando.
2. `ready`: hay datos visibles.
3. `empty`: la página respondió correctamente pero no hay datos.
4. `server-error`: aparece la pantalla de error ASP.NET.
5. `unknown`: la estructura cambió o no pudo ser reconocida.

No se debe tratar una tabla vacía como error automáticamente.

## 6. Formas de evaluación observadas

En Kárdex se observaron abreviaturas como:

- `ORD` — evaluación ordinaria.
- `ETS` — examen a título de suficiencia.
- `REC` — recuperación.
- `EXT` — extraordinario o modalidad externa según contexto institucional.

La extensión debe mostrar la abreviatura original y, si se crea una leyenda, debe marcar las definiciones como ayuda visual, no como dato oficial.

## 7. Acciones con riesgo funcional

Estas acciones no deben automatizarse en el MVP:

- Modificar datos personales.
- Cambiar clave.
- Seleccionar tipo de trámite.
- Enviar solicitud.
- Evaluar profesor o tutor.
- Inscribir ETS.
- Inscribirse o reinscribirse.
- Descargar o abrir documentos sin interacción explícita.
- Cerrar sesión.

La extensión puede mejorar el estilo de estos controles, pero la activación debe seguir dependiendo del usuario.

## 8. Formularios WebForms

La aplicación usa mecanismos compatibles con ASP.NET WebForms. Es razonable esperar campos ocultos y controles de estado como:

- `__VIEWSTATE`.
- `__EVENTVALIDATION`.
- `__EVENTTARGET`.
- `__EVENTARGUMENT`.

Estos nombres no deben eliminarse, clonarse ni cambiarse. Mover visualmente un control debe conservar su nodo original o su relación funcional.

## 9. Persistencia local permitida

Para el MVP solo se recomienda guardar preferencias no sensibles:

```text
saes.ui.theme
saes.ui.sidebarCollapsed
saes.ui.kardexFilters
saes.ui.compactTables
```

No guardar HTML completo, fotografías, calificaciones, tokens, cookies, formularios ni identificadores personales.
