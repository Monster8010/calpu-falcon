# Diagramas — UPIICSA Calpulli

Cada figura conserva una fuente Mermaid `.mmd` y una imagen `.png` renderizada localmente. Los diagramas se mantienen por contenido documental, no como evidencia adicional de implementación.

| Diagrama | Tipo | Estado | Descripción |
|---|---|---|---|
| [`01_arquitectura_general_as_is`](01_arquitectura_general_as_is.mmd) | Arquitectura | AS-IS | Dos apps, repositorios, SharedStore, SAF/JSON y favoritos privados |
| [`02_distribucion_de_capas`](02_distribucion_de_capas.mmd) | Capas | AS-IS | Pantalla → hook/caso de uso → repository → SharedStore → almacenamiento local |
| [`03_secuencia_consulta_localizacion_salon`](03_secuencia_consulta_localizacion_salon.mmd) | Secuencia | TO-BE | Consulta futura de edificio, piso o ruta; no implementada |
| [`04_secuencia_actualizacion_informacion`](04_secuencia_actualizacion_informacion.mmd) | Secuencia | AS-IS | Mutación desde Gestión y relectura desde la app pública |
| [`05_mapa_mental`](05_mapa_mental.mmd) | Mapa mental | Mixto | Problema, MVP actual y producto objetivo claramente separados |

## Imágenes

- [Arquitectura general AS-IS](01_arquitectura_general_as_is.png)
- [Distribución de capas](02_distribucion_de_capas.png)
- [Consulta/localización de salón TO-BE](03_secuencia_consulta_localizacion_salon.png)
- [Actualización de información AS-IS](04_secuencia_actualizacion_informacion.png)
- [Mapa mental AS-IS/TO-BE](05_mapa_mental.png)

Las figuras fueron elaboradas a partir de la documentación local del proyecto. La cartografía institucional no está implementada.
