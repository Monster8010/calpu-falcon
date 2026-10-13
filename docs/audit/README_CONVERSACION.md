# README de la conversación — UPIICSA Calpulli

## Propósito

Esta conversación se enfocó en auditar, depurar y consolidar la documentación académica y técnica del proyecto **UPIICSA Calpulli** del equipo **Ctrl + Z**.

El trabajo tuvo cuatro objetivos principales:

1. Distinguir el estado real del MVP (**AS-IS**) de la arquitectura y funciones futuras (**TO-BE**).
2. Construir requerimientos funcionales y no funcionales sin inventar información.
3. Conservar la portada y las fuentes existentes del documento principal.
4. Entregar documentos Word, matrices Markdown y diagramas editables con trazabilidad documental.

## Reglas aplicadas

- No se utilizaron búsquedas externas ni fuentes de Internet.
- No se sobrescribieron los documentos originales.
- No se inventaron actores, prioridades, tecnologías, métricas, excepciones o precondiciones.
- Los datos faltantes se marcaron como **No documentado** o **Pendiente de definir**.
- Las fuentes y el enlace existentes en el documento Ctrl + Z se conservaron sin modificaciones.
- El código y la documentación técnica se usaron para comprobar el estado actual del MVP.
- Backend, API, autenticación productiva, SQLite, PostgreSQL y sincronización remota se separaron del MVP actual y se documentaron como propuestas futuras cuando correspondía.
- No se expusieron nombres de usuario ni respuestas individuales de los cuestionarios.

## Fuentes disponibles y revisadas

| Fuente | Uso |
|---|---|
| `2027_1_DisProy_Ctrl+Z_P1.docx` | Documento académico principal, portada, objetivos, necesidades, fuentes y requerimientos originales. |
| `UPIICSA_Calpulli_Documentacion_Fusionada.docx` | Consolidación previa, corrección estadística y separación AS-IS/TO-BE. |
| `UPIICSA_Calpulli_Documentacion_Corregida.docx` | Auditoría técnica previa, contradicciones, Canvas y alcance del MVP. |
| `Desafio Google.csv.zip` | Cuestionario exploratorio distinto, con 10 registros y 13 columnas. |
| `Calpolli_Upiicsa/` | Código fuente y documentación técnica del MVP. |

### Archivos referenciados pero no disponibles

- `Estudio_de_caso_F3_3CM32.docx`
- `Ctrl+z_ProyectoF1.pptx`
- `Desafio Google.csv (1).zip`

No se atribuyó contenido a estos archivos. En particular, no se reutilizaron requerimientos funcionales del proyecto SAES.

## Estado técnico verificado

El MVP está compuesto por dos aplicaciones móviles:

- **UPIICSA Calpulli:** aplicación pública de consulta.
- **Gestión UPIICSA Calpulli:** aplicación administrativa y de demostración con perfiles simulados.

La arquitectura actual documentada es:

```text
Pantalla
  ↓
Hook o caso de uso
  ↓
Repository
  ↓
SharedStore
  ↓
Android SAF / almacenamiento local
  ↓
calpulli-state.json
```

Tecnologías confirmadas:

- React Native 0.81.5.
- Expo SDK 54.
- TypeScript 5.9.
- Expo Router 6.
- React 19.1.
- npm workspaces.
- Android Storage Access Framework.
- JSON compartido y AsyncStorage para estado privado.

No se encontró un backend independiente, API HTTP, SQLite, PostgreSQL, Python/FastAPI, autenticación productiva ni sincronización mediante Internet en el MVP actual.

## Resultados documentales

### Requerimientos

- Requerimientos funcionales identificados: **10**.
- Requerimientos no funcionales identificados: **8**.
- Requerimientos con prioridad sustentada: **0**.
- Los 10 RF conservan al menos un campo pendiente, principalmente la prioridad y, según el caso, la precondición o las excepciones.

Funciones implementadas o parcialmente implementadas incluyen avisos, tutorías, favoritos, gestión local y persistencia compartida. La búsqueda de salones, el mapa del campus, la validación previa productiva y la sincronización remota permanecen incompletos o futuros.

### Cuestionarios

Se distinguieron dos instrumentos:

1. El cuestionario específico de Calpulli, resumido en los documentos corregidos con **86 respuestas**.
2. El archivo `Desafio Google.csv.zip`, que contiene un cuestionario exploratorio diferente con **10 registros**.

El documento Ctrl + Z todavía indica 84 respuestas. La consolidación utiliza el corte posterior de 86 y conserva la discrepancia en la auditoría. La base CSV específica de esas 86 respuestas no estuvo disponible para recalcular los resultados.

## Contradicciones principales

| Tema | Contradicción o pendiente |
|---|---|
| Tamaño de muestra | 84 respuestas en Ctrl + Z frente a 86 en Fusionada y Corregida. |
| Backend | Node.js aparece como propuesta y Python/FastAPI como otra alternativa. No existe decisión final ni implementación. |
| Persistencia | SQLite y PostgreSQL están propuestos, mientras el MVP usa JSON mediante SAF. |
| Validación | Los requisitos piden validación antes de publicar, pero el MVP permite publicación departamental y moderación posterior. |
| Mapas | El MVP incluye un mapa de stands de feria, no un mapa institucional de edificios y salones. |
| Seguridad | Los perfiles de Gestión son demostrativos y no representan autenticación o autorización productiva. |

## Entregables generados

| Archivo | Propósito |
|---|---|
| [`AUDITORIA_DOCUMENTAL_UPIICSA_CALPULLI.md`](./AUDITORIA_DOCUMENTAL_UPIICSA_CALPULLI.md) | Inventario, estados documentales, contradicciones y faltantes. |
| [`TRAZABILIDAD_DOCUMENTAL_UPIICSA_CALPULLI.md`](../requirements/TRAZABILIDAD_DOCUMENTAL_UPIICSA_CALPULLI.md) | Relación entre objetivos, necesidades, requisitos, tecnologías y fuentes. |
| [`MATRIZ_REQUERIMIENTOS_UPIICSA_CALPULLI.md`](../requirements/MATRIZ_REQUERIMIENTOS_UPIICSA_CALPULLI.md) | Matriz maestra y fichas de RF/RNF. |
| `REQUERIMIENTOS_UPIICSA_CALPULLI.docx` | Catálogo Word conservado localmente fuera del repositorio público por privacidad y control de versiones. |
| `UPIICSA_CALPULLI_DOCUMENTACION_CONSOLIDADA.docx` | Documento consolidado conservado localmente fuera del repositorio público. |
| [`diagramas/`](../../diagramas/) | Fuentes Mermaid editables e imágenes PNG. |

## Diagramas incluidos

1. Arquitectura general AS-IS.
2. Distribución de capas.
3. Secuencia de consulta y localización de salón, marcada como flujo objetivo.
4. Secuencia de actualización de información local.
5. Mapa mental AS-IS/TO-BE.

Cada diagrama tiene una fuente `.mmd` y una imagen `.png`.

## Control de calidad realizado

- Conservación visual de la portada institucional.
- Actualización de índices en Microsoft Word.
- Renderización y revisión página por página.
- Corrección de tablas partidas y páginas residuales.
- Comprobación de ausencia de comentarios y cambios controlados pendientes.
- Verificación de que los originales conservaron sus huellas SHA-256.

## Pendientes para continuar

1. Obtener la base exportada del cuestionario específico de 86 respuestas.
2. Obtener y auditar la presentación `Ctrl+z_ProyectoF1.pptx`.
3. Obtener `Estudio_de_caso_F3_3CM32.docx` si se necesita replicar exactamente su apariencia.
4. Validar institucionalmente cartografía, salones, directorio, vigencias y responsables de publicación.
5. Definir las prioridades de los RF con el equipo y registrar la evidencia de la decisión.
6. Resolver la alternativa tecnológica del backend antes de documentarla como arquitectura aprobada.
7. Definir métricas verificables para los requerimientos no funcionales.

## Nota de continuidad

Para continuar el trabajo, debe preservarse la separación entre:

- lo implementado en el MVP;
- lo documentado pero incompleto;
- lo propuesto para una etapa futura;
- lo pendiente de validación institucional.

Fecha de este README: **12 de octubre de 2026**.
