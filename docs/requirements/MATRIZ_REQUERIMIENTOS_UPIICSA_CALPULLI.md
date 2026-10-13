# Matriz de requerimientos — UPIICSA Calpulli

## Matriz maestra

| ID | Nombre | Tipo | Actor | Fuente | Precondición sustentada | Excepciones sustentadas | Prioridad sustentada |
|---|---|---|---|---|---|---|---|
| RF01 | Consultar avisos institucionales | Funcional | Usuario de la aplicación pública | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Feed institucional | La aplicación pública dispone de un estado local compartido inicializado. | Si el almacenamiento compartido no está configurado o los datos no están inicializados, la aplicación muestra el estado correspondiente y no genera datos administrativos. | Pendiente de definir. |
| RF02 | Buscar edificios o salones | Funcional | Estudiante o usuario de consulta | Ctrl+Z, Requerimientos funcionales; Fusionada, tabla De la evidencia a los requerimientos | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RF03 | Mostrar edificio, piso o ruta de un salón | Funcional | Estudiante o usuario de consulta | Ctrl+Z, Requerimientos funcionales; instrucción de flujo sustentado en el encargo | El usuario ha consultado una clave de salón y existe información de ubicación disponible. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RF04 | Consultar directorio institucional | Funcional | Usuario de la aplicación pública | Ctrl+Z, Requerimientos funcionales; Fusionada, tabla De la evidencia a los requerimientos | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RF05 | Consultar tutorías | Funcional | Usuario de la aplicación pública | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Tutorías | La aplicación dispone de perfiles u ofertas de tutoría en el estado local compartido. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RF06 | Guardar información en favoritos | Funcional | Usuario de la aplicación pública | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Favoritos | El usuario visualiza una publicación institucional disponible. | La pérdida o reinstalación de la aplicación puede eliminar los favoritos del MVP. | Pendiente de definir. |
| RF07 | Publicar información institucional | Funcional | Personal autorizado (actor conceptual documentado); perfiles demo en el MVP | Ctrl+Z, Requerimientos funcionales; documentacion/04_APPS_Y_ROLES.md | La aplicación de Gestión tiene acceso al almacenamiento compartido; el MVP usa selección de perfil demo, no autenticación productiva. | Si la escritura o validación falla, la acción no se considera guardada y el sistema intenta recuperar la copia de respaldo. | Pendiente de definir. |
| RF08 | Validar información antes de su publicación | Funcional | Personal autorizado | Ctrl+Z, Requerimientos funcionales y no funcionales | Existe información pendiente de validación. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RF09 | Almacenar información localmente | Funcional | Aplicación pública y aplicación de Gestión | Ctrl+Z, Requerimientos funcionales; docs/02_OFFLINE_INTEROPERABILITY.md | El usuario concedió a ambas aplicaciones permiso sobre la misma carpeta mediante Android Storage Access Framework. | Si la URI no es válida, se solicita reconectar la carpeta; si la escritura falla, no se confirma la acción y se intenta recuperar el respaldo. | Pendiente de definir. |
| RF10 | Sincronizar información al recuperar conectividad | Funcional | Aplicación móvil | Ctrl+Z, Requerimientos funcionales y Desarrollo del backend | Existe conectividad y una arquitectura de servidor; el servidor no forma parte del MVP actual. | No se identificaron excepciones documentadas; la resolución de conflictos está pendiente de definir. | Pendiente de definir. |
| RNF01 | Facilidad de uso | No funcional | Sistema / actores relacionados | Ctrl+Z, Requerimientos no funcionales | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RNF02 | Acceso público sin cuenta | No funcional | Sistema / actores relacionados | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RNF03 | Seguridad por roles y permisos | No funcional | Sistema / actores relacionados | Ctrl+Z, Requerimientos no funcionales | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RNF04 | Disponibilidad sin conexión | No funcional | Sistema / actores relacionados | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RNF05 | Información actualizada | No funcional | Sistema / actores relacionados | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RNF06 | Adaptabilidad móvil | No funcional | Sistema / actores relacionados | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RNF07 | Validación previa a publicación | No funcional | Sistema / actores relacionados | Ctrl+Z, Requerimientos no funcionales | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |
| RNF08 | Protección de datos personales | No funcional | Sistema / actores relacionados | Ctrl+Z, Requerimientos no funcionales | No documentada en las fuentes disponibles. | No se identificaron excepciones documentadas. | Pendiente de definir. |

## Tabla de control

| ID | Nombre | Módulo | Fuente documental | Estado |
|---|---|---|---|---|
| RF01 | Consultar avisos institucionales | Inicio / avisos | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Feed institucional | Implementado en el MVP |
| RF02 | Buscar edificios o salones | Mapa / salones | Ctrl+Z, Requerimientos funcionales; Fusionada, tabla De la evidencia a los requerimientos | Producto objetivo; no implementado |
| RF03 | Mostrar edificio, piso o ruta de un salón | Mapa / salones | Ctrl+Z, Requerimientos funcionales; instrucción de flujo sustentado en el encargo | Producto objetivo; no implementado |
| RF04 | Consultar directorio institucional | Directorio | Ctrl+Z, Requerimientos funcionales; Fusionada, tabla De la evidencia a los requerimientos | Parcial; filtro de departamentos existente |
| RF05 | Consultar tutorías | Tutorías | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Tutorías | Implementado en el MVP |
| RF06 | Guardar información en favoritos | Favoritos | Ctrl+Z, Requerimientos funcionales; docs/01_PROJECT_CONTEXT.md, Favoritos | Implementado en el MVP |
| RF07 | Publicar información institucional | Gestión / publicaciones | Ctrl+Z, Requerimientos funcionales; documentacion/04_APPS_Y_ROLES.md | Parcial; gestión demo sin autenticación |
| RF08 | Validar información antes de su publicación | Gestión / validación | Ctrl+Z, Requerimientos funcionales y no funcionales | Contradictorio; no implementado como aprobación previa |
| RF09 | Almacenar información localmente | Persistencia local | Ctrl+Z, Requerimientos funcionales; docs/02_OFFLINE_INTEROPERABILITY.md | Implementado con JSON/SAF |
| RF10 | Sincronizar información al recuperar conectividad | Sincronización | Ctrl+Z, Requerimientos funcionales y Desarrollo del backend | Propuesta futura; no implementado |
| RNF01 | Facilidad de uso | Transversal | Ctrl+Z, Requerimientos no funcionales | Cualitativo; sin métrica documentada |
| RNF02 | Acceso público sin cuenta | Transversal | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | Implementado en el MVP |
| RNF03 | Seguridad por roles y permisos | Transversal | Ctrl+Z, Requerimientos no funcionales | TO-BE; el MVP solo tiene perfiles demo |
| RNF04 | Disponibilidad sin conexión | Transversal | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | Implementado con JSON/SAF para el MVP |
| RNF05 | Información actualizada | Transversal | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | Parcial; relectura local actual, sincronización remota futura |
| RNF06 | Adaptabilidad móvil | Transversal | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | Implementado para el objetivo inmediato |
| RNF07 | Validación previa a publicación | Transversal | Ctrl+Z, Requerimientos no funcionales | Contradictorio con el flujo actual de publicaciones |
| RNF08 | Protección de datos personales | Transversal | Ctrl+Z, Requerimientos no funcionales | Cualitativo; sin controles ni métricas productivas documentadas |

## Relaciones RF–RNF

| RF | RNF relacionados | Sustento |
|---|---|---|
| RF01 | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF05 Información actualizada | Relación limitada al comportamiento y restricciones documentados |
| RF02 | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF06 Adaptabilidad móvil | Relación limitada al comportamiento y restricciones documentados |
| RF03 | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF06 Adaptabilidad móvil | Relación limitada al comportamiento y restricciones documentados |
| RF04 | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF05 Información actualizada | Relación limitada al comportamiento y restricciones documentados |
| RF05 | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF05 Información actualizada | Relación limitada al comportamiento y restricciones documentados |
| RF06 | RNF01 Facilidad de uso; RNF04 Disponibilidad sin conexión | Relación limitada al comportamiento y restricciones documentados |
| RF07 | RNF03 Seguridad por roles y permisos; RNF05 Información actualizada; RNF08 Protección de datos personales | Relación limitada al comportamiento y restricciones documentados |
| RF08 | RNF03 Seguridad por roles y permisos; RNF05 Información actualizada; RNF07 Validación previa a publicación; RNF08 Protección de datos personales | Relación limitada al comportamiento y restricciones documentados |
| RF09 | RNF04 Disponibilidad sin conexión; RNF08 Protección de datos personales | Relación limitada al comportamiento y restricciones documentados |
| RF10 | RNF04 Disponibilidad sin conexión; RNF05 Información actualizada | Relación limitada al comportamiento y restricciones documentados |

## Fichas funcionales

### RF01 — Consultar avisos institucionales

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF01 |
| Nombre del requerimiento | Consultar avisos institucionales |
| Características | Consulta pública y anónima de avisos institucionales; el Inicio centraliza publicaciones de departamentos. |
| Descripción del requerimiento | El sistema debe permitir al usuario consultar avisos institucionales disponibles en la aplicación pública. |
| Precondición | La aplicación pública dispone de un estado local compartido inicializado. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El usuario abre la sección Inicio. |
| 2 | La aplicación relee el estado compartido disponible. |
| 3 | El sistema obtiene las publicaciones institucionales visibles. |
| 4 | La aplicación muestra los avisos al usuario. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | Si el almacenamiento compartido no está configurado o los datos no están inicializados, la aplicación muestra el estado correspondiente y no genera datos administrativos. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF05 Información actualizada |
| Prioridad del requerimiento | Pendiente de definir. |

### RF02 — Buscar edificios o salones

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF02 |
| Nombre del requerimiento | Buscar edificios o salones |
| Características | Búsqueda de una clave de edificio o salón para apoyar la orientación dentro del plantel. |
| Descripción del requerimiento | El sistema debe permitir buscar un edificio o salón específico mediante la información institucional disponible. |
| Precondición | No documentada en las fuentes disponibles. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El usuario proporciona la clave del edificio o salón que desea localizar. |
| 2 | El sistema consulta la información de ubicación disponible. |
| 3 | El sistema identifica la coincidencia correspondiente. |
| 4 | La aplicación presenta el resultado de la búsqueda. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | No se identificaron excepciones documentadas. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF06 Adaptabilidad móvil |
| Prioridad del requerimiento | Pendiente de definir. |

### RF03 — Mostrar edificio, piso o ruta de un salón

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF03 |
| Nombre del requerimiento | Mostrar edificio, piso o ruta de un salón |
| Características | Traducción de la nomenclatura de un salón a una ubicación comprensible. |
| Descripción del requerimiento | Al consultar un salón, el sistema debe mostrar el edificio, el piso o la ruta documentada correspondiente. |
| Precondición | El usuario ha consultado una clave de salón y existe información de ubicación disponible. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El usuario consulta la clave de un salón. |
| 2 | El sistema identifica el edificio asociado. |
| 3 | El sistema identifica el piso asociado. |
| 4 | La aplicación muestra la ubicación o ruta disponible. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | No se identificaron excepciones documentadas. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF06 Adaptabilidad móvil |
| Prioridad del requerimiento | Pendiente de definir. |

### RF04 — Consultar directorio institucional

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF04 |
| Nombre del requerimiento | Consultar directorio institucional |
| Características | Consulta centralizada de áreas o contactos institucionales; el MVP solo contiene un filtro por departamentos y datos de demostración. |
| Descripción del requerimiento | El sistema debe permitir consultar un directorio de áreas y contactos institucionales disponibles. |
| Precondición | No documentada en las fuentes disponibles. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El usuario abre la sección de directorio. |
| 2 | El sistema obtiene la información institucional disponible. |
| 3 | La aplicación muestra las áreas o contactos registrados. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | No se identificaron excepciones documentadas. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF05 Información actualizada |
| Prioridad del requerimiento | Pendiente de definir. |

### RF05 — Consultar tutorías

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF05 |
| Nombre del requerimiento | Consultar tutorías |
| Características | Descubrimiento de tutores, materias, modalidad y contacto externo. |
| Descripción del requerimiento | El sistema debe permitir consultar información de tutorías y los datos de contacto disponibles. |
| Precondición | La aplicación dispone de perfiles u ofertas de tutoría en el estado local compartido. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El usuario abre la sección Tutorías. |
| 2 | La aplicación obtiene los perfiles y ofertas disponibles. |
| 3 | El sistema muestra materias, modalidad y datos de contacto registrados. |
| 4 | El contacto se realiza fuera de Calpulli. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | No se identificaron excepciones documentadas. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF01 Facilidad de uso; RNF02 Acceso público sin cuenta; RNF04 Disponibilidad sin conexión; RNF05 Información actualizada |
| Prioridad del requerimiento | Pendiente de definir. |

### RF06 — Guardar información en favoritos

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF06 |
| Nombre del requerimiento | Guardar información en favoritos |
| Características | Favoritos privados del dispositivo, sin cuenta y separados del estado interoperable. |
| Descripción del requerimiento | El sistema debe permitir guardar publicaciones institucionales como favoritas en el dispositivo. |
| Precondición | El usuario visualiza una publicación institucional disponible. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El usuario selecciona la acción de guardar en una publicación. |
| 2 | La aplicación registra el identificador de la publicación en el almacenamiento privado local. |
| 3 | La publicación queda disponible en la sección Favoritos del dispositivo. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | La pérdida o reinstalación de la aplicación puede eliminar los favoritos del MVP. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF01 Facilidad de uso; RNF04 Disponibilidad sin conexión |
| Prioridad del requerimiento | Pendiente de definir. |

### RF07 — Publicar información institucional

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF07 |
| Nombre del requerimiento | Publicar información institucional |
| Características | La aplicación de Gestión modifica el estado compartido que consume la aplicación pública. |
| Descripción del requerimiento | El sistema debe permitir al personal autorizado publicar información institucional mediante la aplicación de gestión. |
| Precondición | La aplicación de Gestión tiene acceso al almacenamiento compartido; el MVP usa selección de perfil demo, no autenticación productiva. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El usuario selecciona el perfil demo correspondiente en Gestión. |
| 2 | El usuario captura la información de la publicación. |
| 3 | La aplicación envía la mutación al repositorio y al almacenamiento compartido. |
| 4 | SharedStore valida y persiste el nuevo estado. |
| 5 | La aplicación pública relee el estado y muestra la publicación cuando corresponde. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | Si la escritura o validación falla, la acción no se considera guardada y el sistema intenta recuperar la copia de respaldo. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF03 Seguridad por roles y permisos; RNF05 Información actualizada; RNF08 Protección de datos personales |
| Prioridad del requerimiento | Pendiente de definir. |

### RF08 — Validar información antes de su publicación

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF08 |
| Nombre del requerimiento | Validar información antes de su publicación |
| Características | Revisión y validación de información antes de que sea visible para los usuarios. |
| Descripción del requerimiento | El sistema debe permitir revisar y validar la información antes de publicarla para los usuarios. |
| Precondición | Existe información pendiente de validación. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El personal autorizado consulta la información pendiente. |
| 2 | El personal autorizado revisa el contenido. |
| 3 | El personal autorizado valida la información. |
| 4 | El sistema permite que la información validada sea visible para los usuarios. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | No se identificaron excepciones documentadas. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF03 Seguridad por roles y permisos; RNF05 Información actualizada; RNF07 Validación previa a publicación; RNF08 Protección de datos personales |
| Prioridad del requerimiento | Pendiente de definir. |

### RF09 — Almacenar información localmente

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF09 |
| Nombre del requerimiento | Almacenar información localmente |
| Características | Estado consolidado en calpulli-state.json, copia de respaldo y metadatos en una carpeta SAF compartida. |
| Descripción del requerimiento | El sistema debe almacenar localmente la información interoperable necesaria para su consulta sin depender de Internet. |
| Precondición | El usuario concedió a ambas aplicaciones permiso sobre la misma carpeta mediante Android Storage Access Framework. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | La aplicación valida la URI SAF guardada. |
| 2 | La aplicación lee el estado compartido actual. |
| 3 | SharedStore valida el esquema y la revisión. |
| 4 | La aplicación guarda el estado y conserva una copia válida anterior como respaldo. |
| 5 | El sistema vuelve a leer y valida el JSON guardado. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | Si la URI no es válida, se solicita reconectar la carpeta; si la escritura falla, no se confirma la acción y se intenta recuperar el respaldo. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF04 Disponibilidad sin conexión; RNF08 Protección de datos personales |
| Prioridad del requerimiento | Pendiente de definir. |

### RF10 — Sincronizar información al recuperar conectividad

| Campo | Contenido |
|---|---|
| Identificación del requerimiento | RF10 |
| Nombre del requerimiento | Sincronizar información al recuperar conectividad |
| Características | Sincronización de información local con una fuente central al existir conexión; backend y mecanismo de conflictos están pendientes de definición. |
| Descripción del requerimiento | Cuando exista conectividad, el sistema debe sincronizar la información local con la información disponible en el servidor propuesto. |
| Precondición | Existe conectividad y una arquitectura de servidor; el servidor no forma parte del MVP actual. |

**Secuencia normal**

| Paso | Acción |
|---|---|
| 1 | El dispositivo recupera conectividad. |
| 2 | La aplicación inicia el proceso de sincronización documentado. |
| 3 | El sistema obtiene la información actualizada disponible. |
| 4 | La aplicación actualiza la información almacenada localmente. |

**Excepciones**

| Paso | Acción |
|---|---|
| 1 | No se identificaron excepciones documentadas; la resolución de conflictos está pendiente de definir. |

| Campo | Contenido |
|---|---|
| Requerimientos NO funcionales | RNF04 Disponibilidad sin conexión; RNF05 Información actualizada |
| Prioridad del requerimiento | Pendiente de definir. |

## Requerimientos no funcionales

| ID | Nombre | Enunciado | Fuente | Estado |
|---|---|---|---|---|
| RNF01 | Facilidad de uso | La aplicación debe ser fácil de usar para consultar información y realizar las acciones documentadas. | Ctrl+Z, Requerimientos no funcionales | Cualitativo; sin métrica documentada |
| RNF02 | Acceso público sin cuenta | La información pública debe poder consultarse sin crear una cuenta. | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | Implementado en el MVP |
| RNF03 | Seguridad por roles y permisos | La gestión debe restringirse conforme a roles y permisos documentados. | Ctrl+Z, Requerimientos no funcionales | TO-BE; el MVP solo tiene perfiles demo |
| RNF04 | Disponibilidad sin conexión | La información esencial debe permanecer disponible en condiciones de conectividad limitada mediante persistencia local. | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | Implementado con JSON/SAF para el MVP |
| RNF05 | Información actualizada | La información mostrada debe mantenerse actualizada mediante la aplicación de gestión y la relectura del estado compartido. | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | Parcial; relectura local actual, sincronización remota futura |
| RNF06 | Adaptabilidad móvil | La solución debe estar orientada a dispositivos móviles dentro del alcance Android/Expo Go documentado. | Ctrl+Z; docs/01_PROJECT_CONTEXT.md | Implementado para el objetivo inmediato |
| RNF07 | Validación previa a publicación | La información debe revisarse y validarse antes de hacerse visible, conforme al requisito documentado. | Ctrl+Z, Requerimientos no funcionales | Contradictorio con el flujo actual de publicaciones |
| RNF08 | Protección de datos personales | El sistema debe proteger los datos personales cuando existan procesos de identificación o gestión de información. | Ctrl+Z, Requerimientos no funcionales | Cualitativo; sin controles ni métricas productivas documentadas |
