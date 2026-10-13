# Navegación y mapa de rutas

## 1. Dominio

```text
https://www.saes.upiicsa.ipn.mx
```

La navegación observada usa rutas `.aspx`, carpetas por módulo y diferencias de mayúsculas/minúsculas. El servidor parece tolerar variaciones de casing, pero la extensión debe conservar las rutas observadas para detectar pantallas.

## 2. Navegación pública o superior

| Etiqueta | Ruta observada |
|---|---|
| Home | `/Default.aspx` |
| Inicio | `/default.aspx` |
| Alumnos | `/Alumnos/default.aspx` |
| Académica | `/Academica/default.aspx` |
| Reglamento | `/Reglamento/Default.aspx` |
| Ayuda | `/Ayuda/Ayuda.aspx` |
| Recuperar contraseña | `/SendEmail/RecuperaPass.aspx` |
| Email | `/` o enlace institucional `#` |
| Mapa | `/Mapa.aspx` |

## 3. Datos personales

| Etiqueta | Ruta observada |
|---|---|
| Datos personales — índice | `/Alumnos/info_alumnos/default.aspx` |
| Datos personales | `/Alumnos/info_alumnos/Datos_Alumno.aspx` |
| Datos médicos | `/Alumnos/info_alumnos/DatosAlumnosMedicos.aspx` |
| Datos extracurriculares | `/Alumnos/info_alumnos/Datos_Extracurriculares.aspx` |
| Expediente digital | `/Alumnos/info_alumnos/Expediente_Digital.aspx` |
| Pase digital | `/Alumnos/Pase_Digital/Pase_Digital.aspx` |
| Cambios de carrera | `/Alumnos/CambiosCar/Default.aspx` |
| Red académica ISISA | `/Alumnos/ISISA/Default.aspx` |

## 4. Trámites

| Etiqueta | Ruta observada |
|---|---|
| Trámites — índice | `/Alumnos/Tramites/Default.aspx` |
| Solicitud | `/Alumnos/Tramites/Solicitud_Tramite_Alumno.aspx` |
| Seguimiento | `/Alumnos/Tramites/Seguimiento_Tramite_Alumno.aspx` |
| Citas | `/Alumnos/Citas/Default.aspx` |

## 5. Datos académicos

| Etiqueta | Ruta observada |
|---|---|
| Datos académicos — índice | `/Alumnos/boleta/default.aspx` |
| Kárdex | `/Alumnos/boleta/kardex.aspx` |
| Estado general | `/Alumnos/boleta/Estado_Alumno.aspx` |
| Solicitud de dictamen | `/Alumnos/Dictamenes/Candidato.aspx` |
| Dictamen | `/Alumnos/Dictamenes/respuesta_dictamen.aspx` |

## 6. Información semestral

| Etiqueta | Ruta observada |
|---|---|
| Inscripción actual | `/Alumnos/Informacion_semestral/default.aspx` |
| Horario | `/Alumnos/Informacion_semestral/Horario_Alumno.aspx` |
| Calificaciones | `/Alumnos/Informacion_semestral/calificaciones_sem.aspx` |

## 7. Reinscripciones

| Etiqueta | Ruta observada |
|---|---|
| Reinscripciones — índice | `/Alumnos/Reinscripciones/default.aspx` |
| Cita de reinscripción | `/Alumnos/Reinscripciones/fichas_reinscripcion.aspx` |
| Reinscripción | `/Alumnos/Reinscripciones/reinscribir.aspx` |
| Comprobante | `/Alumnos/Reinscripciones/Horario_Alumno.aspx` |

## 8. ETS

| Etiqueta | Ruta observada |
|---|---|
| ETS — índice | `/Alumnos/ETS/default.aspx` |
| Inscribir ETS | `/Alumnos/ETS/inscripcion_ets.aspx` |
| Calificaciones ETS | `/Alumnos/ETS/calificaciones_ets.aspx` |

## 9. Saberes previamente adquiridos

| Etiqueta | Ruta observada |
|---|---|
| Saberes — índice | `/Alumnos/Saberes/DEFAULT.ASPX` |
| Inscribir saberes | `/Alumnos/Saberes/Inscripcion_Saberes.aspx` |
| Calificaciones | `/Alumnos/Saberes/calificaciones_saberes.aspx` |

## 10. Cursos de recuperación

| Etiqueta | Ruta observada |
|---|---|
| Recuperación — índice | `/Alumnos/Recuperacion/Default.aspx` |
| Inscripción | `/Alumnos/Recuperacion/Inscripcion_Recuperacion.aspx` |
| Calificaciones | `/Alumnos/Recuperacion/calificaciones_recuperacion.aspx` |

## 11. Tutoría

| Etiqueta | Ruta observada |
|---|---|
| Tutores — índice | `/Alumnos/Tutores/Default.aspx` |
| Tutor actual | `/Alumnos/tutores/Datos_Tutor.aspx` |
| Comentarios | `/Alumnos/tutores/comentarios.aspx` |
| Evaluación de tutores | `/Alumnos/tutores/Evaluacion_Tutores.aspx` |

## 12. Evaluación docente

| Etiqueta | Ruta observada |
|---|---|
| Evaluación docente — índice | `/Alumnos/Evaluacion_Docente/Default.aspx` |
| Evaluación | `/Alumnos/Evaluacion_docente/califica_profe.aspx` |

## 13. Cuenta

| Etiqueta | Ruta observada |
|---|---|
| Correo personal | `/Alumnos/CambioCorreoPersonal.aspx` |
| Clave de acceso | `/Alumnos/cambia_clave.aspx` |
| Cerrar sesión | `javascript:__doPostBack('ctl00$leftColumn$LoginStatusSession$ctl00','')` |

## 14. Accesos rápidos académicos

| Etiqueta | Ruta observada |
|---|---|
| Agenda escolar | `/Academica/agenda_escolar.aspx` |
| Horarios de clase | `/Academica/horarios.aspx` |
| Calendario de ETS | `/Academica/calendario_ets.aspx` |

## 15. Anclas de accesibilidad observadas

El árbol de Safari mostró enlaces de omisión similares a:

```text
#ctl00_mainmenu_SkipLink
#ctl00_smPath_SkipLink
#ctl00_subMenu_SkipLink
```

Estas anclas pueden ayudar a localizar navegación principal, breadcrumb y menú lateral, pero se deben confirmar en el DOM real antes de usarlas como selectores únicos.

## 16. Estrategia de detección de ruta

La extensión debe usar `location.pathname`, normalizar mayúsculas y comparar rutas por sufijo:

```js
const path = location.pathname.toLowerCase();

if (path.endsWith('/alumnos/boleta/kardex.aspx')) {
  // Mejoras específicas de Kárdex
}
```

No conviene depender solo del título de la pestaña porque varias pantallas tienen títulos repetidos o genéricos.
