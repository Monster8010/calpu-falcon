# SAES UPIICSA — documentación de estructura web

Fecha de levantamiento: 25 de septiembre de 2026  
Sitio observado: `https://www.saes.upiicsa.ipn.mx`  
Área observada: portal autenticado de alumnos.

## Propósito

Esta documentación reúne la estructura visual, navegación, rutas, pantallas, datos, estados, problemas de experiencia y estrategia técnica necesarios para crear una extensión de navegador que mejore la interfaz de SAES sin reemplazar su backend ni alterar sus operaciones académicas.

## Evidencia utilizada

- Inspección visual de la pestaña abierta en Safari.
- Árbol de accesibilidad de Safari.
- Navegación de solo lectura por pantallas representativas.
- Rutas y etiquetas visibles en la navegación del portal.
- Capturas visuales de encabezado, menú, tablas, formularios y estados vacíos.
- Exploración del proyecto local: no existe todavía una extensión implementada ni un `manifest.json` de SAES.

## Protección de datos

El portal mostró información personal y académica del alumno autenticado. Este levantamiento omite valores concretos como nombre completo, boleta, fotografía, CURP, RFC, calificaciones y otros identificadores. La extensión debe tratar esos datos como información local y sensible.

## Documentos

| Archivo | Contenido |
|---|---|
| `01_ARQUITECTURA_VISUAL.md` | Shell visual, distribución, colores, tipografía y componentes globales. |
| `02_NAVEGACION_RUTAS.md` | Menús, módulos y mapa de URLs observado. |
| `03_PANTALLAS_COMPONENTES.md` | Inventario detallado de pantallas y componentes por módulo. |
| `04_DATOS_TABLAS_ESTADOS.md` | Entidades visibles, tablas, campos, estados y sensibilidad de acciones. |
| `05_PROBLEMAS_UX_ACCESIBILIDAD_SEGURIDAD.md` | Hallazgos priorizados y oportunidades de mejora. |
| `06_ARQUITECTURA_EXTENSION.md` | Propuesta técnica para una WebExtension compatible con Safari. |
| `07_MVP_BACKLOG.md` | Fases, tareas, criterios de aceptación y pruebas. |

## Resumen ejecutivo

SAES es un portal institucional de ancho fijo construido con patrones de ASP.NET WebForms. Su estructura es consistente, pero visualmente antigua:

- navegación lateral extensa;
- tablas pequeñas y poco responsivas;
- muchos paneles vacíos sin explicación;
- estados activos dependientes del color naranja;
- mezcla de páginas completas, tablas internas y paneles con borde vino;
- mensajes de sistema poco amigables;
- al menos un error de servidor que expone información técnica.

La extensión debe actuar como una capa visual progresiva: reorganizar, mejorar legibilidad, agregar estados y accesibilidad, pero conservar rutas, nombres de controles, formularios, sesiones y acciones originales.

## Estado de la sesión analizada

La pestaña fue restaurada al menú principal de alumnos al terminar el levantamiento. No se ejecutaron acciones de modificación, descarga, envío de trámites, cambio de contraseña ni cierre de sesión.
