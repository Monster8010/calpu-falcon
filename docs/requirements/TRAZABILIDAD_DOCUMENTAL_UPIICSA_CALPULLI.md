# Trazabilidad documental — UPIICSA Calpulli

> Cada afirmación consolidada se vincula con un documento, sección o ruta del repositorio local.

| ID | Elemento | Documento origen | Página/sección | Uso |
|---|---|---|---|---|
| OBJ-G | Diseñar una plataforma móvil llamada UPIICSA CALPULLI que centralice, consulte y gestione información institucional de uso cotidiano, facilite la orientación y mantenga información esencial disponible con conectividad limitada. | Ctrl+Z, Objetivo general | Objetivos | Documento final, sección 4.1 |
| OBJ-E01 | Identificar necesidades de información de estudiantes y usuarios de UPIICSA. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 5 y 6 |
| OBJ-E02 | Analizar los medios actuales de consulta y distribución de información institucional. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 2, 3 y 13 |
| OBJ-E03 | Diseñar una aplicación de consulta para avisos, mapas, directorios, tutorías y ubicaciones. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 7, 12 y 15 |
| OBJ-E04 | Diseñar una aplicación de gestión para publicar, validar y actualizar información. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 7, 12 y 15 |
| OBJ-E05 | Proponer almacenamiento local para consultar información esencial sin conexión. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 9, 11, 12 y 17 |
| OBJ-E06 | Definir requerimientos funcionales y no funcionales. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 7 y 15 |
| OBJ-E07 | Diseñar una arquitectura que separe consulta, administración y actualización. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 12 y 17 |
| OBJ-E08 | Proponer un piloto limitado para evaluar la plataforma. | Ctrl+Z, Objetivos específicos | Objetivos | Conservado como objetivo; ejecución no documentada |
| OBJ-E09 | Identificar limitaciones técnicas, institucionales y operativas. | Ctrl+Z, Objetivos específicos | Objetivos | Secciones 11 a 15 |
| PROB01 | Información académica, administrativa y de orientación distribuida en diversos medios. | Ctrl+Z | Planteamiento del problema | Sección 3 |
| PROB02 | Nomenclatura de salones poco inmediata para edificio, piso o trayecto. | Ctrl+Z | Planteamiento del problema | Sección 3 |
| PROB03 | Conectividad limitada que interrumpe consultas dependientes de Internet. | Ctrl+Z | Planteamiento del problema | Sección 3 |
| NEC01 | Consultar información institucional centralizada | Ctrl+Z: dispersión informativa; Fusionada: consulta fragmentada o presencial | Análisis de necesidades | Sección 6; RF01, RF04, RF05 |
| NEC02 | Localizar edificios y salones | Ctrl+Z: desorientación y nomenclatura; Fusionada: 67/86 y 72/86 | Análisis de necesidades | Sección 6; RF02, RF03 |
| NEC03 | Consultar información con conectividad limitada | Ctrl+Z: continuidad; Fusionada: 62/86 fallas frecuentes o permanentes | Análisis de necesidades | Sección 6; RF09, RF10 |
| NEC04 | Guardar información relevante en el dispositivo | Ctrl+Z: favoritos; código/documentación del MVP | Análisis de necesidades | Sección 6; RF06 |
| NEC05 | Publicar y actualizar información desde una aplicación separada | Ctrl+Z: aplicación de gestión; docs/01_PROJECT_CONTEXT.md | Análisis de necesidades | Sección 6; RF07 |
| NEC06 | Validar información antes de hacerla visible | Ctrl+Z: requerimiento de validación previa | Análisis de necesidades | Sección 6; RF08 |
| NEC07 | Mantener una fuente local compartida entre Consulta y Gestión | docs/02_OFFLINE_INTEROPERABILITY.md | Análisis de necesidades | Sección 6; RF07, RF09 |
| RF01 | Consultar avisos institucionales | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Feed institucional | Requerimientos funcionales | Secciones 7 y 15; Implementado en el MVP |
| RF02 | Buscar edificios o salones | Ctrl+Z, Requerimientos funcionales; Fusionada, tabla De la evidencia a los requerimientos | Requerimientos funcionales | Secciones 7 y 15; Producto objetivo; no implementado |
| RF03 | Mostrar edificio, piso o ruta de un salón | Ctrl+Z, Requerimientos funcionales; instrucción de flujo sustentado en el encargo | Requerimientos funcionales | Secciones 7 y 15; Producto objetivo; no implementado |
| RF04 | Consultar directorio institucional | Ctrl+Z, Requerimientos funcionales; Fusionada, tabla De la evidencia a los requerimientos | Requerimientos funcionales | Secciones 7 y 15; Parcial; filtro de departamentos existente |
| RF05 | Consultar tutorías | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Tutorías | Requerimientos funcionales | Secciones 7 y 15; Implementado en el MVP |
| RF06 | Guardar información en favoritos | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Favoritos | Requerimientos funcionales | Secciones 7 y 15; Implementado en el MVP |
| RF07 | Publicar información institucional | Ctrl+Z, Requerimientos funcionales; documentacion/04_APPS_Y_ROLES.md | Requerimientos funcionales | Secciones 7 y 15; Parcial; gestión demo sin autenticación |
| RF08 | Validar información antes de su publicación | Ctrl+Z, Requerimientos funcionales y no funcionales | Requerimientos funcionales | Secciones 7 y 15; Contradictorio; no implementado como aprobación previa |
| RF09 | Almacenar información localmente | Ctrl+Z, Requerimientos funcionales; docs/02_OFFLINE_INTEROPERABILITY.md | Requerimientos funcionales | Secciones 7 y 15; Implementado con JSON/SAF |
| RF10 | Sincronizar información al recuperar conectividad | Ctrl+Z, Requerimientos funcionales y Desarrollo del backend | Requerimientos funcionales | Secciones 7 y 15; Propuesta futura; no implementado |
| RNF01 | Facilidad de uso | Ctrl+Z, Requerimientos no funcionales | Requerimientos no funcionales | Secciones 7 y 15; Cualitativo; sin métrica documentada |
| RNF02 | Acceso público sin cuenta | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | Requerimientos no funcionales | Secciones 7 y 15; Implementado en el MVP |
| RNF03 | Seguridad por roles y permisos | Ctrl+Z, Requerimientos no funcionales | Requerimientos no funcionales | Secciones 7 y 15; TO-BE; el MVP solo tiene perfiles demo |
| RNF04 | Disponibilidad sin conexión | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | Requerimientos no funcionales | Secciones 7 y 15; Implementado con JSON/SAF para el MVP |
| RNF05 | Información actualizada | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | Requerimientos no funcionales | Secciones 7 y 15; Parcial; relectura local actual, sincronización remota futura |
| RNF06 | Adaptabilidad móvil | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | Requerimientos no funcionales | Secciones 7 y 15; Implementado para el objetivo inmediato |
| RNF07 | Validación previa a publicación | Ctrl+Z, Requerimientos no funcionales | Requerimientos no funcionales | Secciones 7 y 15; Contradictorio con el flujo actual de publicaciones |
| RNF08 | Protección de datos personales | Ctrl+Z, Requerimientos no funcionales | Requerimientos no funcionales | Secciones 7 y 15; Cualitativo; sin controles ni métricas productivas documentadas |
| HER01 | Expo SDK 54 | documentacion/05_ARQUITECTURA_TECNICA.md; apps/*/package.json | Stack confirmado | Sección 9 |
| HER02 | npm workspaces | package.json | workspaces | Sección 9 |
| HER03 | Visual Studio Code | Ctrl+Z, Herramientas de desarrollo | Herramientas | Sección 9; uso documentado, no verificado por código |
| HER04 | Android Storage Access Framework | docs/02_OFFLINE_INTEROPERABILITY.md | Solución del MVP | Secciones 9, 11, 12 y 17 |
| FW01 | React Native 0.81.5 | documentacion/05_ARQUITECTURA_TECNICA.md | Stack confirmado | Sección 9 |
| LIB01 | Expo Router 6 | documentacion/05_ARQUITECTURA_TECNICA.md | Stack confirmado | Sección 9 |
| LEN01 | TypeScript 5.9 | package.json; archivos .ts/.tsx | devDependencies y código | Sección 10 |
| DAT01 | JSON como formato de estado compartido | docs/02_OFFLINE_INTEROPERABILITY.md | Estructura de almacenamiento | Secciones 9, 11, 12 y 17 |
| ARQ01 | Aplicación pública UPIICSA Calpulli | docs/01_PROJECT_CONTEXT.md | Aplicaciones | Sección 12 |
| ARQ02 | Gestión UPIICSA Calpulli | docs/01_PROJECT_CONTEXT.md | Aplicaciones | Sección 12 |
| ARQ03 | Repository | docs/02_OFFLINE_INTEROPERABILITY.md | Repository Pattern | Secciones 12 y 17 |
| ARQ04 | SharedStore | docs/02_OFFLINE_INTEROPERABILITY.md | Estrategia de escritura | Secciones 12 y 17 |
| ARQ05 | SAF y calpulli-state.json | docs/02_OFFLINE_INTEROPERABILITY.md | Solución y estructura | Secciones 12 y 17 |
| ARQ06 | AsyncStorage para favoritos locales | docs/02_OFFLINE_INTEROPERABILITY.md | Favoritos | Secciones 7 y 12 |
| TOBE01 | Backend independiente | Ctrl+Z; Fusionada; Corregida | Desarrollo del backend | Sección 11; no implementado |
| TOBE02 | SQLite | Ctrl+Z; Fusionada; Corregida | Persistencia futura | Secciones 9, 11 y 12; no implementado |
| TOBE03 | PostgreSQL | Ctrl+Z; Fusionada; Corregida | Base central futura | Secciones 9, 11 y 12; no implementado |
